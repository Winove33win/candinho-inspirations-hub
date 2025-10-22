import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
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
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentMember } from "@/hooks/useCurrentMember";
import { useArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "./dashboard/context";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const menuItems = [
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#90080b] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-['League_Spartan']">SMARTx</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card min-h-[calc(100vh-64px)] p-4 border-r">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet context={contextValue} />
        </main>
      </div>
    </div>
  );
}