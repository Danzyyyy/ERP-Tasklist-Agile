// src/Features/Dashboard/Hooks/useDashboardOverview.ts
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useGetDeliverableProgress from "@/Hooks/useGetDeliverableProgress";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import useSeedDemoData from "@/Hooks/useSeedDemoData";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import type { DeliverableProgress, Task } from "@/Types/task";

export function useDashboardOverview() {
  const navigate = useNavigate();
  const { data: metrics, isLoading: isMetricsLoading } = useGetDeliverableProgress();
  const { data: tasks = [], isLoading: isTasksLoading } = useGetTaskList();
  const { seed, seeding } = useSeedDemoData();

  const isLoading = isMetricsLoading || isTasksLoading;

  // Konsumsi data kalkulasi resmi Formula Q-03 dari Backend API: GET /projects/{projectId}/deliverable-progress
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

  const stageCounts = useMemo(
    () => ({
      DRAFT: tasks.filter((t) => t.status === "DRAFT").length,
      RELEASED: tasks.filter((t) => t.status === "RELEASED").length,
      DEVELOPMENT: tasks.filter((t) => t.status === "DEVELOPMENT").length,
      CODE_REVIEW: tasks.filter((t) => t.status === "CODE_REVIEW").length,
      TESTING: tasks.filter((t) => t.status === "TESTING").length,
      DONE: tasks.filter((t) => t.status === "DONE").length,
    }),
    [tasks],
  );

  const recentTasks: Task[] = useMemo(() => tasks.slice(0, 5), [tasks]);

  const goToTasks = () => navigate(ROUTE_PATHS.TASKS);
  const goToKanban = () => navigate(ROUTE_PATHS.KANBAN);

  return {
    effectiveMetrics,
    stageCounts,
    recentTasks,
    tasks,
    hasTasks: tasks.length > 0,
    isLoading,
    seeding,
    seed,
    goToTasks,
    goToKanban,
  };
}

export default useDashboardOverview;

