import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

const AUTH_STORAGE_KEY = "smartx-demo-auth";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleFollow, isFollowed } = useFollowedArtists();

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

    const isLogged = typeof window !== "undefined" && window.localStorage.getItem(AUTH_STORAGE_KEY) === "1";

    toast({
      title: wasFollowing ? `Você removeu ${artist.name}` : `Seguindo ${artist.name}`,
      description: isLogged
        ? "Sincronizado com o Portal do Artista."
        : "Salvo localmente. Faça login para sincronizar com o portal.",
    });
  };

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
        <div className="site-container space-y-16">
          <CandinhoSection />
          <FeaturedArtist />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
