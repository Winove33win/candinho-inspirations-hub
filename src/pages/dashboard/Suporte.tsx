import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-6">
      <FormSection
        title="Central de suporte"
        description="Envie suas dúvidas ou solicitações e retornaremos o mais breve possível."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="supportSubject" className="text-sm font-medium">
              Assunto
            </label>
            <Input
              id="supportSubject"
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Como podemos ajudar?"
            />
          </div>
          <div>
            <label htmlFor="supportMessage" className="text-sm font-medium">
              Mensagem
            </label>
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
  );
}
