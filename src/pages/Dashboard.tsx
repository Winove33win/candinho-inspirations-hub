import { useEffect, type ReactNode } from "react";
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

  if (userLoading || detailsLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
    upsertArtistDetails,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />

      <div className="flex flex-1">
        <aside className="w-[260px] shrink-0 border-r bg-neutral-50/70">
          <div className="border-b p-4">
            <p className="text-sm font-medium text-neutral-600">{user.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 justify-start gap-2 text-neutral-700 hover:bg-neutral-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Item key={item.path} to={item.path} icon={item.icon}>
                {item.label}
              </Item>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="container mx-auto flex max-w-6xl flex-1 flex-col px-6 pb-16 pt-24 md:px-8">
            <Outlet context={contextValue} />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

type MenuItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

function Item({
  to,
  children,
  icon: Icon,
}: {
  to: string;
  children: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium " +
        (isActive
          ? "bg-neutral-200 text-neutral-900"
          : "text-neutral-700 hover:bg-neutral-100")
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}
