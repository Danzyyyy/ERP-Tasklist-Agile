// src/Features/Kanban/Components/KanbanCard.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";
import { canRoleDragKanbanCard } from "@/Utils/taskUtils";
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

    const getComplexityBadge = (c: string) => {
      switch (c) {
        case "HIGH":
          return "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900";
        case "MEDIUM":
          return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900";
        case "LOW":
        default:
          return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      }
    };

    const getPicInitials = (pic?: { name: string } | string | null) => {
      if (!pic) return "FJ";
      const name = typeof pic === "string" ? pic : pic.name;
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    };

    const picInitials = getPicInitials(task.pic);
    const picBg = picInitials === "AR" ? "bg-purple-600" : "bg-indigo-600";

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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(task);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
          </button>
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
            <span
              className={cn(
                "px-1.5 py-0.5 rounded border text-[10px] font-bold font-mono uppercase",
                getComplexityBadge(task.complexity_weight),
              )}
            >
              {task.complexity_weight || "MEDIUM"}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {hours}h
            </span>
          </div>

          <div
            className={cn(
              "size-6 rounded-full text-white font-bold text-[10px] grid place-items-center shadow-2xs shrink-0",
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
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ✓ DISAHKAN
            </span>
          ) : task.status === "TESTING" ? (
            <span className="font-bold text-amber-600 dark:text-amber-400">
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
