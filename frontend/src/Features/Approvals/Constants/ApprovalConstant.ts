// src/Features/Approvals/Constants/ApprovalConstant.ts

export const APPROVAL_QUERY_KEYS = {
  all: ["approvals"] as const,
  byTask: (taskId: string) => [...APPROVAL_QUERY_KEYS.all, "task", taskId] as const,
};
