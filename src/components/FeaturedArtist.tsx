import { Button } from "@/components/ui/button";
import artist2 from "@/assets/artist-2.jpg";

const FeaturedArtist = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            ARTISTA EM <span className="text-primary">FOCO</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative group animate-fade-in">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
              <img 
                src={artist2} 
                alt="Artista em Foco"
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          
          <div className="animate-fade-in-up">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Na SMARTx, Artistas encontram <span className="text-primary">oportunidades</span>.
            </h3>
            
            <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
              Realizadores de espetáculo encontram talentos.
            </p>
            
            <p className="text-base mb-8 text-muted-foreground/80">
              Nossa plataforma conecta os maiores talentos da música clássica, jazz e world music 
              com oportunidades ao redor do mundo. Junte-se a nós e faça parte desta comunidade 
              extraordinária de artistas e realizadores.
            </p>
            
            <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
              <p className="text-lg font-medium italic">
                "Na SMARTx, o palco é seu!"
              </p>
            </div>
            
            <Button size="lg" className="text-base px-8">
              Conheça Mais Artistas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtist;
