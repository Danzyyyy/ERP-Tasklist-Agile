// src/Hooks/useGetDeliverableProgress.ts
import { useQuery } from "@tanstack/react-query";
import ProgressService from "@/Services/ProgressService";
import { PROGRESS_QUERY_KEYS } from "@/Constants/ProgressConstant";
import { useProject } from "@/Contexts/ProjectContext";
import type { DeliverableProgress } from "@/Types/task";

export const DEFAULT_DELIVERABLE_METRICS: DeliverableProgress = {
  totalTasks: 0,
  completedTasks: 0,
  totalEstimatedManHours: 0,
  completedManHours: 0,
  actualManHoursSpent: 0,
  progressPercentage: 0.0,
  tasksAtRiskOrOverdue: 0,
  calculatedAt: new Date().toISOString(),
};

export const useGetDeliverableProgress = (projectId?: string) => {
  const { activeProjectId } = useProject();
  const effectiveProjectId = projectId || activeProjectId || "PROJ-ERP-01";

  return useQuery({
    queryKey: PROGRESS_QUERY_KEYS.project(effectiveProjectId),
    queryFn: async (): Promise<DeliverableProgress> => {
      try {
        const res = await ProgressService.getDeliverableProgress(effectiveProjectId);
        return res.data || DEFAULT_DELIVERABLE_METRICS;
      } catch {
        return DEFAULT_DELIVERABLE_METRICS;
      }
    },
    placeholderData: DEFAULT_DELIVERABLE_METRICS,
  });
};

export default useGetDeliverableProgress;

