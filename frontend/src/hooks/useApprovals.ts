import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/apiClient';
import { ApprovalPayload, ReviewLogPayload } from '../types/api.types';

export const useApprovals = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task'] });
    queryClient.invalidateQueries({ queryKey: ['hierarchy'] });
    queryClient.invalidateQueries({ queryKey: ['deliverableProgress'] });
  };

  const submitApprovalMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: ApprovalPayload }) =>
      taskApi.submitApproval(taskId, payload),
    onSuccess: invalidateAll,
  });

  const submitReviewMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: ReviewLogPayload }) =>
      taskApi.submitReview(taskId, payload),
    onSuccess: invalidateAll,
  });

  const pmVerifyMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.pmVerify(taskId),
    onSuccess: invalidateAll,
  });

  const tlSignoffMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.tlSignoff(taskId),
    onSuccess: invalidateAll,
  });

  return {
    submitApproval: submitApprovalMutation.mutateAsync,
    isSubmittingApproval: submitApprovalMutation.isPending,
    submitReview: submitReviewMutation.mutateAsync,
    isSubmittingReview: submitReviewMutation.isPending,
    pmVerify: pmVerifyMutation.mutateAsync,
    isPmVerifying: pmVerifyMutation.isPending,
    tlSignoff: tlSignoffMutation.mutateAsync,
    isTlSigning: tlSignoffMutation.isPending,
  };
};
