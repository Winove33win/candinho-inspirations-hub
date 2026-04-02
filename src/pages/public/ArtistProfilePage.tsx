import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Globe, Instagram, Facebook, Youtube, Music2,
  MapPin, ChevronDown, Play, ArrowLeft,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArtistPublic } from "@/hooks/useArtistPublic";
import type { ArtistPublic } from "@/hooks/useArtistPublic";
import { useInfiniteChunk } from "@/hooks/useInfiniteChunk";
import LoadMore from "@/components/common/LoadMore";
import ProjectMiniCard, { ProjectMini } from "@/components/artist/ProjectMiniCard";
import EventMiniCard, { EventMini } from "@/components/artist/EventMiniCard";
import Lightbox, { LightboxItem } from "@/components/media/Lightbox";
import "@/styles/artist.css";

/* ── utils ──────────────────────────────────────────────────────── */
function toPlainText(value?: string | null) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function truncate(value: string, max = 160) {
  return value.length <= max ? value : `${value.slice(0, max - 1).trim()}…`;
}

/* ── SEO ─────────────────────────────────────────────────────────── */
function useArtistSeo(artist?: ArtistPublic) {
  const plainVision = artist?.vision ? toPlainText(artist.vision) : "";
  const plainHistory = artist?.history ? toPlainText(artist.history) : "";
  const metaDescription = truncate(
    plainVision || plainHistory || `Conheça ${artist?.stageName ?? "artista"} na rede SMARTx.`
  );

  useEffect(() => {
    if (!artist) return;
    const prev = document.title;
    const title = `${artist.stageName} | SMARTx`;
    document.title = title;

    const metas = [
      { attr: "name", key: "description", content: metaDescription },
      { attr: "property", key: "og:title", content: title },
      { attr: "property", key: "og:description", content: metaDescription },
      { attr: "property", key: "og:type", content: "profile" },
      { attr: "property", key: "og:image", content: artist.coverUrl ?? artist.avatarUrl ?? "" },
      { attr: "name", key: "twitter:card", content: artist.coverUrl || artist.avatarUrl ? "summary_large_image" : "summary" },
      { attr: "name", key: "twitter:title", content: title },
      { attr: "name", key: "twitter:description", content: metaDescription },
      { attr: "name", key: "twitter:image", content: artist.coverUrl ?? artist.avatarUrl ?? "" },
    ];

    const saved = metas.map(({ attr, key, content }) => {
      const sel = `meta[${attr}='${key}']`;
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      let created = false;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); created = true; }
      const prev = el.getAttribute("content");
      if (content) el.setAttribute("content", content); else el.removeAttribute("content");
      return { el, prev, created };
    });

    const scriptId = "artist-profile-jsonld";
    let ld = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!ld) { ld = document.createElement("script"); ld.type = "application/ld+json"; ld.id = scriptId; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Person",
      name: artist.stageName, url: window.location.href,
      sameAs: artist.socials?.map(s => s.url).filter(Boolean),
      image: artist.avatarUrl ?? artist.coverUrl ?? undefined,
    });

    return () => {
      document.title = prev;
      saved.forEach(({ el, prev: p, created }) => {
        if (created) el.remove();
        else if (p) el.setAttribute("content", p);
        else el.removeAttribute("content");
      });
      ld?.remove();
    };
  }, [artist, metaDescription]);
}

/* ── Social icon helper ──────────────────────────────────────────── */
function SocialIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("instagram")) return <Instagram className="h-4 w-4" />;
  if (l.includes("facebook")) return <Facebook className="h-4 w-4" />;
  if (l.includes("youtube")) return <Youtube className="h-4 w-4" />;
  if (l.includes("spotify") || l.includes("apple") || l.includes("music")) return <Music2 className="h-4 w-4" />;
  return <Globe className="h-4 w-4" />;
}

/* ── Video helpers ───────────────────────────────────────────────── */
interface VideoItem { url: string; provider?: "youtube" | "vimeo" | "file" }

function extractYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      return u.pathname.split("/").filter(Boolean).pop() ?? null;
    }
  } catch { /* noop */ }
  return null;
}
function extractVimeoId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo")) return u.pathname.split("/").filter(Boolean).pop() ?? null;
  } catch { /* noop */ }
  return null;
}
function toEmbedSrc(v: VideoItem): string | null {
  if (!v.url) return null;
  const p = v.provider;
  const lower = v.url.toLowerCase();
  if (p === "youtube" || lower.includes("youtu")) { const id = extractYouTubeId(v.url); return id ? `https://www.youtube.com/embed/${id}` : null; }
  if (p === "vimeo" || lower.includes("vimeo")) { const id = extractVimeoId(v.url); return id ? `https://player.vimeo.com/video/${id}` : null; }
  if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/.test(lower) || p === "file") return v.url;
  return v.url;
}
function getYouTubeThumbnail(url: string) {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/* ── Expandable bio section ──────────────────────────────────────── */
function BioSection({ title, html }: { title: string; html?: string | null }) {
  const [open, setOpen] = useState(true);
  if (!html) return null;
  return (
    <div className="ap-bio-block">
      <button
        type="button"
        className="ap-bio-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="ap-bio-title">{title}</span>
        <ChevronDown className={`ap-bio-chevron${open ? " ap-bio-chevron--open" : ""}`} />
      </button>
      {open && (
        <div
          className="ap-bio-body prose-artist"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

/* ── Anchor nav ──────────────────────────────────────────────────── */
function AnchorNav({ hasPhotos, hasVideos, hasProjects, hasEvents, hasSocials }: {
  hasPhotos: boolean; hasVideos: boolean; hasProjects: boolean; hasEvents: boolean; hasSocials: boolean;
}) {
  const items = [
    { href: "#sobre", label: "Sobre" },
    hasPhotos && { href: "#fotos", label: "Fotos" },
    hasVideos && { href: "#videos", label: "Vídeos" },
    hasProjects && { href: "#projetos", label: "Projetos" },
    hasEvents && { href: "#eventos", label: "Eventos" },
    hasSocials && { href: "#contato", label: "Contato" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <nav className="ap-nav" aria-label="Seções do perfil">
      <div className="ap-nav__inner">
        {items.map(item => (
          <a key={item.href} href={item.href} className="ap-nav__link">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ── Status page ─────────────────────────────────────────────────── */
function StatusPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center pt-24 pb-20">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-3 text-sm text-white/50">{message}</p>
          <Link to="/artistas" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e11d48]">
            <ArrowLeft className="h-4 w-4" /> Ver todos os artistas
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function ArtistProfilePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: artist, isLoading, error } = useArtistPublic(slug);

  useArtistSeo(artist);

  const [lbItems, setLbItems] = useState<LightboxItem[] | null>(null);
  const [lbIndex, setLbIndex] = useState(0);
  const openLb = (items: LightboxItem[], i = 0) => { setLbItems(items); setLbIndex(i); };
  const closeLb = () => setLbItems(null);

  const projects = (artist?.projects ?? []).filter(Boolean);
  const events = (artist?.events ?? []).filter(Boolean);

  const {
    visible: projectsVisible, canLoadMore: projMore, loadMore: projNext,
    sentinelRef: projSentinel, busy: projBusy, ioSupported: projIO, reset: projReset,
  } = useInfiniteChunk({ items: projects, batch: 6 });
  const {
    visible: eventsVisible, canLoadMore: evMore, loadMore: evNext,
    sentinelRef: evSentinel, busy: evBusy, ioSupported: evIO, reset: evReset,
  } = useInfiniteChunk({ items: events, batch: 6 });

  useEffect(() => { projReset(); evReset(); }, [artist?.id, projReset, evReset]);

  if (error) {
    const msg = (error as Error).message;
    return <StatusPage title="Não foi possível carregar o artista." message={msg === "artist_not_found" ? "Artista não encontrado." : "Erro interno ao carregar o artista."} />;
  }
  if (isLoading) return <StatusPage title="Carregando…" message="Estamos preparando o perfil com todos os detalhes." />;
  if (!artist) return <StatusPage title="Artista não encontrado." message="Verifique o link ou explore outros talentos da plataforma." />;

  const socials = (artist.socials ?? []).filter(s => s?.url);
  const photos = (artist.photos ?? []).filter(p => p?.url);
  const videos = (artist.videos ?? []).filter(v => v?.url) as VideoItem[];
  const locationParts = [artist.city, artist.country].filter(Boolean);

  const photoItems: LightboxItem[] = photos.map(p => ({ type: "image", src: p.url, alt: p.alt?.trim() || artist.stageName }));
  const videoItems: LightboxItem[] = videos.map((v, i) => ({ type: "video", src: toEmbedSrc(v) || v.url, title: `Vídeo ${i + 1} — ${artist.stageName}` }));

  const hasBio = !!(artist.vision || artist.history || artist.career || artist.more);

  return (
    <div className="ap-root">
      <Header />

      {/* ── Hero ── */}
      <section className="ap-hero">
        <div className="ap-hero__bg" aria-hidden="true">
          {artist.coverUrl ? (
            <img src={artist.coverUrl} alt="" />
          ) : artist.avatarUrl ? (
            <img src={artist.avatarUrl} alt="" style={{ filter: "brightness(0.35) saturate(0.5) blur(8px)", transform: "scale(1.08)" }} />
          ) : (
            <div className="ap-hero__fallback" />
          )}
          <div className="ap-hero__gradient" />
        </div>

        <div className="ap-hero__content">
          <Link to="/artistas" className="ap-hero__back">
            <ArrowLeft className="h-4 w-4" /> Artistas
          </Link>

          <div className="ap-hero__bottom">
            <div className="ap-hero__avatar">
              {artist.avatarUrl ? (
                <img src={artist.avatarUrl} alt={`Foto de ${artist.stageName}`} />
              ) : (
                <div className="ap-hero__avatar-fallback">
                  {artist.stageName[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="ap-hero__info">
              {artist.category && (
                <span className="ap-hero__category">{artist.category}</span>
              )}
              <h1 className="ap-hero__name">{artist.stageName}</h1>
              <div className="ap-hero__meta">
                {locationParts.length > 0 && (
                  <span className="ap-hero__location">
                    <MapPin className="h-3.5 w-3.5" />
                    {locationParts.join(", ")}
                  </span>
                )}
              </div>
              <div className="ap-hero__actions">
                {photos.length > 0 && <a href="#fotos" className="ap-btn">Fotos</a>}
                {videos.length > 0 && <a href="#videos" className="ap-btn">Vídeos</a>}
                {socials[0] && (
                  <a href={socials[0].url} target="_blank" rel="noopener noreferrer" className="ap-btn ap-btn--accent">
                    Contato
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Anchor nav ── */}
      <AnchorNav
        hasPhotos={photos.length > 0}
        hasVideos={videos.length > 0}
        hasProjects={projects.length > 0}
        hasEvents={events.length > 0}
        hasSocials={socials.length > 0}
      />

      {/* ── Main content ── */}
      <main className="ap-content">

        {/* Sobre */}
        <section id="sobre" className="ap-section">
          <div className="ap-about-grid">
            <div>
              {hasBio ? (
                <div className="ap-bio">
                  <BioSection title="Visão Geral" html={artist.vision} />
                  <BioSection title="História" html={artist.history} />
                  <BioSection title="Carreira" html={artist.career} />
                  <BioSection title="Mais" html={artist.more} />
                </div>
              ) : (
                <p className="ap-empty">Biografia em breve.</p>
              )}
            </div>

            {socials.length > 0 && (
              <aside id="contato" className="ap-sidebar">
                <p className="ap-sidebar__label">Contatos & Redes</p>
                <div className="ap-socials">
                  {socials.map(s => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ap-social-item"
                    >
                      <span className="ap-social-icon">
                        <SocialIcon label={s.label} />
                      </span>
                      <span className="ap-social-label">{s.label}</span>
                    </a>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>

        {/* Fotos */}
        {photos.length > 0 && (
          <section id="fotos" className="ap-section">
            <h2 className="ap-section__title">Galeria de Fotos</h2>
            <div className={`ap-photos ap-photos--${Math.min(photos.length, 3)}col`}>
              {photos.map((photo, i) => (
                <button
                  key={`${photo.url}-${i}`}
                  type="button"
                  className={`ap-photo${i === 0 && photos.length > 2 ? " ap-photo--featured" : ""}`}
                  onClick={() => openLb(photoItems, i)}
                  aria-label="Ampliar foto"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt?.trim() || artist.stageName}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Vídeos */}
        {videos.length > 0 && (
          <section id="videos" className="ap-section">
            <h2 className="ap-section__title">Vídeos</h2>
            <div className="ap-videos">
              {videos.map((v, i) => {
                const src = toEmbedSrc(v);
                const thumb = getYouTubeThumbnail(v.url);
                return (
                  <button
                    key={`${v.url}-${i}`}
                    type="button"
                    className="ap-video"
                    onClick={() => openLb(videoItems, i)}
                    aria-label={`Assistir vídeo ${i + 1} de ${artist.stageName}`}
                  >
                    {thumb ? (
                      <img src={thumb} alt="" loading="lazy" className="ap-video__thumb" />
                    ) : src && /(\.mp4|\.webm)/.test(src) ? (
                      <video src={src} muted playsInline preload="metadata" className="ap-video__thumb" />
                    ) : (
                      <div className="ap-video__placeholder" />
                    )}
                    <div className="ap-video__overlay">
                      <span className="ap-video__play">
                        <Play className="h-6 w-6 fill-white" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Projetos */}
        {projects.length > 0 && (
          <section id="projetos" className="ap-section">
            <h2 className="ap-section__title">Projetos em Destaque</h2>
            <div className="mini-list">
              {projectsVisible.map(project => {
                const href = `/artistas/${artist.slug || slug}/projetos/${project.id}`;
                const mini: ProjectMini = { id: project.id, title: project.title, coverUrl: project.coverUrl, bannerUrl: project.bannerUrl, about: project.about, partners: project.partners, teamArt: project.teamArt, teamTech: project.teamTech, projectSheetUrl: project.projectSheetUrl, href };
                return <ProjectMiniCard key={project.id} project={mini} />;
              })}
            </div>
            <div ref={projSentinel} className="sentinel" aria-hidden="true" />
            <LoadMore onClick={projNext} busy={projBusy} hidden={!projMore || (projIO && !projBusy)} label="Ver mais projetos" />
          </section>
        )}

        {/* Eventos */}
        {events.length > 0 && (
          <section id="eventos" className="ap-section">
            <h2 className="ap-section__title">Eventos</h2>
            <div className="mini-list">
              {eventsVisible.map(event => {
                const href = event.ctaLink || `/artistas/${artist.slug || slug}/eventos/${event.id}`;
                const mini: EventMini = { id: event.id, name: event.name, bannerUrl: event.bannerUrl, date: event.date, startTime: event.startTime, endTime: event.endTime, place: event.place, description: event.description, href };
                return <EventMiniCard key={event.id} event={mini} />;
              })}
            </div>
            <div ref={evSentinel} className="sentinel" aria-hidden="true" />
            <LoadMore onClick={evNext} busy={evBusy} hidden={!evMore || (evIO && !evBusy)} label="Ver mais eventos" />
          </section>
        )}
      </main>

      <Footer />
      {lbItems && <Lightbox items={lbItems} startIndex={lbIndex} onClose={closeLb} />}
    </div>
  );
}
