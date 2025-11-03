import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";

type BannerContentType = "none" | "youtube" | "image";

interface BannerContentState {
  type: BannerContentType;
  youtubeUrl: string;
  imagePath: string;
}

interface VideosAudiosFormData {
  audio: string;
  link_to_video: string;
  link_to_video2: string;
  link_to_video3: string;
  link_to_video4: string;
  link_to_video5: string;
  link_to_video6: string;
  link_to_video7: string;
  link_to_video8: string;
  link_to_video9: string;
  link_to_video10: string;
}

function createEmptyBannerContent(): BannerContentState {
  return {
    type: "none",
    youtubeUrl: "",
    imagePath: "",
  };
}

function createBannerContent(value?: string | null): BannerContentState {
  if (!value) return createEmptyBannerContent();
  if (isYoutubeUrl(value)) {
    return { type: "youtube", youtubeUrl: value, imagePath: "" };
  }

  return {
    type: "image",
    youtubeUrl: "",
    imagePath: value,
  };
}

function isYoutubeUrl(url?: string | null) {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return hostname.includes("youtube.com") || hostname === "youtu.be";
  } catch {
    return false;
  }
}

function isHttpUrl(url?: string | null) {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}

interface VideosAudiosProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function VideosAudios({ artistDetails, onUpsert }: VideosAudiosProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<VideosAudiosFormData>({
    audio: "",
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
  const [bannerContent, setBannerContent] = useState({
    landscape: createEmptyBannerContent(),
    portrait: createEmptyBannerContent(),
  });

  useEffect(() => {
    if (!artistDetails) {
      setFormData({
        audio: "",
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
      setBannerContent({
        landscape: createEmptyBannerContent(),
        portrait: createEmptyBannerContent(),
      });
      return;
    }

    setFormData({
      audio: artistDetails.audio || "",
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

    setBannerContent({
      landscape: createBannerContent(artistDetails.video_banner_landscape),
      portrait: createBannerContent(artistDetails.video_banner_portrait),
    });
  }, [artistDetails]);

  const validateYoutubeLinks = () => {
    const videoLinks = [
      formData.link_to_video,
      formData.link_to_video2,
      formData.link_to_video3,
      formData.link_to_video4,
      formData.link_to_video5,
      formData.link_to_video6,
      formData.link_to_video7,
      formData.link_to_video8,
      formData.link_to_video9,
      formData.link_to_video10,
    ];

    for (let i = 0; i < videoLinks.length; i++) {
      const link = videoLinks[i]?.trim();
      if (link && !isHttpUrl(link)) {
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

  const validateBannerContent = () => {
    const entries = [
      { label: "Vídeo Banner Landscape", content: bannerContent.landscape },
      { label: "Vídeo Banner Portrait", content: bannerContent.portrait },
    ];

    for (const entry of entries) {
      if (entry.content.type === "youtube") {
        const value = entry.content.youtubeUrl.trim();
        if (!value) {
          toast({
            title: "Erro de validação",
            description: `${entry.label} precisa de um link do YouTube`,
            variant: "destructive",
          });
          return false;
        }

        if (!isHttpUrl(value) || !isYoutubeUrl(value)) {
          toast({
            title: "Erro de validação",
            description: `${entry.label} deve ser um link válido do YouTube`,
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateYoutubeLinks() || !validateBannerContent()) return false;

    setSaving(true);
    const payload = {
      ...formData,
      video_banner_landscape:
        bannerContent.landscape.type === "youtube"
          ? bannerContent.landscape.youtubeUrl.trim()
          : bannerContent.landscape.type === "image"
            ? bannerContent.landscape.imagePath
            : "",
      video_banner_portrait:
        bannerContent.portrait.type === "youtube"
          ? bannerContent.portrait.youtubeUrl.trim()
          : bannerContent.portrait.type === "image"
            ? bannerContent.portrait.imagePath
            : "",
    };
    console.log("[SAVE::VIDEOS_AUDIOS]", payload);

    try {
      const response = await onUpsert(payload);
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
      <FormSection title="Áudio" description="Envie um áudio para a sua página">
        <Uploader
          id="uploadButton6"
          label="Ouça-me"
          storageFolder="videos"
          accept="audio/*"
          currentPath={formData.audio}
          onUploaded={(url) => setFormData({ ...formData, audio: url })}
          nameHint="audio"
        />
      </FormSection>

      <FormSection
        title="Vídeos Banner"
        description="Escolha entre um link do YouTube ou uma imagem para cada banner"
      >
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ink)]">Tipo de conteúdo</Label>
                <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="video_banner_landscape_type"
                      value="youtube"
                      checked={bannerContent.landscape.type === "youtube"}
                      onChange={() =>
                        setBannerContent((prev) => ({
                          ...prev,
                          landscape: {
                            ...prev.landscape,
                            type: "youtube",
                          },
                        }))
                      }
                    />
                    Link do YouTube
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="video_banner_landscape_type"
                      value="image"
                      checked={bannerContent.landscape.type === "image"}
                      onChange={() =>
                        setBannerContent((prev) => ({
                          ...prev,
                          landscape: {
                            ...prev.landscape,
                            type: "image",
                          },
                        }))
                      }
                    />
                    Imagem
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="video_banner_landscape_type"
                      value="none"
                      checked={bannerContent.landscape.type === "none"}
                      onChange={() =>
                        setBannerContent((prev) => ({
                          ...prev,
                          landscape: {
                            ...prev.landscape,
                            type: "none",
                          },
                        }))
                      }
                    />
                    Nenhum
                  </label>
                </div>
              </div>

              {bannerContent.landscape.type === "youtube" && (
                <div className="space-y-2">
                  <Label htmlFor="video-banner-landscape-url">Link do YouTube (Desktop 16:9)</Label>
                  <Input
                    id="video-banner-landscape-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={bannerContent.landscape.youtubeUrl}
                    onChange={(event) =>
                      setBannerContent((prev) => ({
                        ...prev,
                        landscape: {
                          ...prev.landscape,
                          youtubeUrl: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
              )}

              {bannerContent.landscape.type === "image" && (
                <Uploader
                  label="Imagem Banner Landscape (Desktop 16:9)"
                  storageFolder="videos"
                  accept="image/*"
                  currentPath={bannerContent.landscape.imagePath}
                  onUploaded={(url) =>
                    setBannerContent((prev) => ({
                      ...prev,
                      landscape: {
                        ...prev.landscape,
                        imagePath: url,
                      },
                    }))
                  }
                  nameHint="banner-landscape"
                />
              )}

              {bannerContent.landscape.type === "none" && (
                <p className="text-sm text-[var(--muted)]">
                  Selecione uma opção para adicionar conteúdo ao banner landscape.
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ink)]">Tipo de conteúdo</Label>
                <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="video_banner_portrait_type"
                      value="youtube"
                      checked={bannerContent.portrait.type === "youtube"}
                      onChange={() =>
                        setBannerContent((prev) => ({
                          ...prev,
                          portrait: {
                            ...prev.portrait,
                            type: "youtube",
                          },
                        }))
                      }
                    />
                    Link do YouTube
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="video_banner_portrait_type"
                      value="image"
                      checked={bannerContent.portrait.type === "image"}
                      onChange={() =>
                        setBannerContent((prev) => ({
                          ...prev,
                          portrait: {
                            ...prev.portrait,
                            type: "image",
                          },
                        }))
                      }
                    />
                    Imagem
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="video_banner_portrait_type"
                      value="none"
                      checked={bannerContent.portrait.type === "none"}
                      onChange={() =>
                        setBannerContent((prev) => ({
                          ...prev,
                          portrait: {
                            ...prev.portrait,
                            type: "none",
                          },
                        }))
                      }
                    />
                    Nenhum
                  </label>
                </div>
              </div>

              {bannerContent.portrait.type === "youtube" && (
                <div className="space-y-2">
                  <Label htmlFor="video-banner-portrait-url">Link do YouTube (Mobile 9:16)</Label>
                  <Input
                    id="video-banner-portrait-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={bannerContent.portrait.youtubeUrl}
                    onChange={(event) =>
                      setBannerContent((prev) => ({
                        ...prev,
                        portrait: {
                          ...prev.portrait,
                          youtubeUrl: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
              )}

              {bannerContent.portrait.type === "image" && (
                <Uploader
                  label="Imagem Banner Portrait (Mobile 9:16)"
                  storageFolder="videos"
                  accept="image/*"
                  currentPath={bannerContent.portrait.imagePath}
                  onUploaded={(url) =>
                    setBannerContent((prev) => ({
                      ...prev,
                      portrait: {
                        ...prev.portrait,
                        imagePath: url,
                      },
                    }))
                  }
                  nameHint="banner-portrait"
                />
              )}

              {bannerContent.portrait.type === "none" && (
                <p className="text-sm text-[var(--muted)]">
                  Selecione uma opção para adicionar conteúdo ao banner portrait.
                </p>
              )}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Links do YouTube" description="Adicione até 10 links de vídeos do YouTube">
        <div className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const key = `link_to_video${num === 1 ? "" : num}` as keyof typeof formData;
            return (
              <div key={num} className="md:col-span-6">
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