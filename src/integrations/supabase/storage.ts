import { supabase } from "@/integrations/supabase/client";

export interface ParsedStoragePath {
  bucket: string;
  objectPath: string;
}

export function parseStoragePath(path: string): ParsedStoragePath {
  const normalized = path.replace(/^\/+/, "");
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error("Invalid storage path. Expected format 'bucket/object'.");
  }

  const [bucket, ...rest] = segments;
  return {
    bucket,
    objectPath: rest.join("/"),
  };
}

export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  if (!path) {
    throw new Error("Storage path is required to generate a signed URL");
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const { bucket, objectPath } = parseStoragePath(path);
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresIn);

  if (error || !data?.signedUrl) {
    throw error ?? new Error("Failed to generate signed URL");
  }

  return data.signedUrl;
}
