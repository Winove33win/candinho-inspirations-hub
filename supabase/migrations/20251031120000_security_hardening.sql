-- Harden row level security and storage policies

-- Ensure RLS is enabled on the core tables
ALTER TABLE public.new_artist_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Support tickets table (create if missing)
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ALTER COLUMN status SET DEFAULT 'open';
ALTER TABLE public.support_tickets
  DROP CONSTRAINT IF EXISTS support_tickets_status_check;
ALTER TABLE public.support_tickets
  ADD CONSTRAINT support_tickets_status_check
  CHECK (status IN ('open', 'in_progress', 'closed'));

-- Simple admin registry
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Helper view to check admin flag
CREATE OR REPLACE VIEW public.v_is_admin AS
SELECT
  auth.uid() AS uid,
  EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.user_id = auth.uid()
  ) AS is_admin;

-- Drop legacy policies so we can replace them with owner/admin aware rules
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT pol.polname, schemaname, tablename
    FROM pg_policies pol
    WHERE schemaname = 'public'
      AND tablename IN ('new_artist_details', 'projects', 'events', 'documents', 'support_tickets')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.polname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Artist details policies (owner or admin)
CREATE POLICY "artist select own"
ON public.new_artist_details
FOR SELECT
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "artist insert own"
ON public.new_artist_details
FOR INSERT
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "artist update own"
ON public.new_artist_details
FOR UPDATE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

-- Projects policies
CREATE POLICY "projects read own"
ON public.projects
FOR SELECT
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "projects write own"
ON public.projects
FOR INSERT
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "projects update own"
ON public.projects
FOR UPDATE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "projects delete own"
ON public.projects
FOR DELETE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

-- Events policies
CREATE POLICY "events read own"
ON public.events
FOR SELECT
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "events write own"
ON public.events
FOR INSERT
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "events update own"
ON public.events
FOR UPDATE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "events delete own"
ON public.events
FOR DELETE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

-- Documents policies
CREATE POLICY "documents read own"
ON public.documents
FOR SELECT
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "documents write own"
ON public.documents
FOR INSERT
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "documents update own"
ON public.documents
FOR UPDATE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "documents delete own"
ON public.documents
FOR DELETE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

-- Support tickets policies (owner or admin)
CREATE POLICY "tickets read own or admin"
ON public.support_tickets
FOR SELECT
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

CREATE POLICY "tickets insert own"
ON public.support_tickets
FOR INSERT
WITH CHECK (
  auth.uid() = member_id
);

CREATE POLICY "tickets update own or admin"
ON public.support_tickets
FOR UPDATE
USING (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = member_id OR
  EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
);

-- Trigger to maintain updated_at on support tickets
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON public.support_tickets;
DROP TRIGGER IF EXISTS trg_support_updated ON public.support_tickets;
CREATE TRIGGER trg_support_updated
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Storage hardening: make bucket private and scope access by owner
UPDATE storage.buckets
SET public = FALSE
WHERE id = 'artist-media';

DROP POLICY IF EXISTS "Users can view artist media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload their artist media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their artist media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their artist media" ON storage.objects;
DROP POLICY IF EXISTS "read own files" ON storage.objects;
DROP POLICY IF EXISTS "upload own files" ON storage.objects;
DROP POLICY IF EXISTS "update own files" ON storage.objects;
DROP POLICY IF EXISTS "delete own files" ON storage.objects;

CREATE POLICY "read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'artist-media' AND
  split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artist-media' AND
  split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'artist-media' AND
  split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'artist-media' AND
  split_part(name, '/', 1) = auth.uid()::text
);
