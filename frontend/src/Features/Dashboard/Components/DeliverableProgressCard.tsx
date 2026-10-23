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
    <Card className="p-4 bg-gradient-to-r from-card via-card to-primary-subtle/40 border-primary-subtle-border shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary grid place-items-center shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground">
                Mesin Kalkulasi Progres Deliverable
              </span>
              <span className="text-[10px] font-mono font-bold bg-primary-subtle text-primary-subtle-foreground px-2 py-0.2 rounded border border-primary-subtle-border">
                Formula Q-03 / API-K04-01
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
              Rasio jam kerja riil: <b>{formatManHours(metrics.completedManHours)}</b> selesai dari
              total <b>{formatManHours(metrics.totalEstimatedManHours)}</b> deliverable
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-2xl font-black text-primary font-mono tracking-tight">
            {formatPercent(metrics.progressPercentage)}
          </span>
          <span className="block text-[9px] text-muted-foreground font-medium">
            Deliverable Selesai
          </span>
        </div>
      </div>

      <Progress
        value={metrics.progressPercentage}
        tone="indigo"
        showLabel
        height="h-5"
        className="my-2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
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
