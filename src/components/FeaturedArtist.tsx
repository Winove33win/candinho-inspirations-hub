import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { spotlightEditorial } from "@/data/homepage";
import { Button } from "@/components/ui/button";

const FeaturedArtist = () => {
  const { artist } = spotlightEditorial;

  return (
    <section id="artistSpotlight" className="mt-24 rounded-[32px] border border-[rgba(255,255,255,0.12)] bg-[rgba(12,0,0,0.72)] p-8 shadow-[0_32px_90px_rgba(0,0,0,0.55)] md:p-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center">
        <div className="relative overflow-hidden rounded-[28px]">
          <img
            src={artist.heroPhoto ?? artist.photo}
            alt={`Retrato de ${artist.name}`}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,0,0,0.92)] via-transparent to-transparent" aria-hidden />
          <div className="absolute bottom-6 left-6 space-y-1 text-[rgba(250,250,252,0.85)]">
            <span className="inline-flex items-center rounded-full bg-[rgba(144,8,11,0.35)] px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
              Artista em foco
            </span>
            <h3 className="text-3xl font-bold">{artist.name}</h3>
            <p className="text-sm uppercase tracking-[0.24em] text-[rgba(250,250,252,0.68)]">{artist.role}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-[rgba(250,250,252,0.55)]">{spotlightEditorial.subtitle}</p>
            <h2 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">{spotlightEditorial.title}</h2>
            <p className="text-base leading-relaxed text-[rgba(250,250,252,0.75)]">{spotlightEditorial.narrative}</p>
          </div>

          <blockquote className="glass-panel relative overflow-hidden rounded-3xl border border-[rgba(144,8,11,0.35)] p-6 text-base italic leading-relaxed text-[rgba(250,250,252,0.8)]">
            <span className="absolute left-6 top-4 text-5xl text-[rgba(144,8,11,0.35)]" aria-hidden>“</span>
            <p className="relative z-10">{spotlightEditorial.callout}</p>
            <footer className="mt-4 text-xs uppercase tracking-[0.32em] text-[rgba(250,250,252,0.6)]">
              {spotlightEditorial.quoteAuthor}
            </footer>
          </blockquote>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-[rgba(250,250,252,0.58)]">
            {artist.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1">
                {tag}
              </span>
            ))}
          </div>

          <Button
            asChild
            className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-[var(--brand)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.34em] text-[var(--ink)] hover:bg-[rgba(144,8,11,0.9)]"
          >
            <Link to={spotlightEditorial.ctaHref}>
              {spotlightEditorial.ctaLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtist;
