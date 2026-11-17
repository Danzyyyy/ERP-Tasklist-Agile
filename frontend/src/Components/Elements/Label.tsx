// src/Components/Elements/Label.tsx
// Anaheim Design Kit — Specimen 02: Form Labels (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  ref?: React.Ref<HTMLLabelElement>;
}

export const Label = memo<LabelProps>(({ className, required, children, ref, ...props }) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-semibold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none block mb-1.5",
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-0.5">*</span>}
  </label>
));
Label.displayName = "Label";
export default Label;
