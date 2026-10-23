// src/Components/Elements/Button.tsx
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm border border-transparent",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm border border-transparent",
        outline: "border border-border bg-card hover:bg-accent text-foreground shadow-2xs",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        ghost: "hover:bg-accent text-muted-foreground hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm",
      },
      size: {
        default: "h-8 px-3.5 py-1.5",
        sm: "h-7 rounded-md px-2.5 text-[11px]",
        lg: "h-10 rounded-lg px-5 text-sm",
        icon: "size-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
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
    ...props
  }) => {
    return (
      <button
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && <Loader2 className="size-3.5 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
