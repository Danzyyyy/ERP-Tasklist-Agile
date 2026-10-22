// src/Features/Dashboard/Hooks/useDeliverableProgress.ts
import { useQuery } from "@tanstack/react-query";
import ProgressService from "../Services/ProgressService";
import { PROGRESS_QUERY_KEYS } from "../Constants/ProgressConstant";
import type { DeliverableProgress } from "@/Types/task";

const DEFAULT_METRICS: DeliverableProgress = {
  totalTasks: 0,
  completedTasks: 0,
  totalEstimatedManHours: 0,
  completedManHours: 0,
  actualManHoursSpent: 0,
  progressPercentage: 0.0,
  tasksAtRiskOrOverdue: 0,
  calculatedAt: new Date().toISOString(),
};

export const useDeliverableProgress = (projectId = "PROJ-ERP-01") => {
  return useQuery({
    queryKey: PROGRESS_QUERY_KEYS.project(projectId),
    queryFn: async (): Promise<DeliverableProgress> => {
      try {
        const res = await ProgressService.getDeliverableProgress(projectId);
        return res.data || DEFAULT_METRICS;
      } catch {
        return DEFAULT_METRICS;
      }
    },
  });
};

export default useDeliverableProgress;
