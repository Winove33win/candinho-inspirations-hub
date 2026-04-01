import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/apiClient";

interface ArtistCard {
  id: string;
  slug: string | null;
  stageName: string | null;
  country: string | null;
  city: string | null;
  avatarUrl: string | null;
  impactPhrase: string | null;
}

export default function LiveArtistsSection() {
  const [artists, setArtists] = useState<ArtistCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: ArtistCard[] }>("/api/public/artists?limit=8&page=1")
      .then((res) => setArtists(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && artists.length === 0) return null;

  return (
    <section id="artistasSmartx" className="site-container space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(250,250,252,0.75)]">
            Artistas SMARTx
          </span>
          <h2 className="text-3xl font-['League_Spartan'] font-bold text-white md:text-4xl">
            Conheça nossa rede de artistas
          </h2>
          <p className="max-w-2xl text-sm text-[rgba(250,250,252,0.7)] md:text-base">
            Músicos, performers e criadores que integram o ecossistema SMARTx.
          </p>
        </div>
        <Link
          to="/artistas"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--brand)] transition-all hover:gap-3"
        >
          Ver todos os artistas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse space-y-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div className="aspect-square w-full rounded-xl bg-[rgba(255,255,255,0.06)]" />
                <div className="h-4 w-3/4 rounded bg-[rgba(255,255,255,0.06)]" />
                <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.06)]" />
              </div>
            ))
          : artists.map((artist) => {
              const href = `/artistas/${artist.slug ?? artist.id}`;
              return (
                <Link
                  key={artist.id}
                  to={href}
                  className="group flex flex-col rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(18,0,0,0.55)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                >
                  {/* Avatar */}
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-[rgba(255,255,255,0.05)]">
                    {artist.avatarUrl ? (
                      <img
                        src={artist.avatarUrl}
                        alt={artist.stageName ?? "Artista"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[rgba(144,8,11,0.3)] to-[rgba(255,255,255,0.03)]">
                        <span className="text-4xl font-bold text-[var(--brand)] opacity-60">
                          {(artist.stageName ?? "?")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-white line-clamp-1 md:text-base">
                    {artist.stageName ?? "Artista SMARTx"}
                  </h3>

                  {artist.impactPhrase && (
                    <p className="mt-1 flex-1 text-xs text-[rgba(250,250,252,0.6)] line-clamp-2">
                      {artist.impactPhrase}
                    </p>
                  )}

                  {(artist.city || artist.country) && (
                    <p className="mt-2 text-xs uppercase tracking-wide text-[rgba(250,250,252,0.4)]">
                      {[artist.city, artist.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </Link>
              );
            })}
      </div>
    </section>
  );
}
