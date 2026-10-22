// src/Features/Reviews/Components/SignOffModal.tsx
import React, { memo, useState } from "react";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import usePmVerify from "../Hooks/usePmVerify";
import useTlSignoff from "../Hooks/useTlSignoff";
import { Modal } from "@/Components/Elements/Modal";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { PM_VERIFICATION_CHECKLIST } from "../Constants/ReviewConstant";
import type { Task } from "@/Types/task";
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CheckSquare2,
  Square,
  Lock,
} from "lucide-react";

export interface SignOffModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SignOffModal = memo<SignOffModalProps>(({ task, isOpen, onClose }) => {
  const { role, user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    spec: true,
    testing: true,
    acceptance: true,
  });

  const { mutate: pmVerify, isPending: isPmPending } = usePmVerify(task?.id, () => {
    // Keep modal open so TL can immediately see Gate 1 pass and sign off if in demo
  });

  const { mutate: tlSignoff, isPending: isTlPending } = useTlSignoff(task?.id, () => {
    onClose();
  });

  if (!task) return null;

  const isPm = role === "PROJECT_MANAGER";
  const isTl = role === "TECHNICAL_LEAD";

  const allChecklistCompleted = PM_VERIFICATION_CHECKLIST.every((item) => checkedItems[item.id]);
  const isPmVerified = Boolean(task.is_pm_verified);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <FileCheck2 className="size-5 text-emerald-600" />
          <span>Two-Gate Definition of Done (DoD) Sign-Off</span>
          <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
            FTR-K04-06
          </span>
        </div>
      }
      description={
        <div className="break-words leading-relaxed">
          Otorisasi penyelesaian tugas{" "}
          <strong className="font-mono text-slate-800">{task.task_code}</strong>: "{task.title}".
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] text-slate-400 font-mono">
            Status: <b className="text-slate-800">{task.status}</b>
          </span>
          <Button variant="outline" onClick={onClose} disabled={isPmPending || isTlPending}>
            Tutup
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Gate 1: PM Verification */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isPmVerified
              ? "border-emerald-300 bg-emerald-50/40"
              : "border-slate-200 bg-white shadow-2xs"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] grid place-items-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-xs">
                Gerbang 1: Ceklis Verifikasi Kelayakan (Project Manager)
              </h4>
            </div>
            <Badge variant={isPmVerified ? "APPROVED" : "PENDING"} dot>
              {isPmVerified ? "TERVERIFIKASI" : "BELUM"}
            </Badge>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            PM wajib memvalidasi bukti penyelesaian fungsional dan kelengkapan dokumen sesuai Q-06.
          </p>

          <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200/80 mb-3">
            {PM_VERIFICATION_CHECKLIST.map((item) => {
              const checked = checkedItems[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => isPm && !isPmVerified && toggleCheck(item.id)}
                  className={`flex items-start gap-2.5 p-1.5 rounded transition-colors ${
                    isPm && !isPmVerified ? "cursor-pointer hover:bg-slate-200/50" : ""
                  }`}
                >
                  <span className="text-blue-600 mt-0.5">
                    {checked || isPmVerified ? (
                      <CheckSquare2 className="size-4 text-blue-600" />
                    ) : (
                      <Square className="size-4 text-slate-400" />
                    )}
                  </span>
                  <span
                    className={`text-xs ${
                      checked || isPmVerified ? "text-slate-900 font-medium" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {!isPmVerified ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                {isPm
                  ? "Tandai seluruh ceklis di atas untuk memvalidasi kelayakan."
                  : "Hanya peran Project Manager yang berwenang memvalidasi ceklis ini."}
              </span>
              {isPm ? (
                <Button
                  variant="primary"
                  size="sm"
                  loading={isPmPending}
                  disabled={!allChecklistCompleted}
                  onClick={() => pmVerify()}
                >
                  <CheckCircle2 className="size-3.5 mr-1" />
                  Validasi Ceklis PM
                </Button>
              ) : (
                <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                  <Lock className="size-3" />
                  Menunggu Aksi PM
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>
                Ceklis verifikasi berhasil divalidasi oleh {task.pm_verified_by || "Project Manager"}.
                Gerbang 2 kini aktif!
              </span>
            </div>
          )}
        </div>

        {/* Gate 2: TL Final Sign-off */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            task.is_tl_signed
              ? "border-emerald-300 bg-emerald-50/40"
              : isPmVerified
              ? "border-blue-200 bg-blue-50/20 shadow-2xs"
              : "border-slate-200 bg-slate-50/60 opacity-80"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] grid place-items-center">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-xs">
                Gerbang 2: Otorisasi Pengesahan Akhir DONE (Technical Lead)
              </h4>
            </div>
            <Badge variant={task.is_tl_signed ? "APPROVED" : "PENDING"} dot>
              {task.is_tl_signed ? "DISAHKAN" : "BELUM"}
            </Badge>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            Otoritas tunggal penutupan tugas resmi berada di tangan Technical Lead (Q-07).
          </p>

          {!isPmVerified ? (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600 shrink-0" />
              <span>
                <b>Tombol Terkunci:</b> Verifikasi ceklis PM (Gerbang 1) wajib dipenuhi sebelum TL
                dapat mengesahkan tugas menjadi Done (aturan 422 backend).
              </span>
            </div>
          ) : !task.is_tl_signed ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                {isTl
                  ? "Gerbang 1 telah lolos. Klik tombol untuk mengesahkan tugas menjadi DONE."
                  : "Hanya peran Technical Lead yang berwenang melakukan final sign-off penutupan tugas."}
              </span>
              {isTl ? (
                <Button
                  variant="success"
                  loading={isTlPending}
                  onClick={() => tlSignoff()}
                >
                  <ShieldCheck className="size-4 mr-1.5" />
                  Otorisasi Selesai / Sign-off DONE
                </Button>
              ) : (
                <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                  <Lock className="size-3" />
                  Menunggu Otorisasi TL
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>
                Tugas resmi disahkan berstatus DONE oleh {task.tl_signed_by || "Technical Lead"}!
                Progres deliverable telah diperbarui otomatis.
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
});

SignOffModal.displayName = "SignOffModal";
export default SignOffModal;
