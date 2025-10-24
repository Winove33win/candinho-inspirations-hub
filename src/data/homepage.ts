import agostinhoProfile from "@/assets/agostinho-profile.jpg";
import agostinhoHero from "@/assets/agostinho-hero.jpg";
import anaPaulaProfile from "@/assets/ana-paula-profile.jpg";
import andreBaleiroProfile from "@/assets/andre-baleiro-profile.jpg";
import andreCunhaProfile from "@/assets/andre-cunha-profile.jpg";
import alexandreProfile from "@/assets/alexandre-profile.jpg";
import allexProfile from "@/assets/allex-profile.jpg";
import barbaraProfile from "@/assets/barbara-profile.jpg";
import carlaProfile from "@/assets/carla-profile.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";
import candinhoStage from "@/assets/candinho-stage.jpg";
import candinhoHero from "@/assets/candinho-hero.png";

export type DiscoveryChip =
  | "Em Destaque"
  | "Clássicos"
  | "Maestros"
  | "World Music"
  | "Jazz"
  | "Novidades"
  | "Mais Vistos";

export interface ArtistCardData {
  id: string;
  slug: string;
  name: string;
  role: string;
  country?: string;
  photo: string;
  heroPhoto?: string;
  shortBio: string;
  miniBio: string;
  categories: DiscoveryChip[];
  tags: string[];
  featured?: boolean;
  spotlight?: boolean;
  orderIndex: Partial<Record<"classicos" | "maestros" | "worldJazz", number>>;
  popularity: number;
  lastRelease?: string;
  links: {
    profile: string;
    videos?: string;
    photos?: string;
    contact?: string;
  };
}

