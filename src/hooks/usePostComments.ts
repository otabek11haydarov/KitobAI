'use client';

import { useEffect, useState } from 'react';

import { subscribePostComments } from '@/services/community-service';
import type { PostComment } from '@/types/models';

export function usePostComments(postId: string, enabled: boolean) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setComments([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);

    const unsubscribe = subscribePostComments(
      postId,
      (items) => {
        setComments(items);
        setError(null);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [enabled, postId]);

  return { comments, isLoading, error };
}
