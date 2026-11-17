// src/Components/Elements/Button.tsx
// Anaheim Design Kit — Specimen 01: Buttons (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium select-none transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
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
        ghost:
          "bg-transparent text-foreground hover:bg-muted active:bg-border/60 hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-xs border border-transparent",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-[#dc2626] active:bg-[#b91c1c] shadow-xs border border-transparent",
        success:
          "bg-success text-success-foreground hover:bg-[#059669] active:bg-[#047857] shadow-xs border border-transparent",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium shadow-none bg-transparent",
      },
      size: {
        default: "h-[34px] px-3.5 py-1.5 text-[13px] rounded-md gap-2",
        sm: "h-7 px-2.5 py-1 text-xs rounded-sm gap-1.5",
        lg: "h-[42px] px-4.5 py-2 text-sm rounded-md gap-2 font-semibold",
        icon: "size-[34px] p-0 rounded-md shrink-0 justify-center",
        iconSm: "size-7 p-0 rounded-sm shrink-0 justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
        className={cn(buttonVariants({ variant, size, className }))}
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
