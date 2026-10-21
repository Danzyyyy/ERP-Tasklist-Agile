import { ReactNode } from "react";
import Icon from "./Icon";
import { ButtonVariant, IconName } from "../../types";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  icon,
  disabled,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "text-white bg-blue-600 border-transparent shadow-[0_4px_10px_rgba(37,99,235,0.18)] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-white text-slate-700 border-slate-300 shadow-sm hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900",
    danger: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300",
    ghost:
      "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900",
  };

  return (
    <button
      className={`h-9 rounded-[7px] border px-3.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all duration-150 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400 disabled:bg-slate-100 disabled:border-slate-200 disabled:shadow-none disabled:transform-none ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon && <Icon name={icon} size={16} />}
      <span className="flex items-center gap-1.5">{children}</span>
    </button>
  );
}
