import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

interface ToolbarSaveProps {
  onSave: () => Promise<boolean>;
  saving?: boolean;
  successLabel?: string;
  defaultLabel?: string;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
}

export function ToolbarSave({
  onSave,
  saving = false,
  successLabel = "Conteúdo enviado ✔️",
  defaultLabel = "Publicar",
  variant = "primary",
  disabled = false,
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
    const result = await onSave();
    if (result) {
      setShowSuccess(true);
    }
  };

  return (
    <Button type="button" onClick={handleClick} disabled={saving || disabled} variant={variant}>
      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!saving && showSuccess && <Check className="mr-2 h-4 w-4" />}
      {showSuccess ? successLabel : defaultLabel}
    </Button>
  );
}
