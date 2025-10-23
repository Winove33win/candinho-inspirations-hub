import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "smartx-followed-artists";

export const useFollowedArtists = () => {
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed: string[] = JSON.parse(stored);
      setFollowedIds(new Set(parsed));
    } catch (error) {
      console.error("Erro ao carregar artistas seguidos", error);
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
  }, []);

  const toggleFollow = useCallback((artistId: string) => {
    setFollowedIds((current) => {
      const next = new Set(current);
      if (next.has(artistId)) {
        next.delete(artistId);
      } else {
        next.add(artistId);
      }
      persist(next);
      return next;
    });
  }, [persist]);

  const isFollowed = useCallback(
    (artistId: string) => {
      return followedIds.has(artistId);
    },
    [followedIds],
  );

  return {
    followedIds,
    toggleFollow,
    isFollowed,
  };
};