export interface ProjectHighlight {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  banner: string;
  accentImage: string;
  ctas: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export interface SpotlightEditorial {
  title: string;
  subtitle: string;
  narrative: string;
  callout: string;
  quoteAuthor: string;
  ctaLabel: string;
  ctaHref: string;
  artist: ArtistCardData;
}

export const discoveryChips: DiscoveryChip[] = [
  "Em Destaque",
  "Clássicos",
  "Maestros",
  "World Music",
  "Jazz",
  "Novidades",
  "Mais Vistos",
];

export const artistsLibrary: ArtistCardData[] = [
  {
    id: "agostinho-sequeira",
    slug: "agostinho-sequeira",
    name: "Agostinho Sequeira",
    role: "Percussionista Visionário",
    country: "Portugal",
    photo: agostinhoProfile,
    heroPhoto: agostinhoHero,
    shortBio:
      "Vencedor do Concurso Tromp 2020, Agostinho transita entre o clássico e o contemporâneo com performances hipnóticas.",
    miniBio:
      "Agostinho transforma percussão em poesia visual, conectando ritmos ancestrais a paisagens sonoras futuristas em cada apresentação.",
    categories: ["Em Destaque", "Clássicos", "Novidades"],
    tags: ["Percussão", "Performance Multimídia"],
    featured: true,
    spotlight: true,
    orderIndex: { classicos: 1 },
    popularity: 98,
    lastRelease: "Tour Europe 2025",
    links: {
      profile: "/artista/agostinho-sequeira",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photos: "/artista/agostinho-sequeira#galeria",
      contact: "mailto:agostinho@smartx.art",
    },
  },
  {
    id: "ana-paula-russo",
    slug: "ana-paula-russo",
    name: "Ana Paula Russo",
    role: "Soprano Dramática",
    country: "Portugal",
    photo: anaPaulaProfile,
    shortBio:
      "Voz cristalina e presença magnética. Ana Paula ilumina o repertório barroco e contemporâneo com rara sensibilidade.",
    miniBio:
      "Entre catedrais barrocas e festivais contemporâneos, Ana Paula domina nuances expressivas que arrebatam plateias globais.",
    categories: ["Em Destaque", "Clássicos", "Mais Vistos"],
    tags: ["Ópera", "Soprano"],
    orderIndex: { classicos: 2 },
    popularity: 92,
    links: {
      profile: "/artista/ana-paula-russo",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photos: "/artista/ana-paula-russo#fotos",
      contact: "mailto:anapaula@smartx.art",
    },
  },
  {
    id: "andre-baleiro",
    slug: "andre-baleiro",
    name: "André Baleiro",
    role: "Barítono Contemporâneo",
    country: "Portugal",
    photo: andreBaleiroProfile,
    shortBio:
      "Barítono de timbre aveludado, reconhecido por protagonizar produções operísticas imersivas em três continentes.",
    miniBio:
      "André une tradição lírica a narrativas digitais, criando experiências operísticas multiplataforma que inspiram novas gerações.",
    categories: ["Clássicos", "Mais Vistos"],
    tags: ["Barítono", "Ópera"],
    orderIndex: { classicos: 3 },
    popularity: 88,
    links: {
      profile: "/artista/andre-baleiro",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      photos: "/artista/andre-baleiro#fotos",
    },
  },
  {
    id: "barbara-barradas",
    slug: "barbara-barradas",
    name: "Bárbara Barradas",
    role: "Soprano Lírico-Ligeiro",
    photo: barbaraProfile,
    shortBio:
      "Timbre luminoso e técnica refinada que ressignifica os clássicos com frescor e autenticidade.",
    miniBio:
      "Bárbara é presença garantida em palcos europeus com interpretações que combinam delicadeza e vigor dramático.",
    categories: ["Clássicos", "Novidades"],
    tags: ["Soprano", "Residente SMARTx"],
    orderIndex: { classicos: 4 },
    popularity: 84,
    links: {
      profile: "/artista/barbara-barradas",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    id: "carla-frias",
    slug: "carla-frias",
    name: "Carla Frias",
    role: "Soprano Dramática",
    photo: carlaProfile,
    shortBio:
      "Repertório expansivo e narrativas que aproximam o público da ópera contemporânea.",
    miniBio:
      "Carla combina pesquisa vocal e storytelling para criar recitais que destacam compositoras e vozes sub-representadas.",
    categories: ["Clássicos", "Mais Vistos"],
    tags: ["Soprano", "Pesquisa Vocal"],
    orderIndex: { classicos: 5 },
    popularity: 83,
    links: {
      profile: "/artista/carla-frias",
      contact: "mailto:carla@smartx.art",
    },
  },
  {
    id: "alexandre-delgado",
    slug: "alexandre-delgado",
    name: "Alexandre Delgado",
    role: "Maestro & Compositor",
    photo: alexandreProfile,
    shortBio:
      "Maestro-residente da SMARTx, conecta repertórios eruditos e populares em temporadas digitais inovadoras.",
    miniBio:
      "Alexandre conduz orquestras de câmara a grandes formações, explorando mixagens sonoras e experiências imersivas.",
    categories: ["Em Destaque", "Maestros", "Mais Vistos"],
    tags: ["Regência", "Curadoria"],
    orderIndex: { maestros: 1 },
    popularity: 95,
    links: {
      profile: "/artista/alexandre-delgado",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      contact: "mailto:alexandre@smartx.art",
    },
  },
  {
    id: "allex-aguilera",
    slug: "allex-aguilera",
    name: "Allex Aguilera",
    role: "Diretor Musical",
    photo: allexProfile,
    shortBio:
      "Diretor que abraça tecnologias interativas para reinventar clássicos com estética cinematográfica.",
    miniBio:
      "Allex orquestra experiências sonoras híbridas, conectando ópera, cinema e artes visuais.",
    categories: ["Maestros", "Novidades"],
    tags: ["Direção", "Experiência Imersiva"],
    orderIndex: { maestros: 2 },
    popularity: 86,
    links: {
      profile: "/artista/allex-aguilera",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    id: "andre-cunha-leal",
    slug: "andre-cunha-leal",
    name: "André Cunha Leal",
    role: "Diretor Artístico",
    photo: andreCunhaProfile,
    shortBio:
      "Visionário por trás de projetos que democratizam o acesso à ópera com tecnologia e impacto social.",
    miniBio:
      "André lidera iniciativas comunitárias que conectam artistas emergentes a grandes palcos.",
    categories: ["Maestros", "Novidades"],
    tags: ["Produção", "Impacto Social"],
    orderIndex: { maestros: 3 },
    popularity: 82,
    links: {
      profile: "/artista/andre-cunha-leal",
      contact: "mailto:andre.cunha@smartx.art",
    },
  },
  {
    id: "lena-monte",
    slug: "lena-monte",
    name: "Lena Monté",
    role: "Vocalista World Music",
    photo: artist1,
    shortBio:
      "Mistura ritmos afro-lusitanos com texturas eletrônicas em colaborações globais.",
    miniBio:
      "Lena traduz memórias de diáspora em canções que oscilam entre ancestralidade e futuro digital.",
    categories: ["World Music", "Novidades", "Mais Vistos"],
    tags: ["World Music", "Eletrônico"],
    orderIndex: { worldJazz: 1 },
    popularity: 90,
    links: {
      profile: "/artista/lena-monte",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      contact: "mailto:lena@smartx.art",
    },
  },
  {
    id: "joao-swing",
    slug: "joao-swing",
    name: "João Swing",
    role: "Guitarrista de Jazz",
    photo: artist2,
    shortBio:
      "Improvisador nato que leva o jazz lisboeta a residências híbridas com dança urbana.",
    miniBio:
      "João mistura harmonias complexas com grooves dançantes, criando jam sessions coletivas dentro da SMARTx.",
    categories: ["Jazz", "World Music", "Mais Vistos"],
    tags: ["Jazz", "Improviso"],
    orderIndex: { worldJazz: 2 },
    popularity: 87,
    links: {
      profile: "/artista/joao-swing",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    id: "maya-rix",
    slug: "maya-rix",
    name: "Maya Rix",
    role: "Produtora Electro-Jazz",
    photo: artist3,
    shortBio:
      "Explora sintetizadores analógicos e sopros urbanos em beats que atravessam fronteiras.",
    miniBio:
      "Maya cria paisagens sonoras com colaborações de artistas independentes e performances imersivas.",
    categories: ["Jazz", "Novidades"],
    tags: ["Electro-Jazz", "Produtora"],
    orderIndex: { worldJazz: 3 },
    popularity: 85,
    links: {
      profile: "/artista/maya-rix",
      videos: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    id: "ensemble-aurora",
    slug: "ensemble-aurora",
    name: "Ensemble Aurora",
    role: "Coletivo World Jazz",
    photo: artist4,
    shortBio:
      "Coletivo que une instrumentos acústicos e eletrônicos em trilhas criadas ao vivo para cinema mudo.",
    miniBio:
      "Aurora ressignifica improvisação com narrativas visuais e colaboração multidisciplinar.",
    categories: ["World Music", "Jazz", "Em Destaque"],
    tags: ["Coletivo", "Live Cinema"],
    orderIndex: { worldJazz: 4 },
    popularity: 88,
    links: {
      profile: "/artista/ensemble-aurora",
      contact: "mailto:aurora@smartx.art",
    },
  },
];

export const projectHighlight: ProjectHighlight = {
  id: "candinho",
  title: "CANDINHO — UMA ÓPERA PARA TODOS!",
  subtitle: "Projeto Especial SMARTx",
  description:
    "Uma ópera contemporânea inclusiva que une intérpretes consagrados, comunidade e tecnologia assistiva em um espetáculo emocionante.",
  banner: candinhoStage,
  accentImage: candinhoHero,
  ctas: {
    primary: { label: "Saiba Mais", href: "/candinho" },
    secondary: { label: "Ver Trailer", href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  },
};

export const spotlightEditorial: SpotlightEditorial = {
  title: "Artista em Foco",
  subtitle: "Percussão como manifesto sensorial",
  narrative:
    "Agostinho Sequeira transforma cada apresentação em um ritual audiovisual que conecta percussão ancestral a linguagens experimentais. Sua residência SMARTx explora paisagens sonoras imersivas com colaboração de artistas visuais.",
  callout: "\"Há uma sensação de magia na sua atuação, é um espectro absoluto.\"",
  quoteAuthor: "Júri do Concurso Tromp",
  ctaLabel: "Conheça Mais Artistas",
  ctaHref: "/artistas",
  artist: artistsLibrary.find((artist) => artist.spotlight) as ArtistCardData,
};

export interface SearchEntry {
  id: string;
  label: string;
  type: "artista" | "categoria" | "projeto";
  href: string;
  meta?: string;
}

export const searchIndex: SearchEntry[] = [
  ...artistsLibrary.map((artist): SearchEntry => ({
    id: artist.id,
    label: artist.name,
    type: "artista" as const,
    href: artist.links.profile,
    meta: artist.role,
  })),
  ...discoveryChips.map((chip): SearchEntry => ({
    id: `chip-${chip.toLowerCase().replace(/\s+/g, "-")}`,
    label: chip,
    type: "categoria" as const,
    href: `/#chipsDiscover`,
    meta: "Coleção SMARTx",
  })),
  {
    id: projectHighlight.id,
    label: projectHighlight.title,
    type: "projeto" as const,
    href: "/candinho",
    meta: "Projeto Especial",
  },
];

export type CarouselSectionKey = "classicos" | "maestros" | "worldJazz";

export const carouselSections: Record<CarouselSectionKey, {
  id: string;
  title: string;
  description: string;
  filter: (artist: ArtistCardData) => boolean;
  chipAffinity: DiscoveryChip[];
}> = {
  classicos: {
    id: "carouselClassicos",
    title: "Instrumentistas Clássicos",
    description: "Virtuoses da ópera e da música de câmara curados pela SMARTx.",
    filter: (artist) => artist.orderIndex.classicos !== undefined,
    chipAffinity: ["Clássicos", "Em Destaque", "Mais Vistos"],
  },
  maestros: {
    id: "carouselMaestros",
    title: "Diretores, Maestros e Mais",
    description: "Regentes, diretores musicais e visionários sonoros.",
    filter: (artist) => artist.orderIndex.maestros !== undefined,
    chipAffinity: ["Maestros", "Em Destaque", "Novidades"],
  },
  worldJazz: {
    id: "carouselWorldJazz",
    title: "World Music e Jazz",
    description: "Paisagens sonoras globais e improvisos urbanos.",
    filter: (artist) => artist.orderIndex.worldJazz !== undefined,
    chipAffinity: ["World Music", "Jazz", "Novidades", "Mais Vistos"],
  },
};

export const chipFilters: Partial<Record<DiscoveryChip, (artist: ArtistCardData) => boolean>> = {
  "Em Destaque": (artist) => artist.featured ?? false,
  "Clássicos": (artist) => artist.categories.includes("Clássicos"),
  "Maestros": (artist) => artist.categories.includes("Maestros"),
  "World Music": (artist) => artist.categories.includes("World Music"),
  Jazz: (artist) => artist.categories.includes("Jazz"),
  Novidades: (artist) => artist.categories.includes("Novidades"),
  "Mais Vistos": (artist) => artist.popularity >= 85,
};

export const spotlightMeta = {
  title: `SMARTx — ${spotlightEditorial.artist.name} em destaque`,
  description: spotlightEditorial.narrative,
  image: spotlightEditorial.artist.heroPhoto ?? spotlightEditorial.artist.photo,
};
