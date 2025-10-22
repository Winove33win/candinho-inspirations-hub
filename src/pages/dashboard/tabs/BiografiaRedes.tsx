import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface BiografiaRedesProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function BiografiaRedes({ artistDetails, onUpsert }: BiografiaRedesProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    biography1: "",
    facebook: "",
    instagram: "",
    music_spotify_apple: "",
    youtube_channel: "",
    website: "",
  });

  useEffect(() => {
    if (artistDetails) {
      setFormData({
        biography1: artistDetails.biography1 || "",
        facebook: artistDetails.facebook || "",
        instagram: artistDetails.instagram || "",
        music_spotify_apple: artistDetails.music_spotify_apple || "",
        youtube_channel: artistDetails.youtube_channel || "",
        website: artistDetails.website || "",
      });
    }
  }, [artistDetails]);

  const validateUrls = () => {
    const urlFields = [
      { name: "Facebook", value: formData.facebook },
      { name: "Instagram", value: formData.instagram },
      { name: "Spotify/Apple Music", value: formData.music_spotify_apple },
      { name: "YouTube", value: formData.youtube_channel },
      { name: "Website", value: formData.website },
    ];

    for (const field of urlFields) {
      if (field.value && !field.value.match(/^https?:\/\/.+/)) {
        toast({
          title: "Erro de validação",
          description: `${field.name} deve começar com http:// ou https://`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateUrls()) return false;

    setSaving(true);
    console.log("[SAVE::BIOGRAFIA_REDES]", formData);

    try {
      const response = await onUpsert(formData);
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar a biografia e redes");
      }

      toast({
        title: "Sucesso",
        description: "Biografia e redes sociais publicadas com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::BIOGRAFIA_REDES]", error);
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
      <FormSection title="Biografia">
        <Uploader
          label="Documento Bio (PDF/DOC)"
          maxBytes={2 * 1024 * 1024}
          bucketPath="artist-media/docs"
          accept=".pdf,.doc,.docx"
          currentPath={formData.biography1}
          onUploaded={(url) => setFormData({ ...formData, biography1: url })}
        />
      </FormSection>

      <FormSection title="Redes Sociais" description="Adicione links completos (incluindo https://)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="input79">Facebook</Label>
            <Input
              id="input79"
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <Label htmlFor="input83">Instagram</Label>
            <Input
              id="input83"
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <Label htmlFor="input82">Spotify/Apple Music</Label>
            <Input
              id="input82"
              type="url"
              value={formData.music_spotify_apple}
              onChange={(e) => setFormData({ ...formData, music_spotify_apple: e.target.value })}
              placeholder="https://open.spotify.com/..."
            />
          </div>

          <div>
            <Label htmlFor="input81">Canal do YouTube</Label>
            <Input
              id="input81"
              type="url"
              value={formData.youtube_channel}
              onChange={(e) => setFormData({ ...formData, youtube_channel: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <Label htmlFor="input80">Website</Label>
            <Input
              id="input80"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://seusite.com"
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}