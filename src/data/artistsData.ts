export interface Artist {
  id: string;
  name: string;
  role: string;
  image: string;
  heroImage: string;
  category: string;
  quote?: string;
  bio: string;
  trajectory: string;
  career: string;
  videos?: string[];
  photos?: string[];
  social?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
}

import agostinhoProfile from "@/assets/agostinho-profile.jpg";
import alexandreProfile from "@/assets/alexandre-profile.jpg";
import allexProfile from "@/assets/allex-profile.jpg";
import anaPaulaProfile from "@/assets/ana-paula-profile.jpg";
import andreBaleiro from "@/assets/andre-baleiro-profile.jpg";
import andreCunha from "@/assets/andre-cunha-profile.jpg";
import barbaraProfile from "@/assets/barbara-profile.jpg";
import carlaProfile from "@/assets/carla-profile.jpg";
import agostinhoHero from "@/assets/agostinho-hero.jpg";

export const artists: Artist[] = [
  {
    id: "agostinho-sequeira",
    name: "Agostinho Sequeira",
    role: "Percussionista",
    image: agostinhoProfile,
    heroImage: agostinhoHero,
    category: "Instrumentista Clássico",
    quote: "Há uma sensação de magia na sua atuação, é um espectro absoluto. - Júri do Concurso Tromp em 2020",
    bio: "Agostinho Sequeira, um mago dos ritmos que eleva a música a uma viagem sublime e espiritual, é um virtuoso do percussivo cujo talento é habilidade se deslumbrar fenômeno aclamado internacionalmente. É um artista exímio que usa os ritmos como linguagem universal para contar histórias profundas e entrear plateias no setor tecnológico.",
    trajectory: "O que torna Agostinho tão especial é a sua capacidade de combinar harmoniosamente tradição e inovação, estabelecendo uma ligação única e matura com o público. Nas suas interpretações, explora os aspetos mais contemplativos e primordiais da percussão para alcançar a essência humana.\n\nAs suas atuações, tanto energéticas como delicadas, são verdadeiros rituais onde os ritmos se fundem numa experiência hipnótica e colorida.",
    career: "Em 2020, foi o vencedor do Concurso de Percussão Tromp, recebendo também o prêmio do público e o prêmio de imprensa Jan Pustjens.\n\nTem se apresentado como solista com prestigiadas orquestras em importantes salas de concerto ao redor do mundo, consolidando sua reputação internacional.\n\nÉ membro fundador de diversos ensembles de música contemporânea e colabora regularmente com compositores de renome internacional.",
    videos: [],
    photos: [],
    social: {
      instagram: "@agostinhosequeira",
      youtube: "AgostinhoSequeira",
    }
  },
  {
    id: "alexandre-delgado",
    name: "Alexandre Delgado",
    role: "Compositor e Maestro",
    image: alexandreProfile,
    heroImage: agostinhoHero,
    category: "Maestro",
    bio: "Alexandre Delgado é um dos compositores mais respeitados da atualidade, com uma carreira marcada por obras que transitam entre o erudito e o popular com maestria única.",
    trajectory: "Sua formação musical abrange estudos em composição, regência e musicologia nas mais prestigiadas instituições europeias. Ao longo de sua carreira, tem desenvolvido uma linguagem musical própria que dialoga com diversas tradições.",
    career: "Suas composições foram executadas pelas principais orquestras do mundo. Como maestro, conduziu mais de 500 concertos em 30 países diferentes, sendo reconhecido pela crítica internacional como um dos grandes nomes da música contemporânea.",
    videos: [],
    photos: [],
  },
  {
    id: "allex-aguilera",
    name: "Allex Aguilera",
    role: "Diretor e Condutor",
    image: allexProfile,
    heroImage: agostinhoHero,
    category: "Maestro",
    bio: "Allex Aguilera é um diretor musical inovador, conhecido por suas interpretações ousadas e por trazer nova vida a obras clássicas e contemporâneas.",
    trajectory: "Com formação em regência e direção musical, Allex tem se destacado por sua capacidade de conectar músicos e público de forma única, criando experiências memoráveis.",
    career: "Dirigiu mais de 200 produções em teatros de ópera e salas de concerto ao redor do mundo. Seu trabalho é caracterizado pela atenção aos detalhes e pela busca constante de excelência artística.",
    videos: [],
    photos: [],
  },
  {
    id: "ana-paula-russo",
    name: "Ana Paula Russo",
    role: "Soprano",
    image: anaPaulaProfile,
    heroImage: agostinhoHero,
    category: "Instrumentista Clássico",
    bio: "Ana Paula Russo possui uma das vozes mais belas e expressivas da atualidade, com um repertório que abrange do barroco ao contemporâneo.",
    trajectory: "Formada nas melhores escolas de canto da Europa, Ana Paula desenvolveu uma técnica impecável aliada a uma profunda sensibilidade musical que emociona plateias ao redor do mundo.",
    career: "Cantou nos principais teatros de ópera internacionais e gravou diversos álbuns aclamados pela crítica. É reconhecida por suas interpretações refinadas e pela versatilidade de seu repertório.",
    videos: [],
    photos: [],
  },
  {
    id: "andre-baleiro",
    name: "André Baleiro",
    role: "Barítono",
    image: andreBaleiro,
    heroImage: agostinhoHero,
    category: "Instrumentista Clássico",
    bio: "André Baleiro é um barítono de presença marcante, cuja voz poderosa e expressiva conquista públicos em todo o mundo.",
    trajectory: "Com uma carreira internacional consolidada, André é conhecido por suas interpretações intensas e pela capacidade de dar vida aos personagens mais complexos do repertório operístico.",
    career: "Protagonizou dezenas de produções operísticas nas principais casas de ópera do mundo. Sua voz rica e seu carisma no palco o tornaram um dos barítonos mais requisitados de sua geração.",
    videos: [],
    photos: [],
  },
  {
    id: "andre-cunha-leal",
    name: "André Cunha Leal",
    role: "Diretor Artístico e Produtor",
    image: andreCunha,
    heroImage: agostinhoHero,
    category: "Diretor",
    bio: "André Cunha Leal é um visionário da produção artística, responsável por projetos culturais inovadores que democratizam o acesso à música erudita.",
    trajectory: "Com formação em gestão cultural e produção artística, André tem dedicado sua carreira a criar pontes entre artistas e público, desenvolvendo projetos que transformam vidas através da música.",
    career: "Produziu mais de 150 eventos culturais, sempre com foco na excelência artística e no impacto social. É reconhecido por sua capacidade de transformar visões em realidade e por seu comprometimento com a democratização cultural.",
    videos: [],
    photos: [],
  },
  {
    id: "barbara-barradas",
    name: "Bárbara Barradas",
    role: "Soprano",
    image: barbaraProfile,
    heroImage: agostinhoHero,
    category: "Instrumentista Clássico",
    bio: "Bárbara Barradas é uma soprano de técnica refinada e expressividade única, capaz de emocionar com cada nota.",
    trajectory: "Sua formação musical sólida e seu talento natural a levaram a palcos internacionais, onde é reconhecida por sua musicalidade excepcional.",
    career: "Tem se apresentado em importantes festivais e temporadas de ópera, conquistando crítica e público com suas interpretações sensíveis e tecnicamente impecáveis.",
    videos: [],
    photos: [],
  },
  {
    id: "carla-frias",
    name: "Carla Frias",
    role: "Soprano",
    image: carlaProfile,
    heroImage: agostinhoHero,
    category: "Instrumentista Clássico",
    bio: "Carla Frias é uma soprano de voz cristalina e presença de palco magnética, reconhecida por suas interpretações apaixonadas.",
    trajectory: "Com uma trajetória marcada pela dedicação e pelo aperfeiçoamento constante, Carla desenvolveu um repertório amplo e diversificado.",
    career: "Participou de produções aclamadas em diversos países e é conhecida por sua capacidade de conectar-se profundamente com o público através da música.",
    videos: [],
    photos: [],
  },
];

export const getArtistById = (id: string): Artist | undefined => {
  return artists.find(artist => artist.id === id);
};

export const getArtistsByCategory = (category: string): Artist[] => {
  return artists.filter(artist => artist.category === category);
};
