// src/Hooks/useCreateFeature.ts
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ModuleService from "@/Services/ModuleService";
import { MODULE_QUERY_KEYS } from "@/Constants/ModuleConstant";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import {
  CreateFeatureSchema,
  type CreateFeatureInput,
  type CreateFeatureOutput,
} from "@/Schemas/ModuleSchema";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApiValidationError } from "@/Types/api";
import useGetModuleList from "@/Hooks/useGetModuleList";

interface UseCreateFeatureOptions {
  moduleId?: string;
  onSuccess?: () => void;
}

export function useCreateFeature({
  moduleId,
  onSuccess,
}: UseCreateFeatureOptions = {}) {
  const queryClient = useQueryClient();
  const { data: modules = [] } = useGetModuleList();

  const form = useForm<CreateFeatureInput, unknown, CreateFeatureOutput>({
    resolver: zodResolver(CreateFeatureSchema),
    defaultValues: {
      module_id: moduleId || "",
      code: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (moduleId) {
      form.setValue("module_id", moduleId);
    } else if (modules.length > 0 && !form.getValues("module_id")) {
      form.setValue("module_id", modules[0].id);
    }
  }, [moduleId, modules, form]);

  const mutation = useMutation({
    mutationFn: async (payload: CreateFeatureOutput) => {
      const { module_id, ...rest } = payload;
      const targetModuleId = module_id || moduleId;
      if (!targetModuleId) {
        throw new Error("Modul belum dipilih");
      }
      const response = await ModuleService.createFeature(targetModuleId, rest);
      if (!response.success && response.status !== "success") {
        throw new Error(response.message || "Gagal membuat fitur");
      }
      return response;
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Fitur berhasil ditambahkan ke modul!");
      await queryClient.invalidateQueries({ queryKey: MODULE_QUERY_KEYS.lists() });
      await queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.hierarchies() });
      form.reset({ module_id: moduleId || "", code: "", name: "", description: "" });
      onSuccess?.();
    },
    onError: (error: ApiValidationError | Error) => {
      if ("isValidationError" in error && error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, message]) => {
          form.setError(field as keyof CreateFeatureInput, { type: "server", message });
        });
        return;
      }
      toast.error(getErrorMessage(error, "Gagal menambahkan fitur"));
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values as CreateFeatureOutput);
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
    modules,
    handleSubmitForm: onSubmit,
  };
}

export default useCreateFeature;

