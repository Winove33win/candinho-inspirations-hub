import type { ArtistCardData } from "@/data/homepage";
import DiscoveryCarouselSection from "@/components/DiscoveryCarouselSection";

interface DirectorsSectionProps {
  artists: ArtistCardData[];
  loading: boolean;
  onFollowToggle: (artist: ArtistCardData) => void;
  isFollowed: (artistId: string) => boolean;
}

const DirectorsSection = ({ artists, loading, onFollowToggle, isFollowed }: DirectorsSectionProps) => (
  <DiscoveryCarouselSection
    sectionId="carouselMaestros"
    title="Diretores, Maestros e Mais"
    description="Regentes, diretores musicais e produtores que expandem a linguagem clássica com tecnologia e impacto social."
    artists={artists}
    loading={loading}
    onFollowToggle={onFollowToggle}
    isFollowed={isFollowed}
  />
);

export default DirectorsSection;
