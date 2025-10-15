import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArtistsSection from "@/components/ArtistsSection";
import DirectorsSection from "@/components/DirectorsSection";
import WorldMusicSection from "@/components/WorldMusicSection";
import CandinhoSection from "@/components/CandinhoSection";
import FeaturedArtist from "@/components/FeaturedArtist";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ArtistsSection />
        <DirectorsSection />
        <WorldMusicSection />
        <CandinhoSection />
        <FeaturedArtist />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
