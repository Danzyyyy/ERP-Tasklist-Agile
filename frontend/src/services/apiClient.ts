import axios from 'axios';
import { ApiResponse, CreateTaskPayload, ApprovalPayload, ReviewLogPayload } from '../types/api.types';
import { Task, Module, DeliverableProgress, TaskApproval } from '../types/task.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to inject Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token') || 'mock_tl';
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// API Functions
export const taskApi = {
  getTasks: async (params?: { module_id?: string; feature_id?: string; status?: string }) => {
    const res = await apiClient.get<ApiResponse<Task[]>>('/tasks', { params });
    return res.data.data;
  },

  getHierarchy: async (projectId: string = 'PROJ-ERP-01') => {
    const res = await apiClient.get<ApiResponse<Module[]>>('/tasks/hierarchy', {
      params: { project_id: projectId },
    });
    return res.data.data;
  },

  getTaskById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return res.data.data;
  },

  createTask: async (payload: CreateTaskPayload) => {
    const res = await apiClient.post<ApiResponse<Task>>('/tasks', payload);
    return res.data;
  },

  updateStatus: async (taskId: string, status: string, assignee_id?: string, assignee_name?: string) => {
    const res = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, {
      status,
      assignee_id,
      assignee_name,
    });
    return res.data;
  },

  assignDeveloper: async (taskId: string, assignee_id: string, assignee_name: string) => {
    const res = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/assign`, {
      assignee_id,
      assignee_name,
    });
    return res.data;
  },

  // FTR-K04-03: Dual-Approval
  getApprovals: async (taskId: string) => {
    const res = await apiClient.get<ApiResponse<{ approvals: TaskApproval[] }>>(`/tasks/${taskId}/approvals`);
    return res.data.data;
  },

  submitApproval: async (taskId: string, payload: ApprovalPayload) => {
    const res = await apiClient.post<ApiResponse<{ approval: TaskApproval; task: Task }>>(
      `/tasks/${taskId}/approvals`,
      payload
    );
    return res.data;
  },

  // FTR-K04-05: Code Review & QA Testing
  submitReview: async (taskId: string, payload: ReviewLogPayload) => {
    const res = await apiClient.post<ApiResponse<any>>(`/tasks/${taskId}/reviews`, payload);
    return res.data;
  },

  // FTR-K04-06: Verification & Final Sign-off
  pmVerify: async (taskId: string) => {
    const res = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/pm-verify`);
    return res.data;
  },

  tlSignoff: async (taskId: string) => {
    const res = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/tl-signoff`);
    return res.data;
  },

  // FTR-K04-07 & API-K04-01: Deliverable Progress
  getDeliverableProgress: async (projectId: string = 'PROJ-ERP-01') => {
    const res = await apiClient.get<ApiResponse<DeliverableProgress>>(
      `/projects/${projectId}/deliverable-progress`
    );
    return res.data.data;
  },

  getModules: async (projectId: string = 'PROJ-ERP-01') => {
    const res = await apiClient.get<ApiResponse<Module[]>>('/modules', {
      params: { project_id: projectId },
    });
    return res.data.data;
  },
};
