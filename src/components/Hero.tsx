import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(220, 20, 60, 0.9), rgba(18, 18, 18, 0.9)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-primary-foreground leading-tight">
            PAIXÃO
          </h2>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground/90 leading-tight">
            TALENTO
          </h3>
          <h4 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-primary-foreground leading-tight">
            INSPIRAÇÃO
          </h4>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
            Descubra os maiores talentos da música clássica, jazz e world music. 
            Uma plataforma que conecta artistas extraordinários ao mundo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Explorar Artistas
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Play className="mr-2 h-5 w-5" />
              Assistir Apresentação
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
