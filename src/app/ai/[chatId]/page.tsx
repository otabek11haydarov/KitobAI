import AIChatDetailClient from './AIChatDetailClient';

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const resolvedParams = await params;
  return <AIChatDetailClient chatId={resolvedParams.chatId} />;
}
