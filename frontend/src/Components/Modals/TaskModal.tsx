// src/Components/Modals/TaskModal.tsx
import React, { memo } from "react";
import useCreateTask from "@/Hooks/useCreateTask";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Textarea } from "@/Components/Elements/Textarea";
import { Select } from "@/Components/Elements/Select";
import { Label } from "@/Components/Elements/Label";
import { Info, Minus, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModuleId?: string;
  defaultFeatureId?: string;
}

export const TaskModal = memo<TaskModalProps>(({ isOpen, onClose, defaultModuleId, defaultFeatureId }) => {
  const { register, errors, onSubmit, isPending, modules, availableFeatures, setValue, watch, incrementManHours, decrementManHours } = useCreateTask({
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
      description="Lengkapi rincian tugas, estimasi jam kerja, dan target tenggat. Tugas baru disimpan sebagai Draft."
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-2">
          {Object.keys(errors).length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertCircle className="size-4 shrink-0" />
              <span>Mohon lengkapi seluruh kolom wajib bertanda bintang (*)</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-2.5 ml-auto">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" form="create-task-form" disabled={isPending} loading={isPending}>
              Simpan Draft Tugas
            </Button>
          </div>
        </div>
      }
    >
      <form id="create-task-form" onSubmit={onSubmit} className="space-y-4">
        {/* Subheader indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-primary">Rincian Tugas Baru</span>
          <span className="text-[11px] text-muted-foreground font-mono">
            Status awal: <b>DRAFT</b>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left Column */}
          <div className="space-y-3.5">
            {/* Row: Modul Induk & Fitur Terkait */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label required>Modul Induk</Label>
                <Select {...register("module_id")} error={Boolean(errors.module_id)}>
                  <option value="">Pilih Modul Induk</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} — {m.name}
                    </option>
                  ))}
                </Select>
                {errors.module_id && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.module_id.message}</p>}
              </div>

              <div>
                <Label>Fitur Terkait (Opsional)</Label>
                <Select {...register("feature_id")}>
                  <option value="">Tanpa Fitur (Tingkat Modul)</option>
                  {availableFeatures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.code} — {f.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Row: Kode Tugas & Judul Tugas */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <Label required>Kode Tugas</Label>
                <Input type="text" placeholder="TSK-01" mono uppercase {...register("task_code")} error={Boolean(errors.task_code)} />
                {errors.task_code && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.task_code.message}</p>}
              </div>

              <div className="col-span-2">
                <Label required>Judul Tugas</Label>
                <Input type="text" placeholder="Contoh: Implementasi API validasi nasabah" {...register("title")} error={Boolean(errors.title)} />
                {errors.title && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.title.message}</p>}
              </div>
            </div>

            {/* Deskripsi Teknis */}
            <div>
              <Label>Deskripsi Teknis (Opsional)</Label>
              <Textarea
                rows={4}
                placeholder="Jelaskan spesifikasi teknis, skema API, dan kriteria penerimaan tugas..."
                {...register("description")}
                error={Boolean(errors.description)}
              />
              {errors.description && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.description.message}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3.5">
            {/* Row: Estimasi Man-Hour & Tenggat Tugas */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <Label required>Estimasi Man-Hour</Label>
                <div className="h-9 px-2 rounded-lg border border-border bg-card flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghostMuted"
                    size="iconXs"
                    onClick={decrementManHours}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="text-xs font-bold font-mono text-foreground">{manHours} Jam</span>
                  <Button
                    type="button"
                    variant="ghostMuted"
                    size="iconXs"
                    onClick={incrementManHours}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
                {errors.estimated_man_hours && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.estimated_man_hours.message}</p>}
              </div>

              <div>
                <Label required>Tenggat Acuan (H-1)</Label>
                <Input type="date" {...register("target_deadline")} error={Boolean(errors.target_deadline)} />
                {errors.target_deadline && <p className="text-[10px] text-destructive mt-0.5 font-medium">{errors.target_deadline.message}</p>}
              </div>
            </div>

            {/* Bobot Kompleksitas */}
            <div>
              <Label required>Bobot Kompleksitas</Label>
              <div className="grid grid-cols-3 gap-2">
                {/* LOW */}
                <div
                  onClick={() => setValue("complexity_weight", "LOW", { shouldValidate: true })}
                  className={cn(
                    "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none",
                    complexity === "LOW" ? "border-success bg-success-subtle ring-1 ring-success" : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <span className="text-xs font-bold text-success">LOW</span>
                  <span className="text-[10px] text-muted-foreground">Bobot 1×</span>
                </div>

                {/* MEDIUM */}
                <div
                  onClick={() => setValue("complexity_weight", "MEDIUM", { shouldValidate: true })}
                  className={cn(
                    "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none",
                    complexity === "MEDIUM" ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <span className="text-xs font-bold text-primary">MEDIUM</span>
                  <span className="text-[10px] text-muted-foreground">Bobot 2×</span>
                </div>

                {/* HIGH */}
                <div
                  onClick={() => setValue("complexity_weight", "HIGH", { shouldValidate: true })}
                  className={cn(
                    "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none",
                    complexity === "HIGH" ? "border-destructive bg-destructive-subtle ring-1 ring-destructive" : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <span className="text-xs font-bold text-destructive">HIGH</span>
                  <span className="text-[10px] text-muted-foreground">Bobot 3×</span>
                </div>
              </div>
              {errors.complexity_weight && <p className="text-[10px] text-destructive mt-1 font-medium">{errors.complexity_weight.message}</p>}
            </div>

            {/* Bottom Info Banner */}
            <div className="p-3 rounded-lg bg-primary-subtle text-primary-subtle-foreground border border-primary-subtle-border flex items-start gap-2.5 text-xs">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <b>DRAFT &amp; PERSETUJUAN</b> · Tugas disimpan sebagai <b>DRAFT</b> dan menunggu persetujuan <b>Technical Lead &amp; Project Manager</b> sebelum dirilis ke Agile Board.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
});

TaskModal.displayName = "TaskModal";
export default TaskModal;
