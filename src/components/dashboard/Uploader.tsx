import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Check, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl, uploadToArtistBucket } from "@/utils/storage";
import { cn } from "@/lib/utils";

interface UploaderProps {
  label: string;
  maxBytes: number;
  storageFolder: "profile" | "photos" | "videos" | "docs";
  accept?: string;
  onUploaded: (path: string) => void;
  currentPath?: string;
  id?: string;
  previewClassName?: string;
  className?: string;
  buttonClassName?: string;
  actionsClassName?: string;
  removeButtonClassName?: string;
  nameHint?: string;
  upsert?: boolean;
}

export function Uploader({
  label,
  maxBytes,
  storageFolder,
  accept = "*/*",
  onUploaded,
  currentPath,
  id,
  previewClassName,
  className,
  buttonClassName,
  actionsClassName,
  removeButtonClassName,
  nameHint,
  upsert,
}: UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPreview = useCallback(async (path?: string | null) => {
    if (!path) {
      setPreview("");
      return;
    }

    if (path.startsWith("http://") || path.startsWith("https://")) {
      setPreview(path);
      return;
    }

    try {
      const signedUrl = await getSignedUrl(path);
      setPreview(signedUrl);
    } catch (error) {
      console.error("[UPLOAD::SIGNED_URL]", error);
      setPreview("");
    }
  }, []);

  useEffect(() => {
    void loadPreview(currentPath);
  }, [currentPath, loadPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxBytes) {
      toast({
        title: "Erro",
        description: `Arquivo muito grande. Tamanho máximo: ${(maxBytes / 1024 / 1024).toFixed(1)}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { path } = await uploadToArtistBucket({
        file,
        userId: user.id,
        folder: storageFolder,
        nameHint,
        upsert,
      });

      onUploaded(path);
      await loadPreview(path);

      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso!",
      });
    } catch (error: unknown) {
      console.error("[UPLOAD::ERROR]", error);
      const message = error instanceof Error ? error.message : "Erro ao enviar arquivo";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = preview && (preview.match(/\.(jpeg|jpg|gif|png|webp)$/i) || accept.includes("image"));

  return (
    <div className={cn("space-y-2", className)} id={id}>
      <label className="text-sm font-medium text-[var(--ink)]">{label}</label>

      <div className={cn("flex flex-wrap items-center gap-2", actionsClassName)}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
          id={id ? `${id}-input` : undefined}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex-1 justify-center whitespace-normal",
            buttonClassName,
          )}
          aria-label={label}
        >
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!uploading && preview && <Check className="mr-2 h-4 w-4" />}
          {!uploading && !preview && <Upload className="mr-2 h-4 w-4" />}
          {preview ? "Arquivo enviado ✔️" : label}
        </Button>

        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={uploading}
            aria-label="Remover arquivo"
            className={removeButtonClassName}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isImage && preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className={previewClassName || "max-w-xs h-auto rounded-lg border"}
          />
        </div>
      )}
    </div>
  );
}
