import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/dashboard/FormSection";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardContext } from "./context";

export default function Suporte() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [form, setForm] = useState({ subject: "", message: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe o assunto e a mensagem para abrir o chamado.",
        variant: "destructive",
      });
      return false;
    }

    setSaving(true);
    console.log("[SAVE::SUPPORT]", form);

    try {
      const { error } = await supabase.from("support_tickets").insert({
        member_id: user.id,
        subject: form.subject,
        message: form.message,
      });

      if (error) throw error;

      toast({
        title: "Chamado enviado",
        description: "Nossa equipe entrará em contato em breve.",
      });
      setForm({ subject: "", message: "" });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::SUPPORT]", error);
      const message = error instanceof Error ? error.message : "Não foi possível enviar o chamado.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-['League_Spartan'] font-bold text-[var(--ink)] md:text-3xl">Suporte</h1>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Precisa de ajuda? Envie sua solicitação e nossa equipe retornará o contato rapidamente.
            </p>
          </div>

          <FormSection
            title="Central de suporte"
            description="Envie suas dúvidas ou solicitações e retornaremos o mais breve possível."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supportSubject">Assunto</Label>
                <Input
                  id="supportSubject"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Como podemos ajudar?"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supportMessage">Mensagem</Label>
                <Textarea
                  id="supportMessage"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Descreva sua solicitação"
                  className="min-h-[160px]"
                />
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end">
            <ToolbarSave onSave={handleSubmit} saving={saving} defaultLabel="Abrir chamado" />
          </div>
        </div>
      </div>
    </div>
  );

}

