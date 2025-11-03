import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import Modal from "./Modal";

export type LightboxItem =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; title?: string };

interface LightboxProps {
  items: LightboxItem[];
  startIndex: number;
  onClose: () => void;
}

export default function Lightbox({ items, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);
  const total = items.length;

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const prev = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);
  const next = useCallback(() => {
    if (total <= 1) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [prev, next]);

  const current = items[total > 0 ? index % total : 0];
  if (!current) return null;
  const caption = useMemo(() => {
    if (current.type === "image") return current.alt ?? "";
    if (current.type === "video") return current.title ?? "";
    return "";
  }, [current]);

  const isFileVideo = (src: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);

  const render = () => {
    if (current.type === "image") {
      return <img className="lb-media" src={current.src} alt={current.alt ?? ""} />;
    }
    if (isFileVideo(current.src)) {
      return (
        <video className="lb-media" controls autoPlay>
          <source src={current.src} />
        </video>
      );
    }
    return (
      <iframe
        className="lb-media"
        src={current.src}
        title={caption || "Vídeo"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartX.current == null) return;
      const endX = e.changedTouches[0]?.clientX ?? null;
      if (endX == null) return;
      const delta = endX - touchStartX.current;
      const threshold = 40;
      if (delta > threshold) prev();
      else if (delta < -threshold) next();
      touchStartX.current = null;
    },
    [next, prev]
  );

  return (
    <Modal open onClose={onClose} ariaLabel="Visualizador de mídia">
      <div className="lb-header">
        <button className="lb-nav" onClick={prev} aria-label="Anterior" disabled={total <= 1}>
          ←
        </button>
        <span className="lb-caption">{caption}</span>
        <button className="lb-nav" onClick={next} aria-label="Próximo" disabled={total <= 1}>
          →
        </button>
      </div>
      <div className="lb-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {render()}
      </div>
    </Modal>
  );
}
