import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardContext } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import type { Database } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export default function Documents() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [user?.id]);

  async function loadDocuments() {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir este documento?")) return;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);

      if (error) throw error;

      toast({ title: "Documento excluído com sucesso" });
      loadDocuments();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao excluir",
        variant: "destructive",
      });
    }
  }

  const kindLabels: Record<string, string> = {
    contrato: "Contrato",
    termo: "Termo",
    outro: "Outro",
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-['League_Spartan'] font-bold">Documentos</h2>
          <p className="text-sm text-[var(--muted)] mt-1">
            Envie materiais oficiais, press kits e arquivos exclusivos
          </p>
        </div>
        <Button onClick={() => setEditingId("new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo documento
        </Button>
      </div>

      {editingId && (
        <DocumentForm
          documentId={editingId === "new" ? null : editingId}
          onClose={() => {
            setEditingId(null);
            loadDocuments();
          }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold truncate">
                    {doc.title || "Sem título"}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {kindLabels[doc.kind || "outro"]}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {doc.file_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </a>
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {documents.length === 0 && !editingId && (
        <div className="rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-[var(--muted)]" />
          <p className="mt-4 text-[var(--muted)]">
            Nenhum documento cadastrado ainda. Adicione seu primeiro documento!
          </p>
        </div>
      )}
    </div>
  );
}

function DocumentForm({
  documentId,
  onClose,
}: {
  documentId: string | null;
  onClose: () => void;
}) {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Document>>({
    title: "",
    file_url: "",
    kind: "outro",
  });

  useEffect(() => {
    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  async function loadDocument() {
    if (!documentId) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave() {
    if (!user?.id) return;

    setSaving(true);
    try {
      const payload = { ...formData, member_id: user.id };

      if (documentId) {
        const { error } = await supabase
          .from("documents")
          .update(payload)
          .eq("id", documentId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("documents").insert([payload]);

        if (error) throw error;
      }

      toast({ title: "Documento salvo com sucesso!" });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <FormSection title={documentId ? "Editar Documento" : "Novo Documento"}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título do documento</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Press Kit 2024"
            />
          </div>

          <div>
            <Label htmlFor="kind">Tipo de documento</Label>
            <Select
              value={formData.kind || "outro"}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, kind: value as any }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="termo">Termo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Uploader
            label="Arquivo"
            bucket="artist-docs"
            maxBytes={10 * 1024 * 1024}
            currentPath={formData.file_url || ""}
            onUploaded={(url) =>
              setFormData((prev) => ({ ...prev, file_url: url }))
            }
            accept=".pdf,.doc,.docx,.txt"
          />

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !formData.title || !formData.file_url}
              className="flex-1"
            >
              {saving ? "Salvando..." : "Salvar documento"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </FormSection>
    </Card>
  );
}
