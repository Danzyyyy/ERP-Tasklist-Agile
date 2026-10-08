export type ComplexityWeight = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskStatus =
  | 'DRAFT'
  | 'RELEASED'
  | 'DEVELOPMENT'
  | 'CODE_REVIEW'
  | 'TESTING'
  | 'DONE';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ReviewType = 'CODE_REVIEW' | 'TESTING';
export type ReviewResult = 'PASSED' | 'REJECTED';
export type UserRole = 'TECHNICAL_LEAD' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'TESTER';

export interface TaskApproval {
  id: string;
  task_id: string;
  role: 'TECHNICAL_LEAD' | 'PROJECT_MANAGER';
  status: ApprovalStatus;
  approver_id?: string;
  approver_name?: string;
  notes?: string;
  actioned_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskReviewLog {
  id: string;
  task_id: string;
  review_type: ReviewType;
  result: ReviewResult;
  reviewer_id: string;
  reviewer_name: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  module_id: string;
  feature_id?: string | null;
  task_code: string;
  title: string;
  description?: string | null;
  complexity_weight: ComplexityWeight;
  estimated_man_hours: string | number;
  actual_man_hours: string | number;
  target_deadline: string;
  status: TaskStatus;
  is_pm_verified: boolean;
  pm_verified_at?: string | null;
  pm_verified_by?: string | null;
  is_tl_signed: boolean;
  tl_signed_at?: string | null;
  tl_signed_by?: string | null;
  assignee_id?: string | null;
  assignee_name?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  approvals?: TaskApproval[];
  reviewLogs?: TaskReviewLog[];
  module?: Module;
  feature?: Feature;
}

export interface Feature {
  id: string;
  module_id: string;
  code: string;
  name: string;
  description?: string | null;
  tasks?: Task[];
}

export interface Module {
  id: string;
  project_id: string;
  code: string;
  name: string;
  description?: string | null;
  features?: Feature[];
  tasks?: Task[];
}

export interface DeliverableProgress {
  totalTasks: number;
  completedTasks: number;
  totalEstimatedManHours: number;
  completedManHours: number;
  actualManHoursSpent: number;
  progressPercentage: number;
  tasksAtRiskOrOverdue: number;
  calculatedAt: string;
}
