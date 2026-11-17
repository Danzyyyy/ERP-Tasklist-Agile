// src/Components/Elements/Checkbox.tsx
// Anaheim Design Kit — Specimen 03: Checkbox, Radio & Switch (FigCraft 1:1 Implementation)
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
  ref?: React.Ref<HTMLInputElement>;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked,
  onChange,
  onCheckedChange,
  disabled,
  ref,
  ...props
}) => {
  return (
    <label
      className={cn(
        "relative inline-flex items-center justify-center size-[18px] rounded-sm border border-[#cbd5e1] bg-card transition-all duration-150 cursor-pointer select-none shrink-0",
        checked
          ? "bg-primary border-primary text-primary-foreground shadow-2xs"
          : "hover:border-primary",
        disabled && "cursor-not-allowed opacity-50 bg-muted border-border",
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
};

Checkbox.displayName = "Checkbox";
export default Checkbox;
