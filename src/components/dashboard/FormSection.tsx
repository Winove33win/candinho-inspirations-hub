import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="group relative mb-8 overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur transition-all duration-300 hover:shadow-lg md:p-8">
      <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-t from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block" />
      <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-neutral-900 md:text-xl">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
          )}
        </div>
      </div>
      <div className="relative mt-6 space-y-4">{children}</div>
    </section>
  );
}
