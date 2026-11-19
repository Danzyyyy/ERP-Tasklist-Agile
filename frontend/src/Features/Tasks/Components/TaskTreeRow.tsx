// src/Features/Tasks/Components/TaskTreeRow.tsx
import React, { memo } from "react";
import { Eye } from "lucide-react";
import type { Task, Module, Feature } from "@/Types/task";
import useGetModuleProgress from "@/Hooks/useGetModuleProgress";
import { Avatar, AvatarFallback } from "@/Components/Elements/Avatar";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { DataTableCell } from "@/Components/Elements/DataTable";
import { TreeTableRow, TreeTableSkeletonRows } from "@/Components/Elements/TreeTable";
import { getInitials, getAvatarTone, calculateTasksProgress } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";

const ModuleHoursCell: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  const { data: progress, isLoading } = useGetModuleProgress(moduleId);
  if (isLoading) return <span className="text-muted-foreground font-mono tabular-nums">...</span>;
  if (!progress) return <span className="text-muted-foreground font-mono tabular-nums">-- Jam</span>;
  const pct =
    progress.totalEstimatedManHours > 0
      ? ((progress.completedManHours / progress.totalEstimatedManHours) * 100).toFixed(1)
      : "0.0";
  const isComplete =
    progress.totalEstimatedManHours > 0 &&
    progress.completedManHours >= progress.totalEstimatedManHours;

  return (
    <span
      className={cn(
        "font-mono tabular-nums text-[11px] font-semibold",
        isComplete ? "text-success-subtle-foreground" : "text-muted-foreground",
      )}
    >
      {progress.completedManHours.toFixed(1)} / {progress.totalEstimatedManHours.toFixed(1)} Jam (
      {pct}%)
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
  ({ item, isOpen = true, onToggle, onSelectTask, onOpenApproval }) => {
    // 1. MODULE ROW (Depth 0 · Folder Icon · Expand Chevron)
    if (item.kind === "MODULE") {
      const mod = item.data;
      const featureCount = mod.features?.length || 0;
      const directTaskCount = mod.tasks?.length || 0;
      const nestedTaskCount =
        mod.features?.reduce((sum, f) => sum + (f.tasks?.length || 0), 0) || 0;
      const totalTaskCount = directTaskCount + nestedTaskCount;

      const metaLabel =
        featureCount > 0
          ? `${featureCount} Fitur · ${totalTaskCount} Tugas`
          : `Langsung di Modul · ${totalTaskCount} Tugas`;

      return (
        <TreeTableRow
          level="group"
          isExpanded={isOpen}
          onToggle={onToggle}
          code={mod.code || "MOD"}
          title={mod.name}
          meta={metaLabel}
          primaryColSpan={6}
        >
          <DataTableCell colSpan={2} align="right" density="compact" nowrap>
            <ModuleHoursCell moduleId={mod.id} />
          </DataTableCell>
        </TreeTableRow>
      );
    }

    // 2. OPTIONAL FEATURE ROW (Depth 1 · Folder Icon · Expand Chevron)
    if (item.kind === "FEATURE") {
      const ftr = item.data;
      const { formattedText: hoursText } = calculateTasksProgress(ftr.tasks);

      return (
        <TreeTableRow
          level="subgroup"
          isExpanded={isOpen}
          onToggle={onToggle}
          code={ftr.code || "FTR"}
          title={ftr.name}
          meta={`${ftr.tasks?.length || 0} Tugas`}
          primaryColSpan={6}
        >
          <DataTableCell
            colSpan={2}
            align="right"
            density="tight"
            size="xs"
            tone="muted"
            weight="medium"
            tabular
            nowrap
          >
            {hoursText}
          </DataTableCell>
        </TreeTableRow>
      );
    }

    // 3. TASK LEAF ROW (File Icon · No Chevron · Indented Depth 1 if direct under Module, Depth 2 under Feature)
    const task = item.data;
    const hours = Number(task.estimated_man_hours) || 0;
    const formattedHours = `${hours.toFixed(1)} h`;

    const deadlineDate = task.target_deadline ? new Date(task.target_deadline) : null;
    const isValidDeadline = deadlineDate !== null && !Number.isNaN(deadlineDate.getTime());
    const targetDateFormatted = isValidDeadline
      ? deadlineDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
      : "—";

    const isUrgentDeadline =
      isValidDeadline &&
      task.status !== "DONE" &&
      deadlineDate.getTime() - Date.now() <= 24 * 60 * 60 * 1000;

    const hasAssignee = Boolean(task.assignee_name);
    const picName = task.assignee_name || "Belum Ditugaskan";
    const picInitial = hasAssignee ? getInitials(picName) : "—";
    const picTone = hasAssignee ? getAvatarTone(picInitial) : "slate";

    const tlApproval = task.approvals?.find((a) => a.role === "TECHNICAL_LEAD");
    const pmApproval = task.approvals?.find((a) => a.role === "PROJECT_MANAGER");
    const isTlApproved = tlApproval?.status === "APPROVED" || task.status !== "DRAFT";
    const isPmApproved = pmApproval?.status === "APPROVED" || task.status !== "DRAFT";

    const statusLabel =
      task.status === "DEVELOPMENT"
        ? "DEVELOPMENT"
        : task.status === "CODE_REVIEW"
          ? "CODE REVIEW"
          : task.status;

    const rowLevel = item.depth >= 2 ? "item-nested" : "item-direct";

    return (
      <TreeTableRow
        level={rowLevel}
        code={task.task_code || "TSK"}
        title={task.title}
        onClick={() => onSelectTask?.(task)}
      >
        {/* Bobot */}
        <DataTableCell density="compact" nowrap>
          <Badge variant={task.complexity_weight || "LOW"} size="sm">
            {task.complexity_weight || "LOW"}
          </Badge>
        </DataTableCell>

        {/* Estimasi Man-Hour */}
        <DataTableCell align="right" density="compact" weight="medium" tabular nowrap>
          {formattedHours}
        </DataTableCell>

        {/* Tenggat */}
        <DataTableCell
          density="compact"
          size="xs"
          tabular
          nowrap
          weight={isUrgentDeadline ? "semibold" : "normal"}
          tone={isUrgentDeadline ? "destructive" : "muted"}
        >
          {targetDateFormatted}
        </DataTableCell>

        {/* PIC */}
        <DataTableCell align="center" density="compact">
          {hasAssignee ? (
            <Avatar size="xs" borderless title={picName} className="mx-auto">
              <AvatarFallback appearance="solid" tone={picTone}>
                {picInitial}
              </AvatarFallback>
            </Avatar>
          ) : (
            <span className="text-muted-foreground text-xs" title="Belum Ditugaskan">
              —
            </span>
          )}
        </DataTableCell>

        {/* Persetujuan TL & PM */}
        <DataTableCell
          density="compact"
          nowrap
          onClick={(e) => {
            if (task.status === "DRAFT" && onOpenApproval) {
              e.stopPropagation();
              onOpenApproval(task);
            }
          }}
        >
          <div className="flex items-center gap-1">
            <Badge variant={isTlApproved ? "APPROVED" : "PENDING"} size="sm">
              {isTlApproved ? "TL ✓" : "TL PENDING"}
            </Badge>
            <Badge variant={isPmApproved ? "APPROVED" : "PENDING"} size="sm">
              {isPmApproved ? "PM ✓" : "PM PENDING"}
            </Badge>
          </div>
        </DataTableCell>

        {/* Tahapan */}
        <DataTableCell density="compact" nowrap>
          <Badge variant={task.status} size="sm">
            {statusLabel}
          </Badge>
        </DataTableCell>

        {/* Aksi */}
        <DataTableCell
          align="right"
          density="compact"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghostMuted"
            size="iconXs"
            onClick={() => onSelectTask?.(task)}
            aria-label="Detail Tugas"
          >
            <Eye className="size-3.5" />
          </Button>
        </DataTableCell>
      </TreeTableRow>
    );
  },
);

TaskTreeRow.displayName = "TaskTreeRow";

export const TaskTreeRowSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <TreeTableSkeletonRows count={count} columns={8} />
);

export default TaskTreeRow;
