import { ReactNode } from "react";
import Icon from "./Icon";

interface SelectFieldProps {
  label?: string;
  value?: string;
  children?: ReactNode;
  optional?: boolean;
  className?: string;
}

export default function SelectField({
  label,
  value,
  children,
  optional,
  className = "",
}: SelectFieldProps) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label && (
        <span className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
          {label}
          {optional && (
            <em className="text-[8px] text-slate-400 font-normal not-italic">Opsional</em>
          )}
        </span>
      )}
      <span className="h-8 bg-white border border-slate-200 rounded-md flex items-center justify-between px-2.5 text-slate-600 text-[10px] font-medium shadow-xs hover:border-slate-300 transition-colors cursor-pointer select-none">
        <span>{children || value}</span>
        <span className="rotate-90 text-slate-400 flex items-center shrink-0">
          <Icon name="chevron" size={14} />
        </span>
      </span>
    </label>
  );
}
