import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface CarreiraProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function Carreira({ artistDetails, onUpsert }: CarreiraProps) {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (artistDetails) {
      setContent(artistDetails.carreira_titulo || "");
    }
  }, [artistDetails]);

  const handleSave = async () => {
    setSaving(true);
    console.log("[SAVE::CARREIRA]", { carreira_titulo: content });

    try {
      const response = await onUpsert({ carreira_titulo: content });
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar a carreira");
      }

      toast({
        title: "Sucesso",
        description: "Carreira publicada com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::CARREIRA]", error);
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
        title="Carreira"
        description="Descreva sua carreira profissional e conquistas"
      >
        <RichTextEditor
          id="richTextBox4"
          value={content}
          onChange={setContent}
          placeholder="Digite sobre sua carreira..."
        />
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
