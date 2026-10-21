import Icon from "./Icon";

interface ApprovalProps {
  value: string;
}

export default function Approval({ value }: ApprovalProps) {
  if (value === "approved") {
    return (
      <div className="flex items-center gap-1">
        <span className="min-w-[34px] h-5 rounded-[4px] flex items-center justify-center gap-0.5 text-[8px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200">
          <Icon name="check" size={11} /> TL
        </span>
        <span className="min-w-[34px] h-5 rounded-[4px] flex items-center justify-center gap-0.5 text-[8px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200">
          <Icon name="check" size={11} /> PM
        </span>
      </div>
    );
  }

  if (value === "tl") {
    return (
      <div className="flex items-center gap-1">
        <span className="min-w-[34px] h-5 rounded-[4px] flex items-center justify-center gap-0.5 text-[8px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200">
          <Icon name="check" size={11} /> TL
        </span>
        <span className="min-w-[34px] h-5 rounded-[4px] flex items-center justify-center gap-0.5 text-[8px] font-extrabold text-slate-400 bg-slate-50 border border-dashed border-slate-300">
          PM
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="min-w-[34px] h-5 rounded-[4px] flex items-center justify-center gap-0.5 text-[8px] font-extrabold text-slate-400 bg-slate-50 border border-dashed border-slate-300">
        TL
      </span>
      <span className="min-w-[34px] h-5 rounded-[4px] flex items-center justify-center gap-0.5 text-[8px] font-extrabold text-slate-400 bg-slate-50 border border-dashed border-slate-300">
        PM
      </span>
    </div>
  );
}
