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
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
                Sobre o Projeto
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-foreground/80">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Candinho: Uma Ópera para Todos</strong> é uma produção inovadora que une música clássica, elementos da cultura popular brasileira e uma mensagem poderosa sobre a preservação ambiental e a biodiversidade.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Através da história de Candinho, um personagem que simboliza a conexão entre o ser humano e a natureza, a ópera explora temas universais como identidade, pertencimento e responsabilidade ambiental.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    A produção conta com um elenco excepcional, cenografia inspirada na fauna e flora brasileira, e uma trilha sonora que mescla tradição operística com ritmos brasileiros.
                  </p>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
                  <img 
                    src={candinhoScene} 
                    alt="Apresentação de Candinho"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Synopsis Section */}
        <section className="py-20 bg-[hsl(45,40%,90%)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
                Sinopse
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src={cast1} 
                    alt="Cena 1 de Candinho"
                    className="w-full h-auto rounded-xl"
                  />
                  <img 
                    src={cast2} 
                    alt="Cena 2 de Candinho"
                    className="w-full h-auto rounded-xl"
                  />
                  <img 
                    src={candinhoStage} 
                    alt="Cena 3 de Candinho"
                    className="w-full h-auto rounded-xl col-span-2"
                  />
                </div>
                
                <div className="space-y-6 text-foreground/80">
                  <p className="text-lg leading-relaxed">
                    A ópera retrata a jornada de Candinho, um jovem que vive em harmonia com a natureza e descobre o impacto da ação humana no meio ambiente. Através de sua trajetória, ele se torna um símbolo de resistência e esperança.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    A narrativa combina elementos do folclore brasileiro com questões contemporâneas sobre sustentabilidade, levando o público a refletir sobre sua relação com o planeta.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Com músicas originais que transitam entre árias clássicas e ritmos populares brasileiros, a produção oferece uma experiência única que emociona e conscientiza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="py-20 bg-[hsl(200,30%,85%)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
                Locais de Realização
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6 text-foreground/80">
                  <p className="text-lg leading-relaxed">
                    O projeto Candinho percorre as principais cidades brasileiras, levando cultura e arte para diversos públicos. As apresentações acontecem em teatros históricos e espaços culturais renomados.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    Além das apresentações, o projeto inclui atividades educativas e workshops com a comunidade local, promovendo a democratização do acesso à ópera.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold">São Paulo - Teatro Municipal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold">Porto Alegre - Theatro São Pedro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-semibold">Curitiba - Teatro Guaíra</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src={candinhoScene} 
                    alt="Local 1"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <img 
                    src={candinhoStage} 
                    alt="Local 2"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <img 
                    src={cast1} 
                    alt="Local 3"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <img 
                    src={cast2} 
                    alt="Local 4"
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activities and Timeline Section */}
        <section className="py-20 bg-[hsl(80,35%,88%)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
                Atividades e Cronograma
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white/50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-center">Cronograma 2025</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold">Janeiro - Fevereiro</span>
                      <span className="text-muted-foreground">Ensaios e Preparação</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold">Março</span>
                      <span className="text-muted-foreground">Estreia em São Paulo</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold">Abril - Maio</span>
                      <span className="text-muted-foreground">Turnê Nacional</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <span className="font-semibold">Junho</span>
                      <span className="text-muted-foreground">Workshops e Oficinas</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 text-foreground/80">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Workshops Educativos:</strong> Sessões interativas com artistas e educadores sobre música, teatro e meio ambiente.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Apresentações Escolares:</strong> Versões adaptadas da ópera para estudantes, promovendo educação ambiental através da arte.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Debates e Palestras:</strong> Encontros com especialistas em biodiversidade e sustentabilidade após as apresentações.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Exposições:</strong> Mostras fotográficas e artísticas sobre a fauna e flora brasileira nos foyers dos teatros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Innovation and Impact Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
                Inovação e Impacto
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-foreground/80">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Candinho</strong> representa uma inovação no cenário operístico brasileiro ao unir tradição e contemporaneidade, tornando a ópera acessível a todos os públicos.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    O projeto utiliza tecnologia de ponta em cenografia digital, projeções imersivas e recursos multimídia que transportam o público para os ecossistemas brasileiros.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Impacto Social:</strong> Mais de 10.000 estudantes beneficiados com atividades educativas gratuitas.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Sustentabilidade:</strong> 100% dos materiais cenográficos são reutilizáveis e parte da renda é destinada a projetos de conservação ambiental.
                  </p>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
                  <img 
                    src={candinhoStage} 
                    alt="Inovação e Impacto de Candinho"
                    className="w-full h-auto"
                  />
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

        {/* Latest News Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in">
                Últimas Notícias
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Play className="h-16 w-16 text-primary" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3">Candinho estreia com sucesso absoluto</h3>
                    <p className="text-muted-foreground mb-4">
                      A estreia da ópera Candinho emocionou o público presente no Teatro Municipal de São Paulo, com críticas elogiosas sobre a produção.
                    </p>
                    <Button variant="outline">Leia mais</Button>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Users className="h-16 w-16 text-primary" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3">Workshops gratuitos para estudantes</h3>
                    <p className="text-muted-foreground mb-4">
                      Projeto oferece oficinas educativas sobre música e meio ambiente para mais de 1.000 alunos da rede pública de ensino.
                    </p>
                    <Button variant="outline">Leia mais</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Sheet and Team Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Technical Sheet */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
                    Ficha Técnica
                  </h2>
                  
                  <div className="space-y-4 text-foreground/80">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Direção Geral</p>
                      <p>Carlos Mendonça</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Direção Musical</p>
                      <p>Maestro Roberto Tibiriçá</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Composição Original</p>
                      <p>Ana Paula dos Santos</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Libretto</p>
                      <p>João da Silva Neto</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Cenografia</p>
                      <p>Maria Fernandes</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Figurinos</p>
                      <p>Pedro Alves</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Iluminação</p>
                      <p>Luísa Costa</p>
                    </div>
                  </div>
                </div>
                
                {/* Artistic Team */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
                    Equipe Artística
                  </h2>
                  
                  <div className="space-y-4 text-foreground/80">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Candinho (Protagonista)</p>
                      <p>Tenor - Ricardo Moreira</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Mãe Natureza</p>
                      <p>Soprano - Marina Oliveira</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">O Sábio</p>
                      <p>Barítono - Roberto Silva</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">A Serpente</p>
                      <p>Mezzo-soprano - Juliana Santos</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Coro de Animais da Floresta</p>
                      <p>32 vozes</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Orquestra Sinfônica</p>
                      <p>60 músicos</p>
                    </div>
                    
                    <div className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">Grupo de Percussão Brasileira</p>
                      <p>8 percussionistas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
                Apoio e Realização
              </h2>
              
              <p className="text-lg mb-8 text-secondary-foreground/80">
                Este projeto é realizado com o apoio de instituições culturais e parceiros comprometidos com a arte e a sustentabilidade.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 items-center">
                <div className="bg-background text-foreground px-6 py-4 rounded-lg font-semibold">
                  Ministério da Cultura
                </div>
                <div className="bg-background text-foreground px-6 py-4 rounded-lg font-semibold">
                  Lei Rouanet
                </div>
                <div className="bg-background text-foreground px-6 py-4 rounded-lg font-semibold">
                  SESC
                </div>
                <div className="bg-background text-foreground px-6 py-4 rounded-lg font-semibold">
                  Fundação Eco-Brasil
                </div>
              </div>
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
