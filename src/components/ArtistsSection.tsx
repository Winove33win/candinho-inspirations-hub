import type { ArtistCardData } from "@/data/homepage";
import DiscoveryCarouselSection from "@/components/DiscoveryCarouselSection";

interface ArtistsSectionProps {
  artists: ArtistCardData[];
  loading: boolean;
  onFollowToggle: (artist: ArtistCardData) => void;
  isFollowed: (artistId: string) => boolean;
}

const ArtistsSection = ({ artists, loading, onFollowToggle, isFollowed }: ArtistsSectionProps) => (
  <DiscoveryCarouselSection
    sectionId="carouselClassicos"
    title="Instrumentistas Clássicos"
    description="Virtuoses da ópera, música de câmara e vozes contemporâneas selecionadas pela curadoria SMARTx."
    artists={artists}
    loading={loading}
    onFollowToggle={onFollowToggle}
    isFollowed={isFollowed}
  />
);

export default ArtistsSection;
