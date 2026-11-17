// src/Features/Dashboard/Components/PriorityTasksCard.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { getInitials, getAvatarBg } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";
import type { PriorityTaskItem } from "../Hooks/useDashboardMetrics";

export interface PriorityTasksCardProps {
  tasks: PriorityTaskItem[];
  activeCount: number;
  onViewAll: () => void;
  onTaskClick: (task: PriorityTaskItem) => void;
}

export const PriorityTasksCard = memo<PriorityTasksCardProps>(
  ({ tasks, activeCount, onViewAll, onTaskClick }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Tugas Prioritas</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary-subtle-border text-xs font-bold font-mono">
              {String(activeCount).padStart(2, "0")}
            </span>
          </div>
          <Button
            type="button"
            variant="link"
            onClick={onViewAll}
            className="text-xs font-semibold text-primary p-0 h-auto gap-1"
          >
            Lihat semua tugas ↗
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {tasks.map((t) => {
            const picName =
              typeof t.pic === "string"
                ? t.pic
                : t.pic?.name || t.assignee_name || "Belum Ditugaskan";
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
              <div
                key={t.id}
                onClick={() => onTaskClick(t)}
                className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">{t.task_code || "#TSK"}</span>
                    {isOverdue ? (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.2">
                        OVERDUE
                      </Badge>
                    ) : t.target_deadline ? (
                      <span className="text-[11px] text-muted-foreground">
                        {t.target_deadline.split("T")[0]}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h4
                      className="text-sm font-bold text-foreground line-clamp-1"
                      title={t.title}
                    >
                      {t.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {t.module?.name || t.feature?.name || "Modul Proyek"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-1.5 py-0.2 text-[10px] font-bold",
                        t.complexity_weight === "HIGH" &&
                          "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-subtle-border",
                        t.complexity_weight === "MEDIUM" &&
                          "bg-warning-subtle text-warning-subtle-foreground border-warning-subtle-border",
                        t.complexity_weight === "LOW" &&
                          "bg-success-subtle text-success-subtle-foreground border-success-subtle-border",
                      )}
                    >
                      {t.complexity_weight || "MEDIUM"}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      {t.estimated_man_hours} Jam
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <div
                    className={cn(
                      "size-6 rounded-full font-bold text-[10px] grid place-items-center",
                      getAvatarBg(initials),
                    )}
                  >
                    {initials}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      t.status === "DRAFT" && "text-warning-subtle-foreground",
                      t.status === "DEVELOPMENT" && "text-status-dev-text",
                      t.status === "CODE_REVIEW" && "text-status-review-text",
                      t.status === "TESTING" && "text-status-testing-text",
                      t.status === "DONE" && "text-status-done-text",
                      !["DRAFT", "DEVELOPMENT", "CODE_REVIEW", "TESTING", "DONE"].includes(
                        t.status,
                      ) && "text-muted-foreground",
                    )}
                  >
                    {stageText}
                  </span>
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="col-span-3 p-6 rounded-xl border border-dashed border-border bg-card text-center space-y-1">
              <p className="text-xs font-semibold text-foreground">Belum ada tugas aktif</p>
              <p className="text-[11px] text-muted-foreground">
                Seluruh tugas telah diselesaikan atau belum dibuat.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

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
          <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
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
          </div>
        ))}
      </div>
    </div>
  );
};
