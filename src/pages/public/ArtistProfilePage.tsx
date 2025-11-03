import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArtistPublic } from "@/hooks/useArtistPublic";
import type { ArtistEventPublic, ArtistPublic } from "@/hooks/useArtistPublic";
import "@/styles/artist.css";
import Lightbox, { LightboxItem } from "@/components/media/Lightbox";

type ArtistStat = NonNullable<ArtistPublic["stats"]>[number];

/* -------------------- utils -------------------- */
function toPlainText(value?: string | null) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function truncate(value: string, max = 160) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function formatDateDisplay(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(parsed);
  } catch {
    return value;
  }
}

function formatTimeDisplay(value?: string) {
  if (!value) return undefined;
  const isoLike = value.includes("T") ? value : `1970-01-01T${value}`;
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) return value;
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  } catch {
    return value;
  }
}

function buildEventSchedule(event: ArtistEventPublic) {
  const date = formatDateDisplay(event.date);
  const start = formatTimeDisplay(event.startTime);
  const end = formatTimeDisplay(event.endTime);
  const timeRange = start && end ? `${start} – ${end}` : start || end;
  return [date, timeRange].filter(Boolean).join(" • ");
}

/* -------------------- SEO + JSON-LD -------------------- */
function useArtistSeo(artist?: ArtistPublic) {
  const plainVision = artist?.vision ? toPlainText(artist.vision) : "";
  const plainHistory = artist?.history ? toPlainText(artist.history) : "";
  const descriptionSource = plainVision || plainHistory;
  const metaDescription = truncate(
    descriptionSource || `Conheça ${artist?.stageName ?? "artista"} na rede SMARTx.`
  );

  useEffect(() => {
    if (!artist) return;

    const previousTitle = document.title;
    const title = `${artist.stageName} | SMARTx`;
    document.title = title;

    const metaConfigs = [
      { attr: "name", key: "description", content: metaDescription },
      { attr: "property", key: "og:title", content: title },
      { attr: "property", key: "og:description", content: metaDescription },
      { attr: "property", key: "og:type", content: "profile" },
      { attr: "property", key: "og:image", content: artist.coverUrl ?? artist.avatarUrl ?? "" },
      {
        attr: "name",
        key: "twitter:card",
        content: artist.coverUrl || artist.avatarUrl ? "summary_large_image" : "summary",
      },
      { attr: "name", key: "twitter:title", content: title },
      { attr: "name", key: "twitter:description", content: metaDescription },
      { attr: "name", key: "twitter:image", content: artist.coverUrl ?? artist.avatarUrl ?? "" },
    ];

    const previousMeta = metaConfigs.map((config) => {
      const selector = `meta[${config.attr}='${config.key}']`;
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      let created = false;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(config.attr, config.key);
        document.head.appendChild(element);
        created = true;
      }
      const previousContent = element.getAttribute("content");
      if (config.content) element.setAttribute("content", config.content);
      else element.removeAttribute("content");
      return { element, previousContent, created };
    });

    const scriptId = "artist-profile-jsonld";
    let jsonLdEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: artist.stageName,
      url: window.location.href,
      sameAs: artist.socials?.map((item) => item.url).filter(Boolean),
      image: artist.avatarUrl ?? artist.coverUrl ?? undefined,
    };

    if (!jsonLdEl) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.id = scriptId;
      document.head.appendChild(jsonLdEl);
    }
    jsonLdEl.textContent = JSON.stringify(jsonLdData);

    return () => {
      document.title = previousTitle;
      previousMeta.forEach(({ element, previousContent, created }) => {
        if (created) element.remove();
        else if (previousContent) element.setAttribute("content", previousContent);
        else element.removeAttribute("content");
      });
      if (jsonLdEl) jsonLdEl.remove();
    };
  }, [artist, metaDescription]);
}

function ArtistPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="site-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

