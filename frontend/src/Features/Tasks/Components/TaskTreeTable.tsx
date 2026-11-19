// src/Features/Tasks/Components/TaskTreeTable.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { TaskTreeRow, type TreeItem } from "./TaskTreeRow";
import type { Task } from "@/Types/task";
import { Button } from "@/Components/Elements/Button";
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/Components/Elements/DataTable";
import { TreeTableSkeletonRows } from "@/Components/Elements/TreeTable";
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

    const taskItems = treeItems.filter(
      (item): item is Extract<TreeItem, { kind: "TASK" }> => item.kind === "TASK",
    );
    const totalTasksCount = taskItems.length;
    const draftTasks = taskItems.filter((t) => t.data.status === "DRAFT");
    const doneTasksCount = taskItems.filter((t) => t.data.status === "DONE").length;
    const firstPendingDraft = draftTasks[0]?.data;

    const footerContent = (
      <>
        <span className="text-muted-foreground font-medium">
          {totalTasksCount} tugas ditampilkan · {draftTasks.length} Draft menunggu persetujuan ·{" "}
          {doneTasksCount} Selesai (Terkunci)
        </span>

        <div className="flex items-center gap-2">
          {firstPendingDraft && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenApproval(firstPendingDraft)}
            >
              Evaluasi Persetujuan
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTE_PATHS.KANBAN)}
          >
            Buka Agile Board →
          </Button>
        </div>
      </>
    );

    return (
      <DataTable footer={footerContent}>
        <DataTableHeader>
          <DataTableRow rowType="header">
            <DataTableHead>PEKERJAAN &amp; TUGAS</DataTableHead>
            <DataTableHead className="w-24">BOBOT</DataTableHead>
            <DataTableHead align="right" className="w-24">
              ESTIMASI
            </DataTableHead>
            <DataTableHead className="w-24">TENGGAT</DataTableHead>
            <DataTableHead align="center" className="w-16">
              PIC
            </DataTableHead>
            <DataTableHead className="w-44">PERSETUJUAN</DataTableHead>
            <DataTableHead className="w-28">TAHAPAN</DataTableHead>
            <DataTableHead align="right" className="w-14">
              AKSI
            </DataTableHead>
          </DataTableRow>
        </DataTableHeader>
        <DataTableBody>
          {isLoading ? (
            <TreeTableSkeletonRows count={8} columns={8} />
          ) : treeItems.length === 0 ? (
            <DataTableRow>
              <td
                colSpan={8}
                className="py-8 text-center text-xs text-muted-foreground italic"
              >
                Belum ada modul atau tugas pada filter yang dipilih.
              </td>
            </DataTableRow>
          ) : (
            treeItems.map((item) => {
              const nodeId = item.data.id;
              const isOpen = !collapsedNodes[nodeId];

              return (
                <TaskTreeRow
                  key={`${item.kind}-${nodeId}`}
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
        </DataTableBody>
      </DataTable>
    );
  },
);

TaskTreeTable.displayName = "TaskTreeTable";
export default TaskTreeTable;
