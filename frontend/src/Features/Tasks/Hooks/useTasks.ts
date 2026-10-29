// src/Features/Tasks/Hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query";
import TaskService from "../Services/TaskService";
import { TASK_QUERY_KEYS } from "../Constants/TaskConstant";
import type { TaskQueryParams } from "../Types/TaskType";

export const useTasks = (params: TaskQueryParams = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(params),
    queryFn: async () => {
      const response = await TaskService.getAll(params);
      return response.data || [];
    },
  });
};

export default useTasks;
