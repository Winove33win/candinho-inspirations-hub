import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardContext } from "./context";
import { useNavigate } from "react-router-dom";

const checklist = [
  { field: "profile_image", label: "Envie uma foto de perfil", tab: "dados-pessoais" },
  { field: "audio", label: "Adicione o áudio Ouça-me", tab: "videos" },
  { field: "video_banner_landscape", label: "Envie o vídeo banner 16:9", tab: "videos" },
  { field: "video_banner_portrait", label: "Envie o vídeo banner 9:16", tab: "videos" },
  { field: "biography1", label: "Faça o upload do documento de biografia", tab: "biografia" },
  { field: "image1", label: "Adicione fotografias à galeria", tab: "fotografias" },
];

export default function MinhaInscricao() {
  const { artistDetails } = useDashboardContext();
  const navigate = useNavigate();

  const { isComplete, missingItems, nextTab } = useMemo(() => {
    if (!artistDetails) {
      return { isComplete: false, missingItems: checklist, nextTab: "dados-pessoais" };
    }

    const missing = checklist.filter((item) => {
      const value = artistDetails[item.field as keyof typeof artistDetails];
      return !value;
    });

    return {
      isComplete: artistDetails.perfil_completo && missing.length === 0,
      missingItems: missing,
      nextTab: missing[0]?.tab ?? "dados-pessoais",
    };
  }, [artistDetails]);

  const handleNavigate = () => {
    navigate("/dashboard", { state: { focusTab: nextTab } });
  };

  const lastUpdate = artistDetails?.updated_at
    ? format(new Date(artistDetails.updated_at), "dd 'de' MMMM 'de' yyyy HH:mm", { locale: ptBR })
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {isComplete ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            )}
            <div>
              <h2 className="text-2xl font-semibold">Status do cadastro</h2>
              <p className="text-muted-foreground">
                {isComplete ? "Seu perfil está completo." : "Ainda há etapas pendentes para concluir seu perfil."}
              </p>
              {lastUpdate && (
                <p className="text-sm text-muted-foreground">Última atualização: {lastUpdate}</p>
              )}
            </div>
          </div>
          <Button onClick={handleNavigate} className="self-start md:self-auto">
            Concluir configuração
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Checklist</h3>
          {missingItems.length === 0 ? (
            <p className="text-muted-foreground">Tudo pronto! Seu perfil está completo.</p>
          ) : (
            <ul className="space-y-2">
              {missingItems.map((item) => (
                <li key={item.field} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-1 text-yellow-600" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
