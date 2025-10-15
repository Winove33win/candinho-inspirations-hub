interface ArtistCardProps {
  name: string;
  role: string;
  image: string;
}

const ArtistCard = ({ name, role, image }: ArtistCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-scale-in">
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-white/80">{role}</p>
      </div>
      <div className="p-6 bg-card">
        <h3 className="text-lg font-semibold mb-1 text-card-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default ArtistCard;
