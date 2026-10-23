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

  // Counts for each tab
  const tabCounts = useMemo(() => {
    let codeReview = 0;
    let testing = 0;
    let signoff = 0;
    let all = 0;

    tasks.forEach((t) => {
      const hasReviewLogs = Boolean(
        (t.reviewLogs && t.reviewLogs.length > 0) ||
        ((t as any).review_logs && (t as any).review_logs.length > 0),
      );
      // Tasks in DoD Sign-Off stage: PM verified, TL signed, or marked DONE
      const isSignOff = Boolean(
        t.status === "DONE" ||
        t.is_pm_verified ||
        t.is_tl_signed,
      );

      // Tasks in Code Review stage
      const isCr = t.status === "CODE_REVIEW";

      // Tasks in QA Testing stage (in testing and not yet sign-off verified, or active rework)
      const isTest =
        !isSignOff &&
        !isCr &&
        (t.status === "TESTING" || Boolean(t.rework) || hasReviewLogs);

      if (isCr) codeReview++;
      if (isTest) testing++;
      if (isSignOff) signoff++;

      if (isCr || isTest || isSignOff || hasReviewLogs) {
        all++;
      }
    });

    return { codeReview, testing, signoff, all };
  }, [tasks]);

  // Filter tasks in review / testing / sign-off stages
  const relevantTasks = useMemo(() => {
    return tasks.filter((t) => {
      const hasReviewLogs = Boolean(
        (t.reviewLogs && t.reviewLogs.length > 0) ||
        ((t as any).review_logs && (t as any).review_logs.length > 0),
      );
      const isSignOff = Boolean(
        t.status === "DONE" ||
        t.is_pm_verified ||
        t.is_tl_signed,
      );
      const isCr = t.status === "CODE_REVIEW";
      const isTest =
        !isSignOff &&
        !isCr &&
        (t.status === "TESTING" || Boolean(t.rework) || hasReviewLogs);

      if (tab === "CODE_REVIEW") return isCr;
      if (tab === "TESTING") return isTest;
      if (tab === "SIGNOFF") return isSignOff;

      // Tab ALL ("Semua Pemeriksaan"): Union of all tasks in the review, testing, rework & sign-off lifecycle
      return isCr || isTest || isSignOff || hasReviewLogs;
    });
  }, [tasks, tab]);

  const getEmptyMessage = () => {
    switch (tab) {
      case "CODE_REVIEW":
        return "Tidak Ada Tugas Dalam Antrean Code Review. Tarik kartu tugas ke kolom Code Review pada Papan Kanban untuk memulai peninjauan kode oleh TL atau PM.";
      case "TESTING":
        return "Tidak Ada Tugas Dalam Antrean QA Testing. Pindahkan tugas ke kolom Testing untuk memulai validasi pengujian dan skenario alur rework.";
      case "SIGNOFF":
        return "Tidak Ada Tugas Dalam Gerbang Sign-Off. Tugas dalam tahap Testing yang siap diverifikasi PM dan disign-off TL akan muncul di sini.";
      default:
        return "Tidak Ada Tugas Dalam Antrean Pemeriksaan. Tarik kartu tugas ke kolom Code Review atau Testing pada Papan Kanban untuk memulai pengujian dan alur rework.";
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-subtle-foreground bg-purple-subtle px-2 py-0.5 rounded border border-purple-subtle-border">
            QUALITY ASSURANCE & SIGN-OFF / FTR-K04-05 & 06
          </span>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight mt-1.5 flex items-center gap-2">
            <span>Pemeriksaan Kode, QA & Otorisasi DoD</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pencatatan manual review kode, otomasi alur rework bug, dan gerbang Definition of Done (PM & TL).
          </p>
        </div>

        <Button variant="outline" onClick={() => refetch()} className="text-muted-foreground text-xs self-start sm:self-auto">
          Segarkan Antrean
        </Button>
      </div>

      {/* Tabs with Item Counts */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setTab("ALL")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            tab === "ALL"
              ? "bg-foreground text-background shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span>Semua Pemeriksaan</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            tab === "ALL" ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
          }`}>
            {tabCounts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("CODE_REVIEW")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            tab === "CODE_REVIEW"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span>Code Review</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            tab === "CODE_REVIEW" ? "bg-purple-700 text-white" : "bg-purple-subtle text-purple-subtle-foreground"
          }`}>
            {tabCounts.codeReview}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("TESTING")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            tab === "TESTING"
              ? "bg-cyan-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span>QA Testing (Alur Rework)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            tab === "TESTING" ? "bg-cyan-700 text-white" : "bg-cyan-subtle text-cyan-subtle-foreground"
          }`}>
            {tabCounts.testing}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("SIGNOFF")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            tab === "SIGNOFF"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span>Gerbang Sign-Off (DoD)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            tab === "SIGNOFF" ? "bg-emerald-700 text-white" : "bg-success-subtle text-success-subtle-foreground"
          }`}>
            {tabCounts.signoff}
          </span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Memuat antrean pemeriksaan kualitas...
          </div>
        ) : relevantTasks.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border bg-card">
            <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground grid place-items-center mx-auto mb-3">
              <FileCheck2 className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Tidak Ada Tugas Dalam Antrean Ini
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
              {getEmptyMessage()}
            </p>
          </Card>
        ) : (
          relevantTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 transition-all hover:shadow-xs border-border bg-card ${
                task.rework
                  ? "border-destructive-subtle-border bg-destructive-subtle/10"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary-subtle-foreground bg-primary-subtle border border-primary-subtle-border px-2 py-0.5 rounded">
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

                  <h3 className="text-sm font-bold text-foreground leading-snug">
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
