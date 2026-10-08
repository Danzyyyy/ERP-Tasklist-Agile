import React, { useState } from 'react';
import { Layers, Plus, Filter, Search, RefreshCw } from 'lucide-react';
import { useHierarchy, useTasks } from '../hooks/useTasks';
import { useModules } from '../hooks/useProgress';
import { TaskTree } from '../components/TaskTree';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { UserRole } from '../types/task.types';

interface TasklistTreePageProps {
  currentRole: UserRole;
}

export const TasklistTreePage: React.FC<TasklistTreePageProps> = ({ currentRole }) => {
  const { data: hierarchy, isLoading, refetch } = useHierarchy('PROJ-ERP-01');
  const { data: rawModules } = useModules('PROJ-ERP-01');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">
              Hierarki Modul, Fitur & Tugas Proyek (SOP-05 / WI-04)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan struktur dekomposisi pekerjaan proyek ERP. Setiap tugas terikat pada parameter bobot kompleksitas, estimasi man-hour, dan target SLA H-1.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* Main Tree View */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Memuat struktur hierarki modul dan tugas...
        </div>
      ) : hierarchy && hierarchy.length > 0 ? (
        <TaskTree
          modules={hierarchy}
          currentRole={currentRole}
          onOpenCreateTask={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="p-12 text-center text-xs text-slate-400">
          Belum ada modul yang terdaftar dalam proyek ini.
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        modules={rawModules || hierarchy || []}
      />

    </div>
  );
};