/* -------------------- SectionTabs (guias laterais) -------------------- */
function SectionTabs({
  sections,
  initialIndex = 0,
}: {
  sections: { title: string; html?: string | null }[];
  initialIndex?: number;
}) {
  const [active, setActive] = useState(initialIndex);
  const currentIndex = sections.length > 0 ? Math.min(active, sections.length - 1) : 0;
  const current = sections[currentIndex];

  return (
    <div className="card section">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[220px,1fr] lg:items-start">
        <nav className="flex flex-row gap-3 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
          {sections.map((s, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={`w-full min-w-[160px] rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent,#e11d48)] ${
                  isActive
                    ? "border-[var(--accent,#e11d48)] bg-white/5 text-white shadow"
                    : "border-[var(--border,#26262a)] bg-transparent text-[#a1a1aa] hover:border-[var(--accent,#e11d48)] hover:bg-white/5"
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </nav>
        <div className="flex-1 space-y-3">
          <h3 className="title-lg">{current?.title}</h3>
          {current?.html ? (
            <div className="text-md" dangerouslySetInnerHTML={{ __html: current.html }} />
          ) : (
            <p className="text-md">Conteúdo não informado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- SectionCard util -------------------- */
interface SectionContentProps {
  html?: string | null;
  clamp?: boolean;
}
function SectionContent({ html, clamp }: SectionContentProps) {
  const [expanded, setExpanded] = useState(false);
  if (!html) return <p className="text-md">Conteúdo não informado.</p>;
  return (
    <div>
      <div
        className={`text-md${clamp && !expanded ? " clamp-8" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {clamp && !expanded && (
        <button type="button" className="btn" style={{ marginTop: "12px" }} onClick={() => setExpanded(true)}>
          Ler mais
        </button>
      )}
    </div>
  );
}
interface SectionCardProps {
  title: string;
  html?: string | null;
  clamp?: boolean;
  children?: ReactNode;
}
function SectionCard({ title, html, clamp, children }: SectionCardProps) {
  return (
    <div className="card section">
      <h2 className="title-lg">{title}</h2>
      {html !== undefined ? <SectionContent html={html} clamp={clamp} /> : children}
    </div>
  );
}

/* -------------------- Hero -------------------- */
interface HeroProps {
  name: string;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  pills?: string[];
  highlight?: string;
  actions?: ReactNode;
}
function Hero({ name, coverUrl, avatarUrl, pills = [], highlight, actions }: HeroProps) {
  return (
    <header className="sticky-hero">
      <div className="container hero">
        <div className="hero-media" aria-hidden={coverUrl ? undefined : true}>
          {coverUrl ? (
            <img src={coverUrl} alt={`Capa de ${name}`} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "radial-gradient(circle at 15% 0%, rgba(225,29,72,.35), transparent 60%), #121214",
              }}
            />
          )}
        </div>

        <div className="hero-overlay">
          <div className="hero-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={`Retrato de ${name}`} />
            ) : (
              <div
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, rgba(225,29,72,.45), rgba(30,30,35,.95))",
                }}
              />
            )}
          </div>

          <div>
            <h1 className="hero-name">{name}</h1>

            {(pills?.length || highlight) ? (
              <div className="pills" style={{ marginTop: 8 }}>
                {pills?.map((item, i) => (
                  <span className="pill" key={`${item}-${i}`}>
                    {item}
                  </span>
                ))}
                {highlight && <span className="pill">{highlight}</span>}
              </div>
            ) : null}

            <div className="hero-actions">{actions}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------- Stats + Media helpers -------------------- */
