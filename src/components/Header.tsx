import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";

import GlobalSearch from "@/components/GlobalSearch";
import type { DiscoveryChip, SearchEntry } from "@/data/homepage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSection = (sectionId: string, options?: { chip?: DiscoveryChip }) => {
    if (typeof window === "undefined") {
      navigate("/", { state: { scrollTo: sectionId, chip: options?.chip } });
      return;
    }

    const scroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (options?.chip) {
        window.dispatchEvent(new CustomEvent<DiscoveryChip>("smartx-chip-select", { detail: options.chip }));
      }
    };

    if (location.pathname === "/") {
      requestAnimationFrame(scroll);
      return;
    }

    navigate("/", { state: { scrollTo: sectionId, chip: options?.chip } });
  };

  return (
    <header
      id="siteHeader"
      className={`fixed inset-x-0 top-0 z-50 transition-all transition-soft ${
        isScrolled
          ? "bg-[rgba(18,0,0,0.9)]/95 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.45)]"
          : "bg-gradient-to-b from-[rgba(18,0,0,0.85)] via-[rgba(18,0,0,0.55)] to-transparent"
      }`}
    >
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-baseline gap-1 text-2xl font-extrabold tracking-[0.24em] text-white">
            SMART<span className="text-[var(--brand)]">x</span>
          </Link>
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.24em] text-[rgba(250,250,252,0.85)] lg:flex"
          >
            <Link to="/artistas" className="transition hover:text-[var(--brand)]">
              Artistas
            </Link>
            <button
              type="button"
              className="border-none bg-transparent transition hover:text-[var(--brand)]"
              onClick={() => navigateToSection("chipsDiscover", { chip: "Em Destaque" })}
            >
              Categorias
            </button>
            <button
              type="button"
              className="border-none bg-transparent transition hover:text-[var(--brand)]"
              onClick={() => navigateToSection("blockProjetos")}
            >
              Projetos
            </button>
            <button
              type="button"
              className="border-none bg-transparent transition hover:text-[var(--brand)]"
              onClick={() => navigateToSection("blockEventos")}
            >
              Eventos
            </button>
            <button
              type="button"
              className="border-none bg-transparent transition hover:text-[var(--brand)]"
              onClick={() => navigateToSection("siteFooter")}
            >
              Contato
            </button>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden max-w-md flex-1 xl:block">
            <GlobalSearch
              id="global-search-header"
              variant="header"
              onSelectSuggestion={(entry: SearchEntry) => {
                if (entry.type === "categoria") {
                  window.dispatchEvent(
                    new CustomEvent<DiscoveryChip>("smartx-chip-select", {
                      detail: entry.label as DiscoveryChip,
                    }),
                  );
                  document.getElementById("chipsDiscover")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  return;
                }

                navigate(entry.href);
              }}
              onChipSelect={(chip) => {
                window.dispatchEvent(new CustomEvent<DiscoveryChip>("smartx-chip-select", { detail: chip }));
                document.getElementById("chipsDiscover")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          </div>
          {!user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Button 
                variant="ghost" 
                className="text-sm font-semibold uppercase tracking-[0.28em]" 
                onClick={() => navigate(`/auth?next=${encodeURIComponent(location.pathname)}`)}
              >
                Login
              </Button>
              <Button
                className="rounded-full bg-[var(--brand)] px-5 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--ink)] hover:bg-[rgba(144,8,11,0.88)]"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Cadastre-se
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ink)] transition hover:border-[rgba(144,8,11,0.4)] hover:bg-[rgba(144,8,11,0.18)]"
                >
                  <span className="hidden sm:inline">Minha Conta</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(144,8,11,0.32)] text-[var(--ink)]">
                    <User className="h-4 w-4" aria-hidden />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel mt-2 w-56 border border-[rgba(255,255,255,0.12)] text-[rgba(250,250,252,0.82)]">
                <DropdownMenuLabel className="text-xs uppercase tracking-[0.28em] text-[rgba(250,250,252,0.65)]">
                  Acesso rápido
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.08)]" />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Portal do Artista</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/projetos">Meus Projetos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.08)]" />
                <DropdownMenuItem onSelect={() => signOut()}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--ink)] transition hover:border-[rgba(144,8,11,0.4)] lg:hidden">
            <Menu className="h-5 w-5" aria-hidden />
            <span className="sr-only">Abrir menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
