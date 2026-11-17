// src/Components/Modals/SignOffModal.tsx
import React, { memo } from "react";
import { useSignOffForm } from "@/Hooks/useSignOffForm";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import type { Task } from "@/Types/task";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  UserCheck,
} from "lucide-react";

export interface SignOffModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SignOffModal = memo<SignOffModalProps>(({ task, isOpen, onClose }) => {
  const {
    activeTask,
    isPm,
    isTl,
    isPmVerified,
    isTlSigned,
    handlePmVerify,
    handleTlSignoff,
    isPmPending,
    isTlPending,
    isPending,
  } = useSignOffForm(task, onClose, isOpen);

  if (!task) return null;
  const displayTask = activeTask ?? task;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <FileCheck2 className="size-5 text-success" />
          <span>Two-Gate Definition of Done (DoD) Sign-Off</span>
          <span className="text-[10px] font-mono font-bold bg-success-subtle text-success-subtle-foreground px-2 py-0.5 rounded border border-success-subtle-border">
            FTR-K04-06
          </span>
        </div>
      }
      description={
        <div className="wrap-break-word leading-relaxed">
          Otorisasi penyelesaian tugas{" "}
          <strong className="font-mono text-foreground">{displayTask.task_code}</strong>: "
          {displayTask.title}".
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] text-muted-foreground font-mono">
            Status: <b className="text-foreground">{displayTask.status}</b>
          </span>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-foreground">
        {/* Gate 1: PM Verification */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isPmVerified
              ? "border-success-subtle-border bg-success-subtle/40"
              : "border-border bg-card shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-subtle text-primary font-bold text-[10px] grid place-items-center">
                1
              </span>
              <h4 className="font-bold text-foreground text-xs">
                Gerbang 1: Verifikasi Kelayakan (Project Manager)
              </h4>
            </div>
            <Badge variant={isPmVerified ? "APPROVED" : "PENDING"} dot>
              {isPmVerified ? "TERVERIFIKASI" : "BELUM"}
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground mb-3">
            Project Manager memvalidasi kelayakan penyelesaian tugas dan keselarasan deliverable (SOP-08) sebelum pintu otorisasi TL terbuka.
          </p>

          {!isPmVerified ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">
                {isPm
                  ? "Klik tombol di samping untuk mengesahkan verifikasi kelayakan."
                  : "Hanya peran Project Manager yang berwenang memvalidasi kelayakan tugas ini."}
              </span>
              {isPm ? (
                <Button
                  variant="primary"
                  size="sm"
                  loading={isPmPending}
                  onClick={handlePmVerify}
                >
                  <UserCheck className="size-3.5 mr-1" />
                  Validasi Kelayakan PM
                </Button>
              ) : (
                <span className="text-[10px] font-semibold text-warning-subtle-foreground flex items-center gap-1">
                  <Lock className="size-3" />
                  Menunggu Aksi PM
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-success-subtle-foreground flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4 text-success" />
              <span>
                Verifikasi kelayakan berhasil divalidasi oleh{" "}
                {displayTask.pm_verified_by || "Project Manager"}
                {displayTask.pm_verified_at ? ` (${displayTask.pm_verified_at.split("T")[0]})` : ""}. Gerbang 2 kini aktif!
              </span>
            </div>
          )}
        </div>

        {/* Gate 2: TL Final Sign-off */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isTlSigned
              ? "border-success-subtle-border bg-success-subtle/40"
              : isPmVerified
                ? "border-primary-subtle-border bg-primary-subtle/20 shadow-2xs"
                : "border-border bg-muted/30 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-warning-subtle text-warning-subtle-foreground font-bold text-[10px] grid place-items-center">
                2
              </span>
              <h4 className="font-bold text-foreground text-xs">
                Gerbang 2: Otorisasi Pengesahan Akhir DONE (Technical Lead)
              </h4>
            </div>
            <Badge variant={isTlSigned ? "APPROVED" : "PENDING"} dot>
              {isTlSigned ? "DISAHKAN" : "BELUM"}
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground mb-3">
            Otoritas tunggal penutupan tugas resmi berada di tangan Technical Lead (SOP-08).
          </p>

          {!isPmVerified ? (
            <div className="p-2.5 rounded-lg bg-warning-subtle border border-warning-subtle-border text-warning-subtle-foreground text-[11px] flex items-center gap-2">
              <AlertCircle className="size-4 text-warning-subtle-foreground shrink-0" />
              <span>
                <b>Tombol Terkunci:</b> Verifikasi kelayakan PM (Gerbang 1) wajib dipenuhi sebelum TL
                dapat mengesahkan tugas menjadi Done (aturan 422 backend).
              </span>
            </div>
          ) : !isTlSigned ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">
                {isTl
                  ? "Gerbang 1 telah lolos. Klik tombol untuk mengesahkan tugas menjadi DONE."
                  : "Hanya peran Technical Lead yang berwenang melakukan final sign-off penutupan tugas."}
              </span>
              {isTl ? (
                <Button variant="success" loading={isTlPending} onClick={handleTlSignoff}>
                  <ShieldCheck className="size-4 mr-1.5" />
                  Otorisasi Selesai / Sign-off DONE
                </Button>
              ) : (
                <span className="text-[10px] font-semibold text-warning-subtle-foreground flex items-center gap-1">
                  <Lock className="size-3" />
                  Menunggu Otorisasi TL
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-success-subtle-foreground flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="size-4 text-success" />
              <span>
                Tugas resmi disahkan berstatus DONE oleh{" "}
                {displayTask.tl_signed_by || "Technical Lead"}
                {displayTask.tl_signed_at ? ` (${displayTask.tl_signed_at.split("T")[0]})` : ""}! Progres deliverable telah
                diperbarui otomatis.
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
});

SignOffModal.displayName = "SignOffModal";
export default SignOffModal;
