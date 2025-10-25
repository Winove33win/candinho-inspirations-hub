import { getBucketForFolder, KNOWN_BUCKETS, DEFAULT_BUCKET } from "@/config/storage";
import { supabase } from "@/integrations/supabase/client";

export async function uploadToArtistBucket(opts: {
  file: File;
  userId: string;
  folder: "profile" | "photos" | "videos" | "docs";
  nameHint?: string;
  upsert?: boolean;
}) {
  const { file, userId, folder, nameHint, upsert = true } = opts;
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const fallbackName = file.name.replace(/\s+/g, "-");
  const originalName = nameHint || fallbackName;
  const safeName = originalName.replace(/[^a-z0-9._-]/gi, "");
  const baseName = safeName.replace(/\.[a-z0-9]+$/i, "");
  const normalizedName = baseName.length > 0 ? baseName : "arquivo";
  const filename = `${Date.now()}-${normalizedName}.${ext}`.toLowerCase();
  const objectPath = `${userId}/${folder}/${filename}`;

  const bucket = getBucketForFolder(folder);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, file, {
      upsert,
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
    });

  if (error) throw error;
  return { path: `${bucket}/${objectPath}` };
}

export async function getSignedUrl(path: string, expiresSec = 3600) {
  if (!path) {
    throw new Error("Storage path is required");
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) {
    throw new Error("Invalid storage path");
  }

  let bucket = segments[0];
  let objectPathSegments = segments.slice(1);

  // If the first segment is not a known bucket, assume the whole path is the objectPath
  // and use the default bucket (backward compatibility)
  if (!KNOWN_BUCKETS.includes(bucket) || objectPathSegments.length === 0) {
    bucket = DEFAULT_BUCKET;
    objectPathSegments = segments;
  }

  const objectPath = objectPathSegments.join("/");
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresSec);

  if (error || !data?.signedUrl) {
    throw error ?? new Error("Failed to create signed URL");
  }

  return data.signedUrl;
}
