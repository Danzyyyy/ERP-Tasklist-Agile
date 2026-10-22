// src/Features/Reviews/Hooks/useSubmitReview.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ReviewService from "../Services/ReviewService";
import { TASK_QUERY_KEYS } from "@/Features/Tasks/Constants/TaskConstant";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { SubmitReviewPayload } from "../Types/ReviewType";

export const useSubmitReview = (taskId?: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      if (!taskId) throw new Error("Task ID tidak valid");
      const response = await ReviewService.submitReview(taskId, payload);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal mencatat log review");
      }
      return response;
    },
    onSuccess: async (response, variables) => {
      if (variables.result === "REJECTED") {
        toast.warning(
          response.message ||
            "Pemeriksaan ditolak. Tugas otomatis dikembalikan ke kolom DEVELOPMENT (Alur Rework)!",
        );
      } else {
        toast.success(response.message || "Pemeriksaan berhasil lolos (PASSED)!");
      }
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal mencatat hasil pemeriksaan"));
    },
  });
};

export default useSubmitReview;
