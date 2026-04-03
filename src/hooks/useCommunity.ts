'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  subscribeCommunityBySlug,
  subscribeCommunityMembership,
  subscribeCommunityPosts,
} from '@/services/community-service';
import type { Community, CommunityMember, CommunityPost } from '@/types/models';

export function useCommunity(slug: string) {
  const { profile } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [membership, setMembership] = useState<CommunityMember | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeCommunityBySlug(
      slug,
      (item) => {
        setCommunity(item);
        setError(null);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [slug]);

  useEffect(() => {
    if (!community) {
      setMembership(null);
      return;
    }

    const unsubscribe = subscribeCommunityPosts(
      community.id,
      (items) => {
        setPosts(items);
        setError(null);
      },
      (nextError) => setError(nextError.message),
    );

    return unsubscribe;
  }, [community]);

  useEffect(() => {
    if (!community || !profile) {
      setMembership(null);
      return;
    }

    const unsubscribe = subscribeCommunityMembership(
      community.id,
      profile.id,
      (item) => setMembership(item),
      (nextError) => setError(nextError.message),
    );

    return unsubscribe;
  }, [community, profile]);

  const announcements = useMemo(
    () => posts.filter((post) => post.type === 'announcement' || post.pinned),
    [posts],
  );

  return {
    community,
    membership,
    posts,
    announcements,
    isLoading,
    error,
  };
}
