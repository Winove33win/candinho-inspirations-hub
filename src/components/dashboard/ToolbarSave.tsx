import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

interface ToolbarSaveProps {
  onSave: () => Promise<void>;
  saving?: boolean;
  successLabel?: string;
  defaultLabel?: string;
  variant?: "default" | "outline";
}

export function ToolbarSave({
  onSave,
  saving = false,
  successLabel = "Conteúdo enviado ✔️",
  defaultLabel = "Publicar",
  variant = "default",
}: ToolbarSaveProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!saving && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saving, showSuccess]);

  const handleClick = async () => {
    await onSave();
    setShowSuccess(true);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={saving}
      variant={variant}
      className="bg-[#90080b] hover:bg-[#7b0509] text-white"
    >
      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!saving && showSuccess && <Check className="mr-2 h-4 w-4" />}
      {showSuccess ? successLabel : defaultLabel}
    </Button>
  );
}