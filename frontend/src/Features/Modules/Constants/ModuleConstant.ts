// src/Features/Modules/Constants/ModuleConstant.ts
import type { ModuleQueryParams } from "../Types/ModuleType";

export const MODULE_QUERY_KEYS = {
  all: ["modules"] as const,
  lists: () => [...MODULE_QUERY_KEYS.all, "list"] as const,
  list: (params: ModuleQueryParams) => [...MODULE_QUERY_KEYS.lists(), params] as const,
  details: () => [...MODULE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...MODULE_QUERY_KEYS.details(), id] as const,
  progress: (id: string) => [...MODULE_QUERY_KEYS.detail(id), "progress"] as const,
};
