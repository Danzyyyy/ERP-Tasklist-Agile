// src/Features/Reviews/Constants/ReviewConstant.ts

export const REVIEW_QUERY_KEYS = {
  all: ["reviews"] as const,
  byTask: (taskId: string) => [...REVIEW_QUERY_KEYS.all, "task", taskId] as const,
};

export const PM_VERIFICATION_CHECKLIST = [
  { id: "spec", label: "Fungsionalitas fitur telah sesuai spesifikasi dokumen SRS/SOP" },
  { id: "testing", label: "Seluruh skenario pengujian QA dinyatakan lolos (Pass 100%)" },
  { id: "acceptance", label: "Kriteria penerimaan (Acceptance Criteria) deliverable terpenuhi" },
] as const;
