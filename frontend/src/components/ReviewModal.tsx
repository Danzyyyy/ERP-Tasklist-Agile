import React, { useState } from 'react';
import { X, Code2, CheckCircle2, RotateCcw, AlertTriangle, Bug } from 'lucide-react';
import { Task, ReviewType, UserRole } from '../types/task.types';
import { useApprovals } from '../hooks/useApprovals';

interface ReviewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  reviewType: ReviewType;
  currentRole: UserRole;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  task,
  isOpen,
  onClose,
  reviewType,
  currentRole,
}) => {
  const [notes, setNotes] = useState('');
  const { submitReview, isSubmittingReview } = useApprovals();

  if (!isOpen || !task) return null;

  const isCodeReview = reviewType === 'CODE_REVIEW';

  const handleAction = async (result: 'PASSED' | 'REJECTED') => {
    try {
      await submitReview({
        taskId: task.id,
        payload: {
          review_type: reviewType,
          result,
          notes: notes || undefined,
        },
      });
      setNotes('');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan hasil review/testing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isCodeReview
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}>
              {isCodeReview ? <Code2 className="w-4 h-4" /> : <Bug className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isCodeReview ? 'Pemeriksaan Code Review' : 'Pengujian QA Testing'}
              </h2>
              <p className="text-xs text-slate-400">
                FTR-K04-05: Pemeriksaan manual kualitas & alur penanganan bug
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Info */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-850 border border-slate-800 text-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-mono font-bold text-indigo-400">{task.task_code}</span>
            <span>Assignee: <strong className="text-slate-200">{task.assignee_name || 'Belum ada'}</strong></span>
          </div>
          <p className="font-semibold text-white">{task.title}</p>
        </div>

        {/* Rework Flow Notice */}
        <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start space-x-2">
          <RotateCcw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Otomasi Jalur Rework:</span> Jika hasil pemeriksaan bernilai <span className="font-bold text-rose-400">REJECTED</span>, status tugas akan <strong>otomatis kembali ke kolom DEVELOPMENT</strong> untuk diperbaiki pengembang.
          </div>
        </div>

        {/* Notes Input */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Catatan Review / Temuan Bug ({currentRole})
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              isCodeReview
                ? 'Catatan arsitektur, clean code, styling, security checklist...'
                : 'Catatan test cases, bug reproduction, environment...'
            }
            className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => handleAction('REJECTED')}
            disabled={isSubmittingReview}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tolak & Kembalikan ke Development</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction('PASSED')}
            disabled={isSubmittingReview}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lolos Uji ({isCodeReview ? 'Lanjut ke QA' : 'Siap Sign-off'})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
