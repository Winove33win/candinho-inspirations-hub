import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-[var(--elev-border)] bg-[var(--surface)] shadow-[var(--shadow-1)]">
      <header className="border-b border-[var(--divider)] px-6 py-5">
        <h2 className="text-xl font-semibold text-[var(--text-1)]">{title}</h2>
      </header>
      <div className="px-6 py-6 text-[var(--text-2)] sm:text-base">{children}</div>
    </section>
  );
}
