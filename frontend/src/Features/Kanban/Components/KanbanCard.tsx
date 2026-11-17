// src/Features/Kanban/Components/KanbanCard.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { canRoleDragKanbanCard, getInitials, getAvatarBg } from "@/Utils/taskUtils";
import type { Task, TaskStatus } from "@/Types/task";
import type { UserRole } from "@/Types/auth";
import { MoreHorizontal } from "lucide-react";

export interface KanbanCardProps {
  task: Task;
  userRole?: UserRole | null;
  onSelect: (task: Task) => void;
  onAdvance: (task: Task, nextStatus: TaskStatus) => void;
  onAssign?: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragEnd?: () => void;
}

export const KanbanCard = memo<KanbanCardProps>(
  ({ task, userRole, onSelect, onDragStart, onDragEnd }) => {
    const isDraggable = canRoleDragKanbanCard(userRole, task.status);

    const picName = task.assignee_name || (typeof task.pic === "string" ? task.pic : task.pic?.name) || "Belum Ditugaskan";
    const picInitials = getInitials(picName);
    const picBg = getAvatarBg(picInitials);

    const hours = Number(task.estimated_man_hours) || 8;
    const moduleName = task.module?.title || "Manajemen Rekening";
    const dateFormatted = task.target_date
      ? new Date(task.target_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      : "18 Okt";

    return (
      <div
        draggable={isDraggable}
        onDragStart={(e) => {
          if (!isDraggable) {
            e.preventDefault();
            return;
          }
          onDragStart?.(e, task);
        }}
        onDragEnd={() => onDragEnd?.()}
        onClick={() => onSelect(task)}
        className={cn(
          "group rounded-xl border border-border bg-card p-3 space-y-2 shadow-2xs hover:shadow-md hover:border-primary/50 transition-all select-none",
          isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        )}
      >
        {/* Header Row: Task Code & Menu dots */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono text-xs">{task.task_code || "#TSK-01"}</span>
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(task);
            }}
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        {/* Title & Module */}
        <div>
          <h4 className="text-sm font-bold text-foreground line-clamp-1">
            {task.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {moduleName}
          </p>
        </div>

        {/* Complexity, Man-hour & PIC Avatar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <Badge variant={task.complexity_weight || "MEDIUM"} size="sm">
              {task.complexity_weight || "MEDIUM"}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              {hours}h
            </span>
          </div>

          <div
            className={cn(
              "size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs shrink-0",
              picBg,
            )}
          >
            {picInitials}
          </div>
        </div>

        {/* Footer Row: Date & Status Tag / Action */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">
            {dateFormatted}
          </span>

          {task.status === "DONE" ? (
            <span className="font-bold text-success">
              ✓ DISAHKAN
            </span>
          ) : task.status === "TESTING" ? (
            <span className="font-bold text-warning">
              3/4 PM CHECK
            </span>
          ) : (
            <span className="font-semibold text-primary hover:underline flex items-center gap-0.5">
              → Detail
            </span>
          )}
        </div>
      </div>
    );
  },
);

KanbanCard.displayName = "KanbanCard";
export default KanbanCard;
