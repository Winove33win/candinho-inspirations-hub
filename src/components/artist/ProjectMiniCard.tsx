import { Link } from "react-router-dom";

export interface ProjectMini {
  id: string;
  title?: string | null;
  coverUrl?: string | null;
  bannerUrl?: string | null;
  about?: string | null;
  partners?: string | null;
  teamArt?: string | null;
  teamTech?: string | null;
  projectSheetUrl?: string | null;
  href: string;
}

function toPlainText(value?: string | null) {
  if (!value) return "";
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, max = 180) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

export default function ProjectMiniCard({ project }: { project: ProjectMini }) {
  const media = project.coverUrl || project.bannerUrl || null;
  const description = project.about ? truncate(toPlainText(project.about)) : "";
  const hasMeta = Boolean(project.partners || project.teamArt || project.teamTech);
  const releaseHref = project.projectSheetUrl;

  return (
    <article className="mini-card" aria-label={project.title ?? "Projeto"}>
      <div className="mini-media" aria-hidden={media ? undefined : true}>
        {media ? (
          <img src={media} alt="" loading="lazy" />
        ) : (
          <div className="mini-media--placeholder" />
        )}
      </div>

      <div className="mini-body">
        <h3 className="mini-title">{project.title ?? "Projeto"}</h3>
        {description && <p className="mini-description">{description}</p>}

        {hasMeta && (
          <dl className="mini-meta">
            {project.partners && (
              <div>
                <dt>Parceiros</dt>
                <dd>{project.partners}</dd>
              </div>
            )}
            {project.teamArt && (
              <div>
                <dt>Direção artística</dt>
                <dd>{project.teamArt}</dd>
              </div>
            )}
            {project.teamTech && (
              <div>
                <dt>Equipe técnica</dt>
                <dd>{project.teamTech}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="mini-actions">
          <Link className="btn btn--accent" to={project.href}>
            Ver projeto completo
          </Link>
          {releaseHref && (
            <a className="btn" href={releaseHref} target="_blank" rel="noopener noreferrer">
              Baixar release
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
