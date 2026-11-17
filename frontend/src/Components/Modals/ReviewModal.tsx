// src/Components/Modals/ReviewModal.tsx
import React, { memo } from "react";
import { useReviewForm } from "@/Hooks/useReviewForm";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import type { ReviewResult, ReviewType, Task } from "@/Types/task";
import { FileCode2, CheckCircle2, XCircle, RotateCcw, Sparkles, Lock } from "lucide-react";

export interface ReviewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  initialReviewType?: ReviewType;
  initialResult?: ReviewResult;
}

export const ReviewModal = memo<ReviewModalProps>(
  ({ task, isOpen, onClose, initialReviewType, initialResult }) => {
    const {
      register,
      errors,
      reviewType,
      result,
      setResult,
      canSubmitCurrentReview,
      handleSubmit,
      isPending,
    } = useReviewForm(task, onClose, initialReviewType, initialResult);

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <FileCode2 className="size-5 text-purple-subtle-foreground" />
          <span>Pemeriksaan Kode & Pengujian QA</span>
          <span className="text-[10px] font-mono font-bold bg-purple-subtle text-purple-subtle-foreground px-2 py-0.5 rounded border border-purple-subtle-border">
            FTR-K04-05
          </span>
        </div>
      }
      description={
        <div className="wrap-break-word leading-relaxed">
          Catat hasil pemeriksaan untuk tugas{" "}
          <strong className="font-mono text-foreground">{task.task_code}</strong>: "{task.title}".
        </div>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button
            type="submit"
            form="submit-review-form"
            variant={result === "REJECTED" ? "destructive" : "primary"}
            loading={isPending}
            disabled={!canSubmitCurrentReview}
          >
            {result === "REJECTED" ? (
              <>
                <RotateCcw className="size-3.5 mr-1" />
                Kirim Penolakan (Alur Rework)
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5 mr-1" />
                Loloskan Pemeriksaan (PASSED)
              </>
            )}
          </Button>
        </>
      }
    >
      <form id="submit-review-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
        {!canSubmitCurrentReview && (
          <div className="p-3 rounded-lg bg-warning-subtle border border-warning-subtle-border text-warning-subtle-foreground text-[11px] leading-relaxed flex items-start gap-2">
            <Lock className="size-4 shrink-0 mt-0.5" />
            <div>
              <b>Akses Role Terbatas:</b>{" "}
              {reviewType === "CODE_REVIEW"
                ? "Hanya peran Technical Lead atau Project Manager yang berwenang mencatat hasil Code Review."
                : "Hanya peran QA Tester, Technical Lead, atau Project Manager yang berwenang mencatat hasil QA Testing."}
            </div>
          </div>
        )}

        {/* Review Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Tahap Pemeriksaan <span className="text-destructive">*</span>
          </label>
          <Select {...register("review_type")} error={Boolean(errors.review_type)}>
            <option value="CODE_REVIEW">Code Review (Peer Review Kualitas Kode)</option>
            <option value="TESTING">QA Testing (Pengujian Skenario & Fungsionalitas)</option>
          </Select>
        </div>

        {/* Decision Toggle */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Keputusan Pemeriksaan <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResult("PASSED")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                result === "PASSED"
                  ? "border-success bg-success-subtle text-success-subtle-foreground ring-2 ring-success/20"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <CheckCircle2 className="size-4 text-success" />
              <span>PASSED (Lolos)</span>
            </button>

            <button
              type="button"
              onClick={() => setResult("REJECTED")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                result === "REJECTED"
                  ? "border-destructive bg-destructive-subtle text-destructive-subtle-foreground ring-2 ring-destructive/20"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <XCircle className="size-4 text-destructive" />
              <span>REJECTED (Tolak / Bug)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Warning for Rework */}
        {result === "REJECTED" ? (
          <div className="p-3 rounded-lg bg-destructive-subtle border border-destructive-subtle-border text-destructive-subtle-foreground text-[11px] leading-relaxed flex items-start gap-2">
            <RotateCcw className="size-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <b>Otomasi Alur Rework (Q-05):</b> Kartu tugas ini akan secara otomatis dikembalikan
              ke kolom <b>DEVELOPMENT</b> dengan label <b>REWORK</b>. Pengembang PIC wajib
              memperbaiki temuan sebelum mengajukan kembali.
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-success-subtle border border-success-subtle-border text-success-subtle-foreground text-[11px] leading-relaxed flex items-start gap-2">
            <Sparkles className="size-4 text-success shrink-0 mt-0.5" />
            <div>
              Pemeriksaan lolos verifikasi. Tugas siap dilanjutkan ke tahap berikutnya dalam siklus
              agile.
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Catatan Temuan / Deskripsi Bug{" "}
            {result === "REJECTED" ? (
              <span className="text-destructive">* (Wajib untuk Rework)</span>
            ) : (
              "(Opsional)"
            )}
          </label>
          <Textarea
            placeholder={
              result === "REJECTED"
                ? "Jelaskan langkah reproduksi bug atau bagian kode yang memerlukan perbaikan..."
                : "Catatan positif hasil pemeriksaan kode atau pengujian..."
            }
            rows={3}
            error={Boolean(errors.notes)}
            {...register("notes")}
          />
          {errors.notes && (
            <p className="text-[11px] text-destructive mt-1 font-medium">{errors.notes.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
});

ReviewModal.displayName = "ReviewModal";
export default ReviewModal;
