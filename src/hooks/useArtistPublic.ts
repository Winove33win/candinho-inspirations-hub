import { useQuery } from "@tanstack/react-query";

export type ArtistPublic = {
  id: string;
  slug: string;
  stageName: string;
  country?: string;
  city?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  stats?: { key: string; value: number | string }[];
  vision?: string;
  history?: string;
  career?: string;
  more?: string;
  socials?: { label: string; url: string }[];
  photos?: { url: string; alt?: string }[];
  videos?: { url: string; provider?: "youtube" | "vimeo" | "file" }[];
};

async function fetchArtistPublic(slug: string): Promise<ArtistPublic> {
  const response = await fetch(`/api/public/artist/${slug}`, {
    headers: {
      "Cache-Control": "no-store",
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar o artista.");
  }

  return (await response.json()) as ArtistPublic;
}

export function useArtistPublic(slug?: string) {
  return useQuery({
    queryKey: ["artist-public", slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("Slug obrigatório");
      }
      return fetchArtistPublic(slug);
    },
    enabled: Boolean(slug),
    staleTime: 0,
    gcTime: 0,
  });
}
