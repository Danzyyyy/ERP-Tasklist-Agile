// src/Components/Elements/Separator.tsx
// Anaheim Design Kit — Specimen 00: Dividers & Separators (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  size?: "full" | "sm" | "md";
  decorative?: boolean;
}

const verticalSizeMap = {
  full: "h-full",
  sm: "h-4",
  md: "h-6",
};

export const Separator = memo<SeparatorProps>(
  ({ className, orientation = "horizontal", size = "full", decorative = true, ...props }) => (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : cn("w-px", verticalSizeMap[size]),
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";
export default Separator;
