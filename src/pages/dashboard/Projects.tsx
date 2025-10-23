import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardContext } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function Projects() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, [user?.id]);

  async function loadProjects() {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir este projeto?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Projeto excluído com sucesso" });
      loadProjects();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao excluir",
        variant: "destructive",
      });
    }
  }

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
          <h2 className="text-2xl font-['League_Spartan'] font-bold">Projetos</h2>
          <p className="text-sm text-[var(--muted)] mt-1">
            Gerencie seu portfólio de trabalhos e colaborações artísticas
          </p>
        </div>
        <Button
          onClick={() => setEditingId("new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo projeto
        </Button>
      </div>

      {editingId && (
        <ProjectForm
          projectId={editingId === "new" ? null : editingId}
          onClose={() => {
            setEditingId(null);
            loadProjects();
          }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {project.cover_image && (
              <div className="relative h-48 w-full overflow-hidden bg-[var(--surface-alt)]">
                <img
                  src={project.cover_image}
                  alt={project.title || "Projeto"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{project.title || "Sem título"}</h3>
                {project.about && (
                  <p className="text-sm text-[var(--muted)] mt-2 line-clamp-3">
                    {project.about}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(project.id)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !editingId && (
        <div className="rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-[var(--muted)]" />
          <p className="mt-4 text-[var(--muted)]">
            Nenhum projeto cadastrado ainda. Adicione seu primeiro projeto!
          </p>
        </div>
      )}
    </div>
  );
}

function ProjectForm({
  projectId,
  onClose,
}: {
  projectId: string | null;
  onClose: () => void;
}) {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    about: "",
    cover_image: "",
    banner_image: "",
    status: "draft",
  });

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  async function loadProject() {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
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

      if (projectId) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", projectId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([payload]);

        if (error) throw error;
      }

      toast({ title: "Projeto salvo com sucesso!" });
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
      <FormSection title={projectId ? "Editar Projeto" : "Novo Projeto"}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título do projeto</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Nome do projeto"
            />
          </div>

          <div>
            <Label htmlFor="about">Sobre o projeto</Label>
            <Textarea
              id="about"
              value={formData.about || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, about: e.target.value }))
              }
              placeholder="Descreva o projeto..."
              rows={4}
            />
          </div>

          <Uploader
            label="Imagem de capa"
            bucket="artist-photos"
            maxBytes={5 * 1024 * 1024}
            currentPath={formData.cover_image || ""}
            onUploaded={(url) =>
              setFormData((prev) => ({ ...prev, cover_image: url }))
            }
            accept="image/*"
          />

          <Uploader
            label="Banner do projeto"
            bucket="artist-photos"
            maxBytes={5 * 1024 * 1024}
            currentPath={formData.banner_image || ""}
            onUploaded={(url) =>
              setFormData((prev) => ({ ...prev, banner_image: url }))
            }
            accept="image/*"
          />

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !formData.title}
              className="flex-1"
            >
              {saving ? "Salvando..." : "Salvar projeto"}
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
