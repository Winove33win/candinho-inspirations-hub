import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface FotografiasProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function Fotografias({ artistDetails, onUpsert }: FotografiasProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [photos, setPhotos] = useState<Array<{ image: string; text: string }>>(
    Array.from({ length: 12 }, () => ({ image: "", text: "" }))
  );

  useEffect(() => {
    if (artistDetails) {
      const photoData = Array.from({ length: 12 }, (_, index) => {
        const position = index + 1;
        return {
          image: artistDetails[`image${position}` as keyof ArtistDetails] as string | null || "",
          text: artistDetails[`image${position}_text` as keyof ArtistDetails] as string | null || "",
        };
      });
      setPhotos(photoData.map((item) => ({ image: item.image, text: item.text })));
    }
  }, [artistDetails]);

  const updatePhoto = (index: number, field: "image" | "text", value: string) => {
    setPhotos((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);

    const photoFields: Record<string, string> = {};
    photos.forEach((photo, index) => {
      const num = index + 1;
      photoFields[`image${num}`] = photo.image;
      photoFields[`image${num}_text`] = photo.text;
    });

    console.log("[SAVE::FOTOGRAFIAS]", photoFields);

    try {
      const response = await onUpsert(photoFields as Partial<ArtistDetails>);
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar fotografias");
      }

      toast({
        title: "Sucesso",
        description: "Fotografias publicadas com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::FOTOGRAFIAS]", error);
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
        title="Galeria de Fotografias"
        description="Adicione até 12 fotografias com legendas (máximo 1 MB cada)"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="space-y-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
            >
              <h4 className="text-sm font-semibold text-[var(--ink)]">Foto {index + 1}</h4>

              <Uploader
                id={`uploaderFoto${index + 1}`}
                label={`Enviar Foto ${index + 1}`}
                maxBytes={1024 * 1024}
                bucketPath="artist-media/photos"
                accept="image/*"
                currentPath={photo.image}
                onUploaded={(url) => updatePhoto(index, "image", url)}
              />

              <div className="space-y-2">
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
