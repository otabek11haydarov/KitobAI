import { chromium } from 'playwright';
import Database from 'better-sqlite3';
import cron from 'node-cron';
import path from 'path';

// Define DB path
const dbPath = path.resolve(process.cwd(), 'market_prices.db');
const db = new Database(dbPath);

// Initialize DB Table
db.exec(`
  CREATE TABLE IF NOT EXISTS book_prices (
    url TEXT PRIMARY KEY,
    title TEXT,
    store TEXT,
    price INTEGER,
    currency TEXT DEFAULT 'UZS',
    image TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const TARGETS = [
  {
    store: 'Asaxiy',
    url: 'https://asaxiy.uz/product/knigi',
    selectors: {
      card: '.product__item',
      title: '.product__item__info-title',
      price: '.product__item-price',
      image: '.product__item__img img',
      link: 'a.product__item__link'
    }
  }
];

async function scrapeStore(target, page) {
  console.log(`[+] Scraping ${target.store}...`);
  try {
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    return await page.$$eval(target.selectors.card, (cards, selectors, storeName) => {
      return cards.map(card => {
        try {
          const titleEl = card.querySelector(selectors.title);
          const priceEl = card.querySelector(selectors.price);
          const imgEl = card.querySelector(selectors.image);
          const linkEl = card.querySelector(selectors.link);

          if (!titleEl || !priceEl) return null;

          const rawPrice = priceEl.textContent || '0';
          const numericPrice = parseInt(rawPrice.replace(/\D/g, ''), 10);
          
          return {
            title: titleEl.textContent?.trim() || 'Unknown',
            price: numericPrice,
             // Ensure absolute URL handling
            url: linkEl ? linkEl.href : '',
            image: imgEl ? imgEl.src : '',
            store: storeName
          };
        } catch (err) {
          return null;
        }
      }).filter(Boolean);
    }, target.selectors, target.store);

  } catch (error) {
    console.error(`[-] Failed fetching ${target.store}:`, error.message);
    return [];
  }
}

async function runAggregator() {
  console.log(`\n[${new Date().toISOString()}] Starting Background Aggregator...`);
  
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let totalUpdated = 0;

    for (const target of TARGETS) {
      const data = await scrapeStore(target, page);
      
      const stmt = db.prepare(`
        INSERT INTO book_prices (url, title, store, price, image, updated_at) 
        VALUES (@url, @title, @store, @price, @image, CURRENT_TIMESTAMP)
        ON CONFLICT(url) DO UPDATE SET 
          price = excluded.price,
          title = excluded.title,
          image = excluded.image,
          updated_at = CURRENT_TIMESTAMP
      `);

      const insertMany = db.transaction((items) => {
        for (const item of items) {
          if (item && item.url) stmt.run(item);
        }
      });

      insertMany(data);
      totalUpdated += data.length;
      console.log(`[+] Saved ${data.length} prices from ${target.store}`);
    }

    console.log(`[${new Date().toISOString()}] Aggregation complete. Total Items: ${totalUpdated}\n`);
  } catch (error) {
    console.error('[-] Fatal error running aggregator:', error);
  } finally {
    if (browser) await browser.close();
  }
}

// Immediately Run the scraper once on startup
runAggregator();

// Schedule to repeat every 30 minutes
console.log('[*] Cron Job Scheduled. Waiting for next cycle...');
cron.schedule('*/30 * * * *', () => {
   runAggregator();
});
