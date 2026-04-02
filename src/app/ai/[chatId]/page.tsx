import { getBookById } from '../../../lib/data';
import AIChatDetailClient from './AIChatDetailClient';

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const resolvedParams = await params;
  
  // In a real app, 'read' or 'planning' could have their own logic. 
  // Here we use the book dataset if it matches a book ID.
  const book = getBookById(resolvedParams.chatId);

  // If we couldn't find a book and it's not a generic pinned chat, fallback.
  // We'll pass the chatId and the book object (if any) forward.
  
  return <AIChatDetailClient chatId={resolvedParams.chatId} book={book} />;
}
