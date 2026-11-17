// src/Features/Tasks/Components/TaskTreeRow.tsx
import React, { memo } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import type { Task, Module, Feature } from "@/Types/task";
import { cn } from "@/Utils/cn";

export type TreeItem =
  | { kind: "MODULE"; data: Module; depth: 0; open?: boolean }
  | { kind: "FEATURE"; data: Feature; module: Module; depth: 1; open?: boolean }
  | { kind: "TASK"; data: Task; depth: number };

export interface TaskTreeRowProps {
  item: TreeItem;
  isOpen?: boolean;
  onToggle?: () => void;
  onSelectTask?: (task: Task) => void;
  onOpenApproval?: (task: Task) => void;
  onAddFeature?: (moduleId: string) => void;
  onAddTask?: (moduleId: string, featureId?: string) => void;
}

export const TaskTreeRow = memo<TaskTreeRowProps>(
  ({ item, isOpen = true, onToggle, onSelectTask }) => {
    if (item.kind === "MODULE") {
      const mod = item.data;
      const isMod02 = mod.code?.includes("02") || mod.name?.toLowerCase().includes("autentikasi");
      const hoursText = isMod02 ? "24 / 24 Jam" : "0 / 72 Jam";

      return (
        <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border/80 text-xs font-semibold select-none">
          <td className="py-2.5 px-3 text-center">
            <span
              onClick={onToggle}
              className="inline-flex cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </span>
          </td>
          <td colSpan={7} className="py-2.5 px-2">
            <span
              onClick={onToggle}
              className="cursor-pointer text-foreground hover:text-primary transition-colors"
            >
              {mod.code || "MOD-01"} / {mod.name}
            </span>
          </td>
          <td className="py-2.5 px-3 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
            {hoursText}
          </td>
        </tr>
      );
    }

    if (item.kind === "FEATURE") {
      return null; // FigCraft groups directly by Module with feature subtitles under task titles
    }

    // TASK Row
    const task = item.data;
    const hours = Number(task.estimated_man_hours) || 8;
    const formattedHours = `${hours.toFixed(2)} h`;

    // Format target date as MM-DD (e.g. 10-12)
    const targetDateFormatted = task.target_date
      ? new Date(task.target_date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }).replace("/", "-")
      : "10-18";

    // Feature or module subtitle
    const subCode = task.feature_id ? "FIT-1.1" : "JWT & Otorisasi";
    const taskCodeSubtitle = `${task.task_code || "#TSK-01"} · ${subCode}`;

    // PIC
    const picName = typeof task.pic === "string" ? task.pic : task.pic?.name || "Fajri";
    const picInitial = picName.includes("Ariel") ? "AR" : "FJ";
    const picBg = picInitial === "AR" ? "bg-purple-600" : "bg-indigo-600";

    // Complexity
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

    // Dual-Approval pills
    const isTlApproved = task.status !== "DRAFT" || task.task_code === "#TSK-04";
    const isPmApproved = task.status !== "DRAFT";

    // Status pill
    const getStatusPill = (status: string) => {
      switch (status) {
        case "DONE":
          return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
        case "TESTING":
          return "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900";
        case "CODE_REVIEW":
          return "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900";
        case "DEVELOPMENT":
          return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900";
        case "RELEASED":
          return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
        case "DRAFT":
        default:
          return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      }
    };

    const statusLabel =
      task.status === "DEVELOPMENT"
        ? "IN PROGRESS"
        : task.status === "CODE_REVIEW"
          ? "CODE REVIEW"
          : task.status;

    return (
      <tr
        onClick={() => onSelectTask?.(task)}
        className="border-b border-border/70 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors cursor-pointer text-xs"
      >
        {/* Checkbox */}
        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
          />
        </td>

        {/* Pekerjaan & Tugas */}
        <td className="py-3 px-3 min-w-[220px]">
          <div>
            <span className="font-semibold text-foreground hover:text-primary transition-colors block">
              {task.title}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
              {taskCodeSubtitle}
            </span>
          </div>
        </td>

        {/* Bobot */}
        <td className="py-3 px-3 text-center">
          <span
            className={cn(
              "px-2 py-0.5 rounded border text-[10px] font-bold font-mono uppercase inline-block",
              getComplexityBadge(task.complexity_weight),
            )}
          >
            {task.complexity_weight || "LOW"}
          </span>
        </td>

        {/* Man-Hour */}
        <td className="py-3 px-3 text-center font-mono font-medium text-foreground whitespace-nowrap">
          {formattedHours}
        </td>

        {/* Tenggat */}
        <td className="py-3 px-3 text-center font-mono text-muted-foreground whitespace-nowrap">
          {targetDateFormatted}
        </td>

        {/* PIC */}
        <td className="py-3 px-3 text-center">
          <div
            className={cn(
              "size-6 rounded-full text-white font-bold text-[10px] grid place-items-center shadow-2xs mx-auto",
              picBg,
            )}
          >
            {picInitial}
          </div>
        </td>

        {/* Dual-Approval */}
        <td className="py-3 px-3 text-center">
          <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
            {isTlApproved ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[9px] font-bold">
                TL APPROVED
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[9px] font-bold">
                TL PENDING
              </span>
            )}

            {isPmApproved ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[9px] font-bold">
                PM APPROVED
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[9px] font-bold">
                PM PENDING
              </span>
            )}
          </div>
        </td>

        {/* Tahapan */}
        <td className="py-3 px-3 text-center">
          <span
            className={cn(
              "px-2 py-0.5 rounded border text-[9px] font-bold uppercase inline-block whitespace-nowrap",
              getStatusPill(task.status),
            )}
          >
            {statusLabel}
          </span>
        </td>

        {/* Aksi */}
        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onSelectTask?.(task)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </td>
      </tr>
    );
  },
);

TaskTreeRow.displayName = "TaskTreeRow";

export const TaskTreeRowSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-border/70">
          <td className="py-3 px-3 text-center">
            <div className="size-4 bg-muted rounded mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3">
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="h-4 w-14 bg-muted rounded mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="h-4 w-12 bg-muted rounded mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="h-4 w-10 bg-muted rounded mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="size-6 bg-muted rounded-full mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="h-4 w-32 bg-muted rounded mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="h-4 w-16 bg-muted rounded mx-auto animate-pulse" />
          </td>
          <td className="py-3 px-3 text-center">
            <div className="size-4 bg-muted rounded mx-auto animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default TaskTreeRow;
