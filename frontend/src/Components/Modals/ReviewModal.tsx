// src/Components/Modals/ReviewModal.tsx
import React, { memo } from "react";
import { useReviewForm } from "@/Hooks/useReviewForm";
import { Modal } from "@/Components/Elements/Modal";
import { Alert } from "@/Components/Elements/Alert";
import { Button } from "@/Components/Elements/Button";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import { Label } from "@/Components/Elements/Label";
import type { ReviewResult, ReviewType, Task } from "@/Types/task";
import { FileCode2, CheckCircle2, XCircle, RotateCcw, Sparkles, Lock } from "lucide-react";

export interface ReviewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialReviewType?: ReviewType;
  initialResult?: ReviewResult;
}

export const ReviewModal = memo<ReviewModalProps>(({ task, isOpen, onClose, initialReviewType, initialResult }) => {
  const { register, errors, reviewType, result, setResult, canSubmitCurrentReview, handleSubmit, isPending } = useReviewForm(task, onClose, initialReviewType, initialResult);

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <FileCode2 className="size-5 text-purple-subtle-foreground" />
          <span>Pemeriksaan Kode &amp; Pengujian QA</span>
        </div>
      }
      description={
        <div className="wrap-break-word leading-relaxed">
          Catat hasil pemeriksaan untuk tugas <strong className="font-mono text-foreground">{task.task_code}</strong>: "{task.title}".
        </div>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="submit-review-form" variant={result === "REJECTED" ? "destructive" : "primary"} loading={isPending} disabled={!canSubmitCurrentReview}>
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
          <Alert variant="warning" size="sm">
            <div className="text-[11px] leading-relaxed flex items-start gap-2">
              <Lock className="size-4 shrink-0 mt-0.5" />
              <div>
                <b>Akses Role Terbatas:</b>{" "}
                {reviewType === "CODE_REVIEW"
                  ? "Hanya peran Technical Lead atau Project Manager yang berwenang mencatat hasil Code Review."
                  : "Hanya peran QA Tester, Technical Lead, atau Project Manager yang berwenang mencatat hasil QA Testing."}
              </div>
            </div>
          </Alert>
        )}

        {/* Review Type Selection */}
        <div>
          <Label required>Tahap Pemeriksaan</Label>
          <Select {...register("review_type")} error={Boolean(errors.review_type)}>
            <option value="CODE_REVIEW">Code Review (Peer Review Kualitas Kode)</option>
            <option value="TESTING">QA Testing (Pengujian Skenario & Fungsionalitas)</option>
          </Select>
        </div>

        {/* Decision Toggle */}
        <div>
          <Label required>Keputusan Pemeriksaan</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={result === "PASSED" ? "choiceSuccess" : "choice"}
              size="choice"
              onClick={() => setResult("PASSED")}
            >
              <CheckCircle2 className="size-4 text-success" />
              <span>PASSED (Lolos)</span>
            </Button>

            <Button
              type="button"
              variant={result === "REJECTED" ? "choiceDestructive" : "choice"}
              size="choice"
              onClick={() => setResult("REJECTED")}
            >
              <XCircle className="size-4 text-destructive" />
              <span>REJECTED (Tolak / Bug)</span>
            </Button>
          </div>
        </div>

        {/* Dynamic Warning for Rework */}
        {result === "REJECTED" ? (
          <Alert variant="destructive" size="sm">
            <div className="text-[11px] leading-relaxed flex items-start gap-2">
              <RotateCcw className="size-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <b>Otomasi Alur Rework:</b> Kartu tugas ini akan secara otomatis dikembalikan ke kolom <b>DEVELOPMENT</b> dengan label <b>REWORK</b>. Pengembang PIC wajib
                memperbaiki temuan sebelum mengajukan kembali.
              </div>
            </div>
          </Alert>
        ) : (
          <Alert variant="success" size="sm">
            <div className="text-[11px] leading-relaxed flex items-start gap-2">
              <Sparkles className="size-4 text-success shrink-0 mt-0.5" />
              <div>Pemeriksaan lolos verifikasi. Tugas siap dilanjutkan ke tahap berikutnya dalam siklus agile.</div>
            </div>
          </Alert>
        )}

        {/* Notes */}
        <div>
          <Label required={result === "REJECTED"}>Catatan Temuan / Deskripsi Bug {result === "REJECTED" ? "(Wajib untuk Rework)" : "(Opsional)"}</Label>
          <Textarea
            placeholder={
              result === "REJECTED" ? "Jelaskan langkah reproduksi bug atau bagian kode yang memerlukan perbaikan..." : "Catatan positif hasil pemeriksaan kode atau pengujian..."
            }
            rows={3}
            error={Boolean(errors.notes)}
            {...register("notes")}
          />
          {errors.notes && <p className="text-[11px] text-destructive mt-1 font-medium">{errors.notes.message}</p>}
        </div>
      </form>
    </Modal>
  );
});

ReviewModal.displayName = "ReviewModal";
export default ReviewModal;
