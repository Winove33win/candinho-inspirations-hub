import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles, ArrowUpRight, Loader2 } from "lucide-react";

import type { DiscoveryChip, SearchEntry } from "@/data/homepage";
import { discoveryChips, searchIndex } from "@/data/homepage";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface GlobalSearchProps {
  id: string;
  placeholder?: string;
  variant?: "hero" | "header";
  onSelectSuggestion?: (entry: SearchEntry) => void;
  onChipSelect?: (chip: DiscoveryChip) => void;
}

const HERO_SUGGESTION_LIMIT = 6;
const HEADER_SUGGESTION_LIMIT = 5;

const getSuggestionLimit = (variant: "hero" | "header") =>
  variant === "hero" ? HERO_SUGGESTION_LIMIT : HEADER_SUGGESTION_LIMIT;

const GlobalSearch = ({
  id,
  placeholder = "Busque artistas, categorias ou projetos",
  variant = "hero",
  onSelectSuggestion,
  onChipSelect,
}: GlobalSearchProps) => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const limitedChips = useMemo(() => discoveryChips.slice(0, 6), []);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const limit = getSuggestionLimit(variant);

    if (!normalized) {
      return searchIndex.slice(0, limit);
    }

    return searchIndex
      .filter((entry) => {
        const label = entry.label.toLowerCase();
        const meta = entry.meta?.toLowerCase() ?? "";
        return label.includes(normalized) || meta.includes(normalized);
      })
      .slice(0, limit);
  }, [query, variant]);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsFiltering(true);
    const timer = window.setTimeout(() => {
      setIsFiltering(false);
    }, query ? 160 : 80);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (entry: SearchEntry) => {
    onSelectSuggestion?.(entry);
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();

    toast({
      title: entry.label,
      description:
        entry.type === "artista"
          ? "Redirecionando para o perfil do artista."
          : entry.type === "projeto"
            ? "Abrindo o projeto especial SMARTx."
            : "Filtrando coleções selecionadas.",
    });
  };

  const handleSubmit = () => {
    const current = suggestions[highlightedIndex];
    if (current) {
      handleSelect(current);
      return;
    }

    toast({
      title: "Resultados para a sua busca",
      description: query ? `Exibindo correspondências para “${query}”.` : "Explore as coleções em destaque.",
    });
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      setIsOpen(true);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(suggestions.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + Math.max(suggestions.length, 1)) % Math.max(suggestions.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const renderSuggestion = (entry: SearchEntry, index: number) => {
    const isActive = index === highlightedIndex;

    return (
      <button
        key={entry.id}
        role="option"
        id={`${id}-option-${entry.id}`}
        aria-selected={isActive}
        onMouseEnter={() => setHighlightedIndex(index)}
        onClick={() => handleSelect(entry)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors",
          "border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
          isActive ? "bg-[rgba(144,8,11,0.18)] border-[rgba(144,8,11,0.32)]" : "hover:bg-white/5",
        )}
      >
        <span className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[var(--ink)]">{entry.label}</span>
          {entry.meta && (
            <span className="text-xs uppercase tracking-[0.08em] text-[rgba(250,250,252,0.64)]">
              {entry.type === "artista" ? "Artista" : entry.type === "projeto" ? "Projeto" : "Categoria"} · {entry.meta}
            </span>
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[rgba(250,250,252,0.64)]" />
      </button>
    );
  };

  return (
    <div ref={containerRef} className="relative" id={id}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border px-5 transition-all duration-200",
          variant === "hero"
            ? "h-14 bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            : "h-11 bg-white/5 border-white/10 backdrop-blur-md",
          isOpen ? "ring-2 ring-[rgba(144,8,11,0.48)]" : "hover:border-white/20",
        )}
      >
        <Search className="h-5 w-5 text-[rgba(250,250,252,0.68)]" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          className={cn(
            "h-full flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[rgba(250,250,252,0.45)] focus:outline-none",
            variant === "hero" ? "text-base" : "text-sm",
          )}
          placeholder={placeholder}
          value={query}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          aria-expanded={isOpen}
          aria-activedescendant={isOpen && suggestions[highlightedIndex] ? `${id}-option-${suggestions[highlightedIndex].id}` : undefined}
          onFocus={handleFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex h-9 items-center rounded-full bg-[rgba(144,8,11,0.82)] px-4 text-sm font-semibold tracking-wide text-[var(--ink)] transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(144,8,11,0.55)]"
        >
          Pesquisar
        </button>
      </div>

      <div
        id={`${id}-listbox`}
        role="listbox"
        aria-label="Sugestões de busca SMARTx"
        className={cn(
          "glass-panel absolute left-0 right-0 top-full z-20 mt-3 origin-top rounded-2xl p-4 shadow-[0_28px_60px_rgba(0,0,0,0.48)]",
          "transition-all duration-200",
          isOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
        )}
      >
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[rgba(250,250,252,0.52)]">
          <span className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Sugestões
          </span>
          {isFiltering && <Loader2 className="h-3.5 w-3.5 animate-spin text-[rgba(250,250,252,0.6)]" aria-hidden />}
        </div>
        <div className="flex flex-col gap-1.5" aria-live="polite">
          {suggestions.map((entry, index) => renderSuggestion(entry, index))}
          {suggestions.length === 0 && (
            <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-sm text-[rgba(250,250,252,0.68)]">
              Nenhum resultado imediato. Ajuste os termos ou explore as coleções abaixo.
            </p>
          )}
        </div>

        {onChipSelect && (
          <div className="mt-4">
            <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[rgba(250,250,252,0.52)]">Categorias em alta</div>
            <div className="flex flex-wrap gap-2">
              {limitedChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="chip bg-[rgba(255,255,255,0.05)] text-xs font-semibold text-[var(--ink)] hover:bg-[rgba(144,8,11,0.2)]"
                  onClick={() => {
                    onChipSelect?.(chip);
                    setIsOpen(false);
                    toast({
                      title: chip,
                      description: "Carrosséis atualizados com a curadoria selecionada.",
                    });
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
