// src/Features/Kanban/Components/KanbanCard.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { cn } from "@/Utils/cn";
import { formatManHours, formatDate } from "@/Utils/formatters";
import type { Task, TaskStatus } from "@/Types/task";
import { Clock, User, ArrowRight, CheckCircle2 } from "lucide-react";

export interface KanbanCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onAdvance: (task: Task, nextStatus: TaskStatus) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

const nextStageMap: Record<TaskStatus, TaskStatus | null> = {
  DRAFT: "RELEASED",
  RELEASED: "DEVELOPMENT",
  DEVELOPMENT: "CODE_REVIEW",
  CODE_REVIEW: "TESTING",
  TESTING: "DONE",
  DONE: null,
};

const stageActionLabels: Record<TaskStatus, string> = {
  DRAFT: "Setujui Rilis",
  RELEASED: "Mulai Dev",
  DEVELOPMENT: "Ajukan Review",
  CODE_REVIEW: "Uji QA",
  TESTING: "Sign-Off Done",
  DONE: "Selesai",
};

export const KanbanCard = memo<KanbanCardProps>(({ task, onSelect, onAdvance, onDragStart }) => {
  const nextStatus = nextStageMap[task.status];
  const actionLabel = stageActionLabels[task.status];

  // Determine if task has been reworked
  const hasRework =
    task.rework ||
    Boolean(task.reviewLogs?.some((l) => l.result === "REJECTED" && task.status === "DEVELOPMENT"));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onClick={() => onSelect(task)}
      className={`group relative rounded-xl border p-3 bg-card shadow-2xs hover:shadow-md transition-all cursor-pointer select-none ${
        hasRework
          ? "border-destructive-subtle-border ring-1 ring-destructive-subtle-border bg-destructive-subtle/20"
          : "border-border hover:border-primary/50"
      }`}
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold text-primary-subtle-foreground bg-primary-subtle border border-primary-subtle-border px-1.5 py-0.2 rounded">
            {task.task_code}
          </span>
          <Badge variant={task.complexity_weight as any} size="sm">
            {task.complexity_weight}
          </Badge>
        </div>

        {hasRework && (
          <Badge variant="REWORK" size="sm">
            REWORK
          </Badge>
        )}
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
        {task.title}
      </h4>

      {/* Bottom Info Row */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/70">
        <span className="flex items-center gap-1 font-mono font-bold text-foreground">
          <Clock className="size-3 text-muted-foreground" />
          {formatManHours(task.estimated_man_hours)}
        </span>

        <span className="flex items-center gap-1 truncate max-w-27.5">
          <User className="size-3 text-muted-foreground shrink-0" />
          <span className="truncate">{task.assignee_name || "Belum Ada"}</span>
        </span>
      </div>

      {/* Quick Advance Button on hover/display */}
      {nextStatus && (
        <div className="mt-2.5 pt-2 border-t border-border/70 flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground">
            Jatuh Tempo: {formatDate(task.target_deadline)}
          </span>
          <Button
            size="sm"
            variant={task.status === "TESTING" ? "success" : "ghost"}
            className={cn(
              "h-6 text-[10px] px-2 font-bold transition-all",
              task.status === "TESTING"
                ? "text-white hover:text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                : "text-primary hover:bg-primary-subtle",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(task, nextStatus);
            }}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="size-3 ml-1" />
          </Button>
        </div>
      )}

      {task.status === "DONE" && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Disahkan TL (DoD Lolos)
          </span>
          <span className="font-mono text-[9px] text-slate-400">100% Selesai</span>
        </div>
      )}
    </div>
  );
});

KanbanCard.displayName = "KanbanCard";
export default KanbanCard;
