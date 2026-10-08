import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, AlertOctagon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Task, UserRole } from '../types/task.types';
import { useApprovals } from '../hooks/useApprovals';

interface ApprovalModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  task,
  isOpen,
  onClose,
  currentRole,
}) => {
  const [notes, setNotes] = useState('');
  const { submitApproval, isSubmittingApproval } = useApprovals();

  if (!isOpen || !task) return null;

  const tlApproval = task.approvals?.find((a) => a.role === 'TECHNICAL_LEAD');
  const pmApproval = task.approvals?.find((a) => a.role === 'PROJECT_MANAGER');

  const canApprove = currentRole === 'TECHNICAL_LEAD' || currentRole === 'PROJECT_MANAGER';
  const myApproval = currentRole === 'TECHNICAL_LEAD' ? tlApproval : pmApproval;
  const isAlreadyApproved = myApproval?.status === 'APPROVED';

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await submitApproval({
        taskId: task.id,
        payload: {
          status,
          notes: notes || undefined,
        },
      });
      setNotes('');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memproses persetujuan rilis.');
    }
  };

  const renderBadge = (status?: string) => {
    if (status === 'APPROVED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>APPROVED</span>
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3" />
          <span>REJECTED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" />
        <span>PENDING</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dual-Approval Task Release</h2>
              <p className="text-xs text-slate-400">
                FTR-K04-03: Wajib disetujui terpisah oleh TL & PM sebelum beralih ke RELEASED
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

        {/* Task Summary Card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-indigo-400 font-bold">{task.task_code}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase text-[10px]">
              Status: {task.status}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white mt-1">{task.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
            <span>Bobot: <strong className="text-slate-200">{task.complexity_weight}</strong></span>
            <span>Estimasi: <strong className="text-slate-200">{task.estimated_man_hours} Man-Hours</strong></span>
          </div>
        </div>

        {/* Dual Gate Status */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Gate 1: Technical Lead */}
          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Technical Lead</span>
              </div>
              {renderBadge(tlApproval?.status)}
            </div>
            <p className="text-[11px] text-slate-400">
              {tlApproval?.approver_name || 'Menunggu tindakan TL...'}
            </p>
            {tlApproval?.notes && (
              <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                "{tlApproval.notes}"
              </p>
            )}
          </div>

          {/* Gate 2: Project Manager */}
          <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-400">
                <UserCheck className="w-4 h-4" />
                <span>Project Manager</span>
              </div>
              {renderBadge(pmApproval?.status)}
            </div>
            <p className="text-[11px] text-slate-400">
              {pmApproval?.approver_name || 'Menunggu tindakan PM...'}
            </p>
            {pmApproval?.notes && (
              <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                "{pmApproval.notes}"
              </p>
            )}
          </div>

        </div>

        {/* Authorization Form or Permission Warning */}
        {canApprove ? (
          <div className="mt-4 space-y-3 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catatan Persetujuan / Alasan Penolakan ({currentRole})
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan catatan teknis atau justifikasi..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => handleAction('REJECTED')}
                disabled={isSubmittingApproval}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition disabled:opacity-50"
              >
                Tolak Rilis (REJECT)
              </button>
              <button
                type="button"
                onClick={() => handleAction('APPROVED')}
                disabled={isSubmittingApproval || isAlreadyApproved}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {isAlreadyApproved ? 'Sudah Disetujui' : 'Setujui Rilis (APPROVE)'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-start space-x-2 text-rose-300 text-xs">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Akses Ditolak (HTTP 403 Forbidden):</span> Peran aktif Anda saat ini ({currentRole}) bukan Technical Lead atau Project Manager. Silakan beralih peran via menu kanan atas untuk mengevaluasi rilis.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
