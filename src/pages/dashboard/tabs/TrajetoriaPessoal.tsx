import { useState, useEffect } from "react";
import { FormSection } from "@/components/dashboard/FormSection";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrajetoriaPessoalProps {
  artistDetails: any;
  userId: string;
}

export default function TrajetoriaPessoal({ artistDetails, userId }: TrajetoriaPessoalProps) {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (artistDetails) {
      setContent(artistDetails.historia_titulo || "");
    }
  }, [artistDetails]);

  const handleSave = async () => {
    setSaving(true);
    console.log("[SAVE::TRAJETORIA_PESSOAL]", { historia_titulo: content });

    try {
      const { error } = await supabase
        .from("new_artist_details")
        .upsert({
          member_id: userId,
          historia_titulo: content,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Trajetória Pessoal publicada com sucesso!",
      });
    } catch (error: any) {
      console.error("[SAVE::TRAJETORIA_PESSOAL]", error);
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