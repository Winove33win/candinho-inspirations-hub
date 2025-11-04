import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { useProfessionalVerification } from "@/hooks/useProfessionalVerification";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const statusConfig = {
  pending: {
    label: "Pendente",
    badge: "bg-amber-500/20 text-amber-200 border border-amber-400/30",
    description: "Estamos analisando seus documentos. Em breve você será avisado por e-mail.",
  },
  approved: {
    label: "Aprovado",
    badge: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30",
    description: "Você já tem acesso completo à loja profissional.",
  },
  rejected: {
    label: "Recusado",
    badge: "bg-rose-500/20 text-rose-200 border border-rose-400/30",
    description: "Revise as observações do time e envie novamente com documentos atualizados.",
  },
} as const;

type ArtistFormValues = {
  stage_name: string;
  country: string;
  city: string;
  avatar_url: string;
  cover_url: string;
};

type VerificationFormValues = {
  legal_id: string;
  company: string;
  website: string;
  portfolio_url: string;
  attachments: FileList;
};

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: profile } = useUserProfile();
  const { data: artist, refetch: refetchArtist } = useArtistProfile();
  const { data: verification, refetch: refetchVerification } = useProfessionalVerification();
  const [showProfessionalForm, setShowProfessionalForm] = useState(false);

  const artistForm = useForm<ArtistFormValues>({
    defaultValues: {
      stage_name: "",
      country: "",
      city: "",
      avatar_url: "",
      cover_url: "",
    },
  });

  useEffect(() => {
    if (!artist) {
      artistForm.reset({
        stage_name: profile?.full_name ?? "",
        country: "",
        city: "",
        avatar_url: profile?.avatar_url ?? "",
        cover_url: "",
      });
      return;
    }
    artistForm.reset({
      stage_name: artist.stage_name ?? "",
      country: artist.country ?? "",
      city: artist.city ?? "",
      avatar_url: artist.avatar_url ?? "",
      cover_url: artist.cover_url ?? "",
    });
  }, [artist, profile, artistForm]);

  const verificationForm = useForm<VerificationFormValues>({
    defaultValues: {
      legal_id: "",
      company: "",
      website: "",
      portfolio_url: "",
    },
  });

  useEffect(() => {
    if (!verification) return;
    verificationForm.reset({
      legal_id: verification.legal_id ?? "",
      company: verification.company ?? "",
      website: verification.website ?? "",
      portfolio_url: verification.portfolio_url ?? "",
    });
  }, [verification, verificationForm]);

  const isProfessional = profile?.role === "professional" || profile?.role === "admin";
  const status = verification?.status ?? (isProfessional ? "approved" : "pending");
  const statusMeta = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;

  const onSaveArtist = artistForm.handleSubmit(async (values) => {
    if (!user?.id) return;
    const payload = {
      user_id: user.id,
      stage_name: values.stage_name,
      country: values.country,
      city: values.city,
      avatar_url: values.avatar_url,
      cover_url: values.cover_url,
    };
    const { error } = await supabase.from("artists").upsert(payload, { onConflict: "user_id" });
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Perfil atualizado" });
    refetchArtist();
  });

  const onSubmitVerification = verificationForm.handleSubmit(async (values) => {
    if (!user?.id) return;
    try {
      const files = Array.from(values.attachments ?? []);
      const attachments = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          contentType: file.type,
          content: await fileToBase64(file),
        }))
      );

      const { data, error } = await supabase.functions.invoke("request-professional-verification", {
        body: {
          legal_id: values.legal_id,
          company: values.company,
          website: values.website,
          portfolio_url: values.portfolio_url,
          attachments,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Solicitação enviada" });
      queryClient.invalidateQueries({ queryKey: ["professional-verification", user.id] });
      refetchVerification();
    } catch (error) {
      toast({ title: "Erro ao enviar", description: (error as Error).message, variant: "destructive" });
    }
  });

  useEffect(() => {
    setShowProfessionalForm(verification?.status !== "approved");
  }, [verification?.status]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Perfil artístico</h2>
            <p className="text-xs text-zinc-500">Esses dados abastecem sua vitrine pública e materiais de comunicação.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusMeta.badge}`}>
            {statusMeta.label}
          </span>
        </header>
        <form className="space-y-4" onSubmit={onSaveArtist}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="stage_name">Nome artístico</Label>
              <Input id="stage_name" placeholder="Nome artístico" {...artistForm.register("stage_name", { required: true })} />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" placeholder="Cidade" {...artistForm.register("city")} />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input id="country" placeholder="País" {...artistForm.register("country")} />
            </div>
            <div>
              <Label htmlFor="avatar">URL do avatar</Label>
              <Input id="avatar" placeholder="https://" {...artistForm.register("avatar_url")} />
            </div>
            <div>
              <Label htmlFor="cover">URL da capa</Label>
              <Input id="cover" placeholder="https://" {...artistForm.register("cover_url")} />
            </div>
          </div>
          <Button type="submit">Salvar perfil</Button>
        </form>
      </section>

      <section className="space-y-4">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Verificação profissional</h2>
          <p className="text-xs text-zinc-500">{statusMeta.description}</p>
        </header>
        {verification?.attachment_urls && Array.isArray(verification.attachment_urls) && verification.attachment_urls.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-xs text-zinc-400">
            <p className="font-medium text-zinc-200">Documentos enviados:</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {verification.attachment_urls.map((url: string) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                    {url.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {verification?.notes && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            Observações da curadoria: {verification.notes}
          </div>
        )}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
          <label className="flex items-center gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={showProfessionalForm}
              onChange={(event) => setShowProfessionalForm(event.target.checked)}
              disabled={verification?.status === "approved"}
            />
            Sou profissional da música e desejo acessar a loja B2B.
          </label>
          {showProfessionalForm && (
            <form className="mt-6 space-y-4" onSubmit={onSubmitVerification}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="legal_id">Documento profissional (CPF/CNPJ/Registro)</Label>
                  <Input id="legal_id" placeholder="Digite seu registro" {...verificationForm.register("legal_id", { required: true })} />
                </div>
                <div>
                  <Label htmlFor="company">Empresa / Nome Fantasia</Label>
                  <Input id="company" placeholder="Opcional" {...verificationForm.register("company")} />
                </div>
                <div>
                  <Label htmlFor="website">Site profissional</Label>
                  <Input id="website" placeholder="https://" {...verificationForm.register("website")} />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfólio ou material de apoio</Label>
                  <Input id="portfolio" placeholder="https://" {...verificationForm.register("portfolio_url")} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="attachments">Comprovantes (PDF, JPG, PNG)</Label>
                  <Input id="attachments" type="file" multiple accept="application/pdf,image/*" {...verificationForm.register("attachments")} />
                </div>
              </div>
              <Button type="submit">Enviar solicitação</Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
