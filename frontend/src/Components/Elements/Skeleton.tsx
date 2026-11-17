// src/Components/Elements/Skeleton.tsx
// Anaheim Design Kit — Specimen 09: Tooltip & Skeleton Loading (FigCraft 1:1 Implementation)
import React from "react";
import { cn } from "@/Utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ref, ...props }) => {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-[#f1f5f9] dark:bg-muted/40", className)}
      {...props}
    />
  );
};

export default Skeleton;
