// src/Features/Modules/Services/ModuleService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type { Module, Feature, DeliverableProgress } from "@/Types/task";
import type { CreateModuleOutput, CreateFeatureOutput } from "../Schema/ModuleSchema";
import type { ModuleQueryParams } from "../Types/ModuleType";

const ModuleService = {
  getAll: async (params: ModuleQueryParams = { project_id: "PROJ-ERP-01" }): Promise<ApiResponse<Module[]>> => {
    const response = await apiUtils.get<ApiResponse<Module[]>>("/modules", { params });
    return response.data;
  },

  create: async (payload: CreateModuleOutput): Promise<ApiResponse<Module>> => {
    const response = await apiUtils.post<ApiResponse<Module>>("/modules", payload);
    return response.data;
  },

  createFeature: async (moduleId: string, payload: Omit<CreateFeatureOutput, "module_id">): Promise<ApiResponse<Feature>> => {
    const response = await apiUtils.post<ApiResponse<Feature>>(`/modules/${moduleId}/features`, payload);
    return response.data;
  },

  getProgress: async (moduleId: string): Promise<ApiResponse<DeliverableProgress>> => {
    const response = await apiUtils.get<ApiResponse<DeliverableProgress>>(`/modules/${moduleId}/progress`);
    return response.data;
  },
};

export default ModuleService;
