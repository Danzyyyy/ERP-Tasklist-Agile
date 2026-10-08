import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useTasks } from '../hooks/useTasks';
import { UserRole } from '../types/task.types';

interface DashboardPageProps {
  currentRole: UserRole;
  onNavigate: (tab: 'dashboard' | 'hierarchy' | 'kanban') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentRole,
  onNavigate,
}) => {
  const { data: progress, isLoading: isProgressLoading } = useProgress('PROJ-ERP-01');
  const { data: tasks, isLoading: isTasksLoading } = useTasks();

  const draftTasks = tasks?.filter((t) => t.status === 'DRAFT') || [];
  const inProgressTasks = tasks?.filter((t) => ['DEVELOPMENT', 'CODE_REVIEW', 'TESTING'].includes(t.status)) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spesifikasi Kontrak Modul E-4 (Kelompok 4 / Kelas E)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Deliverable & Eksekusi Agile
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Sistem kalkulasi progres matematis berbasis rasio akumulasi jam kerja riil (man-hour) tugas berstatus DONE terhadap total beban kerja deliverable proyek ERP PT. Anaheim Nimbus Universal.
          </p>
        </div>

        {/* Deliverable Progress Ratio Widget (FTR-K04-07 & Q-03) */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-200">
                Formula Progres Deliverable (Q-03):
              </span>
              <code className="text-[11px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                (SUM man-hour DONE / SUM man-hour All) × 100%
              </code>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {progress?.progressPercentage ?? 0}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-700 shadow-lg shadow-emerald-500/20"
              style={{ width: `${Math.min(progress?.progressPercentage ?? 0, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Completed Man-Hours */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Man-Hour Selesai (DONE)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {progress?.completedManHours ?? 0} <span className="text-xs font-sans text-slate-400 font-normal">Jam</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <span>Dari total:</span>
            <strong className="text-slate-200 font-mono">{progress?.totalEstimatedManHours ?? 0} Jam</strong>
          </div>
        </div>

        {/* Card 2: Completed Tasks Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Tugas Selesai (DONE)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {progress?.completedTasks ?? 0} <span className="text-xs font-sans text-slate-400 font-normal">/ {progress?.totalTasks ?? 0}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Rasio kelengkapan: <strong className="text-indigo-400">{progress?.completedTasks && progress?.totalTasks ? Math.round((progress.completedTasks / progress.totalTasks) * 100) : 0}%</strong>
          </div>
        </div>

        {/* Card 3: Dual-Approval Gate Backlog */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Antrean Dual-Approval</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            {draftTasks.length} <span className="text-xs font-sans text-slate-400 font-normal">Tugas DRAFT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Membutuhkan persetujuan terpisah TL/PM
          </div>
        </div>

        {/* Card 4: SLA H-1 Watchlist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Kepatuhan SLA H-1</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">
            {progress?.tasksAtRiskOrOverdue ?? 0} <span className="text-xs font-sans text-slate-400 font-normal">Beresiko</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Tenggat H-1 batas akhir deliverable
          </div>
        </div>

      </div>

      {/* Two Columns: Actionable Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Pending Dual Approvals */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Antrean Rilis Tugas (Dual-Approval Gate)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('hierarchy')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {draftTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Semua tugas telah dirilis atau tidak ada antrean draft.
              </p>
            ) : (
              draftTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{task.task_code}</span>
                      <span className="text-xs font-medium text-white truncate">{task.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-3">
                      <span>Estimasi: {task.estimated_man_hours}h</span>
                      <span>Bobot: {task.complexity_weight}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('hierarchy')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition shrink-0"
                  >
                    Evaluasi
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Active In-Progress Tasks in Agile Cycle */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Tugas Berjalan di Siklus Agile
              </h3>
            </div>
            <button
              onClick={() => onNavigate('kanban')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>Buka Papan Agile</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {inProgressTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Tidak ada tugas berjalan saat ini.
              </p>
            ) : (
              inProgressTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{task.task_code}</span>
                      <span className="text-xs font-medium text-white truncate">{task.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-3">
                      <span>PIC: {task.assignee_name || '-'}</span>
                      <span>Tahap: <strong className="text-indigo-300">{task.status}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('kanban')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition shrink-0"
                  >
                    Buka Kartu
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
