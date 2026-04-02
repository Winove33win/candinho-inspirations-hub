// ── Auth ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'member';
}

// ── Artist details ────────────────────────────────────────────────

export interface ArtistDetails {
  id: string;
  member_id: string;
  perfil_completo: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;

  // Dados pessoais
  artistic_name: string | null;
  full_name: string | null;
  profile_image: string | null;
  how_is_it_defined1: string | null;
  how_is_it_defined: string | null;
  cell_phone: string | null;
  date_of_birth: string | null;
  country_of_birth: string | null;
  profile_text2: string | null;
  address1: string | null;
  postal_code: string | null;
  address2: string | null;
  city: string | null;
  country_residence: string | null;
  accepted_terms1: boolean | null;
  accepted_terms2: boolean | null;

  // Biografia e redes
  biography1: string | null;
  facebook: string | null;
  instagram: string | null;
  music_spotify_apple: string | null;
  youtube_channel: string | null;
  website: string | null;

  // Mídia
  audio: string | null;
  video_banner_landscape: string | null;
  video_banner_portrait: string | null;
  link_to_video: string | null;
  link_to_video2: string | null;
  link_to_video3: string | null;
  link_to_video4: string | null;
  link_to_video5: string | null;
  link_to_video6: string | null;
  link_to_video7: string | null;
  link_to_video8: string | null;
  link_to_video9: string | null;
  link_to_video10: string | null;

  // Textos editoriais
  visao_geral_titulo: string | null;
  historia_titulo: string | null;
  carreira_titulo: string | null;
  mais_titulo: string | null;

  // Fotografias
  image1: string | null;  image1_text: string | null;
  image2: string | null;  image2_text: string | null;
  image3: string | null;  image3_text: string | null;
  image4: string | null;  image4_text: string | null;
  image5: string | null;  image5_text: string | null;
  image6: string | null;  image6_text: string | null;
  image7: string | null;  image7_text: string | null;
  image8: string | null;  image8_text: string | null;
  image9: string | null;  image9_text: string | null;
  image10: string | null; image10_text: string | null;
  image11: string | null; image11_text: string | null;
  image12: string | null; image12_text: string | null;

  [key: string]: unknown;
}

// ── Projects ──────────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'published';

export interface Project {
  id: string;
  member_id: string;
  title: string | null;
  cover_image: string | null;
  banner_image: string | null;
  about: string | null;
  block1_title: string | null; block1_image: string | null;
  block2_title: string | null; block2_image: string | null;
  block3_title: string | null; block3_image: string | null;
  block4_title: string | null; block4_image: string | null;
  block5_title: string | null; block5_image: string | null;
  team_tech: string | null;
  team_art: string | null;
  project_sheet: string | null;
  partners: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

// ── Events ────────────────────────────────────────────────────────

export interface Event {
  id: string;
  member_id: string;
  name: string | null;
  banner: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  place: string | null;
  cta_link: string | null;
  description: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

// ── Documents ─────────────────────────────────────────────────────

export type DocumentKind = 'contrato' | 'termo' | 'outro';

export interface Document {
  id: string;
  member_id: string;
  title: string | null;
  file_url: string | null;
  kind: DocumentKind;
  created_at: string;
  updated_at: string;
}

// ── Support ───────────────────────────────────────────────────────

export interface SupportTicket {
  id: string;
  member_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  updated_at: string;
}

// ── Public artist ─────────────────────────────────────────────────

export interface ArtistPublic {
  id: string;
  slug: string;
  stageName: string;
  country?: string | null;
  city?: string | null;
  category?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  stats?: { key: string; value: string | number }[];
  vision?: string | null;
  history?: string | null;
  career?: string | null;
  more?: string | null;
  socials?: { label: string; url: string }[];
  photos?: { url: string; alt?: string }[];
  videos?: { url: string; provider?: 'youtube' | 'vimeo' | 'file' }[];
  projects?: ProjectPublic[];
  events?: EventPublic[];
}

export interface ProjectPublic {
  id: string;
  title?: string | null;
  about?: string | null;
  partners?: string | null;
  teamArt?: string | null;
  teamTech?: string | null;
  projectSheetUrl?: string | null;
  coverUrl?: string | null;
  bannerUrl?: string | null;
}

export interface EventPublic {
  id: string;
  name?: string | null;
  description?: string | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  place?: string | null;
  ctaLink?: string | null;
  bannerUrl?: string | null;
}
