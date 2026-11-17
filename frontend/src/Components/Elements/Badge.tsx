// src/Components/Elements/Badge.tsx
// Anaheim Design Kit — Specimen 05: Badge & Status Tags (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold tracking-tight uppercase select-none transition-colors border leading-tight shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-border",
        outline: "border-border text-foreground bg-transparent",
        primary: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",
        secondary: "bg-muted text-muted-foreground border-border",
        success: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
        warning: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
        destructive: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",
        purple: "bg-[#faf5ff] text-[#6b21a8] border-[#e9d5ff]",
        cyan: "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]",
        indigo: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",

        // Agile Lifecycle Statuses (FigCraft Specimen 05)
        DRAFT: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
        RELEASED: "bg-[#faf5ff] text-[#6b21a8] border-[#e9d5ff]",
        DEVELOPMENT: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe]",
        CODE_REVIEW: "bg-[#faf5ff] text-[#6b21a8] border-[#e9d5ff]",
        TESTING: "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]",
        DONE: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",

        // Approval Statuses
        PENDING: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
        APPROVED: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
        REJECTED: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",

        // Complexity Tones
        LOW: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
        MEDIUM: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
        HIGH: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]",

        // Rework Tag
        REWORK: "bg-[#fef2f2] text-[#991b1b] border-[#fecaca] font-black animate-pulse",
      },
      size: {
        default: "h-[22px] px-2 py-0.5 text-[10.5px]",
        sm: "h-[18px] px-1.5 py-0 text-[9px] gap-1",
        lg: "h-[26px] px-2.5 py-1 text-xs gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BadgeVariant =
  | NonNullable<VariantProps<typeof badgeVariants>["variant"]>
  | (string & {});

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  variant?: BadgeVariant | null;
  size?: VariantProps<typeof badgeVariants>["size"];
  dot?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

export const Badge = memo<BadgeProps>(
  ({ className, variant = "default", size, dot, children, ref, ...props }) => {
    const validVariant = (variant || "default") as VariantProps<typeof badgeVariants>["variant"];
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant: validVariant, size, className }))}
        {...props}
      >
        {dot && <span className="size-1.5 rounded-full bg-current opacity-80 shrink-0" />}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
export default Badge;
