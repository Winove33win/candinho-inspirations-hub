import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/integrations/supabase/storage";
import type { Database } from "@/integrations/supabase/types";
import { useDashboardContext } from "./context";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

type DocumentKind = Database["public"]["Enums"]["document_kind"];

const kindOptions: { value: DocumentKind; label: string }[] = [
  { value: "contrato", label: "Contrato" },
  { value: "termo", label: "Termo" },
  { value: "outro", label: "Outro" },
];

export default function Documents() {
  const { user } = useDashboardContext();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newDocument, setNewDocument] = useState<{
    title: string;
    file_url: string;
    kind: DocumentKind;
  }>({ title: "", file_url: "", kind: "outro" });

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[LOAD::DOCUMENTS]", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os documentos.",
          variant: "destructive",
        });
      } else {
        setDocuments(data);
      }
      setLoading(false);
    };

    loadDocuments();
  }, [user?.id, toast]);

  useEffect(() => {
    const refreshSignedUrls = async () => {
      if (documents.length === 0) {
        setSignedUrls({});
        return;
      }

      const entries = await Promise.all(
        documents.map(async (document) => {
          if (!document.file_url) {
            return [document.id, ""] as const;
          }

          if (document.file_url.startsWith("http://") || document.file_url.startsWith("https://")) {
            return [document.id, document.file_url] as const;
          }

          try {
            const url = await getSignedUrl(document.file_url);
            return [document.id, url] as const;
          } catch (error) {
            console.error("[DOCUMENT::SIGNED_URL]", error);
            return [document.id, ""] as const;
          }
        })
      );

      setSignedUrls(Object.fromEntries(entries));
    };

    void refreshSignedUrls();
  }, [documents]);

  const handleAddDocument = async () => {
    if (!newDocument.title.trim() || !newDocument.file_url) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe o título e envie o arquivo do documento.",
        variant: "destructive",
      });
      return false;
    }

    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Sessão expirada. Faça login novamente para adicionar documentos.",
        variant: "destructive",
      });
      return false;
    }

    setSaving(true);
    console.log("[SAVE::DOCUMENT]", newDocument);

    try {
      const payload: DocumentInsert = {
        title: newDocument.title,
        file_url: newDocument.file_url,
        kind: newDocument.kind,
        member_id: user.id,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setDocuments((current) => [data, ...current]);
      setNewDocument({ title: "", file_url: "", kind: "outro" });

      toast({
        title: "Sucesso",
        description: "Documento adicionado com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::DOCUMENT]", error);
      const message = error instanceof Error ? error.message : "Não foi possível salvar o documento.";
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

  const handleDelete = async (id: string) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Sessão expirada. Faça login novamente para remover o documento.",
        variant: "destructive",
      });
      return;
    }

    const previous = documents;
    setDocuments((current) => current.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .eq("member_id", user.id);

    if (error) {
      console.error("[DELETE::DOCUMENT]", error);
      setDocuments(previous);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o documento.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Documento removido",
        description: "O documento foi excluído com sucesso.",
      });
      setSignedUrls((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-['League_Spartan'] font-bold text-[var(--ink)] md:text-3xl">Documentos</h1>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Armazene e compartilhe materiais oficiais com segurança na plataforma SMARTx.
            </p>
          </div>

          <FormSection title="Adicionar documento">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="documentTitle">Título</Label>
                <Input
                  id="documentTitle"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome do documento"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentKind">Tipo</Label>
                <Select
                  value={newDocument.kind}
                  onValueChange={(value: DocumentKind) => setNewDocument((prev) => ({ ...prev, kind: value }))}
                >
                  <SelectTrigger id="documentKind">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {kindOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Uploader
                  label="Arquivo (PDF/DOC)"
                  maxBytes={4 * 1024 * 1024}
                  bucketPath="artist-media/docs"
                  accept=".pdf,.doc,.docx"
                  currentPath={newDocument.file_url}
                  onUploaded={(url) => setNewDocument((prev) => ({ ...prev, file_url: url }))}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <ToolbarSave onSave={handleAddDocument} saving={saving} defaultLabel="Adicionar documento" />
            </div>
          </FormSection>

          <FormSection title="Meus documentos">
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Nenhum documento cadastrado.</p>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-6"
                  >
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-[var(--ink)]">{document.title || 'Sem título'}</h4>
                      <p className="text-sm text-[var(--muted)]">
                        {kindOptions.find((option) => option.value === document.kind)?.label || ''}
                      </p>
                      {signedUrls[document.id] ? (
                        <a
                          href={signedUrls[document.id]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-[var(--brand)] transition-colors duration-200 hover:text-[var(--brand-600)]"
                        >
                          Abrir documento
                        </a>
                      ) : document.file_url ? (
                        <p className="text-xs text-[var(--muted)]">Link temporário indisponível. Tente novamente mais tarde.</p>
                      ) : null}
                    </div>
                    <Button variant="secondary" onClick={() => handleDelete(document.id)} className="self-start md:self-auto">
                      Excluir
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>
        </div>
      </div>
    </div>
  );

}

