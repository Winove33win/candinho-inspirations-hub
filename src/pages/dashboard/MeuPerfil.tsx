// src/pages/dashboard/MeuPerfil.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
  const [dirtyTabs, setDirtyTabs] = useState<Record<string, boolean>>({});

  const tabDirtyHandlers = useMemo(() => {
    const tabs = ["dados-pessoais", "visao-geral", "trajetoria", "carreira", "mais", "biografia", "videos", "fotografias"] as const;
    return Object.fromEntries(
      tabs.map((tab) => [
        tab,
        (isDirty: boolean) =>
          setDirtyTabs((prev) => (prev[tab] === isDirty ? prev : { ...prev, [tab]: isDirty })),
      ])
    ) as Record<string, (isDirty: boolean) => void>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Card className="p-6 md:p-10">
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
          </Card>
        </div>

        <TabsList
          aria-label="Navegação do perfil"
          className="sticky top-20 z-30 site-container -mx-6 flex h-auto gap-2 overflow-x-auto rounded-xl border border-[var(--elev-border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-2 py-2 backdrop-blur supports-[overflow:clip]:[overflow:clip] [scrollbar-gutter:stable] md:-mx-8"
        >
          {(
            [
              { value: "dados-pessoais", label: "Dados pessoais" },
              { value: "visao-geral",    label: "Visão Geral" },
              { value: "trajetoria",     label: "Trajetória Pessoal" },
              { value: "carreira",       label: "Carreira" },
              { value: "mais",           label: "Mais" },
              { value: "biografia",      label: "Biografia e redes" },
              { value: "videos",         label: "Vídeos e Áudios" },
              { value: "fotografias",    label: "Fotografias" },
            ] as const
          ).map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="relative inline-flex min-w-[150px] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text-3)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/40 data-[state=active]:bg-[var(--brand)] data-[state=active]:text-white data-[state=inactive]:hover:bg-[var(--brand-soft)] data-[state=inactive]:hover:text-[var(--text-1)]"
            >
              {label}
              {dirtyTabs[value] && (
                <span className={`h-2 w-2 shrink-0 rounded-full ${activeTab === value ? "bg-white/80" : "bg-amber-400"}`} />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="site-container">
          <Card className="p-4 md:p-8">
            <TabsContent value="dados-pessoais" className="mt-0 focus-visible:outline-none">
              <DadosPessoais artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["dados-pessoais"]} />
            </TabsContent>

            <TabsContent value="visao-geral" className="mt-0 focus-visible:outline-none">
              <VisaoGeral artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["visao-geral"]} />
            </TabsContent>

            <TabsContent value="trajetoria" className="mt-0 focus-visible:outline-none">
              <TrajetoriaPessoal artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["trajetoria"]} />
            </TabsContent>

            <TabsContent value="carreira" className="mt-0 focus-visible:outline-none">
              <Carreira artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["carreira"]} />
            </TabsContent>

            <TabsContent value="mais" className="mt-0 focus-visible:outline-none">
              <Mais artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["mais"]} />
            </TabsContent>

            <TabsContent value="biografia" className="mt-0 focus-visible:outline-none">
              <BiografiaRedes artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["biografia"]} />
            </TabsContent>

            <TabsContent value="videos" className="mt-0 focus-visible:outline-none">
              <VideosAudios artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["videos"]} />
            </TabsContent>

            <TabsContent value="fotografias" className="mt-0 focus-visible:outline-none">
              <Fotografias artistDetails={details} onUpsert={upsertArtistDetails} onDirtyChange={tabDirtyHandlers["fotografias"]} />
            </TabsContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );

}

