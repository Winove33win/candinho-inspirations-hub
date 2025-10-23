import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { DiscoveryChip } from "@/data/homepage";
import { cn } from "@/lib/utils";

interface DiscoverChipsProps {
  chips: DiscoveryChip[];
  selected: DiscoveryChip;
  onSelect: (chip: DiscoveryChip) => void;
}

const DiscoverChips = ({ chips, selected, onSelect }: DiscoverChipsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      event.preventDefault();
      container.scrollBy({ left: event.deltaY, behavior: "smooth" });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const scrollContainer = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const amount = direction === "left" ? -240 : 240;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="chipsDiscover" className="relative mt-12">
      <div className="flex items-center justify-between pb-3">
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-[0.28em] text-[rgba(250,250,252,0.68)]">Descobrir por categoria</h2>
          <p className="mt-1 text-sm text-[rgba(250,250,252,0.6)]">
            Selecione uma curadoria para atualizar os carrosséis abaixo.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="Rolagem anterior"
            className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-[rgba(250,250,252,0.75)] transition hover:bg-[rgba(255,255,255,0.08)]"
            onClick={() => scrollContainer("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Rolagem seguinte"
            className="glass-panel flex h-9 w-9 items-center justify-center rounded-full text-[rgba(250,250,252,0.75)] transition hover:bg-[rgba(255,255,255,0.08)]"
            onClick={() => scrollContainer("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-label="Categorias de descoberta SMARTx"
        className="scrollbar-thin glass-panel flex gap-3 overflow-x-auto rounded-3xl px-4 py-3"
      >
        {chips.map((chip) => {
          const isActive = chip === selected;
          return (
            <button
              key={chip}
              role="radio"
              aria-checked={isActive}
              tabIndex={0}
              onClick={() => onSelect(chip)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(chip);
                }
              }}
              className={cn(
                "chip whitespace-nowrap border-transparent bg-[rgba(255,255,255,0.04)] text-sm font-semibold text-[var(--ink)]",
                "hover:bg-[rgba(144,8,11,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(144,8,11,0.6)]",
                isActive && "chip-active",
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DiscoverChips;
