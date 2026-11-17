// src/Components/Elements/Modal.tsx
// Anaheim Design Kit — Specimen 14: Dialog Containers (FigCraft 1:1 Implementation)
import React, { memo, useEffect } from "react";
import { cn } from "@/Utils/cn";
import { Button } from "./Button";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  className?: string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-6xl",
};

export const Modal = memo<ModalProps>(
  ({ isOpen, onClose, title, description, children, footer, maxWidth = "md", className }) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };
      if (isOpen) {
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
      }
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop (FigCraft 50% dark slate with blur) */}
        <div
          className="fixed inset-0 bg-[#0f172a]/50 backdrop-blur-xs transition-opacity animate-fade"
          onClick={onClose}
        />

        {/* Modal Dialog (FigCraft 16px radius, white card surface) */}
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative z-10 w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl transition-all animate-pop my-auto",
            maxWidthMap[maxWidth],
            className,
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between gap-3 border-b border-border/80 p-5 pb-4">
              <div className="min-w-0 flex-1">
                {title && (
                  <div className="text-base font-bold text-foreground leading-snug">{title}</div>
                )}
                {description && (
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={onClose}
                className="text-muted-foreground hover:bg-muted hover:text-foreground -mr-1 -mt-1"
                aria-label="Tutup"
              >
                <X className="size-4" />
                <span className="sr-only">Tutup</span>
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-2.5 border-t border-border/80 bg-[#f8fafc] p-4 px-5">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";
export default Modal;
