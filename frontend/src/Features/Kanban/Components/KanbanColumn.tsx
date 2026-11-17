// src/Features/Kanban/Components/KanbanColumn.tsx
import React, { memo, useState } from "react";
import KanbanCard from "./KanbanCard";
import type { Task, TaskStatus } from "@/Types/task";
import type { UserRole } from "@/Types/auth";
import type { KanbanColumnDef } from "../Types/KanbanType";
import { Button } from "@/Components/Elements/Button";
import { Plus } from "lucide-react";
import { cn } from "@/Utils/cn";

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
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex-1 min-w-[260px] rounded-2xl border border-border bg-muted/30 p-3 flex flex-col justify-between transition-colors shadow-2xs",
          isOver && "border-primary ring-2 ring-primary/20 bg-primary/5",
        )}
      >
        <div>
          {/* Header Row: Title & Count Badge */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70 px-1">
            <h3 className="text-xs font-bold text-foreground tracking-tight">{column.title}</h3>
            <span className="font-mono text-xs text-muted-foreground font-semibold px-1.5 py-0.5 rounded bg-card border border-border/80">{tasks.length}</span>
          </div>

          {/* Cards List */}
          <div className="space-y-3 min-h-[140px]">
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

        {/* Column Footer: + Tambah tugas */}
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenCreateTask}
          className="mt-3 w-full py-2 px-2 text-xs text-muted-foreground hover:text-foreground font-medium flex items-center justify-start gap-1.5 rounded-lg hover:bg-card h-auto"
        >
          <Plus className="size-3.5" />
          <span>Tambah tugas</span>
        </Button>
      </div>
    );
  },
);

KanbanColumn.displayName = "KanbanColumn";
export default KanbanColumn;
