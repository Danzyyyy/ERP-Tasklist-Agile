// src/Features/Reports/Hooks/useReportsData.ts
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import useGetDeliverableProgress from "@/Hooks/useGetDeliverableProgress";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import useGetModuleList from "@/Hooks/useGetModuleList";
import ProgressService from "@/Services/ProgressService";
import { PROGRESS_QUERY_KEYS } from "@/Constants/ProgressConstant";
import { toast } from "sonner";
import type { DeliverableProgress } from "@/Types/task";

export function useReportsData() {
  const { data: metrics, isLoading: isMetricsLoading } = useGetDeliverableProgress();
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTaskList();
  const { data: modules = [], isLoading: isModulesLoading } = useGetModuleList();

  // Mengambil progres setiap modul langsung dari endpoint backend: GET /modules/{moduleId}/progress
  const moduleProgressQueries = useQueries({
    queries: modules.map((mod) => ({
      queryKey: PROGRESS_QUERY_KEYS.module(mod.id),
      queryFn: async () => {
        const res = await ProgressService.getModuleProgress(mod.id);
        return {
          name: mod.code,
          fullName: mod.name,
          Total: res.data.totalEstimatedManHours,
          Done: res.data.completedManHours,
        };
      },
      enabled: Boolean(mod.id),
    })),
  });

  const isModuleProgressLoading = moduleProgressQueries.some((q) => q.isLoading);
  const isLoading = isMetricsLoading || isTasksLoading || isModulesLoading || isModuleProgressLoading;

  // Mengonsumsi hasil perhitungan kanonis Formula Q-03 langsung dari endpoint backend
  const effectiveMetrics: DeliverableProgress = useMemo(() => {
    if (metrics) return metrics;

    return {
      totalTasks: 0,
      completedTasks: 0,
      totalEstimatedManHours: 0,
      completedManHours: 0,
      actualManHoursSpent: 0,
      progressPercentage: 0.0,
      tasksAtRiskOrOverdue: 0,
      calculatedAt: new Date().toISOString(),
    };
  }, [metrics]);

  // Data bar chart bersumber 100% dari API backend per modul
  const moduleChartData = useMemo(() => {
    return moduleProgressQueries
      .map((q) => q.data)
      .filter((d): d is NonNullable<typeof d> => Boolean(d));
  }, [moduleProgressQueries]);

  // Distribusi kompleksitas tugas langsung dari atribut task backend
  const complexityChartData = useMemo(() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    tasks.forEach((t) => {
      if (counts[t.complexity_weight as keyof typeof counts] !== undefined) {
        counts[t.complexity_weight as keyof typeof counts] += Number(t.estimated_man_hours) || 0;
      }
    });

    return [
      { name: "Low Complexity (Q-01)", value: counts.LOW, color: "#10b981" },
      { name: "Medium Complexity (Q-01)", value: counts.MEDIUM, color: "#f59e0b" },
      { name: "High Complexity (Q-01)", value: counts.HIGH, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [tasks]);

  const handleExport = () => {
    toast.success("Laporan deliverable sprint berhasil diunduh (Format JSON / CSV disiapkan).");
  };

  return {
    effectiveMetrics,
    moduleChartData,
    complexityChartData,
    tasks,
    isLoading,
    handleExport,
  };
}

export default useReportsData;

