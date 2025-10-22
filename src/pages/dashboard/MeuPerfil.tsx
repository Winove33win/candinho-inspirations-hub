import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useArtistDetails } from "@/hooks/useArtistDetails";
import DadosPessoais from "./tabs/DadosPessoais";
import VisaoGeral from "./tabs/VisaoGeral";
import TrajetoriaPessoal from "./tabs/TrajetoriaPessoal";
import Carreira from "./tabs/Carreira";
import Mais from "./tabs/Mais";
import BiografiaRedes from "./tabs/BiografiaRedes";
import VideosAudios from "./tabs/VideosAudios";
import Fotografias from "./tabs/Fotografias";

export default function MeuPerfil() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const { artistDetails, loading } = useArtistDetails(user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-['League_Spartan']">Meu perfil profissional</h1>

      <Tabs defaultValue="dados-pessoais" className="w-full">
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
            <DadosPessoais artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="visao-geral">
            <VisaoGeral artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="trajetoria">
            <TrajetoriaPessoal artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="carreira">
            <Carreira artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="mais">
            <Mais artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="biografia">
            <BiografiaRedes artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="videos">
            <VideosAudios artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>

          <TabsContent value="fotografias">
            <Fotografias artistDetails={artistDetails} userId={user?.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}