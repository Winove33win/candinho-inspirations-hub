import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Facebook,
  Globe,
  Instagram,
  Music2,
  PlayCircle,
  Share2,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ArtistRow = Database["public"]["Tables"]["new_artist_details"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type EventRow = Database["public"]["Tables"]["events"]["Row"];
type TabKey = "overview" | "trajectory" | "career" | "more" | "media" | "photos" | "bio";

const photoIndexes = Array.from({ length: 12 }, (_, index) => index + 1);
const blockIndexes = [1, 2, 3, 4, 5] as const;
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

const getPlainText = (value?: string | null) =>
  value ? value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim() : "";

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname.includes("youtube.com")) {
      const id = videoUrl.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
      const pathId = videoUrl.pathname.split("/").pop();
      if (pathId) {
        return `https://www.youtube.com/embed/${pathId}`;
      }
    }
    if (videoUrl.hostname.includes("youtu.be")) {
      const id = videoUrl.pathname.replace("/", "");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch (error) {
    console.error("[YOUTUBE::PARSE]", error);
  }
  return url;
};

const formatDate = (date?: string | null) => {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [artist, setArtist] = useState<ArtistRow | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const overviewRef = useRef<HTMLDivElement>(null);
  const trajectoryRef = useRef<HTMLDivElement>(null);
  const careerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<TabKey, React.RefObject<HTMLDivElement>> = useMemo(
    () => ({
      overview: overviewRef,
      trajectory: trajectoryRef,
      career: careerRef,
      more: moreRef,
      media: mediaRef,
      photos: photosRef,
      bio: bioRef,
    }),
    [],
  );

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [artistResponse, projectsResponse, eventsResponse] = await Promise.all([
          supabase
            .from("new_artist_details")
            .select("*")
            .eq("member_id", id)
            .maybeSingle(),
          supabase
            .from("projects")
            .select("*")
            .eq("member_id", id)
            .eq("status", "published"),
          supabase
            .from("events")
            .select("*")
            .eq("member_id", id)
            .eq("status", "published")
            .order("date", { ascending: true }),
        ]);

        if (artistResponse.error) throw artistResponse.error;
        if (!artistResponse.data) {
          setError("Artista não encontrado");
          setArtist(null);
          setProjects([]);
          setEvents([]);
          return;
        }

        setArtist(artistResponse.data);
        setProjects(projectsResponse.data?.filter(Boolean) ?? []);
        setEvents(eventsResponse.data?.filter(Boolean) ?? []);
      } catch (fetchError) {
        console.error("[ARTIST::DETAIL]", fetchError);
        setError("Não foi possível carregar os dados do artista.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((event) => {
      if (!event.date) return true;
      const eventDate = new Date(`${event.date}T00:00:00`);
      return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
    });
  }, [events]);

  const youtubeLinks = useMemo(() => {
    if (!artist) return [] as string[];
    return youtubeKeys
      .map((key) => artist[key] || "")
      .filter((link) => link && link.startsWith("http"));
  }, [artist]);

  const photos = useMemo(() => {
    if (!artist) return [] as { src: string; caption: string }[];
    return photoIndexes
      .map((index) => {
        const image = artist[`image${index}` as keyof ArtistRow] as string | null;
        const caption = artist[`image${index}_text` as keyof ArtistRow] as string | null;
        if (!image) return null;
        return { src: image, caption: caption ?? "" };
      })
      .filter((item): item is { src: string; caption: string } => Boolean(item));
  }, [artist]);

  const artisticName = artist?.artistic_name || artist?.full_name || "Artista SMARTx";
  const headline = artist?.profile_text2 ? artist.profile_text2 : "Artista integrante da rede SMARTx.";
  const heroImage = artist?.profile_image;

  const handleTabChange = (value: string) => {
    const tab = value as TabKey;
    setActiveTab(tab);
    requestAnimationFrame(() => {
      sectionRefs[tab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    toast({
      title: isFollowing ? "Você deixou de seguir" : "Agora você está seguindo",
      description: artisticName,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: artisticName,
      text: headline,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link copiado", description: "URL do perfil copiada para a área de transferência." });
      }
    } catch (shareError) {
      console.error("[ARTIST::SHARE]", shareError);
      toast({
        title: "Não foi possível compartilhar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  };

  const handleOpenProject = (project: ProjectRow) => {
    const url = project.banner_image || project.cover_image;
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Projeto sem visualização",
        description: "Este projeto ainda não possui mídia pública cadastrada.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-alt)]">
        <div className="h-20 w-20 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl font-['League_Spartan'] font-semibold">{error ?? "Artista não encontrado"}</h1>
            <p className="text-[var(--muted)]">
              Tente novamente mais tarde ou explore outros artistas da rede SMARTx.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-16">
        <section className="relative isolate overflow-hidden">
          {artist.video_banner_landscape && (
            <video
              className="hidden h-full w-full object-cover md:block"
              src={artist.video_banner_landscape}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          {artist.video_banner_portrait && (
            <video
              className="block h-full w-full object-cover md:hidden"
              src={artist.video_banner_portrait}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          {!artist.video_banner_landscape && !artist.video_banner_portrait && heroImage && (
            <img
              src={heroImage}
              alt={artisticName}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" aria-hidden="true" />

          <div className="relative z-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between md:py-24">
              <div className="flex items-start gap-6">
                <div className="h-28 w-28 overflow-hidden rounded-[var(--radius)] border-4 border-white/20 bg-white/10 md:h-36 md:w-36">
                  {heroImage ? (
                    <img src={heroImage} alt={artisticName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                      {artisticName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="space-y-4 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em]">
                    Artista SMARTx
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-4xl font-['League_Spartan'] font-bold md:text-5xl">{artisticName}</h1>
                    {headline && <p className="max-w-2xl text-sm text-white/80 md:text-base">{headline}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={handleFollow} variant="primary">
                      {isFollowing ? "Seguindo" : "Seguir"}
                    </Button>
                    <Button onClick={handleShare} variant="secondary">
                      <Share2 className="h-4 w-4" />
                      Compartilhar
                    </Button>
                    {artist.audio && (
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                        onClick={() => {
                          setActiveTab("media");
                          requestAnimationFrame(() => {
                            mediaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          });
                        }}
                      >
                        <PlayCircle className="h-4 w-4" /> Ouça-me
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <TabsList
              aria-label="Navegação pública do artista"
              className="sticky top-16 z-30 flex w-full gap-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-white/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/80"
            >
              <TabsTrigger value="overview" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="trajectory" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Trajetória
              </TabsTrigger>
              <TabsTrigger value="career" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Carreira
              </TabsTrigger>
              <TabsTrigger value="more" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Mais
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Mídia
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Fotos
              </TabsTrigger>
              <TabsTrigger value="bio" className="flex-1 min-w-[140px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow">
                Bio & Redes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" ref={overviewRef} className="space-y-10 focus-visible:outline-none">
              {artist.visao_geral_titulo && (
                <div className="prose max-w-none text-[var(--ink)] prose-headings:font-['League_Spartan'] prose-p:text-[var(--ink)]">
                  <div dangerouslySetInnerHTML={{ __html: artist.visao_geral_titulo }} />
                </div>
              )}

              {projects.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Projetos recentes</h2>
                    <span className="text-sm text-[var(--muted)]">{projects.length} projetos publicados</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                      <Card key={project.id} className="overflow-hidden transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md">
                        {(project.cover_image || project.banner_image) && (
                          <div className="relative h-44 w-full overflow-hidden">
                            <img
                              src={project.cover_image || project.banner_image || ""}
                              alt={project.title || "Projeto"}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
                          </div>
                        )}
                        <div className="space-y-3 p-6">
                          <h3 className="text-lg font-semibold text-[var(--ink)]">{project.title || "Projeto sem título"}</h3>
                          {project.about && (
                            <div
                              className="prose prose-sm max-w-none text-[var(--muted)] line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: project.about }}
                            />
                          )}
                          <div className="flex flex-wrap gap-2">
                            {blockIndexes
                              .map((index) => getPlainText(project[`block${index}_title` as keyof ProjectRow] as string | null))
                              .filter(Boolean)
                              .slice(0, 3)
                              .map((label, index) => (
                                <span
                                  key={`${project.id}-chip-${index}`}
                                  className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand)]"
                                >
                                  {label}
                                </span>
                              ))}
                          </div>
                          <Button onClick={() => handleOpenProject(project)} className="mt-2" variant="secondary">
                            Ver projeto
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {upcomingEvents.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Próximos eventos</h2>
                    <span className="text-sm text-[var(--muted)]">{upcomingEvents.length} eventos ativos</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {upcomingEvents.map((event) => {
                      const formattedDate = formatDate(event.date);
                      const timeLabel = [event.start_time, event.end_time].filter(Boolean).join(" - ");
                      return (
                        <Card key={event.id} className="overflow-hidden transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md">
                          {event.banner && (
                            <img src={event.banner} alt={event.name || "Evento"} className="h-40 w-full object-cover" />
                          )}
                          <div className="space-y-3 p-6">
                            <h3 className="text-lg font-semibold text-[var(--ink)]">{event.name || "Evento"}</h3>
                            <p className="text-sm font-semibold text-[var(--brand)]">
                              {formattedDate ?? "Data a definir"}
                              {timeLabel && <span className="text-[var(--muted)]"> · {timeLabel}</span>}
                            </p>
                            {event.place && <p className="text-sm text-[var(--muted)]">{event.place}</p>}
                            {event.description && (
                              <div
                                className="prose prose-sm max-w-none text-[var(--muted)] line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                              />
                            )}
                            {event.cta_link && (
                              <Button asChild variant="secondary" className="mt-2">
                                <a href={event.cta_link} target="_blank" rel="noopener noreferrer">
                                  Garanta seu ingresso
                                </a>
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="trajectory" ref={trajectoryRef} className="space-y-6 focus-visible:outline-none">
              {artist.historia_titulo ? (
                <div className="prose max-w-none text-[var(--ink)]">
                  <div dangerouslySetInnerHTML={{ __html: artist.historia_titulo }} />
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">Trajetória pessoal em atualização.</p>
              )}
            </TabsContent>

            <TabsContent value="career" ref={careerRef} className="space-y-6 focus-visible:outline-none">
              {artist.carreira_titulo ? (
                <div className="prose max-w-none text-[var(--ink)]">
                  <div dangerouslySetInnerHTML={{ __html: artist.carreira_titulo }} />
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">Carreira em atualização.</p>
              )}
            </TabsContent>

            <TabsContent value="more" ref={moreRef} className="space-y-6 focus-visible:outline-none">
              {artist.mais_titulo ? (
                <div className="prose max-w-none text-[var(--ink)]">
                  <div dangerouslySetInnerHTML={{ __html: artist.mais_titulo }} />
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">Mais informações em breve.</p>
              )}
            </TabsContent>

            <TabsContent value="media" ref={mediaRef} className="space-y-8 focus-visible:outline-none">
              {artist.audio && (
                <Card className="space-y-3 p-6 md:p-8">
                  <div className="flex items-center gap-3 text-[var(--ink)]">
                    <Music2 className="h-5 w-5 text-[var(--brand)]" />
                    <h3 className="text-lg font-semibold">Ouça-me</h3>
                  </div>
                  <audio controls src={artist.audio} className="w-full" aria-label="Áudio principal do artista" />
                </Card>
              )}

              {youtubeLinks.length > 0 && (
                <Card className="space-y-4 p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-[var(--ink)]">Vídeos em destaque</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {youtubeLinks.map((link, index) => (
                      <div key={`youtube-${index}`} className="aspect-video overflow-hidden rounded-[var(--radius)] bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(link)}
                          title={`Vídeo ${index + 1}`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {!artist.audio && youtubeLinks.length === 0 && (
                <p className="text-sm text-[var(--muted)]">Nenhuma mídia disponível neste momento.</p>
              )}
            </TabsContent>

            <TabsContent value="photos" ref={photosRef} className="space-y-6 focus-visible:outline-none">
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {photos.map((photo, index) => (
                    <figure
                      key={photo.src}
                      className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm"
                    >
                      <img src={photo.src} alt={photo.caption || `Fotografia ${index + 1}`} className="h-48 w-full object-cover" />
                      {photo.caption && (
                        <figcaption className="px-4 py-3 text-sm text-[var(--muted)]">{photo.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">Nenhuma fotografia pública cadastrada.</p>
              )}
            </TabsContent>

            <TabsContent value="bio" ref={bioRef} className="space-y-6 focus-visible:outline-none">
              {artist.biography1 && (
                <Card className="flex items-center justify-between gap-4 p-6 md:p-8">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">Biografia oficial</h3>
                    <p className="text-sm text-[var(--muted)]">Acesse o documento completo em PDF ou DOC.</p>
                  </div>
                  <Button asChild variant="secondary">
                    <a href={artist.biography1} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Abrir biografia
                    </a>
                  </Button>
                </Card>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[var(--ink)]">Redes e plataformas</h3>
                <div className="flex flex-wrap gap-3">
                  {artist.facebook && (
                    <Button asChild variant="secondary">
                      <a href={artist.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" /> Facebook
                      </a>
                    </Button>
                  )}
                  {artist.instagram && (
                    <Button asChild variant="secondary">
                      <a href={artist.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" /> Instagram
                      </a>
                    </Button>
                  )}
                  {artist.youtube_channel && (
                    <Button asChild variant="secondary">
                      <a href={artist.youtube_channel} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4" /> YouTube
                      </a>
                    </Button>
                  )}
                  {artist.music_spotify_apple && (
                    <Button asChild variant="secondary">
                      <a href={artist.music_spotify_apple} target="_blank" rel="noopener noreferrer">
                        <Music2 className="h-4 w-4" /> Spotify / Apple Music
                      </a>
                    </Button>
                  )}
                  {artist.website && (
                    <Button asChild variant="secondary">
                      <a href={artist.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" /> Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
