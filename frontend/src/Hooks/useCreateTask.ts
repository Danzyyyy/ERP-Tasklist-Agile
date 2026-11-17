// src/Hooks/useCreateTask.ts
import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import TaskService from "@/Services/TaskService";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import { PROGRESS_QUERY_KEYS } from "@/Constants/ProgressConstant";
import {
  CreateTaskSchema,
  type CreateTaskInput,
  type CreateTaskOutput,
} from "@/Schemas/TaskSchema";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApiValidationError } from "@/Types/api";
import useGetModuleList from "@/Hooks/useGetModuleList";

interface UseCreateTaskOptions {
  defaultModuleId?: string;
  defaultFeatureId?: string;
  onSuccess?: () => void;
}

export function useCreateTask({
  defaultModuleId = "",
  defaultFeatureId = "",
  onSuccess,
}: UseCreateTaskOptions = {}) {
  const queryClient = useQueryClient();
  const { data: modules = [] } = useGetModuleList();

  const defaultDeadline = useMemo(
    () => format(addDays(new Date(), 3), "yyyy-MM-dd"),
    [],
  );

  const initialTaskCode = useMemo(
    () => `TSK-${Math.floor(10 + Math.random() * 90)}`,
    [],
  );

  const form = useForm<CreateTaskInput, unknown, CreateTaskOutput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      module_id: defaultModuleId,
      feature_id: defaultFeatureId || null,
      task_code: initialTaskCode,
      title: "",
      description: "",
      complexity_weight: "MEDIUM",
      estimated_man_hours: 8.0,
      target_deadline: defaultDeadline,
    },
  });

  const selectedModuleId = form.watch("module_id");
  const selectedModule = useMemo(
    () => modules.find((m) => m.id === selectedModuleId),
    [modules, selectedModuleId],
  );
  const availableFeatures = useMemo(
    () => selectedModule?.features || [],
    [selectedModule],
  );

  useEffect(() => {
    if (modules.length > 0 && !selectedModuleId) {
      const first = defaultModuleId || modules[0].id;
      form.setValue("module_id", first);
    }
  }, [modules, selectedModuleId, defaultModuleId, form]);

  const mutation = useMutation({
    mutationFn: async (payload: CreateTaskOutput) => {
      // Ensure target_deadline has proper ISO-8601 string
      let isoDeadline: string;
      try {
        const d = new Date(payload.target_deadline);
        if (isNaN(d.getTime())) {
          isoDeadline = new Date().toISOString();
        } else {
          isoDeadline = d.toISOString();
        }
      } catch {
        isoDeadline = new Date().toISOString();
      }

      const response = await TaskService.create({
        ...payload,
        task_code: payload.task_code?.trim().toUpperCase(),
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
      await queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.all });
      form.reset({
        module_id: defaultModuleId,
        feature_id: defaultFeatureId || null,
        task_code: `TSK-${Math.floor(10 + Math.random() * 90)}`,
        title: "",
        description: "",
        complexity_weight: "MEDIUM",
        estimated_man_hours: 8.0,
        target_deadline: defaultDeadline,
      });
      onSuccess?.();
    },
    onError: (error: ApiValidationError | Error) => {
      if ("isValidationError" in error && error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, message]) => {
          form.setError(field as keyof CreateTaskInput, { type: "server", message });
        });
        const firstErrMsg = Object.values(error.validationErrors)[0];
        toast.error(`Validasi server: ${firstErrMsg}`);
        return;
      }
      toast.error(getErrorMessage(error, "Gagal membuat tugas"));
    },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      await mutation.mutateAsync(values as CreateTaskOutput);
    },
    (validationErrors) => {
      console.error("Form validation errors:", validationErrors);
      const firstErr = Object.values(validationErrors)[0];
      if (firstErr?.message) {
        toast.error(`Validasi form: ${firstErr.message}`);
      }
    },
  );

  const incrementManHours = () => {
    const current = Number(form.getValues("estimated_man_hours")) || 8;
    form.setValue("estimated_man_hours", Number((current + 1).toFixed(2)), { shouldValidate: true });
  };

  const decrementManHours = () => {
    const current = Number(form.getValues("estimated_man_hours")) || 8;
    const next = Math.max(0.25, Number((current - 1).toFixed(2)));
    form.setValue("estimated_man_hours", next, { shouldValidate: true });
  };

  return {
    form,
    register: form.register,
    control: form.control,
    setValue: form.setValue,
    watch: form.watch,
    errors: form.formState.errors,
    onSubmit,
    incrementManHours,
    decrementManHours,
    isPending: mutation.isPending,
    loading: mutation.isPending,
    reset: form.reset,
    modules,
    selectedModule,
    availableFeatures,
  };
}

export default useCreateTask;
