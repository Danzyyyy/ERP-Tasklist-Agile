// src/Services/ProjectService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type {
  ProjectItem,
  ProjectQueryParams,
  ProjectGuardResponse,
  ExecutionReadiness,
} from "@/Types/task";

const ProjectService = {
  getAll: async (params?: ProjectQueryParams): Promise<ApiResponse<ProjectItem[]>> => {
    const response = await apiUtils.get<ApiResponse<ProjectItem[]>>("/projects", { params });
    return response.data;
  },

  getById: async (projectId: string): Promise<ApiResponse<ProjectItem>> => {
    const response = await apiUtils.get<ApiResponse<ProjectItem>>(`/projects/${projectId}`);
    return response.data;
  },

  getGuard: async (projectId: string): Promise<ProjectGuardResponse> => {
    const response = await apiUtils.get<ProjectGuardResponse>(`/projects/${projectId}/guard`);
    return response.data;
  },

  getExecutionReadiness: async (projectId: string): Promise<ApiResponse<ExecutionReadiness>> => {
    const response = await apiUtils.get<ApiResponse<ExecutionReadiness>>(
      `/projects/${projectId}/execution-readiness`,
    );
    return response.data;
  },
};

export default ProjectService;
