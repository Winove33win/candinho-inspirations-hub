import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, ArrowLeft, Play, Users, Music } from "lucide-react";
import { Link } from "react-router-dom";
import candinhoHero from "@/assets/candinho-hero.png";
import candinhoScene from "@/assets/candinho-scene.jpg";
import candinhoStage from "@/assets/candinho-stage.jpg";
import cast1 from "@/assets/candinho-cast-1.jpg";
import cast2 from "@/assets/candinho-cast-2.jpg";

const Candinho = () => {
  const performances = [
    {
      date: "15 de Março, 2025",
      venue: "Teatro Municipal de São Paulo",
      time: "20:00",
      city: "São Paulo, SP"
    },
    {
      date: "22 de Março, 2025",
      venue: "Theatro São Pedro",
      time: "19:30",
      city: "Porto Alegre, RS"
    },
    {
      date: "5 de Abril, 2025",
      venue: "Teatro Guaíra",
      time: "20:00",
      city: "Curitiba, PR"
    },
  ];

  const castMembers = [
    {
      name: "Marina Oliveira",
      role: "Candinho (protagonista)",
      image: cast1,
    },
    {
      name: "Roberto Silva",
      role: "Narrador",
      image: cast2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              SMART<span className="text-primary">x</span>
            </h1>
            <Button size="sm">
              Comprar Ingressos
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(220, 20, 60, 0.85), rgba(18, 18, 18, 0.85)), url(${candinhoScene})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <div className="mb-8">
                <img 
                  src={candinhoHero} 
                  alt="Candinho - Uma Ópera para Todos"
                  className="w-full max-w-3xl mx-auto"
                />
              </div>
              
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
                Uma experiência única que celebra a biodiversidade brasileira através da música e da arte
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Ticket className="mr-2 h-5 w-5" />
                  Comprar Ingressos
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Trailer
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center animate-fade-in">
                Sobre o Projeto
              </h2>
              
              <div className="prose prose-lg max-w-none text-foreground/80 space-y-6 animate-fade-in-up">
                <p className="text-lg leading-relaxed">
                  <strong className="text-foreground">Candinho: Uma Ópera para Todos</strong> é uma produção inovadora que 
                  une música clássica, elementos da cultura popular brasileira e uma mensagem poderosa sobre a 
                  preservação ambiental e a biodiversidade.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Através da história de Candinho, um personagem que simboliza a conexão entre o ser humano e a 
                  natureza, a ópera explora temas universais como identidade, pertencimento e responsabilidade 
                  ambiental. A produção conta com um elenco excepcional, cenografia inspirada na fauna e flora 
                  brasileira, e uma trilha sonora que mescla tradição operística com ritmos brasileiros.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 my-12">
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Music className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-bold text-xl mb-2">Música Original</h3>
                      <p className="text-muted-foreground">Composições exclusivas que unem tradição e inovação</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-bold text-xl mb-2">Elenco Renomado</h3>
                      <p className="text-muted-foreground">Artistas de reconhecimento nacional e internacional</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-bold text-xl mb-2">Temporada 2025</h3>
                      <p className="text-muted-foreground">Apresentações nas principais cidades brasileiras</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
              Galeria
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)] group animate-scale-in">
                <img 
                  src={candinhoStage} 
                  alt="Cenário da Ópera Candinho"
                  className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">Cenário Principal</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)] group animate-scale-in">
                <img 
                  src={candinhoScene} 
                  alt="Cena da Ópera Candinho"
                  className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">Apresentação ao Vivo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cast Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
              Elenco Principal
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {castMembers.map((member, index) => (
                <div key={index} className="text-center animate-scale-in">
                  <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)] mb-4 group">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performances Section */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
              Próximas Apresentações
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {performances.map((performance, index) => (
                <Card key={index} className="border-2 hover:border-primary/40 transition-all duration-300 animate-fade-in-up">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 text-primary">
                          <Calendar className="h-5 w-5" />
                          <span className="font-bold text-lg">{performance.date}</span>
                          <span className="text-muted-foreground">• {performance.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">{performance.venue}</p>
                            <p className="text-sm text-muted-foreground">{performance.city}</p>
                          </div>
                        </div>
                      </div>
                      <Button size="lg" className="whitespace-nowrap">
                        <Ticket className="mr-2 h-5 w-5" />
                        Comprar Ingressos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Não Perca Esta Experiência Única
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Garanta seu lugar e faça parte desta celebração da arte e da natureza brasileira
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Ticket className="mr-2 h-5 w-5" />
                  Comprar Ingressos
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm text-secondary-foreground/70">
            &copy; 2025 SMARTx. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Candinho;
