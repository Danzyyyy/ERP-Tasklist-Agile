// src/Hooks/useReviewForm.ts
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/Hooks/useAuth";
import useSubmitReview from "@/Hooks/useSubmitReview";
import { canRoleSubmitReview } from "@/Utils/taskUtils";
import {
  SubmitReviewSchema,
  type SubmitReviewInput,
  type SubmitReviewOutput,
} from "@/Schemas/ReviewSchema";
import type { Task, ReviewType, ReviewResult } from "@/Types/task";

export function useReviewForm(
  task: Task | null,
  onSuccess: () => void,
  initialReviewType?: ReviewType,
  initialResult?: ReviewResult,
) {
  const { role, user } = useAuth();

  const defaultReviewType: ReviewType =
    initialReviewType ?? (task?.status === "TESTING" ? "TESTING" : "CODE_REVIEW");
  const defaultResult: ReviewResult = initialResult ?? "PASSED";

  const form = useForm<SubmitReviewInput, unknown, SubmitReviewOutput>({
    resolver: zodResolver(SubmitReviewSchema),
    defaultValues: {
      review_type: defaultReviewType,
      result: defaultResult,
      notes: "",
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        review_type:
          initialReviewType ?? (task.status === "TESTING" ? "TESTING" : "CODE_REVIEW"),
        result: initialResult ?? "PASSED",
        notes: "",
      });
    }
  }, [task, initialReviewType, initialResult, form]);

  const { mutateAsync: submitReview, isPending } = useSubmitReview(task?.id, () => {
    form.reset({
      review_type: defaultReviewType,
      result: defaultResult,
      notes: "",
    });
    onSuccess();
  });

  const reviewType = form.watch("review_type");
  const result = form.watch("result");
  const canSubmitCurrentReview = canRoleSubmitReview(role, reviewType);

  const setReviewType = (val: ReviewType) => form.setValue("review_type", val);
  const setResult = (val: ReviewResult) => form.setValue("result", val);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!task) return;
    if (!canRoleSubmitReview(role, values.review_type)) return;
    const trimmedNotes = (values.notes || "").trim();

    await submitReview({
      review_type: values.review_type,
      result: values.result,
      notes:
        trimmedNotes ||
        (values.result === "PASSED"
          ? `Pemeriksaan ${values.review_type} disetujui tanpa temuan blocking oleh ${user?.name || role}.`
          : `Bug / temuan arsitektur dicatat oleh ${user?.name || role}. Alur Rework dipicu.`),
    });
  });

  return {
    form,
    register: form.register,
    errors: form.formState.errors,
    reviewType,
    setReviewType,
    result,
    setResult,
    canSubmitCurrentReview,
    handleSubmit,
    isPending,
  };
}

export default useReviewForm;

