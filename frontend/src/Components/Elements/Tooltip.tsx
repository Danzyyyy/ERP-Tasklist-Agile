// src/Components/Elements/Tooltip.tsx
// Anaheim Design Kit — Specimen 09: Tooltip & Skeleton Loading (FigCraft 1:1 Implementation)
import React, { createContext, useContext, useState, memo, type ReactNode } from "react";
import { cn } from "@/Utils/cn";

interface TooltipContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export const Tooltip: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = memo<{ children: ReactNode; className?: string }>(
  ({ children, className }) => <div className={cn("inline-flex", className)}>{children}</div>,
);
TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = memo<React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }) => {
    const context = useContext(TooltipContext);
    if (!context?.open) return null;

    return (
      <div
        role="tooltip"
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 overflow-hidden rounded-md bg-[#0f172a] px-2.5 py-1 text-[11px] font-medium text-white shadow-md animate-fade whitespace-nowrap pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export default Tooltip;
