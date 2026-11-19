// src/Components/Elements/Textarea.tsx
// Anaheim Design Kit — Specimen 02: Textarea (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const Textarea = memo<TextareaProps>(({ className, error, ref, ...props }) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[76px] w-full rounded-md border border-input bg-card px-3 py-2 text-xs text-foreground shadow-2xs transition-colors duration-150 leading-relaxed",
        "placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground/60 disabled:border-border",
        error &&
          "border-destructive focus-visible:border-destructive focus-visible:ring-destructive bg-destructive-subtle/30 text-destructive",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
