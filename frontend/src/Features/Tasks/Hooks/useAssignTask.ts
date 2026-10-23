// src/Features/Tasks/Hooks/useAssignTask.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TaskService from "../Services/TaskService";
import { TASK_QUERY_KEYS } from "../Constants/TaskConstant";
import { getErrorMessage } from "@/Utils/errorHandler";

export const useAssignTask = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      assigneeId,
      assigneeName,
    }: {
      taskId: string;
      assigneeId: string;
      assigneeName: string;
    }) => {
      const response = await TaskService.assign(taskId, assigneeId, assigneeName);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal menugaskan pelaksana");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Pengembang PIC berhasil ditugaskan!");
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menugaskan pelaksana"));
    },
  });
};

export default useAssignTask;
