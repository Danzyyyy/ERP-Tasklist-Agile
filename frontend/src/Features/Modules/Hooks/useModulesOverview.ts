// src/Features/Modules/Hooks/useModulesOverview.ts
import { useState, useMemo } from "react";
import useGetModuleList from "@/Hooks/useGetModuleList";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import { useAuth } from "@/Hooks/useAuth";

export function useModulesOverview() {
  const { role } = useAuth();
  const { data: modules = [], isLoading: isModulesLoading, refetch } = useGetModuleList();
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTaskList();

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>(undefined);

  const canManage = role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
  const isLoading = isModulesLoading || isTasksLoading;

  // Calculate project summary metrics
  const projectMetrics = useMemo(() => {
    const totalModules = modules.length;
    const totalFeatures = modules.reduce((acc, m) => acc + (m.features?.length || 0), 0);
    const totalTasks = tasks.length;
    const totalManHours = tasks.reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);

    return {
      totalModules,
      totalFeatures,
      totalTasks,
      totalManHours,
    };
  }, [modules, tasks]);

  const handleOpenAddFeature = (moduleId?: string) => {
    setSelectedModuleId(moduleId);
    setIsFeatureModalOpen(true);
  };

  const handleCloseFeatureModal = () => {
    setIsFeatureModalOpen(false);
    setSelectedModuleId(undefined);
  };

  return {
    modules,
    tasks,
    projectMetrics,
    canManage,
    isLoading,
    refetch,
    // Modals state
    isModuleModalOpen,
    setIsModuleModalOpen,
    isFeatureModalOpen,
    setIsFeatureModalOpen,
    selectedModuleId,
    handleOpenAddFeature,
    handleCloseFeatureModal,
  };
}

export default useModulesOverview;

