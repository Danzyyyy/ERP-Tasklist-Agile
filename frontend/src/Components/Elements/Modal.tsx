// src/Components/Elements/Modal.tsx
import React, { memo, useEffect } from "react";
import { cn } from "@/Utils/cn";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export const Modal = memo<ModalProps>(({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
}) => {
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-[fade_0.16s_ease]"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all animate-[pop_0.2s_ease] my-auto",
          maxWidthMap[maxWidth],
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-5 pb-4">
            <div className="min-w-0 flex-1">
              {title && <div className="text-base font-bold text-slate-900 leading-snug">{title}</div>}
              {description && <div className="mt-1 text-xs text-slate-500 leading-relaxed">{description}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
            >
              <X className="size-4" />
              <span className="sr-only">Tutup</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-4 px-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";
export default Modal;
