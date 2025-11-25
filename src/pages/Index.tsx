import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DiscoverChips from "@/components/DiscoverChips";
import ArtistsSection from "@/components/ArtistsSection";
import DirectorsSection from "@/components/DirectorsSection";
import WorldMusicSection from "@/components/WorldMusicSection";
import CandinhoSection from "@/components/CandinhoSection";
import FeaturedArtist from "@/components/FeaturedArtist";
import Footer from "@/components/Footer";
import type { ArtistCardData, CarouselSectionKey, DiscoveryChip, SearchEntry } from "@/data/homepage";
import {
  artistsLibrary,
  carouselSections,
  chipFilters,
  discoveryChips,
  spotlightMeta,
} from "@/data/homepage";
import { useFollowedArtists } from "@/hooks/useFollowedArtists";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AUTH_STORAGE_KEY = "smartx-demo-auth";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFollow, isFollowed } = useFollowedArtists();
  const { user } = useAuth();

  const [selectedChip, setSelectedChip] = useState<DiscoveryChip>(discoveryChips[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as { scrollTo?: string; chip?: DiscoveryChip } | null;
    if (!state) return;

    const { scrollTo, chip } = state;

    if (chip && discoveryChips.includes(chip)) {
      setSelectedChip(chip);
    }

    if (scrollTo && typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    navigate(location.pathname, { replace: true });
  }, [location, navigate]);

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [selectedChip]);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<DiscoveryChip>;
      const chip = customEvent.detail;
      if (chip && discoveryChips.includes(chip)) {
        setSelectedChip(chip);
        document.getElementById("chipsDiscover")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    window.addEventListener("smartx-chip-select", handler as EventListener);
    return () => window.removeEventListener("smartx-chip-select", handler as EventListener);
  }, []);

  useEffect(() => {
    const applyMeta = () => {
      document.title = spotlightMeta.title;
      const description = document.querySelector('meta[name="description"]');
      if (description) {
        description.setAttribute("content", spotlightMeta.description);
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", spotlightMeta.title);
      }
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute("content", spotlightMeta.description);
      }
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute("content", spotlightMeta.image);
      }
    };

    applyMeta();
  }, []);

  const sortedBySection = useMemo(() => {
    const sortArtists = (list: ArtistCardData[], key: CarouselSectionKey) =>
      [...list].sort((a, b) => {
        const orderA = a.orderIndex[key] ?? Number.POSITIVE_INFINITY;
        const orderB = b.orderIndex[key] ?? Number.POSITIVE_INFINITY;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return b.popularity - a.popularity;
      });

    const filterForSection = (key: CarouselSectionKey) => {
      const base = artistsLibrary.filter(carouselSections[key].filter);
      const chipFilter = chipFilters[selectedChip];

      if (chipFilter) {
        const filtered = base.filter(chipFilter);
        if (filtered.length > 0) {
          return sortArtists(filtered, key);
        }
      }

      return sortArtists(base, key);
    };

    return {
      classicos: filterForSection("classicos"),
      maestros: filterForSection("maestros"),
      worldJazz: filterForSection("worldJazz"),
    };
  }, [selectedChip]);

  const handleExplore = () => {
    document.getElementById("carouselClassicos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChipSelect = (chip: DiscoveryChip) => {
    setSelectedChip(chip);
    document.getElementById("chipsDiscover")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSuggestionSelect = (entry: SearchEntry) => {
    if (entry.type === "categoria") {
      const chip = entry.label as DiscoveryChip;
      if (discoveryChips.includes(chip)) {
        setSelectedChip(chip);
      }
      document.getElementById("chipsDiscover")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    navigate(entry.href);
  };

  const handleFollowToggle = (artist: ArtistCardData) => {
    const wasFollowing = isFollowed(artist.id);
    toggleFollow(artist.id);

    toast({
      title: wasFollowing ? `Você removeu ${artist.name}` : `Seguindo ${artist.name}`,
      description: user
        ? "Sincronizado com o Portal do Artista."
        : "Salvo localmente. Faça login para sincronizar com o portal.",
    });
  };

  const highlightedEvents = [
    {
      title: "Circuito SMARTx 2025",
      description: "Turnê com recitais em São Paulo, Porto Alegre e Curitiba com artistas residentes.",
      badge: "Eventos",
    },
    {
      title: "Residência de Projetos",
      description: "Mentorias e aceleração para 12 novos projetos autorais selecionados pelo júri SMARTx.",
      badge: "Projetos",
    },
    {
      title: "Encontros Comunitários",
      description: "Sessões abertas com oficinas de voz, percussão e criação de trilhas sonoras inclusivas.",
      badge: "Comunidade",
    },
  ];

  return (
    <div className="relative min-h-screen pb-20">
      <Header />
      <main className="space-y-16">
        <Hero
          onExplore={handleExplore}
          onSuggestionSelect={handleSuggestionSelect}
          onChipSelect={handleChipSelect}
        />
        <div className="site-container">
          <DiscoverChips chips={discoveryChips} selected={selectedChip} onSelect={handleChipSelect} />
        </div>
        <ArtistsSection
          artists={sortedBySection.classicos}
          loading={isLoading}
          onFollowToggle={handleFollowToggle}
          isFollowed={isFollowed}
        />
        <DirectorsSection
          artists={sortedBySection.maestros}
          loading={isLoading}
          onFollowToggle={handleFollowToggle}
          isFollowed={isFollowed}
        />
        <WorldMusicSection
          artists={sortedBySection.worldJazz}
          loading={isLoading}
          onFollowToggle={handleFollowToggle}
          isFollowed={isFollowed}
        />
        <section id="blockProjetos" className="site-container space-y-16">
          <CandinhoSection />
        </section>

        <section id="blockEventos" className="site-container space-y-10">
          <div className="rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-[rgba(18,0,0,0.7)] p-8 shadow-[0_26px_65px_rgba(0,0,0,0.45)] md:p-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(250,250,252,0.75)]">
                  Agenda
                </span>
                <h2 className="text-3xl font-bold text-white md:text-4xl">Eventos e Projetos em destaque</h2>
                <p className="max-w-2xl text-[rgba(250,250,252,0.78)]">
                  Navegue pelos próximos movimentos do ecossistema SMARTx: temporadas, residências e encontros que aproximam artistas, curadores e público.
                </p>
              </div>
              <Button
                variant="outline"
                className="min-w-[180px] justify-center border-[rgba(255,255,255,0.32)] bg-transparent text-white hover:border-[var(--brand)] hover:bg-[rgba(144,8,11,0.1)]"
                onClick={() => navigate("/candinho")}
              >
                Ver agenda completa
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {highlightedEvents.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand)]/60"
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.26em] text-[rgba(250,250,252,0.65)]">
                    <span>{item.badge}</span>
                    <span className="rounded-full bg-[rgba(144,8,11,0.18)] px-3 py-1 text-[var(--ink)]">Nova</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[rgba(250,250,252,0.7)]">{item.description}</p>
                  <Link
                    to="/candinho"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] transition group-hover:translate-x-1"
                  >
                    Conferir detalhes
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <FeaturedArtist />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
