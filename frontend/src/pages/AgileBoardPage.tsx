import React, { useState } from 'react';
import { Kanban, Filter, Search, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useModules } from '../hooks/useProgress';
import { KanbanBoard } from '../components/KanbanBoard';
import { UserRole } from '../types/task.types';

interface AgileBoardPageProps {
  currentRole: UserRole;
}

export const AgileBoardPage: React.FC<AgileBoardPageProps> = ({ currentRole }) => {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: rawModules } = useModules('PROJ-ERP-01');
  const { data: tasks, isLoading, refetch } = useTasks({
    module_id: selectedModule || undefined,
  });

  const filteredTasks = (tasks || []).filter((task) => {
    // Only tasks released or beyond are on board (FTR-K04-04)
    if (task.status === 'DRAFT') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.task_code.toLowerCase().includes(q) ||
        (task.assignee_name && task.assignee_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">
              Papan Tugas Interaktif (Agile Kanban Board)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Alur kerja 5 tahap (RELEASED &rarr; DEVELOPMENT &rarr; CODE REVIEW &rarr; TESTING &rarr; DONE). Otomasi jalur rework bila review/uji ditolak.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Module Filter */}
          <div className="relative">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-slate-850 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Modul</option>
              {rawModules?.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.code}] {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kode/judul/PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-850 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition"
            title="Refresh Data Board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules Banner Info */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Aturan Bisnis:</strong> Memindahkan ke Development wajib menetapkan PIC. Penolakan review/test otomatis kembali ke Development (Rework).
          </span>
        </div>
        <div className="text-[11px] text-indigo-300 bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-800/40 font-mono">
          Peran Anda Saat Ini: <strong className="text-white">{currentRole}</strong>
        </div>
      </div>

      {/* Kanban Board Component */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Memuat kartu tugas agile...
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          currentRole={currentRole}
          onRefresh={refetch}
        />
      )}

    </div>
  );
};
