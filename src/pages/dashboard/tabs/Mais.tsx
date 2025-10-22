import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MaisProps {
  artistDetails: any;
  userId: string;
}

export default function Mais({ artistDetails, userId }: MaisProps) {
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
      const { error } = await supabase
        .from("new_artist_details")
        .upsert({
          member_id: userId,
          mais_titulo: content,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conteúdo publicado com sucesso!",
      });
    } catch (error: any) {
      console.error("[SAVE::MAIS]", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar",
        variant: "destructive",
      });
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