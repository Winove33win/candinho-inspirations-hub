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
    <div className="relative space-y-4 pb-16">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="site-container">
          <div className="rounded-[var(--radius)] border border-[#e5e7eb] bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
            <header className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-soft)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                Perfil
              </span>
              <h1 className="text-2xl font-['League_Spartan'] font-bold text-[var(--ink)] md:text-4xl">
                Meu perfil profissional
              </h1>
              <p className="text-sm text-[var(--muted)] md:text-base">
                Organize suas informações, mídias e trajetória artística para manter sua presença alinhada ao padrão SMARTx.
              </p>
            </header>
          </div>
        </div>

        <TabsList
          aria-label="Navegação do perfil"
          className="sticky top-20 z-30 site-container -mx-6 flex h-auto gap-2 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white/95 px-2 py-2 backdrop-blur supports-[overflow:clip]:[overflow:clip] [scrollbar-gutter:stable] md:-mx-8"
        >
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="dados-pessoais"
          >
            Dados pessoais
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="visao-geral"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="trajetoria"
          >
            Trajetória Pessoal
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="carreira"
          >
            Carreira
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="mais"
          >
            Mais
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="biografia"
          >
            Biografia e redes
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="videos"
          >
            Vídeos e Áudios
          </TabsTrigger>
          <TabsTrigger
            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[#6b7280] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90080b]/40 data-[state=active]:bg-[#90080b] data-[state=active]:text-white data-[state=inactive]:hover:text-[#1f1f1f]"
            value="fotografias"
          >
            Fotografias
          </TabsTrigger>
        </TabsList>

        <div className="site-container">
          <div className="rounded-[var(--radius)] border border-[#e5e7eb] bg-white p-4 shadow-[var(--shadow-card)] md:p-8">
            <TabsContent value="dados-pessoais" className="mt-0 focus-visible:outline-none">
              <DadosPessoais artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="visao-geral" className="mt-0 focus-visible:outline-none">
              <VisaoGeral artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="trajetoria" className="mt-0 focus-visible:outline-none">
              <TrajetoriaPessoal artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="carreira" className="mt-0 focus-visible:outline-none">
              <Carreira artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="mais" className="mt-0 focus-visible:outline-none">
              <Mais artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="biografia" className="mt-0 focus-visible:outline-none">
              <BiografiaRedes artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="videos" className="mt-0 focus-visible:outline-none">
              <VideosAudios artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>

            <TabsContent value="fotografias" className="mt-0 focus-visible:outline-none">
              <Fotografias artistDetails={details} onUpsert={upsertArtistDetails} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );

}

