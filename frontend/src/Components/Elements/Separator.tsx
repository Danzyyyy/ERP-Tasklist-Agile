// src/Components/Elements/Separator.tsx
// Anaheim Design Kit — Specimen 00: Dividers & Separators (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = memo<SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }) => (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";
export default Separator;
