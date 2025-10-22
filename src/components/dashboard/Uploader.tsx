import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Check, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploaderProps {
  label: string;
  maxBytes: number;
  bucket?: string;
  bucketPath?: string;
  accept?: string;
  onUploaded: (url: string) => void;
  currentUrl?: string;
  id?: string;
  previewClassName?: string;
}

export function Uploader({
  label,
  maxBytes,
  bucket,
  bucketPath,
  accept = "*/*",
  onUploaded,
  currentUrl,
  id,
  previewClassName,
}: UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentUrl || "");
  }, [currentUrl]);

  const resolveBucket = () => {
    const target = bucketPath ?? bucket;
    if (!target) {
      throw new Error("Bucket não configurado para o uploader");
    }

    const segments = target.split("/").filter(Boolean);
    const resolvedBucket = segments.shift() ?? target;
    const folderPath = segments.join("/");
    return { resolvedBucket, folderPath };
  };

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
      const { resolvedBucket, folderPath } = resolveBucket();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split(".").pop();
      const pathPrefix = [user.id, folderPath].filter(Boolean).join("/");
      const fileName = `${pathPrefix}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(resolvedBucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(resolvedBucket)
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onUploaded(publicUrl);

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
    <div className="space-y-2" id={id}>
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2">
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
          className="flex-1"
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
