import { useEffect, useMemo, useState } from "react";

import type { ArtistCardData } from "@/data/homepage";
import ArtistCard from "@/components/ArtistCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoveryCarouselSectionProps {
  sectionId: string;
  title: string;
  description: string;
  artists: ArtistCardData[];
  loading?: boolean;
  onFollowToggle: (artist: ArtistCardData) => void;
  isFollowed: (artistId: string) => boolean;
}

const DiscoveryCarouselSection = ({
  sectionId,
  title,
  description,
  artists,
  loading = false,
  onFollowToggle,
  isFollowed,
}: DiscoveryCarouselSectionProps) => {
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  const hasContent = artists.length > 0;

  const placeholderItems = useMemo(() => Array.from({ length: 6 }), []);

  useEffect(() => {
    if (!carouselApi) return;

    const update = () => {
      const inView = carouselApi.slidesInView(true).length || 1;
      const snapCount = carouselApi.scrollSnapList().length || 1;
      const computedPages = Math.max(1, Math.ceil(snapCount / inView));
      setPages(computedPages);
      const currentSnap = carouselApi.selectedScrollSnap() ?? 0;
      setCurrentPage(Math.min(computedPages - 1, Math.floor(currentSnap / inView)));
    };

    update();
    carouselApi.on("select", update);
    carouselApi.on("resize", update);
    carouselApi.on("reInit", update);

    return () => {
      carouselApi.off("select", update);
      carouselApi.off("resize", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi, artists.length]);

  useEffect(() => {
    if (!hasContent) {
      setPages(1);
      setCurrentPage(0);
    }
  }, [hasContent, artists.length]);

  return (
    <section id={sectionId} className="relative pt-12">
      <div className="site-container space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>
            <span className="mt-1 block h-0.5 w-16 bg-[var(--brand)]" aria-hidden />
            <p className="mt-3 max-w-2xl text-sm text-[rgba(250,250,252,0.72)]">{description}</p>
          </div>
          {pages > 1 && (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[rgba(250,250,252,0.58)]">
              {Array.from({ length: pages }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === currentPage ? "bg-[var(--brand)] shadow-[0_0_0_4px_rgba(144,8,11,0.18)]" : "bg-[rgba(255,255,255,0.12)]"
                  }`}
                >
                  <span className="sr-only">{`Página ${index + 1}`}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <Carousel
          opts={{ align: "start", containScroll: "trimSnaps", dragFree: false }}
          setApi={setCarouselApi}
          className="relative"
        >
          <CarouselContent className="-ml-4">
            {(loading ? placeholderItems : artists).map((artist, index) => (
              <CarouselItem
                key={loading ? index : artist.id}
                className="basis-[85%] pl-4 sm:basis-1/2 md:basis-2/5 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
              >
                {loading ? (
                  <div className="glass-panel h-full overflow-hidden rounded-[14px] p-4">
                    <Skeleton className="mb-4 h-48 rounded-[12px] bg-[rgba(144,8,11,0.12)]" />
                    <Skeleton className="mb-3 h-6 w-3/4 bg-[rgba(144,8,11,0.12)]" />
                    <Skeleton className="mb-2 h-4 w-1/2 bg-[rgba(144,8,11,0.12)]" />
                    <Skeleton className="h-20 bg-[rgba(144,8,11,0.12)]" />
                  </div>
                ) : (
                  <ArtistCard
                    artist={artist}
                    isFollowed={isFollowed(artist.id)}
                    onFollowToggle={onFollowToggle}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-10 hidden bg-[rgba(18,0,0,0.72)] text-[var(--ink)] shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:bg-[rgba(144,8,11,0.32)] lg:flex" aria-label="Voltar carrossel" />
          <CarouselNext className="-right-10 hidden bg-[rgba(18,0,0,0.72)] text-[var(--ink)] shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:bg-[rgba(144,8,11,0.32)] lg:flex" aria-label="Avançar carrossel" />
        </Carousel>
      </div>
    </section>
  );
};

export default DiscoveryCarouselSection;
