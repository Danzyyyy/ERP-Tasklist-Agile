// src/Components/Elements/Checkbox.tsx
import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center size-4 rounded-xs border border-input bg-card transition-colors cursor-pointer select-none",
          checked ? "bg-primary border-primary text-primary-foreground" : "hover:border-ring",
          disabled && "cursor-not-allowed opacity-50 bg-muted",
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
        {checked && <Check className="size-3 text-white stroke-3" />}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
