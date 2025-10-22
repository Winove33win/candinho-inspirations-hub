-- Create enum for project and event status
CREATE TYPE public.content_status AS ENUM ('draft', 'published');

-- Create enum for document types
CREATE TYPE public.document_kind AS ENUM ('contrato', 'termo', 'outro');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create new_artist_details table
CREATE TABLE public.new_artist_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  perfil_completo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Dados pessoais
  artistic_name TEXT,
  profile_image TEXT,
  full_name TEXT,
  how_is_it_defined1 TEXT,
  how_is_it_defined TEXT,
  cell_phone TEXT,
  date_of_birth DATE,
  country_of_birth TEXT,
  profile_text2 TEXT,
  address1 TEXT,
  postal_code TEXT,
  address2 TEXT,
  city TEXT,
  country_residence TEXT,
  accepted_terms1 BOOLEAN DEFAULT false,
  accepted_terms2 BOOLEAN DEFAULT false,
  
  -- Biografia e redes
  biography1 TEXT,
  facebook TEXT,
  instagram TEXT,
  music_spotify_apple TEXT,
  youtube_channel TEXT,
  website TEXT,
  
  -- Vídeos & Áudios
  audio TEXT,
  video_banner_landscape TEXT,
  video_banner_portrait TEXT,
  link_to_video TEXT,
  link_to_video2 TEXT,
  link_to_video3 TEXT,
  link_to_video4 TEXT,
  link_to_video5 TEXT,
  link_to_video6 TEXT,
  link_to_video7 TEXT,
  link_to_video8 TEXT,
  link_to_video9 TEXT,
  link_to_video10 TEXT,
  
  -- Textos editoriais
  visao_geral_titulo TEXT,
  historia_titulo TEXT,
  carreira_titulo TEXT,
  mais_titulo TEXT,
  
  -- Fotografias
  image1 TEXT,
  image1_text TEXT,
  image2 TEXT,
  image2_text TEXT,
  image3 TEXT,
  image3_text TEXT,
  image4 TEXT,
  image4_text TEXT,
  image5 TEXT,
  image5_text TEXT,
  image6 TEXT,
  image6_text TEXT,
  image7 TEXT,
  image7_text TEXT,
  image8 TEXT,
  image8_text TEXT,
  image9 TEXT,
  image9_text TEXT,
  image10 TEXT,
  image10_text TEXT,
  image11 TEXT,
  image11_text TEXT,
  image12 TEXT,
  image12_text TEXT
);

ALTER TABLE public.new_artist_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own artist details"
  ON public.new_artist_details FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can insert their own artist details"
  ON public.new_artist_details FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own artist details"
  ON public.new_artist_details FOR UPDATE
  USING (auth.uid() = member_id);

CREATE POLICY "Admins can view all artist details"
  ON public.new_artist_details FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all artist details"
  ON public.new_artist_details FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  cover_image TEXT,
  banner_image TEXT,
  about TEXT,
  block1_title TEXT,
  block1_image TEXT,
  block2_title TEXT,
  block2_image TEXT,
  block3_title TEXT,
  block3_image TEXT,
  block4_title TEXT,
  block4_image TEXT,
  block5_title TEXT,
  block5_image TEXT,
  team_tech TEXT,
  team_art TEXT,
  project_sheet TEXT,
  partners TEXT,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = member_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = member_id);

CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  banner TEXT,
  date DATE,
  start_time TIME,
  end_time TIME,
  place TEXT,
  cta_link TEXT,
  description TEXT,
  status content_status DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
  ON public.events FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can insert their own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = member_id);

CREATE POLICY "Users can delete their own events"
  ON public.events FOR DELETE
  USING (auth.uid() = member_id);

CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  file_url TEXT,
  kind document_kind DEFAULT 'outro',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Users can update their own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = member_id);

CREATE POLICY "Users can delete their own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = member_id);

CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = member_id);

CREATE POLICY "Users can insert their own tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all tickets"
  ON public.support_tickets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers to all tables
CREATE TRIGGER update_artist_details_updated_at
  BEFORE UPDATE ON public.new_artist_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create artist details skeleton on user registration
CREATE OR REPLACE FUNCTION public.handle_new_artist_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.new_artist_details (member_id, perfil_completo)
  VALUES (NEW.id, false);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_artist
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_artist_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-media', 'artist-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view artist media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artist-media');

CREATE POLICY "Authenticated users can upload their artist media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'artist-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their artist media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'artist-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their artist media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'artist-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );