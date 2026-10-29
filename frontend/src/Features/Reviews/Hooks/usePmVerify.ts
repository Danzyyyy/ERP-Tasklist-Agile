// src/Features/Reviews/Hooks/usePmVerify.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ReviewService from "../Services/ReviewService";
import { TASK_QUERY_KEYS } from "@/Features/Tasks/Constants/TaskConstant";
import { getErrorMessage } from "@/Utils/errorHandler";

export const usePmVerify = (taskId?: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error("Task ID tidak valid");
      const response = await ReviewService.pmVerify(taskId);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal melakukan verifikasi PM");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(
        response.message ||
          "Ceklis verifikasi kelayakan PM berhasil divalidasi. Tombol otorisasi TL kini aktif!",
      );
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memverifikasi ceklis PM"));
    },
  });
};

export default usePmVerify;
