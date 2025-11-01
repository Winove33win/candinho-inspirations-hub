import type { ReactNode } from "react";

interface ProfileHeaderProps {
  name: string;
  location?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  actions?: ReactNode;
}

export function ProfileHeader({ name, location, avatarUrl, coverUrl, actions }: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--elev-border)] bg-[var(--surface)] shadow-[var(--shadow-1)]">
      <div className="relative h-56 w-full md:h-72">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Capa de ${name}`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-full w-full bg-gradient-to-br from-[rgba(176,16,22,0.45)] via-[rgba(32,18,21,0.85)] to-[rgba(15,10,10,1)]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(15,10,10,0.92)] via-[rgba(32,18,21,0.6)] to-transparent" />
      </div>

      <div className="relative -mt-16 px-6 pb-6 sm:px-8 md:-mt-20 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-6">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-[28px] border-4 border-[var(--bg-0)] bg-[var(--surface-2)] shadow-[var(--shadow-1)] md:h-40 md:w-40">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Foto de ${name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-full w-full bg-gradient-to-br from-[rgba(66,18,22,0.9)] via-[rgba(32,18,21,0.95)] to-[rgba(15,10,10,1)]"
                />
              )}
            </div>

            <div className="pb-3">
              <h1 className="text-3xl font-extrabold text-[var(--text-1)] sm:text-4xl md:text-5xl">{name}</h1>
              {location && (
                <p className="mt-2 text-base text-[var(--text-3)] sm:text-lg" aria-label={`Localização: ${location}`}>
                  {location}
                </p>
              )}
            </div>
          </div>

          {actions && <div className="flex flex-wrap items-center gap-3 pb-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
