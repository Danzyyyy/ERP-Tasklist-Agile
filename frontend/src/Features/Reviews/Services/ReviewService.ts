// src/Features/Reviews/Services/ReviewService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type { Task, TaskReviewLog } from "@/Types/task";
import type { SubmitReviewPayload } from "../Types/ReviewType";

const ReviewService = {
  submitReview: async (
    taskId: string,
    payload: SubmitReviewPayload,
  ): Promise<ApiResponse<{ log: TaskReviewLog; task: Task }>> => {
    const response = await apiUtils.post<ApiResponse<{ log: TaskReviewLog; task: Task }>>(
      `/tasks/${taskId}/reviews`,
      payload,
    );
    return response.data;
  },

  pmVerify: async (taskId: string): Promise<ApiResponse<Task>> => {
    const response = await apiUtils.patch<ApiResponse<Task>>(`/tasks/${taskId}/pm-verify`);
    return response.data;
  },

  tlSignoff: async (taskId: string): Promise<ApiResponse<Task>> => {
    const response = await apiUtils.patch<ApiResponse<Task>>(`/tasks/${taskId}/tl-signoff`);
    return response.data;
  },
};

export default ReviewService;
