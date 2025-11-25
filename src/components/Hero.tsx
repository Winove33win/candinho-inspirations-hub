import { ArrowDownRight, ArrowRightCircle } from "lucide-react";

import type { DiscoveryChip, SearchEntry } from "@/data/homepage";
import GlobalSearch from "@/components/GlobalSearch";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onExplore?: () => void;
  onSuggestionSelect?: (entry: SearchEntry) => void;
  onChipSelect?: (chip: DiscoveryChip) => void;
}

const Hero = ({ onExplore, onSuggestionSelect, onChipSelect }: HeroProps) => {
  return (
    <section
      id="hero"
      className="relative flex min-h-[70vh] items-center overflow-hidden pt-28 pb-24"
    >
      <div className="absolute inset-0" aria-hidden>
        <video
          className="h-full w-full object-cover"
          src="https://video.wixstatic.com/video/7b859e_c353b2557d364f57844baf1735c230be/720p/mp4/file.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(18,0,0,0.55)] to-[rgba(8,0,0,0.92)]" aria-hidden />

      <div className="site-container relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.6fr)] lg:items-center">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.48em] text-[rgba(250,250,252,0.64)]">
              Plataforma streaming-like para música clássica
            </p>
            <div className="space-y-2 text-[var(--ink)]">
              <h1 className="text-6xl font-extrabold leading-[0.9] md:text-7xl xl:text-8xl">PAIXÃO</h1>
              <h2 className="text-6xl font-extrabold leading-[0.9] text-[rgba(250,250,252,0.75)] md:text-7xl xl:text-8xl">
                TALENTO
              </h2>
              <h3 className="text-7xl font-extrabold leading-[0.9] text-[var(--brand)] drop-shadow-[0_0_55px_rgba(144,8,11,0.65)] md:text-[110px]">
                INSPIRAÇÃO
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[rgba(250,250,252,0.76)] md:text-lg">
              Um hub cinematográfico para descobrir artistas, projetos e experiências que reimaginam a música clássica, jazz e world music. Curadoria premium com vibe de streaming e acesso imediato.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              id="ctaExplore"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--brand)] px-8 py-6 text-sm font-semibold uppercase tracking-[0.34em] text-[var(--ink)] transition hover:bg-[rgba(144,8,11,0.88)]"
              onClick={onExplore}
            >
              Explorar Artistas
              <ArrowRightCircle className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </Button>
            <div className="flex-1">
              <GlobalSearch
                id="ctaSearch"
                variant="hero"
                onSelectSuggestion={onSuggestionSelect}
                onChipSelect={onChipSelect}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.28em] text-[rgba(250,250,252,0.62)]">
            <span className="inline-flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" aria-hidden /> Scroll para descobrir curadorias exclusivas
            </span>
            <span>Experiência otimizada para teclado e touch</span>
          </div>
        </div>

        <aside className="glass-panel hidden rounded-3xl border border-[rgba(255,255,255,0.08)]/50 p-8 text-[rgba(250,250,252,0.8)] lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[rgba(250,250,252,0.55)]">Acesso rápido</p>
          <ul className="mt-6 space-y-6 text-sm leading-relaxed">
            <li>
              Conecte-se com artistas em ascensão e nomes consagrados com playlists editoriais que mudam conforme suas interações.
            </li>
            <li>
              Microinterações suaves, autoplay inteligente e salvamento instantâneo para acompanhar novidades mesmo offline.
            </li>
            <li>
              Eventos especiais como o projeto CANDINHO ganham destaque com trailers e links diretos para o portal do artista.
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default Hero;
