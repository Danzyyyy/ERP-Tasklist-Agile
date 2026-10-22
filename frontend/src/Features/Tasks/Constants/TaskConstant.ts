// src/Features/Tasks/Constants/TaskConstant.ts
import type { TaskQueryParams } from "../Types/TaskType";

export const TASK_QUERY_KEYS = {
  all: ["tasks"] as const,
  lists: () => [...TASK_QUERY_KEYS.all, "list"] as const,
  list: (params: TaskQueryParams) => [...TASK_QUERY_KEYS.lists(), params] as const,
  hierarchies: () => [...TASK_QUERY_KEYS.all, "hierarchy"] as const,
  hierarchy: (projectId: string) => [...TASK_QUERY_KEYS.hierarchies(), projectId] as const,
  details: () => [...TASK_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TASK_QUERY_KEYS.details(), id] as const,
};

export const COMPLEXITY_BADGES = {
  LOW: { label: "Low (Rendah)", tone: "LOW" },
  MEDIUM: { label: "Medium (Sedang)", tone: "MEDIUM" },
  HIGH: { label: "High (Tinggi)", tone: "HIGH" },
} as const;

export const TASK_STAGES = [
  { id: "RELEASED", label: "Released Task", tone: "RELEASED", step: 1 },
  { id: "DEVELOPMENT", label: "Development", tone: "DEVELOPMENT", step: 2 },
  { id: "CODE_REVIEW", label: "Code Review", tone: "CODE_REVIEW", step: 3 },
  { id: "TESTING", label: "QA Testing", tone: "TESTING", step: 4 },
  { id: "DONE", label: "Definition of Done", tone: "DONE", step: 5 },
] as const;
