import { api, resolveMediaUrl } from '@/lib/apiClient';

export async function uploadToArtistBucket(opts: {
  file: File;
  userId: string;
  folder: 'profile' | 'photos' | 'videos' | 'docs';
  nameHint?: string;
  upsert?: boolean;
}): Promise<{ path: string }> {
  const { file, folder } = opts;
  return api.upload(`/api/artists/me/upload/${folder}`, file);
}

/**
 * Returns a displayable URL for a stored file path.
 * Drop-in replacement for the old Supabase getSignedUrl —
 * no async needed for our local storage, but kept async
 * for API compatibility.
 */
export async function getSignedUrl(filePath: string, _expiresSec?: number): Promise<string> {
  const url = resolveMediaUrl(filePath);
  if (!url) throw new Error('Storage path is required');
  return url;
}
