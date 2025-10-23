-- Ensure artist-media bucket is private
UPDATE storage.buckets
SET public = FALSE
WHERE id = 'artist-media';

-- Reset artist-media policies to enforce per-user access within userId-prefixed folders
DROP POLICY IF EXISTS "read own files" ON storage.objects;
DROP POLICY IF EXISTS "upload own files" ON storage.objects;
DROP POLICY IF EXISTS "update own files" ON storage.objects;
DROP POLICY IF EXISTS "delete own files" ON storage.objects;

CREATE POLICY "read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'artist-media'
  AND split_part(name, '/', 2) = auth.uid()::text
);

CREATE POLICY "upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artist-media'
  AND split_part(name, '/', 2) = auth.uid()::text
);

CREATE POLICY "update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'artist-media'
  AND split_part(name, '/', 2) = auth.uid()::text
);

CREATE POLICY "delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'artist-media'
  AND split_part(name, '/', 2) = auth.uid()::text
);

-- Slug support for artists
ALTER TABLE public.new_artist_details
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

CREATE OR REPLACE FUNCTION public.slugify(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(regexp_replace(coalesce(input, ''), '[^a-zA-Z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.ensure_artist_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
BEGIN
  IF new.slug IS NULL OR length(trim(new.slug)) = 0 THEN
    base_slug := public.slugify(coalesce(new.artistic_name, new.full_name, new.member_id::text));
    IF base_slug IS NULL OR length(base_slug) = 0 THEN
      base_slug := substr(new.member_id::text, 1, 8);
    END IF;
    new.slug := trim(both '-' FROM base_slug) || '-' || substr(new.member_id::text, 1, 8);
  ELSE
    new.slug := public.slugify(new.slug);
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_artist_slug ON public.new_artist_details;
CREATE TRIGGER trg_artist_slug
BEFORE INSERT OR UPDATE ON public.new_artist_details
FOR EACH ROW
EXECUTE FUNCTION public.ensure_artist_slug();

UPDATE public.new_artist_details
SET slug = NULL
WHERE slug IS NOT NULL AND length(trim(slug)) = 0;

UPDATE public.new_artist_details
SET slug = public.slugify(coalesce(artistic_name, full_name, member_id::text)) || '-' || substr(member_id::text, 1, 8)
WHERE slug IS NULL OR length(trim(slug)) = 0;

-- Public view for artist listings
CREATE OR REPLACE VIEW public.artists_public AS
SELECT
  id,
  member_id,
  coalesce(artistic_name, full_name) AS display_name,
  artistic_name,
  full_name,
  country_residence,
  profile_image,
  profile_text2 AS frase_de_impacto,
  slug,
  created_at
FROM public.new_artist_details;

ALTER VIEW public.artists_public OWNER TO postgres;
GRANT SELECT ON public.artists_public TO anon, authenticated;
