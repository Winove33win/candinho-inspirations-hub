export type StorageFolder = "profile" | "photos" | "videos" | "docs";

// Map each logical folder to the correct Storage bucket
export const BUCKETS: Record<StorageFolder, string> = {
  profile: "artist-photos",
  photos: "artist-photos",
  videos: "artist-video",
  docs: "artist-docs",
};

export const DEFAULT_BUCKET = BUCKETS.photos;
export const KNOWN_BUCKETS = Object.values(BUCKETS);

export function getBucketForFolder(folder: StorageFolder) {
  return BUCKETS[folder] ?? DEFAULT_BUCKET;
}

