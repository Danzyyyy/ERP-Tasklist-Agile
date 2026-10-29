// src/Features/Approvals/Types/ApprovalType.ts
import type { TaskApproval, ApprovalStatus } from "@/Types/task";
export type { TaskApproval, ApprovalStatus };

export interface ApprovalPayload {
  status: "APPROVED" | "REJECTED";
  notes?: string;
}

export interface TaskApprovalResponse {
  task_id: string;
  task_title: string;
  task_status: string;
  approvals: TaskApproval[];
}
