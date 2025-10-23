import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-['League_Spartan'] font-bold text-[var(--ink)] md:text-3xl">Minha inscrição</h1>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Acompanhe o status do seu cadastro e finalize as etapas pendentes para liberar todo o potencial do seu perfil.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              {isComplete ? (
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-amber-500" />
              )}
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[var(--ink)]">Status do cadastro</h2>
                <p className="text-sm text-[var(--muted)]">
                  {isComplete ? 'Seu perfil está completo.' : 'Ainda há etapas pendentes para concluir seu perfil.'}
                </p>
                {lastUpdate && (
                  <p className="text-xs text-[var(--muted)]">Última atualização: {lastUpdate}</p>
                )}
              </div>
            </div>
            <Button onClick={handleNavigate} className="self-start md:self-auto">
              Concluir configuração
            </Button>
          </div>

          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-lg font-semibold text-[var(--ink)] md:text-xl">Checklist</h3>
            {missingItems.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">Tudo pronto! Seu perfil está completo.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {missingItems.map((item) => (
                  <li key={item.field} className="flex items-start gap-3 text-sm text-[var(--ink)]">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}

