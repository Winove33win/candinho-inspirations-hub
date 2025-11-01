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

async function fetchArtist(slug: string): Promise<ArtistPublic> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    throw new Error("Slug obrigatório");
  }

  const res = await fetch(`/api/public/artist/${encodeURIComponent(normalizedSlug)}`, {
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-store",
    },
    credentials: "include",
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const preview = (await res.text()).slice(0, 200);
    throw new Error(`API não retornou JSON (status ${res.status}). Preview: ${preview}`);
  }

  const data = (await res.json()) as unknown;

  if (!res.ok) {
    const message = (data as { error?: string } | null | undefined)?.error;
    throw new Error(message || `Falha ${res.status}`);
  }

  return data as ArtistPublic;
}

export function useArtistPublic(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery({
    queryKey: ["artist-public", normalizedSlug],
    queryFn: () => fetchArtist(normalizedSlug),
    enabled: normalizedSlug.length > 0,
    staleTime: 0,
    gcTime: 0,
    retry: (count, err: unknown) => {
      const message = String((err as { message?: string } | undefined)?.message || "");
      return !message.includes("não retornou JSON") && count < 2;
    },
  });
}
