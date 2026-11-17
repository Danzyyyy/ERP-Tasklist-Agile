// src/Features/Tasks/Components/TaskRatioBanner.tsx
import React, { memo } from "react";
import { formatPercent, formatManHours } from "@/Utils/formatters";

export interface TaskRatioBannerProps {
  doneHours: number;
  totalEstimatedHours: number;
  progressPercentage: number;
  completedTasks?: number;
  totalTasks?: number;
  onRefresh?: () => void;
}

export const TaskRatioBanner = memo<TaskRatioBannerProps>(
  ({ doneHours, totalEstimatedHours, progressPercentage, completedTasks = 0, totalTasks = 0 }) => {
    const percent = formatPercent(progressPercentage);
    const doneH = formatManHours(doneHours);
    const totalH = formatManHours(totalEstimatedHours);

    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground tracking-wide">
              DELIVERABLE PROGRESS · FTR-K04-07
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
              AKTIF
            </span>
          </div>

          <div className="text-2xl font-black text-primary font-mono sm:text-right">
            {percent}%
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          {doneH} / {totalH} Jam Man-Hour Selesai
        </div>

        {/* Progress Bar & Subtitle */}
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-right text-xs text-muted-foreground font-medium">
            {completedTasks} / {totalTasks} tugas Done
          </div>
        </div>
      </div>
    );
  },
);

TaskRatioBanner.displayName = "TaskRatioBanner";
export default TaskRatioBanner;
