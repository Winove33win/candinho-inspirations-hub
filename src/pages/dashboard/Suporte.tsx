import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardContext } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { MessageCircle, CheckCircle } from "lucide-react";

export default function Suporte() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user?.id) return;

    setSending(true);
    try {
      const { error } = await supabase.from("support_tickets").insert([
        {
          member_id: user.id,
          subject: formData.subject,
          message: formData.message,
          status: "open",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Nossa equipe responderá em breve.",
      });

      setFormData({ subject: "", message: "" });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao enviar",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="site-container space-y-6 pb-16">
      <div className="rounded-[var(--radius)] border border-[#e5e7eb] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">Suporte</h2>
        <p className="mt-1 text-sm text-[var(--muted)] md:text-base">
          Precisa de ajuda? Entre em contato com nossa equipe
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 text-center md:p-10">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-[var(--brand)]" />
          <h3 className="text-xl font-semibold text-[var(--ink)]">Mensagem enviada!</h3>
          <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
            Recebemos sua solicitação e responderemos em até 48 horas úteis.
          </p>
          <Button onClick={() => setSubmitted(false)} className="mt-6" aria-label="Enviar nova mensagem">
            Enviar nova mensagem
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Ex: Dúvida sobre cadastro"
                />
              </div>

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Descreva sua dúvida ou problema..."
                  rows={8}
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full" aria-label="Enviar mensagem para o suporte">
                {sending ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6 md:p-8">
              <MessageCircle className="mb-3 h-8 w-8 text-[var(--brand)]" />
              <h3 className="mb-2 text-base font-semibold text-[var(--ink)]">Atendimento rápido</h3>
              <p className="mb-4 text-sm text-[var(--muted)] md:text-base">
                Respondemos em até 48 horas úteis
              </p>
              <p className="text-xs text-[var(--muted)]">
                Para questões urgentes, entre em contato via WhatsApp
              </p>
            </Card>

            <Card className="p-6 md:p-8 bg-[var(--brand-soft)]">
              <h3 className="mb-2 text-base font-semibold text-[var(--brand)]">Perguntas frequentes</h3>
              <ul className="space-y-2 text-sm text-[var(--muted)] md:text-base">
                <li>• Como atualizar meu perfil?</li>
                <li>• Como adicionar projetos?</li>
                <li>• Como fazer upload de mídia?</li>
                <li>• Como alterar minha senha?</li>
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
