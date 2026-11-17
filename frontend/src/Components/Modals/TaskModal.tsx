// src/Components/Modals/TaskModal.tsx
import React, { memo } from "react";
import useCreateTask from "@/Hooks/useCreateTask";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { ChevronDown, Info, Minus, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
  defaultFeatureId?: string;
}

export const TaskModal = memo<TaskModalProps>(
  ({ isOpen, onClose, defaultModuleId, defaultFeatureId }) => {
    const {
      register,
      errors,
      onSubmit,
      isPending,
      modules,
      availableFeatures,
      setValue,
      watch,
    } = useCreateTask({
      defaultModuleId,
      defaultFeatureId,
      onSuccess: onClose,
    });

    const complexity = watch("complexity_weight") || "MEDIUM";
    const manHours = Number(watch("estimated_man_hours")) || 8;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="4xl"
        title="Form Input Tugas Proyek"
        description="Definisikan ruang lingkup teknis, estimasi man-hour, dan target tenggat tugas sesuai SOP-07."
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">
            {Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                <AlertCircle className="size-4 shrink-0" />
                <span>Mohon lengkapi seluruh kolom wajib bertanda bintang (*)</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2.5 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                form="create-task-form"
                disabled={isPending}
                loading={isPending}
                className="px-5 py-2 text-xs font-semibold rounded-xl"
              >
                Simpan Draft Tugas
              </Button>
            </div>
          </div>
        }
      >
        <form id="create-task-form" onSubmit={onSubmit} className="space-y-4">
          {/* Subheader indicator */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase">
              UI-K04-02 · STANDARDIZED TASK TEMPLATE (SOP-07)
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Inisialisasi status: <b>DRAFT</b>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Left Column */}
            <div className="space-y-3.5">
              {/* Row: Modul Induk & Fitur Terkait */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Modul Induk <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register("module_id")}
                      className="w-full appearance-none h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Pilih Modul Induk</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                  </div>
                  {errors.module_id && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">
                      {errors.module_id.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Fitur Terkait (Opsional)
                  </label>
                  <div className="relative">
                    <select
                      {...register("feature_id")}
                      className="w-full appearance-none h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Tanpa Fitur (Tingkat Modul)</option>
                      {availableFeatures.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.code} — {f.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Row: Kode Tugas & Judul Tugas */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Kode Tugas <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="TSK-01"
                    {...register("task_code")}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs font-mono font-bold uppercase text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.task_code && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">
                      {errors.task_code.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Judul Tugas <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Implementasi API validasi nasabah"
                    {...register("title")}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.title && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Deskripsi Teknis */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Deskripsi Teknis (Opsional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan spesifikasi teknis, skema API, dan kriteria penerimaan tugas..."
                  {...register("description")}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.description && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3.5">
              {/* Row: Estimasi Man-Hour & Tenggat Tugas */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Estimasi Man-Hour <span className="text-destructive">*</span>
                  </label>
                  <div className="h-9 px-2 rounded-lg border border-border bg-card flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="iconSm"
                      onClick={() => {
                        const next = Math.max(0.25, Number((manHours - 1).toFixed(2)));
                        setValue("estimated_man_hours", next, { shouldValidate: true });
                      }}
                      className="size-6 text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="text-xs font-bold font-mono text-foreground">
                      {manHours} Jam
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="iconSm"
                      onClick={() => {
                        const next = Number((manHours + 1).toFixed(2));
                        setValue("estimated_man_hours", next, { shouldValidate: true });
                      }}
                      className="size-6 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  {errors.estimated_man_hours && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">
                      {errors.estimated_man_hours.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Tenggat Acuan (H-1) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("target_deadline")}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.target_deadline && (
                    <p className="text-[10px] text-destructive mt-0.5 font-medium">
                      {errors.target_deadline.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Bobot Kompleksitas */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Bobot Kompleksitas <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* LOW */}
                  <div
                    onClick={() => setValue("complexity_weight", "LOW", { shouldValidate: true })}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none",
                      complexity === "LOW"
                        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500"
                        : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      LOW
                    </span>
                    <span className="text-[10px] text-muted-foreground">Bobot 1×</span>
                  </div>

                  {/* MEDIUM */}
                  <div
                    onClick={() => setValue("complexity_weight", "MEDIUM", { shouldValidate: true })}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none",
                      complexity === "MEDIUM"
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <span className="text-xs font-bold text-primary">
                      MEDIUM
                    </span>
                    <span className="text-[10px] text-muted-foreground">Bobot 2×</span>
                  </div>

                  {/* HIGH */}
                  <div
                    onClick={() => setValue("complexity_weight", "HIGH", { shouldValidate: true })}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none",
                      complexity === "HIGH"
                        ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 ring-1 ring-rose-500"
                        : "border-border bg-card hover:bg-muted/40",
                    )}
                  >
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                      HIGH
                    </span>
                    <span className="text-[10px] text-muted-foreground">Bobot 3×</span>
                  </div>
                </div>
                {errors.complexity_weight && (
                  <p className="text-[10px] text-destructive mt-1 font-medium">
                    {errors.complexity_weight.message}
                  </p>
                )}
              </div>

              {/* Bottom Info Banner */}
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
                <Info className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <b>DRAFT LISENSI</b> · Tugas disimpan berstatus <b>DRAFT</b> dan otomatis menginisialisasi catatan <b>Dual-Approval (TL & PM)</b>. Tugas baru muncul di papan eksekusi Kanban setelah disetujui penuh oleh kedua pihak (SOP-07).
                </p>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    );
  },
);

TaskModal.displayName = "TaskModal";
export default TaskModal;
