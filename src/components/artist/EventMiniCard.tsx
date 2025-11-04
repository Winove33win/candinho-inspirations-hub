import { Link } from "react-router-dom";

export interface EventMini {
  id: string;
  name?: string | null;
  bannerUrl?: string | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  place?: string | null;
  description?: string | null;
  href: string;
}

function formatDateDisplay(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value ?? undefined;
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(parsed);
  } catch {
    return value ?? undefined;
  }
}

function formatTimeDisplay(value?: string | null) {
  if (!value) return undefined;
  const isoLike = value.includes("T") ? value : `1970-01-01T${value}`;
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) return value ?? undefined;
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  } catch {
    return value ?? undefined;
  }
}

function buildSchedule(event: EventMini) {
  const date = formatDateDisplay(event.date);
  const start = formatTimeDisplay(event.startTime);
  const end = formatTimeDisplay(event.endTime);
  const timeRange = start && end ? `${start} – ${end}` : start || end;
  return [date, timeRange].filter(Boolean).join(" • ");
}

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function EventMiniCard({ event }: { event: EventMini }) {
  const media = event.bannerUrl ?? null;
  const schedule = buildSchedule(event);
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
        {schedule && <p className="mini-meta-inline">{schedule}</p>}
        {event.place && <p className="mini-meta-inline">{event.place}</p>}
        {event.description && <p className="mini-description">{event.description}</p>}

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
