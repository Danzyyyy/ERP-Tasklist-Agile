// src/Features/Tasks/Hooks/useCreateTask.ts
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import TaskService from "../Services/TaskService";
import { TASK_QUERY_KEYS } from "../Constants/TaskConstant";
import {
  CreateTaskSchema,
  type CreateTaskInput,
  type CreateTaskOutput,
} from "../Schema/TaskSchema";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApiValidationError } from "@/Types/api";

interface UseCreateTaskOptions {
  defaultModuleId?: string;
  defaultFeatureId?: string;
  onSuccess?: () => void;
}

interface UseCreateTaskReturn {
  form: UseFormReturn<CreateTaskInput>;
  handleSubmitForm: (values: CreateTaskInput) => void;
  loading: boolean;
}

export const useCreateTask = ({
  defaultModuleId = "",
  defaultFeatureId = "",
  onSuccess,
}: UseCreateTaskOptions = {}): UseCreateTaskReturn => {
  const queryClient = useQueryClient();

  const defaultDeadline = format(addDays(new Date(), 3), "yyyy-MM-dd'T'17:00");

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      module_id: defaultModuleId,
      feature_id: defaultFeatureId || null,
      task_code: "",
      title: "",
      description: "",
      complexity_weight: "MEDIUM",
      estimated_man_hours: 8.0,
      target_deadline: defaultDeadline,
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: CreateTaskOutput) => {
      // Ensure target_deadline has proper ISO format
      const isoDeadline = new Date(payload.target_deadline).toISOString();
      const response = await TaskService.create({
        ...payload,
        target_deadline: isoDeadline,
      });
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal membuat tugas");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(
        response.message || "Tugas berhasil dibuat dengan status DRAFT dan menunggu Dual-Approval!",
      );
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      form.reset({
        module_id: defaultModuleId,
        feature_id: defaultFeatureId || null,
        task_code: "",
        title: "",
        description: "",
        complexity_weight: "MEDIUM",
        estimated_man_hours: 8.0,
        target_deadline: defaultDeadline,
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: ApiValidationError | Error) => {
      if ("isValidationError" in error && error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, message]) => {
          form.setError(field as keyof CreateTaskInput, { type: "server", message });
        });
        return;
      }
      toast.error(getErrorMessage(error, "Gagal membuat tugas"));
    },
  });

  const handleSubmitForm = useCallback(
    (values: CreateTaskInput) => {
      mutation.mutate(values as CreateTaskOutput);
    },
    [mutation],
  );

  return {
    form,
    handleSubmitForm,
    loading: mutation.isPending,
  };
};

export default useCreateTask;
