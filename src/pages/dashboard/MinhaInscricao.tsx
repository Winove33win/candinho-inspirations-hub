import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardContext } from "./context";

export default function MinhaInscricao() {
  const { artistDetails } = useDashboardContext();
  const navigate = useNavigate();

  const steps = [
    {
      id: "cadastro",
      title: "Cadastro básico",
      description: "Complete seus dados pessoais e informações de contato",
      completed: Boolean(
        artistDetails?.full_name &&
          artistDetails?.cell_phone &&
          artistDetails?.accepted_terms1
      ),
    },
    {
      id: "perfil",
      title: "Perfil profissional",
      description: "Adicione biografia, redes sociais e informações artísticas",
      completed: Boolean(
        artistDetails?.artistic_name &&
          artistDetails?.profile_text2 &&
          artistDetails?.instagram
      ),
    },
    {
      id: "portfolio",
      title: "Portfólio",
      description: "Upload de fotos, vídeos e materiais de divulgação",
      completed: Boolean(
        artistDetails?.image1 || artistDetails?.link_to_video
      ),
    },
    {
      id: "revisao",
      title: "Revisão final",
      description: "Verifique todas as informações antes de submeter",
      completed: artistDetails?.perfil_completo || false,
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  const nextStep = steps.find((step) => !step.completed);

  const focusTabMap: Record<string, string> = {
    cadastro: "dados-pessoais",
    perfil: "biografia",
    portfolio: "fotografias",
    revisao: "visao-geral",
  };

  const handleCompleteProfile = () => {
    const target = focusTabMap[nextStep?.id ?? "cadastro"] || "dados-pessoais";
    navigate("/dashboard", { state: { focusTab: target } });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">
          Minha Inscrição
        </h2>
        <p className="text-sm text-[var(--muted)] md:text-base">
          Acompanhe o status da sua inscrição no programa SMARTx.
        </p>
      </div>

      <Card className="space-y-8 p-6 md:p-8">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span className="text-sm font-semibold text-[var(--ink)]">
              Progresso geral
            </span>
            <span className="text-sm font-semibold text-[var(--brand)]">
              {completedSteps}/{steps.length} etapas
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--surface-alt)]">
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className="flex gap-4 border border-[var(--border)] bg-[var(--surface)] p-4 shadow-none transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-alt)]">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
                ) : (
                  <Circle className="h-5 w-5 text-[var(--muted)]" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Etapa {index + 1}
                  </span>
                  {step.completed && (
                    <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">
                      Completa
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[var(--ink)]">{step.title}</h3>
                <p className="text-sm text-[var(--muted)]">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {progress === 100 ? (
          <div className="rounded-[var(--radius)] bg-[var(--brand-soft)] p-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[var(--brand)]" />
            <h3 className="text-lg font-semibold text-[var(--ink)]">Inscrição completa!</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Seu perfil está completo e pronto para ser revisado pela equipe SMARTx. Você receberá um e-mail com próximos passos em breve.
            </p>
          </div>
        ) : (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-alt)] p-6">
            <h3 className="text-base font-semibold text-[var(--ink)]">Próximo passo sugerido</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {nextStep
                ? `Avance para a etapa "${nextStep.title}" para continuar sua inscrição.`
                : "Conclua as seções pendentes para finalizar sua inscrição."}
            </p>
            <Button onClick={handleCompleteProfile} className="mt-4">
              Concluir configuração
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
