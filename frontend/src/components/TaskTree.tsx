import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { Module, Task, UserRole } from '../types/task.types';
import { ApprovalModal } from './ApprovalModal';

interface TaskTreeProps {
  modules: Module[];
  currentRole: UserRole;
  onOpenCreateTask: () => void;
}

export const TaskTree: React.FC<TaskTreeProps> = ({
  modules,
  currentRole,
  onOpenCreateTask,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [modules[0]?.id]: true,
  });
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  
  const [selectedTaskForApproval, setSelectedTaskForApproval] = useState<Task | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFeature = (id: string) => {
    setExpandedFeatures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'RELEASED':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'DEVELOPMENT':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'CODE_REVIEW':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'TESTING':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'DRAFT':
      default:
        return 'bg-slate-700/60 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>Struktur Hierarki Pekerjaan (SOP-05 / Q-13)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarki terpadu: Modul Proyek &rarr; Fitur (Opsional) &rarr; Tugas Eksekusi
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Input Tugas Baru</span>
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((mod) => {
          const isModOpen = !!expandedModules[mod.id];
          
          // Calculate total module man-hours
          let totalModHours = 0;
          let doneModHours = 0;
          mod.features?.forEach((f) => {
            f.tasks?.forEach((t) => {
              const h = Number(t.estimated_man_hours) || 0;
              totalModHours += h;
              if (t.status === 'DONE') doneModHours += h;
            });
          });
          mod.tasks?.forEach((t) => {
            const h = Number(t.estimated_man_hours) || 0;
            totalModHours += h;
            if (t.status === 'DONE') doneModHours += h;
          });

          const modProgress = totalModHours > 0 ? Math.round((doneModHours / totalModHours) * 100) : 0;

          return (
            <div
              key={mod.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              {/* Module Header Bar */}
              <div
                onClick={() => toggleModule(mod.id)}
                className="flex items-center justify-between p-4 bg-slate-850/80 hover:bg-slate-800 cursor-pointer select-none transition border-b border-slate-800/60"
              >
                <div className="flex items-center space-x-3">
                  <button className="text-slate-400 hover:text-white">
                    {isModOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    {isModOpen ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">[{mod.code}]</span>
                      <span className="text-xs font-bold text-white">{mod.name}</span>
                    </div>
                    {mod.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
                    )}
                  </div>
                </div>

                {/* Module Stats */}
                <div className="flex items-center space-x-6 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      <strong className="text-slate-200">{doneModHours}h</strong> / {totalModHours}h
                    </span>
                  </div>

                  <div className="w-28 flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${modProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300">{modProgress}%</span>
                  </div>
                </div>
              </div>

              {/* Module Children */}
              {isModOpen && (
                <div className="p-4 space-y-4 bg-slate-900/60">
                  
                  {/* Features List */}
                  {mod.features && mod.features.map((feat) => {
                    const isFeatOpen = expandedFeatures[feat.id] !== false; // default open
                    return (
                      <div key={feat.id} className="ml-4 pl-4 border-l-2 border-slate-800 space-y-2">
                        
                        {/* Feature Row */}
                        <div
                          onClick={() => toggleFeature(feat.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850/50 hover:bg-slate-800/60 cursor-pointer select-none transition"
                        >
                          <div className="flex items-center space-x-2.5">
                            {isFeatOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                            <Layers className="w-3.5 h-3.5 text-purple-400" />
                            <span className="font-mono text-xs font-semibold text-purple-300">[{feat.code}]</span>
                            <span className="text-xs font-semibold text-slate-200">{feat.name}</span>
                          </div>

                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                            {feat.tasks?.length || 0} Tugas
                          </span>
                        </div>

                        {/* Feature Tasks */}
                        {isFeatOpen && feat.tasks && (
                          <div className="ml-6 space-y-2">
                            {feat.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-850/90 border border-slate-800 hover:border-slate-700 transition"
                              >
                                <div className="flex items-center space-x-3 min-w-0">
                                  <span className="font-mono text-xs font-bold text-indigo-400 shrink-0">
                                    {task.task_code}
                                  </span>
                                  <span className="text-xs font-medium text-slate-200 truncate">
                                    {task.title}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-3 shrink-0 ml-4">
                                  <span className="text-[11px] text-slate-400">
                                    <strong className="text-slate-200">{task.estimated_man_hours}h</strong>
                                  </span>

                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(task.status)}`}>
                                    {task.status}
                                  </span>

                                  {task.status === 'DRAFT' && (
                                    <button
                                      onClick={() => setSelectedTaskForApproval(task)}
                                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition"
                                    >
                                      <ShieldCheck className="w-3 h-3" />
                                      <span>Dual-Approval</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })}

                  {/* Tasks directly under module (Nullable Feature) */}
                  {mod.tasks && mod.tasks.length > 0 && (
                    <div className="ml-4 pl-4 border-l-2 border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2">
                        Tugas Tanpa Fitur (Direct Module Level)
                      </div>
                      <div className="ml-2 space-y-2">
                        {mod.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-850/90 border border-slate-800 hover:border-slate-700 transition"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <span className="font-mono text-xs font-bold text-indigo-400 shrink-0">
                                {task.task_code}
                              </span>
                              <span className="text-xs font-medium text-slate-200 truncate">
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 shrink-0 ml-4">
                              <span className="text-[11px] text-slate-400">
                                <strong className="text-slate-200">{task.estimated_man_hours}h</strong>
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Dual Approval Modal from Tree */}
      <ApprovalModal
        task={selectedTaskForApproval}
        isOpen={!!selectedTaskForApproval}
        onClose={() => setSelectedTaskForApproval(null)}
        currentRole={currentRole}
      />
    </div>
  );
};
