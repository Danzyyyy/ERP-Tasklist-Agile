// src/Features/Tasks/Hooks/useTaskHierarchy.ts
import { useQuery } from "@tanstack/react-query";
import TaskService from "../Services/TaskService";
import { TASK_QUERY_KEYS } from "../Constants/TaskConstant";

export const useTaskHierarchy = (projectId = "PROJ-ERP-01") => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.hierarchy(projectId),
    queryFn: async () => {
      const response = await TaskService.getHierarchy(projectId);
      return response.data || [];
    },
  });
};

export default useTaskHierarchy;
