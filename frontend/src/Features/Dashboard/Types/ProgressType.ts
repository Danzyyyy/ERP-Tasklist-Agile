// src/Features/Dashboard/Types/ProgressType.ts
import type { DeliverableProgress } from "@/Types/task";
export type { DeliverableProgress };

export interface ProjectDeliverableResponse {
  status: string;
  projectId: string;
  data: DeliverableProgress;
}

export interface ModuleProgressResponse {
  status: string;
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  data: DeliverableProgress;
}
