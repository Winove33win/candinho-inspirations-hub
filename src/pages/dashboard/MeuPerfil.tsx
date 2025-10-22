import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import { useDashboardContext } from "./context";
import DadosPessoais from "./tabs/DadosPessoais";
import VisaoGeral from "./tabs/VisaoGeral";
import TrajetoriaPessoal from "./tabs/TrajetoriaPessoal";
import Carreira from "./tabs/Carreira";
import Mais from "./tabs/Mais";
import BiografiaRedes from "./tabs/BiografiaRedes";
import VideosAudios from "./tabs/VideosAudios";
import Fotografias from "./tabs/Fotografias";

export default function MeuPerfil() {
  const { user, artistDetails, upsertArtistDetails } = useDashboardContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dados-pessoais");

  useEffect(() => {
    const state = location.state as { focusTab?: string } | null;
    if (state?.focusTab) {
      setActiveTab(state.focusTab);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!user) {
      setActiveTab("dados-pessoais");
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const details: ArtistDetails | null = artistDetails ?? null;

  return (
    <div className="dashboard-content space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[var(--shadow-card)] backdrop-blur md:p-8">
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Meu perfil profissional
          </span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Construa uma vitrine alinhada à identidade SMARTx</h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Atualize suas informações, história e portfólio em um fluxo organizado. Cada aba representa um capítulo da sua narrativa — preencha com cuidado para que o time de curadoria tenha um panorama completo.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList
          aria-label="Navegação do perfil"
          className="sticky top-6 z-30 flex w-full gap-2 overflow-x-auto rounded-full border border-white/60 bg-white/90 p-2 shadow-[var(--shadow-card)] backdrop-blur"
        >
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="dados-pessoais"
          >
            Dados pessoais
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="visao-geral"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="trajetoria"
          >
            Trajetória Pessoal
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="carreira"
          >
            Carreira
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="mais"
          >
            Mais
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="biografia"
          >
            Biografia e redes
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="videos"
          >
            Vídeos e Áudios
          </TabsTrigger>
          <TabsTrigger
            className="flex min-w-[160px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:hover:text-foreground"
            value="fotografias"
          >
            Fotografias
          </TabsTrigger>
        </TabsList>

        <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[var(--shadow-card)] backdrop-blur md:p-8">
          <TabsContent value="dados-pessoais" className="focus-visible:outline-none">
            <DadosPessoais artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="visao-geral" className="focus-visible:outline-none">
            <VisaoGeral artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="trajetoria" className="focus-visible:outline-none">
            <TrajetoriaPessoal artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="carreira" className="focus-visible:outline-none">
            <Carreira artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="mais" className="focus-visible:outline-none">
            <Mais artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="biografia" className="focus-visible:outline-none">
            <BiografiaRedes artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="videos" className="focus-visible:outline-none">
            <VideosAudios artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>

          <TabsContent value="fotografias" className="focus-visible:outline-none">
            <Fotografias artistDetails={details} onUpsert={upsertArtistDetails} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

