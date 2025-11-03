import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useArtistPublic } from "@/hooks/useArtistPublic";
import type { ArtistPublic } from "@/hooks/useArtistPublic";
import "@/styles/artist.css";

type ArtistStat = NonNullable<ArtistPublic["stats"]>[number];

function toPlainText(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, max = 160) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function useArtistSeo(artist?: ArtistPublic) {
  const plainVision = artist?.vision ? toPlainText(artist.vision) : "";
  const plainHistory = artist?.history ? toPlainText(artist.history) : "";
  const descriptionSource = plainVision || plainHistory;
  const metaDescription = truncate(descriptionSource || `Conheça ${artist?.stageName ?? "artista"} na rede SMARTx.`);

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
      { attr: "name", key: "twitter:card", content: artist.coverUrl || artist.avatarUrl ? "summary_large_image" : "summary" },
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
      if (config.content) {
        element.setAttribute("content", config.content);
      } else {
        element.removeAttribute("content");
      }
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
        if (created) {
          element.remove();
        } else if (previousContent) {
          element.setAttribute("content", previousContent);
        } else {
          element.removeAttribute("content");
        }
      });
      if (jsonLdEl) {
        jsonLdEl.remove();
      }
    };
  }, [artist, metaDescription]);
}

interface SectionContentProps {
  html?: string | null;
  clamp?: boolean;
}