interface StatPillsProps {
  stats?: { key: string; value: number | string }[];
  title?: string;
}
function StatPills({ stats, title = "Destaques" }: StatPillsProps) {
  if (!stats || stats.length === 0) return null;
  return (
    <div className="card section">
      <h2 className="title-lg">{title}</h2>
      <div className="pills">
        {stats.map((stat, index) => (
          <span className="pill" key={`${stat.key}-${stat.value}-${index}`}>
            <strong style={{ color: "#f5f5f6", fontWeight: 700 }}>
              {typeof stat.value === "number" ? stat.value.toLocaleString("pt-BR") : stat.value}
            </strong>
            {stat.key ? ` ${stat.key}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

interface MediaGridProps<T> {
  items?: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage: string;
}
function MediaGrid<T>({ items, renderItem, emptyMessage }: MediaGridProps<T>) {
  if (!items || items.length === 0) return <p className="text-md">{emptyMessage}</p>;
  return <div className="media-grid">{items.map((item, index) => renderItem(item, index))}</div>;
}

interface VideoItem {
  url: string;
  provider?: "youtube" | "vimeo" | "file";
}
function extractYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu")) {
      if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    }
  } catch {}
  return null;
}
function extractVimeoId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("vimeo")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    }
  } catch {}
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
  if (provider === "file") return video.url;

  const lower = video.url.toLowerCase();
  if (lower.includes("youtu")) {
    const id = extractYouTubeId(video.url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (lower.includes("vimeo")) {
    const id = extractVimeoId(video.url);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/.test(lower)) return video.url;
  return video.url;
}
function formatStatValue(value: string | number) {
  return typeof value === "number" ? value.toLocaleString("pt-BR") : value;
}

/* -------------------- Page -------------------- */
export default function ArtistProfilePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: artist, isLoading, error } = useArtistPublic(slug);

  useArtistSeo(artist);

  const [lbItems, setLbItems] = useState<LightboxItem[] | null>(null);
  const [lbIndex, setLbIndex] = useState<number>(0);
  const openLightbox = (items: LightboxItem[], index = 0) => {
    setLbItems(items);
    setLbIndex(index);
  };
  const closeLightbox = () => setLbItems(null);

  const renderStatus = (title: string, message: string) => (
    <ArtistPageShell>
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-8 text-[var(--ink)] shadow-[var(--shadow-1)]">
        <h2 className="text-2xl font-semibold text-[var(--ink)]">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{message}</p>
      </div>
    </ArtistPageShell>
  );

  if (error) {
    const friendlyMessage = (() => {
      const message = (error as Error).message;
      if (message === "artist_not_found") return "Artista não encontrado.";
      if (message === "internal_error") return "Erro interno ao carregar o artista.";
      return message;
    })();

    return renderStatus("Ops! Não foi possível carregar o artista.", friendlyMessage);
  }

  if (isLoading) {
    return renderStatus(
      "Carregando artista…",
      "Estamos preparando o perfil com todos os detalhes."
    );
  }

  if (!artist) {
    return renderStatus(
      "Artista não encontrado.",
      "Verifique o link ou explore outros talentos disponíveis na plataforma."
    );
  }

  const socialLinks = (artist.socials ?? []).filter((item) => item && item.url);
  const heroPills = [artist.country, artist.city].filter(
    (item): item is string => !!item && item.trim().length > 0
  );
  const stats = (artist.stats ?? []).filter(
    (stat): stat is ArtistStat =>
      stat != null && stat.value != null && `${stat.value}`.toString().trim().length > 0
  );
  const [primaryStat, ...otherStats] = stats;
  const highlight = primaryStat
    ? [formatStatValue(primaryStat.value), primaryStat.key].filter(Boolean).join(" · ") ||
      formatStatValue(primaryStat.value)
    : undefined;
  const statPills = otherStats.map((stat) => ({
    key: stat.key,
    value: formatStatValue(stat.value),
  }));
  const photos = (artist.photos ?? []).filter((photo) => photo && photo.url);
  const videos = (artist.videos ?? []).filter((video) => video && video.url) as VideoItem[];
  const projects = (artist.projects ?? []).filter(
    (project): project is NonNullable<typeof project> => !!project
  );
  const events = (artist.events ?? []).filter(
    (event): event is NonNullable<typeof event> => !!event
  );
  const primaryContact = socialLinks[0];

  const heroActions = (
    <>
      <button type="button" className="btn btn--accent">Seguir</button>
      <a className="btn" href="#fotos">Fotos</a>
      <a className="btn" href="#videos">Vídeos</a>
      {primaryContact ? (
        <a className="btn" href={primaryContact.url} target="_blank" rel="noopener noreferrer">
          Contato
        </a>
      ) : (
        <button type="button" className="btn" disabled aria-disabled="true" style={{ opacity: 0.45, cursor: "not-allowed" }}>
          Contato
        </button>
      )}
    </>
  );

  const photoItems: LightboxItem[] = photos.map((p) => ({
    type: "image",
    src: p.url,
    alt: p.alt && p.alt.trim().length > 0 ? p.alt : artist.stageName,
  }));

  const videoItems: LightboxItem[] = videos.map((v, i) => ({
    type: "video",
    src: toEmbedSrc(v) || v.url,
    title: `Vídeo ${i + 1} — ${artist.stageName}`,
  }));

  return (
    <ArtistPageShell>
      <div className="artist-page overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[#0f0f10] shadow-[0_32px_120px_rgba(12,10,10,0.6)]">
        <Hero
          name={artist.stageName}
          coverUrl={artist.coverUrl}
          avatarUrl={artist.avatarUrl}
          pills={heroPills}
          highlight={highlight}
          actions={heroActions}
        />

        <div className="container h-grid pb-16 pt-10">
          <aside className="card contact-card">
            <h2 className="title-lg">Contatos & Redes</h2>

            {socialLinks.length > 0 ? (
              <ul className="social-list">
                {socialLinks.map((item) => (
                  <li className="social-item" key={item.url}>
                    <span className="social-dot" aria-hidden="true" />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${item.label || "link externo"}`}
                      title={item.label || item.url}
                    >
                      {item.label || item.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-md" style={{ marginTop: 12 }}>
                Nenhum contato informado até o momento.
              </p>
            )}
          </aside>

          <section>
            <StatPills stats={statPills} title="Números & Reconhecimentos" />

            {/* Guias laterais de apresentação */}
            <SectionTabs
              sections={[
                { title: "Visão Geral", html: artist.vision ?? "" },
                { title: "História", html: artist.history ?? "" },
                { title: "Carreira", html: artist.career ?? "" },
                { title: "Mais", html: artist.more ?? "" },
              ]}
            />

            {projects.length > 0 && (
              <div className="section" id="projetos">
                <h2 className="title-lg">Projetos em destaque</h2>
                <div className="vertical-list">
                  {projects.map((project) => {
                    if (!project) return null;

                    const previewAbout = project.about ? truncate(toPlainText(project.about), 200) : undefined;
                    const projectSlug = artist.slug || slug;
                    const projectHref = `/artistas/${projectSlug}/projetos/${project.id}`;
                    const hasMeta = project.partners || project.teamArt || project.teamTech;

                    return (
                      <article className="card project-card" key={project.id}>
                        {(project.coverUrl || project.bannerUrl) && (
                          <div className="project-media">
                            <img
                              src={project.coverUrl ?? project.bannerUrl ?? ""}
                              alt={`Imagem do projeto ${project.title ?? artist.stageName}`}
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="project-body">
                          <h3 className="project-title">{project.title ?? "Projeto"}</h3>

                          {previewAbout ? (
                            <p className="text-md">{previewAbout}</p>
                          ) : project.about ? (
                            <p className="text-md">{toPlainText(project.about)}</p>
                          ) : (
                            <p className="text-md">Conheça os detalhes deste projeto no perfil completo.</p>
                          )}

                          {hasMeta && (
                            <ul className="project-meta">
                              {project.partners && (
                                <li>
                                  <strong>Parceiros:</strong> {project.partners}
                                </li>
                              )}
                              {project.teamArt && (
                                <li>
                                  <strong>Direção artística:</strong> {project.teamArt}
                                </li>
                              )}
                              {project.teamTech && (
                                <li>
                                  <strong>Equipe técnica:</strong> {project.teamTech}
                                </li>
                              )}
                            </ul>
                          )}

                          <div className="project-actions">
                            <Link className="btn btn--accent" to={projectHref}>
                              Ver projeto completo
                            </Link>
                            {project.projectSheetUrl && (
                              <a
                                className="btn"
                                href={project.projectSheetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Baixar release
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div className="section" id="eventos">
                <h2 className="title-lg">Eventos</h2>
                <div className="vertical-list">
                  {events.map((event) => {
                    if (!event) return null;
                    const schedule = buildEventSchedule(event);
                    const hasMeta = schedule || event.place;
                    return (
                      <article className="card event-card" key={event.id}>
                        {event.bannerUrl && (
                          <div className="event-media">
                            <img
                              src={event.bannerUrl}
                              alt={`Banner do evento ${event.name ?? artist.stageName}`}
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="event-body">
                          <h3 className="event-title">{event.name ?? "Evento"}</h3>
                          {hasMeta && (
                            <div className="event-meta">
                              {schedule && <span>{schedule}</span>}
                              {event.place && <span>{event.place}</span>}
                            </div>
                          )}
                          {event.description && <p className="text-md">{event.description}</p>}
                          {event.ctaLink && (
                            <a
                              className="btn btn--accent"
                              href={event.ctaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Saiba mais
                            </a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fotos */}
            <div className="section" id="fotos">
              <h2 className="title-lg">Galeria de Fotos</h2>
              {photos.length > 0 ? (
                <div className="photo-grid">
                  {photos.map((photo, index) => (
                    <figure className="photo" key={`${photo.url}-${index}`}>
                      <button
                        type="button"
                        className="photo-hit"
                        onClick={() => openLightbox(photoItems, index)}
                        aria-label="Ampliar foto"
                      >
                        <img
                          src={photo.url}
                          alt={photo.alt && photo.alt.trim().length > 0 ? photo.alt : artist.stageName}
                          loading="lazy"
                        />
                      </button>
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="text-md">Nenhuma fotografia enviada.</p>
              )}
            </div>

            {/* Vídeos */}
            <div className="section" id="videos">
              <h2 className="title-lg">Galeria de Vídeos</h2>
              <MediaGrid
                items={videos}
                emptyMessage="Nenhum vídeo disponível no momento."
                renderItem={(video, index) => {
                  const src = toEmbedSrc(video);
                  const key = `${video.url}-${index}`;
                  if (!src) {
                    return (
                      <div className="media" key={key} aria-hidden="true">
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, rgba(225,29,72,0.25), rgba(40,40,45,0.85))",
                          }}
                        />
                      </div>
                    );
                  }
                  const handleClick = () => openLightbox(videoItems, index);
                  if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(src)) {
                    return (
                      <button
                        type="button"
                        className="media"
                        key={key}
                        onClick={handleClick}
                        aria-label={`Assistir ${artist.stageName}`}
                      >
                        <video
                          style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "#000" }}
                          preload="metadata"
                          muted
                          playsInline
                          controls={false}
                        >
                          <source src={src} />
                        </video>
                      </button>
                    );
                  }
                  return (
                    <button
                      type="button"
                      className="media"
                      key={key}
                      onClick={handleClick}
                      aria-label={`Assistir ${artist.stageName}`}
                    >
                      <iframe
                        src={src}
                        title={`Vídeo ${index + 1} de ${artist.stageName}`}
                        loading="lazy"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ pointerEvents: "none" }}
                      />
                    </button>
                  );
                }}
              />
            </div>
          </section>
        </div>
      </div>
      {lbItems && <Lightbox items={lbItems} startIndex={lbIndex} onClose={closeLightbox} />}
    </ArtistPageShell>
  );
}
