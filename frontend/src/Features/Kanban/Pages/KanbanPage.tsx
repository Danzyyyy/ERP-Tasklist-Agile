// src/Features/Kanban/Pages/KanbanPage.tsx
import React, { useState, useMemo } from "react";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import { useUpdateTaskStatus } from "@/Features/Tasks/Hooks/useUpdateTaskStatus";
import useModules from "@/Features/Modules/Hooks/useModules";
import { KANBAN_COLUMNS, DEMO_DEVELOPERS } from "../Constants/KanbanConstant";
import KanbanColumn from "../Components/KanbanColumn";
import AssigneeModal from "../Components/AssigneeModal";
import TaskModal from "@/Features/Tasks/Components/TaskModal";
import TaskDetailModal from "@/Features/Tasks/Components/TaskDetailModal";
import ReviewModal from "@/Features/Reviews/Components/ReviewModal";
import SignOffModal from "@/Features/Reviews/Components/SignOffModal";
import { Button } from "@/Components/Elements/Button";
import { Select } from "@/Components/Elements/Select";
import { Input } from "@/Components/Elements/Input";
import { Badge } from "@/Components/Elements/Badge";
import { useFilterParams } from "@/Hooks/useFilterParams";
import type { Task, TaskStatus } from "@/Types/task";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import {
  Plus,
  Search,
  Kanban,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
} from "lucide-react";

export const KanbanPage: React.FC = () => {
  useDocumentTitle(
    "Agile Kanban Board",
    "Papan tugas interaktif 5 tahap eksekusi sprint (Released, Development, Code Review, Testing, Done) dengan otomasi alur rework bug.",
  );
  const { data: tasks = [], isLoading, refetch } = useTasks();
  const { data: modules = [] } = useModules();
  const { mutate: updateStatus } = useUpdateTaskStatus();

  const { filters, setFilter } = useFilterParams<{
    module_id: string;
    assignee_id: string;
    search: string;
  }>();

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [assigneeTargetTask, setAssigneeTargetTask] = useState<Task | null>(null);
  const [reviewTask, setReviewTask] = useState<Task | null>(null);
  const [signOffTask, setSignOffTask] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Hide DRAFT from Kanban board (FTR-K04-03: must be RELEASED first)
      if (t.status === "DRAFT") return false;

      if (filters.module_id && filters.module_id !== "ALL" && t.module_id !== filters.module_id) {
        return false;
      }
      if (
        filters.assignee_id &&
        filters.assignee_id !== "ALL" &&
        t.assignee_id !== filters.assignee_id
      ) {
        return false;
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.task_code.toLowerCase().includes(query) ||
          (t.assignee_name && t.assignee_name.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [tasks, filters]);

  // Handle stage transitions
  const handleTransition = (task: Task, targetStatus: TaskStatus) => {
    // FTR-K04-04 Validation: Moving to DEVELOPMENT requires an assignee
    if (targetStatus === "DEVELOPMENT" && !task.assignee_id) {
      setAssigneeTargetTask(task);
      return;
    }

    // FTR-K04-06 Two-Gate DoD: Moving to DONE requires PM verify + TL signoff
    if (targetStatus === "DONE") {
      setSignOffTask(task);
      return;
    }

    // Direct transition
    updateStatus({
      taskId: task.id,
      status: targetStatus,
      assigneeId: task.assignee_id,
      assigneeName: task.assignee_name,
    });
  };

  const handleDropTask = (taskId: string, targetStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status === targetStatus) return;
    handleTransition(task, targetStatus);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-subtle-foreground bg-primary-subtle px-2 py-0.5 rounded border border-primary-subtle-border">
            SPRINT EXECUTION / UI-K04-03
          </span>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight mt-1.5 flex items-center gap-2">
            <span>Papan Tugas Interaktif (Agile Kanban Board)</span>
            <Badge variant="success" dot size="sm">
              SPRINT AKTIF
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Alur kerja 5 tahap (Released &rarr; Development &rarr; Code Review &rarr; Testing &rarr; Done).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={() => refetch()} className="text-muted-foreground text-xs">
            <RefreshCw className="size-3.5 mr-1" />
            Segarkan
          </Button>

          <Button variant="primary" onClick={() => setIsTaskModalOpen(true)} className="text-xs">
            <Plus className="size-3.5 mr-1" />
            Buat Tugas Cepat
          </Button>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-2.5 px-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-3xl">
          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={filters.module_id || "ALL"}
              onChange={(e) => setFilter("module_id", e.target.value)}
            >
              <option value="ALL">Semua Modul</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={filters.assignee_id || "ALL"}
              onChange={(e) => setFilter("assignee_id", e.target.value)}
            >
              <option value="ALL">Semua PIC Pengembang</option>
              {DEMO_DEVELOPERS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              placeholder="Cari kartu tugas di papan..."
              className="pl-8 h-8"
              value={filters.search || ""}
              onChange={(e) => setFilter("search", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-600 self-end md:self-auto shrink-0">
          <span>
            Aktif di Papan: <b>{filteredTasks.length}</b> Tugas
          </span>
        </div>
      </div>

      {/* 5-Column Kanban Board with Horizontal Scrolling on Mobile */}
      <div className="flex gap-3 items-start overflow-x-auto pb-4 w-full scroll-smooth">
        {KANBAN_COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={colTasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onAdvanceTask={(task, nextStatus) => handleTransition(task, nextStatus)}
              onDropTask={handleDropTask}
            />
          );
        })}
      </div>

      {/* Modals */}
      <AssigneeModal
        task={assigneeTargetTask}
        isOpen={Boolean(assigneeTargetTask)}
        onClose={() => setAssigneeTargetTask(null)}
        onConfirm={(assigneeId, assigneeName) => {
          if (!assigneeTargetTask) return;
          updateStatus({
            taskId: assigneeTargetTask.id,
            status: "DEVELOPMENT",
            assigneeId,
            assigneeName,
          });
          setAssigneeTargetTask(null);
        }}
      />

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onOpenReview={(t) => setReviewTask(t)}
        onOpenSignoff={(t) => setSignOffTask(t)}
      />

      <ReviewModal
        task={reviewTask}
        isOpen={Boolean(reviewTask)}
        onClose={() => setReviewTask(null)}
      />

      <SignOffModal
        task={signOffTask}
        isOpen={Boolean(signOffTask)}
        onClose={() => setSignOffTask(null)}
      />
    </div>
  );
};

export default KanbanPage;
