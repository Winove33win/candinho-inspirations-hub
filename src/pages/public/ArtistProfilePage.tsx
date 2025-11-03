import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Images, PlayCircle, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArtistPublic } from "@/hooks/useArtistPublic";
import type { ArtistPublic } from "@/hooks/useArtistPublic";
import { ProfileHeader } from "@/components/artist-profile/ProfileHeader";
import { StatsBar } from "@/components/artist-profile/StatsBar";
import { SectionCard } from "@/components/artist-profile/SectionCard";
import { PhotosGallery } from "@/components/artist-profile/PhotosGallery";
import { VideosGallery } from "@/components/artist-profile/VideosGallery";

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

function renderSection(content?: string | null) {
  if (!content) {
    return <p className="text-sm text-[var(--text-3)]">Conteúdo não informado.</p>;
  }

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default function ArtistProfilePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: artist, isLoading, isError, error } = useArtistPublic(slug);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useArtistSeo(artist);

  const location = useMemo(() => {
    if (!artist) return "";
    return [artist.country, artist.city].filter(Boolean).join(" · ");
  }, [artist]);

  const socialLinks = artist?.socials?.filter((item) => !!item.url);

  const sectionContent = [
    { title: "Visão Geral", content: artist?.vision },
    { title: "História", content: artist?.history },
    { title: "Carreira", content: artist?.career },
    { title: "Mais", content: artist?.more },
  ];

  useEffect(() => {
    setActiveSectionIndex(0);
  }, [artist?.id, slug]);

  const activeSection = sectionContent[activeSectionIndex] ?? sectionContent[0];

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
      <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-2)]">
        <Header />
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-[var(--elev-border)] bg-[var(--surface)] p-6 text-sm text-red-400">
              {friendlyMessage}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-2)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <Link
              to="/artistas"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-3)] transition hover:text-[var(--text-1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar para Artistas
            </Link>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-10">
              <div className="overflow-hidden rounded-3xl border border-[var(--elev-border)] bg-[var(--surface)]">
                <div className="h-56 animate-pulse bg-[var(--surface-2)] md:h-72" />
                <div className="-mt-16 px-6 pb-6 sm:px-8 md:-mt-20 md:px-12">
                  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="flex items-end gap-6">
                      <div className="h-32 w-32 animate-pulse rounded-[28px] bg-[var(--surface-2)] md:h-40 md:w-40" />
                      <div className="space-y-3 pb-3">
                        <div className="h-8 w-40 animate-pulse rounded bg-[var(--surface-2)]" />
                        <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pb-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-10 w-28 animate-pulse rounded-full bg-[var(--surface-2)]" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-2xl bg-[var(--surface)]" />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                <div className="h-80 animate-pulse rounded-3xl bg-[var(--surface)]" />
                <div className="space-y-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-3xl bg-[var(--surface)]" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-12 w-40 animate-pulse rounded bg-[var(--surface)]" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-2xl bg-[var(--surface)]" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-12 w-40 animate-pulse rounded bg-[var(--surface)]" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="aspect-video animate-pulse rounded-2xl bg-[var(--surface)]" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isLoading && !artist && !isError && slug && (
            <div className="rounded-3xl border border-[var(--divider)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--text-3)]">
              Artista não encontrado.
            </div>
          )}

          {artist && (
            <div className="flex flex-col gap-10">
              <ProfileHeader
                name={artist.stageName}
                location={location}
                avatarUrl={artist.avatarUrl}
                coverUrl={artist.coverUrl}
                actions={
                  <>
                    <a
                      href="#fotos"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--divider)] bg-[var(--surface-2)] px-5 py-2 text-sm font-semibold text-[var(--text-2)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    >
                      <Images className="h-4 w-4" aria-hidden="true" /> Fotos
                    </a>
                    <a
                      href="#videos"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--divider)] bg-[var(--surface-2)] px-5 py-2 text-sm font-semibold text-[var(--text-2)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    >
                      <PlayCircle className="h-4 w-4" aria-hidden="true" /> Vídeos
                    </a>
                    {socialLinks && socialLinks.length > 0 && (
                      <a
                        href={socialLinks[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)] bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" /> Contato
                      </a>
                    )}
                  </>
                }
              />

              <StatsBar stats={artist.stats} />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
                <aside className="flex flex-col gap-6">
                  <SectionCard title="Contatos e Redes">
                    {socialLinks && socialLinks.length > 0 ? (
                      <ul className="space-y-3 text-sm">
                        {socialLinks.map((item) => (
                          <li key={item.url}>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-[var(--divider)] px-4 py-2 text-[var(--text-2)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                            >
                              <span className="text-sm font-medium">{item.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[var(--text-3)]">Nenhuma rede social cadastrada.</p>
                    )}
                  </SectionCard>
                </aside>

                <div className="flex flex-col gap-6">
                  <SectionCard title="Apresentação">
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <div className="flex flex-row gap-3 overflow-x-auto pb-2 lg:w-64 lg:flex-col lg:overflow-visible lg:pb-0">
                        {sectionContent.map((section, index) => {
                          const isActive = index === activeSectionIndex;
                          return (
                            <button
                              key={section.title}
                              type="button"
                              onClick={() => setActiveSectionIndex(index)}
                              aria-pressed={isActive}
                              className={`min-w-[160px] flex-1 whitespace-nowrap rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${
                                isActive
                                  ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--text-1)] shadow-[var(--shadow-1)]"
                                  : "border-[var(--divider)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--brand)] hover:bg-[var(--surface)]"
                              }`}
                            >
                              {section.title}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--text-1)]">
                          {activeSection?.title}
                        </h3>
                        {renderSection(activeSection?.content)}
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>

              <section className="flex flex-col gap-6" id="fotos">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text-1)]">Galeria de Fotos</h2>
                  <p className="mt-1 text-sm text-[var(--text-3)]">
                    Explore registros visuais fornecidos diretamente pelo artista.
                  </p>
                </div>
                <PhotosGallery photos={artist.photos} />
              </section>

              <section className="flex flex-col gap-6" id="videos">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--text-1)]">Galeria de Vídeos</h2>
                  <p className="mt-1 text-sm text-[var(--text-3)]">
                    Assista a performances e materiais audiovisuais selecionados.
                  </p>
                </div>
                <VideosGallery videos={artist.videos} />
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
