// src/Services/ApprovalService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type { Task, TaskApproval, TaskApprovalResponse, ApprovalPayload } from "@/Types/task";

const ApprovalService = {
  getByTaskId: async (taskId: string): Promise<ApiResponse<TaskApprovalResponse>> => {
    const response = await apiUtils.get<ApiResponse<TaskApprovalResponse>>(
      `/tasks/${taskId}/approvals`,
    );
    return response.data;
  },

  submitApproval: async (
    taskId: string,
    payload: ApprovalPayload,
  ): Promise<ApiResponse<{ approval: TaskApproval; task: Task }>> => {
    const response = await apiUtils.post<ApiResponse<{ approval: TaskApproval; task: Task }>>(
      `/tasks/${taskId}/approvals`,
      payload,
    );
    return response.data;
  },
};

export default ApprovalService;

