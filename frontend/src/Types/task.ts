// src/Types/task.ts

export type ComplexityWeight = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "DRAFT" | "RELEASED" | "DEVELOPMENT" | "CODE_REVIEW" | "TESTING" | "DONE";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReviewType = "CODE_REVIEW" | "TESTING";

export type ReviewResult = "PASSED" | "REJECTED";

export interface TaskApproval {
  id: string;
  task_id: string;
  role: "TECHNICAL_LEAD" | "PROJECT_MANAGER";
  status: ApprovalStatus;
  approver_id?: string | null;
  approver_name?: string | null;
  notes?: string | null;
  approved_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TaskReviewLog {
  id: string;
  task_id: string;
  review_type: ReviewType;
  result: ReviewResult;
  reviewer_id?: string | null;
  reviewer_name?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Feature {
  id: string;
  module_id: string;
  code: string;
  name: string;
  description?: string | null;
  tasks?: Task[];
  created_at?: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  project_id: string;
  code: string;
  name: string;
  description?: string | null;
  features?: Feature[];
  tasks?: Task[];
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  module_id: string;
  feature_id?: string | null;
  task_code: string;
  title: string;
  description?: string | null;
  complexity_weight: ComplexityWeight;
  estimated_man_hours: number;
  actual_man_hours_spent?: number;
  target_deadline: string;
  status: TaskStatus;
  assignee_id?: string | null;
  assignee_name?: string | null;
  is_pm_verified?: boolean;
  pm_verified_by?: string | null;
  pm_verified_at?: string | null;
  is_tl_signed?: boolean;
  tl_signed_by?: string | null;
  tl_signed_at?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  module?: Module;
  feature?: Feature;
  approvals?: TaskApproval[];
  reviewLogs?: TaskReviewLog[];
  dependencies?: any[];
  rework?: boolean;
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
