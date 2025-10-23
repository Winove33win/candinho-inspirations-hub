import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Heart, Info, UserPlus } from "lucide-react";

import type { ArtistCardData } from "@/data/homepage";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: ArtistCardData;
  isFollowed: boolean;
  onFollowToggle: (artist: ArtistCardData) => void;
}

const ArtistCard = ({ artist, isFollowed, onFollowToggle }: ArtistCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [blurOverlay, setBlurOverlay] = useState(true);

  useEffect(() => {
    if (imageLoaded) {
      const timeout = window.setTimeout(() => setBlurOverlay(false), 220);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [imageLoaded]);

  const chips = useMemo(() => artist.tags.slice(0, 2), [artist.tags]);

  return (
    <HoverCard openDelay={180} closeDelay={140}>
      <HoverCardTrigger asChild>
        <article
          className={cn(
            "group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-white/5 bg-[rgba(24,4,4,0.72)]",
            "shadow-[var(--shadow-card)] transition-transform transition-soft",
            "hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] focus-within:-translate-y-1 focus-within:shadow-[var(--shadow-card-hover)]",
          )}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={artist.photo}
              alt={`Retrato de ${artist.name}`}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover transition-transform transition-soft-long",
                "group-hover:scale-[1.02]",
                blurOverlay ? "scale-105 blur-sm" : "scale-100 blur-0",
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-[rgba(144,8,11,0.2)]" aria-hidden />}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,0,0,0.82)] via-[rgba(5,0,0,0.24)] to-transparent" />
            {artist.featured && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[rgba(144,8,11,0.32)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink)]">
                <Heart className="h-3 w-3" aria-hidden /> Destaque
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[var(--ink)]">{artist.name}</h3>
                {artist.lastRelease && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[rgba(250,250,252,0.64)]">
                    {artist.lastRelease}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[rgba(250,250,252,0.64)]">{artist.role}</p>
              <p className="line-clamp-2 text-sm text-[rgba(250,250,252,0.72)]">{artist.shortBio}</p>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[rgba(250,250,252,0.65)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-4 bottom-4 flex translate-y-6 items-center gap-2 opacity-0 transition-all transition-soft group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden
          >
            <a
              href={artist.links.profile}
              className="pointer-events-auto inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--ink)] transition hover:border-[rgba(144,8,11,0.48)] hover:bg-[rgba(144,8,11,0.22)]"
            >
              Ver Perfil
            </a>
            <button
              type="button"
              className={cn(
                "pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] transition",
                isFollowed
                  ? "border border-[rgba(144,8,11,0.65)] bg-[rgba(144,8,11,0.25)] text-[var(--ink)]"
                  : "border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] text-[var(--ink)] hover:border-[rgba(144,8,11,0.48)] hover:bg-[rgba(144,8,11,0.22)]",
              )}
              aria-pressed={isFollowed}
              aria-label={isFollowed ? `Deixar de seguir ${artist.name}` : `Seguir ${artist.name}`}
              onClick={() => onFollowToggle(artist)}
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              {isFollowed ? "Seguindo" : "Seguir"}
            </button>
            {artist.links.contact && (
              <a
                href={artist.links.contact}
                className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--ink)] transition hover:border-[rgba(144,8,11,0.48)] hover:bg-[rgba(144,8,11,0.22)]"
              >
                Contato
              </a>
            )}
          </div>
        </article>
      </HoverCardTrigger>
      <HoverCardContent className="glass-panel border border-[rgba(255,255,255,0.12)] bg-[rgba(16,2,2,0.92)] text-[rgba(250,250,252,0.82)]">
        <div className="space-y-3">
          <header className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[rgba(250,250,252,0.52)]">Preview</p>
              <h4 className="text-lg font-semibold text-[var(--ink)]">{artist.name}</h4>
            </div>
            <Info className="h-4 w-4 text-[rgba(250,250,252,0.5)]" aria-hidden />
          </header>
          <p className="text-sm leading-relaxed text-[rgba(250,250,252,0.74)]">{artist.miniBio}</p>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.26em] text-[rgba(250,250,252,0.58)]">
            {artist.categories.map((category) => (
              <span key={category} className="rounded-full bg-[rgba(255,255,255,0.06)] px-2.5 py-1">
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-[rgba(250,250,252,0.64)]">
            {artist.links.videos && (
              <a
                className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.14)] px-3 py-1 transition hover:border-[rgba(144,8,11,0.48)] hover:text-[var(--ink)]"
                href={artist.links.videos}
                target="_blank"
                rel="noreferrer"
              >
                Vídeos <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            )}
            {artist.links.photos && (
              <a
                className="inline-flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.14)] px-3 py-1 transition hover:border-[rgba(144,8,11,0.48)] hover:text-[var(--ink)]"
                href={artist.links.photos}
              >
                Fotos <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ArtistCard;
