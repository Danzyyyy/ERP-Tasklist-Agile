// src/Components/Elements/Input.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = memo<InputProps>(({ className, type = "text", error, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-8 w-full rounded-lg border border-input bg-card px-3 py-1 text-xs text-foreground shadow-2xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;
