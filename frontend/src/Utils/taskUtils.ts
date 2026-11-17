// src/Utils/taskUtils.ts
import type { ReviewType, Task, TaskApproval, TaskReviewLog, TaskStatus } from "@/Types/task";
import type { UserRole } from "@/Types/auth";

/**
 * Normalisasi array review logs baik dari relasi Laravel (`review_logs`) maupun camelCase (`reviewLogs`).
 */
export function getTaskReviewLogs(task?: Task | null): TaskReviewLog[] {
  if (!task) return [];
  return task.review_logs ?? task.reviewLogs ?? [];
}

/**
 * Menentukan apakah task berada dalam status REWORK aktif (kembali ke DEVELOPMENT setelah ada penolakan review).
 */
export function isTaskRework(task?: Task | null): boolean {
  if (!task) return false;
  if (task.rework) return true;
  if (task.status !== "DEVELOPMENT") return false;
  return getTaskReviewLogs(task).some((log) => log.result === "REJECTED");
}

/**
 * Mengambil nilai actual man-hours sesuai kontrak OpenAPI (`actual_man_hours`) dengan fallback legacy.
 */
export function getTaskActualManHours(task?: Task | null): number {
  if (!task) return 0;
  return Number(task.actual_man_hours ?? task.actual_man_hours_spent ?? 0) || 0;
}

/**
 * Mengambil timestamp aksi approval (`actioned_at` dari Laravel Model) dengan fallback aman.
 */
export function getApprovalTimestamp(approval?: TaskApproval | null): string | null {
  if (!approval) return null;
  return approval.actioned_at ?? approval.approved_at ?? approval.created_at ?? null;
}

/**
 * Peta transisi status Kanban yang diizinkan sesuai Finite State Machine PRD E-4.
 * Status `DONE` bersifat terminal (terkunci permanen) dan `DRAFT` hanya keluar via Dual-Approval Gate.
 */
export const ALLOWED_KANBAN_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  DRAFT: [],
  RELEASED: ["DEVELOPMENT"],
  DEVELOPMENT: ["CODE_REVIEW"],
  CODE_REVIEW: ["TESTING", "DEVELOPMENT"],
  TESTING: ["DONE", "DEVELOPMENT"],
  DONE: [],
} as const;

/**
 * Matriks RBAC transisi Kanban per pasangan status asal -> tujuan.
 * - DEVELOPER (FE/BE) hanya dapat menggeser fase pengerjaan (RELEASED -> DEVELOPMENT -> CODE_REVIEW),
 *   dan TIDAK berwenang menilai/menggeser kartu di CODE_REVIEW atau TESTING.
 * - TECHNICAL_LEAD & PROJECT_MANAGER berwenang pada Code Review dan DoD Sign-Off.
 * - TESTER berwenang pada QA Testing (termasuk memicu REWORK TESTING -> DEVELOPMENT).
 */
export const KANBAN_TRANSITION_ROLES: Partial<
  Record<`${TaskStatus}->${TaskStatus}`, readonly UserRole[]>
> = {
  "RELEASED->DEVELOPMENT": ["DEVELOPER", "TECHNICAL_LEAD", "PROJECT_MANAGER"],
  "DEVELOPMENT->CODE_REVIEW": ["DEVELOPER", "TECHNICAL_LEAD", "PROJECT_MANAGER"],
  "CODE_REVIEW->TESTING": ["TECHNICAL_LEAD", "PROJECT_MANAGER"],
  "CODE_REVIEW->DEVELOPMENT": ["TECHNICAL_LEAD", "PROJECT_MANAGER"],
  "TESTING->DEVELOPMENT": ["TECHNICAL_LEAD", "PROJECT_MANAGER"],
  "TESTING->DONE": ["PROJECT_MANAGER", "TECHNICAL_LEAD"],
};

export function canTransitionKanbanStatus(from: TaskStatus, to: TaskStatus): boolean {
  if (from === to) return false;
  return ALLOWED_KANBAN_TRANSITIONS[from].includes(to);
}

