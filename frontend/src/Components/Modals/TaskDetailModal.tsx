// src/Components/Modals/TaskDetailModal.tsx
import React, { memo, useState } from "react";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import { Label } from "@/Components/Elements/Label";
import type { Task } from "@/Types/task";
import { useAuth } from "@/Hooks/useAuth";
import { useSubmitApproval } from "@/Hooks/useSubmitApproval";
import { useAssignTask } from "@/Features/Tasks/Hooks/useAssignTask";
import { useUpdateTaskStatus } from "@/Hooks/useUpdateTaskStatus";
import { useSubmitReview } from "@/Hooks/useSubmitReview";
import { usePmVerify } from "@/Hooks/usePmVerify";
import { useTlSignoff } from "@/Hooks/useTlSignoff";
import { DEMO_DEVELOPERS } from "@/Features/Kanban/Constants/KanbanConstant";
import { isTaskRework, getTaskReviewLogs } from "@/Utils/taskUtils";
import { Check, CheckCircle2, AlertTriangle, RotateCcw, ShieldCheck, UserCheck, ArrowRight, Lock } from "lucide-react";
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
  const userId = user?.id;

  const [notes, setNotes] = useState("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>(task?.assignee_id || DEMO_DEVELOPERS[0].id);

  // Mutations
  const submitApprovalMutation = useSubmitApproval(task?.id, () => {
    onClose();
  });

  const assignTaskMutation = useAssignTask();
  const updateStatusMutation = useUpdateTaskStatus(() => {
    onClose();
  });

  const submitReviewMutation = useSubmitReview(task?.id, () => {
    onClose();
  });

  const pmVerifyMutation = usePmVerify(task?.id, () => {
    toast.success("Verifikasi kelayakan PM (Gerbang 1) berhasil dicatat!");
  });

  const tlSignoffMutation = useTlSignoff(task?.id, () => {
    onClose();
  });

  if (!task) return null;

  const status = task.status;
  const isRework = isTaskRework(task);
  const reviewLogs = getTaskReviewLogs(task);
  const isPmVerified = Boolean(task.is_pm_verified);
  const isTlSigned = Boolean(task.is_tl_signed);

  // Dual-approval statuses
  const tlApproval = task.approvals?.find((a) => a.role === "TECHNICAL_LEAD");
  const pmApproval = task.approvals?.find((a) => a.role === "PROJECT_MANAGER");

  // Dynamic Title & Header info
  const getHeaderInfo = () => {
    switch (status) {
      case "DRAFT":
        return {
          title: "Persetujuan Rilis Tugas (Dual-Approval Gate)",
          desc: "Tugas baru berstatus DRAFT memerlukan persetujuan terpisah dari TL & PM sebelum dapat dikerjakan.",
          tone: "slate",
        };
      case "RELEASED":
        return {
          title: "Penugasan & Mulai Pengerjaan (Released Task)",
          desc: "Tugas telah disahkan rilis. Tentukan pengembang pelaksana (PIC) untuk menarik ke fase Development.",
          tone: "indigo",
        };
      case "DEVELOPMENT":
        return {
          title: isRework ? "Perbaikan Revisi Tugas (Rework In Progress)" : "Eksekusi Pengerjaan Tugas (Development)",
          desc: isRework ? "Tugas dikembalikan dari tahap pengujian. Perbaiki temuan sebelum mengajukan kembali." : "Tugas sedang dalam proses pengerjaan oleh pengembang terkait.",
          tone: isRework ? "amber" : "blue",
        };
      case "CODE_REVIEW":
        return {
          title: "Pemeriksaan Kualitas Kode (Code Review)",
          desc: "Tinjau arsitektur, clean code, dan keselarasan kontrak API sebelum diserahkan ke pengujian QA.",
          tone: "purple",
        };
      case "TESTING":
        return {
          title: "Pengujian Kualitas & Two-Gate DoD (QA Testing)",
          desc: "Verifikasi skenario uji QA, lengkapi ceklis PM (Gerbang 1), dan otorisasi akhir TL (Gerbang 2).",
          tone: "cyan",
        };
      case "DONE":
      default:
        return {
          title: "Tugas Selesai & Disahkan (Definition of Done)",
          desc: "Tugas telah memenuhi kriteria Definition of Done dan terkunci permanen (Terminal State).",
          tone: "emerald",
        };
    }
  };

  const header = getHeaderInfo();

  // Handlers for DRAFT approval
  const handleApproval = async (decision: "APPROVED" | "REJECTED") => {
    if (!["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole)) {
      toast.error("Hanya Technical Lead atau Project Manager yang berwenang memberikan approval rilis.");
      return;
    }
    await submitApprovalMutation.mutateAsync({
      status: decision,
      notes: notes.trim() || (decision === "APPROVED" ? "Disetujui untuk rilis sprint." : "Draft ditolak."),
    });
  };

  // Handlers for RELEASED -> DEVELOPMENT
  const handleStartDevelopment = async () => {
    const dev = DEMO_DEVELOPERS.find((d) => d.id === selectedAssigneeId) || DEMO_DEVELOPERS[0];
    if (userRole === "DEVELOPER" && userId && dev.id !== userId) {
      toast.error("Pengembang hanya boleh menugaskan dirinya sendiri.");
      return;
    }

    try {
      await assignTaskMutation.mutateAsync({
        taskId: task.id,
        assigneeId: dev.id,
        assigneeName: dev.name,
      });

      await updateStatusMutation.mutateAsync({
        taskId: task.id,
        status: "DEVELOPMENT",
        assigneeId: dev.id,
        assigneeName: dev.name,
      });
    } catch {
      // error handled by mutations
    }
  };

  // Handlers for DEVELOPMENT -> CODE_REVIEW
  const handleRequestCodeReview = async () => {
    await updateStatusMutation.mutateAsync({
      taskId: task.id,
      status: "CODE_REVIEW",
    });
  };

  // Handlers for CODE_REVIEW decision
  const handleCodeReviewDecision = async (decision: "PASSED" | "REJECTED") => {
    if (!["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole)) {
      toast.error("Hanya Technical Lead atau Project Manager yang berwenang menilai Code Review.");
      return;
    }
    if (decision === "REJECTED" && !notes.trim()) {
      toast.error("Wajib menyertakan catatan revisi saat menolak Code Review.");
      return;
    }
    await submitReviewMutation.mutateAsync({
      review_type: "CODE_REVIEW",
      result: decision,
      notes: notes.trim() || "Code review disetujui (Pass).",
    });
  };

  // Handlers for TESTING decision
  const handleQaTestDecision = async (decision: "PASSED" | "REJECTED") => {
    if (decision === "REJECTED" && !notes.trim()) {
      toast.error("Wajib menyertakan temuan bug atau alasan revisi pengujian QA.");
      return;
    }
    await submitReviewMutation.mutateAsync({
      review_type: "TESTING",
      result: decision,
      notes: notes.trim() || (decision === "PASSED" ? "Semua skenario pengujian QA lolos." : "Terdapat bug pengujian."),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={header.title}
      description={header.desc}
      footer={
        <div className="flex items-center justify-between gap-3 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-xl">
            Tutup
          </Button>

          {/* Dynamic Footer Actions Based on Phase */}
          <div className="flex items-center gap-2">
            {/* 1. DRAFT Actions */}
            {status === "DRAFT" && ["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole) && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleApproval("REJECTED")}
                  disabled={submitApprovalMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 text-rose-700 hover:bg-rose-100"
                >
                  Tolak Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => handleApproval("APPROVED")}
                  disabled={submitApprovalMutation.isPending}
                  loading={submitApprovalMutation.isPending}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs"
                >
                  <Check className="size-3.5" />
                  <span>Setujui Rilis ({userRole === "TECHNICAL_LEAD" ? "TL" : "PM"})</span>
                </Button>
              </>
            )}

            {/* 2. RELEASED Actions */}
            {status === "RELEASED" && (
              <Button
                type="button"
                onClick={handleStartDevelopment}
                disabled={assignTaskMutation.isPending || updateStatusMutation.isPending}
                loading={assignTaskMutation.isPending || updateStatusMutation.isPending}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs"
              >
                <span>Mulai Development</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {/* 3. DEVELOPMENT Actions */}
            {status === "DEVELOPMENT" && (
              <Button
                type="button"
                onClick={handleRequestCodeReview}
                disabled={updateStatusMutation.isPending}
                loading={updateStatusMutation.isPending}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs"
              >
                <span>Ajukan Code Review</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {/* 4. CODE_REVIEW Actions */}
            {status === "CODE_REVIEW" && ["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole) && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCodeReviewDecision("REJECTED")}
                  disabled={submitReviewMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center gap-1"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Minta Revisi (Rework)</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => handleCodeReviewDecision("PASSED")}
                  disabled={submitReviewMutation.isPending}
                  loading={submitReviewMutation.isPending}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  <span>Loloskan ke QA Testing</span>
                </Button>
              </>
            )}

            {/* 5. TESTING Actions */}
            {status === "TESTING" && (
              <div className="flex items-center gap-2">
                {["TESTER", "TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleQaTestDecision("REJECTED")}
                    disabled={submitReviewMutation.isPending}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  >
                    QA Reject (Rework)
                  </Button>
                )}

                {userRole === "PROJECT_MANAGER" && !isPmVerified && (
                  <Button
                    type="button"
                    onClick={() => pmVerifyMutation.mutate()}
                    disabled={pmVerifyMutation.isPending}
                    loading={pmVerifyMutation.isPending}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Verifikasi Ceklis PM (Gerbang 1)</span>
                  </Button>
                )}

                {userRole === "TECHNICAL_LEAD" && (
                  <Button
                    type="button"
                    onClick={() => tlSignoffMutation.mutate()}
                    disabled={tlSignoffMutation.isPending || !isPmVerified}
                    loading={tlSignoffMutation.isPending}
                    title={!isPmVerified ? "Menunggu verifikasi ceklis PM sebelum dapat disahkan" : undefined}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="size-3.5" />
                    <span>Otorisasi Sign-Off DONE (TL)</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Core Task Identity Card */}
        <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">{task.task_code}</span>
                <span className="font-semibold text-xs text-muted-foreground">
                  {task.module?.name || "Modul Utama"} {task.feature?.name ? `· ${task.feature.name}` : ""}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground">{task.title}</h3>
            </div>

            <div className="text-right shrink-0">
              <span className="font-mono text-xs font-bold text-primary">{Number(task.estimated_man_hours) || 8} Jam Estimasi</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">Tenggat: {task.target_deadline ? task.target_deadline.split("T")[0] : "-"}</p>
            </div>
          </div>

          {task.description && <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/60">{task.description}</p>}

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2 py-0.5 rounded border border-border bg-card text-[11px] font-mono">
              Bobot: <b>{task.complexity_weight}</b>
            </span>
            <span className="px-2 py-0.5 rounded border border-border bg-card text-[11px]">
              PIC: <b>{task.assignee_name || "Belum Ditugaskan"}</b>
            </span>
            <span className="px-2 py-0.5 rounded border border-border bg-card text-[11px] font-mono uppercase">
              Status: <b>{task.status}</b>
            </span>
          </div>
        </div>

        {/* 1. FASE DRAFT: DUAL-APPROVAL STATUS */}
        {status === "DRAFT" && (
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                Status Persetujuan Rilis (Dual-Approval)
              </h4>
              <span className="text-[11px] text-muted-foreground">Keduanya wajib APPROVED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">Technical Lead (TL)</span>
                  <p className="text-xs font-bold text-foreground">Fauzan</p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold font-mono",
                    tlApproval?.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200",
                  )}
                >
                  {tlApproval?.status || "PENDING"}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground">Project Manager (PM)</span>
                  <p className="text-xs font-bold text-foreground">Tubagus M. Wildan</p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold font-mono",
                    pmApproval?.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200",
                  )}
                >
                  {pmApproval?.status || "PENDING"}
                </span>
              </div>
            </div>

            {["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole) && (
              <div className="space-y-1 pt-2">
                <Label className="text-xs font-semibold">Catatan Keputusan Approval (Opsional)</Label>
                <Input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Berikan alasan atau catatan persetujuan..." className="w-full text-xs" />
              </div>
            )}
          </div>
        )}

        {/* 2. FASE RELEASED: ASSIGNEE SELECTION */}
        {status === "RELEASED" && (
          <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="size-4 text-indigo-600" />
              Tentukan Pengembang Pelaksana (PIC)
            </h4>
            <p className="text-xs text-muted-foreground">Tugas telah dirilis resmi. Sebelum pengerjaan dimulai, tentukan pengembang yang bertanggung jawab.</p>

            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold">Pilih Pengembang (Developer)</Label>
              <Select value={selectedAssigneeId} onChange={(e) => setSelectedAssigneeId(e.target.value)} disabled={userRole === "DEVELOPER"} className="w-full text-xs">
                {DEMO_DEVELOPERS.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name} ({dev.role})
                  </option>
                ))}
              </Select>
              {userRole === "DEVELOPER" && <p className="text-[10px] text-muted-foreground">Sebagai Developer, tugas otomatis ditetapkan ke akun Anda sendiri.</p>}
            </div>
          </div>
        )}

        {/* 3. FASE DEVELOPMENT: REWORK ALERT & PROGRESS */}
        {status === "DEVELOPMENT" && (
          <div className="space-y-3">
            {isRework && (
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <AlertTriangle className="size-4 text-amber-600" />
                  <span>Perhatian: Tugas dalam Status Rework (Revisi Pengujian)</span>
                </div>
                {reviewLogs.find((l) => l.result === "REJECTED")?.notes && (
                  <p className="text-xs bg-card/60 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    Catatan Review: "<b>{reviewLogs.find((l) => l.result === "REJECTED")?.notes}</b>"
                  </p>
                )}
              </div>
            )}

            <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-foreground">Pelaksana Aktif (PIC)</p>
                <p className="text-muted-foreground mt-0.5">{task.assignee_name || "Ariel (Frontend Dev)"}</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-mono font-bold">SEDANG DIKERJAKAN</span>
            </div>
          </div>
        )}

        {/* 4. FASE CODE REVIEW: REVIEW FORM */}
        {status === "CODE_REVIEW" && (
          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <h4 className="text-xs font-bold text-foreground">Form Penilaian Code Review (TL & PM)</h4>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Catatan / Temuan Peer Review</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan temuan arsitektur atau catatan persetujuan..."
                rows={3}
                className="w-full text-xs"
              />
            </div>
          </div>
        )}

        {/* 5. FASE TESTING: QA TESTING & TWO-GATE DOD */}
        {status === "TESTING" && (
          <div className="space-y-3">
            {/* QA Testing Section */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-cyan-600" />
                Pengujian QA Tester
              </h4>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan hasil pengujian fungsional dan regression test..."
                rows={2}
                className="w-full text-xs"
              />
            </div>

            {/* Two-Gate DoD Status */}
            <div className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dua Gerbang Pengesahan (Two-Gate DoD)</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Gate 1: PM */}
                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">Gerbang 1: Ceklis PM</span>
                    {isPmVerified ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <Check className="size-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600">PENDING</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{isPmVerified ? `Diverifikasi oleh ${task.pm_verified_by || "PM"}` : "Memerlukan konfirmasi fungsional PM"}</p>
                </div>

                {/* Gate 2: TL */}
                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-muted-foreground">Gerbang 2: Sign-Off TL</span>
                    {isTlSigned ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <Check className="size-3" /> SIGNED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600">MENUNGGU</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{isTlSigned ? `Disahkan oleh ${task.tl_signed_by || "TL"}` : "Otorisasi penutupan akhir"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. FASE DONE: LOCKED TERMINAL VIEW */}
        {status === "DONE" && (
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <Lock className="size-4" />
              <span>Status Final (Terkunci Permanen Sesuai Kontrak Backend)</span>
            </div>
            <p className="text-xs text-muted-foreground">Tugas ini telah melewati seluruh siklus agile: verifikasi ceklis PM dan otorisasi pengesahan akhir TL.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-emerald-200/60">
              <div className="p-2 rounded bg-card border border-border">
                <span className="text-[10px] text-muted-foreground">Verifikasi PM</span>
                <p className="font-semibold text-foreground truncate">{task.pm_verified_by || "Wildan (PM)"}</p>
              </div>
              <div className="p-2 rounded bg-card border border-border">
                <span className="text-[10px] text-muted-foreground">Sign-Off Akhir TL</span>
                <p className="font-semibold text-foreground truncate">{task.tl_signed_by || "Fauzan (TL)"}</p>
              </div>
              <div className="p-2 rounded bg-card border border-border">
                <span className="text-[10px] text-muted-foreground">Jam Kerja Aktual</span>
                <p className="font-semibold text-foreground truncate">{task.actual_man_hours || task.estimated_man_hours} Jam Selesai</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});

TaskDetailModal.displayName = "TaskDetailModal";
export default TaskDetailModal;
