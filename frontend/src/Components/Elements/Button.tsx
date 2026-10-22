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
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
        outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = memo<ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, type = "button", ...props }) => {
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
