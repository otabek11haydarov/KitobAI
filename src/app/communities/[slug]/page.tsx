import CommunityDetailClient from './CommunityDetailClient';

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CommunityDetailClient slug={slug} />;
}
