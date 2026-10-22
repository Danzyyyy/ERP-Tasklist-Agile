// src/Features/Tasks/Components/TaskDetailModal.tsx
import React, { memo } from "react";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { formatDate, formatDateTime, formatManHours } from "@/Utils/formatters";
import type { Task } from "@/Types/task";
import {
  Clock,
  Calendar,
  User,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck2,
  FolderTree,
} from "lucide-react";

export interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApproval?: (task: Task) => void;
  onOpenReview?: (task: Task) => void;
  onOpenSignoff?: (task: Task) => void;
}

export const TaskDetailModal = memo<TaskDetailModalProps>(({
  task,
  isOpen,
  onClose,
  onOpenApproval,
  onOpenReview,
  onOpenSignoff,
}) => {
  if (!task) return null;

  const tlApproval = task.approvals?.find((a) => a.role === "TECHNICAL_LEAD");
  const pmApproval = task.approvals?.find((a) => a.role === "PROJECT_MANAGER");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="space-y-1.5 pr-2">
          {/* Top meta tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 shrink-0">
              {task.task_code}
            </span>
            <Badge variant={task.status as any} dot className="shrink-0">
              {task.status}
            </Badge>
            {task.rework && (
              <Badge variant="REWORK" className="shrink-0">
                REWORK
              </Badge>
            )}
          </div>

          {/* Full Task Title without truncation or badge overflow */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words">
            {task.title}
          </h2>
        </div>
      }
      description={
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-1">
          <FolderTree className="size-3.5 text-slate-400 shrink-0" />
          <span className="break-words">
            {task.module ? `${task.module.code} — ${task.module.name}` : "Modul E-4"}
          </span>
          {task.feature && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600 font-medium break-words">
                {task.feature.code} — {task.feature.name}
              </span>
            </>
          )}
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-slate-400">
            ID: <span className="font-mono text-[10px]">{task.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {task.status === "DRAFT" && onOpenApproval && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onOpenApproval(task);
                }}
              >
                Keputusan Dual-Approval
              </Button>
            )}
            {(task.status === "CODE_REVIEW" || task.status === "TESTING") && onOpenReview && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onOpenReview(task);
                }}
              >
                Catat Review / Testing
              </Button>
            )}
            {task.status === "TESTING" && onOpenSignoff && (
              <Button
                variant="success"
                onClick={() => {
                  onClose();
                  onOpenSignoff(task);
                }}
              >
                Sign-Off Selesai (DoD)
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Metric Badges */}
        <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Bobot Kompleksitas</span>
            <div className="mt-1">
              <Badge variant={task.complexity_weight as any}>
                {task.complexity_weight} (Q-01)
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Estimasi Man-Hour</span>
            <strong className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1 mt-1">
              <Clock className="size-3 text-blue-500" />
              {formatManHours(task.estimated_man_hours)}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Tenggat Waktu</span>
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-1">
              <Calendar className="size-3 text-amber-500" />
              {formatDate(task.target_deadline)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">PIC Pelaksana</span>
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-1 truncate">
              <User className="size-3 text-indigo-500" />
              {task.assignee_name || "Belum Ditugaskan"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-bold text-slate-800 mb-1">Deskripsi & Catatan</h4>
          <p className="bg-white border border-slate-200 rounded-lg p-3 text-slate-600 leading-relaxed text-[11px] whitespace-pre-wrap">
            {task.description || "Tidak ada deskripsi tambahan."}
          </p>
        </div>

        {/* Dual-Approval Status Box */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-blue-600" />
              <span>Status Dual-Approval Rilis (FTR-K04-03)</span>
            </h4>
            <span className="text-[10px] text-slate-400">Syarat: TL & PM wajib setuju</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* TL Approval */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-slate-800">1. Technical Lead (TL)</span>
                <Badge variant={tlApproval?.status as any || "PENDING"}>
                  {tlApproval?.status || "PENDING"}
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                {tlApproval?.notes || "Menunggu evaluasi arsitektur dan estimasi waktu."}
              </p>
              {tlApproval?.approver_name && (
                <span className="text-[9px] text-slate-400 block mt-1">
                  Oleh: {tlApproval.approver_name} ({formatDateTime(tlApproval.approved_at)})
                </span>
              )}
            </div>

            {/* PM Approval */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-slate-800">2. Project Manager (PM)</span>
                <Badge variant={pmApproval?.status as any || "PENDING"}>
                  {pmApproval?.status || "PENDING"}
                </Badge>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                {pmApproval?.notes || "Menunggu verifikasi alokasi kapasitas sprint."}
              </p>
              {pmApproval?.approver_name && (
                <span className="text-[9px] text-slate-400 block mt-1">
                  Oleh: {pmApproval.approver_name} ({formatDateTime(pmApproval.approved_at)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Definition of Done Sign-off Gate (FTR-K04-06) */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
            <FileCheck2 className="size-4 text-emerald-600" />
            <span>Two-Gate Definition of Done Sign-Off (FTR-K04-06)</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${task.is_pm_verified ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-50/60"}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">Gerbang 1: Ceklis PM</span>
                <Badge variant={task.is_pm_verified ? "APPROVED" : "PENDING"}>
                  {task.is_pm_verified ? "TERVERIFIKASI" : "BELUM"}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                {task.is_pm_verified ? `Diverifikasi oleh: ${task.pm_verified_by || "PM"}` : "Menunggu verifikasi kelayakan fungsional PM"}
              </span>
            </div>

            <div className={`p-3 rounded-lg border ${task.is_tl_signed ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-50/60"}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">Gerbang 2: Sign-Off TL (DONE)</span>
                <Badge variant={task.is_tl_signed ? "APPROVED" : "PENDING"}>
                  {task.is_tl_signed ? "DISAHKAN" : "BELUM"}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                {task.is_tl_signed ? `Disahkan oleh: ${task.tl_signed_by || "TL"}` : "Membutuhkan Gerbang 1 lolos sebelum disahkan"}
              </span>
            </div>
          </div>
        </div>

        {/* Review & Testing Logs */}
        {task.reviewLogs && task.reviewLogs.length > 0 && (
          <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
              <History className="size-4 text-slate-500" />
              <span>Riwayat Pemeriksaan Review & QA Testing ({task.reviewLogs.length})</span>
            </h4>
            <div className="space-y-2">
              {task.reviewLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-lg border text-[11px] ${
                    log.result === "REJECTED"
                      ? "border-red-200 bg-red-50/40"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">
                      {log.review_type === "CODE_REVIEW" ? "Code Review" : "QA Testing"} —{" "}
                      {log.reviewer_name || "Pemeriksa"}
                    </span>
                    <Badge variant={log.result === "PASSED" ? "APPROVED" : "REJECTED"}>
                      {log.result}
                    </Badge>
                  </div>
                  {log.notes && <p className="mt-1 text-slate-600 italic">"{log.notes}"</p>}
                  <span className="text-[9px] text-slate-400 block mt-1">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

TaskDetailModal.displayName = "TaskDetailModal";
export default TaskDetailModal;
