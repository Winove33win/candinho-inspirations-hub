import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useDashboardContext } from "./context";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

type EditableProject = Omit<ProjectInsert, "member_id">;

const emptyProject: EditableProject = {
  title: "",
  cover_image: "",
  banner_image: "",
  about: "",
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
};

export default function Projects() {
  const { user } = useDashboardContext();
  const { toast } = useToast();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [form, setForm] = useState<EditableProject>(emptyProject);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("member_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[LOAD::PROJECTS]", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus projetos.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setProjects(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedProjectId(first.id);
        setForm(mapRowToForm(first));
      } else {
        setSelectedProjectId(null);
        setForm(emptyProject);
      }
      setLoading(false);
    };

    loadProjects();
  }, [user?.id, toast]);

  const mapRowToForm = (row: ProjectRow): EditableProject => ({
    title: row.title || "",
    cover_image: row.cover_image || "",
    banner_image: row.banner_image || "",
    about: row.about || "",
    block1_title: row.block1_title || "",
    block1_image: row.block1_image || "",
    block2_title: row.block2_title || "",
    block2_image: row.block2_image || "",
    block3_title: row.block3_title || "",
    block3_image: row.block3_image || "",
    block4_title: row.block4_title || "",
    block4_image: row.block4_image || "",
    block5_title: row.block5_title || "",
    block5_image: row.block5_image || "",
    team_tech: row.team_tech || "",
    team_art: row.team_art || "",
    project_sheet: row.project_sheet || "",
    partners: row.partners || "",
    status: row.status || "draft",
  });

  const handleSelectProject = (projectId: string) => {
    if (projectId === "novo") {
      setSelectedProjectId(null);
      setForm(emptyProject);
      return;
    }

    const project = projects.find((item) => item.id === projectId);
    if (project) {
      setSelectedProjectId(project.id);
      setForm(mapRowToForm(project));
    }
  };

  const handleNewProject = () => {
    setSelectedProjectId(null);
    setForm(emptyProject);
  };

  const handleStatusToggle = () => {
    setForm((current) => ({
      ...current,
      status: current.status === "published" ? "draft" : "published",
    }));
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o título do projeto.",
        variant: "destructive",
      });
      return false;
    }

    setSaving(true);
    console.log("[SAVE::PROJECT]", form);

    try {
      const payload: Database["public"]["Tables"]["projects"]["Insert"] = {
        ...form,
        member_id: user.id,
      };

      if (selectedProjectId) {
        (payload as Database["public"]["Tables"]["projects"]["Update"]).id = selectedProjectId;
      }

      const { data, error } = await supabase
        .from("projects")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;

      setProjects((current) => {
        const others = current.filter((item) => item.id !== data.id);
        return [data, ...others];
      });
      setSelectedProjectId(data.id);
      setForm(mapRowToForm(data));

      toast({
        title: "Sucesso",
        description: "Projeto salvo com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::PROJECT]", error);
      const message = error instanceof Error ? error.message : "Não foi possível salvar o projeto.";
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

  const currentStatusLabel = useMemo(
    () => (form.status === "published" ? "Publicado" : "Rascunho"),
    [form.status]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="selectProjeto">Selecionar seu projeto</Label>
          <Select
            value={selectedProjectId ?? "novo"}
            onValueChange={handleSelectProject}
          >
            <SelectTrigger id="selectProjeto">
              <SelectValue placeholder="Escolha um projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novo">Novo projeto</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title || "Sem título"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleNewProject}>
            Novo projeto
          </Button>
          <Button variant="outline" onClick={handleStatusToggle}>
            Alterar status ({currentStatusLabel})
          </Button>
        </div>
      </div>

      <FormSection title="Informações principais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectTitle">Título *</Label>
            <Input
              id="projectTitle"
              value={form.title ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Nome do projeto"
            />
          </div>
          <Uploader
            label="Imagem de capa"
            maxBytes={1024 * 1024}
            bucketPath="artist-media/photos"
            accept="image/*"
            currentPath={form.cover_image ?? ""}
            onUploaded={(url) => setForm((prev) => ({ ...prev, cover_image: url }))}
          />
          <Uploader
            label="Banner"
            maxBytes={2 * 1024 * 1024}
            bucketPath="artist-media/photos"
            accept="image/*"
            currentPath={form.banner_image ?? ""}
            onUploaded={(url) => setForm((prev) => ({ ...prev, banner_image: url }))}
          />
        </div>

        <div>
          <Label>Sobre o projeto</Label>
          <RichTextEditor
            id="projectAbout"
            value={form.about ?? ""}
            onChange={(value) => setForm((prev) => ({ ...prev, about: value }))}
            placeholder="Descreva o projeto"
          />
        </div>
      </FormSection>

      <FormSection title="Blocos de destaque">
        {[1, 2, 3, 4, 5].map((block) => {
          const titleKey = `block${block}_title` as keyof EditableProject;
          const imageKey = `block${block}_image` as keyof EditableProject;
          return (
            <div key={block} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`blockTitle${block}`}>Título bloco {block}</Label>
                <Input
                  id={`blockTitle${block}`}
                  value={(form[titleKey] as string | null) ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [titleKey]: e.target.value,
                    }))
                  }
                  placeholder={`Título do bloco ${block}`}
                />
              </div>
              <Uploader
                label={`Imagem bloco ${block}`}
                maxBytes={1024 * 1024}
                bucketPath="artist-media/photos"
                accept="image/*"
                currentPath={(form[imageKey] as string | null) ?? ""}
                onUploaded={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    [imageKey]: url,
                  }))
                }
              />
            </div>
          );
        })}
      </FormSection>

      <FormSection title="Equipe e ficha técnica">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Equipe técnica</Label>
            <RichTextEditor
              id="teamTech"
              value={form.team_tech ?? ""}
              onChange={(value) => setForm((prev) => ({ ...prev, team_tech: value }))}
              placeholder="Descreva a equipe técnica"
            />
          </div>
          <div>
            <Label>Equipe artística</Label>
            <RichTextEditor
              id="teamArt"
              value={form.team_art ?? ""}
              onChange={(value) => setForm((prev) => ({ ...prev, team_art: value }))}
              placeholder="Descreva a equipe artística"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Ficha técnica</Label>
            <RichTextEditor
              id="projectSheet"
              value={form.project_sheet ?? ""}
              onChange={(value) => setForm((prev) => ({ ...prev, project_sheet: value }))}
              placeholder="Detalhes da ficha técnica"
            />
          </div>
          <div>
            <Label>Parceiros</Label>
            <RichTextEditor
              id="projectPartners"
              value={form.partners ?? ""}
              onChange={(value) => setForm((prev) => ({ ...prev, partners: value }))}
              placeholder="Liste parceiros e apoiadores"
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
