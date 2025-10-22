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
import type { ArtistDetails } from "@/hooks/useArtistDetails";

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

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login");
    }
  }, [userLoading, user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/login");
  };

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
    upsertArtistDetails,
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

  const completion = useMemo(() => {
    const requiredFields: (keyof ArtistDetails)[] = [
      "artistic_name",
      "full_name",
      "cell_phone",
      "date_of_birth",
      "country_residence",
      "profile_text2",
    ];

    if (!artistDetails) return 20;

    const filled = requiredFields.filter((field) => {
      const value = artistDetails[field];
      if (typeof value === "boolean") return value;
      if (typeof value === "string") return value.trim().length > 0;
      return Boolean(value);
    }).length;

    const ratio = Math.round((filled / requiredFields.length) * 100);
    return Math.min(100, Math.max(ratio, artistDetails.perfil_completo ? 100 : ratio));
  }, [artistDetails]);

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

  if (userLoading || detailsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-neutral-50 via-white to-white text-neutral-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_55%)]" />
      <Header />

      <div className="relative flex min-h-screen flex-col pt-20">
        <div className="flex flex-1">
          <aside className="relative hidden w-[280px] shrink-0 border-r border-transparent bg-white/70 px-6 pb-12 pt-12 shadow-[inset_-1px_0_0_rgba(255,255,255,0.4)] backdrop-blur xl:block">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl bg-neutral-900 px-4 py-3 text-white">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">Progresso</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold leading-none">{completion}%</span>
                    <span className="text-xs font-medium uppercase tracking-widest text-white/70">
                      {completionLabel}
                    </span>
                  </div>
                  <Progress value={completion} className="mt-3 h-2 bg-white/20" />
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="mt-4 w-full bg-white/10 text-white hover:bg-white/20"
                  >
                    <NavLink to="/dashboard">Atualizar perfil</NavLink>
                  </Button>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Item key={item.path} to={item.path} icon={item.icon}>
                    {item.label}
                  </Item>
                ))}
              </nav>

              <Button
                variant="ghost"
                size="sm"
                className="group mt-6 w-full justify-start gap-2 rounded-xl border border-transparent bg-white/70 text-neutral-700 transition hover:border-neutral-200 hover:bg-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 transition group-hover:text-primary" />
                Sair da conta
              </Button>
            </div>
          </aside>

          <main className="flex-1">
            <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-16 pt-10 md:px-8">
              <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-8 shadow-[var(--shadow-card)] backdrop-blur md:p-10">
                <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neutral-900/5 blur-3xl" />
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl space-y-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                      Portal do artista
                    </span>
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                      Bem-vindo de volta, {displayName.split(" ")[0] || displayName}
                    </h1>
                    <p className="text-sm text-muted-foreground md:text-base">
                      Centralize seu posicionamento profissional, divulgue eventos, organize documentos estratégicos e acompanhe o relacionamento com a curadoria SMARTx em um ambiente premium.
                    </p>
                  </div>
                  <div className="relative w-full max-w-sm rounded-3xl border border-white/70 bg-neutral-900 p-6 text-white shadow-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">Status do perfil</p>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                        {artistDetails?.perfil_completo ? "Completo" : "Em progresso"}
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-semibold leading-none">{completion}%</span>
                      <span className="text-sm text-white/70">concluído</span>
                    </div>
                    <Progress value={completion} className="mt-5 h-2 bg-white/20" />
                    <p className="mt-4 text-xs leading-relaxed text-white/70">
                      Preencha seus dados pessoais, atualize mídias e mantenha seu perfil sempre alinhado com a identidade SMARTx.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="mt-5 w-full bg-white text-neutral-900 hover:bg-white/90"
                    >
                      <NavLink to="/dashboard">Continuar edição</NavLink>
                    </Button>
                  </div>
                </div>
              </section>

              <div className="lg:hidden">
                <nav className="flex gap-2 overflow-x-auto rounded-full border border-white/60 bg-white/90 p-2 shadow-[var(--shadow-card)] backdrop-blur">
                  {menuItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-3.5 w-3.5" />
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
                        "group relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                        isActive && "border-primary/40 shadow-xl"
                      )
                    }
                  >
                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-start gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <action.icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-neutral-900">{action.label}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>

              <Outlet context={contextValue} />
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

type QuickAction = MenuItem & {
  description: string;
};

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
          "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
          className,
          isActive
            ? "bg-primary/15 text-primary shadow-[var(--shadow-card)]"
            : "text-muted-foreground hover:bg-white hover:text-neutral-900"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}
