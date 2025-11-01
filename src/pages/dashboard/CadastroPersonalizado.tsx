import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ExternalLink } from "lucide-react";

export default function CadastroPersonalizado() {
  return (
    <div className="site-container space-y-6 pb-16">
      <Card className="p-6 md:p-8">
        <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">
          Cadastro Personalizado
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)] md:text-base">
          Configurações avançadas e personalização do seu perfil
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <Card className="p-6 md:p-8">
          <Settings className="mb-4 h-10 w-10 text-[var(--brand)]" />
          <h3 className="mb-2 text-lg font-semibold text-[var(--ink)]">
            Configurações de perfil
          </h3>
          <p className="mb-4 text-sm text-[var(--muted)] md:text-base">
            Gerencie suas preferências, visibilidade e configurações de privacidade
          </p>
          <Button variant="outline" asChild aria-label="Ir para meu perfil">
            <a href="/dashboard">
              Ir para perfil
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="mb-4 rounded-lg bg-[var(--brand-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--brand)]">Em desenvolvimento</p>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[var(--ink)]">
            Personalização avançada
          </h3>
          <p className="text-sm text-[var(--muted)] md:text-base">
            Recursos de personalização adicional estarão disponíveis em breve
          </p>
        </Card>
      </div>

      <Card className="bg-[var(--surface-alt)] p-6 md:p-8">
        <h3 className="mb-3 text-base font-semibold text-[var(--ink)]">Recursos disponíveis</h3>
        <ul className="space-y-2 text-sm text-[var(--muted)] md:text-base">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Edição completa de dados pessoais e profissionais
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Upload de fotos, vídeos e documentos
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Gerenciamento de projetos e eventos
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Links para redes sociais e portfólios externos
          </li>
        </ul>
      </Card>
    </div>
  );
}
