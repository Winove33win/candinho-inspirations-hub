import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArtistPublic } from "@/hooks/useArtistPublic";
import "@/styles/artist.css";

function ArtistPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="site-container space-y-10">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

function StatusCard({ title, message, backHref }: { title: string; message: string; backHref?: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-8 text-[var(--ink)] shadow-[var(--shadow-1)]">
      <h2 className="text-2xl font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{message}</p>
      {backHref ? (
        <Link className="btn mt-6 inline-flex" to={backHref}>
          Voltar ao perfil
        </Link>
      ) : null}
    </div>
  );
}

function RenderHtml({ html }: { html?: string | null }) {
  if (!html) {
    return <p className="text-md">Conteúdo não informado.</p>;
  }

  return <div className="project-richtext text-md" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ArtistProjectPage() {
  const { slug = "", projectId = "" } = useParams<{ slug: string; projectId: string }>();
  const { data: artist, isLoading, error } = useArtistPublic(slug);

  useEffect(() => {
    if (!artist) return;
    const project = artist.projects?.find((item) => item && item.id === projectId);
    if (!project) return;
    const previousTitle = document.title;
    const title = project.title
      ? `${project.title} — ${artist.stageName} | SMARTx`
      : `Projeto de ${artist.stageName} | SMARTx`;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [artist, projectId]);

  const backHref = slug ? `/artistas/${slug}` : "/artistas";

  const renderStatus = (title: string, message: string) => (
    <ArtistPageShell>
      <StatusCard title={title} message={message} backHref={backHref} />
    </ArtistPageShell>
  );

  if (error) {
    const message = (error as Error).message;
    const friendly =
      message === "artist_not_found"
        ? "Artista não encontrado."
        : message === "internal_error"
          ? "Erro interno ao carregar o projeto."
          : message;
    return renderStatus("Ops! Não foi possível carregar o projeto.", friendly);
  }

  if (isLoading) {
    return renderStatus("Carregando projeto…", "Estamos preparando os detalhes do projeto.");
  }

  if (!artist) {
    return renderStatus(
      "Artista não encontrado.",
      "Verifique o link ou explore outros talentos disponíveis na plataforma."
    );
  }

  const project = artist.projects?.find((item) => item && item.id === projectId);

  if (!project) {
    return renderStatus(
      "Projeto não encontrado.",
      "Este artista pode não possuir um projeto com este identificador ou ele foi removido."
    );
  }

  const heroImage = project.bannerUrl ?? project.coverUrl;
  const hasMeta = project.partners || project.teamArt || project.teamTech;

  return (
    <ArtistPageShell>
      <article className="overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[#0f0f10] text-white shadow-[0_32px_120px_rgba(12,10,10,0.6)]">
        {heroImage ? (
          <div className="relative h-64 w-full md:h-80">
            <img
              src={heroImage}
              alt={`Imagem do projeto ${project.title ?? artist.stageName}`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="h-40 w-full bg-[radial-gradient(circle_at_15%_0%,rgba(225,29,72,.35),transparent_60%),#121214] md:h-56"
            aria-hidden="true"
          />
        )}

        <div className="space-y-10 px-6 py-10 md:px-12 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.18em] text-[#d1d1d6]">Projeto</p>
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                {project.title ?? "Projeto em destaque"}
              </h1>
              <p className="text-md">
                por {" "}
                <Link className="font-semibold text-white underline-offset-4 hover:underline" to={backHref}>
                  {artist.stageName}
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn" to={backHref}>
                Voltar ao perfil
              </Link>
              {project.projectSheetUrl ? (
                <a
                  className="btn btn--accent"
                  href={project.projectSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baixar release
                </a>
              ) : null}
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="title-lg">Sobre o projeto</h2>
            <RenderHtml html={project.about} />
          </section>

          {hasMeta ? (
            <section className="grid gap-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#141416] p-6 md:grid-cols-3">
              {project.partners ? (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f5f5f6]">Parceiros</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#d4d4d8]">{project.partners}</p>
                </div>
              ) : null}
              {project.teamArt ? (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f5f5f6]">Direção artística</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#d4d4d8]">{project.teamArt}</p>
                </div>
              ) : null}
              {project.teamTech ? (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f5f5f6]">Equipe técnica</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#d4d4d8]">{project.teamTech}</p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </article>
    </ArtistPageShell>
  );
}
