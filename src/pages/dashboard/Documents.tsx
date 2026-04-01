import { useState, useEffect } from 'react';
import { api } from '@/lib/apiClient';
import { getSignedUrl } from '@/utils/storage';
import { useDashboardContext } from './context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormSection } from '@/components/dashboard/FormSection';
import { Uploader } from '@/components/dashboard/Uploader';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Document, DocumentKind } from '@/types/api';

export default function Documents() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [documents, setDocuments]     = useState<Document[]>([]);
  const [loading, setLoading]         = useState(true);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({});

  useEffect(() => { loadDocuments(); }, [user?.id]);

  useEffect(() => {
    let active = true;
    (async () => {
      const next: Record<string, string> = {};
      for (const doc of documents) {
        if (!doc.file_url) continue;
        try {
          next[doc.id] = await getSignedUrl(doc.file_url);
        } catch {
          /* skip */
        }
      }
      if (active) setDownloadUrls(next);
    })();
    return () => { active = false; };
  }, [documents]);

  async function loadDocuments() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await api.get<{ data: Document[] }>('/api/documents');
      setDocuments(data || []);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os documentos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este documento?')) return;
    try {
      await api.delete(`/api/documents/${id}`);
      toast({ title: 'Documento excluído com sucesso' });
      loadDocuments();
    } catch {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    }
  }

  const kindLabels: Record<string, string> = { contrato: 'Contrato', termo: 'Termo', outro: 'Outro' };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
      </div>
    );
  }

  return (
    <div className="site-container space-y-6 pb-16">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">Documentos</h2>
            <p className="mt-1 text-sm text-[var(--muted)] md:text-base">Envie materiais oficiais, press kits e arquivos exclusivos</p>
          </div>
          <Button onClick={() => setEditingId('new')} className="gap-2 self-start md:self-auto">
            <Plus className="h-4 w-4" /> Novo documento
          </Button>
        </div>
      </Card>

      {editingId && (
        <DocumentForm
          documentId={editingId === 'new' ? null : editingId}
          onClose={() => { setEditingId(null); loadDocuments(); }}
        />
      )}

      <Card className="p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand)]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">{doc.title || 'Sem título'}</h3>
                    <p className="text-sm text-[var(--muted)]">{kindLabels[doc.kind || 'outro']}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {doc.file_url && downloadUrls[doc.id] && (
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <a href={downloadUrls[doc.id]} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Baixar
                      </a>
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {documents.length === 0 && !editingId && (
          <div className="mt-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-[var(--muted)]" />
            <p className="mt-4 text-sm text-[var(--muted)] md:text-base">
              Nenhum documento cadastrado ainda. Adicione seu primeiro documento!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function DocumentForm({ documentId, onClose }: { documentId: string | null; onClose: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Document>>({ title: '', file_url: '', kind: 'outro' });

  useEffect(() => {
    if (documentId) {
      // Documents API does not have GET /:id — reload from list not needed for edit
      // (documents can only be deleted, not edited after creation)
    }
  }, [documentId]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post('/api/documents', {
        title:    formData.title,
        file_url: formData.file_url,
        kind:     formData.kind || 'outro',
      });
      toast({ title: 'Documento salvo com sucesso!' });
      onClose();
    } catch (err) {
      toast({ title: 'Erro ao salvar', description: err instanceof Error ? err.message : undefined, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <FormSection title="Novo Documento">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título do documento</Label>
            <Input id="title" value={formData.title || ''}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Press Kit 2024" />
          </div>
          <div>
            <Label htmlFor="kind">Tipo de documento</Label>
            <Select value={formData.kind || 'outro'}
              onValueChange={(v) => setFormData((p) => ({ ...p, kind: v as DocumentKind }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="termo">Termo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Uploader label="Arquivo" storageFolder="docs"
            currentPath={formData.file_url || ''}
            onUploaded={(url) => setFormData((p) => ({ ...p, file_url: url }))}
            accept=".pdf,.doc,.docx,.txt" nameHint="documento" />
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving || !formData.title || !formData.file_url} className="flex-1">
              {saving ? 'Salvando...' : 'Salvar documento'}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </FormSection>
    </Card>
  );
}
