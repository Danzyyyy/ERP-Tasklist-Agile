// src/Utils/taskUtils.ts
import type { ReviewType, Task, TaskApproval, TaskReviewLog, TaskStatus } from "@/Types/task";
import type { UserRole } from "@/Types/auth";

/**
 * Helper parsing inisial nama PIC / Tim yang bersih dari tanda kurung peran.
 */
export function getInitials(name?: string | null): string {
  if (!name || name === "Belum Ditugaskan") return "--";
  const lower = name.toLowerCase();
  if (lower.includes("wildan") || lower.includes("tubagus")) return "TW";
  if (lower.includes("fauzan")) return "FZ";
  if (lower.includes("ariel")) return "AR";
  if (lower.includes("fajri")) return "FJ";
  if (lower.includes("valdric")) return "VD";

  const clean = name.replace(/\([^)]*\)/g, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Helper warna latar belakang inisial avatar.
 */
export function getAvatarBg(initials: string): string {
  switch (initials) {
    case "TW":
      return "bg-indigo-600 text-white";
    case "FZ":
      return "bg-emerald-600 text-white";
    case "AR":
      return "bg-purple-600 text-white";
    case "FJ":
      return "bg-blue-600 text-white";
    case "VD":
      return "bg-amber-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
}

/**
 * Helper semantic tone untuk AvatarFallback (Design Kit Avatar).
 */
export function getAvatarTone(
  initials: string,
): "indigo" | "emerald" | "purple" | "blue" | "amber" | "slate" {
  switch (initials) {
    case "TW":
      return "indigo";
    case "FZ":
      return "emerald";
    case "AR":
      return "purple";
    case "FJ":
      return "blue";
    case "VD":
      return "amber";
    default:
      return "slate";
  }
}

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
 * Mengambil nama PIC / Pelaksana tugas secara aman dengan fallback terstandarisasi.
 */
export function getTaskAssigneeName(task?: Task | null): string {
  if (!task) return "Belum Ditugaskan";
  if (typeof task.pic === "string" && task.pic.trim()) return task.pic;
  if (task.pic && typeof task.pic === "object" && task.pic.name) return task.pic.name;
  if (task.assignee_name && task.assignee_name.trim()) return task.assignee_name;
  return "Belum Ditugaskan";
}

/**
 * Mengambil nilai actual man-hours sesuai kontrak OpenAPI (`actual_man_hours`) dengan fallback legacy.
 */
export function getTaskActualManHours(task?: Task | null): number {
  if (!task) return 0;
  return task.actual_man_hours ?? task.actual_man_hours_spent ?? 0;
}

/**
 * Mengambil timestamp aksi approval (`actioned_at` dari Laravel Model) dengan fallback aman.
 */
export function getApprovalTimestamp(approval?: TaskApproval | null): string | null {
  if (!approval) return null;
  return approval.actioned_at ?? approval.approved_at ?? approval.created_at ?? null;
}

/**
 * Peta transisi status Kanban yang diizinkan sesuai alur kerja Agile.
 * Status `DONE` bersifat terminal (terkunci permanen) dan `DRAFT` hanya keluar via persetujuan TL & PM.
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
    return `Transisi status dari ${from} ke ${to} tidak diizinkan oleh aturan alur kerja Agile.`;
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
 * Hanya Technical Lead dan Project Manager yang berwenang membuat task baru.
 */
export function canCreateTaskRole(role?: UserRole | null): boolean {
  return role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";
}

/**
 * Menentukan apakah role berhak mengelola struktur Module & Feature.
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

/**
 * Menghitung man-hours progress (total vs selesai) untuk kumpulan task (fitur/modul).
 */
export function calculateTasksProgress(tasks: Task[] = []): { totalHours: number; doneHours: number; formattedText: string } {
  const totalHours = tasks.reduce((sum, t) => sum + (Number(t.estimated_man_hours) || 0), 0);
  const doneHours = tasks
    .filter((t) => t.status === "DONE")
    .reduce((sum, t) => sum + (Number(t.estimated_man_hours) || 0), 0);
  return {
    totalHours,
    doneHours,
    formattedText: `${doneHours.toFixed(0)} / ${totalHours.toFixed(0)} Jam`,
  };
}
