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
  const path = `artist-media/${userId}/${folder}/${filename}`;

  const { error } = await supabase.storage
    .from("artist-media")
    .upload(path, file, {
      upsert,
      contentType: file.type || `image/${ext}`,
      cacheControl: "3600",
    });

  if (error) throw error;
  return { path };
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

  if (bucket !== "artist-media" || objectPathSegments.length === 0) {
    bucket = "artist-media";
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
