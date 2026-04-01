import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDashboardContext } from "./context";
import { cn } from "@/lib/utils";

const focusTabMap: Record<string, string> = {
  cadastro:  "dados-pessoais",
  perfil:    "biografia",
  portfolio: "fotografias",
  revisao:   "visao-geral",
};

export default function MinhaInscricao() {
  const { artistDetails } = useDashboardContext();
  const navigate = useNavigate();

  const steps = [
    {
      id: "cadastro",
      title: "Cadastro básico",
      description: "Complete seus dados pessoais e informações de contato.",
      requirements: ["Nome completo", "Número de celular", "Aceite dos termos de uso"],
      completed: Boolean(
        artistDetails?.full_name &&
        artistDetails?.cell_phone &&
        artistDetails?.accepted_terms1
      ),
    },
    {
      id: "perfil",
      title: "Perfil profissional",
      description: "Adicione biografia, redes sociais e informações artísticas.",
      requirements: ["Nome artístico", "Frase de impacto", "Instagram ou rede social"],
      completed: Boolean(
        artistDetails?.artistic_name &&
        artistDetails?.profile_text2 &&
        artistDetails?.instagram
      ),
    },
    {
      id: "portfolio",
      title: "Portfólio",
      description: "Upload de fotos, vídeos e materiais de divulgação.",
      requirements: ["Pelo menos 1 foto ou 1 link de vídeo"],
      completed: Boolean(artistDetails?.image1 || artistDetails?.link_to_video),
    },
    {
      id: "revisao",
      title: "Revisão final",
      description: "Verifique todas as informações antes de submeter.",
      requirements: ["Perfil marcado como completo"],
      completed: artistDetails?.perfil_completo || false,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progress       = (completedCount / steps.length) * 100;
  const nextStep       = steps.find((s) => !s.completed);

  const goToStep = (stepId: string) => {
    const tab = focusTabMap[stepId] || "dados-pessoais";
    navigate("/dashboard", { state: { focusTab: tab } });
  };

  const profileUrl = artistDetails?.slug
    ? `/artistas/${artistDetails.slug}`
    : null;

  return (
    <div className="site-container space-y-6 pb-16">

      {/* Header */}
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">
              Minha Inscrição
            </h2>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Acompanhe o status da sua inscrição no programa SMARTx.
            </p>
          </div>
          {profileUrl && (
            <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
              <Link to={profileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Ver perfil público
              </Link>
            </Button>
          )}
        </div>
      </Card>

      {/* Progress bar */}
      <Card className="p-6 md:p-8 space-y-8">
        <div className="space-y-3">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <span className="text-sm font-semibold text-[var(--ink)]">Progresso geral</span>
            <span className="text-sm font-semibold text-[var(--brand)]">
              {completedCount}/{steps.length} etapas concluídas
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--surface-alt)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[var(--muted)]">
            {progress === 100
              ? "Parabéns! Seu perfil está 100% completo."
              : `Faltam ${steps.length - completedCount} etapa${steps.length - completedCount > 1 ? "s" : ""} para completar seu perfil.`}
          </p>
        </div>

        {/* Step cards — clickable */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => !step.completed && goToStep(step.id)}
              disabled={step.completed}
              className={cn(
                "smartx-card w-full text-left flex gap-4 p-4 md:p-6 transition-all duration-200",
                step.completed
                  ? "opacity-80 cursor-default"
                  : "hover:-translate-y-[1px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)] hover:border-[var(--brand)]/40 cursor-pointer"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                step.completed ? "bg-[var(--brand-soft)]" : "bg-[var(--surface-alt)]"
              )}>
                {step.completed
                  ? <CheckCircle2 className="h-6 w-6 text-[var(--brand)]" />
                  : <Circle className="h-6 w-6 text-[var(--muted)]" />
                }
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                    Etapa {index + 1}
                  </span>
                  {step.completed && (
                    <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">
                      Completa ✓
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink)] md:text-base">{step.title}</h3>
                <p className="text-sm text-[var(--muted)]">{step.description}</p>

                {/* Requirements list */}
                <ul className="mt-1 space-y-0.5">
                  {step.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        step.completed ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                      )} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow — only on incomplete */}
              {!step.completed && (
                <ArrowRight className="h-4 w-4 shrink-0 self-center text-[var(--muted)]" />
              )}
            </button>
          ))}
        </div>

        {/* CTA / completion message */}
        {progress === 100 ? (
          <div className="rounded-[var(--radius)] bg-[var(--brand-soft)] p-6 text-center md:p-8">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[var(--brand)]" />
            <h3 className="text-lg font-semibold text-[var(--ink)]">Inscrição completa!</h3>
            <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
              Seu perfil está completo e pronto para ser revisado pela equipe SMARTx.
            </p>
            {profileUrl && (
              <Button asChild className="mt-4 gap-2">
                <Link to={profileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Ver meu perfil público
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-alt)] p-6 md:p-8">
            <h3 className="text-base font-semibold text-[var(--ink)]">Próximo passo sugerido</h3>
            <p className="mt-2 text-sm text-[var(--muted)] md:text-base">
              {nextStep
                ? `Clique na etapa "${nextStep.title}" acima para continuar sua inscrição.`
                : "Conclua as seções pendentes para finalizar sua inscrição."}
            </p>
            {nextStep && (
              <Button onClick={() => goToStep(nextStep.id)} className="mt-4 gap-2">
                Ir para: {nextStep.title}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
