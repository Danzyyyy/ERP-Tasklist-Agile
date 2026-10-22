// src/Features/Dashboard/Services/ProgressService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { DeliverableProgress } from "@/Types/task";
import type { ProjectDeliverableResponse, ModuleProgressResponse } from "../Types/ProgressType";

const ProgressService = {
  getDeliverableProgress: async (
    projectId = "PROJ-ERP-01",
  ): Promise<ProjectDeliverableResponse> => {
    const response = await apiUtils.get<ProjectDeliverableResponse>(
      `/projects/${projectId}/deliverable-progress`,
    );
    return response.data;
  },

  getModuleProgress: async (moduleId: string): Promise<ModuleProgressResponse> => {
    const response = await apiUtils.get<ModuleProgressResponse>(`/modules/${moduleId}/progress`);
    return response.data;
  },
};

export default ProgressService;
