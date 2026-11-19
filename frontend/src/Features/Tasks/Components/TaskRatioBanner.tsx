// src/Features/Tasks/Components/TaskRatioBanner.tsx
import React, { memo } from "react";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Progress } from "@/Components/Elements/Progress";

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
      <Card size="md" padding="relaxed" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground tracking-wide">
              PROGRES DELIVERABLE PROYEK
            </span>
            <Badge variant="primary" size="sm">
              AKTIF
            </Badge>
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
          <Progress value={progressPercentage} height="h-2" tone="primary" animatedShine={false} />
          <div className="text-right text-xs text-muted-foreground font-medium">
            {completedTasks} / {totalTasks} tugas Done
          </div>
        </div>
      </Card>
    );
  },
);

TaskRatioBanner.displayName = "TaskRatioBanner";
export default TaskRatioBanner;