function SectionContent({ html, clamp }: SectionContentProps) {
  const [expanded, setExpanded] = useState(false);

  if (!html) {
    return <p className="text-md">Conteúdo não informado.</p>;
  }

  return (
    <div>
      <div
        className={`text-md${clamp && !expanded ? " clamp-8" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {clamp && !expanded && (
        <button
          type="button"
          className="btn"
          style={{ marginTop: "12px" }}
          onClick={() => setExpanded(true)}
        >
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

interface HeroProps {
  name: string;
  coverUrl?: string | null;
  avatarUrl?: string | null;
  pills?: string[];
  highlight?: string;
  actions?: ReactNode;
}

function Hero({ name, coverUrl, avatarUrl, pills = [], highlight, actions }: HeroProps) {
  const pillItems = [...pills];
  if (highlight) {
    pillItems.push(highlight);
  }

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
                  "radial-gradient(circle at top left, rgba(225,29,72,0.35), transparent 60%), #121214",
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
                    "linear-gradient(135deg, rgba(225,29,72,0.45), rgba(30,30,35,0.95))",
                }}
              />
            )}
          </div>
          <div>
            <h1 className="title-xl">{name}</h1>
            {pillItems.length > 0 && (
              <div className="pills" style={{ marginTop: "10px" }}>
                {pillItems.map((item, index) => (
                  <span className="pill" key={`${item}-${index}`}>
                    {item}
                  </span>
                ))}
              </div>
            )}
            {actions && (
              <div className="hero-actions" style={{ marginTop: "14px" }}>
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface StatPillsProps {
  stats?: { key: string; value: number | string }[];
  title?: string;
}

function StatPills({ stats, title = "Destaques" }: StatPillsProps) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="card section">
      <h2 className="title-lg">{title}</h2>
      <div className="pills">
        {stats.map((stat, index) => (
          <span className="pill" key={`${stat.key}-${stat.value}-${index}`}>
            <strong style={{ color: "#f5f5f6", fontWeight: 700 }}>{stat.value}</strong>
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
  if (!items || items.length === 0) {
    return <p className="text-md">{emptyMessage}</p>;
  }

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

function formatStatValue(value: string | number) {
  return typeof value === "number" ? value.toLocaleString("pt-BR") : value;
}

export default function ArtistProfilePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: artist, isLoading, error } = useArtistPublic(slug);

  useArtistSeo(artist);

  if (error) {
    const friendlyMessage = (() => {
      const message = (error as Error).message;
      if (message === "artist_not_found") {
        return "Artista não encontrado.";
      }
      if (message === "internal_error") {
        return "Erro interno ao carregar o artista.";
      }
      return message;
    })();

    return (
      <div className="artist-page">
        <main className="container">
          <div className="card">
            <h2 className="title-lg">Ops! Não foi possível carregar o artista.</h2>
            <p className="text-md" style={{ marginTop: "12px" }}>
              {friendlyMessage}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="artist-page">
        <main className="container">
          <div className="card">
            <h2 className="title-lg">Carregando artista…</h2>
            <p className="text-md" style={{ marginTop: "12px" }}>
              Estamos preparando o perfil com todos os detalhes.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-page">
        <main className="container">
          <div className="card">
            <h2 className="title-lg">Artista não encontrado.</h2>
            <p className="text-md" style={{ marginTop: "12px" }}>
              Verifique o link ou explore outros talentos disponíveis na plataforma.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const socialLinks = (artist.socials ?? []).filter((item) => item && item.url);
  const heroPills = [artist.country, artist.city].filter((item): item is string => !!item && item.trim().length > 0);
  const stats = (artist.stats ?? []).filter((stat): stat is ArtistStat => stat != null && stat.value != null && `${stat.value}`.toString().trim().length > 0);
  const [primaryStat, ...otherStats] = stats;
  const highlight = primaryStat
    ? [formatStatValue(primaryStat.value), primaryStat.key].filter(Boolean).join(" · ") || formatStatValue(primaryStat.value)
    : undefined;
  const statPills = otherStats.map((stat) => ({
    key: stat.key,
    value: formatStatValue(stat.value),
  }));
  const photos = (artist.photos ?? []).filter((photo) => photo && photo.url);
  const videos = (artist.videos ?? []).filter((video) => video && video.url) as VideoItem[];
  const primaryContact = socialLinks[0];

  const heroActions = (
    <>
      <button type="button" className="btn btn--accent">
        Seguir
      </button>
      <a className="btn" href="#fotos">
        Fotos
      </a>
      <a className="btn" href="#videos">
        Vídeos
      </a>
      {primaryContact ? (
        <a className="btn" href={primaryContact.url} target="_blank" rel="noopener noreferrer">
          Contato
        </a>
      ) : (
        <button
          type="button"
          className="btn"
          disabled
          aria-disabled="true"
          style={{ opacity: 0.45, cursor: "not-allowed" }}
        >
          Contato
        </button>
      )}
    </>
  );

  const sectionContent = [
    { title: "Visão Geral", content: artist.vision, clamp: true },
    { title: "História", content: artist.history },
    { title: "Carreira", content: artist.career },
    { title: "Mais", content: artist.more },
  ];

  return (
    <div className="artist-page">
      <Hero
        name={artist.stageName}
        coverUrl={artist.coverUrl}
        avatarUrl={artist.avatarUrl}
        pills={heroPills}
        highlight={highlight}
        actions={heroActions}
      />

      <main className="container h-grid">
        <aside className="card">
          <h2 className="title-lg">Contatos & Redes</h2>
          {socialLinks.length > 0 ? (
            <ul className="text-md" style={{ marginTop: "12px" }}>
              {socialLinks.map((item) => (
                <li key={item.url} style={{ marginBottom: "8px" }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.label || item.url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-md" style={{ marginTop: "12px" }}>
              Nenhum contato informado até o momento.
            </p>
          )}
        </aside>

        <section>
          <StatPills stats={statPills} title="Números & Reconhecimentos" />

          {sectionContent.map((section) => (
            <SectionCard key={section.title} title={section.title} html={section.content} clamp={section.clamp} />
          ))}

          <div className="section" id="fotos">
            <h2 className="title-lg">Galeria de Fotos</h2>
            {photos.length > 0 ? (
              <div className="photo-grid">
                {photos.map((photo, index) => (
                  <figure className="photo" key={`${photo.url}-${index}`}>
                    <img
                      src={photo.url}
                      alt={photo.alt && photo.alt.trim().length > 0 ? photo.alt : artist.stageName}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            ) : (
              <p className="text-md">Nenhuma fotografia enviada.</p>
            )}
          </div>

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

                if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(src)) {
                  return (
                    <div className="media" key={key}>
                      <video
                        controls
                        style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "#000" }}
                      >
                        <source src={src} />
                        Seu navegador não suporta reprodução de vídeo.
                      </video>
                    </div>
                  );
                }

                return (
                  <div className="media" key={key}>
                    <iframe
                      src={src}
                      title={`Vídeo ${index + 1} de ${artist.stageName}`}
                      loading="lazy"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }}
            />
          </div>
        </section>
      </main>

      <footer className="container footer">
        <small>© SMARTx — Todos os direitos reservados.</small>
      </footer>
    </div>
  );
}
