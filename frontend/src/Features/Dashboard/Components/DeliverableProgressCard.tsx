// src/Features/Dashboard/Components/DeliverableProgressCard.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Progress } from "@/Components/Elements/Progress";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import type { DeliverableProgress } from "@/Types/task";
import { Sparkles, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export interface DeliverableProgressCardProps {
  metrics: DeliverableProgress;
}

export const DeliverableProgressCard = memo<DeliverableProgressCardProps>(({ metrics }) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-white via-white to-blue-50/40 border-blue-200 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 grid place-items-center">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Mesin Kalkulasi Progres Deliverable
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.2 rounded border border-blue-200">
                Formula Q-03 / API-K04-01
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Rasio jam kerja riil:{" "}
              <b>{formatManHours(metrics.completedManHours)}</b> selesai dari total{" "}
              <b>{formatManHours(metrics.totalEstimatedManHours)}</b> deliverable
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-blue-600 font-mono tracking-tight">
            {formatPercent(metrics.progressPercentage)}
          </span>
          <span className="block text-[9px] text-slate-400 font-medium">Deliverable Selesai</span>
        </div>
      </div>

      <Progress
        value={metrics.progressPercentage}
        tone="indigo"
        showLabel
        height="h-5"
        className="my-2"
      />

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
        <span className="flex items-center gap-1 font-mono">
          <CheckCircle2 className="size-3 text-emerald-600" />
          Tugas Selesai: <b>{metrics.completedTasks}</b> / {metrics.totalTasks}
        </span>
        <span className="flex items-center gap-1 font-mono">
          <Clock className="size-3 text-blue-600" />
          Jam Kerja Aktual: <b>{formatManHours(metrics.actualManHoursSpent)}</b>
        </span>
        <span className="flex items-center gap-1 font-mono text-right justify-end">
          {metrics.tasksAtRiskOrOverdue > 0 ? (
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <AlertTriangle className="size-3 text-rose-500" />
              {metrics.tasksAtRiskOrOverdue} Tugas Berisiko / Terlambat
            </span>
          ) : (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              Sesuai Target Jadwal H-1
            </span>
          )}
        </span>
      </div>
    </Card>
  );
});

DeliverableProgressCard.displayName = "DeliverableProgressCard";
export default DeliverableProgressCard;
