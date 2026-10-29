// src/Features/Tasks/Services/TaskService.ts
import { apiUtils } from "@/Services/Common/Base";
import type { ApiResponse } from "@/Types/api";
import type { Task, Module, TaskStatus } from "@/Types/task";
import type { CreateTaskOutput } from "../Schema/TaskSchema";
import type { TaskQueryParams } from "../Types/TaskType";

const TaskService = {
  getAll: async (params: TaskQueryParams = {}): Promise<ApiResponse<Task[]>> => {
    const response = await apiUtils.get<ApiResponse<Task[]>>("/tasks", { params });
    return response.data;
  },

  getHierarchy: async (projectId = "PROJ-ERP-01"): Promise<ApiResponse<Module[]>> => {
    const response = await apiUtils.get<ApiResponse<Module[]>>("/tasks/hierarchy", {
      params: { project_id: projectId },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await apiUtils.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  create: async (payload: CreateTaskOutput): Promise<ApiResponse<Task>> => {
    const response = await apiUtils.post<ApiResponse<Task>>("/tasks", payload);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: TaskStatus,
    assignee_id?: string | null,
    assignee_name?: string | null,
  ): Promise<ApiResponse<Task>> => {
    const response = await apiUtils.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
      assignee_id,
      assignee_name,
    });
    return response.data;
  },

  assign: async (
    id: string,
    assignee_id: string,
    assignee_name: string,
  ): Promise<ApiResponse<Task>> => {
    const response = await apiUtils.patch<ApiResponse<Task>>(`/tasks/${id}/assign`, {
      assignee_id,
      assignee_name,
    });
    return response.data;
  },
};

export default TaskService;
