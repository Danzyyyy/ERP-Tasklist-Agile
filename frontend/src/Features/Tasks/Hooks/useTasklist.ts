// src/Features/Tasks/Hooks/useTasklist.ts
import { useState, useMemo } from "react";
import useGetTaskHierarchy from "@/Hooks/useGetTaskHierarchy";
import useGetDeliverableProgress, { DEFAULT_DELIVERABLE_METRICS } from "@/Hooks/useGetDeliverableProgress";
import useSeedDemoData from "@/Hooks/useSeedDemoData";
import { useFilterParams } from "@/Hooks/useFilterParams";
import { useAuth } from "@/Hooks/useAuth";
import { canCreateTaskRole, canManageHierarchyRole } from "@/Utils/taskUtils";
import type { TreeItem } from "../Components/TaskTreeRow";
import type { Task } from "@/Types/task";

export function useTasklist() {
  const { role } = useAuth();
  const { data: hierarchy = [], isLoading: isHierarchyLoading, refetch: refetchHierarchy } = useGetTaskHierarchy();
  const { data: deliverableMetrics = DEFAULT_DELIVERABLE_METRICS, isLoading: isMetricsLoading, refetch: refetchMetrics } = useGetDeliverableProgress();
  const { seed, seeding } = useSeedDemoData();
  const { filters, setFilter } = useFilterParams<{
    module_id: string;
    feature_id: string;
    status: string;
    search: string;
  }>();

  const isLoading = isHierarchyLoading || isMetricsLoading;

  const canManageHierarchy = canManageHierarchyRole(role);
  const canCreateTask = canCreateTaskRole(role);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedModuleForFeature, setSelectedModuleForFeature] = useState<string | undefined>();
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);
  const [approvalTask, setApprovalTask] = useState<Task | null>(null);

  // Expand / Collapse state
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Flatten & Filter hierarchy UI Tree
  const treeItems = useMemo(() => {
    const items: TreeItem[] = [];

    const searchLower = (filters.search || "").toLowerCase();
    const statusFilter = filters.status || "ALL";
    const moduleFilter = filters.module_id || "ALL";
    const featureFilter = filters.feature_id || "ALL";

    hierarchy.forEach((mod) => {
      if (moduleFilter !== "ALL" && mod.id !== moduleFilter) return;

      const isModCollapsed = Boolean(collapsedNodes[mod.id]);
      items.push({ kind: "MODULE", data: mod, depth: 0, open: !isModCollapsed });

      // Direct Module Tasks (hidden if filtering by specific feature_id)
      if (featureFilter === "ALL" && mod.tasks && mod.tasks.length > 0) {
        mod.tasks.forEach((t) => {
          if (isModCollapsed) return;

          // Status & search filter
          if (statusFilter !== "ALL" && t.status !== statusFilter) return;
          if (
            searchLower &&
            !t.title.toLowerCase().includes(searchLower) &&
            !t.task_code.toLowerCase().includes(searchLower)
          ) {
            return;
          }

          items.push({ kind: "TASK", data: t, depth: 1 });
        });
      }

      // Feature Tasks
      if (mod.features && mod.features.length > 0) {
        mod.features.forEach((ftr) => {
          if (featureFilter !== "ALL" && ftr.id !== featureFilter) return;

          const isFtrCollapsed = isModCollapsed || Boolean(collapsedNodes[ftr.id]);
          if (!isModCollapsed) {
            items.push({
              kind: "FEATURE",
              data: ftr,
              module: mod,
              depth: 1,
              open: !isFtrCollapsed,
            });
          }

          if (ftr.tasks && ftr.tasks.length > 0) {
            ftr.tasks.forEach((t) => {
              if (isFtrCollapsed) return;

              if (statusFilter !== "ALL" && t.status !== statusFilter) return;
              if (
                searchLower &&
                !t.title.toLowerCase().includes(searchLower) &&
                !t.task_code.toLowerCase().includes(searchLower)
              ) {
                return;
              }

              items.push({ kind: "TASK", data: t, depth: 2 });
            });
          }
        });
      }
    });

    return items;
  }, [hierarchy, collapsedNodes, filters]);

  // Konsumsi data akumulasi progres deliverable langsung dari backend API
  const deliverableStats = useMemo(() => {
    return {
      totalTasksCount: deliverableMetrics.totalTasks,
      doneTasksCount: deliverableMetrics.completedTasks,
      totalEstimatedHours: deliverableMetrics.totalEstimatedManHours,
      doneHours: deliverableMetrics.completedManHours,
      progressPercentage: deliverableMetrics.progressPercentage,
    };
  }, [deliverableMetrics]);

  const handleOpenAddFeature = (modId: string) => {
    setSelectedModuleForFeature(modId);
    setIsFeatureModalOpen(true);
  };

  const handleOpenTaskModal = (modId?: string) => {
    if (modId) setSelectedModuleForFeature(modId);
    setIsTaskModalOpen(true);
  };

  const handleRefetch = async () => {
    await Promise.all([refetchHierarchy(), refetchMetrics()]);
  };

  return {
    hierarchy,
    treeItems,
    deliverableStats,
    isLoading,
    refetch: handleRefetch,
    seed,
    seeding,
    filters,
    setFilter,
    canManageHierarchy,
    canCreateTask,
    collapsedNodes,
    toggleNode,
    // Modals
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
    // Handlers
    handleOpenAddFeature,
    handleOpenTaskModal,
  };
}

export default useTasklist;

