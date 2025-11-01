interface StatsBarProps {
  stats?: { key: string; value: number | string }[];
}

export function StatsBar({ stats }: StatsBarProps) {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section aria-label="Indicadores do artista" className="rounded-3xl border border-[var(--elev-border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-2xl border border-[var(--elev-border)] bg-[var(--surface-2)] p-4 text-left shadow-[var(--shadow-1)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-3)]">{stat.key}</span>
            <p className="mt-2 text-2xl font-bold text-[var(--text-1)]">
              {typeof stat.value === "number" ? stat.value.toLocaleString("pt-BR") : stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
