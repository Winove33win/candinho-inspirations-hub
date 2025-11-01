import { useState } from "react";

interface PhotoItem {
  url: string;
  alt?: string;
}

interface PhotosGalleryProps {
  photos?: PhotoItem[];
}

export function PhotosGallery({ photos }: PhotosGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--divider)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--text-3)]">
        Nenhuma foto disponível no momento.
      </div>
    );
  }

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={`${photo.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] shadow-[var(--shadow-1)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            aria-label={`Abrir foto ${index + 1}`}
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.alt ?? `Foto ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-48 w-full bg-gradient-to-br from-[rgba(176,16,22,0.45)] via-[rgba(32,18,21,0.85)] to-[rgba(15,10,10,1)]"
              />
            )}
          </button>
        ))}
      </div>

      {activePhoto && (
        <dialog
          open
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/70 p-4"
          aria-modal="true"
          aria-label="Visualizar foto em tela cheia"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="max-h-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--elev-border)] bg-[var(--surface)] shadow-[var(--shadow-1)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              >
                Fechar
              </button>
              <img
                src={activePhoto.url}
                alt={activePhoto.alt ?? "Foto ampliada"}
                className="max-h-[80vh] w-full object-contain"
                loading="lazy"
                decoding="async"
              />
              {activePhoto.alt && (
                <p className="px-6 pb-6 pt-4 text-center text-sm text-[var(--text-3)]">{activePhoto.alt}</p>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
