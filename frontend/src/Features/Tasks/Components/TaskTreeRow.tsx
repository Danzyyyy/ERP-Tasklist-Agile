// src/Features/Tasks/Components/TaskTreeRow.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { formatDate, formatManHours } from "@/Utils/formatters";
import type { Task, Module, Feature } from "@/Types/task";
import {
  Folder,
  FolderOpen,
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Clock,
  User,
  Eye,
  Plus,
} from "lucide-react";

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

export const TaskTreeRow = memo<TaskTreeRowProps>(({
  item,
  isOpen = true,
  onToggle,
  onSelectTask,
  onOpenApproval,
  onAddFeature,
  onAddTask,
}) => {
  if (item.kind === "MODULE") {
    const mod = item.data;
    const taskCount =
      (mod.tasks?.length || 0) +
      (mod.features?.reduce((acc, f) => acc + (f.tasks?.length || 0), 0) || 0);

    return (
      <tr className="bg-secondary/70 hover:bg-secondary/90 transition-colors border-b border-border">
        <td colSpan={7} className="py-2.5 px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onToggle}>
              <span className="text-muted-foreground">
                {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </span>
              <span className="p-1 rounded bg-primary-subtle text-primary">
                {isOpen ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}
              </span>
              <span className="font-mono text-xs font-extrabold text-primary">{mod.code}</span>
              <span className="text-xs font-bold text-foreground">{mod.name}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                ({taskCount} tugas · {mod.features?.length || 0} fitur)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onAddFeature && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] text-primary hover:bg-primary-subtle"
                  onClick={() => onAddFeature(mod.id)}
                >
                  <Plus className="size-3 mr-1" />
                  Tambah Fitur
                </Button>
              )}
              {onAddTask && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px]"
                  onClick={() => onAddTask(mod.id)}
                >
                  <Plus className="size-3 mr-1" />
                  Tambah Tugas
                </Button>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (item.kind === "FEATURE") {
    const ftr = item.data;
    const taskCount = ftr.tasks?.length || 0;

    return (
      <tr className="bg-muted/40 hover:bg-muted/60 transition-colors border-b border-border/70">
        <td colSpan={7} className="py-2 px-3 pl-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onToggle}>
              <span className="text-muted-foreground">
                {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              </span>
              <span className="p-1 rounded bg-purple-subtle text-purple-subtle-foreground">
                <Layers className="size-3.5" />
              </span>
              <span className="font-mono text-[11px] font-bold text-purple-subtle-foreground">{ftr.code}</span>
              <span className="text-[11px] font-semibold text-foreground">{ftr.name}</span>
              <span className="text-[10px] text-muted-foreground font-normal">({taskCount} tugas)</span>
            </div>

            {onAddTask && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] text-purple-subtle-foreground hover:bg-purple-subtle"
                onClick={() => onAddTask(ftr.module_id, ftr.id)}
              >
                <Plus className="size-3 mr-1" />
                Tambah Tugas
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // TASK Row
  const task = item.data;
  const paddingLeft = item.depth === 2 ? "pl-14" : "pl-9";

  const tlApproval = task.approvals?.find((a) => a.role === "TECHNICAL_LEAD");
  const pmApproval = task.approvals?.find((a) => a.role === "PROJECT_MANAGER");

  const approvalLabel =
    task.status === "DRAFT"
      ? `TL: ${tlApproval?.status || "PENDING"} · PM: ${pmApproval?.status || "PENDING"}`
      : "RELEASED";

  return (
    <tr
      onClick={() => onSelectTask && onSelectTask(task)}
      className="hover:bg-primary-subtle/30 transition-colors border-b border-border/70 cursor-pointer text-xs"
    >
      {/* Title & Hierarchy Path */}
      <td className={`py-2.5 px-3 ${paddingLeft}`}>
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-[11px] font-bold text-primary shrink-0">
            {task.task_code}
          </span>
          <span className="font-medium text-foreground hover:text-primary truncate max-w-md">
            {task.title}
          </span>
          {task.rework && <Badge variant="REWORK">REWORK</Badge>}
        </div>
      </td>

      {/* Complexity Weight */}
      <td className="py-2.5 px-3">
        <Badge variant={task.complexity_weight as any} size="sm">
          {task.complexity_weight}
        </Badge>
      </td>

      {/* Estimated Man-hours */}
      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
        <span className="flex items-center gap-1">
          <Clock className="size-3 text-slate-400" />
          {formatManHours(task.estimated_man_hours)}
        </span>
      </td>

      {/* Target Deadline */}
      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
        {formatDate(task.target_deadline)}
      </td>

      {/* PIC Assignee */}
      <td className="py-2.5 px-3 text-slate-600">
        <span className="flex items-center gap-1 truncate max-w-[130px]">
          <User className="size-3 text-slate-400 shrink-0" />
          {task.assignee_name || <span className="text-slate-400 italic">Belum Ada</span>}
        </span>
      </td>

      {/* Dual-Approval Status */}
      <td className="py-2.5 px-3">
        {task.status === "DRAFT" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenApproval && onOpenApproval(task);
            }}
            className="flex items-center gap-1 text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors"
          >
            <ShieldCheck className="size-3 text-amber-600" />
            <span>{approvalLabel}</span>
          </button>
        ) : (
          <Badge variant={task.status as any} dot>
            {task.status}
          </Badge>
        )}
      </td>

      {/* Action */}
      <td className="py-2.5 px-3 text-right">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-slate-500 hover:text-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTask && onSelectTask(task);
          }}
        >
          <Eye className="size-3.5 mr-1" />
          Detail
        </Button>
      </td>
    </tr>
  );
});

TaskTreeRow.displayName = "TaskTreeRow";
export default TaskTreeRow;
