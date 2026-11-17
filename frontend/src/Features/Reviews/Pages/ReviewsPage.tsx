// src/Features/Reviews/Pages/ReviewsPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useReviewsOverview } from "../Hooks/useReviewsOverview";
import { useAuth } from "@/Hooks/useAuth";
import { useSubmitReview } from "@/Hooks/useSubmitReview";
import { usePmVerify } from "@/Hooks/usePmVerify";
import { useTlSignoff } from "@/Hooks/useTlSignoff";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { Check, Clock, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2, Lock, Unlock, ShieldCheck, ArrowRight, UserCheck, RotateCcw } from "lucide-react";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Label } from "@/Components/Elements/Label";
import { Textarea } from "@/Components/Elements/Textarea";
import { cn } from "@/Utils/cn";
import { getTaskAssigneeName } from "@/Utils/taskUtils";
import { toast } from "sonner";
import type { Task } from "@/Types/task";

export const ReviewsPage: React.FC = () => {
  useDocumentTitle("Pemeriksaan & Pengujian", "Pemeriksaan kualitas kode, verifikasi kelayakan PM, dan otorisasi pengesahan akhir TL (Definition of Done).");

  const { user } = useAuth();
  const userRole = user?.role || "PROJECT_MANAGER";

  const { tab, setTab, tabCounts, relevantTasks, refetch, isLoading, getEmptyMessage } = useReviewsOverview();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"PASS" | "REVISE">("PASS");
  const [reviewNotes, setReviewNotes] = useState("");

  // Keep selected task in sync with relevant tasks
  useEffect(() => {
    if (selectedTaskId && !relevantTasks.some((t) => t.id === selectedTaskId)) {
      setSelectedTaskId(relevantTasks[0]?.id || null);
      setReviewNotes("");
      setReviewDecision("PASS");
    }
  }, [relevantTasks, selectedTaskId]);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setReviewDecision("PASS");
    setReviewNotes("");
  };

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
    setReviewDecision("PASS");
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
      setReviewDecision("REVISE");
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
    if (!["TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole as any)) {
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
    if (!["TESTER", "TECHNICAL_LEAD", "PROJECT_MANAGER"].includes(userRole as any)) {
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
            <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">QUALITY GATE · FTR-K04-05 & FTR-K04-06</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Pemeriksaan Kualitas & Otorisasi DoD</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Pencatatan review kode, pengujian QA, verifikasi kelayakan PM, dan otorisasi pengesahan akhir TL (Definition of Done).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={handleRefresh} disabled={isLoading} loading={isLoading} className="h-9 px-4 rounded-lg text-xs font-semibold gap-1.5 shrink-0 shadow-xs">
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            <span>Segarkan Antrean</span>
          </Button>
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
            <Button
              key={t.id}
              type="button"
              variant="ghost"
              onClick={() => setTab(t.id as any)}
              className={cn(
                "pb-2.5 transition-all rounded-none h-auto px-0 whitespace-nowrap",
                tab === t.id ? "text-primary border-b-2 border-primary font-bold" : "text-muted-foreground hover:text-foreground font-semibold",
              )}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground font-mono self-end sm:self-auto pb-1">{relevantTasks.length} tugas dalam antrean saat ini</span>
      </div>

      {/* 2-Column Split (Left ~35%, Right ~65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Antrean Pemeriksaan */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Antrean Pemeriksaan</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-primary-subtle-border text-xs font-bold font-mono">
              {String(relevantTasks.length).padStart(2, "0")}
            </span>
          </div>

          <div className="space-y-3">
            {relevantTasks.map((t) => {
              const isSelected = currentTask?.id === t.id;
              const picName = getTaskAssigneeName(t);
              const modCode = t.module?.code || "MOD";
              const taskCode = t.task_code || "#TSK";

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTask(t.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer space-y-2 shadow-2xs",
                    isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <div className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>
                      {taskCode} · {modCode}
                    </span>
                    <span className="font-sans font-bold">{t.estimated_man_hours} Jam</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">{t.title}</h4>
                  <p className="text-xs text-muted-foreground">{picName}</p>
                  <div className="flex items-center justify-between pt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold font-mono uppercase px-2 py-0.5",
                        t.status === "CODE_REVIEW" && "border-purple-subtle-border bg-purple-subtle text-purple-subtle-foreground",
                        t.status === "TESTING" && "border-cyan-subtle-border bg-cyan-subtle text-cyan-subtle-foreground",
                        t.status === "DONE" && "border-success-subtle-border bg-success-subtle text-success-subtle-foreground",
                        !["CODE_REVIEW", "TESTING", "DONE"].includes(t.status) && "border-border text-muted-foreground bg-muted",
                      )}
                    >
                      {t.status.replace("_", " ")}
                    </Badge>
                    {t.is_pm_verified && (
                      <span className="text-[10px] text-success font-bold flex items-center gap-1">
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
            <div className="p-5 rounded-2xl bg-card border border-border text-card-foreground space-y-2 shadow-xs">
              <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase block">TWO-GATE QUALITY ASSURANCE</span>
              <h4 className="text-sm font-bold leading-snug">Dua tahap otorisasi. Satu standar kualitas.</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
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
                  <span className="px-2 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold font-mono">{currentTask.status}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground">{currentTask.title}</h3>
              <p className="text-xs text-muted-foreground">
                PIC: {getTaskAssigneeName(currentTask)} ·{" "}
                {currentTask.estimated_man_hours} Jam · Tenggat: {currentTask.target_deadline ? currentTask.target_deadline.split("T")[0] : "-"}
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
                      ? "border-success-subtle-border bg-success-subtle/40 text-success-subtle-foreground"
                      : "border-border bg-card",
                )}
              >
                {currentTask.status === "TESTING" || currentTask.status === "DONE" ? (
                  <Check className="size-4 text-success shrink-0" />
                ) : (
                  <Clock className="size-4 text-primary shrink-0" />
                )}
                <div>
                  <h5 className="text-xs font-bold text-foreground">1. Code Review</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{currentTask.status === "CODE_REVIEW" ? "Menunggu review TL/PM" : "Disetujui"}</p>
                </div>
              </div>

              {/* Stage 2: QA Testing */}
              <div
                className={cn(
                  "p-3 rounded-xl border flex items-center gap-2.5",
                  currentTask.status === "TESTING"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : currentTask.status === "DONE"
                      ? "border-success-subtle-border bg-success-subtle/40 text-success-subtle-foreground"
                      : "border-border bg-card opacity-60",
                )}
              >
                {currentTask.status === "DONE" ? <Check className="size-4 text-success shrink-0" /> : <Clock className="size-4 text-muted-foreground shrink-0" />}
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
                  currentTask.status === "DONE" ? "border-success bg-success-subtle text-success-subtle-foreground ring-1 ring-success" : "border-border bg-card opacity-60",
                )}
              >
                {currentTask.status === "DONE" ? <Check className="size-4 text-success shrink-0" /> : <Clock className="size-4 text-muted-foreground shrink-0" />}
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
              <div className="p-6 rounded-2xl border border-success-subtle-border bg-success-subtle/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-success text-success-foreground grid place-items-center shrink-0 shadow-md">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Definition of Done Telah Terpenuhi (Terminal State)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tugas ini telah disahkan dan terkunci permanen. Seluruh kriteria penerimaan dan uji kualitas telah dipenuhi.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl border border-success-subtle-border bg-card space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="size-3 text-success" />
                      Gerbang 1: Verifikasi Kelayakan PM
                    </span>
                    <p className="font-bold text-foreground">{currentTask.pm_verified_by || "Project Manager"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{currentTask.pm_verified_at ? currentTask.pm_verified_at.split("T")[0] : "Terverifikasi"}</p>
                  </div>

                  <div className="p-3 rounded-xl border border-success-subtle-border bg-card space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-success" />
                      Gerbang 2: Otorisasi Akhir TL
                    </span>
                    <p className="font-bold text-foreground">{currentTask.tl_signed_by || "Technical Lead"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{currentTask.tl_signed_at ? currentTask.tl_signed_at.split("T")[0] : "Disahkan"}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* CASE B: ACTIVE REVIEW / TESTING / DOD WORKFLOW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Left Sub: Review Form & Decision */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-foreground">Pemeriksaan {currentTask.status === "CODE_REVIEW" ? "Code Review" : "QA Testing"}</h4>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setReviewDecision("PASS")}
                        className={cn(
                          "h-auto py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all",
                          reviewDecision === "PASS"
                            ? "border-success bg-success-subtle text-success-subtle-foreground ring-1 ring-success"
                            : "border-border bg-card text-muted-foreground hover:bg-muted",
                        )}
                      >
                        <CheckCircle2 className="size-3.5 text-success" />
                        <span>Disetujui (Pass)</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setReviewDecision("REVISE")}
                        className={cn(
                          "h-auto py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-all",
                          reviewDecision === "REVISE"
                            ? "border-destructive bg-destructive-subtle text-destructive-subtle-foreground ring-1 ring-destructive"
                            : "border-border bg-card text-muted-foreground hover:bg-muted",
                        )}
                      >
                        <RotateCcw className="size-3.5 text-destructive" />
                        <span>Perlu Revisi (Rework)</span>
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <Label
                          required={reviewDecision === "REVISE"}
                          className={cn("font-bold mb-0", reviewDecision === "REVISE" ? "text-destructive" : "text-foreground")}
                        >
                          {reviewDecision === "REVISE" ? "Alasan Penolakan / Catatan Revisi" : "Catatan Hasil Pengujian (Opsional)"}
                        </Label>
                      </div>
                      <Textarea
                        rows={3}
                        placeholder={
                          reviewDecision === "REVISE"
                            ? "Jelaskan alasan penolakan, bug yang ditemukan, atau bagian kode yang harus direvisi pengembang..."
                            : "Tambahkan catatan pengujian atau keselarasan arsitektur..."
                        }
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        error={reviewDecision === "REVISE" && !reviewNotes.trim()}
                        className="text-xs"
                      />
                    </div>

                    {/* Actions for current phase */}
                    <div className="pt-1">
                      {currentTask.status === "CODE_REVIEW" && (
                        <Button
                          type="button"
                          variant={reviewDecision === "PASS" ? "default" : "destructive"}
                          onClick={reviewDecision === "PASS" ? handlePassCodeReview : handleRejectToDevelopment}
                          loading={submitReviewMutation.isPending}
                          className="w-full h-9 rounded-xl text-xs font-semibold shadow-2xs"
                        >
                          {reviewDecision === "PASS" ? "Loloskan Code Review (Maju ke Testing)" : "Tolak & Kembalikan ke Development (Rework)"}
                        </Button>
                      )}

                      {currentTask.status === "TESTING" && (
                        <Button
                          type="button"
                          variant={reviewDecision === "PASS" ? "success" : "destructive"}
                          onClick={reviewDecision === "PASS" ? handlePassTesting : handleRejectToDevelopment}
                          loading={submitReviewMutation.isPending}
                          className="w-full"
                        >
                          {reviewDecision === "PASS" ? "Catat Lolos QA Testing" : "Tolak & Kembalikan ke Development (Rework)"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Sub: Two-Gate DoD Verification System (Zero Dummy Checkboxes) */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground">Verifikasi & Otorisasi DoD</h4>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[9px] font-bold font-mono">FTR-K04-06</span>
                  </div>

                  {/* Gerbang 1: PM Verification Card */}
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <UserCheck className="size-3" />
                        Gerbang 1: Verifikasi Kelayakan PM
                      </span>
                      {isPmVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-success-subtle text-success-subtle-foreground border border-success-subtle-border flex items-center gap-1">
                          <Check className="size-2.5" />
                          TERVERIFIKASI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border flex items-center gap-1">
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

                    <Button
                      type="button"
                      variant={isPmVerified ? "outline" : canPmVerify ? "default" : "secondary"}
                      onClick={handleSavePmVerification}
                      loading={pmVerifyMutation.isPending}
                      disabled={isPmVerified || !canPmVerify}
                      className={cn(
                        "w-full h-8.5 rounded-lg text-xs font-semibold shadow-2xs",
                        isPmVerified &&
                          "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border cursor-default",
                      )}
                    >
                      <Check className="size-3.5" />
                      <span>{isPmVerified ? "Kelayakan PM Telah Disahkan ✓" : canPmVerify ? "Validasi Verifikasi Kelayakan (PM)" : "Hanya PM yang Berwenang Memvalidasi"}</span>
                    </Button>
                  </div>

                  {/* Gerbang 2: TL Final Sign-off Card */}
                  <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        {isTlSigned ? (
                          <CheckCircle2 className="size-3 text-success" />
                        ) : isPmVerified ? (
                          <Unlock className="size-3 text-primary" />
                        ) : (
                          <Lock className="size-3 text-muted-foreground" />
                        )}
                        Gerbang 2: Otorisasi Sign-Off TL
                      </span>
                      {isTlSigned ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-success-subtle text-success-subtle-foreground border border-success-subtle-border flex items-center gap-1">
                          <Check className="size-2.5" />
                          DONE
                        </span>
                      ) : isPmVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-purple-subtle text-purple-subtle-foreground border border-purple-subtle-border flex items-center gap-1">
                          <Unlock className="size-2.5" />
                          SIAP DISAHKAN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-muted text-muted-foreground border border-border flex items-center gap-1">
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

                    <Button
                      type="button"
                      variant={isTlSigned ? "secondary" : isPmVerified && canTlSignoff ? "default" : "secondary"}
                      onClick={handleTlFinalSignoff}
                      loading={tlSignoffMutation.isPending}
                      disabled={!isPmVerified || isTlSigned || !canTlSignoff}
                      className={cn(
                        "w-full h-8.5 rounded-lg text-xs font-semibold shadow-2xs",
                        isTlSigned
                          ? "bg-success text-success-foreground cursor-default"
                          : !isPmVerified
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : canTlSignoff
                              ? "bg-primary hover:bg-primary-hover text-primary-foreground cursor-pointer"
                              : "bg-muted text-muted-foreground cursor-not-allowed",
                      )}
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>
                        {isTlSigned
                          ? "Tugas Telah Di-Sign-off (DONE)"
                          : !isPmVerified
                            ? "Terkunci (Menunggu Gerbang 1 PM)"
                            : canTlSignoff
                              ? "Otorisasi Sign-Off & Sahkan ke DONE"
                              : "Hanya TL yang Berwenang Melakukan Sign-off"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Footer Actions (Only for Non-DONE tasks) */}
            {currentTask.status !== "DONE" && (
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRejectToDevelopment}
                  loading={submitReviewMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-destructive-subtle-border bg-destructive-subtle text-destructive-subtle-foreground hover:bg-destructive-subtle/80 transition-colors w-full sm:w-auto"
                >
                  <span>← Tolak & Kembalikan ke Development (Rework)</span>
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {currentTask.status === "CODE_REVIEW" && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={handlePassCodeReview}
                      loading={submitReviewMutation.isPending}
                      className="px-5 py-2 text-xs font-semibold rounded-xl w-full sm:w-auto"
                    >
                      <span>Loloskan Code Review</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  )}

                  {currentTask.status === "TESTING" && !isPmVerified && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleSavePmVerification}
                      loading={pmVerifyMutation.isPending}
                      disabled={!canPmVerify}
                      className="px-5 py-2 text-xs font-semibold rounded-xl w-full sm:w-auto"
                    >
                      <Check className="size-3.5" />
                      <span>Validasi Verifikasi PM (Gerbang 1)</span>
                    </Button>
                  )}

                  {currentTask.status === "TESTING" && isPmVerified && !isTlSigned && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleTlFinalSignoff}
                      loading={tlSignoffMutation.isPending}
                      disabled={!canTlSignoff}
                      className="px-5 py-2 text-xs font-semibold rounded-xl w-full sm:w-auto"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Otorisasi Sign-Off Done (TL)</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-3">
            <ShieldAlert className="size-8 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-bold text-foreground">Tidak Ada Tugas yang Dipilih</h4>
            <p className="text-xs text-muted-foreground">Pilih salah satu tugas dari antrean sebelah kiri untuk meninjau detail pemeriksaan dan otorisasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
