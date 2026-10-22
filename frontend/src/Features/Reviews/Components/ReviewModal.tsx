// src/Features/Reviews/Components/ReviewModal.tsx
import React, { memo, useState } from "react";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import useSubmitReview from "../Hooks/useSubmitReview";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import type { Task, ReviewType, ReviewResult } from "@/Types/task";
import {
  FileCode2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export interface ReviewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal = memo<ReviewModalProps>(({ task, isOpen, onClose }) => {
  const { role, user } = useAuth();
  const [reviewType, setReviewType] = useState<ReviewType>(
    task?.status === "TESTING" ? "TESTING" : "CODE_REVIEW",
  );
  const [result, setResult] = useState<ReviewResult>("PASSED");
  const [notes, setNotes] = useState("");

  const { mutate: submitReview, isPending } = useSubmitReview(task?.id, () => {
    setNotes("");
    onClose();
  });

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview({
      review_type: reviewType,
      result,
      notes:
        notes.trim() ||
        (result === "PASSED"
          ? `Pemeriksaan ${reviewType} disetujui tanpa temuan blocking oleh ${user?.name || role}.`
          : `Bug / temuan arsitektur dicatat oleh ${user?.name || role}. Alur Rework dipicu.`),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <FileCode2 className="size-5 text-purple-600" />
          <span>Pemeriksaan Kode & Pengujian QA</span>
          <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
            FTR-K04-05
          </span>
        </div>
      }
      description={
        <div className="break-words leading-relaxed">
          Catat hasil pemeriksaan untuk tugas{" "}
          <strong className="font-mono text-slate-800">{task.task_code}</strong>: "{task.title}".
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
        {/* Review Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tahap Pemeriksaan <span className="text-red-500">*</span>
          </label>
          <Select
            value={reviewType}
            onChange={(e) => setReviewType(e.target.value as ReviewType)}
          >
            <option value="CODE_REVIEW">Code Review (Peer Review Kualitas Kode)</option>
            <option value="TESTING">QA Testing (Pengujian Skenario & Fungsionalitas)</option>
          </Select>
        </div>

        {/* Decision Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Keputusan Pemeriksaan <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResult("PASSED")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                result === "PASSED"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>PASSED (Lolos)</span>
            </button>

            <button
              type="button"
              onClick={() => setResult("REJECTED")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                result === "REJECTED"
                  ? "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <XCircle className="size-4 text-red-600" />
              <span>REJECTED (Tolak / Bug)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Warning for Rework */}
        {result === "REJECTED" ? (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-[11px] leading-relaxed flex items-start gap-2">
            <RotateCcw className="size-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <b>Otomasi Alur Rework (Q-05):</b> Kartu tugas ini akan secara otomatis dikembalikan ke
              kolom <b>DEVELOPMENT</b> dengan label <b>REWORK</b>. Pengembang PIC wajib memperbaiki
              temuan sebelum mengajukan kembali.
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed flex items-start gap-2">
            <Sparkles className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              Pemeriksaan lolos verifikasi. Tugas siap dilanjutkan ke tahap berikutnya dalam siklus agile.
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Temuan / Deskripsi Bug (Opsional)
          </label>
          <Textarea
            placeholder={
              result === "REJECTED"
                ? "Jelaskan langkah reproduksi bug atau bagian kode yang memerlukan perbaikan..."
                : "Catatan positif hasil pemeriksaan kode atau pengujian..."
            }
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
});

ReviewModal.displayName = "ReviewModal";
export default ReviewModal;
