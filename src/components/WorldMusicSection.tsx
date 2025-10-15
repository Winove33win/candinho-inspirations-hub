import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

const WorldMusicSection = () => {
  const artists = [
    {
      name: "Luis Mendez",
      specialty: "Violin Tango Argentino",
      image: artist3,
    },
    {
      name: "Julia Navarro",
      specialty: "Acordeonista",
      image: artist2,
    },
    {
      name: "Carmen Souza",
      specialty: "Cantora e Compositora",
      image: artist4,
    },
    {
      name: "Ricardo Silva",
      specialty: "Percussionista",
      image: artist1,
    },
  ];

  return (
    <section className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            WORLD MUSIC E JAZZ
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {artists.map((artist, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-0 shadow-[var(--shadow-card)] overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={artist.image} 
                          alt={artist.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                          <div className="text-white">
                            <h3 className="text-xl font-bold mb-1">{artist.name}</h3>
                            <p className="text-sm text-white/80">{artist.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default WorldMusicSection;
