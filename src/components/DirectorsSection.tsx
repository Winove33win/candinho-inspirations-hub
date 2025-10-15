import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

const DirectorsSection = () => {
  const directors = [
    {
      name: "André Augusto",
      role: "Maestro e Violinista",
      image: artist1,
    },
    {
      name: "Renata Lima",
      role: "Diretora Musical",
      image: artist2,
    },
    {
      name: "Paulo Moura",
      role: "Especialista em Música Brasileira",
      image: artist3,
    },
    {
      name: "Beatriz Alves",
      role: "Regente e Compositora",
      image: artist4,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            DIRETORES, MAESTROS E MAIS
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {directors.map((director, index) => (
            <div 
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-scale-in"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img 
                  src={director.image} 
                  alt={director.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform group-hover:scale-110 transition-all duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                <h3 className="text-xl font-bold mb-1">{director.name}</h3>
                <p className="text-sm text-white/80">{director.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DirectorsSection;
