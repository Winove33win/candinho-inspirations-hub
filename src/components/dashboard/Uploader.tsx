import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Check, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploaderProps {
  label: string;
  maxBytes: number;
  bucket: string;
  accept?: string;
  onUploaded: (url: string) => void;
  currentUrl?: string;
  id?: string;
}

export function Uploader({
  label,
  maxBytes,
  bucket,
  accept = "*/*",
  onUploaded,
  currentUrl,
  id,
}: UploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onUploaded(publicUrl);

      toast({
        title: "Sucesso",
        description: "Arquivo enviado com sucesso!",
      });
    } catch (error: any) {
      console.error("[UPLOAD::ERROR]", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar arquivo",
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
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
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
            className="max-w-xs h-auto rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}