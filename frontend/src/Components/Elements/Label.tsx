// src/Components/Elements/Label.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = memo<LabelProps>(({ className, required, children, ...props }) => (
  <label
    className={cn(
      "text-xs font-semibold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none block",
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
));
Label.displayName = "Label";
export default Label;
