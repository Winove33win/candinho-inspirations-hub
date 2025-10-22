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

  const handleAddDocument = async () => {
    if (!newDocument.title.trim() || !newDocument.file_url) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe o título e envie o arquivo do documento.",
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
    }
  };

  return (
    <div className="space-y-8">
      <FormSection title="Adicionar documento">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="documentTitle">Título</Label>
            <Input
              id="documentTitle"
              value={newDocument.title}
              onChange={(e) => setNewDocument((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Nome do documento"
            />
          </div>
          <div>
            <Label htmlFor="documentKind">Tipo</Label>
            <Select
              value={newDocument.kind}
              onValueChange={(value: DocumentKind) =>
                setNewDocument((prev) => ({ ...prev, kind: value }))
              }
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
          <Uploader
            label="Arquivo (PDF/DOC)"
            maxBytes={4 * 1024 * 1024}
            bucketPath="artist-media/docs"
            accept=".pdf,.doc,.docx"
            currentUrl={newDocument.file_url}
            onUploaded={(url) => setNewDocument((prev) => ({ ...prev, file_url: url }))}
          />
        </div>

        <div className="flex justify-end pt-4">
          <ToolbarSave onSave={handleAddDocument} saving={saving} defaultLabel="Adicionar documento" />
        </div>
      </FormSection>

      <FormSection title="Meus documentos">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-muted-foreground">Nenhum documento cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-lg p-4"
              >
                <div>
                  <h4 className="font-semibold">{document.title || "Sem título"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {kindOptions.find((option) => option.value === document.kind)?.label || ""}
                  </p>
                  {document.file_url && (
                    <a
                      href={document.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-sm underline"
                    >
                      Abrir documento
                    </a>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(document.id)}
                  className="self-start md:self-auto"
                >
                  Excluir
                </Button>
              </div>
            ))}
          </div>
        )}
      </FormSection>
    </div>
  );
}
