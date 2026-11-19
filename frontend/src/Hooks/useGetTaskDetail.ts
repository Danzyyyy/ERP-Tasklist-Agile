// src/Hooks/useGetTaskDetail.ts
import { useQuery } from "@tanstack/react-query";
import TaskService from "@/Services/TaskService";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";

export const useGetTaskDetail = (taskId?: string, enabled = true) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId || ""),
    queryFn: async () => {
      if (!taskId) return null;
      const response = await TaskService.getById(taskId);
      return response.data;
    },
    enabled: Boolean(taskId && enabled),
  });
};

export default useGetTaskDetail;

