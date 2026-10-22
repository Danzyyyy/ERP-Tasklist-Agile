// src/Features/Dashboard/Constants/ProgressConstant.ts

export const PROGRESS_QUERY_KEYS = {
  all: ["progress"] as const,
  project: (projectId: string) => [...PROGRESS_QUERY_KEYS.all, "project", projectId] as const,
  module: (moduleId: string) => [...PROGRESS_QUERY_KEYS.all, "module", moduleId] as const,
};
