// src/Features/Tasks/Hooks/useUpdateTaskStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TaskService from "../Services/TaskService";
import { TASK_QUERY_KEYS } from "../Constants/TaskConstant";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { TaskStatus } from "@/Types/task";

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
    onSuccess: async (response, variables) => {
      toast.success(response.message || `Status tugas berhasil dipindahkan ke ${variables.status}`);
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memperbarui status tugas"));
    },
  });
};

export default useUpdateTaskStatus;
