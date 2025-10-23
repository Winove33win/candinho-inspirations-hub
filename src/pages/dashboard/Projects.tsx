import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardContext } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import type { Database } from "@/integrations/supabase/types";
import { getSignedUrl } from "@/utils/storage";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const blockIndexes = [1, 2, 3, 4, 5] as const;

const getPlainText = (value?: string | null) =>
  value ? value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim() : "";

const normalizeProjectPayload = (data: Partial<Project>) =>
  Object.entries(data).reduce<Partial<Project>>((acc, [key, value]) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      acc[key as keyof Project] = (trimmed.length ? trimmed : null) as Project[keyof Project];
      return acc;
    }

    acc[key as keyof Project] = value as Project[keyof Project];
    return acc;
  }, {});

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
    <div className="site-container space-y-6 pb-16">
      <div className="rounded-[var(--radius)] border border-[#e5e7eb] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">Projetos</h2>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Gerencie seu portfólio de trabalhos e colaborações artísticas.
            </p>
          </div>
          <Button onClick={() => setEditingId("new")} className="gap-2 self-start md:self-auto">
            <Plus className="h-4 w-4" />
            Novo projeto
          </Button>
        </div>
      </div>

      {editingId && (
        <div className="space-y-6">
          <ProjectForm
            projectId={editingId === "new" ? null : editingId}
            onClose={() => {
              setEditingId(null);
              loadProjects();
            }}
          />
        </div>
      )}

      <div className="rounded-[var(--radius)] border border-[#e5e7eb] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {projects.map((project) => (
            <ProjectPreview
              key={project.id}
              project={project}
              onEdit={() => setEditingId(project.id)}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>

        {projects.length === 0 && !editingId && (
          <Card className="mt-6 border-dashed bg-[var(--surface)] p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-[var(--muted)]" aria-hidden="true" />
            <p className="mt-4 text-sm text-[var(--muted)] md:text-base">
              Nenhum projeto cadastrado ainda. Adicione seu primeiro projeto!
            </p>
          </Card>
        )}
      </div>
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
    block1_title: "",
    block1_image: "",
    block2_title: "",
    block2_image: "",
    block3_title: "",
    block3_image: "",
    block4_title: "",
    block4_image: "",
    block5_title: "",
    block5_image: "",
    team_tech: "",
    team_art: "",
    project_sheet: "",
    partners: "",
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
      const sanitized = normalizeProjectPayload(formData);
      const payload = {
        ...sanitized,
        member_id: user.id,
        status: "published" as Project["status"],
      };

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
    <div className="space-y-6">
      <FormSection
        title={projectId ? "Editar projeto" : "Novo projeto"}
        description="Organize os detalhes visuais e editoriais do seu projeto."
      >
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <Label htmlFor="projectTitle">Nome do projeto *</Label>
            <Input
              id="projectTitle"
              value={formData.title || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o nome do projeto"
              required
            />
          </div>

          <div className="col-span-12">
            <Uploader
              label="Banner do projeto"
              storageFolder="photos"
              maxBytes={5 * 1024 * 1024}
              currentPath={formData.banner_image || ""}
              onUploaded={(url) => setFormData((prev) => ({ ...prev, banner_image: url }))}
              accept="image/*"
              nameHint="projeto-banner"
            />
          </div>

          <div className="col-span-12">
            <Uploader
              label="Imagem/Seção do projeto"
              storageFolder="photos"
              maxBytes={5 * 1024 * 1024}
              currentPath={formData.cover_image || ""}
              onUploaded={(url) => setFormData((prev) => ({ ...prev, cover_image: url }))}
              accept="image/*"
              nameHint="projeto-capa"
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Sobre o projeto"
        description="Contextualize o projeto com um texto envolvente."
      >
        <RichTextEditor
          id="projectAbout"
          value={formData.about || ""}
          onChange={(value) => setFormData((prev) => ({ ...prev, about: value }))}
          placeholder="Descreva o projeto, objetivos e inspirações."
        />
      </FormSection>

      <FormSection
        title="Blocos de conteúdo"
        description="Estruture até cinco seções com textos e imagens complementares."
      >
        <div className="space-y-6">
          {blockIndexes.map((index) => {
            const titleKey = `block${index}_title` as keyof Project;
            const imageKey = `block${index}_image` as keyof Project;
            return (
              <div
                key={index}
                className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-alt)] p-4 md:p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    Conteúdo {index}
                  </p>
                  <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                    Bloco {index}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-12 gap-4 md:gap-6">
                  <div className="col-span-12">
                    <RichTextEditor
                      id={`projectBlock${index}`}
                      value={(formData[titleKey] as string | null) || ""}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, [titleKey]: value }))
                      }
                      placeholder={`Conteúdo do bloco ${index}`}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Uploader
                      label={`Imagem do bloco ${index}`}
                      storageFolder="photos"
                      maxBytes={5 * 1024 * 1024}
                      currentPath={(formData[imageKey] as string | null) || ""}
                      onUploaded={(url) =>
                        setFormData((prev) => ({ ...prev, [imageKey]: url }))
                      }
                      accept="image/*"
                      nameHint={`projeto-bloco-${index}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FormSection>

      <FormSection
        title="Ficha técnica e parcerias"
        description="Detalhe equipes envolvidas, ficha artística e parcerias estratégicas."
      >
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <Label htmlFor="teamTech">Equipe técnica</Label>
            <RichTextEditor
              id="teamTech"
              value={formData.team_tech || ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, team_tech: value }))}
              placeholder="Liste equipe técnica, funções e destaques."
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="teamArt">Equipe artística</Label>
            <RichTextEditor
              id="teamArt"
              value={formData.team_art || ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, team_art: value }))}
              placeholder="Detalhe artistas envolvidos, participações especiais e colaborações."
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="projectSheet">Ficha artística</Label>
            <RichTextEditor
              id="projectSheet"
              value={formData.project_sheet || ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, project_sheet: value }))}
              placeholder="Inclua ficha técnica, duração, classificação e outras informações relevantes."
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="partners">Parcerias</Label>
            <RichTextEditor
              id="partners"
              value={formData.partners || ""}
              onChange={(value) => setFormData((prev) => ({ ...prev, partners: value }))}
              placeholder="Cite instituições, marcas e apoiadores do projeto."
            />
          </div>
        </div>
      </FormSection>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose} className="min-w-[160px]">
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !formData.title}
          className="min-w-[180px]"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {projectId ? "Atualizar projeto" : "Publicar projeto"}
        </Button>
      </div>
    </div>
  );
}

function ProjectPreview({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const coverImage = project.banner_image || project.cover_image;
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!coverImage) {
      setCoverUrl(null);
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const url = await getSignedUrl(coverImage);
        if (active) setCoverUrl(url);
      } catch (error) {
        console.error("[PROJECT::SIGNED_URL]", error);
        if (active) setCoverUrl(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [coverImage]);
  const chips = blockIndexes
    .map((index) => {
      const value = project[`block${index}_title` as keyof Project] as string | null;
      const label = getPlainText(value);
      if (!label) return null;
      const truncated = label.length > 48 ? `${label.slice(0, 45)}…` : label;
      return { id: index, label: truncated };
    })
    .filter((chip): chip is { id: number; label: string } => chip !== null);

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {coverUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={coverUrl}
            alt={project.title || "Capa do projeto"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" aria-hidden="true" />
        </div>
      )}

      <div className="space-y-4 p-6 md:p-8">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
            {project.title || "Projeto sem título"}
          </h3>
          {project.about && (
            <div
              className="prose prose-sm max-w-none text-[var(--muted)] line-clamp-3"
              dangerouslySetInnerHTML={{ __html: project.about }}
            />
          )}
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.id}
                className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand)]"
              >
                {chip.label}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={onEdit}>
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            aria-label={`Excluir ${project.title ?? "projeto"}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
