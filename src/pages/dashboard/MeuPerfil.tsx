// src/pages/dashboard/MeuPerfil.tsx
import { useEffect, useState } from "react";
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

  // navegação programática para uma aba específica (vinda de outra rota)
  useEffect(() => {
    const state = location.state as { focusTab?: string } | null;
    if (state?.focusTab) {
      setActiveTab(state.focusTab);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  // fallback seguro
  useEffect(() => {
    if (!user) setActiveTab("dados-pessoais");
  }, [user]);

  if (!user) return null;

  const details: ArtistDetails | null = artistDetails ?? null;

  return (
    <div className="dashboard-content space-y-6 pb-12">
      <h1 className="text-3xl font-bold font-['League_Spartan']">Meu perfil profissional</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        {/* LISTA DE ABAS — sticky + z-index alto para garantir clique */}
        <TabsList
          aria-label="Navegação do perfil"
          className="sticky top-0 z-30 flex h-auto w-full gap-2 overflow-x-auto rounded-md border bg-white/95 p-2 backdrop-blur"
        >
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="dados-pessoais">
            Dados pessoais
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="visao-geral">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="trajetoria">
            Trajetória Pessoal
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="carreira">
            Carreira
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="mais">
            Mais
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="biografia">
            Biografia e redes
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="videos">
            Vídeos e Áudios
          </TabsTrigger>
          <TabsTrigger className="flex-1 whitespace-normal text-center" value="fotografias">
            Fotografias
          </TabsTrigger>
        </TabsList>

        {/* CONTEÚDO */}
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
