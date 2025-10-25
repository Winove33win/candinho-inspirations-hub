// src/pages/Dashboard.tsx
import { useEffect, useMemo, type ReactNode } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  User,
  FolderKanban,
  Calendar,
  FileText,
  ClipboardList,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/useCurrentMember";
import { useArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "./dashboard/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { computeProfileCompletion } from "@/utils/profileCompletion";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

type QuickAction = MenuItem & {
  description: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: userLoading } = useCurrentMember();

  const {
    artistDetails,
    loading: detailsLoading,
    upsertArtistDetails,
    reloadDetails,
  } = useArtistDetails(user?.id);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado", description: "Até logo!" });
    navigate("/login");
  };

  const displayName = useMemo(() => {
    if (artistDetails?.artistic_name) return artistDetails.artistic_name;
    if (artistDetails?.full_name) return artistDetails.full_name;
    return user?.email ?? "Artista";
  }, [artistDetails?.artistic_name, artistDetails?.full_name, user?.email]);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .padEnd(2, "");
  }, [displayName]);

  const { percent: completion } = useMemo(
    () => computeProfileCompletion(artistDetails),
    [artistDetails],
  );

  useEffect(() => {
    if (artistDetails && completion === 100 && !artistDetails.perfil_completo) {
      void upsertArtistDetails({ perfil_completo: true });
    }
  }, [artistDetails, completion, upsertArtistDetails]);

  // Loading geral
  if (userLoading || detailsLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-alt)]">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
      </div>
    );
  }

  const menuItems: MenuItem[] = [
    { icon: User, label: "Meu perfil profissional", path: "/dashboard" },
    { icon: FolderKanban, label: "Projetos", path: "/dashboard/projetos" },
    { icon: Calendar, label: "Eventos", path: "/dashboard/eventos" },
    { icon: FileText, label: "Documentos", path: "/dashboard/documentos" },
    { icon: ClipboardList, label: "Minha Inscrição", path: "/dashboard/inscricao" },
    { icon: HelpCircle, label: "Suporte", path: "/dashboard/suporte" },
    { icon: Settings, label: "Cadastro Personalizado", path: "/dashboard/personalizado" },
  ];

  const contextValue: DashboardContextValue = {
    user,
    artistDetails,
    refreshArtistDetails: reloadDetails,
    upsertArtistDetails: async (payload) => {
      const result = await upsertArtistDetails(payload);
      return {
        data: result.data,
        error: result.error instanceof Error ? null : result.error,
      };
    },
  };

  const completionLabel =
    completion >= 90 ? "Perfil completo" : completion >= 60 ? "Quase lá" : "Comece por aqui";

  const quickActions: QuickAction[] = [
    {
      icon: FolderKanban,
      label: "Projetos",
      path: "/dashboard/projetos",
      description: "Atualize seu portfólio com novos trabalhos e colaborações.",
    },
    {
      icon: Calendar,
      label: "Eventos",
      path: "/dashboard/eventos",
      description: "Divulgue apresentações, estreias e datas importantes.",
    },
    {
      icon: FileText,
      label: "Documentos",
      path: "/dashboard/documentos",
      description: "Envie materiais oficiais, press kits e arquivos exclusivos.",
    },
  ];


  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-20 pb-20">
        <div className="site-container flex w-full flex-col gap-8 lg:flex-row">
          <aside className="hidden w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--surface-alt)] lg:block">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-[var(--brand-soft)] text-lg font-semibold text-[var(--brand)]">
                    {initials}
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-[var(--ink)]">{displayName}</p>
                    <p className="text-sm text-[var(--muted)]">{user.email}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[var(--radius)] bg-[var(--brand)] p-5 text-white shadow-[var(--shadow-card)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">Progresso</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold leading-none">{completion}%</span>
                    <span className="text-xs font-medium uppercase tracking-[0.24em] text-white/80">{completionLabel}</span>
                  </div>
                  <Progress value={completion} className="mt-4 h-2 bg-white/30" />
                  <p className="mt-4 text-xs text-white/80">
                    Mantenha seus dados completos para se destacar nas oportunidades SMARTx.
                  </p>
                  <Button asChild size="sm" variant="secondary" className="mt-4 w-full">
                    <NavLink to="/dashboard">Atualizar perfil</NavLink>
                  </Button>
                </div>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => (
                  <Item key={item.path} to={item.path} icon={item.icon}>
                    {item.label}
                  </Item>
                ))}
              </nav>

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm text-[var(--muted)] transition-all duration-200 hover:bg-white hover:text-[var(--ink)]"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </Button>
            </div>
          </aside>

          <section className="relative flex-1 space-y-8">
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                    Portal do artista
                  </span>
                  <h1 className="text-3xl font-['League_Spartan'] font-bold md:text-4xl">
                    Bem-vindo de volta, {displayName.split(" ")[0] || displayName}
                  </h1>
                  <p className="text-sm text-[var(--muted)] md:text-base">
                    Centralize sua presença profissional, divulgue eventos e organize documentos estratégicos em um ambiente alinhado à identidade SMARTx.
                  </p>
                </div>

                <div className="w-full max-w-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-alt)] p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Status do perfil</p>
                    <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                      {completion === 100 ? "Completo" : "Em progresso"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{completion}%</span>
                    <span className="text-sm text-[var(--muted)]">concluído</span>
                  </div>
                  <Progress value={completion} className="mt-5 h-2" />
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    Atualize seu perfil para destravar novas conexões e oportunidades com a curadoria SMARTx.
                  </p>
                  <Button asChild size="sm" className="mt-5 w-full">
                    <NavLink to="/dashboard">Continuar edição</NavLink>
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <nav className="flex gap-2 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-card)]">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200",
                        isActive ? "bg-[var(--brand)] text-white shadow" : "text-[var(--muted)] hover:text-[var(--ink)]",
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <NavLink
                  key={action.path}
                  to={action.path}
                  className={({ isActive }) =>
                    cn(
                      "group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md",
                      isActive && "border-[var(--brand)]",
                    )
                  }
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-[var(--brand-soft)] text-[var(--brand)]">
                      <action.icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-2">
                      <p className="text-base font-semibold">{action.label}</p>
                      <p className="text-sm text-[var(--muted)]">{action.description}</p>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>

            <Outlet context={contextValue} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );


}


function Item({
  to,
  children,
  icon: Icon,
  className,
}: {
  to: string;
  children: ReactNode;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-all duration-200 hover:bg-white hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40",
          isActive && "bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm",
          className,
        )
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}

