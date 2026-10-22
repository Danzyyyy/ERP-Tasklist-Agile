// src/Features/Reviews/Hooks/useTlSignoff.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ReviewService from "../Services/ReviewService";
import { TASK_QUERY_KEYS } from "@/Features/Tasks/Constants/TaskConstant";
import { getErrorMessage } from "@/Utils/errorHandler";

export const useTlSignoff = (taskId?: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error("Task ID tidak valid");
      const response = await ReviewService.tlSignoff(taskId);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal melakukan sign-off penutupan tugas");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(
        response.message ||
          "Otorisasi sign-off penutupan tugas oleh Technical Lead berhasil. Tugas resmi berstatus DONE!",
      );
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      await queryClient.invalidateQueries({ queryKey: ["progress"] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal mengesahkan penutupan tugas"));
    },
  });
};

export default useTlSignoff;
