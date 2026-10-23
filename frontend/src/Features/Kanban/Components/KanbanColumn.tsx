// src/Features/Kanban/Components/KanbanColumn.tsx
import React, { memo, useState } from "react";
import KanbanCard from "./KanbanCard";
import type { Task, TaskStatus } from "@/Types/task";
import type { KanbanColumnDef } from "../Types/KanbanType";
import { formatManHours } from "@/Utils/formatters";

export interface KanbanColumnProps {
  column: KanbanColumnDef;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAdvanceTask: (task: Task, nextStatus: TaskStatus) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
}

const columnHeaderTone: Record<string, { bg: string; text: string; dot: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

export const KanbanColumn = memo<KanbanColumnProps>(({
  column,
  tasks,
  onSelectTask,
  onAdvanceTask,
  onDropTask,
}) => {
  const [isOver, setIsOver] = useState(false);
  const tone = columnHeaderTone[column.tone] || columnHeaderTone.indigo;

  const totalHours = tasks.reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);

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
      className={`w-[280px] sm:w-[310px] xl:w-auto xl:flex-1 xl:min-w-[210px] shrink-0 flex flex-col rounded-2xl border transition-all min-h-[640px] max-h-[calc(100vh-210px)] bg-slate-100/60 p-2.5 ${
        isOver
          ? "border-blue-400 bg-blue-50/40 ring-2 ring-blue-300"
          : "border-slate-200/90"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 px-1">
        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${tone.dot}`} />
          <h3 className="text-xs font-bold text-slate-800">{column.title}</h3>
          <span className="text-[10px] font-mono font-bold bg-white text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
            {tasks.length}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {formatManHours(totalHours)}
        </span>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onSelect={onSelectTask}
            onAdvance={onAdvanceTask}
            onDragStart={(e, t) => {
              e.dataTransfer.setData("text/plain", t.id);
            }}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-28 rounded-xl border border-dashed border-slate-300 grid place-items-center text-[11px] text-slate-400 italic">
            Belum ada tugas di tahap ini
          </div>
        )}
      </div>
    </div>
  );
});

KanbanColumn.displayName = "KanbanColumn";
export default KanbanColumn;
