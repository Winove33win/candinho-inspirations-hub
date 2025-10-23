import type { ArtistCardData } from "@/data/homepage";
import DiscoveryCarouselSection from "@/components/DiscoveryCarouselSection";

interface WorldMusicSectionProps {
  artists: ArtistCardData[];
  loading: boolean;
  onFollowToggle: (artist: ArtistCardData) => void;
  isFollowed: (artistId: string) => boolean;
}

const WorldMusicSection = ({ artists, loading, onFollowToggle, isFollowed }: WorldMusicSectionProps) => (
  <DiscoveryCarouselSection
    sectionId="carouselWorldJazz"
    title="World Music e Jazz"
    description="Improvisos urbanos, fusões globais e beats experimentais em playlists horizontais infinitas."
    artists={artists}
    loading={loading}
    onFollowToggle={onFollowToggle}
    isFollowed={isFollowed}
  />
);

export default WorldMusicSection;
