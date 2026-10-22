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
        "flex h-8 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
        error && "border-red-500 focus-visible:ring-red-500",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
export default Input;
