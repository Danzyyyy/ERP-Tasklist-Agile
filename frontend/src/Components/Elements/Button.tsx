// src/Components/Elements/Button.tsx
// Anaheim Design Kit — Specimen 01: Buttons (FigCraft 1:1 CVA Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold select-none transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-[#3730a3] shadow-xs border border-transparent",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-[#3730a3] shadow-xs border border-transparent",
        secondary:
          "bg-primary-subtle text-primary border border-primary-subtle-border hover:bg-[#e0e7ff] hover:border-[#a5b4fc]",
        outline:
          "bg-card text-foreground border border-border hover:bg-muted/70 hover:border-[#cbd5e1] shadow-2xs",
        outlineMuted:
          "bg-card text-muted-foreground border border-border hover:bg-muted/70 hover:text-foreground hover:border-[#cbd5e1] shadow-2xs",
        ghost:
          "bg-transparent text-foreground hover:bg-muted active:bg-border/60 hover:text-foreground",
        ghostMuted:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        ghostCard:
          "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground font-medium",
        ghostPrimary:
          "bg-transparent text-primary hover:bg-primary-subtle hover:text-primary-hover",
        muted:
          "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-xs border border-transparent",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-xs border border-transparent",
        destructiveSubtle:
          "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border hover:bg-destructive-subtle/80",
        success:
          "bg-success text-success-foreground hover:bg-[#059669] active:bg-[#047857] shadow-xs border border-transparent",
        successSubtle:
          "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border hover:bg-success-subtle/80",
        warningSubtle:
          "bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border hover:bg-warning-subtle/80",
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary-hover shadow-none bg-transparent border-transparent",
        linkMuted:
          "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline shadow-none bg-transparent border-transparent font-medium",
        choice:
          "bg-card text-muted-foreground border border-border hover:bg-muted font-semibold",
        choiceSuccess:
          "bg-success-subtle text-success-subtle-foreground border border-success ring-1 ring-success/40 font-bold",
        choiceDestructive:
          "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive ring-1 ring-destructive/40 font-bold",
      },
      size: {
        xs: "h-7 px-2.5 text-[11px] rounded-sm gap-1",
        sm: "h-8 px-3 text-xs rounded-sm gap-1.5",
        default: "h-9 px-4 text-xs rounded-md gap-1.5",
        lg: "h-[42px] px-5 text-sm rounded-lg gap-2",
        choice: "h-auto px-3 py-2.5 text-xs rounded-lg gap-2",
        iconXs: "size-6 p-0 rounded-sm shrink-0",
        iconSm: "size-7 p-0 rounded-sm shrink-0",
        icon: "size-9 p-0 rounded-md shrink-0",
        iconLg: "size-[42px] p-0 rounded-lg shrink-0",
      },
      align: {
        center: "justify-center",
        left: "justify-start",
        between: "justify-between",
      },
    },
    compoundVariants: [
      {
        variant: ["link", "linkMuted"],
        className: "h-auto p-0 rounded-none active:scale-100",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      align: "center",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button = memo<ButtonProps>(
  ({
    className,
    variant,
    size,
    align,
    loading = false,
    disabled,
    children,
    type = "button",
    ref,
    ...props
  }) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, align, className }))}
        {...props}
      >
        {loading && <Loader2 className="size-3.5 animate-spin shrink-0" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
