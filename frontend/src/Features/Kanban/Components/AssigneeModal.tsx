// src/Features/Kanban/Components/AssigneeModal.tsx
import React, { memo, useState } from "react";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Select } from "@/Components/Elements/Select";
import { DEMO_DEVELOPERS } from "../Constants/KanbanConstant";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import type { Task } from "@/Types/task";
import { UserCheck, AlertCircle } from "lucide-react";

export interface AssigneeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assigneeId: string, assigneeName: string) => void;
}

export const AssigneeModal = memo<AssigneeModalProps>(({ task, isOpen, onClose, onConfirm }) => {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string>(user?.id || DEMO_DEVELOPERS[0].id);

  if (!task) return null;

  const handleConfirm = () => {
    const dev = DEMO_DEVELOPERS.find((d) => d.id === selectedId) || {
      id: user?.id || "mock_dev",
      name: user?.name || "Developer",
    };
    onConfirm(dev.id, dev.name);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <UserCheck className="size-5 text-blue-600" />
          <span>Tentukan Pelaksana (Assignee PIC)</span>
        </div>
      }
      description={
        <span>
          Tugas <strong className="font-mono text-slate-800">{task.task_code}</strong> memerlukan
          pelaksana sebelum masuk ke tahap Development (FTR-K04-04).
        </span>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Mulai Pengerjaan
          </Button>
        </>
      }
    >
      <div className="space-y-3.5 text-xs text-slate-700">
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 text-amber-900 text-[11px] leading-relaxed">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <b>Aturan FTR-K04-04:</b> Tentukan pelaksana (assignee) sebelum memulai development.
            Sistem mewajibkan pencatatan PIC untuk akuntabilitas jam kerja.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Pilih Pengembang Pelaksana (PIC) <span className="text-red-500">*</span>
          </label>
          <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {DEMO_DEVELOPERS.map((dev) => (
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
