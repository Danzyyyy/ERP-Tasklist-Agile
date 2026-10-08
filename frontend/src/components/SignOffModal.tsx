import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, UserCheck, AlertTriangle, Lock, Award } from 'lucide-react';
import { Task, UserRole } from '../types/task.types';
import { useApprovals } from '../hooks/useApprovals';

interface SignOffModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
}

export const SignOffModal: React.FC<SignOffModalProps> = ({
  task,
  isOpen,
  onClose,
  currentRole,
}) => {
  const { pmVerify, isPmVerifying, tlSignoff, isTlSigning } = useApprovals();

  // PM Checklist state
  const [chkQAPassed, setChkQAPassed] = useState(true);
  const [chkDocsComplete, setChkDocsComplete] = useState(true);
  const [chkHoursAccurate, setChkHoursAccurate] = useState(true);

  if (!isOpen || !task) return null;

  const allChecked = chkQAPassed && chkDocsComplete && chkHoursAccurate;
  const isPmRole = currentRole === 'PROJECT_MANAGER';
  const isTlRole = currentRole === 'TECHNICAL_LEAD';

  const handlePmVerify = async () => {
    try {
      await pmVerify(task.id);
      alert('Ceklis verifikasi kelayakan PM berhasil divalidasi! Otorisasi TL kini dibuka.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal melakukan verifikasi PM.');
    }
  };

  const handleTlSignoff = async () => {
    try {
      await tlSignoff(task.id);
      alert('Otorisasi sign-off selesai oleh Technical Lead berhasil! Tugas resmi beralih ke DONE.');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal melakukan sign-off TL.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Verifikasi & Sign-off Selesai (DONE)</h2>
              <p className="text-xs text-slate-400">
                FTR-K04-06: Gerbang final kepatuhan Definition of Done (Ceklis PM + Sign-off TL)
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

        {/* Task Summary */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-850 border border-slate-800 text-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="font-mono font-bold text-indigo-400">{task.task_code}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold uppercase text-[10px]">
              Tahap: {task.status}
            </span>
          </div>
          <p className="font-semibold text-white">{task.title}</p>
          <div className="flex items-center space-x-4 mt-2 text-slate-400">
            <span>Estimasi: <strong className="text-slate-200">{task.estimated_man_hours} Jam</strong></span>
            <span>PIC: <strong className="text-slate-200">{task.assignee_name || '-'}</strong></span>
          </div>
        </div>

        {/* Two-Stage Gate Section */}
        <div className="mt-4 space-y-4">
          
          {/* Gate 1: PM Checklist Verification */}
          <div className={`p-4 rounded-xl border transition-all ${
            task.is_pm_verified 
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
              : 'bg-slate-850 border-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400">
                <UserCheck className="w-4 h-4" />
                <span>Tahap 1: Ceklis Verifikasi Kelayakan (Aktor: PM)</span>
              </div>
              {task.is_pm_verified ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>TERVERIFIKASI</span>
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Belum Lengkap
                </span>
              )}
            </div>

            {task.is_pm_verified ? (
              <p className="text-xs text-slate-300">
                Diverifikasi oleh: <strong className="text-white">{task.pm_verified_by || 'Project Manager'}</strong>
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chkQAPassed}
                    onChange={(e) => setChkQAPassed(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                  />
                  <span>1. Pengujian fungsional dan acceptance criteria telah lolos QA.</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chkDocsComplete}
                    onChange={(e) => setChkDocsComplete(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                  />
                  <span>2. Dokumentasi teknis, API contracts, dan changelog terpasang.</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chkHoursAccurate}
                    onChange={(e) => setChkHoursAccurate(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                  />
                  <span>3. Jam kerja aktual (actual man-hours) terekam untuk kalkulasi progres.</span>
                </label>

                {isPmRole && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handlePmVerify}
                      disabled={isPmVerifying || !allChecked}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition disabled:opacity-50"
                    >
                      {isPmVerifying ? 'Memvalidasi...' : 'Validasi Ceklis PM (Buka Akses TL)'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gate 2: TL Final Sign-off Authorization */}
          <div className={`p-4 rounded-xl border transition-all ${
            task.is_tl_signed
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
              : task.is_pm_verified
              ? 'bg-amber-950/20 border-amber-800/40'
              : 'bg-slate-850/50 border-slate-800 opacity-70'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Tahap 2: Otorisasi Pengesahan Selesai (Aktor: TL)</span>
              </div>
              {task.is_tl_signed ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>DONE & SIGNED</span>
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Menunggu TL
                </span>
              )}
            </div>

            {task.is_tl_signed ? (
              <p className="text-xs text-slate-300">
                Disahkan oleh Technical Lead: <strong className="text-white">{task.tl_signed_by || 'Technical Lead'}</strong>
              </p>
            ) : !task.is_pm_verified ? (
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Terkunci. Verifikasi ceklis PM wajib dipenuhi terlebih dahulu.</span>
              </div>
            ) : isTlRole ? (
              <div className="space-y-2">
                <p className="text-xs text-amber-200">
                  Ceklis PM telah tervalidasi. Sebagai Technical Lead, Anda berwenang mengesahkan tugas ini resmi DONE.
                </p>
                <button
                  type="button"
                  onClick={handleTlSignoff}
                  disabled={isTlSigning}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {isTlSigning ? 'Mengesahkan...' : 'Otorisasi Selesai / Sign-off Done (Pindah ke DONE)'}
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Hanya pengguna dengan peran <strong className="text-amber-300">TECHNICAL_LEAD</strong> yang berwenang menekan tombol otorisasi Sign-off Done.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
