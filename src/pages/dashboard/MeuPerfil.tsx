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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-['League_Spartan']">Meu perfil profissional</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="dados-pessoais">Dados pessoais</TabsTrigger>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="trajetoria">Trajetória Pessoal</TabsTrigger>
          <TabsTrigger value="carreira">Carreira</TabsTrigger>
          <TabsTrigger value="mais">Mais</TabsTrigger>
          <TabsTrigger value="biografia">Biografia e redes</TabsTrigger>
          <TabsTrigger value="videos">Vídeos e Áudios</TabsTrigger>
          <TabsTrigger value="fotografias">Fotografias</TabsTrigger>
        </TabsList>

        <div className="mt-6 bg-card p-6 rounded-lg">
          <TabsContent value="dados-pessoais">
            <DadosPessoais
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="visao-geral">
            <VisaoGeral
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="trajetoria">
            <TrajetoriaPessoal
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="carreira">
            <Carreira
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="mais">
            <Mais
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="biografia">
            <BiografiaRedes
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="videos">
            <VideosAudios
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>

          <TabsContent value="fotografias">
            <Fotografias
              artistDetails={details}
              onUpsert={upsertArtistDetails}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}