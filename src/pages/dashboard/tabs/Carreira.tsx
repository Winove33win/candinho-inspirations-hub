import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CarreiraProps {
  artistDetails: any;
  userId: string;
}

export default function Carreira({ artistDetails, userId }: CarreiraProps) {
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
      const { error } = await supabase
        .from("new_artist_details")
        .upsert({
          member_id: userId,
          carreira_titulo: content,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Carreira publicada com sucesso!",
      });
    } catch (error: any) {
      console.error("[SAVE::CARREIRA]", error);
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