import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

interface VideosAudiosProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function VideosAudios({ artistDetails, onUpsert }: VideosAudiosProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    audio: "",
    video_banner_landscape: "",
    video_banner_portrait: "",
    link_to_video: "",
    link_to_video2: "",
    link_to_video3: "",
    link_to_video4: "",
    link_to_video5: "",
    link_to_video6: "",
    link_to_video7: "",
    link_to_video8: "",
    link_to_video9: "",
    link_to_video10: "",
  });

  useEffect(() => {
    if (artistDetails) {
      setFormData({
        audio: artistDetails.audio || "",
        video_banner_landscape: artistDetails.video_banner_landscape || "",
        video_banner_portrait: artistDetails.video_banner_portrait || "",
        link_to_video: artistDetails.link_to_video || "",
        link_to_video2: artistDetails.link_to_video2 || "",
        link_to_video3: artistDetails.link_to_video3 || "",
        link_to_video4: artistDetails.link_to_video4 || "",
        link_to_video5: artistDetails.link_to_video5 || "",
        link_to_video6: artistDetails.link_to_video6 || "",
        link_to_video7: artistDetails.link_to_video7 || "",
        link_to_video8: artistDetails.link_to_video8 || "",
        link_to_video9: artistDetails.link_to_video9 || "",
        link_to_video10: artistDetails.link_to_video10 || "",
      });
    }
  }, [artistDetails]);

  const validateYoutubeLinks = () => {
    const videoLinks = [
      formData.link_to_video, formData.link_to_video2, formData.link_to_video3,
      formData.link_to_video4, formData.link_to_video5, formData.link_to_video6,
      formData.link_to_video7, formData.link_to_video8, formData.link_to_video9,
      formData.link_to_video10
    ];

    for (let i = 0; i < videoLinks.length; i++) {
      const link = videoLinks[i];
      if (link && !link.match(/^https?:\/\/.+/)) {
        toast({
          title: "Erro de validação",
          description: `Link do vídeo ${i + 1} deve começar com http:// ou https://`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateYoutubeLinks()) return false;

    setSaving(true);
    console.log("[SAVE::VIDEOS_AUDIOS]", formData);

    try {
      const response = await onUpsert(formData);
      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar vídeos e áudios");
      }

      toast({
        title: "Sucesso",
        description: "Vídeos e áudios publicados com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::VIDEOS_AUDIOS]", error);
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
      <FormSection title="Áudio" description="Envie um áudio de até 4 MB">
        <Uploader
          id="uploadButton6"
          label="Ouça-me"
          maxBytes={4 * 1024 * 1024}
          bucketPath="artist-media/audio"
          accept="audio/*"
          currentUrl={formData.audio}
          onUploaded={(url) => setFormData({ ...formData, audio: url })}
        />
      </FormSection>

      <FormSection title="Vídeos Banner" description="Envie vídeos de até 15 MB">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Uploader
            label="Vídeo Banner Landscape (Desktop 16:9)"
            maxBytes={15 * 1024 * 1024}
            bucketPath="artist-media/video"
            accept="video/*"
            currentUrl={formData.video_banner_landscape}
            onUploaded={(url) => setFormData({ ...formData, video_banner_landscape: url })}
          />

          <Uploader
            label="Vídeo Banner Portrait (Mobile 9:16)"
            maxBytes={15 * 1024 * 1024}
            bucketPath="artist-media/video"
            accept="video/*"
            currentUrl={formData.video_banner_portrait}
            onUploaded={(url) => setFormData({ ...formData, video_banner_portrait: url })}
          />
        </div>
      </FormSection>

      <FormSection title="Links do YouTube" description="Adicione até 10 links de vídeos do YouTube">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const key = `link_to_video${num === 1 ? "" : num}` as keyof typeof formData;
            return (
              <div key={num}>
                <Label htmlFor={`input${83 + num}`}>Vídeo {num}</Label>
                <Input
                  id={`input${83 + num}`}
                  type="url"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            );
          })}
        </div>
      </FormSection>

      <div className="flex justify-end">
        <ToolbarSave onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}