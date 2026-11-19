// src/Hooks/useGetModuleProgress.ts
import { useQuery } from "@tanstack/react-query";
import ProgressService from "@/Services/ProgressService";
import { PROGRESS_QUERY_KEYS } from "@/Constants/ProgressConstant";
import type { DeliverableProgress } from "@/Types/task";

export const DEFAULT_MODULE_METRICS: DeliverableProgress = {
  totalTasks: 0,
  completedTasks: 0,
  totalEstimatedManHours: 0,
  completedManHours: 0,
  actualManHoursSpent: 0,
  progressPercentage: 0.0,
  tasksAtRiskOrOverdue: 0,
  calculatedAt: new Date().toISOString(),
};

export const useGetModuleProgress = (moduleId: string) => {
  return useQuery({
    queryKey: PROGRESS_QUERY_KEYS.module(moduleId),
    queryFn: async (): Promise<DeliverableProgress> => {
      if (!moduleId) return DEFAULT_MODULE_METRICS;
      try {
        const res = await ProgressService.getModuleProgress(moduleId);
        return res.data || DEFAULT_MODULE_METRICS;
      } catch {
        return DEFAULT_MODULE_METRICS;
      }
    },
    placeholderData: DEFAULT_MODULE_METRICS,
    enabled: Boolean(moduleId),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export default useGetModuleProgress;
