// src/Components/Elements/Label.tsx
// Anaheim Design Kit — Specimen 02: Form Labels (FigCraft 1:1 CVA Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const labelVariants = cva(
  "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none block mb-1.5",
  {
    variants: {
      size: {
        sm: "text-[11px] font-medium",
        default: "text-xs font-semibold",
        bold: "text-xs font-bold",
      },
      tone: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      tone: "default",
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  ref?: React.Ref<HTMLLabelElement>;
}

export const Label = memo<LabelProps>(
  ({ className, size, tone, required, children, ref, ...props }) => (
    <label ref={ref} className={cn(labelVariants({ size, tone }), className)} {...props}>
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  ),
);
Label.displayName = "Label";
export default Label;
