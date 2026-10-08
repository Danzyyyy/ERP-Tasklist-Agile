import { ComplexityWeight, UserRole } from './task.types';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
  projectId?: string;
  moduleId?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface CreateTaskPayload {
  module_id: string;
  feature_id?: string | null;
  task_code: string;
  title: string;
  description?: string;
  complexity_weight: ComplexityWeight;
  estimated_man_hours: number;
  target_deadline: string;
}

export interface ApprovalPayload {
  status: 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface ReviewLogPayload {
  review_type: 'CODE_REVIEW' | 'TESTING';
  result: 'PASSED' | 'REJECTED';
  notes?: string;
}
