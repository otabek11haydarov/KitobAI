'use client';

import { useEffect, useMemo, useState } from 'react';

import { listCommunities } from '@/services/community-service';
import type { Community } from '@/types/models';

export function useCommunities(searchTerm: string) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    listCommunities()
      .then((items) => {
        if (!isActive) {
          return;
        }

        setCommunities(items);
        setError(null);
      })
      .catch((nextError) => {
        if (!isActive) {
          return;
        }

        setError(nextError instanceof Error ? nextError.message : 'Hamjamiyatlar yuklanmadi.');
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCommunities = useMemo(() => {
    if (!normalizedSearch) {
      return communities;
    }

    return communities.filter((community) => {
      const haystack = `${community.name} ${community.slug} ${community.description}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [communities, normalizedSearch]);

  return { communities: filteredCommunities, isLoading, error };
}
