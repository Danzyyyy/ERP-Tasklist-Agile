// src/Features/Dashboard/Components/SprintSummaryCard.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Separator } from "@/Components/Elements/Separator";
import type { DeliverableProgress, TaskStatus } from "@/Types/task";
import { formatPercent, formatManHours } from "@/Utils/formatters";

export interface SprintSummaryCardProps {
  metrics: DeliverableProgress;
  stageStats: Record<TaskStatus, number>;
  donutMetrics: {
    radius: number;
    circumference: number;
    strokeDashoffset: number;
  };
}

export const SprintSummaryCard = memo<SprintSummaryCardProps>(
  ({
    metrics,
    stageStats,
    donutMetrics,
  }) => {
    const percent = formatPercent(metrics.progressPercentage);
    const completedHours = formatManHours(metrics.completedManHours);
    const totalHours = formatManHours(metrics.totalEstimatedManHours);

    return (
      <Card size="md" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Ringkasan Sprint</h3>
          <Badge variant="success" size="sm">
            LIVE
          </Badge>
        </div>

        {/* Donut and Man-hour Summary */}
        <div className="flex items-center gap-4 py-1">
          {/* SVG Circular Donut */}
          <div className="relative size-24 shrink-0 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={donutMetrics.radius}
                className="stroke-muted"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={donutMetrics.radius}
                className="stroke-primary transition-all duration-500 ease-out"
                strokeWidth="8"
                strokeDasharray={donutMetrics.circumference}
                strokeDashoffset={donutMetrics.strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-foreground leading-tight">{percent}%</span>
              <span className="text-[8px] uppercase font-bold tracking-wider text-muted-foreground leading-tight">
                DELIVERABLE
              </span>
            </div>
          </div>

          {/* Man-hour Ratio Info */}
          <div className="min-w-0">
            <div className="text-2xl font-black text-foreground tracking-tight">
              {completedHours} / {totalHours}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Jam man-hour selesai</p>
            <p className="text-xs font-semibold text-foreground mt-1">
              {metrics.completedTasks} dari {metrics.totalTasks} tugas telah disahkan
            </p>
          </div>
        </div>

        <Separator />

        {/* Bottom Stage Counts */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-base font-extrabold text-status-dev-text font-mono mr-1.5">
              {String(stageStats.DEVELOPMENT).padStart(2, "0")}
            </span>
            <span className="text-muted-foreground font-medium">In progress</span>
          </div>
          <div>
            <span className="text-base font-extrabold text-warning-subtle-foreground font-mono mr-1.5">
              {String(stageStats.CODE_REVIEW + stageStats.TESTING + stageStats.DRAFT).padStart(
                2,
                "0",
              )}
            </span>
            <span className="text-muted-foreground font-medium">Review & Gate</span>
          </div>
        </div>
      </Card>
    );
  },
);

SprintSummaryCard.displayName = "SprintSummaryCard";
export default SprintSummaryCard;
