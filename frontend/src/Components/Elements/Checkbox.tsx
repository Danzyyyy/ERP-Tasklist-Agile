// src/Components/Elements/Checkbox.tsx
import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center size-4 rounded-xs border border-slate-300 bg-white transition-colors cursor-pointer select-none",
          checked ? "bg-blue-600 border-blue-600 text-white" : "hover:border-slate-400",
          disabled && "cursor-not-allowed opacity-50 bg-slate-100",
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (onChange) onChange(e);
            if (onCheckedChange) onCheckedChange(e.target.checked);
          }}
          className="sr-only peer"
          {...props}
        />
        {checked && <Check className="size-3 text-white stroke-[3]" />}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
