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
        "flex min-h-18 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground shadow-2xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
