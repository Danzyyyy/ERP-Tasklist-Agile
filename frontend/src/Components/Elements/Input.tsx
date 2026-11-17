// src/Components/Elements/Input.tsx
// Anaheim Design Kit — Specimen 02: Input & Textarea (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  sizeVariant?: "sm" | "default" | "lg";
  ref?: React.Ref<HTMLInputElement>;
}

export const Input = memo<InputProps>(
  ({ className, type = "text", error, sizeVariant = "default", ref, ...props }) => {
    const sizeClasses = {
      sm: "h-7 px-2.5 py-1 text-xs rounded-sm",
      default: "h-[34px] px-3 py-1.5 text-[13px] rounded-md",
      lg: "h-[42px] px-4 py-2 text-sm rounded-md",
    };

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex w-full border border-input bg-card text-foreground shadow-2xs transition-colors duration-150",
          "placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground/60 disabled:border-border",
          sizeClasses[sizeVariant],
          error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive bg-[#fef2f2]/20 text-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
export default Input;
