import React, { useState } from 'react';
import { X, Clock, AlertTriangle, Layers, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { Module, ComplexityWeight } from '../types/task.types';
import { useCreateTask } from '../hooks/useTasks';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: Module[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  modules,
}) => {
  const [moduleId, setModuleId] = useState(modules[0]?.id || '');
  const [featureId, setFeatureId] = useState<string>('');
  const [taskCode, setTaskCode] = useState(`TSK-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complexityWeight, setComplexityWeight] = useState<ComplexityWeight>('MEDIUM');
  const [estimatedManHours, setEstimatedManHours] = useState('8.0');
  
  // Default deadline 3 days from now (SLA H-1 compliant)
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  const [targetDeadline, setTargetDeadline] = useState(defaultDate.toISOString().slice(0, 16));

  const createTaskMutation = useCreateTask();

  if (!isOpen) return null;

  const selectedModule = modules.find((m) => m.id === moduleId);
  const availableFeatures = selectedModule?.features || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId || !title || !estimatedManHours || !targetDeadline) return;

    try {
      await createTaskMutation.mutateAsync({
        module_id: moduleId,
        feature_id: featureId || null,
        task_code: taskCode,
        title,
        description,
        complexity_weight: complexityWeight,
        estimated_man_hours: parseFloat(estimatedManHours),
        target_deadline: targetDeadline,
      });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat tugas.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Input Tugas Baru (Task Template)</h2>
              <p className="text-xs text-slate-400">
                FTR-K04-02: Menstandarkan acuan beban kerja, bobot, dan kepatuhan tenggat H-1
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Hierarchy Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Modul Proyek (Wajib)
              </label>
              <select
                value={moduleId}
                onChange={(e) => {
                  setModuleId(e.target.value);
                  setFeatureId('');
                }}
                required
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.code}] {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fitur Proyek (Opsional - SOP-05)
              </label>
              <select
                value={featureId}
                onChange={(e) => setFeatureId(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Tanpa Fitur (Langsung di Modul) --</option>
                {availableFeatures.map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.code}] {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Code & Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kode Tugas (Unique)
              </label>
              <input
                type="text"
                value={taskCode}
                onChange={(e) => setTaskCode(e.target.value)}
                required
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judul Tugas
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Implementasi JWT Bearer Interceptor"
                required
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deskripsi & Rincian Scope
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kebutuhan teknis, batasan, dan kriteria penyelesaian tugas..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Parameters: Complexity, Man-hours, SLA H-1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-850/60 border border-slate-800">
            {/* Complexity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bobot Kompleksitas (Q-01)
              </label>
              <select
                value={complexityWeight}
                onChange={(e) => setComplexityWeight(e.target.value as ComplexityWeight)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">LOW (Bobot Rendah)</option>
                <option value="MEDIUM">MEDIUM (Bobot Sedang)</option>
                <option value="HIGH">HIGH (Bobot Tinggi)</option>
              </select>
            </div>

            {/* Man Hours */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Estimasi Man-Hour (Q-02)</span>
                <Clock className="w-3 h-3 text-indigo-400" />
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={estimatedManHours}
                onChange={(e) => setEstimatedManHours(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Satuan: jam kerja riil</span>
            </div>

            {/* Target Deadline SLA H-1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Tenggat Acuan SLA H-1 (Q-11)</span>
                <Calendar className="w-3 h-3 text-amber-400" />
              </label>
              <input
                type="datetime-local"
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-amber-400">Target selesai H-1 due date</span>
            </div>
          </div>

          {/* Dual Approval Notice */}
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300">
            <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-indigo-200">
                Aturan Dual-Approval Task Release (FTR-K04-03)
              </p>
              <p className="text-[11px] text-indigo-300/80 mt-0.5">
                Tugas akan berstatus <span className="font-mono font-bold text-amber-300">DRAFT</span> dan memerlukan persetujuan terpisah dari <span className="font-bold">Technical Lead</span> dan <span className="font-bold">Project Manager</span> sebelum diterbitkan ke papan Kanban.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {createTaskMutation.isPending ? 'Menyimpan...' : 'Simpan Tugas (DRAFT)'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
