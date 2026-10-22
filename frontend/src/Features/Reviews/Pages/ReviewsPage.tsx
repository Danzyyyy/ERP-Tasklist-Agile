// src/Features/Reviews/Pages/ReviewsPage.tsx
import React, { useState, useMemo } from "react";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import ReviewModal from "../Components/ReviewModal";
import SignOffModal from "../Components/SignOffModal";
import TaskDetailModal from "@/Features/Tasks/Components/TaskDetailModal";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { formatDate, formatManHours } from "@/Utils/formatters";
import type { Task } from "@/Types/task";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import {
  FileCode2,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  FileCheck2,
  Clock,
  User,
  AlertCircle,
  Eye,
} from "lucide-react";

export const ReviewsPage: React.FC = () => {
  useDocumentTitle(
    "Review & Testing DoD",
    "Pencatatan manual review kualitas kode, pengujian QA, alur rework bug, dan otorisasi Two-Gate Definition of Done.",
  );
  const { data: tasks = [], isLoading, refetch } = useTasks();
  const [tab, setTab] = useState<"ALL" | "CODE_REVIEW" | "TESTING" | "SIGNOFF">("ALL");

  const [activeReviewTask, setActiveReviewTask] = useState<Task | null>(null);
  const [activeSignOffTask, setActiveSignOffTask] = useState<Task | null>(null);
  const [activeDetailTask, setActiveDetailTask] = useState<Task | null>(null);

  // Filter tasks in review / testing / sign-off stages
  const relevantTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (tab === "CODE_REVIEW") return t.status === "CODE_REVIEW";
      if (tab === "TESTING") return t.status === "TESTING";
      if (tab === "SIGNOFF") return t.status === "TESTING" || t.status === "DONE";
      return (
        t.status === "CODE_REVIEW" ||
        t.status === "TESTING" ||
        t.rework ||
        Boolean(t.reviewLogs && t.reviewLogs.length > 0)
      );
    });
  }, [tasks, tab]);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            QUALITY ASSURANCE & SIGN-OFF / FTR-K04-05 & 06
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>Pemeriksaan Kode, QA & Otorisasi DoD</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan manual review kode, otomasi alur rework bug, dan gerbang Definition of Done (PM & TL).
          </p>
        </div>

        <Button variant="outline" onClick={() => refetch()} className="text-slate-600">
          Segarkan Antrean
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setTab("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            tab === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Semua Pemeriksaan
        </button>
        <button
          type="button"
          onClick={() => setTab("CODE_REVIEW")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            tab === "CODE_REVIEW"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Code Review
        </button>
        <button
          type="button"
          onClick={() => setTab("TESTING")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            tab === "TESTING"
              ? "bg-cyan-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          QA Testing (Alur Rework)
        </button>
        <button
          type="button"
          onClick={() => setTab("SIGNOFF")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            tab === "SIGNOFF"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Gerbang Sign-Off (DoD)
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Memuat antrean pemeriksaan kualitas...
          </div>
        ) : relevantTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 grid place-items-center mx-auto mb-3">
              <FileCheck2 className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Tidak Ada Tugas Dalam Antrean Pemeriksaan
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Tarik kartu tugas ke kolom Code Review atau Testing pada Papan Kanban untuk memulai
              pengujian dan alur rework.
            </p>
          </Card>
        ) : (
          relevantTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 transition-all hover:shadow-xs ${
                task.rework
                  ? "border-rose-300 bg-rose-50/15"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {task.task_code}
                    </span>
                    <Badge variant={task.status as any} dot>
                      {task.status}
                    </Badge>
                    <Badge variant={task.complexity_weight as any} size="sm">
                      {task.complexity_weight}
                    </Badge>
                    {task.rework && <Badge variant="REWORK">REWORK / BUG</Badge>}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-slate-400" />
                      Estimasi: {formatManHours(task.estimated_man_hours)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="size-3 text-slate-400" />
                      PIC: {task.assignee_name || "Belum ada"}
                    </span>
                    <span>Tenggat: {formatDate(task.target_deadline)}</span>
                  </div>

                  {/* DoD indicators */}
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                        task.is_pm_verified
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <CheckCircle2 className="size-3" />
                      PM Verify: {task.is_pm_verified ? "Lolos" : "Belum"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                        task.is_tl_signed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ShieldCheck className="size-3" />
                      TL Sign-off: {task.is_tl_signed ? "Lolos (DONE)" : "Belum"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setActiveReviewTask(task)}
                  >
                    <FileCode2 className="size-3.5 mr-1" />
                    Review / Testing
                  </Button>

                  {task.status === "TESTING" && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => setActiveSignOffTask(task)}
                    >
                      <FileCheck2 className="size-3.5 mr-1" />
                      Sign-Off (DoD)
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveDetailTask(task)}
                    className="text-slate-500"
                  >
                    <Eye className="size-3.5 mr-1" />
                    Detail & Riwayat
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modals */}
      <ReviewModal
        task={activeReviewTask}
        isOpen={Boolean(activeReviewTask)}
        onClose={() => setActiveReviewTask(null)}
      />

      <SignOffModal
        task={activeSignOffTask}
        isOpen={Boolean(activeSignOffTask)}
        onClose={() => setActiveSignOffTask(null)}
      />

      <TaskDetailModal
        task={activeDetailTask}
        isOpen={Boolean(activeDetailTask)}
        onClose={() => setActiveDetailTask(null)}
      />
    </div>
  );
};

export default ReviewsPage;
