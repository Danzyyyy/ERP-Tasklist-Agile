// src/Schemas/ReviewSchema.ts
import { z } from "zod";

export const SubmitReviewSchema = z
  .object({
    review_type: z.enum(["CODE_REVIEW", "TESTING"]),
    result: z.enum(["PASSED", "REJECTED"]),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.result === "REJECTED" && (!data.notes || data.notes.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["notes"],
        message: "Catatan alasan penolakan / rework wajib diisi (minimal 3 karakter).",
      });
    }
  });

export type SubmitReviewInput = z.input<typeof SubmitReviewSchema>;
export type SubmitReviewOutput = z.output<typeof SubmitReviewSchema>;

