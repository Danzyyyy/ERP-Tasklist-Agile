import { ReactNode } from "react";

interface PageTitleProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

export default function PageTitle({ eyebrow, title, description, action }: PageTitleProps) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <p className="text-[8px] text-blue-600 tracking-[0.13em] font-extrabold uppercase m-0 mb-1.5 [&>span]:text-slate-400">
          {eyebrow}
        </p>
        <h1 className="text-[23px] font-extrabold tracking-[-0.035em] text-slate-900 leading-tight m-0">
          {title}
        </h1>
        <div className="text-slate-500 text-[10px] mt-1.5 leading-normal">{description}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
