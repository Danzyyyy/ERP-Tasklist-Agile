// src/Features/Modules/Hooks/useCreateFeature.ts
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ModuleService from "../Services/ModuleService";
import { MODULE_QUERY_KEYS } from "../Constants/ModuleConstant";
import {
  CreateFeatureSchema,
  type CreateFeatureInput,
  type CreateFeatureOutput,
} from "../Schema/ModuleSchema";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApiValidationError } from "@/Types/api";

interface UseCreateFeatureOptions {
  moduleId?: string;
  onSuccess?: () => void;
}

interface UseCreateFeatureReturn {
  form: UseFormReturn<CreateFeatureInput>;
  handleSubmitForm: (values: CreateFeatureInput) => void;
  loading: boolean;
}

export const useCreateFeature = ({
  moduleId,
  onSuccess,
}: UseCreateFeatureOptions = {}): UseCreateFeatureReturn => {
  const queryClient = useQueryClient();

  const form = useForm<CreateFeatureInput>({
    resolver: zodResolver(CreateFeatureSchema),
    defaultValues: {
      module_id: moduleId || "",
      code: "",
      name: "",
      description: "",
    },
  });

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
      form.reset({ module_id: moduleId || "", code: "", name: "", description: "" });
      if (onSuccess) onSuccess();
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

  const handleSubmitForm = useCallback(
    (values: CreateFeatureInput) => {
      mutation.mutate(values as CreateFeatureOutput);
    },
    [mutation],
  );

  return {
    form,
    handleSubmitForm,
    loading: mutation.isPending,
  };
};

export default useCreateFeature;
