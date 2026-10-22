// src/Features/Dashboard/Components/KPICards.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import type { DeliverableProgress, Task } from "@/Types/task";
import {
  TrendingUp,
  FileCheck2,
  Clock,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export interface KPICardsProps {
  metrics: DeliverableProgress;
  tasks: Task[];
}

export const KPICards = memo<KPICardsProps>(({ metrics, tasks }) => {
  const activeTasks = tasks.filter((t) => t.status !== "DONE" && t.status !== "DRAFT");
  const draftApprovals = tasks.filter((t) => t.status === "DRAFT");
  const reworkTasks = tasks.filter((t) => t.rework || t.status === "DEVELOPMENT");

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* KPI 1 */}
      <Card className="p-4 border-slate-200 hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Progres Deliverable
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {formatPercent(metrics.progressPercentage)}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 block mt-1">
          {formatManHours(metrics.completedManHours)} / {formatManHours(metrics.totalEstimatedManHours)} Jam Selesai
        </span>
      </Card>

      {/* KPI 2 */}
      <Card className="p-4 border-slate-200 hover:border-indigo-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Tugas Aktif di Sprint
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 font-mono">
            {activeTasks.length}
          </span>
          <span className="text-xs text-slate-400 font-medium">Tugas</span>
        </div>
        <span className="text-[11px] text-slate-500 block mt-1">
          Sedang dalam pengerjaan & pengujian
        </span>
      </Card>

      {/* KPI 3 */}
      <Card className="p-4 border-slate-200 hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Antrean Dual-Approval
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 grid place-items-center">
            <ShieldAlert className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-amber-600 font-mono">
            {draftApprovals.length}
          </span>
          <span className="text-xs text-slate-400 font-medium">Draft</span>
        </div>
        <span className="text-[11px] text-slate-500 block mt-1">
          Menunggu persetujuan TL & PM
        </span>
      </Card>

      {/* KPI 4 */}
      <Card className="p-4 border-slate-200 hover:border-rose-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Tugas Rework / Bug
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 grid place-items-center">
            <RotateCcw className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-rose-600 font-mono">
            {tasks.filter((t) => t.rework).length}
          </span>
          <span className="text-xs text-slate-400 font-medium">Tugas</span>
        </div>
        <span className="text-[11px] text-slate-500 block mt-1">
          Otomasi pembalikan alur rework (Q-05)
        </span>
      </Card>
    </div>
  );
});

KPICards.displayName = "KPICards";
export default KPICards;
