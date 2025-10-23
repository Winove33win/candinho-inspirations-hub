import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

import { projectHighlight } from "@/data/homepage";
import { Button } from "@/components/ui/button";

const CandinhoSection = () => {
  return (
    <section
      id="blockCandinho"
      className="relative mt-20 overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.12)] bg-[rgba(18,0,0,0.75)] shadow-[0_35px_85px_rgba(0,0,0,0.55)]"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="relative min-h-[320px] overflow-hidden">
          <img
            src={projectHighlight.banner}
            alt={projectHighlight.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(18,0,0,0.85)] via-[rgba(66,0,0,0.4)] to-transparent" aria-hidden />
          <img
            src={projectHighlight.accentImage}
            alt="Arte oficial Candinho"
            className="absolute -bottom-8 -right-10 hidden w-1/2 max-w-[280px] opacity-70 lg:block"
            loading="lazy"
          />
        </div>

        <div className="relative flex flex-col gap-6 p-10">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(144,8,11,0.38)] bg-[rgba(144,8,11,0.18)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.36em] text-[var(--ink)]">
              {projectHighlight.subtitle}
            </span>
            <h2 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">{projectHighlight.title}</h2>
            <p className="text-sm uppercase tracking-[0.28em] text-[rgba(250,250,252,0.55)]">
              Inclusão · Tecnologia Assistiva · Grandes Vozes
            </p>
          </div>

          <p className="text-base leading-relaxed text-[rgba(250,250,252,0.74)]">
            {projectHighlight.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-[rgba(250,250,252,0.6)]">
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1">Acessibilidade total</span>
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1">Residência SMARTx</span>
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1">Estreia 2025</span>
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-8 py-5 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--ink)] hover:bg-[rgba(144,8,11,0.88)]"
            >
              <Link to={projectHighlight.ctas.primary.href}>
                {projectHighlight.ctas.primary.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.18)] bg-transparent px-8 py-5 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--ink)] hover:border-[rgba(144,8,11,0.6)]"
              asChild
            >
              <a href={projectHighlight.ctas.secondary.href} target="_blank" rel="noreferrer">
                <Play className="h-4 w-4" aria-hidden /> {projectHighlight.ctas.secondary.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandinhoSection;
