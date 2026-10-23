// src/Features/Approvals/Components/ApprovalModal.tsx
import React, { memo, useState } from "react";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import useSubmitApproval from "../Hooks/useSubmitApproval";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Textarea } from "@/Components/Elements/Textarea";
import { formatDateTime } from "@/Utils/formatters";
import type { Task } from "@/Types/task";
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, UserCheck, Info } from "lucide-react";

export interface ApprovalModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalModal = memo<ApprovalModalProps>(({ task, isOpen, onClose }) => {
  const { role, user } = useAuth();
  const [notes, setNotes] = useState("");

  const { mutate: submitApproval, isPending } = useSubmitApproval(task?.id, () => {
    setNotes("");
    onClose();
  });

  if (!task) return null;

  const tlApproval = task.approvals?.find((a) => a.role === "TECHNICAL_LEAD");
  const pmApproval = task.approvals?.find((a) => a.role === "PROJECT_MANAGER");

  const isTl = role === "TECHNICAL_LEAD";
  const isPm = role === "PROJECT_MANAGER";
  const canApprove = isTl || isPm;

  const handleDecision = (status: "APPROVED" | "REJECTED") => {
    submitApproval({
      status,
      notes:
        notes.trim() ||
        (status === "APPROVED"
          ? `Disetujui oleh ${user?.name || role} sesuai SOP-07.`
          : `Ditolak oleh ${user?.name || role}. Perlu penyesuaian estimasi/skup.`),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-blue-600" />
          <span>Dual-Approval Task Release Gate</span>
          <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
            FTR-K04-03
          </span>
        </div>
      }
      description={
        <div className="wrap-break-word leading-relaxed">
          Evaluasi rilis untuk tugas{" "}
          <strong className="font-mono text-slate-800">{task.task_code}</strong>: "{task.title}".
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] text-slate-400 font-mono">
            Status Tugas: <b className="text-slate-700">{task.status}</b>
          </span>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Status of Both Approvals */}
        <div className="grid grid-cols-2 gap-3">
          {/* TL Status Box */}
          <div
            className={`p-3.5 rounded-xl border ${
              tlApproval?.status === "APPROVED"
                ? "border-emerald-200 bg-emerald-50/50"
                : tlApproval?.status === "REJECTED"
                  ? "border-red-200 bg-red-50/50"
                  : "border-slate-200 bg-slate-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-amber-600" />
                Technical Lead (TL)
              </span>
              <Badge variant={(tlApproval?.status as any) || "PENDING"} dot>
                {tlApproval?.status || "PENDING"}
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-slate-600 leading-relaxed italic">
              {tlApproval?.notes || "Belum ada catatan persetujuan teknis dari TL."}
            </p>
            {tlApproval?.approver_name && (
              <span className="text-[9px] text-slate-400 block mt-1.5">
                Oleh: {tlApproval.approver_name} · {formatDateTime(tlApproval.approved_at)}
              </span>
            )}
          </div>

          {/* PM Status Box */}
          <div
            className={`p-3.5 rounded-xl border ${
              pmApproval?.status === "APPROVED"
                ? "border-emerald-200 bg-emerald-50/50"
                : pmApproval?.status === "REJECTED"
                  ? "border-red-200 bg-red-50/50"
                  : "border-slate-200 bg-slate-50/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-indigo-600" />
                Project Manager (PM)
              </span>
              <Badge variant={(pmApproval?.status as any) || "PENDING"} dot>
                {pmApproval?.status || "PENDING"}
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-slate-600 leading-relaxed italic">
              {pmApproval?.notes || "Belum ada catatan persetujuan manajerial dari PM."}
            </p>
            {pmApproval?.approver_name && (
              <span className="text-[9px] text-slate-400 block mt-1.5">
                Oleh: {pmApproval.approver_name} · {formatDateTime(pmApproval.approved_at)}
              </span>
            )}
          </div>
        </div>

        {/* Business Rule Explanation */}
        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-start gap-2 text-[11px] text-blue-900 leading-relaxed">
          <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <b>Aturan Rilis SOP-07:</b> Tugas baru resmi berstatus <b>RELEASED</b> dan masuk ke
            papan Agile Kanban hanya bila <b>kedua belah pihak (TL & PM)</b> telah memberikan
            persetujuan (APPROVED). Bila baru satu pihak, status tugas tetap <b>DRAFT</b>.
          </div>
        </div>

        {/* Action Panel for Current Role */}
        {canApprove ? (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">
                Tindakan Persetujuan Anda sebagai{" "}
                <span className="text-blue-600">{isTl ? "Technical Lead" : "Project Manager"}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Role: {role}</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Catatan / Justifikasi Keputusan:
              </label>
              <Textarea
                placeholder={
                  isTl
                    ? "Contoh: Estimasi arsitektur dan beban kerja terverifikasi sesuai standar teknis."
                    : "Contoh: Alokasi anggaran sprint dan ketersediaan resource disetujui."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="destructive"
                loading={isPending}
                onClick={() => handleDecision("REJECTED")}
              >
                <XCircle className="size-3.5 mr-1" />
                Tolak Rilis (Rejected)
              </Button>
              <Button
                variant="success"
                loading={isPending}
                onClick={() => handleDecision("APPROVED")}
              >
                <CheckCircle2 className="size-3.5 mr-1" />
                Setujui Rilis (Approved)
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
              <span>Akses Approval Dibatasi untuk Peran Anda</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Anda saat ini aktif sebagai <b>{role}</b>. Berdasarkan kontrak bisnis SOP-07 dan
              penolakan HTTP 403 backend, hanya <b>Technical Lead</b> dan <b>Project Manager</b>{" "}
              yang berwenang menyetujui rilis tugas.
            </p>
            <p className="text-[10px] text-amber-700 italic">
              Tip: Silakan Keluar (Logout) melalui menu profil di kanan atas, lalu masuk sebagai
              Technical Lead atau Project Manager di Login Page.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
});

ApprovalModal.displayName = "ApprovalModal";
export default ApprovalModal;
