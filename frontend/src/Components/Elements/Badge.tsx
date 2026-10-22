// src/Components/Elements/Badge.tsx
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase select-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border border-slate-200",
        outline: "border border-slate-200 text-slate-700 bg-transparent",
        primary: "bg-blue-50 text-blue-700 border border-blue-200",
        secondary: "bg-slate-100 text-slate-600 border border-slate-200",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        destructive: "bg-red-50 text-red-700 border border-red-200",
        purple: "bg-purple-50 text-purple-700 border border-purple-200",
        cyan: "bg-cyan-50 text-cyan-700 border border-cyan-200",
        indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",

        // Specific Task Status Tones
        DRAFT: "bg-slate-100 text-slate-700 border border-slate-200",
        RELEASED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        DEVELOPMENT: "bg-blue-50 text-blue-700 border border-blue-200",
        CODE_REVIEW: "bg-purple-50 text-purple-700 border border-purple-200",
        TESTING: "bg-cyan-50 text-cyan-700 border border-cyan-200",
        DONE: "bg-emerald-50 text-emerald-700 border border-emerald-200",

        // Approval Status Tones
        PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
        APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        REJECTED: "bg-red-50 text-red-700 border border-red-200",

        // Complexity Tones
        LOW: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        MEDIUM: "bg-amber-50 text-amber-700 border border-amber-200",
        HIGH: "bg-rose-50 text-rose-700 border border-rose-200",

        // Rework Tag
        REWORK: "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold animate-pulse",
      },
      size: {
        default: "text-[10px] px-2 py-0.5",
        sm: "text-[9px] px-1.5 py-0.2",
        lg: "text-xs px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge = memo<BadgeProps>(({ className, variant, size, dot, children, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
export default Badge;
