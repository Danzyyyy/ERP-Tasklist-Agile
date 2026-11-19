// src/Features/Kanban/Components/KanbanColumn.tsx
import React, { memo, useState } from "react";
import KanbanCard from "./KanbanCard";
import type { Task, TaskStatus } from "@/Types/task";
import type { UserRole } from "@/Types/auth";
import type { KanbanColumnDef } from "../Types/KanbanType";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
import { Plus } from "lucide-react";

export interface KanbanColumnProps {
  column: KanbanColumnDef;
  tasks: Task[];
  userRole?: UserRole | null;
  draggedFromStatus?: TaskStatus | null;
  onSelectTask: (task: Task) => void;
  onAdvanceTask: (task: Task, nextStatus: TaskStatus) => void;
  onAssignTask?: (task: Task) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
  onDragStartTask?: (task: Task) => void;
  onDragEndTask?: () => void;
  onOpenCreateTask?: () => void;
}

export const KanbanColumn = memo<KanbanColumnProps>(
  ({ column, tasks, userRole, draggedFromStatus: _draggedFromStatus, onSelectTask, onAdvanceTask, onAssignTask, onDropTask, onDragStartTask, onDragEndTask, onOpenCreateTask }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(true);
    };

    const handleDragLeave = () => {
      setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      const taskId = e.dataTransfer.getData("text/plain");
      if (taskId) {
        onDropTask(taskId, column.id);
      }
    };

    return (
      <Card
        size="md"
        padding="sm"
        surface="muted"
        dragOver={isOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="w-full flex flex-col justify-between"
      >
        <div>
          {/* Header Row: Title & Count Badge */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border px-0.5">
            <h3 className="text-xs font-bold text-foreground tracking-tight">{column.title}</h3>
            <span className="font-mono tabular-nums text-[11px] text-muted-foreground font-semibold px-1.5 py-0.5 rounded-sm bg-card border border-border">
              {tasks.length}
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5 min-h-[140px]">
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                userRole={userRole}
                onSelect={onSelectTask}
                onAdvance={onAdvanceTask}
                onAssign={onAssignTask}
                onDragStart={(_, t) => onDragStartTask?.(t)}
                onDragEnd={() => onDragEndTask?.()}
              />
            ))}
          </div>
        </div>

        {/* Column Footer: + Tambah tugas (hidden on Definition of Done column) */}
        {column.id !== "DONE" && (
          <Button
            type="button"
            variant="ghostCard"
            size="sm"
            align="left"
            onClick={onOpenCreateTask}
            className="mt-3 w-full"
          >
            <Plus className="size-3.5" />
            <span>Tambah tugas</span>
          </Button>
        )}
      </Card>
    );
  },
);

KanbanColumn.displayName = "KanbanColumn";
export default KanbanColumn;
