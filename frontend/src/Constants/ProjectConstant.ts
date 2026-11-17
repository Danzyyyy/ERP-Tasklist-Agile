// src/Constants/ProjectConstant.ts
import type { ProjectQueryParams } from "@/Types/task";

export const PROJECT_QUERY_KEYS = {
  all: ["projects"] as const,
  lists: () => [...PROJECT_QUERY_KEYS.all, "list"] as const,
  list: (params?: ProjectQueryParams) => [...PROJECT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PROJECT_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PROJECT_QUERY_KEYS.details(), id] as const,
  guards: () => [...PROJECT_QUERY_KEYS.all, "guard"] as const,
  guard: (id: string) => [...PROJECT_QUERY_KEYS.guards(), id] as const,
  readiness: (id: string) => [...PROJECT_QUERY_KEYS.all, "readiness", id] as const,
};
