interface VideoItem {
  url: string;
  provider?: "youtube" | "vimeo" | "file";
}

interface VideosGalleryProps {
  videos?: VideoItem[];
}

function extractYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu")) {
      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    }
  } catch (err) {
    console.error("[VIDEOS::YOUTUBE_ID]", err);
  }
  return null;
}

function extractVimeoId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("vimeo")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    }
  } catch (err) {
    console.error("[VIDEOS::VIMEO_ID]", err);
  }
  return null;
}

function toEmbedSrc(video: VideoItem) {
  if (!video.url) return null;

  const provider = video.provider;

  if (provider === "youtube") {
    const id = extractYouTubeId(video.url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (provider === "vimeo") {
    const id = extractVimeoId(video.url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  if (provider === "file") {
    return video.url;
  }

  // Tenta detectar automaticamente
  const lower = video.url.toLowerCase();
  if (lower.includes("youtu")) {
    const id = extractYouTubeId(video.url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (lower.includes("vimeo")) {
    const id = extractVimeoId(video.url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/.test(lower)) {
    return video.url;
  }

  return video.url;
}

export function VideosGallery({ videos }: VideosGalleryProps) {
  if (!videos || videos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--divider)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--text-3)]">
        Nenhum vídeo disponível no momento.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {videos.map((video, index) => {
        const src = toEmbedSrc(video);

        return (
          <div
            key={`${video.url}-${index}`}
            className="overflow-hidden rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] shadow-[var(--shadow-1)]"
          >
            {src && /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(src) ? (
              <video controls className="aspect-video w-full bg-black">
                <source src={src} />
                Seu navegador não suporta reprodução de vídeo.
              </video>
            ) : src ? (
              <iframe
                src={src}
                title={`Vídeo ${index + 1}`}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                aria-hidden="true"
                className="aspect-video w-full bg-gradient-to-br from-[rgba(176,16,22,0.45)] via-[rgba(32,18,21,0.85)] to-[rgba(15,10,10,1)]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
