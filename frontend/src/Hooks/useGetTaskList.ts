// src/Hooks/useGetTaskList.ts
import { useQuery } from "@tanstack/react-query";
import TaskService from "@/Services/TaskService";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import { useProject } from "@/Contexts/ProjectContext";
import type { TaskQueryParams, Task } from "@/Types/task";

export const useGetTaskList = (params: TaskQueryParams = {}) => {
  const { activeProjectId } = useProject();

  return useQuery({
    queryKey: [...TASK_QUERY_KEYS.list(params), activeProjectId],
    queryFn: async (): Promise<Task[]> => {
      const response = await TaskService.getAll(params);
      const rawTasks = response.data || [];

      // Saring tugas yang terikat dengan proyek aktif
      return rawTasks.filter((t) => {
        if (t.module?.project_id) {
          return t.module.project_id === activeProjectId;
        }
        return activeProjectId === "PROJ-ERP-01";
      });
    },
    staleTime: 1000 * 30,
  });
};

export default useGetTaskList;
