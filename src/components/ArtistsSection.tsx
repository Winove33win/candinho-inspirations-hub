import ArtistCard from "./ArtistCard";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

const ArtistsSection = () => {
  const artists = [
    {
      name: "Maria Silva",
      role: "Soprano",
      image: artist2,
    },
    {
      name: "João Santos",
      role: "Violinista",
      image: artist3,
    },
    {
      name: "Carlos Mendes",
      role: "Pianista",
      image: artist4,
    },
    {
      name: "Ana Costa",
      role: "Maestrina",
      image: artist1,
    },
  ];

  return (
    <section id="artistas" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            INSTRUMENTISTAS CLÁSSICOS
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {artists.map((artist, index) => (
            <ArtistCard 
              key={index}
              name={artist.name}
              role={artist.role}
              image={artist.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
