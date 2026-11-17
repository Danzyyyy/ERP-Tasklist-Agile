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
        primary: "bg-primary-subtle text-primary border-primary-subtle-border",
        secondary: "bg-muted text-muted-foreground border-border",
        success: "bg-success-subtle text-success-subtle-foreground border-success-subtle-border",
        warning: "bg-warning-subtle text-warning-subtle-foreground border-warning-subtle-border",
        destructive: "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-subtle-border",
        purple: "bg-purple-subtle text-purple-subtle-foreground border-purple-subtle-border",
        cyan: "bg-cyan-subtle text-cyan-subtle-foreground border-cyan-subtle-border",
        indigo: "bg-primary-subtle text-primary border-primary-subtle-border",

        // Agile Lifecycle Statuses (FigCraft Specimen 05)
        DRAFT: "bg-muted text-muted-foreground border-border",
        RELEASED: "bg-purple-subtle text-purple-subtle-foreground border-purple-subtle-border",
        DEVELOPMENT: "bg-primary-subtle text-primary border-primary-subtle-border",
        CODE_REVIEW: "bg-purple-subtle text-purple-subtle-foreground border-purple-subtle-border",
        TESTING: "bg-cyan-subtle text-cyan-subtle-foreground border-cyan-subtle-border",
        DONE: "bg-success-subtle text-success-subtle-foreground border-success-subtle-border",

        // Approval Statuses
        PENDING: "bg-muted text-muted-foreground border-border",
        APPROVED: "bg-success-subtle text-success-subtle-foreground border-success-subtle-border",
        REJECTED: "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-subtle-border",

        // Complexity Tones
        LOW: "bg-success-subtle text-success-subtle-foreground border-success-subtle-border",
        MEDIUM: "bg-warning-subtle text-warning-subtle-foreground border-warning-subtle-border",
        HIGH: "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-subtle-border",

        // Rework Tag
        REWORK: "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-subtle-border font-black animate-pulse",
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
