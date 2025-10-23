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
    <div className="mx-auto max-w-6xl px-6 pb-16 md:px-8">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-10">
        <div className="space-y-8">
          <header className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              Perfil
            </span>
            <h1 className="text-2xl font-['League_Spartan'] font-bold text-[var(--ink)] md:text-4xl">Meu perfil profissional</h1>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Organize suas informações, mídias e trajetória artística para manter sua presença alinhada ao padrão SMARTx.
            </p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList
              aria-label="Navegação do perfil"
              className="sticky top-16 z-30 flex w-full gap-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-white/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/80"
            >
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="dados-pessoais">
                Dados pessoais
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="visao-geral">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="trajetoria">
                Trajetória Pessoal
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="carreira">
                Carreira
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="mais">
                Mais
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="biografia">
                Biografia e redes
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="videos">
                Vídeos e Áudios
              </TabsTrigger>
              <TabsTrigger className="flex-1 min-w-[160px] rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=active]:shadow" value="fotografias">
                Fotografias
              </TabsTrigger>
            </TabsList>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)] md:p-8">
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
      </div>
    </div>
  );

}

