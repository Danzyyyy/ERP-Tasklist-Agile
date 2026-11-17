// src/Features/Tasks/Pages/TasklistPage.tsx
import React from "react";
import useTasklist from "../Hooks/useTasklist";
import TaskRatioBanner from "../Components/TaskRatioBanner";
import TasklistFilterBar from "../Components/TasklistFilterBar";
import TaskTreeTable from "../Components/TaskTreeTable";
import TaskModal from "@/Components/Modals/TaskModal";
import TaskDetailModal from "@/Components/Modals/TaskDetailModal";
import CreateModuleModal from "@/Components/Modals/CreateModuleModal";
import CreateFeatureModal from "@/Components/Modals/CreateFeatureModal";
import ApprovalModal from "@/Components/Modals/ApprovalModal";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { Plus } from "lucide-react";

export const TasklistPage: React.FC = () => {
  useDocumentTitle(
    "Tasklist",
    "Implementasi Core Banking · PT. Anaheim Nimbus Universal",
  );

  const {
    hierarchy,
    treeItems,
    deliverableStats,
    isLoading,
    refetch,
    seed,
    seeding,
    filters,
    setFilter,
    collapsedNodes,
    toggleNode,
    isTaskModalOpen,
    setIsTaskModalOpen,
    isModuleModalOpen,
    setIsModuleModalOpen,
    isFeatureModalOpen,
    setIsFeatureModalOpen,
    selectedModuleForFeature,
    activeTaskDetail,
    setActiveTaskDetail,
    approvalTask,
    setApprovalTask,
    handleOpenAddFeature,
    handleOpenTaskModal,
  } = useTasklist();

  return (
    <div className="space-y-4">
      {/* Page Title Card (FigCraft 1:1) */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Tasklist & Persetujuan
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Implementasi Core Banking · PT. Anaheim Nimbus Universal
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenTaskModal()}
          className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>Buat Tugas Baru</span>
        </button>
      </div>

      {/* Sprint Deliverable Ratio Banner (FigCraft 1:1) */}
      <TaskRatioBanner
        doneHours={deliverableStats.doneHours}
        totalEstimatedHours={deliverableStats.totalEstimatedHours}
        progressPercentage={deliverableStats.progressPercentage}
        completedTasks={1}
        totalTasks={8}
        onRefresh={() => refetch()}
      />

      {/* Filter Bar (FigCraft 1:1) */}
      <TasklistFilterBar
        modules={hierarchy}
        filters={filters as any}
        onFilterChange={setFilter}
        onOpenTaskModal={() => handleOpenTaskModal()}
      />

      {/* Tree Hierarchy Table (FigCraft 1:1) */}
      <TaskTreeTable
        treeItems={treeItems}
        collapsedNodes={collapsedNodes}
        isLoading={isLoading}
        seeding={seeding}
        onSeed={seed}
        onToggleNode={toggleNode}
        onSelectTask={(t) => setActiveTaskDetail(t)}
        onOpenApproval={(t) => setApprovalTask(t)}
        onAddFeature={handleOpenAddFeature}
        onAddTask={(modId) => handleOpenTaskModal(modId)}
        onCreateModuleManual={() => setIsModuleModalOpen(true)}
      />

      {/* Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <TaskDetailModal
        task={activeTaskDetail}
        isOpen={Boolean(activeTaskDetail)}
        onClose={() => setActiveTaskDetail(null)}
        onOpenReview={() => {}}
        onOpenSignoff={() => {}}
      />
      <CreateModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
      />
      <CreateFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        moduleId={selectedModuleForFeature}
      />
      <ApprovalModal
        task={approvalTask}
        isOpen={Boolean(approvalTask)}
        onClose={() => setApprovalTask(null)}
      />
    </div>
  );
};

export default TasklistPage;
