// src/Features/Dashboard/Components/PriorityTasksCard.tsx
import React, { memo } from "react";
import { Avatar, AvatarFallback } from "@/Components/Elements/Avatar";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { getInitials, getAvatarTone } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";
import type { PriorityTaskItem } from "../Hooks/useDashboardMetrics";

export interface PriorityTasksCardProps {
  tasks: PriorityTaskItem[];
  activeCount: number;
  onViewAll: () => void;
  onTaskClick: (task: PriorityTaskItem) => void;
}

export const PriorityTasksCard = memo<PriorityTasksCardProps>(({ tasks, activeCount, onViewAll, onTaskClick }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-foreground">Tugas Prioritas</h3>
          <Badge variant="primary" size="sm" mono>
            {String(activeCount).padStart(2, "0")}
          </Badge>
        </div>
        <Button type="button" variant="link" onClick={onViewAll} className="gap-1">
          Lihat semua tugas ↗
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {tasks.map((t) => {
          const picName = typeof t.pic === "string" ? t.pic : t.pic?.name || t.assignee_name || "Belum Ditugaskan";
          const initials = getInitials(picName);
          const isOverdue = t.isOverdue;

          const stageText =
            t.status === "DRAFT"
              ? "Menunggu approval"
              : t.status === "DEVELOPMENT"
                ? "In progress"
                : t.status === "CODE_REVIEW"
                  ? "Code review"
                  : t.status === "TESTING"
                    ? "QA Testing"
                    : t.status === "DONE"
                      ? "Selesai (Done)"
                      : "Siap dikerjakan →";

          return (
            <Card
              key={t.id}
              size="md"
              interactive="primary"
              onClick={() => onTaskClick(t)}
              className="space-y-3 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">{t.task_code || "#TSK"}</span>
                  {isOverdue ? (
                    <Badge variant="destructive" size="sm">
                      OVERDUE
                    </Badge>
                  ) : t.target_deadline ? (
                    <span className="text-[11px] text-muted-foreground">{t.target_deadline.split("T")[0]}</span>
                  ) : null}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1" title={t.title}>
                    {t.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.module?.name || t.feature?.name || "Modul Proyek"}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={t.complexity_weight || "MEDIUM"} size="sm">
                    {t.complexity_weight || "MEDIUM"}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">{t.estimated_man_hours} Jam</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <Avatar size="xs" borderless>
                  <AvatarFallback appearance="solid" tone={getAvatarTone(initials)}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "text-xs font-medium",
                    t.status === "DRAFT" && "text-warning-subtle-foreground",
                    t.status === "DEVELOPMENT" && "text-status-dev-text",
                    t.status === "CODE_REVIEW" && "text-status-review-text",
                    t.status === "TESTING" && "text-status-testing-text",
                    t.status === "DONE" && "text-status-done-text",
                    !["DRAFT", "DEVELOPMENT", "CODE_REVIEW", "TESTING", "DONE"].includes(t.status) && "text-muted-foreground",
                  )}
                >
                  {stageText}
                </span>
              </div>
            </Card>
          );
        })}

        {tasks.length === 0 && (
          <Card size="md" padding="lg" dashed className="col-span-3 space-y-1">
            <p className="text-xs font-semibold text-foreground text-center">Belum ada tugas aktif</p>
            <p className="text-[11px] text-muted-foreground text-center">Seluruh tugas telah diselesaikan atau belum dibuat.</p>
          </Card>
        )}
      </div>
    </div>
  );
});

PriorityTasksCard.displayName = "PriorityTasksCard";

// Companion Skeleton (CLS = 0)
export const PriorityTasksCardSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} size="md" className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="pt-2 border-t border-border flex justify-between items-center">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
