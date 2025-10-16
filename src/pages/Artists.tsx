import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { artists } from "@/data/artistsData";
import { Button } from "@/components/ui/button";

const Artists = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Todos" },
    { id: "Instrumentista Clássico", label: "Instrumentistas Clássicos" },
    { id: "Maestro", label: "Maestros e Diretores" },
    { id: "Diretor", label: "Diretores Artísticos" },
  ];

  const filteredArtists = selectedCategory === "all" 
    ? artists 
    : artists.filter(artist => artist.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-32 bg-gradient-to-b from-theater-black via-theater-black/95 to-background">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507676184212-d03ab07a01bf')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Conheça os artistas
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <p className="text-sm text-muted-foreground mr-4 self-center">Selecione uma opção:</p>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Artists Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredArtists.map((artist, index) => (
                <Link
                  key={artist.id}
                  to={`/artistas/${artist.id}`}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={artist.image} 
                        alt={artist.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-1">{artist.name}</h3>
                      <p className="text-sm text-white/80">{artist.role}</p>
                    </div>
                    <div className="p-6 bg-card group-hover:opacity-0 transition-opacity duration-300">
                      <h3 className="text-lg font-semibold mb-1 text-card-foreground">{artist.name}</h3>
                      <p className="text-sm text-muted-foreground">{artist.role}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Artists;
