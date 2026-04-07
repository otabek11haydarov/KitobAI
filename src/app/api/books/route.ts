import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Disable Next.js routing cache so prices are legitimately real-time
export const revalidate = 0;

export async function GET() {
  try {
    const dbPath = path.resolve(process.cwd(), 'market_prices.db');
    const db = new Database(dbPath, { readonly: true });

    // SQLite guarantees fastest sorting locally via SQL ORDER BY
    const books = db.prepare(`
      SELECT * FROM book_prices 
      ORDER BY price ASC
    `).all();

    db.close();

    return NextResponse.json({ 
      success: true, 
      count: books.length, 
      data: books 
    });

  } catch (error) {
    console.error("[Database Error] fetching book prices:", error);
    
    // Fallback if scraper hasn't run yet or DB is missing
    return NextResponse.json(
      { success: false, message: "Database synchronization failed. Ensure scraper is running.", data: [] }, 
      { status: 200 }
    );
  }
}
