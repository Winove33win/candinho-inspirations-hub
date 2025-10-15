import candinhoHero from "@/assets/candinho-hero.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CandinhoSection = () => {
  return (
    <section id="candinho" className="py-20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
              <img 
                src={candinhoHero} 
                alt="Candinho - Uma Ópera para Todos"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">PROJETO ESPECIAL</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              CANDINHO
              <br />
              <span className="text-primary">UMA ÓPERA PARA TODOS!</span>
            </h2>
            
            <p className="text-lg mb-8 text-secondary-foreground/80 leading-relaxed">
              Quando música e natureza se encontram em uma produção inesquecível. 
              Uma ópera que celebra a biodiversidade brasileira através da arte e da paixão musical.
            </p>
            
            <p className="text-base mb-8 text-secondary-foreground/70">
              Apresentando a história de Candinho em uma produção que mistura música clássica com 
              elementos da cultura popular brasileira, criando uma experiência única e transformadora 
              para todos os públicos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/candinho">
                <Button size="lg" className="text-base px-8 w-full">
                  Saiba Mais
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8 border-2">
                Ver Trailer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandinhoSection;
