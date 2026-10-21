import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: string;
  dot?: boolean;
}

export default function Badge({ children, tone = "neutral", dot = false }: BadgeProps) {
  const toneMap: Record<string, string> = {
    neutral: "text-slate-600 bg-slate-100 border-slate-200",
    low: "text-slate-600 bg-slate-100 border-slate-200",
    amber: "text-amber-800 bg-amber-50 border-amber-200",
    medium: "text-amber-800 bg-amber-50 border-amber-200",
    red: "text-rose-700 bg-rose-50 border-rose-200",
    high: "text-rose-700 bg-rose-50 border-rose-200",
    indigo: "text-indigo-700 bg-indigo-50 border-indigo-200",
    blue: "text-blue-700 bg-blue-50 border-blue-200",
    purple: "text-purple-700 bg-purple-50 border-purple-200",
    cyan: "text-cyan-800 bg-cyan-50 border-cyan-200",
    green: "text-emerald-700 bg-emerald-50 border-emerald-200",
  };

  const currentToneClass = toneMap[tone.toLowerCase()] || toneMap.neutral;

  return (
    <span
      className={`min-h-[19px] w-fit px-1.5 py-0.5 rounded-[4px] inline-flex items-center gap-1 text-[8px] font-extrabold tracking-wider uppercase whitespace-nowrap border ${currentToneClass}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  );
}
