// src/Features/Kanban/Pages/KanbanPage.tsx
import React from "react";
import useKanbanBoard from "../Hooks/useKanbanBoard";
import { KANBAN_COLUMNS } from "../Constants/KanbanConstant";
import KanbanColumn from "../Components/KanbanColumn";
import KanbanFilterBar from "../Components/KanbanFilterBar";
import AssigneeModal from "../Components/AssigneeModal";
import TaskModal from "@/Components/Modals/TaskModal";
import TaskDetailModal from "@/Components/Modals/TaskDetailModal";
import ReviewModal from "@/Components/Modals/ReviewModal";
import SignOffModal from "@/Components/Modals/SignOffModal";
import { Button } from "@/Components/Elements/Button";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { getAvatarBg } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";
import { Plus, RefreshCw } from "lucide-react";

export const KanbanPage: React.FC = () => {
  useDocumentTitle(
    "Agile Board",
    "Papan tugas interaktif 5 tahap eksekusi sprint (Released, Development, Code Review, Testing, Done) dengan otomasi alur rework bug.",
  );

  const {
    userRole,
    modules,
    filteredTasks,
    columnTasksMap,
    sprintMetrics,
    filters,
    setFilter,
    canCreateTask,
    refetch,
    draggedTask,
    handleDragStartTask,
    handleDragEndTask,
    handleTransition,
    handleDropTask,
    handleAssigneeConfirm,
    openAssignModal,
    openReviewModal,
    selectedTask,
    setSelectedTask,
    isTaskModalOpen,
    setIsTaskModalOpen,
    assigneeModalState,
    setAssigneeModalState,
    reviewModalState,
    setReviewModalState,
    signOffTask,
    setSignOffTask,
  } = useKanbanBoard();

  return (
    <div className="space-y-4">
      {/* Page Title Card (Real Business Context) */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">
              SPRINT EXECUTION · FTR-K04-04
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Papan Tugas Sprint (Agile Kanban Board)
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Alur kerja 5 tahap (Released &rarr; Development &rarr; Code Review &rarr; Testing &rarr; Done) sesuai SOP-08.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="h-9 px-3 rounded-lg text-muted-foreground hover:text-foreground text-xs font-semibold gap-1.5 shadow-2xs"
          >
            <RefreshCw className="size-3.5" />
            <span>Segarkan</span>
          </Button>

          {canCreateTask && (
            <Button
              type="button"
              onClick={() => setIsTaskModalOpen(true)}
              className="h-9 px-4 rounded-lg text-xs font-semibold gap-1.5 shrink-0 shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Buat Tugas Baru</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <KanbanFilterBar
        modules={modules}
        filters={filters as any}
        setFilter={setFilter}
        totalActiveCount={filteredTasks.length}
      />

      {/* 5 Kanban Columns (Horizontal Scrollable Container) */}
      <div className="flex gap-4 items-start overflow-x-auto pb-3 w-full scroll-smooth">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="w-[280px] sm:w-[300px] shrink-0">
            <KanbanColumn
              column={col}
              tasks={columnTasksMap[col.id] || []}
              userRole={userRole}
              draggedFromStatus={draggedTask?.status ?? null}
              onSelectTask={setSelectedTask}
              onAdvanceTask={handleTransition}
              onAssignTask={openAssignModal}
              onDropTask={handleDropTask}
              onDragStartTask={handleDragStartTask}
              onDragEndTask={handleDragEndTask}
              onOpenCreateTask={() => setIsTaskModalOpen(true)}
            />
          </div>
        ))}
      </div>

      {/* Bottom Dashboard Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
        {/* Left: Member Status */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <h4 className="text-xs font-bold text-foreground">Status Pelaksana & Beban Kerja (PIC)</h4>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className={cn("size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs", getAvatarBg("TW"))}>
                TW
              </div>
              <span className="font-semibold text-foreground">Tubagus Wildan · PM</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn("size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs", getAvatarBg("FZ"))}>
                FZ
              </div>
              <span className="font-semibold text-foreground">Fauzan · TL</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn("size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs", getAvatarBg("AR"))}>
                AR
              </div>
              <span className="font-semibold text-foreground">Ariel · FE (24h)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn("size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs", getAvatarBg("FJ"))}>
                FJ
              </div>
              <span className="font-semibold text-foreground">Muhamad Fajri · BE (72h)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn("size-6 rounded-full font-bold text-[10px] grid place-items-center shadow-2xs", getAvatarBg("VD"))}>
                VD
              </div>
              <span className="font-semibold text-foreground">Valdric · QA</span>
            </div>
          </div>
        </div>

        {/* Right: Accountable execution */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-4 space-y-2 shadow-2xs">
          <h4 className="text-xs font-bold text-foreground">Metrik Eksekusi Sprint Aktif</h4>
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div>
              <div className="text-lg font-black text-foreground font-mono">
                {String(sprintMetrics.totalTasksCount).padStart(2, "0")}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Total tugas</div>
            </div>
            <div>
              <div className="text-lg font-black text-primary font-mono">
                {String(sprintMetrics.inProgressCount).padStart(2, "0")}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">In progress</div>
            </div>
            <div>
              <div className="text-lg font-black text-success font-mono">
                {String(sprintMetrics.doneCount).padStart(2, "0")}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Selesai</div>
            </div>
            <div>
              <div className="text-lg font-black text-destructive font-mono">
                {String(sprintMetrics.overdueCount).padStart(2, "0")}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssigneeModal
        task={assigneeModalState?.task ?? null}
        mode={assigneeModalState?.mode ?? "TRANSITION"}
        isOpen={Boolean(assigneeModalState)}
        onClose={() => setAssigneeModalState(null)}
        onConfirm={handleAssigneeConfirm}
      />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <TaskDetailModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onOpenReview={(t) => openReviewModal(t)}
        onOpenSignoff={setSignOffTask}
      />
      <ReviewModal
        task={reviewModalState?.task ?? null}
        isOpen={Boolean(reviewModalState)}
        onClose={() => setReviewModalState(null)}
        onSuccess={() => setReviewModalState(null)}
      />
      <SignOffModal
        task={signOffTask}
        isOpen={Boolean(signOffTask)}
        onClose={() => setSignOffTask(null)}
        onSuccess={() => setSignOffTask(null)}
      />
    </div>
  );
};

export default KanbanPage;
