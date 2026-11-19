// src/Features/Reviews/Pages/ReviewsPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import { useReviewsOverview, type ReviewTabType } from "../Hooks/useReviewsOverview";
import { useAuth } from "@/Hooks/useAuth";
import { useSubmitReview } from "@/Hooks/useSubmitReview";
import { usePmVerify } from "@/Hooks/usePmVerify";
import { useTlSignoff } from "@/Hooks/useTlSignoff";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { Check, Clock, RefreshCw, AlertCircle, ShieldAlert, CheckCircle2, Lock, Unlock, ShieldCheck, ArrowRight, UserCheck, RotateCcw } from "lucide-react";
import { Alert } from "@/Components/Elements/Alert";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Label } from "@/Components/Elements/Label";
import { Textarea } from "@/Components/Elements/Textarea";
import { Tabs, TabsList, TabsTrigger } from "@/Components/Elements/Tabs";
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
      <Card
        size="md"
        padding="lg"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Pemeriksaan Kualitas &amp; Pengesahan Tugas</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Pencatatan review kode, pengujian QA, verifikasi kelayakan PM, dan pengesahan akhir oleh Technical Lead.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={handleRefresh} disabled={isLoading} loading={isLoading} className="shrink-0">
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            <span>Segarkan Antrean</span>
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as ReviewTabType)}
          variant="underline"
          className="w-auto min-w-0"
        >
          <TabsList bordered={false}>
            <TabsTrigger value="ALL">Semua ({tabCounts.all})</TabsTrigger>
            <TabsTrigger value="CODE_REVIEW">Code Review ({tabCounts.codeReview})</TabsTrigger>
            <TabsTrigger value="TESTING">QA Testing ({tabCounts.testing})</TabsTrigger>
            <TabsTrigger value="SIGNOFF">Siap Sign-off Done ({tabCounts.signoff})</TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="text-xs text-muted-foreground font-mono self-end sm:self-auto pb-2 shrink-0">
          {relevantTasks.length} tugas dalam antrean saat ini
        </span>
      </div>

      {/* 2-Column Split (Left ~35%, Right ~65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Antrean Pemeriksaan */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Antrean Pemeriksaan</h3>
            <Badge variant="primary" size="sm" mono>
              {String(relevantTasks.length).padStart(2, "0")}
            </Badge>
          </div>

          <div className="space-y-3">
            {relevantTasks.map((t) => {
              const isSelected = currentTask?.id === t.id;
              const picName = getTaskAssigneeName(t);
              const modCode = t.module?.code || "MOD";
              const taskCode = t.task_code || "#TSK";

              return (
                <Card
                  key={t.id}
                  size="md"
                  surface={isSelected ? "primaryTint" : "default"}
                  interactive={isSelected ? "none" : "primary"}
                  onClick={() => handleSelectTask(t.id)}
                  className="cursor-pointer space-y-2"
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
                    <Badge variant={t.status} size="sm" mono>
                      {t.status.replace("_", " ")}
                    </Badge>
                    {t.is_pm_verified && (
                      <span className="text-[10px] text-success font-bold flex items-center gap-1">
                        <Check className="size-3" /> PM Verified
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}

            {relevantTasks.length === 0 && (
              <Card size="md" padding="lg" dashed className="flex flex-col items-center space-y-2">
                <AlertCircle className="size-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center">{getEmptyMessage()}</p>
              </Card>
            )}

            {/* Verified Delivery Info Card */}
            <Card size="md" padding="relaxed" className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase block">TWO-GATE QUALITY ASSURANCE</span>
              <h4 className="text-sm font-bold leading-snug">Dua tahap otorisasi. Satu standar kualitas.</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gerbang 1 (Verifikasi kelayakan PM) dan Gerbang 2 (Otorisasi penutupan TL) wajib lengkap sebelum tugas resmi berstatus DONE.
              </p>
            </Card>
          </div>
        </div>

        {/* Right Column: Selected Task Inspection */}
        {currentTask ? (
          <Card size="md" padding="lg" className="lg:col-span-8 space-y-5">
            {/* Header */}
            <div className="space-y-1 pb-4 border-b border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-xs text-muted-foreground">
                  {currentTask.task_code || "#TSK"} / {currentTask.module?.code || "MOD"}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm" shape="rounded" mono>
                    {currentTask.status}
                  </Badge>
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
              <Alert variant="successSoft" size="lg" className="space-y-4">
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
                  <Card size="md" padding="sm" surface="successOutline" className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="size-3 text-success" />
                      Gerbang 1: Verifikasi Kelayakan PM
                    </span>
                    <p className="font-bold text-foreground">{currentTask.pm_verified_by || "Project Manager"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{currentTask.pm_verified_at ? currentTask.pm_verified_at.split("T")[0] : "Terverifikasi"}</p>
                  </Card>

                  <Card size="md" padding="sm" surface="successOutline" className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-success" />
                      Gerbang 2: Otorisasi Akhir TL
                    </span>
                    <p className="font-bold text-foreground">{currentTask.tl_signed_by || "Technical Lead"}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{currentTask.tl_signed_at ? currentTask.tl_signed_at.split("T")[0] : "Disahkan"}</p>
                  </Card>
                </div>
              </Alert>
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
                        variant={reviewDecision === "PASS" ? "choiceSuccess" : "choice"}
                        size="choice"
                        onClick={() => setReviewDecision("PASS")}
                      >
                        <CheckCircle2 className="size-3.5 text-success" />
                        <span>Disetujui (Pass)</span>
                      </Button>

                      <Button
                        type="button"
                        variant={reviewDecision === "REVISE" ? "choiceDestructive" : "choice"}
                        size="choice"
                        onClick={() => setReviewDecision("REVISE")}
                      >
                        <RotateCcw className="size-3.5 text-destructive" />
                        <span>Perlu Revisi (Rework)</span>
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <Label
                          required={reviewDecision === "REVISE"}
                          size="bold"
                          tone={reviewDecision === "REVISE" ? "destructive" : "default"}
                          className="mb-0"
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
                          className="w-full"
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
                    <h4 className="text-xs font-bold text-foreground">Verifikasi &amp; Pengesahan Akhir</h4>
                  </div>

                  {/* Gerbang 1: PM Verification Card */}
                  <Card size="md" padding="compact" className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <UserCheck className="size-3" />
                        Tahap 1: Verifikasi Kelayakan PM
                      </span>
                      {isPmVerified ? (
                        <Badge variant="success" size="xs" mono>
                          <Check className="size-2.5" />
                          TERVERIFIKASI
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="xs" mono>
                          <Clock className="size-2.5" />
                          MENUNGGU PM
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {isPmVerified
                        ? `Diverifikasi oleh: ${currentTask.pm_verified_by || "Project Manager"} (${currentTask.pm_verified_at ? currentTask.pm_verified_at.split("T")[0] : "Lengkap"}).`
                        : "Project Manager memvalidasi kelayakan penyelesaian tugas sebelum pintu pengesahan Technical Lead terbuka."}
                    </p>

                    <Button
                      type="button"
                      variant={isPmVerified ? "successSubtle" : canPmVerify ? "default" : "muted"}
                      size="sm"
                      onClick={handleSavePmVerification}
                      loading={pmVerifyMutation.isPending}
                      disabled={isPmVerified || !canPmVerify}
                      className="w-full"
                    >
                      <Check className="size-3.5" />
                      <span>{isPmVerified ? "Kelayakan PM Telah Disahkan ✓" : canPmVerify ? "Validasi Verifikasi Kelayakan (PM)" : "Hanya PM yang Berwenang Memvalidasi"}</span>
                    </Button>
                  </Card>

                  {/* Gerbang 2: TL Final Sign-off Card */}
                  <Card size="md" padding="compact" className="space-y-2.5">
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
                        <Badge variant="success" size="xs" mono>
                          <Check className="size-2.5" />
                          DONE
                        </Badge>
                      ) : isPmVerified ? (
                        <Badge variant="purple" size="xs" mono>
                          <Unlock className="size-2.5" />
                          SIAP DISAHKAN
                        </Badge>
                      ) : (
                        <Badge variant="default" size="xs" mono>
                          <Lock className="size-2.5" />
                          TERKUNCI
                        </Badge>
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
                      variant={isTlSigned ? "success" : isPmVerified && canTlSignoff ? "default" : "muted"}
                      size="sm"
                      onClick={handleTlFinalSignoff}
                      loading={tlSignoffMutation.isPending}
                      disabled={!isPmVerified || isTlSigned || !canTlSignoff}
                      className="w-full"
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
                  </Card>
                </div>
              </div>
            )}

            {/* Bottom Footer Actions (Only for Non-DONE tasks) */}
            {currentTask.status !== "DONE" && (
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="destructiveSubtle"
                  onClick={handleRejectToDevelopment}
                  loading={submitReviewMutation.isPending}
                  className="w-full sm:w-auto"
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
                      className="w-full sm:w-auto"
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
                      className="w-full sm:w-auto"
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
                      className="w-full sm:w-auto"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Otorisasi Sign-Off Done (TL)</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ) : (
          <Card size="md" padding="empty" dashed className="lg:col-span-8 flex flex-col items-center space-y-3">
            <ShieldAlert className="size-8 text-muted-foreground" />
            <h4 className="text-sm font-bold text-foreground text-center">Tidak Ada Tugas yang Dipilih</h4>
            <p className="text-xs text-muted-foreground text-center">Pilih salah satu tugas dari antrean sebelah kiri untuk meninjau detail pemeriksaan dan otorisasi.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
