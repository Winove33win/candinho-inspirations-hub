import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ExternalLink } from "lucide-react";

export default function CadastroPersonalizado() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-['League_Spartan'] font-bold">
          Cadastro Personalizado
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Configurações avançadas e personalização do seu perfil
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <Settings className="h-10 w-10 text-[var(--brand)] mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Configurações de perfil
          </h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            Gerencie suas preferências, visibilidade e configurações de
            privacidade
          </p>
          <Button variant="outline" asChild>
            <a href="/dashboard">
              Ir para perfil
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="rounded-lg bg-[var(--brand-soft)] p-4 mb-4">
            <p className="text-sm font-semibold text-[var(--brand)]">
              Em desenvolvimento
            </p>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Personalização avançada
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Recursos de personalização adicional estarão disponíveis em breve
          </p>
        </Card>
      </div>

      <Card className="p-6 bg-[var(--surface-alt)]">
        <h3 className="font-semibold mb-3">Recursos disponíveis</h3>
        <ul className="space-y-2 text-sm text-[var(--muted)]">
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
