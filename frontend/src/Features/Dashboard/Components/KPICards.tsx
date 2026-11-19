// src/Features/Dashboard/Components/KPICards.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import type { DeliverableProgress } from "@/Types/task";
import { TrendingUp, Clock, ShieldAlert, RotateCcw } from "lucide-react";

export interface KPICardsProps {
  metrics: DeliverableProgress;
  sprintActiveCount?: number;
  draftCount?: number;
  reworkCount?: number;
}

export const KPICards = memo<KPICardsProps>(({ metrics, sprintActiveCount = 0, draftCount = 0, reworkCount = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* KPI 1 */}
      <Card interactive="primary">
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
          {formatManHours(metrics.completedManHours)} /{" "}
          {formatManHours(metrics.totalEstimatedManHours)} Jam Selesai
        </span>
      </Card>

      {/* KPI 2 */}
      <Card interactive="primary">
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
            {sprintActiveCount}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Tugas</span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          Sedang dalam pengerjaan & pengujian
        </span>
      </Card>

      {/* KPI 3 */}
      <Card interactive="warning">
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
            {draftCount}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Draft</span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          Menunggu persetujuan TL & PM
        </span>
      </Card>

      {/* KPI 4 */}
      <Card interactive="destructive">
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
            {reworkCount}
          </span>
          <span className="text-xs text-muted-foreground font-medium">Tugas</span>
        </div>
        <span className="text-[11px] text-muted-foreground block mt-1">
          Otomasi pengembalian alur revisi
        </span>
      </Card>
    </div>
  );
});

KPICards.displayName = "KPICards";

// SKELETON COMPANION: Dimensi & Grid Identik (CLS = 0)
export const KPICardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Card key={idx}>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-20 my-1" />
          <Skeleton className="h-3 w-36 mt-1" />
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
