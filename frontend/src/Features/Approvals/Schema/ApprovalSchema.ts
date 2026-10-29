// src/Features/Approvals/Schema/ApprovalSchema.ts
import { z } from "zod";

export const SubmitApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
});

export type SubmitApprovalInput = z.input<typeof SubmitApprovalSchema>;
export type SubmitApprovalOutput = z.output<typeof SubmitApprovalSchema>;
