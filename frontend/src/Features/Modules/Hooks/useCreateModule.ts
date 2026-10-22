// src/Features/Modules/Hooks/useCreateModule.ts
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ModuleService from "../Services/ModuleService";
import { MODULE_QUERY_KEYS } from "../Constants/ModuleConstant";
import {
  CreateModuleSchema,
  type CreateModuleInput,
  type CreateModuleOutput,
} from "../Schema/ModuleSchema";
import { getErrorMessage } from "@/Utils/errorHandler";
import type { ApiValidationError } from "@/Types/api";

interface UseCreateModuleOptions {
  onSuccess?: () => void;
}

interface UseCreateModuleReturn {
  form: UseFormReturn<CreateModuleInput>;
  handleSubmitForm: (values: CreateModuleInput) => void;
  loading: boolean;
}

export const useCreateModule = ({ onSuccess }: UseCreateModuleOptions = {}): UseCreateModuleReturn => {
  const queryClient = useQueryClient();

  const form = useForm<CreateModuleInput>({
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
      form.reset({ project_id: "PROJ-ERP-01", code: "", name: "", description: "" });
      if (onSuccess) onSuccess();
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

  const handleSubmitForm = useCallback(
    (values: CreateModuleInput) => {
      mutation.mutate(values as CreateModuleOutput);
    },
    [mutation],
  );

  return {
    form,
    handleSubmitForm,
    loading: mutation.isPending,
  };
};

export default useCreateModule;
