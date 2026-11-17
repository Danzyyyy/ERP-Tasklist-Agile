// src/Components/Elements/Progress.tsx
// Anaheim Design Kit — Specimen 08: Progress Bar & Completion Meters (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  showLabel?: boolean;
  animatedShine?: boolean;
  height?: string;
  tone?: "indigo" | "emerald" | "amber" | "blue";
  ref?: React.Ref<HTMLDivElement>;
}

const toneClasses = {
  indigo: "bg-[#4f46e5] text-white",
  emerald: "bg-[#10b981] text-white",
  amber: "bg-[#f59e0b] text-white",
  blue: "bg-[#0284c7] text-white",
};

export const Progress = memo<ProgressProps>(
  ({
    value = 0,
    showLabel = false,
    animatedShine = true,
    height = "h-2.5",
    tone = "indigo",
    className,
    ref,
    ...props
  }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const activeTone = clampedValue >= 100 ? "emerald" : tone;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-full bg-[#f1f5f9] border border-border/40 relative shadow-inner",
          height,
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-all duration-500 relative overflow-hidden",
            toneClasses[activeTone],
          )}
          style={{ width: `${clampedValue}%` }}
        >
          {showLabel && clampedValue > 15 && (
            <span className="relative z-10 drop-shadow-xs px-2 truncate leading-none">
              {clampedValue.toFixed(0)}%
            </span>
          )}
          {animatedShine && clampedValue > 0 && clampedValue < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine" />
          )}
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
export default Progress;
