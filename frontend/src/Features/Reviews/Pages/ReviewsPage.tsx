// src/Features/Reviews/Pages/ReviewsPage.tsx
import React, { useState, useMemo } from "react";
import { useReviewsOverview } from "../Hooks/useReviewsOverview";
import { useAuth } from "@/Hooks/useAuth";
import { useSubmitReview } from "@/Hooks/useSubmitReview";
import { usePmVerify } from "@/Hooks/usePmVerify";
import { useTlSignoff } from "@/Hooks/useTlSignoff";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import {
  Check,
  Clock,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { cn } from "@/Utils/cn";
import { toast } from "sonner";
import type { Task } from "@/Types/task";

export const ReviewsPage: React.FC = () => {
  useDocumentTitle(
    "Pemeriksaan & Pengujian",
    "Pemeriksaan kualitas kode, verifikasi kelayakan PM, dan otorisasi pengesahan akhir TL (Definition of Done).",
  );

  const { user } = useAuth();
  const userRole = user?.role || "PROJECT_MANAGER";

  const {
    tab,
    setTab,
    tabCounts,
    relevantTasks,
    refetch,
    isLoading,
    getEmptyMessage,
  } = useReviewsOverview();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"PASS" | "REVISE">("PASS");
  const [reviewNotes, setReviewNotes] = useState("");

  // Effective selected task
  const currentTask: Task | undefined = useMemo(() => {
    if (selectedTaskId) {
      const found = relevantTasks.find((t) => t.id === selectedTaskId);
      if (found) return found;
    }
    return relevantTasks[0];
  }, [selectedTaskId, relevantTasks]);

  // Hook mutations for review actions
  const submitReviewMutation = useSubmitReview(currentTask?.id, () => {
    refetch();
    setReviewNotes("");
  });

  const pmVerifyMutation = usePmVerify(currentTask?.id, () => {
    refetch();
  });

  const tlSignoffMutation = useTlSignoff(currentTask?.id, () => {
    refetch();
  });

  const isPmVerified = Boolean(currentTask?.is_pm_verified);
  const isTlSigned = Boolean(currentTask?.is_tl_signed);

  // Role permissions
  const canPmVerify = userRole === "PROJECT_MANAGER";
  const canTlSignoff = userRole === "TECHNICAL_LEAD";

  const handleRefresh = async () => {
    await refetch();
    toast.success("Antrean pemeriksaan berhasil diperbarui.");
  };

  // Rejection with mandatory notes
  const handleRejectToDevelopment = async () => {
    if (!currentTask) return;
    if (userRole === "DEVELOPER") {
      toast.error("Akses ditolak. Pengembang tidak dapat menolak pemeriksaan.");
      return;
    }
    if (!reviewNotes.trim()) {
      toast.error("Wajib menyertakan catatan / alasan penolakan sebelum mengembalikan tugas ke development.");
      return;
    }
    const revType = currentTask.status === "CODE_REVIEW" ? "CODE_REVIEW" : "TESTING";
    await submitReviewMutation.mutateAsync({
      review_type: revType,
      result: "REJECTED",
      notes: reviewNotes.trim(),
    });
  };

  const handlePassCodeReview = async () => {
    if (!currentTask) return;
    if (!["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole)) {
      toast.error("Hanya Technical Lead atau Project Manager yang berwenang meloloskan Code Review.");
      return;
    }
    const notes = reviewNotes.trim() || "Kualitas dan arsitektur kode telah disetujui (Pass). Siap masuk tahap pengujian.";
    await submitReviewMutation.mutateAsync({
      review_type: "CODE_REVIEW",
      result: "PASSED",
      notes,
    });
  };

  const handlePassTesting = async () => {
    if (!currentTask) return;
    if (!["TESTER", "TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole)) {
      toast.error("Hanya Tester, Technical Lead, atau Project Manager yang berwenang mencatat hasil QA Testing.");
      return;
    }
    const notes = reviewNotes.trim() || "Skenario pengujian lolos tanpa temuan defek mayor.";
    await submitReviewMutation.mutateAsync({
      review_type: "TESTING",
      result: "PASSED",
      notes,
    });
  };

  const handleSavePmVerification = async () => {
    if (!currentTask) return;
    if (!canPmVerify) {
      toast.error("Akses ditolak. Hanya peran Project Manager yang berwenang melakukan verifikasi kelayakan.");
      return;
    }
    await pmVerifyMutation.mutateAsync();
  };

  const handleTlFinalSignoff = async () => {
    if (!currentTask) return;
    if (!canTlSignoff) {
      toast.error("Hanya Technical Lead yang berwenang melakukan final sign-off penutupan tugas.");
      return;
    }
    if (!isPmVerified) {
      toast.error("Verifikasi kelayakan PM (Gerbang 1) wajib dipenuhi sebelum TL dapat mengesahkan tugas menjadi Done.");
      return;
    }
    await tlSignoffMutation.mutateAsync();
  };

  return (
    <div className="space-y-4">
      {/* Page Title Card (FigCraft 1:1) */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">
              QUALITY GATE · FTR-K04-05 & FTR-K04-06
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Pemeriksaan Kualitas & Otorisasi DoD
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Pencatatan review kode, pengujian QA, verifikasi kelayakan PM, dan otorisasi pengesahan akhir TL (Definition of Done).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            <span>Segarkan Antrean</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-1">
        <div className="flex items-center gap-5 text-xs font-semibold overflow-x-auto">
          {[
            { id: "ALL", label: `Semua (${tabCounts.all})` },
            { id: "CODE_REVIEW", label: `Code Review (${tabCounts.codeReview})` },
            { id: "TESTING", label: `QA Testing (${tabCounts.testing})` },
            { id: "SIGNOFF", label: `Siap Sign-off Done (${tabCounts.signoff})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as any)}
              className={cn(
                "pb-2.5 transition-all cursor-pointer whitespace-nowrap",
                tab === t.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground font-mono self-end sm:self-auto pb-1">
          {relevantTasks.length} tugas dalam antrean saat ini
        </span>
      </div>

      {/* 2-Column Split (Left ~35%, Right ~65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Antrean Pemeriksaan */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Antrean Pemeriksaan</h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-mono">
              {String(relevantTasks.length).padStart(2, "0")}
            </span>
          </div>

          <div className="space-y-3">
            {relevantTasks.map((t) => {
              const isSelected = currentTask?.id === t.id;
              const picName = typeof t.pic === "string" ? t.pic : t.pic?.name || t.assignee_name || "Belum Ditugaskan";
              const modCode = t.module?.code || "MOD";
              const taskCode = t.task_code || "#TSK";

              let badgeColor = "border-muted text-muted-foreground bg-muted/30";
              if (t.status === "CODE_REVIEW") {
                badgeColor = "border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300";
              } else if (t.status === "TESTING") {
                badgeColor = "border-cyan-200 dark:border-cyan-900 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300";
              } else if (t.status === "DONE") {
                badgeColor = "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300";
              }

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>{taskCode} · {modCode}</span>
                    <span className="font-sans font-bold">{Number(t.estimated_man_hours) || 0} Jam</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{t.title}</h4>
                  <p className="text-xs text-muted-foreground">{picName}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className={cn("px-2 py-0.5 rounded border text-[10px] font-bold font-mono uppercase", badgeColor)}>
                      {t.status.replace("_", " ")}
                    </span>
                    {t.is_pm_verified && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="size-3" /> PM Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {relevantTasks.length === 0 && (
              <div className="p-6 rounded-2xl border border-dashed border-border bg-card text-center space-y-2">
                <AlertCircle className="size-6 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">{getEmptyMessage()}</p>
              </div>
            )}

            {/* Verified Delivery Info Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-xl">
              <span className="font-mono text-[10px] font-bold text-indigo-400 tracking-wider uppercase block">
                TWO-GATE QUALITY ASSURANCE
              </span>
              <h4 className="text-sm font-bold leading-snug">
                Dua tahap otorisasi. Satu standar kualitas.
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gerbang 1 (Verifikasi kelayakan PM) dan Gerbang 2 (Otorisasi penutupan TL) wajib lengkap sebelum tugas resmi berstatus DONE.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Task Inspection */}
        {currentTask ? (
          <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 space-y-5 shadow-2xs">
            {/* Header */}
            <div className="space-y-1 pb-4 border-b border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-xs text-muted-foreground">
                  {currentTask.task_code || "#TSK"} / {currentTask.module?.code || "MOD"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold font-mono">
                    {currentTask.status}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground">{currentTask.title}</h3>
              <p className="text-xs text-muted-foreground">
                PIC: {typeof currentTask.pic === "string" ? currentTask.pic : currentTask.pic?.name || currentTask.assignee_name || "Belum Ditugaskan"} · {Number(currentTask.estimated_man_hours) || 0} Jam · Tenggat: {currentTask.target_deadline ? currentTask.target_deadline.split("T")[0] : "-"}
              </p>
            </div>

            {/* 3 Stage Progress Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stage 1: Code Review */}
              <div
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2.5",
                  currentTask.status === "CODE_REVIEW"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : currentTask.status === "TESTING" || currentTask.status === "DONE"
                    ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30"
                    : "border-border bg-card",
                )}
              >
                {currentTask.status === "TESTING" || currentTask.status === "DONE" ? (
                  <Check className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="size-4 text-primary shrink-0" />
                )}
                <div>
                  <h5 className="text-xs font-bold text-foreground">1. Code Review</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {currentTask.status === "CODE_REVIEW" ? "Menunggu review TL/PM" : "Disetujui"}
                  </p>
                </div>
              </div>

              {/* Stage 2: QA Testing */}
              <div
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2.5",
                  currentTask.status === "TESTING"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : currentTask.status === "DONE"
                    ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30"
                    : "border-border bg-card opacity-60",
                )}
              >
                {currentTask.status === "DONE" ? (
                  <Check className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="size-4 text-muted-foreground shrink-0" />
                )}
                <div>
                  <h5 className="text-xs font-bold text-foreground">2. QA Testing</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {currentTask.status === "TESTING" ? "Sedang diuji Tester" : currentTask.status === "DONE" ? "Lolos pengujian" : "Belum dimulai"}
                  </p>
                </div>
              </div>

              {/* Stage 3: Pengesahan Selesai */}
              <div
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2.5",
                  currentTask.status === "DONE"
                    ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500"
                    : "border-border bg-card opacity-60",
                )}
              >
                {currentTask.status === "DONE" ? (
                  <Check className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="size-4 text-muted-foreground shrink-0" />
                )}
                <div>
                  <h5 className="text-xs font-bold text-foreground">3. Pengesahan Selesai</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {currentTask.status === "DONE" ? "Tugas resmi DONE" : isPmVerified ? "Menunggu sign-off TL" : "Menunggu verifikasi PM"}
                  </p>
                </div>
              </div>
            </div>

            {/* CASE A: TASK IS DONE -> SHOW SEALED DoD CERTIFICATE */}
            {currentTask.status === "DONE" ? (
              <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-emerald-600 text-white grid place-items-center shrink-0 shadow-md">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Definition of Done Telah Terpenuhi (Terminal State)
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      Tugas ini telah disahkan dan terkunci permanen. Seluruh kriteria penerimaan dan uji kualitas telah dipenuhi.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-card space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="size-3 text-emerald-600" />
                      Gerbang 1: Verifikasi Kelayakan PM
                    </span>
                    <p className="font-bold text-foreground">{currentTask.pm_verified_by || "Project Manager"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {currentTask.pm_verified_at ? currentTask.pm_verified_at.split("T")[0] : "Terverifikasi"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-card space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Gerbang 2: Otorisasi Akhir TL
                    </span>
                    <p className="font-bold text-foreground">{currentTask.tl_signed_by || "Technical Lead"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {currentTask.tl_signed_at ? currentTask.tl_signed_at.split("T")[0] : "Disahkan"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* CASE B: ACTIVE REVIEW / TESTING / DOD WORKFLOW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Left Sub: Review Form & Decision */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-foreground">
                      Pemeriksaan {currentTask.status === "CODE_REVIEW" ? "Code Review" : "QA Testing"}
                    </h4>

                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
                        <input
                          type="radio"
                          name="qa_decision"
                          checked={reviewDecision === "PASS"}
                          onChange={() => setReviewDecision("PASS")}
                          className="text-primary focus:ring-primary size-3.5"
                        />
                        <span>Disetujui (Pass)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
                        <input
                          type="radio"
                          name="qa_decision"
                          checked={reviewDecision === "REVISE"}
                          onChange={() => setReviewDecision("REVISE")}
                          className="text-primary focus:ring-primary size-3.5"
                        />
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">Perlu Revisi (Rework)</span>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <label className={cn("font-bold", reviewDecision === "REVISE" ? "text-rose-600 dark:text-rose-400" : "text-foreground")}>
                          {reviewDecision === "REVISE" ? "Alasan Penolakan / Catatan Revisi (Wajib Diisi)*" : "Catatan Hasil Pengujian (Opsional)"}
                        </label>
                      </div>
                      <textarea
                        rows={3}
                        placeholder={
                          reviewDecision === "REVISE"
                            ? "Jelaskan alasan penolakan, bug yang ditemukan, atau bagian kode yang harus direvisi pengembang..."
                            : "Tambahkan catatan pengujian atau keselarasan arsitektur..."
                        }
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className={cn(
                          "w-full text-xs rounded-lg border bg-card p-2 text-foreground focus:outline-none focus:ring-1",
                          reviewDecision === "REVISE" && !reviewNotes.trim()
                            ? "border-rose-400 focus:ring-rose-500"
                            : "border-border focus:ring-primary",
                        )}
                      />
                    </div>

                    {/* Actions for current phase */}
                    <div className="pt-1">
                      {currentTask.status === "CODE_REVIEW" && (
                        <button
                          type="button"
                          onClick={reviewDecision === "PASS" ? handlePassCodeReview : handleRejectToDevelopment}
                          disabled={submitReviewMutation.isPending}
                          className={cn(
                            "w-full h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs",
                            reviewDecision === "PASS"
                              ? "bg-primary hover:bg-primary-hover text-white"
                              : "bg-rose-600 hover:bg-rose-700 text-white",
                          )}
                        >
                          {submitReviewMutation.isPending
                            ? "Memproses..."
                            : reviewDecision === "PASS"
                            ? "Loloskan Code Review (Maju ke Testing)"
                            : "Tolak & Kembalikan ke Development (Rework)"}
                        </button>
                      )}

                      {currentTask.status === "TESTING" && (
                        <button
                          type="button"
                          onClick={reviewDecision === "PASS" ? handlePassTesting : handleRejectToDevelopment}
                          disabled={submitReviewMutation.isPending}
                          className={cn(
                            "w-full h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs",
                            reviewDecision === "PASS"
                              ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                              : "bg-rose-600 hover:bg-rose-700 text-white",
                          )}
                        >
                          {submitReviewMutation.isPending
                            ? "Memproses..."
                            : reviewDecision === "PASS"
                            ? "Catat Lolos QA Testing"
                            : "Tolak & Kembalikan ke Development (Rework)"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Sub: Two-Gate DoD Verification System (Zero Dummy Checkboxes) */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground">Verifikasi & Otorisasi DoD</h4>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[9px] font-bold font-mono">
                      FTR-K04-06
                    </span>
                  </div>

                  {/* Gerbang 1: PM Verification Card */}
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <UserCheck className="size-3" />
                        Gerbang 1: Verifikasi Kelayakan PM
                      </span>
                      {isPmVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Check className="size-2.5" />
                          TERVERIFIKASI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Clock className="size-2.5" />
                          MENUNGGU PM
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {isPmVerified
                        ? `Diverifikasi oleh: ${currentTask.pm_verified_by || "Project Manager"} (${currentTask.pm_verified_at ? currentTask.pm_verified_at.split("T")[0] : "Lengkap"}).`
                        : "Project Manager memvalidasi kelayakan penyelesaian tugas sesuai standar SOP-08 sebelum pintu otorisasi TL terbuka."}
                    </p>

                    <button
                      type="button"
                      onClick={handleSavePmVerification}
                      disabled={pmVerifyMutation.isPending || isPmVerified || !canPmVerify}
                      className={cn(
                        "w-full h-8.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs",
                        isPmVerified
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default"
                          : canPmVerify
                          ? "bg-primary hover:bg-primary-hover text-white cursor-pointer"
                          : "bg-muted text-muted-foreground cursor-not-allowed",
                      )}
                    >
                      <Check className="size-3.5" />
                      <span>
                        {pmVerifyMutation.isPending
                          ? "Memvalidasi..."
                          : isPmVerified
                          ? "Kelayakan PM Telah Disahkan ✓"
                          : canPmVerify
                          ? "Validasi Verifikasi Kelayakan (PM)"
                          : "Hanya PM yang Berwenang Memvalidasi"}
                      </span>
                    </button>
                  </div>

                  {/* Gerbang 2: TL Final Sign-off Card */}
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        {isTlSigned ? <CheckCircle2 className="size-3 text-emerald-600" /> : isPmVerified ? <Unlock className="size-3 text-purple-600" /> : <Lock className="size-3 text-muted-foreground" />}
                        Gerbang 2: Otorisasi Sign-Off TL
                      </span>
                      {isTlSigned ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Check className="size-2.5" />
                          DONE
                        </span>
                      ) : isPmVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                          <Unlock className="size-2.5" />
                          SIAP DISAHKAN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Lock className="size-2.5" />
                          TERKUNCI
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {isTlSigned
                        ? `Disahkan oleh: ${currentTask.tl_signed_by || "Technical Lead"}. Tugas resmi berstatus DONE.`
                        : isPmVerified
                        ? "Gerbang 1 telah diverifikasi PM. Technical Lead dapat melakukan otorisasi penutupan tiket."
                        : "Gerbang 2 terkunci. Memerlukan verifikasi kelayakan PM (Gerbang 1) terlebih dahulu."}
                    </p>

                    <button
                      type="button"
                      onClick={handleTlFinalSignoff}
                      disabled={tlSignoffMutation.isPending || !isPmVerified || isTlSigned || !canTlSignoff}
                      className={cn(
                        "w-full h-8.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs",
                        isTlSigned
                          ? "bg-emerald-600 text-white cursor-default"
                          : !isPmVerified
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : canTlSignoff
                          ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                          : "bg-muted text-muted-foreground cursor-not-allowed",
                      )}
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>
                        {tlSignoffMutation.isPending
                          ? "Mengesahkan..."
                          : isTlSigned
                          ? "Tugas Telah Di-Sign-off (DONE)"
                          : !isPmVerified
                          ? "Terkunci (Menunggu Gerbang 1 PM)"
                          : canTlSignoff
                          ? "Otorisasi Sign-Off & Sahkan ke DONE"
                          : "Hanya TL yang Berwenang Melakukan Sign-off"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Actions (Only for Non-DONE tasks) */}
            {currentTask.status !== "DONE" && (
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRejectToDevelopment}
                  disabled={submitReviewMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer w-full sm:w-auto disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>← Tolak & Kembalikan ke Development (Rework)</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {currentTask.status === "CODE_REVIEW" && (
                    <button
                      type="button"
                      onClick={handlePassCodeReview}
                      disabled={submitReviewMutation.isPending}
                      className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <span>Loloskan Code Review</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  )}

                  {currentTask.status === "TESTING" && !isPmVerified && (
                    <button
                      type="button"
                      onClick={handleSavePmVerification}
                      disabled={pmVerifyMutation.isPending || !canPmVerify}
                      className="px-5 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto disabled:opacity-50"
                    >
                      <Check className="size-3.5" />
                      <span>Validasi Verifikasi PM (Gerbang 1)</span>
                    </button>
                  )}

                  {currentTask.status === "TESTING" && isPmVerified && !isTlSigned && (
                    <button
                      type="button"
                      onClick={handleTlFinalSignoff}
                      disabled={tlSignoffMutation.isPending || !canTlSignoff}
                      className="px-5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Otorisasi Sign-Off Done (TL)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-3">
            <ShieldAlert className="size-8 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-bold text-foreground">Tidak Ada Tugas yang Dipilih</h4>
            <p className="text-xs text-muted-foreground">
              Pilih salah satu tugas dari antrean sebelah kiri untuk meninjau detail pemeriksaan dan otorisasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
