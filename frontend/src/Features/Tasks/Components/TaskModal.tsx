// src/Features/Tasks/Components/TaskModal.tsx
import React, { memo, useEffect } from "react";
import useCreateTask from "../Hooks/useCreateTask";
import useModules from "@/Features/Modules/Hooks/useModules";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import { COMPLEXITY_OPTIONS } from "@/Constants/CommonConstant";
import { Clock, Calendar, AlertCircle } from "lucide-react";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
  defaultFeatureId?: string;
}

export const TaskModal = memo<TaskModalProps>(
  ({ isOpen, onClose, defaultModuleId, defaultFeatureId }) => {
    const { data: modules = [] } = useModules();
    const { form, handleSubmitForm, loading } = useCreateTask({
      defaultModuleId,
      defaultFeatureId,
      onSuccess: onClose,
    });

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = form;

    const selectedModuleId = watch("module_id");
    const selectedModule = modules.find((m) => m.id === selectedModuleId);
    const availableFeatures = selectedModule?.features || [];

    useEffect(() => {
      if (modules.length > 0 && !selectedModuleId) {
        const first = defaultModuleId || modules[0].id;
        setValue("module_id", first);
      }
    }, [modules, selectedModuleId, defaultModuleId, setValue]);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="lg"
        title={
          <div className="flex items-center gap-2">
            <span>Buat Tugas Baru (Task Template)</span>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200">
              SOP-07 / WI-04
            </span>
          </div>
        }
        description="Tugas baru akan diinisialisasi dalam status DRAFT dan otomatis menunggu Dual-Approval TL & PM."
        footer={
          <>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" form="create-task-form" loading={loading}>
              Ajukan ke Dual-Approval
            </Button>
          </>
        }
      >
        <form id="create-task-form" onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          {/* Module & Feature Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Modul Proyek <span className="text-red-500">*</span>
              </label>
              <Select {...register("module_id")} error={Boolean(errors.module_id)}>
                <option value="">Pilih Modul...</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} — {m.name}
                  </option>
                ))}
              </Select>
              {errors.module_id && (
                <p className="text-[11px] text-red-500 mt-1">{errors.module_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fitur (Opsional - SOP-05)
              </label>
              <Select {...register("feature_id")} disabled={availableFeatures.length === 0}>
                <option value="">Langsung di tingkat Modul (Tanpa Fitur)</option>
                {availableFeatures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code} — {f.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Task Code & Title */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Tugas <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Contoh: TSK-01"
                {...register("task_code")}
                error={Boolean(errors.task_code)}
              />
              {errors.task_code && (
                <p className="text-[11px] text-red-500 mt-1">{errors.task_code.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Tugas <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Contoh: Implementasi kalkulasi rasio progres deliverable"
                {...register("title")}
                error={Boolean(errors.title)}
              />
              {errors.title && (
                <p className="text-[11px] text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Complexity Weight, Man-hours, Deadline */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kompleksitas (Q-01) <span className="text-red-500">*</span>
              </label>
              <Select {...register("complexity_weight")}>
                {COMPLEXITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="size-3 text-blue-600" />
                <span>Man-Hours (Q-02) *</span>
              </label>
              <Input
                type="number"
                step="0.25"
                min="0.25"
                placeholder="8.0"
                {...register("estimated_man_hours")}
                error={Boolean(errors.estimated_man_hours)}
              />
              {errors.estimated_man_hours && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  {errors.estimated_man_hours.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="size-3 text-amber-600" />
                <span>Tenggat H-1 (Q-11) *</span>
              </label>
              <Input
                type="datetime-local"
                {...register("target_deadline")}
                error={Boolean(errors.target_deadline)}
              />
              {errors.target_deadline && (
                <p className="text-[10px] text-red-500 mt-0.5">{errors.target_deadline.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Kebutuhan & Acceptance Criteria
            </label>
            <Textarea
              placeholder="Jelaskan kebutuhan teknis, kriteria keberhasilan pengujian, dan catatan implementasi..."
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-800">
            <AlertCircle className="size-4 shrink-0 text-blue-600" />
            <span>
              Tugas berstatus <b>DRAFT</b> tidak akan tampil di papan Agile Kanban sampai disetujui
              bersama oleh <b>Technical Lead</b> dan <b>Project Manager</b>.
            </span>
          </div>
        </form>
      </Modal>
    );
  },
);

TaskModal.displayName = "TaskModal";
export default TaskModal;
