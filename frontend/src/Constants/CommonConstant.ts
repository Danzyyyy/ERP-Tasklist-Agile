// src/Constants/CommonConstant.ts

export const DEFAULT_PROJECT_ID = "PROJ-ERP-01";
export const DEFAULT_PROJECT_NAME = "ERP Software PT. Anaheim Nimbus Universal";
export const DEFAULT_MODULE_CODE = "MOD-E4";
export const DEFAULT_MODULE_NAME = "Tasklist dan Eksekusi Agile";

export const COMPLEXITY_OPTIONS = [
  { value: "LOW", label: "Low Complexity (Bobot Rendah)" },
  { value: "MEDIUM", label: "Medium Complexity (Bobot Sedang)" },
  { value: "HIGH", label: "High Complexity (Bobot Tinggi)" },
] as const;

export const TASK_STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  { value: "DRAFT", label: "Draft (Menunggu Dual-Approval)" },
  { value: "RELEASED", label: "Released (Siap Dikerjakan)" },
  { value: "DEVELOPMENT", label: "In Development" },
  { value: "CODE_REVIEW", label: "Code Review" },
  { value: "TESTING", label: "QA Testing" },
  { value: "DONE", label: "Done (Disahkan)" },
] as const;
