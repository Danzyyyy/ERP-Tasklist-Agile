// src/Features/Dashboard/Components/RecentTasksCard.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { formatManHours } from "@/Utils/formatters";
import type { Task } from "@/Types/task";
import { History } from "lucide-react";

export interface RecentTasksCardProps {
  recentTasks: Task[];
  hasTasks: boolean;
  onGoToTasks: () => void;
}

export const RecentTasksCard = memo<RecentTasksCardProps>(
  ({ recentTasks, hasTasks, onGoToTasks }) => {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <History className="size-4 text-muted-foreground" />
            <span>Tugas Terbaru Dalam Siklus Eksekusi</span>
          </h3>
          <Button type="button" variant="link" onClick={onGoToTasks}>
            Kelola Semua &rarr;
          </Button>
        </div>

        <div className="space-y-2">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={onGoToTasks}
              className="p-2.5 rounded-lg border border-border hover:border-primary-subtle-border hover:bg-primary-subtle/30 transition-all flex items-center justify-between gap-3 text-xs cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="primary" size="sm" shape="rounded" mono>
                  {task.task_code}
                </Badge>
                <span className="font-medium text-foreground truncate">{task.title}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={task.status} size="sm">
                  {task.status}
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {formatManHours(task.estimated_man_hours)}
                </span>
              </div>
            </div>
          ))}

          {!hasTasks && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Belum ada data tugas. Klik "Muat Data Demonstrasi" untuk melihat simulasi lengkap.
            </div>
          )}
        </div>
      </Card>
    );
  },
);

RecentTasksCard.displayName = "RecentTasksCard";

export function RecentTasksCardSkeleton() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg border border-border flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentTasksCard;

