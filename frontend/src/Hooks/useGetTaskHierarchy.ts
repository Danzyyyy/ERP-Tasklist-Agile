// src/Hooks/useGetTaskHierarchy.ts
import { useQuery } from "@tanstack/react-query";
import TaskService from "@/Services/TaskService";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import { useProject } from "@/Contexts/ProjectContext";

export const useGetTaskHierarchy = (projectId?: string) => {
  const { activeProjectId } = useProject();
  const effectiveProjectId = projectId || activeProjectId || "PROJ-ERP-01";

  return useQuery({
    queryKey: TASK_QUERY_KEYS.hierarchy(effectiveProjectId),
    queryFn: async () => {
      const response = await TaskService.getHierarchy(effectiveProjectId);
      return response.data || [];
    },
    staleTime: 1000 * 30,
  });
};

export default useGetTaskHierarchy;
