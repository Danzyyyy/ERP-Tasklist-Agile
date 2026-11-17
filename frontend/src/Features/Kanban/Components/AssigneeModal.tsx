// src/Features/Kanban/Components/AssigneeModal.tsx
import React, { memo } from "react";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Select } from "@/Components/Elements/Select";
import { useAssigneeSelection } from "../Hooks/useAssigneeSelection";
import type { Task } from "@/Types/task";
import { UserCheck, AlertCircle } from "lucide-react";

export interface AssigneeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assigneeId: string, assigneeName: string) => void;
  mode?: "TRANSITION" | "ASSIGN_ONLY";
}

export const AssigneeModal = memo<AssigneeModalProps>(
  ({ task, isOpen, onClose, onConfirm, mode = "TRANSITION" }) => {
    const { selectedId, setSelectedId, developers, isDeveloperSelfAssign, handleConfirm } =
      useAssigneeSelection(onConfirm, onClose, task, isOpen);

    if (!task) return null;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="lg"
        title={
          <div className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            <span>Tentukan Pelaksana (Assignee PIC)</span>
          </div>
        }
        description={
          <span>
            {mode === "ASSIGN_ONLY" ? (
              <>
                Pilih atau ubah pelaksana untuk tugas{" "}
                <strong className="font-mono text-foreground">{task.task_code}</strong>.
              </>
            ) : (
              <>
                Tugas <strong className="font-mono text-foreground">{task.task_code}</strong>{" "}
                memerlukan pelaksana sebelum masuk ke tahap Development (FTR-K04-04).
              </>
            )}
          </span>
        }
        footer={
          <>
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              {mode === "ASSIGN_ONLY" ? "Simpan Pelaksana PIC" : "Mulai Pengerjaan"}
            </Button>
          </>
        }
      >
      <div className="space-y-3.5 text-xs text-muted-foreground">
        {isDeveloperSelfAssign ? (
          <div className="p-3 rounded-lg bg-info-subtle border border-info-subtle-border flex items-start gap-2 text-info-subtle-foreground text-[11px] leading-relaxed">
            <UserCheck className="size-4 text-info shrink-0 mt-0.5" />
            <span>
              <b>Role Guard Pengembang:</b> Sebagai peran Developer, Anda hanya berwenang menugaskan
              diri sendiri ke tugas pengerjaan ini.
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-warning-subtle border border-warning-subtle-border flex items-start gap-2 text-warning-subtle-foreground text-[11px] leading-relaxed">
            <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
            <span>
              <b>Aturan FTR-K04-04:</b> Tentukan pelaksana (assignee) sebelum memulai development.
              Sistem mewajibkan pencatatan PIC untuk akuntabilitas jam kerja.
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Pilih Pengembang Pelaksana (PIC) <span className="text-destructive">*</span>
          </label>
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={isDeveloperSelfAssign}
          >
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>
                {dev.name} ({dev.role})
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
});

AssigneeModal.displayName = "AssigneeModal";
export default AssigneeModal;
