import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface VisaoGeralProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function VisaoGeral({ artistDetails, onUpsert }: VisaoGeralProps) {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (artistDetails) {
      setContent(artistDetails.visao_geral_titulo || "");
    }
  }, [artistDetails]);

  const handleSave = async () => {
    setSaving(true);
    console.log("[SAVE::VISAO_GERAL]", { visao_geral_titulo: content });

    try {
      const response = await onUpsert({ visao_geral_titulo: content });
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar a visão geral");
      }

      toast({
        title: "Sucesso",
        description: "Visão Geral publicada com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::VISAO_GERAL]", error);
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
        title="Visão Geral"
        description="Escreva uma visão geral sobre você e sua carreira artística"
      >
        <RichTextEditor
          id="richTextBox2"
          value={content}
          onChange={setContent}
          placeholder="Digite aqui sua visão geral..."
        />
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}