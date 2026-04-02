import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "12", page: "1" });
    if (debouncedSearch) params.set("q", debouncedSearch);

    api
      .get<{ data: ArtistCard[] }>(`/api/public/artists?${params}`)
      .then((res) => setArtists(res.data ?? []))
      .catch(() => setArtists([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  return (
    <section id="artistasSmartx" className="site-container space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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

        {/* Search */}
        <div className="relative w-full max-w-xs shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(255,255,255,0.4)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar artista..."
            className="h-10 w-full rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] pl-9 pr-9 text-sm text-white placeholder:text-[rgba(255,255,255,0.35)] focus:border-[var(--brand)] focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.4)] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse space-y-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div className="aspect-square w-full rounded-xl bg-[rgba(255,255,255,0.06)]" />
                <div className="h-4 w-3/4 rounded bg-[rgba(255,255,255,0.06)]" />
                <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.06)]" />
              </div>
            ))
          : artists.length === 0
          ? (
            <div className="col-span-full py-16 text-center text-[rgba(255,255,255,0.4)]">
              {search ? `Nenhum artista encontrado para "${search}".` : "Nenhum artista disponível."}
            </div>
          )
          : artists.map((artist) => {
              const href = `/artistas/${artist.slug ?? artist.id}`;
              return (
                <Link
                  key={artist.id}
                  to={href}
                  className="group flex flex-col rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(18,0,0,0.55)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                >
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

      {/* CTA */}
      {!loading && artists.length > 0 && (
        <div className="flex justify-center">
          <Link
            to="/artistas"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[var(--brand)] hover:bg-[rgba(144,8,11,0.15)] hover:gap-3"
          >
            Ver todos os artistas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
