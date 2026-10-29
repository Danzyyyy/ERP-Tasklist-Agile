// src/Features/Approvals/Services/ApprovalService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type { TaskApprovalResponse, ApprovalPayload } from "../Types/ApprovalType";
import type { Task } from "@/Types/task";

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
  ): Promise<ApiResponse<{ approval: any; task: Task }>> => {
    const response = await apiUtils.post<ApiResponse<{ approval: any; task: Task }>>(
      `/tasks/${taskId}/approvals`,
      payload,
    );
    return response.data;
  },
};

export default ApprovalService;
