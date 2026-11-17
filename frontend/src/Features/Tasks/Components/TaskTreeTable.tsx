// src/Features/Tasks/Components/TaskTreeTable.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { TaskTreeRow, TaskTreeRowSkeleton, type TreeItem } from "./TaskTreeRow";
import type { Task } from "@/Types/task";
import { Button } from "@/Components/Elements/Button";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";

export interface TaskTreeTableProps {
  treeItems: TreeItem[];
  collapsedNodes: Record<string, boolean>;
  isLoading: boolean;
  seeding: boolean;
  onSeed: () => void;
  onToggleNode: (nodeId: string) => void;
  onSelectTask: (task: Task) => void;
  onOpenApproval: (task: Task) => void;
  onAddFeature?: (moduleId: string) => void;
  onAddTask?: (moduleId: string, featureId?: string) => void;
  onCreateModuleManual: () => void;
}

export const TaskTreeTable = memo<TaskTreeTableProps>(
  ({
    treeItems,
    collapsedNodes,
    isLoading,
    onToggleNode,
    onSelectTask,
    onOpenApproval,
    onAddFeature,
    onAddTask,
  }) => {
    const navigate = useNavigate();

    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-900/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center text-muted-foreground font-mono">
                  #
                </th>
                <th className="py-3 px-3">PEKERJAAN & TUGAS</th>
                <th className="py-3 px-3 text-center w-24">BOBOT</th>
                <th className="py-3 px-3 text-center w-24">MAN-HOUR</th>
                <th className="py-3 px-3 text-center w-20">TENGGAT</th>
                <th className="py-3 px-3 text-center w-16">PIC</th>
                <th className="py-3 px-3 text-center w-52">DUAL-APPROVAL</th>
                <th className="py-3 px-3 text-center w-28">TAHAPAN</th>
                <th className="py-3 px-3 text-center w-14">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TaskTreeRowSkeleton count={8} />
              ) : (
                treeItems.map((item) => {
                  const nodeId = item.data.id;
                  const isOpen = !collapsedNodes[nodeId];

                  return (
                    <TaskTreeRow
                      key={nodeId}
                      item={item}
                      isOpen={isOpen}
                      onToggle={() => onToggleNode(nodeId)}
                      onSelectTask={onSelectTask}
                      onOpenApproval={onOpenApproval}
                      onAddFeature={onAddFeature}
                      onAddTask={onAddTask}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer matching FigCraft 1:1 */}
        <div className="p-3.5 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground font-medium">
            0 tugas terpilih · 8 tugas ditampilkan
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg text-xs font-semibold"
            >
              Setujui Rilis Terpilih
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.KANBAN)}
              className="rounded-lg text-xs font-semibold"
            >
              Buka Agile Kanban Board →
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

TaskTreeTable.displayName = "TaskTreeTable";
export default TaskTreeTable;
