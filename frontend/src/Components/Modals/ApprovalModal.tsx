// src/Components/Modals/ApprovalModal.tsx
import React, { memo } from "react";
import { useApprovalGate } from "@/Hooks/useApprovalGate";
import { Modal } from "@/Components/Elements/Modal";
import { Alert } from "@/Components/Elements/Alert";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Label } from "@/Components/Elements/Label";
import { Textarea } from "@/Components/Elements/Textarea";
import { formatDateTime } from "@/Utils/formatters";
import { getApprovalTimestamp } from "@/Utils/taskUtils";
import type { Task } from "@/Types/task";
import { ShieldCheck, CheckCircle2, XCircle, UserCheck, AlertTriangle, Info } from "lucide-react";

export interface ApprovalModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalModal = memo<ApprovalModalProps>(({ task, isOpen, onClose }) => {
  const {
    register,
    errors,
    tlApproval,
    pmApproval,
    isTl,
    role,
    canApprove,
    handleDecision,
    isPending,
  } = useApprovalGate(task, onClose);

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <span>Persetujuan Rilis Tugas</span>
        </div>
      }
      description={
        <div className="wrap-break-word leading-relaxed">
          Evaluasi rilis untuk tugas{" "}
          <strong className="font-mono text-foreground">{task.task_code}</strong>: "{task.title}".
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] text-muted-foreground font-mono">
            Status Tugas: <b className="text-foreground">{task.status}</b>
          </span>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-foreground">
        {/* Status of Both Approvals */}
        <div className="grid grid-cols-2 gap-3">
          {/* TL Status Box */}
          <div
            className={`p-3.5 rounded-xl border ${
              tlApproval?.status === "APPROVED"
                ? "border-success-subtle-border bg-success-subtle/50"
                : tlApproval?.status === "REJECTED"
                  ? "border-destructive-subtle-border bg-destructive-subtle/50"
                  : "border-border bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-warning-subtle-foreground" />
                Technical Lead (TL)
              </span>
              <Badge variant={tlApproval?.status || "PENDING"} dot>
                {tlApproval?.status || "PENDING"}
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed italic">
              {tlApproval?.notes || "Belum ada catatan persetujuan teknis dari TL."}
            </p>
            {tlApproval?.approver_name && (
              <span className="text-[9px] text-muted-foreground block mt-1.5">
                Oleh: {tlApproval.approver_name} · {formatDateTime(getApprovalTimestamp(tlApproval))}
              </span>
            )}
          </div>

          {/* PM Status Box */}
          <div
            className={`p-3.5 rounded-xl border ${
              pmApproval?.status === "APPROVED"
                ? "border-success-subtle-border bg-success-subtle/50"
                : pmApproval?.status === "REJECTED"
                  ? "border-destructive-subtle-border bg-destructive-subtle/50"
                  : "border-border bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-primary" />
                Project Manager (PM)
              </span>
              <Badge variant={pmApproval?.status || "PENDING"} dot>
                {pmApproval?.status || "PENDING"}
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed italic">
              {pmApproval?.notes || "Belum ada catatan persetujuan manajerial dari PM."}
            </p>
            {pmApproval?.approver_name && (
              <span className="text-[9px] text-muted-foreground block mt-1.5">
                Oleh: {pmApproval.approver_name} · {formatDateTime(getApprovalTimestamp(pmApproval))}
              </span>
            )}
          </div>
        </div>

        {/* Business Rule Explanation */}
        <div className="p-3 rounded-lg bg-primary-subtle/50 border border-primary-subtle-border flex items-start gap-2 text-[11px] text-primary-subtle-foreground leading-relaxed">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <b>Aturan Rilis Tugas:</b> Tugas baru resmi berstatus <b>RELEASED</b> dan masuk ke
            papan Agile Kanban setelah <b>Technical Lead dan Project Manager</b> memberikan
            persetujuan (APPROVED). Bila baru satu pihak, status tugas tetap <b>DRAFT</b>.
          </div>
        </div>

        {/* Action Panel for Current Role */}
        {canApprove ? (
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-foreground">
                Tindakan Persetujuan Anda sebagai{" "}
                <span className="text-primary">{isTl ? "Technical Lead" : "Project Manager"}</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Role: {role}</span>
            </div>

            <div>
              <Label size="sm" className="mb-1">
                Catatan / Justifikasi Keputusan:
              </Label>
              <Textarea
                placeholder={
                  isTl
                    ? "Contoh: Estimasi arsitektur dan beban kerja terverifikasi sesuai standar teknis."
                    : "Contoh: Alokasi anggaran sprint dan ketersediaan resource disetujui."
                }
                rows={2}
                error={Boolean(errors.notes)}
                {...register("notes")}
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
          <Alert variant="warning" className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="size-4 text-warning-subtle-foreground shrink-0" />
              <span>Akses Approval Dibatasi untuk Peran Anda</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Anda saat ini aktif sebagai <b>{role}</b>. Hanya <b>Technical Lead</b> dan{" "}
              <b>Project Manager</b> yang berwenang menyetujui rilis tugas.
            </p>
            <p className="text-[10px] text-warning-subtle-foreground/80 italic">
              Tip: Silakan Keluar (Logout) melalui menu profil di kanan atas, lalu masuk sebagai
              Technical Lead atau Project Manager di Login Page.
            </p>
          </Alert>
        )}
      </div>
    </Modal>
  );
});

ApprovalModal.displayName = "ApprovalModal";
export default ApprovalModal;
