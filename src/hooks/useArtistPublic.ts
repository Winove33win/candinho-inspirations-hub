import { useQuery } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/apiClient';
import type { ArtistPublic } from '@/types/api';

export type { ArtistPublic };
export type { ProjectPublic as ArtistProjectPublic, EventPublic as ArtistEventPublic } from '@/types/api';

async function fetchArtist(slug: string): Promise<ArtistPublic> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) throw new Error('Slug obrigatório');

  try {
    return await api.get<ArtistPublic>(`/api/public/artists/${encodeURIComponent(normalizedSlug)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      const notFound = new Error('artist_not_found') as Error & { status?: number };
      notFound.status = 404;
      throw notFound;
    }
    throw err;
  }
}

export function useArtistPublic(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery({
    queryKey: ['artist-public', normalizedSlug],
    queryFn:  () => fetchArtist(normalizedSlug),
    enabled:  normalizedSlug.length > 0,
    staleTime: 0,
    gcTime:    0,
    retry: (count, err: unknown) => {
      const status = (err as { status?: number })?.status;
      if (status === 404) return false;
      return count < 2;
    },
  });
}
