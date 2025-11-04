import { Link } from "react-router-dom";

export interface EventMini {
  id: string;
  name?: string | null;
  bannerUrl?: string | null;
  href: string;
}

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function EventMiniCard({ event }: { event: EventMini }) {
  const media = event.bannerUrl ?? null;
  const external = isExternalLink(event.href);

  return (
    <article className="mini-card" aria-label={event.name ?? "Evento"}>
      <div className="mini-media" aria-hidden={media ? undefined : true}>
        {media ? (
          <img src={media} alt="" loading="lazy" />
        ) : (
          <div className="mini-media--placeholder" />
        )}
      </div>

      <div className="mini-body">
        <h3 className="mini-title">{event.name ?? "Evento"}</h3>

        <div className="mini-actions">
          {external ? (
            <a className="btn btn--accent" href={event.href} target="_blank" rel="noopener noreferrer">
              Saiba mais
            </a>
          ) : (
            <Link className="btn btn--accent" to={event.href}>
              Saiba mais
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
