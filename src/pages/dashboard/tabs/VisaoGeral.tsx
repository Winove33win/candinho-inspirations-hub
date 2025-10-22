import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VisaoGeralProps {
  artistDetails: any;
  userId: string;
}

export default function VisaoGeral({ artistDetails, userId }: VisaoGeralProps) {
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
      const { error } = await supabase
        .from("new_artist_details")
        .upsert({
          member_id: userId,
          visao_geral_titulo: content,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Visão Geral publicada com sucesso!",
      });
    } catch (error: any) {
      console.error("[SAVE::VISAO_GERAL]", error);
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