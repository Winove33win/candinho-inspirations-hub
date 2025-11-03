import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
}

export default function Modal({ open, onClose, children, ariaLabel = "Visualizador de mídia" }: ModalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  if (!ref.current && typeof document !== "undefined") {
    const el = document.createElement("div");
    el.setAttribute("id", "portal-modal-root");
    ref.current = el;
  }

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    document.body.appendChild(root);
    return () => {
      root.remove();
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !ref.current) return null;

  return createPortal(
    <div className="lb-backdrop" role="dialog" aria-modal="true" aria-label={ariaLabel} onClick={onClose}>
      <div className="lb-content" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        {children}
        <button type="button" className="lb-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      </div>
    </div>,
    ref.current
  );
}
