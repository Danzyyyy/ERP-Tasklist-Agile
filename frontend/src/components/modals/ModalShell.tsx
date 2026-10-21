import { ReactNode } from "react";

interface ModalShellProps {
  children: ReactNode;
  onClose: () => void;
  size?: "large" | "approval";
}

export default function ModalShell({ children, onClose, size = "large" }: ModalShellProps) {
  const maxWidthClass = size === "approval" ? "max-w-[930px]" : "max-w-[800px]";

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs grid place-items-center p-5 animate-[fade_0.16s_ease]"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className={`w-full ${maxWidthClass} max-h-[92vh] bg-white rounded-xl shadow-2xl overflow-y-auto border border-white/40 animate-[pop_0.2s_ease]`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </section>
    </div>
  );
}
