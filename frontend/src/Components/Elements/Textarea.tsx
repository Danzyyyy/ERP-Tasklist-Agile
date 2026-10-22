// src/Components/Elements/Textarea.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = memo<TextareaProps>(({ className, error, ...props }) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[72px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-2xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
        error && "border-red-500 focus-visible:ring-red-500",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
