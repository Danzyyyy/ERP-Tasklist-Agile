// src/Hooks/useUpdateTaskStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TaskService from "@/Services/TaskService";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import { PROGRESS_QUERY_KEYS } from "@/Constants/ProgressConstant";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { Task, TaskStatus } from "@/Types/task";

export interface UpdateStatusPayload {
  taskId: string;
  status: TaskStatus;
  assigneeId?: string | null;
  assigneeName?: string | null;
}

export const useUpdateTaskStatus = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status, assigneeId, assigneeName }: UpdateStatusPayload) => {
      const response = await TaskService.updateStatus(taskId, status, assigneeId, assigneeName);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || `Gagal mengubah status tugas ke ${status}`);
      }
      return response;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });

      const previousLists = queryClient.getQueriesData<Task[]>({
        queryKey: TASK_QUERY_KEYS.lists(),
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: TASK_QUERY_KEYS.lists() },
        (old) =>
          old?.map((task) =>
            task.id === variables.taskId
              ? {
                  ...task,
                  status: variables.status,
                  assignee_id: variables.assigneeId ?? task.assignee_id,
                  assignee_name: variables.assigneeName ?? task.assignee_name,
                }
              : task,
          ),
      );

      return { previousLists };
    },
    onSuccess: (response, variables) => {
      toast.success(response.message || `Status tugas berhasil dipindahkan ke ${variables.status}`);
      if (onSuccess) onSuccess();
    },
    onError: (error, _variables, context) => {
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(getErrorMessage(error, "Gagal memperbarui status tugas"));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.all });
    },
  });
};

export default useUpdateTaskStatus;