export function canRolePerformKanbanTransition(
  role: UserRole | null | undefined,
  from: TaskStatus,
  to: TaskStatus,
): boolean {
  if (!role || !canTransitionKanbanStatus(from, to)) return false;
  if (role === "TESTER") return false;
  const allowedRoles = KANBAN_TRANSITION_ROLES[`${from}->${to}`];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

/**
 * Menentukan apakah role memiliki minimal satu transisi valid dari status kartu saat ini.
 * Status DONE & DRAFT tidak dapat di-drag.
 * Role TESTER tidak dapat memindahkan kartu Kanban secara manual (wajib via review).
 * Role DEVELOPER dilarang menggeser kartu di CODE_REVIEW atau TESTING.
 */
export function canRoleDragKanbanCard(
  role: UserRole | null | undefined,
  status: TaskStatus,
): boolean {
  if (!role || status === "DONE" || status === "DRAFT") return false;
  if (role === "TESTER") return false;
  if (role === "DEVELOPER" && status !== "RELEASED" && status !== "DEVELOPMENT") return false;
  return ALLOWED_KANBAN_TRANSITIONS[status].some((target) =>
    canRolePerformKanbanTransition(role, status, target),
  );
}

/**
 * Label alasan terkunci untuk ditampilkan pada kartu Kanban jika role saat ini tidak berwenang menggeser fase tersebut.
 */
export function getKanbanLockHint(
  role: UserRole | null | undefined,
  status: TaskStatus,
): string | null {
  if (status === "DONE") return "Terkunci";
  if (canRoleDragKanbanCard(role, status)) return null;
  if (role === "TESTER") return "Gunakan Review Modal";
  if (status === "CODE_REVIEW") return "Menunggu TL / PM";
  if (status === "TESTING") return "Menunggu QA / DoD";
  return "Akses Terbatas";
}

/**
 * Pesan error eksplisit saat percobaan transisi Kanban ditolak oleh state machine atau RBAC backend.
 */
export function getTransitionRejectionReason(
  from: TaskStatus,
  to: TaskStatus,
  role?: UserRole | null,
): string {
  if (from === "DONE") {
    return "Tugas yang telah berstatus DONE bersifat final dan tidak dapat diubah kembali ke fase lain.";
  }
  if (from === "DRAFT") {
    return "Tugas masih berstatus DRAFT dan belum disetujui rilis (Dual-Approval) oleh TL dan PM.";
  }
  if (role === "TESTER") {
    return "Peran Tester tidak berwenang memindahkan kolom tugas secara manual. Gunakan endpoint review/testing.";
  }
  if (role === "DEVELOPER") {
    if (from === "CODE_REVIEW" || from === "TESTING") {
      return "Akses ditolak. Pengembang tidak berwenang mengubah status tugas yang sedang dalam tahap Code Review atau Testing.";
    }
    if (to === "DONE") {
      return "Hanya peran Technical Lead yang berwenang mengesahkan tugas menjadi DONE melalui otorisasi sign-off.";
    }
  }
  if (!canTransitionKanbanStatus(from, to)) {
    if (from === "RELEASED" && to !== "DEVELOPMENT") {
      return "Transisi tidak valid. Task Released harus masuk ke tahap Development terlebih dahulu.";
    }
    if (from === "DEVELOPMENT" && to !== "CODE_REVIEW") {
      return "Task dalam tahap Development hanya dapat diajukan ke Code Review sebelum masuk QA Testing atau Done.";
    }
    if (from === "CODE_REVIEW" && to === "DONE") {
      return "Task Code Review wajib lolos QA Testing sebelum masuk Definition of Done.";
    }
    return `Transisi status dari ${from} ke ${to} tidak diizinkan oleh aturan workflow Agile E-4.`;
  }

  if (role && !canRolePerformKanbanTransition(role, from, to)) {
    if (from === "CODE_REVIEW") {
      return "Akses ditolak. Hanya Technical Lead atau Project Manager yang berwenang melakukan Code Review dan memindahkan task dari tahap CODE REVIEW.";
    }
    if (from === "TESTING" && to === "DONE") {
      return "Akses ditolak. Hanya Project Manager dan Technical Lead yang berwenang melakukan Sign-Off DoD menuju DONE.";
    }
    if (from === "TESTING" && to === "DEVELOPMENT") {
      return "Akses ditolak. Hanya Technical Lead atau Project Manager yang berwenang memindahkan status dari QA Testing secara langsung.";
    }
    return `Akses ditolak. Peran ${role} tidak berwenang memindahkan task dari ${from} ke ${to}.`;
  }

  return `Transisi status dari ${from} ke ${to} tidak diizinkan.`;
}

/**
 * Menentukan apakah role berhak membuat task baru di papan/tasklist.
 * Guard Backend PR #7: Hanya TL dan PM yang berwenang membuat task baru (HTTP 403 untuk Developer/Tester).
 */
export function canCreateTaskRole(role?: UserRole | null): boolean {
  return role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
}

/**
 * Menentukan apakah role berhak mengelola struktur Module & Feature (SOP-05).
 */
export function canManageHierarchyRole(role?: UserRole | null): boolean {
  return role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
}

/**
 * Menentukan apakah role berhak melakukan Release Approval (`DRAFT -> RELEASED`).
 */
export function canApproveReleaseRole(role?: UserRole | null): boolean {
  return role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
}

/**
 * Menentukan apakah role berhak mengirim log Code Review atau QA Testing.
 */
export function canRoleSubmitReview(
  role: UserRole | null | undefined,
  reviewType: ReviewType,
): boolean {
  if (!role || role === "DEVELOPER") return false;
  if (reviewType === "CODE_REVIEW") {
    return role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
  }
  return role === "TESTER" || role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
}
