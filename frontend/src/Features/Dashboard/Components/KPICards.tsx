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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* KPI 1 */}
      <Card className="p-4 border-border hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Progres Deliverable
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary grid place-items-center">
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-foreground font-mono">
            {formatPercent(metrics.progressPercentage)}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          {formatManHours(metrics.completedManHours)} / {formatManHours(metrics.totalEstimatedManHours)} Jam Selesai
        </span>
      </Card>

      {/* KPI 2 */}
      <Card className="p-4 border-border hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Tugas Aktif di Sprint
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary grid place-items-center">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-foreground font-mono">
            {activeTasks.length}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Tugas</span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          Sedang dalam pengerjaan & pengujian
        </span>
      </Card>

      {/* KPI 3 */}
      <Card className="p-4 border-border hover:border-warning/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Antrean Dual-Approval
          </span>
          <div className="w-8 h-8 rounded-lg bg-warning-subtle text-warning-subtle-foreground grid place-items-center">
            <ShieldAlert className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-warning-subtle-foreground font-mono">
            {draftApprovals.length}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Draft</span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          Menunggu persetujuan TL & PM
        </span>
      </Card>

      {/* KPI 4 */}
      <Card className="p-4 border-border hover:border-destructive/50 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Tugas Rework / Bug
          </span>
          <div className="w-8 h-8 rounded-lg bg-destructive-subtle text-destructive-subtle-foreground grid place-items-center">
            <RotateCcw className="size-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-destructive-subtle-foreground font-mono">
            {tasks.filter((t) => t.rework).length}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Tugas</span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          Otomasi pembalikan alur rework (Q-05)
        </span>
      </Card>
    </div>
  );
});

KPICards.displayName = "KPICards";
export default KPICards;
