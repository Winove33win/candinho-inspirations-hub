import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FotografiasProps {
  artistDetails: any;
  userId: string;
}

export default function Fotografias({ artistDetails, userId }: FotografiasProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [photos, setPhotos] = useState<Array<{ image: string; text: string }>>([]);

  useEffect(() => {
    if (artistDetails) {
      const photoData = [];
      for (let i = 1; i <= 12; i++) {
        photoData.push({
          image: artistDetails[`image${i}`] || "",
          text: artistDetails[`image${i}_text`] || "",
        });
      }
      setPhotos(photoData);
    } else {
      setPhotos(Array(12).fill({ image: "", text: "" }));
    }
  }, [artistDetails]);

  const updatePhoto = (index: number, field: "image" | "text", value: string) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], [field]: value };
    setPhotos(newPhotos);
  };

  const handleSave = async () => {
    setSaving(true);
    
    const photoFields: any = {};
    photos.forEach((photo, index) => {
      const num = index + 1;
      photoFields[`image${num}`] = photo.image;
      photoFields[`image${num}_text`] = photo.text;
    });

    console.log("[SAVE::FOTOGRAFIAS]", photoFields);

    try {
      const { error } = await supabase
        .from("new_artist_details")
        .upsert({
          ...photoFields,
          member_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Fotografias publicadas com sucesso!",
      });
    } catch (error: any) {
      console.error("[SAVE::FOTOGRAFIAS]", error);
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
        title="Galeria de Fotografias"
        description="Adicione até 12 fotografias com legendas (máximo 1 MB cada)"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <h4 className="font-semibold">Foto {index + 1}</h4>
              
              <Uploader
                id={`uploaderFoto${index + 1}`}
                label={`Enviar Foto ${index + 1}`}
                maxBytes={1024 * 1024}
                bucket="artist-photos"
                accept="image/*"
                currentUrl={photo.image}
                onUploaded={(url) => updatePhoto(index, "image", url)}
              />

              <div>
                <Label htmlFor={`legenda${index + 1}`}>Legenda</Label>
                <Input
                  id={`legenda${index + 1}`}
                  value={photo.text}
                  onChange={(e) => updatePhoto(index, "text", e.target.value)}
                  placeholder="Legenda da foto"
                />
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}