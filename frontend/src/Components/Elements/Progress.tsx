// src/Components/Elements/Progress.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
  showLabel?: boolean;
  animatedShine?: boolean;
  height?: string;
  tone?: "blue" | "emerald" | "amber" | "indigo";
}

const toneGradients = {
  blue: "from-blue-600 via-blue-500 to-indigo-500",
  emerald: "from-emerald-600 via-emerald-500 to-teal-500",
  amber: "from-amber-600 via-amber-500 to-orange-500",
  indigo: "from-indigo-600 via-blue-500 to-emerald-500",
};

export const Progress = memo<ProgressProps>(({
  value = 0,
  showLabel = false,
  animatedShine = true,
  height = "h-5",
  tone = "indigo",
  className,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("w-full overflow-hidden rounded-lg bg-slate-200/80 shadow-inner relative", height, className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-lg bg-gradient-to-r flex items-center justify-center text-white font-mono text-[9px] font-bold transition-all duration-500 relative overflow-hidden",
          toneGradients[tone],
        )}
        style={{ width: `${clampedValue}%` }}
      >
        {showLabel && clampedValue > 10 && (
          <span className="relative z-10 drop-shadow-xs px-2 truncate">
            {clampedValue.toFixed(1)}%
          </span>
        )}
        {animatedShine && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_infinite]" />
        )}
      </div>
    </div>
  );
});

Progress.displayName = "Progress";
export default Progress;
