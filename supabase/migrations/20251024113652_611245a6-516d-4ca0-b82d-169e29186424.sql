-- Drop and recreate views with SECURITY INVOKER to fix security warnings
DROP VIEW IF EXISTS public.artists_public;
DROP VIEW IF EXISTS public.artist_details_public;

-- Create public view for artists listing with SECURITY INVOKER
CREATE VIEW public.artists_public 
WITH (security_invoker=true) AS
SELECT 
  nad.id,
  nad.member_id,
  nad.artistic_name AS display_name,
  nad.country_residence,
  nad.profile_image,
  nad.profile_text2 AS frase_de_impacto,
  nad.artistic_name AS slug,
  nad.created_at
FROM public.new_artist_details nad
WHERE nad.perfil_completo = true;

-- Grant SELECT to anonymous and authenticated users
GRANT SELECT ON public.artists_public TO anon, authenticated;

-- Create public view for artist details with SECURITY INVOKER
CREATE VIEW public.artist_details_public 
WITH (security_invoker=true) AS
SELECT 
  nad.id,
  nad.member_id,
  nad.artistic_name,
  nad.full_name,
  nad.profile_image,
  nad.profile_text2,
  nad.country_of_birth,
  nad.country_residence,
  nad.city,
  nad.biography1,
  nad.facebook,
  nad.instagram,
  nad.youtube_channel,
  nad.music_spotify_apple,
  nad.website,
  nad.audio,
  nad.video_banner_landscape,
  nad.video_banner_portrait,
  nad.link_to_video,
  nad.link_to_video2,
  nad.link_to_video3,
  nad.link_to_video4,
  nad.link_to_video5,
  nad.link_to_video6,
  nad.link_to_video7,
  nad.link_to_video8,
  nad.link_to_video9,
  nad.link_to_video10,
  nad.visao_geral_titulo,
  nad.historia_titulo,
  nad.carreira_titulo,
  nad.mais_titulo,
  nad.image1,
  nad.image1_text,
  nad.image2,
  nad.image2_text,
  nad.image3,
  nad.image3_text,
  nad.image4,
  nad.image4_text,
  nad.image5,
  nad.image5_text,
  nad.image6,
  nad.image6_text,
  nad.image7,
  nad.image7_text,
  nad.image8,
  nad.image8_text,
  nad.image9,
  nad.image9_text,
  nad.image10,
  nad.image10_text,
  nad.image11,
  nad.image11_text,
  nad.image12,
  nad.image12_text,
  nad.artistic_name AS slug,
  nad.created_at
FROM public.new_artist_details nad
WHERE nad.perfil_completo = true;

-- Grant SELECT to anonymous and authenticated users
GRANT SELECT ON public.artist_details_public TO anon, authenticated;