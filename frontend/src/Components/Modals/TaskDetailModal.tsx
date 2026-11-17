// src/Components/Modals/TaskDetailModal.tsx
import React, { memo, useState } from "react";
import { Modal } from "@/Components/Elements/Modal";
import type { Task } from "@/Types/task";
import { useAuth } from "@/Hooks/useAuth";
import { useSubmitReview } from "@/Hooks/useSubmitReview";
import { usePmVerify } from "@/Hooks/usePmVerify";
import { useTlSignoff } from "@/Hooks/useTlSignoff";
import { Clock, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/Utils/cn";
import { toast } from "sonner";

export interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApproval?: (task: Task) => void;
  onOpenReview?: (task: Task) => void;
  onOpenSignoff?: (task: Task) => void;
}

export const TaskDetailModal = memo<TaskDetailModalProps>(({ task, isOpen, onClose }) => {
  const { user } = useAuth();
  const userRole = user?.role || "PROJECT_MANAGER";

  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);
  const [reviewStatus, setReviewStatus] = useState<"PASS" | "REVISE">("PASS");
  const [reviewNotes, setReviewNotes] = useState("Tidak ada temuan kritis. Indeks & constraint relasi siap diuji QA.");

  const [checklist, setChecklist] = useState({
    c1: true,
    c2: true,
    c3: true,
    c4: false,
  });

  const submitReviewMutation = useSubmitReview(task?.id, () => {
    onClose();
  });

  const pmVerifyMutation = usePmVerify(task?.id, () => {
    toast.success("Verifikasi kelayakan PM berhasil diperbarui.");
  });

  const tlSignoffMutation = useTlSignoff(task?.id, () => {
    onClose();
  });

  if (!task) return null;

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const isPmVerified = Boolean(task.is_pm_verified);
  const isTlSigned = Boolean(task.is_tl_signed);

  const taskCode = task.task_code || "#TSK-01";
  const modCode = task.module?.code || "MOD-01";
  const modName = task.module?.name || "Manajemen Rekening";
  const title = task.title || "DDL & Skema DB";
  const featureName = task.feature?.name || "Umum";
  const statusText = task.status === "DEVELOPMENT" ? "In Progress" : task.status;
  const hours = Number(task.estimated_man_hours) || 8;
  const picName = typeof task.pic === "string" ? task.pic : task.pic?.name || "Fajri";

  const handleRejectToDevelopment = async () => {
    if (userRole === "DEVELOPER") {
      toast.error("Pengembang tidak berwenang menolak review tugas.");
      return;
    }
    const notes = reviewNotes.trim() || "Pemeriksaan ditolak. Terdapat revisi yang perlu diperbaiki.";
    const revType = task.status === "CODE_REVIEW" ? "CODE_REVIEW" : "TESTING";
    await submitReviewMutation.mutateAsync({
      review_type: revType,
      result: "REJECTED",
      notes,
    });
  };

  const handlePassCurrentStage = async () => {
    if (task.status === "CODE_REVIEW") {
      if (!["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole)) {
        toast.error("Hanya Technical Lead atau Project Manager yang berwenang meloloskan Code Review.");
        return;
      }
      await submitReviewMutation.mutateAsync({
        review_type: "CODE_REVIEW",
        result: "PASSED",
        notes: reviewNotes || "Code review disetujui (Pass).",
      });
    } else if (task.status === "TESTING") {
      if (isPmVerified && userRole === "TECHNICAL_LEAD") {
        await tlSignoffMutation.mutateAsync();
      } else if (!isPmVerified && userRole === "PROJECT_MANAGER") {
        await pmVerifyMutation.mutateAsync();
      } else {
        toast.info("Lengkapi ceklis PM dan otorisasi akhir TL untuk menyelesaikan tugas.");
      }
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title="Pemeriksaan & Pengesahan Tugas"
      description={`${taskCode} · ${modCode} | ${title} | ${modName} / ${featureName} | ${statusText} | ${hours}.00 Jam | ${picName} | Tenggat: ${task.target_deadline ? task.target_deadline.split("T")[0] : "-"}`}
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">
          <button
            type="button"
            onClick={handleRejectToDevelopment}
            disabled={submitReviewMutation.isPending || task.status === "DONE"}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto"
          >
            ← Tolak & Kembalikan ke Development
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Tutup
            </button>
            {task.status !== "DONE" && (
              <button
                type="button"
                onClick={handlePassCurrentStage}
                disabled={submitReviewMutation.isPending || tlSignoffMutation.isPending}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="size-3.5" />
                <span>
                  {task.status === "CODE_REVIEW"
                    ? "Loloskan Code Review"
                    : isPmVerified
                    ? "Otorisasi Sign-Off Done (TL)"
                    : "Verifikasi Kelayakan (PM)"}
                </span>
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Section Indicator */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase">
            UI-K04-04 · TASK INSPECTION & DEFINITION OF DONE
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            Status: <b className="text-foreground">{task.status}</b>
          </span>
        </div>

        {/* 3 Step Stage Cards (FigCraft 1:1) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Step 1: Code Review */}
          <div
            onClick={() => setActiveTab(1)}
            className={cn(
              "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5",
              activeTab === 1
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-card hover:bg-muted/40",
            )}
          >
            {task.status === "TESTING" || task.status === "DONE" ? (
              <Check className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className={cn("size-4 shrink-0", activeTab === 1 ? "text-primary" : "text-muted-foreground")} />
            )}
            <div>
              <h5 className="text-xs font-bold text-foreground">1. Code Review</h5>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {task.status === "CODE_REVIEW" ? "Peninjauan kode oleh TL" : "Disetujui"}
              </p>
            </div>
          </div>

          {/* Step 2: QA Testing */}
          <div
            onClick={() => setActiveTab(2)}
            className={cn(
              "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5",
              activeTab === 2
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-card hover:bg-muted/40",
            )}
          >
            {task.status === "DONE" ? (
              <Check className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className={cn("size-4 shrink-0", activeTab === 2 ? "text-primary" : "text-muted-foreground")} />
            )}
            <div>
              <h5 className="text-xs font-bold text-foreground">2. QA Testing</h5>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {task.status === "TESTING" ? "Verifikasi fungsional & bug" : task.status === "DONE" ? "Lolos uji" : "Belum dimulai"}
              </p>
            </div>
          </div>

          {/* Step 3: Pengesahan Selesai */}
          <div
            onClick={() => setActiveTab(3)}
            className={cn(
              "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5",
              activeTab === 3
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-card hover:bg-muted/40",
            )}
          >
            {task.status === "DONE" ? (
              <Check className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className={cn("size-4 shrink-0", activeTab === 3 ? "text-primary" : "text-muted-foreground")} />
            )}
            <div>
              <h5 className="text-xs font-bold text-foreground">3. Pengesahan Selesai</h5>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {task.status === "DONE" ? "Tugas resmi DONE" : "Final sign-off TL & rilis"}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Inspection Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Review Form & TL Authorization */}
          <div className="space-y-4">
            {/* Review Notes Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs">
              <div>
                <h5 className="text-xs font-bold text-foreground">
                  Catatan {task.status === "CODE_REVIEW" ? "Code Review" : "QA Testing"}
                </h5>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Verifikasi kualitas kode sebelum masuk ke pengujian QA dan rilis.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
                  <input
                    type="radio"
                    name="review_decision"
                    checked={reviewStatus === "PASS"}
                    onChange={() => setReviewStatus("PASS")}
                    className="text-primary focus:ring-primary size-3.5"
                  />
                  <span>Disetujui (Pass)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
                  <input
                    type="radio"
                    name="review_decision"
                    checked={reviewStatus === "REVISE"}
                    onChange={() => setReviewStatus("REVISE")}
                    className="text-primary focus:ring-primary size-3.5"
                  />
                  <span>Perlu Revisi (Rework)</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">Catatan / Temuan Bug</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full text-xs rounded-lg border border-border bg-card p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={handlePassCurrentStage}
                disabled={submitReviewMutation.isPending || task.status === "DONE"}
                className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitReviewMutation.isPending ? "Menyimpan..." : "Simpan Hasil Review"}
              </button>
            </div>

            {/* Otorisasi Akhir TL Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-foreground">Otorisasi Akhir TL</h5>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold font-mono",
                    isTlSigned
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                      : "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300",
                  )}
                >
                  {isTlSigned ? "DONE" : "MENUNGGU"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Technical Lead · Otoritas Final</p>

              <div className="py-1">
                <div className="text-sm font-extrabold text-foreground">
                  {isPmVerified ? "Ceklis PM Lengkap ✓" : `${checkedCount}/4 persyaratan terpenuhi`}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Lengkapi seluruh ceklis verifikasi PM sebelum otorisasi akhir TL.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (userRole !== "TECHNICAL_LEAD") {
                    toast.error("Hanya Technical Lead yang berwenang melakukan final sign-off penutupan tugas.");
                    return;
                  }
                  await tlSignoffMutation.mutateAsync();
                }}
                disabled={tlSignoffMutation.isPending || (!isPmVerified && checkedCount < 4) || isTlSigned}
                className={cn(
                  "w-full px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5",
                  isTlSigned
                    ? "bg-emerald-600 text-white cursor-default"
                    : !isPmVerified && checkedCount < 4
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs",
                )}
              >
                <CheckCircle2 className="size-3.5" />
                <span>{tlSignoffMutation.isPending ? "Mengesahkan..." : isTlSigned ? "Tugas Telah Di-Sign-off" : "Sahkan & Tutup Tiket"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Ceklis Verifikasi PM */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h5 className="text-xs font-bold text-foreground">Ceklis Verifikasi PM</h5>
                <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[9px] font-bold font-mono">
                  PM ONLY
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[10px] font-bold font-mono">
                {isPmVerified ? "TERVERIFIKASI" : `${checkedCount}/4 ${checkedCount === 4 ? "LENGKAP" : "BELUM LENGKAP"}`}
              </span>
            </div>

            <div className="space-y-2.5">
              <label className="p-3 rounded-xl border border-border bg-card hover:bg-muted/30 flex items-start gap-2.5 cursor-pointer transition-colors block">
                <input
                  type="checkbox"
                  checked={checklist.c1}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, c1: e.target.checked }))}
                  className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <div>
                  <h6 className="text-xs font-bold text-foreground leading-snug">Sesuai dengan acceptance criteria modul</h6>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Fungsionalitas utama telah diuji</p>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-border bg-card hover:bg-muted/30 flex items-start gap-2.5 cursor-pointer transition-colors block">
                <input
                  type="checkbox"
                  checked={checklist.c2}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, c2: e.target.checked }))}
                  className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <div>
                  <h6 className="text-xs font-bold text-foreground leading-snug">Tidak ada regression pada modul terkait</h6>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Integrasi antar fitur tetap stabil</p>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-border bg-card hover:bg-muted/30 flex items-start gap-2.5 cursor-pointer transition-colors block">
                <input
                  type="checkbox"
                  checked={checklist.c3}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, c3: e.target.checked }))}
                  className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <div>
                  <h6 className="text-xs font-bold text-foreground leading-snug">Dokumentasi teknis & API diperbarui</h6>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Endpoint & skema tercatat rapi</p>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-border bg-card hover:bg-muted/30 flex items-start gap-2.5 cursor-pointer transition-colors block">
                <input
                  type="checkbox"
                  checked={checklist.c4}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, c4: e.target.checked }))}
                  className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <div>
                  <h6 className="text-xs font-bold text-foreground leading-snug">Siap untuk sign-off Tech Lead</h6>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Seluruh temuan QA telah diselesaikan</p>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={async () => {
                  if (userRole !== "PROJECT_MANAGER") {
                    toast.error("Hanya Project Manager yang berwenang mengisi verifikasi ceklis penyelesaian.");
                    return;
                  }
                  await pmVerifyMutation.mutateAsync();
                }}
                disabled={pmVerifyMutation.isPending || isPmVerified}
                className={cn(
                  "w-full h-9 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5",
                  isPmVerified
                    ? "border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 cursor-default"
                    : "bg-primary hover:bg-primary-hover text-white cursor-pointer shadow-xs",
                )}
              >
                <Check className="size-3.5" />
                <span>
                  {pmVerifyMutation.isPending
                    ? "Menyimpan Verifikasi..."
                    : isPmVerified
                    ? "Ceklis PM Terverifikasi ✓"
                    : "Simpan Ceklis Verifikasi PM"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

TaskDetailModal.displayName = "TaskDetailModal";
export default TaskDetailModal;
