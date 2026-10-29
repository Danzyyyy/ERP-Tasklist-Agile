// src/Features/Reviews/Schema/ReviewSchema.ts
import { z } from "zod";

export const SubmitReviewSchema = z.object({
  review_type: z.enum(["CODE_REVIEW", "TESTING"]),
  result: z.enum(["PASSED", "REJECTED"]),
  notes: z.string().optional(),
});

export type SubmitReviewInput = z.input<typeof SubmitReviewSchema>;
export type SubmitReviewOutput = z.output<typeof SubmitReviewSchema>;
