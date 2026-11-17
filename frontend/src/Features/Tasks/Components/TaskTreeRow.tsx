// src/Features/Tasks/Components/TaskTreeRow.tsx
import React, { memo } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal, Layers } from "lucide-react";
import type { Task, Module, Feature } from "@/Types/task";
import useGetModuleProgress from "@/Hooks/useGetModuleProgress";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { getInitials, getAvatarBg, calculateTasksProgress } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";

const ModuleHoursCell: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  const { data: progress, isLoading } = useGetModuleProgress(moduleId);
  if (isLoading) return <span className="text-muted-foreground font-mono">...</span>;
  if (!progress) return <span className="text-muted-foreground font-mono">-- Jam</span>;
  return (
    <span>
      {progress.completedManHours} / {progress.totalEstimatedManHours} Jam
    </span>
  );
};

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
    // 1. MODULE ROW
    if (item.kind === "MODULE") {
      const mod = item.data;
      const modTasks = mod.tasks || [];

      return (
        <tr className="bg-muted/50 border-b border-border text-xs font-semibold select-none group">
          <td className="py-2.5 px-3 text-center">
            <span
              onClick={onToggle}
              className="inline-flex cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              title={isOpen ? "Tutup Modul" : "Buka Modul"}
            >
              {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </span>
          </td>
          <td colSpan={7} className="py-2.5 px-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                {mod.code || "MOD"}
              </span>
              <span
                onClick={onToggle}
                className="cursor-pointer text-foreground hover:text-primary transition-colors text-xs font-bold"
              >
                {mod.name}
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                ({modTasks.length} tugas · {mod.features?.length || 0} fitur)
              </span>
            </div>
          </td>
          <td className="py-2.5 px-3 text-right font-mono text-xs text-success font-bold whitespace-nowrap">
            <ModuleHoursCell moduleId={mod.id} />
          </td>
        </tr>
      );
    }

    // 2. FEATURE ROW (SOP-05 Hierarchy: Module -> Feature -> Task)
    if (item.kind === "FEATURE") {
      const ftr = item.data;
      const { formattedText: hoursText } = calculateTasksProgress(ftr.tasks);

      return (
        <tr className="bg-muted/30 border-b border-border/70 text-xs font-medium select-none group">
          <td className="py-2 px-3 text-center">
            <span
              onClick={onToggle}
              className="inline-flex cursor-pointer text-muted-foreground hover:text-foreground pl-2 transition-colors"
              title={isOpen ? "Tutup Fitur" : "Buka Fitur"}
            >
              {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </span>
          </td>
          <td colSpan={7} className="py-2 px-2">
            <div className="flex items-center gap-2 pl-3">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono text-[10px] font-bold">
                <Layers className="size-2.5" />
                {ftr.code || "FTR"}
              </span>
              <span
                onClick={onToggle}
                className="cursor-pointer text-foreground hover:text-primary transition-colors font-semibold text-xs"
              >
                {ftr.name}
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                ({ftr.tasks?.length || 0} tugas)
              </span>
            </div>
          </td>
          <td className="py-2 px-3 text-right font-mono text-xs text-muted-foreground font-semibold whitespace-nowrap">
            {hoursText}
          </td>
        </tr>
      );
    }

    // 3. TASK ROW
    const task = item.data;
    const hours = Number(task.estimated_man_hours) || 8;
    const formattedHours = `${hours.toFixed(2)} h`;

    // Target deadline formatting
    const targetDateFormatted = task.target_deadline
      ? new Date(task.target_deadline)
          .toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
          .replace("/", "-")
      : "-";

    // Subtitle hierarchy
    const subtitle = [
      task.task_code,
      task.module?.code,
      task.feature?.code,
    ]
      .filter(Boolean)
      .join(" · ");

    // PIC details
    const picName = task.assignee_name || "Belum Ditugaskan";
    const picInitial = getInitials(picName);
    const picBg = getAvatarBg(picInitial);

    // Dual-Approval pills from actual task.approvals relation
    const tlApproval = task.approvals?.find((a) => a.role === "TECHNICAL_LEAD");
    const pmApproval = task.approvals?.find((a) => a.role === "PROJECT_MANAGER");
    const isTlApproved = tlApproval?.status === "APPROVED" || task.status !== "DRAFT";
    const isPmApproved = pmApproval?.status === "APPROVED" || task.status !== "DRAFT";

    const statusLabel =
      task.status === "DEVELOPMENT"
        ? "IN PROGRESS"
        : task.status === "CODE_REVIEW"
          ? "CODE REVIEW"
          : task.status;

    // Indentation based on depth (depth 2 under feature, depth 1 under module)
    const paddingLeftClass =
      item.depth >= 2 ? "pl-9" : item.depth === 1 ? "pl-4" : "pl-1";

    return (
      <tr
        onClick={() => onSelectTask?.(task)}
        className="border-b border-border/70 hover:bg-muted/40 transition-colors cursor-pointer text-xs group"
      >
        {/* Row indicator bullet (replacing removed checkbox) */}
        <td className="py-3 px-3 text-center text-muted-foreground font-mono text-[11px]" onClick={(e) => e.stopPropagation()}>
          <span className="size-1.5 rounded-full bg-border group-hover:bg-primary inline-block transition-colors" />
        </td>

        {/* Pekerjaan & Tugas */}
        <td className="py-3 px-3 min-w-[220px]">
          <div className={paddingLeftClass}>
            <span className="font-semibold text-foreground hover:text-primary transition-colors block">
              {task.title}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
              {subtitle}
            </span>
          </div>
        </td>

        {/* Bobot */}
        <td className="py-3 px-3 text-center">
          <Badge variant={task.complexity_weight || "LOW"} size="sm">
            {task.complexity_weight || "LOW"}
          </Badge>
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
            title={picName}
            className={cn(
              "size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs mx-auto",
              picBg,
            )}
          >
            {picInitial}
          </div>
        </td>

        {/* Dual-Approval */}
        <td className="py-3 px-3 text-center">
          <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
            <Badge variant={isTlApproved ? "APPROVED" : "PENDING"} size="sm">
              {isTlApproved ? "TL APPROVED" : "TL PENDING"}
            </Badge>
            <Badge variant={isPmApproved ? "APPROVED" : "PENDING"} size="sm">
              {isPmApproved ? "PM APPROVED" : "PM PENDING"}
            </Badge>
          </div>
        </td>

        {/* Tahapan */}
        <td className="py-3 px-3 text-center">
          <Badge variant={task.status} size="sm">
            {statusLabel}
          </Badge>
        </td>

        {/* Aksi */}
        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="ghost"
            size="iconSm"
            onClick={() => onSelectTask?.(task)}
            className="size-6 text-muted-foreground hover:text-foreground"
            aria-label="Detail Tugas"
          >
            <MoreHorizontal className="size-4" />
          </Button>
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
            <div className="size-2 bg-muted rounded-full mx-auto animate-pulse" />
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
