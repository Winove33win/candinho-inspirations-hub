import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/apiClient";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface ArtistCard {
  id: string;
  slug: string | null;
  stageName: string | null;
  country: string | null;
  city: string | null;
  avatarUrl: string | null;
  impactPhrase: string | null;
  category: string | null;
}

interface ArtistsResponse {
  data: ArtistCard[];
  total: number;
  pages: number;
}

// Fetch all pages
async function fetchAllArtists(): Promise<ArtistCard[]> {
  const first = await api.get<ArtistsResponse>("/api/public/artists?limit=100&page=1");
  const items = first.data ?? [];
  if (first.pages <= 1) return items;
  const rest = await Promise.all(
    Array.from({ length: first.pages - 1 }, (_, i) =>
      api.get<ArtistsResponse>(`/api/public/artists?limit=100&page=${i + 2}`)
        .then(r => r.data ?? [])
    )
  );
  return [...items, ...rest.flat()];
}

// ── Single carousel section ──────────────────────────────────────
function CategoryCarousel({
  title,
  artists,
}: {
  title: string;
  artists: ArtistCard[];
}) {
  const autoplay = useRef(Autoplay({ delay: 3200, stopOnInteraction: true, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [autoplay.current]
  );
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCurrent(emblaApi.selectedScrollSnap());
      setTotal(emblaApi.scrollSnapList().length);
    };
    update();
    emblaApi.on("select", update);
    return () => { emblaApi.off("select", update); };
  }, [emblaApi]);

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="block h-0.5 w-10 bg-[var(--brand)]" />
          <h2 className="text-xl font-['League_Spartan'] font-bold text-white md:text-2xl">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Dots */}
          {total > 1 && (
            <div className="hidden items-center gap-1.5 sm:flex">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-5 bg-[var(--brand)]"
                      : "w-1.5 bg-[rgba(255,255,255,0.2)]"
                  }`}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          )}
          {/* Arrows */}
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white transition hover:border-[var(--brand)] hover:bg-[rgba(144,8,11,0.2)]"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] text-white transition hover:border-[var(--brand)] hover:bg-[rgba(144,8,11,0.2)]"
            aria-label="Próximo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {artists.map((artist) => {
            const href = `/artistas/${artist.slug ?? artist.id}`;
            return (
              <div
                key={artist.id}
                className="min-w-0 shrink-0 basis-[72%] sm:basis-[46%] md:basis-[32%] lg:basis-[23%] xl:basis-[18%]"
              >
                <Link
                  to={href}
                  className="group flex flex-col rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(18,0,0,0.55)] p-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
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
                        <span className="text-3xl font-bold text-[var(--brand)] opacity-60">
                          {(artist.stageName ?? "?")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-white line-clamp-1">
                    {artist.stageName ?? "Artista SMARTx"}
                  </h3>
                  {artist.impactPhrase && (
                    <p className="mt-1 text-xs text-[rgba(250,250,252,0.55)] line-clamp-2">
                      {artist.impactPhrase}
                    </p>
                  )}
                  {(artist.city || artist.country) && (
                    <p className="mt-2 text-[10px] uppercase tracking-wide text-[rgba(250,250,252,0.35)]">
                      {[artist.city, artist.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Skeleton carousel ────────────────────────────────────────────
function SkeletonCarousel() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-0.5 w-10 rounded bg-[rgba(255,255,255,0.1)]" />
          <div className="h-6 w-48 rounded bg-[rgba(255,255,255,0.07)]" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 shrink-0 basis-[72%] animate-pulse space-y-3 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3.5 sm:basis-[46%] md:basis-[32%] lg:basis-[23%] xl:basis-[18%]"
          >
            <div className="aspect-square w-full rounded-xl bg-[rgba(255,255,255,0.05)]" />
            <div className="h-4 w-3/4 rounded bg-[rgba(255,255,255,0.05)]" />
            <div className="h-3 w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main section ─────────────────────────────────────────────────
export default function LiveArtistsSection() {
  const [categories, setCategories] = useState<{ title: string; artists: ArtistCard[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllArtists()
      .then((all) => {
        const CATEGORY_ORDER = [
          "INSTRUMENTISTAS CLÁSSICOS",
          "VOZES LÍRICAS",
          "DIRETORES, MAESTROS E MAIS",
          "WORLD MUSIC E JAZZ",
        ];

        // Group by category — skip artists without a defined category
        const map = new Map<string, ArtistCard[]>();
        for (const a of all) {
          const key = a.category?.trim();
          if (!key || !CATEGORY_ORDER.includes(key)) continue;
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(a);
        }

        // Preserve the defined order
        const sorted = CATEGORY_ORDER
          .filter((cat) => map.has(cat))
          .map((cat) => ({ title: cat, artists: map.get(cat)! }));

        setCategories(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="artistasSmartx" className="site-container space-y-12">
      {/* Section header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(250,250,252,0.75)]">
            Artistas SMARTx
          </span>
          <h2 className="text-3xl font-['League_Spartan'] font-bold text-white md:text-4xl">
            Conheça nossa rede de artistas
          </h2>
          <p className="max-w-2xl text-sm text-[rgba(250,250,252,0.65)]">
            Músicos, performers e criadores que integram o ecossistema SMARTx — organizados por área artística.
          </p>
        </div>
        <Link
          to="/artistas"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.18)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-[var(--brand)] hover:bg-[rgba(144,8,11,0.15)] hover:gap-3"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Categories */}
      {loading ? (
        <div className="space-y-12">
          <SkeletonCarousel />
          <SkeletonCarousel />
          <SkeletonCarousel />
        </div>
      ) : categories.length === 0 ? (
        <p className="py-16 text-center text-[rgba(255,255,255,0.4)]">Nenhum artista disponível.</p>
      ) : (
        <div className="space-y-12">
          {categories.map(({ title, artists }) => (
            <CategoryCarousel key={title} title={title} artists={artists} />
          ))}
        </div>
      )}
    </section>
  );
}
