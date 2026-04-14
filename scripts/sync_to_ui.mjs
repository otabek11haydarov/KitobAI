import fs from 'fs';
import path from 'path';

const JSON_PATH = path.resolve(process.cwd(), 'asaxiy_full_books.json');
const DATA_TS_PATH = path.resolve(process.cwd(), 'src/lib/data.ts');

async function sync() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error('asaxiy_full_books.json not found. Run scraper first.');
    return;
  }

  const raw = fs.readFileSync(JSON_PATH, 'utf-8');
  let books = JSON.parse(raw);

  // Deduplicate by Title (normalized)
  const seenTitles = new Set();
  const uniqueBooks = [];

  for (const b of books) {
    const normalizedTitle = b.title.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueBooks.push(b);
    }
  }

  // Take up to 250 books for a rich marketplace, ensuring variety
  const sample = uniqueBooks.slice(0, 250);

  const formattedBooks = sample.map((b, i) => {
    let author = 'Noma\'lum';
    let title = b.title;
    
    if (title.includes(':')) {
       [author, title] = title.split(':').map(s => s.trim());
    } else if (title.includes(' - ')) {
       [author, title] = title.split(' - ').map(s => s.trim());
    }

    return {
      id: `asaxiy-${i}`,
      title: title,
      author: author,
      image: b.image_url,
      thumbnails: [b.image_url],
      price: `${b.price.toLocaleString()} UZS`,
      description: `${author} qalamiga mansub "${title}" asari. Ushbu kitob Asaxiy platformasidan saralab olingan.`,
      rating: 4.2 + (Math.random() * 0.7),
      reviewsCount: Math.floor(Math.random() * 120) + 10,
      languageOptions: ["uzbek"],
      bookTypes: ["paper"],
      stock: Math.floor(Math.random() * 25) + 5,
      isTopSeller: i < 15,
      alternativeSellers: [],
      comments: []
    };
  });

  // Read current data.ts to replace booksData
  let content = fs.readFileSync(DATA_TS_PATH, 'utf-8');
  const startMarker = 'export const booksData: Book[] = [';
  const endMarker = '];';
  
  const startIndex = content.indexOf(startMarker);
  const nextEndIndex = content.indexOf(endMarker, startIndex);
  
  if (startIndex !== -1 && nextEndIndex !== -1) {
    const newBooksData = `export const booksData: Book[] = ${JSON.stringify(formattedBooks, null, 2)};`;
    const finalContent = content.substring(0, startIndex) + newBooksData + content.substring(nextEndIndex + endMarker.length);
    fs.writeFileSync(DATA_TS_PATH, finalContent, 'utf-8');
    console.log(`Successfully synced ${formattedBooks.length} UNIQUE books to src/lib/data.ts`);
  } else {
    console.error('Could not find booksData array in src/lib/data.ts');
  }
}

sync();
