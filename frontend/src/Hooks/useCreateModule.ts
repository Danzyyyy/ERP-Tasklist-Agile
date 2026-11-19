// src/Hooks/useCreateModule.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ModuleService from "@/Services/ModuleService";
import { MODULE_QUERY_KEYS } from "@/Constants/ModuleConstant";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import {
  CreateModuleSchema,
  type CreateModuleInput,
  type CreateModuleOutput,
} from "@/Schemas/ModuleSchema";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApiValidationError } from "@/Types/api";

interface UseCreateModuleOptions {
  onSuccess?: () => void;
}

export function useCreateModule({
  onSuccess,
}: UseCreateModuleOptions = {}) {
  const queryClient = useQueryClient();

  const form = useForm<CreateModuleInput, unknown, CreateModuleOutput>({
    resolver: zodResolver(CreateModuleSchema),
    defaultValues: {
      project_id: "PROJ-ERP-01",
      code: "",
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: CreateModuleOutput) => {
      const response = await ModuleService.create(payload);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal membuat modul");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Modul berhasil dibuat!");
      await queryClient.invalidateQueries({ queryKey: MODULE_QUERY_KEYS.lists() });
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.hierarchies() });
      form.reset({ project_id: "PROJ-ERP-01", code: "", name: "", description: "" });
      onSuccess?.();
    },
    onError: (error: ApiValidationError | Error) => {
      if ("isValidationError" in error && error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, message]) => {
          form.setError(field as keyof CreateModuleInput, { type: "server", message });
        });
        return;
      }
      toast.error(getErrorMessage(error, "Gagal membuat modul"));
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values as CreateModuleOutput);
  });

  return {
    form,
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    onSubmit,
    isPending: mutation.isPending,
    loading: mutation.isPending,
    reset: form.reset,
    handleSubmitForm: onSubmit,
  };
}

export default useCreateModule;

