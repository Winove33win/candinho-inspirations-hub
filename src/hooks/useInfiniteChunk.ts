import { useEffect, useMemo, useRef, useState } from "react";

export interface InfiniteChunkOptions<T> {
  items: T[];
  batch?: number;
  start?: number;
  enabled?: boolean;
}

export function useInfiniteChunk<T>({ items, batch = 6, start = 0, enabled = true }: InfiniteChunkOptions<T>) {
  const [end, setEnd] = useState(start + batch);
  const canLoadMore = end < items.length;
  const visible = useMemo(() => items.slice(0, Math.min(end, items.length)), [items, end]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [ioSupported, setIoSupported] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (!("IntersectionObserver" in window)) {
      setIoSupported(false);
      return;
    }
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && canLoadMore && !busy) {
          setBusy(true);
          setTimeout(() => {
            setEnd((prev) => prev + batch);
            setBusy(false);
          }, 250);
        }
      });
    }, { rootMargin: "200px 0px" });

    io.observe(el);
    return () => io.disconnect();
  }, [enabled, canLoadMore, busy, batch]);

  const loadMore = () => {
    if (!canLoadMore || busy) return;
    setBusy(true);
    setTimeout(() => {
      setEnd((prev) => prev + batch);
      setBusy(false);
    }, 150);
  };

  const reset = () => {
    setEnd(start + batch);
    setBusy(false);
  };

  return { visible, canLoadMore, loadMore, reset, sentinelRef, busy, ioSupported } as const;
}
