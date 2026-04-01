import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface TrajetoriaPessoalProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function TrajetoriaPessoal({ artistDetails, onUpsert, onDirtyChange }: TrajetoriaPessoalProps) {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (artistDetails) {
      const val = artistDetails.historia_titulo || "";
      setContent(val);
      setSavedContent(val);
    }
  }, [artistDetails]);

  useEffect(() => {
    onDirtyChange?.(content !== savedContent);
  }, [content, savedContent, onDirtyChange]);

  const handleSave = async () => {
    setSaving(true);
    console.log("[SAVE::TRAJETORIA_PESSOAL]", { historia_titulo: content });

    try {
      const response = await onUpsert({ historia_titulo: content });
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar a trajetória pessoal");
      }

      setSavedContent(content);
      toast({
        title: "Sucesso",
        description: "Trajetória pessoal publicada com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::TRAJETORIA_PESSOAL]", error);
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
        title="Trajetória Pessoal"
        description="Conte sua história e trajetória como artista"
      >
        <RichTextEditor
          id="richTextBox3"
          value={content}
          onChange={setContent}
          placeholder="Digite aqui sua trajetória..."
        />
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
