import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArtistById } from "@/data/artistsData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Instagram, Youtube, Facebook, User, Share2 } from "lucide-react";

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
        <section className="relative h-[40vh] bg-theater-black">
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
            
            <div className="animate-fade-in">
              <h1 className="text-5xl font-bold mb-2 text-white">{artist.name}</h1>
              <p className="text-xl text-white/80">{artist.role}</p>
            </div>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar */}
              <aside className="lg:w-80 flex-shrink-0">
                <div className="bg-card rounded-lg overflow-hidden shadow-[var(--shadow-card)] sticky top-24">
                  {/* Artist Photo */}
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={artist.image} 
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Artist Info */}
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">"A percussão pode ser encontrado em todos os cantos do mundo e tem um poder primordial a todos nós"</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Alemanho</span>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartilhar perfil
                    </Button>
                    
                    {/* Social Links */}
                    {artist.social && (
                      <div className="flex gap-2 pt-4 border-t">
                        {artist.social.facebook && (
                          <a href={`https://facebook.com/${artist.social.facebook}`} target="_blank" rel="noopener noreferrer">
                            <Button size="icon" variant="ghost">
                              <Facebook className="h-5 w-5" />
                            </Button>
                          </a>
                        )}
                        {artist.social.instagram && (
                          <a href={`https://instagram.com/${artist.social.instagram}`} target="_blank" rel="noopener noreferrer">
                            <Button size="icon" variant="ghost">
                              <Instagram className="h-5 w-5" />
                            </Button>
                          </a>
                        )}
                        {artist.social.youtube && (
                          <a href={`https://youtube.com/@${artist.social.youtube}`} target="_blank" rel="noopener noreferrer">
                            <Button size="icon" variant="ghost">
                              <Youtube className="h-5 w-5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* Biography Button */}
                    <Button className="w-full" variant="secondary">
                      Biografia
                    </Button>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-8 bg-theater-black w-full justify-start rounded-none h-auto p-0 border-b border-border">
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4 text-base font-medium"
                    >
                      VISÃO GERAL
                    </TabsTrigger>
                    <TabsTrigger 
                      value="trajectory"
                      className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4 text-base font-medium"
                    >
                      TRAJETÓRIA PESSOAL
                    </TabsTrigger>
                    <TabsTrigger 
                      value="career"
                      className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4 text-base font-medium"
                    >
                      CARREIRA
                    </TabsTrigger>
                    <TabsTrigger 
                      value="more"
                      className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4 text-base font-medium"
                    >
                      MAIS
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-8 mt-8">
                    {artist.quote && (
                      <div className="bg-muted/50 p-8 rounded-lg">
                        <p className="text-lg italic text-center mb-2">&ldquo;{artist.quote}&rdquo;</p>
                        <p className="text-center text-sm text-muted-foreground font-semibold">
                          Júri do Concurso Tromp em 2020
                        </p>
                      </div>
                    )}
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-foreground leading-relaxed text-justify">{artist.bio}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="trajectory" className="space-y-6 mt-8">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-foreground leading-relaxed text-justify whitespace-pre-line">{artist.trajectory}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="career" className="space-y-6 mt-8">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-foreground leading-relaxed text-justify whitespace-pre-line">{artist.career}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="more" className="space-y-8 mt-8">
                    <p className="text-muted-foreground">Informações adicionais em breve.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        {artist.videos && artist.videos.length > 0 && (
          <section className="py-20 bg-theater-black">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-5xl font-bold mb-16 text-center text-white">VÍDEOS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {artist.videos.map((video, index) => (
                  <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
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
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-5xl font-bold mb-16 text-center">FOTOGRAFIAS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artist.photos.map((photo, index) => (
                  <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-white/10">
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
