import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArtistById } from "@/data/artistsData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Instagram, Youtube, Facebook } from "lucide-react";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artist = id ? getArtistById(id) : undefined;
  const [activeTab, setActiveTab] = useState("overview");

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Artista não encontrado</h1>
          <Link to="/artistas">
            <Button>Voltar para artistas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-theater-black">
          <div className="absolute inset-0">
            <img 
              src={artist.heroImage} 
              alt={artist.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-theater-black via-theater-black/50 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-12">
            <Link to="/artistas" className="mb-8">
              <Button variant="ghost" className="text-white hover:text-white/80">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-end gap-8 animate-fade-in">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-[var(--shadow-hover)]">
                <img 
                  src={artist.image} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white flex-1">
                <h1 className="text-5xl font-bold mb-2">{artist.name}</h1>
                <p className="text-xl text-white/80">{artist.role}</p>
              </div>
              
              {artist.social && (
                <div className="flex gap-3">
                  {artist.social.instagram && (
                    <a href={`https://instagram.com/${artist.social.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" className="text-white hover:text-white/80">
                        <Instagram className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {artist.social.youtube && (
                    <a href={`https://youtube.com/@${artist.social.youtube}`} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" className="text-white hover:text-white/80">
                        <Youtube className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                  {artist.social.facebook && (
                    <a href={`https://facebook.com/${artist.social.facebook}`} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" className="text-white hover:text-white/80">
                        <Facebook className="h-5 w-5" />
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 bg-muted">
                <TabsTrigger value="overview">VISÃO GERAL</TabsTrigger>
                <TabsTrigger value="trajectory">TRAJETÓRIA PESSOAL</TabsTrigger>
                <TabsTrigger value="career">CARREIRA</TabsTrigger>
                <TabsTrigger value="more">MAIS</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {artist.quote && (
                  <div className="bg-muted/50 p-8 rounded-lg border-l-4 border-primary">
                    <p className="text-lg italic text-muted-foreground">"{artist.quote}"</p>
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">{artist.bio}</p>
                </div>
              </TabsContent>

              <TabsContent value="trajectory" className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{artist.trajectory}</p>
                </div>
              </TabsContent>

              <TabsContent value="career" className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{artist.career}</p>
                </div>
              </TabsContent>

              <TabsContent value="more" className="space-y-8">
                <p className="text-muted-foreground">Informações adicionais em breve.</p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Videos Section */}
        {artist.videos && artist.videos.length > 0 && (
          <section className="py-20 bg-theater-black">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-4xl font-bold mb-12 text-center text-white">VÍDEOS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artist.videos.map((video, index) => (
                  <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src={video}
                      title={`${artist.name} video ${index + 1}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Photos Section */}
        {artist.photos && artist.photos.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-4xl font-bold mb-12 text-center">FOTOGRAFIAS</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {artist.photos.map((photo, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <img 
                      src={photo} 
                      alt={`${artist.name} foto ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArtistDetail;
