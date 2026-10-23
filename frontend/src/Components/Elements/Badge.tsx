// src/Components/Elements/Badge.tsx
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase select-none transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground border border-border",
        outline: "border border-border text-foreground bg-transparent",
        primary: "bg-primary-subtle text-primary-subtle-foreground border border-primary-subtle-border",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        success: "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border",
        warning: "bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border",
        destructive: "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border",
        purple: "bg-purple-subtle text-purple-subtle-foreground border border-purple-subtle-border",
        cyan: "bg-cyan-subtle text-cyan-subtle-foreground border border-cyan-subtle-border",
        indigo: "bg-primary-subtle text-primary-subtle-foreground border border-primary-subtle-border",

        // Specific Task Status Tones
        DRAFT: "bg-secondary text-secondary-foreground border border-border",
        RELEASED: "bg-purple-subtle text-purple-subtle-foreground border border-purple-subtle-border",
        DEVELOPMENT: "bg-primary-subtle text-primary-subtle-foreground border border-primary-subtle-border",
        CODE_REVIEW: "bg-purple-subtle text-purple-subtle-foreground border border-purple-subtle-border",
        TESTING: "bg-cyan-subtle text-cyan-subtle-foreground border border-cyan-subtle-border",
        DONE: "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border",

        // Approval Status Tones
        PENDING: "bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border",
        APPROVED: "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border",
        REJECTED: "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border",

        // Complexity Tones
        LOW: "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border",
        MEDIUM: "bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border",
        HIGH: "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border",

        // Rework Tag
        REWORK: "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border font-extrabold animate-pulse",
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
