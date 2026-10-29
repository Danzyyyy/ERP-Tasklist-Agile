// src/Features/Approvals/Hooks/useSubmitApproval.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ApprovalService from "../Services/ApprovalService";
import { APPROVAL_QUERY_KEYS } from "../Constants/ApprovalConstant";
import { TASK_QUERY_KEYS } from "@/Features/Tasks/Constants/TaskConstant";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApprovalPayload } from "../Types/ApprovalType";

export const useSubmitApproval = (taskId?: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ApprovalPayload) => {
      if (!taskId) throw new Error("Task ID tidak ditemukan");
      const response = await ApprovalService.submitApproval(taskId, payload);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal mencatat persetujuan rilis");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Keputusan persetujuan rilis berhasil dicatat!");
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      if (taskId) {
        await queryClient.invalidateQueries({ queryKey: APPROVAL_QUERY_KEYS.byTask(taskId) });
      }
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memproses persetujuan rilis"));
    },
  });
};

export default useSubmitApproval;
