// src/Features/Reviews/Types/ReviewType.ts
export type { ReviewType, ReviewResult, TaskReviewLog, Task } from "@/Types/task";

export interface SubmitReviewPayload {
  review_type: "CODE_REVIEW" | "TESTING";
  result: "PASSED" | "REJECTED";
  notes?: string;
}
