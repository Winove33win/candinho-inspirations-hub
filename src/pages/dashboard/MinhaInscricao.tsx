import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { useDashboardContext } from "./context";

export default function MinhaInscricao() {
  const { artistDetails } = useDashboardContext();

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-['League_Spartan'] font-bold">
          Minha Inscrição
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Acompanhe o status da sua inscrição no programa SMARTx
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">
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

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex gap-4 rounded-lg border border-[var(--border)] p-4 transition-all hover:border-[var(--brand)]"
              >
                <div className="flex-shrink-0 pt-1">
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-[var(--brand)]" />
                  ) : (
                    <Circle className="h-6 w-6 text-[var(--muted)]" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Etapa {index + 1}
                    </span>
                    {step.completed && (
                      <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">
                        Completa
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {progress === 100 ? (
            <div className="rounded-lg bg-[var(--brand-soft)] p-6 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--brand)] mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Inscrição completa!
              </h3>
              <p className="text-sm text-[var(--muted)]">
                Seu perfil está completo e pronto para ser revisado pela equipe
                SMARTx. Você receberá um e-mail com próximos passos em breve.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-6">
              <h3 className="font-semibold mb-2">Próximos passos</h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                Complete todas as etapas para finalizar sua inscrição no programa
                SMARTx e aumentar suas chances de aprovação.
              </p>
              <Button asChild>
                <a href="/dashboard">Continuar preenchimento</a>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
