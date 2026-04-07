import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import Database from 'better-sqlite3';

// Target URL Configurations
const BASE_URL = 'https://asaxiy.uz/uz/product/knigi';
const SELECTORS = {
  card: '.product__item',
  title: '.product__item__info-title',
  price: '.product__item-price',
  image: '.product__item-img img',
  link: '.product__item > a'
};

// Database Initialization
const dbPath = path.resolve(process.cwd(), 'market_prices.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS book_prices (
    url TEXT PRIMARY KEY,
    title TEXT,
    store TEXT,
    category TEXT,
    price INTEGER,
    currency TEXT DEFAULT 'UZS',
    image TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Delay helper to avoid rate limits
const wait = (ms) => new Promise(res => setTimeout(res, ms));

async function scrapeAsaxiy() {
  console.log(`\n[${new Date().toISOString()}] Initiating Full Asaxiy Scraper...`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    // Using a realistic user-agent to avoid simple blocking
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    let currentPage = 1;
    const allBooksMap = new Map(); // Map prevents URL duplicates instantly
    let emptyCurrentPageCount = 0;

    while (true) {
      const pageUrl = `${BASE_URL}?page=${currentPage}`;
      console.log(`[+] Scraping Page ${currentPage}: ${pageUrl}`);

      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      } catch (err) {
        console.error(`[-] Timeout or error loading page ${currentPage}. Retrying once...`);
        // Retry logic once
        await wait(5000);
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      }

      const products = await page.$$eval(SELECTORS.card, (cards, selectors) => {
        return cards.map(card => {
          try {
            const titleEl = card.querySelector(selectors.title);
            const priceEl = card.querySelector(selectors.price);
            const imgEl = card.querySelector(selectors.image);
            const linkEl = card.querySelector(selectors.link);

            if (!titleEl || !priceEl || !linkEl) return null;

            const rawPrice = priceEl.textContent || '0';
            const priceStr = rawPrice.replace(/\D/g, '');
            const numericPrice = priceStr ? parseInt(priceStr, 10) : 0;

            return {
              title: titleEl.textContent?.trim() || 'Unknown Title',
              price: numericPrice,
              url: linkEl.href || '',
              image_url: imgEl ? imgEl.src || imgEl.getAttribute('data-src') || '' : ''
            };
          } catch (err) {
            return null;
          }
        }).filter(Boolean); // Filter out structural parsing failures
      }, SELECTORS);

      // Filtering phase: Keep only actual books (exclude stationery, notebooks, etc.)
      const filteredProducts = products.filter(product => {
        const blacklist = [
          'тетрадь', 'пропись', 'daftar', 'xatchop', 'bookmark', 'закладка',
          'прописи', 'ручка', 'карандаш', 'qalam', 'ruchka', 'блокнот', 'офис'
        ];
        const lowerTitle = product.title.toLowerCase();
        // Return true if none of the blacklist words are in the title
        return !blacklist.some(word => lowerTitle.includes(word));
      });

      // Post-process to extract category and translate titles
      filteredProducts.forEach(p => {
        // Simple translation for common Russian book terms in titles
        const translationMap = {
          'Книга': 'Kitob',
          'Том': 'Jild',
          'Сборник': 'To\'plam',
          'часть': 'qism',
          'издание': 'nashr',
          'полное': 'to\'liq',
          'собрание': 'to\'plam',
          'сочинений': 'asarlar',
          'Автор': 'Muallif',
          'Серия': 'Seriya'
        };

        let trTitle = p.title;
        Object.entries(translationMap).forEach(([ru, uz]) => {
          const regex = new RegExp(ru, 'gi');
          trTitle = trTitle.replace(regex, uz);
        });
        p.title = trTitle;

        try {
          const urlParts = new URL(p.url).pathname.split('/');
          // Typical asaxiy URL: /product/books/CATEGORY/SLUG or /product/CATEGORY/SLUG
          // We look for parts after 'product' or 'books'
          const catIndex = urlParts.indexOf('books') !== -1 ? urlParts.indexOf('books') + 1 : urlParts.indexOf('product') + 1;
          if (catIndex > 0 && catIndex < urlParts.length - 1) {
            p.category = urlParts[catIndex].replace(/-/g, ' ');
          } else {
            p.category = 'General';
          }
        } catch (e) {
          p.category = 'General';
        }
      });

      if (products.length === 0) {
        // If zero items exist, attempt fallback wait to ensure dom finished rendering async content
        await page.waitForTimeout(2000);
        const retryProducts = await page.$$(SELECTORS.card);
        if (retryProducts.length === 0) {
          emptyCurrentPageCount++;
          if (emptyCurrentPageCount >= 2) {
            console.log(`[*] No products found consecutively on page ${currentPage}. Ending pagination.`);
            break;
          }
        }
      } else {
        emptyCurrentPageCount = 0; // Reset
      }

      let newFound = 0;
      for (const product of filteredProducts) {
        // Avoid inserting duplicate URLs
        if (!allBooksMap.has(product.url) && product.url) {
          allBooksMap.set(product.url, product);
          newFound++;
        }
      }

      console.log(`[✓] Page ${currentPage} found ${filteredProducts.length} books. (${newFound} new uniques)`);

      // Stop condition: If we processed a large page but 0 new unique books were discovered (loops check)
      if (filteredProducts.length > 0 && newFound === 0) {
        console.log(`[*] Pagination limits reached or fully recycled. Ending traversal.`);
        break;
      }

      currentPage++;

      // Incremental Datasets Synchronization (DB + JSON + CSV)
      if (filteredProducts.length > 0) {
        // Stage 1: SQLite Master Database
        const stmt = db.prepare(`
          INSERT INTO book_prices (url, title, store, category, price, image, updated_at) 
          VALUES (@url, @title, 'Asaxiy', @category, @price, @image, CURRENT_TIMESTAMP)
          ON CONFLICT(url) DO UPDATE SET 
            price = excluded.price,
            title = excluded.title,
            category = excluded.category,
            image = excluded.image,
            updated_at = CURRENT_TIMESTAMP
        `);

        db.transaction((items) => {
          for (const item of items) {
            stmt.run({
              url: item.url,
              title: item.title,
              category: item.category,
              price: item.price,
              image: item.image_url
            });
          }
        })(filteredProducts);

        // Stage 2: External Files (JSON & CSV)
        const currentDataset = Array.from(allBooksMap.values());
        
        // JSON Update
        const jsonPath = path.resolve(process.cwd(), 'asaxiy_full_books.json');
        fs.writeFileSync(jsonPath, JSON.stringify(currentDataset, null, 2), 'utf-8');
        
        // CSV Update
        const csvPath = path.resolve(process.cwd(), 'asaxiy_full_books.csv');
        const csvHeader = 'Title,Price,Image_URL,Product_URL\n';
        const csvRows = currentDataset.map(book => {
          const clTgt = book.title.replace(/,|"|\n|\r/g, ' ');
          return `"${clTgt}","${book.price}","${book.image_url}","${book.url}"`;
        }).join('\n');
        fs.writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');

        console.log(`[+] Incremental sync: ${filteredProducts.length} books saved to DB, JSON, and CSV.`);
      }

      // Delay (2-4 seconds randomly) to behave humanly and prevent active IP Blocking
      const randomDelay = Math.floor(Math.random() * 2000) + 2000;
      await wait(randomDelay);
    }

    console.log(`\n[+] Full pagination mapped. Total Unique Extracts: ${allBooksMap.size}`);
    console.log(`[${new Date().toISOString()}] Job finalized successfully.`);

  } catch (error) {
    console.error('[-] Fatal Execution Error:', error);
  } finally {
    if (browser) await browser.close();
  }
}

// Automatically Trigger
scrapeAsaxiy();

// Setup Cron Job dynamically (Every 6 Hours exactly: "0 */6 * * *")
console.log('[*] Asaxiy Master Scraper registered natively to cron. Next job runs safely in 6 hours...');
cron.schedule('0 */6 * * *', () => {
  scrapeAsaxiy();
});
