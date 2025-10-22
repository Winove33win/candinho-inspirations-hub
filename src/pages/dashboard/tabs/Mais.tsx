import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface MaisProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function Mais({ artistDetails, onUpsert }: MaisProps) {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (artistDetails) {
      setContent(artistDetails.mais_titulo || "");
    }
  }, [artistDetails]);

  const handleSave = async () => {
    setSaving(true);
    console.log("[SAVE::MAIS]", { mais_titulo: content });

    try {
      const response = await onUpsert({ mais_titulo: content });
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar o conteúdo adicional");
      }

      toast({
        title: "Sucesso",
        description: "Conteúdo publicado com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::MAIS]", error);
      const message = error instanceof Error ? error.message : "Erro ao salvar";
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
        title="Mais"
        description="Informações adicionais sobre você"
      >
        <RichTextEditor
          id="richTextBox5"
          value={content}
          onChange={setContent}
          placeholder="Digite informações adicionais..."
        />
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
