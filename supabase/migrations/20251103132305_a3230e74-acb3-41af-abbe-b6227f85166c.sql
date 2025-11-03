-- Security fix: Make artist-docs bucket private and add RLS policies
-- This prevents unauthorized access to potentially sensitive artist documents

-- Update artist-docs bucket to be private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'artist-docs';

-- Create RLS policies for artist-docs bucket

-- Policy: Users can view their own documents
CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'artist-docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can upload their own documents
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'artist-docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'artist-docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'artist-docs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admins can access all documents in artist-docs
CREATE POLICY "Admins can access all documents" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'artist-docs' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Add explicit DENY policy for support_tickets deletion (defense-in-depth)
CREATE POLICY "Deny all users from deleting support tickets" 
ON public.support_tickets 
FOR DELETE 
TO authenticated 
USING (false);

-- Add comment explaining the deletion restriction
COMMENT ON POLICY "Deny all users from deleting support tickets" ON public.support_tickets 
IS 'Support tickets must be preserved for audit trail. Only database administrators can delete tickets through direct database access.';