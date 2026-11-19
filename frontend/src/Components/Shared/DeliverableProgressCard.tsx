// src/Components/Shared/DeliverableProgressCard.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { Progress } from "@/Components/Elements/Progress";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import type { DeliverableProgress } from "@/Types/task";
import { Sparkles, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export interface DeliverableProgressCardProps {
  metrics: DeliverableProgress;
}

export const DeliverableProgressCard = memo<DeliverableProgressCardProps>(({ metrics }) => {
  return (
    <Card surface="brandGradient">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary grid place-items-center shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground">
                Progres Deliverable Proyek
              </span>
              <Badge variant="primary" size="sm" shape="rounded" casing="normal" mono>
                Real-Time
              </Badge>
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
          <CheckCircle2 className="size-3 text-success" />
          Tugas Selesai: <b>{metrics.completedTasks}</b> / {metrics.totalTasks}
        </span>
        <span className="flex items-center gap-1 font-mono">
          <Clock className="size-3 text-primary" />
          Jam Kerja Aktual: <b>{formatManHours(metrics.actualManHoursSpent)}</b>
        </span>
        <span className="flex items-center gap-1 font-mono text-right justify-end">
          {metrics.tasksAtRiskOrOverdue > 0 ? (
            <span className="text-destructive font-bold flex items-center gap-1">
              <AlertTriangle className="size-3 text-destructive" />
              {metrics.tasksAtRiskOrOverdue} Tugas Berisiko / Terlambat
            </span>
          ) : (
            <span className="text-success font-medium flex items-center gap-1">
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

// SKELETON COMPANION: Dimensi & Grid Identik (CLS = 0)
export const DeliverableProgressCardSkeleton: React.FC = () => {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0 space-y-1">
          <Skeleton className="h-7 w-16 ml-auto" />
          <Skeleton className="h-2.5 w-24 ml-auto" />
        </div>
      </div>

      <Skeleton className="h-5 w-full rounded-md my-2" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3.5 w-40 ml-auto" />
      </div>
    </Card>
  );
};

export default DeliverableProgressCard;

