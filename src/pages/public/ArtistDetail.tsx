import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getSignedUrl } from "@/utils/storage";

type ArtistRow = Database["public"]["Views"]["artist_details_public"]["Row"];

const photoIndexes = Array.from({ length: 12 }, (_, index) => index + 1);
const youtubeKeys = [
  "link_to_video",
  "link_to_video2",
  "link_to_video3",
  "link_to_video4",
  "link_to_video5",
  "link_to_video6",
  "link_to_video7",
  "link_to_video8",
  "link_to_video9",
  "link_to_video10",
] as const;

function getPlainText(value?: string | null) {
  return value ? value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim() : "";
}

function formatLink(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

function isVideoUrl(url?: string) {
  if (!url) return false;
  return /(\.mp4|\.webm|\.ogg)(\?|$)/i.test(url);
}

export default function ArtistDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [artist, setArtist] = useState<ArtistRow | null>(null);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!slug) {
      setArtist(null);
      setError("Artista não encontrado");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        let data: ArtistRow | null = null;

        const { data: bySlug, error: slugError } = await supabase
          .from("artist_details_public")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (slugError && slugError.code !== "PGRST116") throw slugError;
        if (bySlug) data = bySlug;

        if (!data) {
          const { data: byId, error: idError } = await supabase
            .from("artist_details_public")
            .select("*")
            .eq("id", slug)
            .maybeSingle();
          if (idError && idError.code !== "PGRST116") throw idError;
          if (byId) data = byId;
        }

        if (!data) {
          const { data: byMember, error: memberError } = await supabase
            .from("artist_details_public")
            .select("*")
            .eq("member_id", slug)
            .maybeSingle();
          if (memberError && memberError.code !== "PGRST116") throw memberError;
          if (byMember) data = byMember;
        }

        if (!active) return;

        if (!data) {
          setArtist(null);
          setError("Artista não encontrado");
        } else {
          setArtist(data);
        }
      } catch (fetchError) {
        console.error("[ARTIST::DETAIL]", fetchError);
        if (active) {
          setArtist(null);
          setError("Não foi possível carregar os dados do artista.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;

    if (!artist) {
      setMediaUrls({});
      return () => {
        active = false;
      };
    }

    (async () => {
      const keys = [
        "profile_image",
        "video_banner_landscape",
        "video_banner_portrait",
        "audio",
        ...photoIndexes.map((index) => `image${index}`),
      ];

      const next: Record<string, string> = {};

      for (const key of keys) {
        const value = artist[key as keyof ArtistRow];
        if (typeof value === "string" && value) {
          try {
            const url = await getSignedUrl(value, 3600);
            next[key] = url;
          } catch (err) {
            console.error("[ARTIST::MEDIA_URL]", err);
          }
        }
      }

      if (active) setMediaUrls(next);
    })();

    return () => {
      active = false;
    };
  }, [artist]);

  const youtubeLinks = useMemo(() => {
    if (!artist) return [] as string[];
    return youtubeKeys
      .map((key) => artist[key] || "")
      .filter((link) => typeof link === "string" && link.startsWith("http"));
  }, [artist]);

  const photos = useMemo(() => {
    if (!artist) return [] as { src: string; caption: string }[];
    return photoIndexes
      .map((index) => {
        const path = mediaUrls[`image${index}`];
        if (!path) return null;
        const caption = artist[`image${index}_text` as keyof ArtistRow];
        return {
          src: path,
          caption: typeof caption === "string" ? caption : "",
        };
      })
      .filter((item): item is { src: string; caption: string } => Boolean(item));
  }, [artist, mediaUrls]);

  const heroMedia = mediaUrls.profile_image;
  const heroIsVideo = isVideoUrl(heroMedia);
  const heroImage = heroIsVideo ? undefined : heroMedia;
  const heroVideo = heroIsVideo ? heroMedia : undefined;
  const impactPhrase = artist?.profile_text2 || "Artista integrante da rede SMARTx.";
  const displayName = artist?.artistic_name || artist?.full_name || "Artista SMARTx";

  const textSections = [
    { title: "Visão Geral", content: artist?.visao_geral_titulo },
    { title: "História", content: artist?.historia_titulo },
    { title: "Carreira", content: artist?.carreira_titulo },
    { title: "Mais", content: artist?.mais_titulo },
  ];

  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="site-container space-y-10">
          {loading && (
            <div className="space-y-4">
              <div className="h-8 w-1/3 animate-pulse rounded bg-[var(--surface)]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface)]" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-48 animate-pulse rounded-2xl bg-[var(--surface)]" />
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[var(--radius)] border border-destructive/40 bg-destructive/10 p-6 text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && artist && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
                <div className="md:col-span-2 space-y-4">
                  <Link to="/artistas" className="text-sm text-[var(--muted)] hover:text-[var(--brand)]">
                    ← Voltar para Artistas
                  </Link>
                  <h1 className="text-4xl font-['League_Spartan'] font-bold">{displayName}</h1>
                  {impactPhrase && <p className="text-[var(--muted)]">{impactPhrase}</p>}
                  <div className="flex flex-wrap gap-3 pt-2 text-sm text-[var(--muted)]">
                    {artist?.country_residence && <span>{artist.country_residence}</span>}
                    {artist?.city && artist?.country_residence && <span>•</span>}
                    {artist?.city && <span>{artist.city}</span>}
                  </div>
                </div>
                <div className="md:justify-self-end">
                  {heroVideo ? (
                    <video
                      src={heroVideo}
                      className="h-44 w-44 rounded-2xl object-cover shadow-lg"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    heroImage && (
                      <img
                        src={heroImage}
                        alt={displayName}
                        className="h-44 w-44 rounded-2xl object-cover shadow-lg"
                      />
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-1)]">
                  <h2 className="text-lg font-semibold text-[var(--ink)]">Contato e Redes</h2>
                  <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                    {artist?.facebook && (
                      <li>
                        <a className="hover:text-[var(--brand)]" href={artist.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook · {formatLink(artist.facebook)}
                        </a>
                      </li>
                    )}
                    {artist?.instagram && (
                      <li>
                        <a className="hover:text-[var(--brand)]" href={artist.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram · {formatLink(artist.instagram)}
                        </a>
                      </li>
                    )}
                    {artist?.youtube_channel && (
                      <li>
                        <a className="hover:text-[var(--brand)]" href={artist.youtube_channel} target="_blank" rel="noopener noreferrer">
                          YouTube · {formatLink(artist.youtube_channel)}
                        </a>
                      </li>
                    )}
                    {artist?.music_spotify_apple && (
                      <li>
                        <a className="hover:text-[var(--brand)]" href={artist.music_spotify_apple} target="_blank" rel="noopener noreferrer">
                          Música · {formatLink(artist.music_spotify_apple)}
                        </a>
                      </li>
                    )}
                    {artist?.website && (
                      <li>
                        <a className="hover:text-[var(--brand)]" href={artist.website} target="_blank" rel="noopener noreferrer">
                          Website · {formatLink(artist.website)}
                        </a>
                      </li>
                    )}
                    {!artist?.facebook &&
                      !artist?.instagram &&
                      !artist?.youtube_channel &&
                      !artist?.music_spotify_apple &&
                      !artist?.website && <li>Nenhuma rede social cadastrada.</li>}
                  </ul>
                </div>

                <div className="md:col-span-2 space-y-6">
                  {textSections
                    .filter((section) => section.content && getPlainText(section.content).length > 0)
                    .map((section) => (
                      <section
                        key={section.title}
                        className="rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-1)]"
                      >
                        <h2 className="text-lg font-semibold text-[var(--ink)]">{section.title}</h2>
                        <div
                          className="prose prose-sm mt-4 max-w-none text-[var(--muted)]"
                          dangerouslySetInnerHTML={{ __html: section.content ?? "" }}
                        />
                      </section>
                    ))}

                  {(mediaUrls.audio || mediaUrls.video_banner_landscape || mediaUrls.video_banner_portrait || youtubeLinks.length > 0) && (
                    <section className="rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-1)]">
                      <h2 className="text-lg font-semibold text-[var(--ink)]">Mídia</h2>
                      <div className="mt-4 space-y-4">
                        {mediaUrls.audio && <audio controls src={mediaUrls.audio} className="w-full" />}
                        {mediaUrls.video_banner_landscape && (
                          <video controls src={mediaUrls.video_banner_landscape} className="w-full rounded-lg" />
                        )}
                        {mediaUrls.video_banner_portrait && (
                          <video controls src={mediaUrls.video_banner_portrait} className="w-full rounded-lg" />
                        )}
                        {youtubeLinks.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-[var(--ink)]">Vídeos</p>
                            <ul className="space-y-1 text-sm text-[var(--muted)]">
                              {youtubeLinks.map((link) => (
                                <li key={link}>
                                  <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand)]">
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {photos.length > 0 && (
                    <section className="rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-1)]">
                      <h2 className="text-lg font-semibold text-[var(--ink)]">Fotografias</h2>
                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                        {photos.map((photo, index) => (
                          <figure key={index} className="overflow-hidden rounded-xl border border-[var(--elev-border)] bg-[var(--surface)]">
                            <img src={photo.src} alt="" className="h-48 w-full object-cover" />
                            {photo.caption && (
                              <figcaption className="p-2 text-xs text-[var(--muted)]">{photo.caption}</figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
