// src/Constants/ReviewConstant.ts

export const REVIEW_QUERY_KEYS = {
  all: ["reviews"] as const,
  byTask: (taskId: string) => [...REVIEW_QUERY_KEYS.all, "task", taskId] as const,
};
