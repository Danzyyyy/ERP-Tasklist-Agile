import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useDeliverableProgress from "../Hooks/useDeliverableProgress";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import useSeedDemoData from "@/Features/Tasks/Hooks/useSeedDemoData";
import DeliverableProgressCard from "../Components/DeliverableProgressCard";
import KPICards from "../Components/KPICards";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { formatDate, formatManHours } from "@/Utils/formatters";
import type { DeliverableProgress } from "@/Types/task";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import {
  Sparkles,
  Database,
  ArrowRight,
  ShieldCheck,
  Kanban,
  CheckCircle2,
  Clock,
  Layers,
  History,
  AlertTriangle,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  useDocumentTitle(
    "Executive Overview",
    "Ringkasan eksekutif progres deliverable sprint, status eksekusi agile, dan rasio man-hour Formula Q-03.",
  );
  const navigate = useNavigate();
  const { data: metrics, isLoading: isProgressLoading } = useDeliverableProgress();
  const { data: tasks = [], isLoading: isTasksLoading } = useTasks();
  const { seed, seeding } = useSeedDemoData();

  // Formula Q-03 Deliverable Calculation
  const effectiveMetrics: DeliverableProgress = useMemo(() => {
    if (metrics && metrics.totalTasks > 0) return metrics;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const totalEstimatedManHours = tasks.reduce(
      (acc, t) => acc + (Number(t.estimated_man_hours) || 0),
      0,
    );
    const completedManHours = tasks
      .filter((t) => t.status === "DONE")
      .reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);
    const actualManHoursSpent = tasks.reduce(
      (acc, t) => acc + (Number(t.actual_man_hours_spent) || 0),
      0,
    );
    const progressPercentage =
      totalEstimatedManHours > 0
        ? (completedManHours / totalEstimatedManHours) * 100
        : 0.0;
    const tasksAtRiskOrOverdue = tasks.filter((t) => {
      if (t.status === "DONE") return false;
      if (!t.target_deadline) return false;
      return new Date(t.target_deadline) < new Date();
    }).length;

    return {
      totalTasks,
      completedTasks,
      totalEstimatedManHours,
      completedManHours,
      actualManHoursSpent,
      progressPercentage,
      tasksAtRiskOrOverdue,
      calculatedAt: new Date().toISOString(),
    };
  }, [metrics, tasks]);

  const stageCounts = {
    DRAFT: tasks.filter((t) => t.status === "DRAFT").length,
    RELEASED: tasks.filter((t) => t.status === "RELEASED").length,
    DEVELOPMENT: tasks.filter((t) => t.status === "DEVELOPMENT").length,
    CODE_REVIEW: tasks.filter((t) => t.status === "CODE_REVIEW").length,
    TESTING: tasks.filter((t) => t.status === "TESTING").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="space-y-4">
      {/* Page Heading */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            EXECUTIVE OVERVIEW / MODUL E-4
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Dashboard Eksekusi Agile & Deliverable
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ERP Software PT. Anaheim Nimbus Universal — Sprint 1 (14–25 Oktober 2026).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length === 0 && (
            <Button
              variant="outline"
              loading={seeding}
              onClick={seed}
              className="text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50"
            >
              <Database className="size-3.5 mr-1" />
              Muat Data Demonstrasi
            </Button>
          )}

          <Button variant="primary" onClick={() => navigate(ROUTE_PATHS.TASKS)}>
            <span>Buka Tasklist</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Deliverable Progress Ratio Card */}
      <DeliverableProgressCard metrics={effectiveMetrics} />

      {/* KPI Cards */}
      <KPICards metrics={effectiveMetrics} tasks={tasks} />

      {/* Sprint Stage Distribution & Recent Tasks */}
      <div className="grid grid-cols-3 gap-4">
        {/* Stage Distribution Box */}
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Kanban className="size-4 text-blue-600" />
              <span>Distribusi Tahapan Sprint (SOP-08)</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.KANBAN)}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Lihat Papan &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {[
              { status: "DRAFT", label: "Draft (Menunggu Approval)", count: stageCounts.DRAFT, color: "bg-slate-400" },
              { status: "RELEASED", label: "Released (Siap Kerja)", count: stageCounts.RELEASED, color: "bg-indigo-500" },
              { status: "DEVELOPMENT", label: "In Development", count: stageCounts.DEVELOPMENT, color: "bg-blue-500" },
              { status: "CODE_REVIEW", label: "Code Review", count: stageCounts.CODE_REVIEW, color: "bg-purple-500" },
              { status: "TESTING", label: "QA Testing", count: stageCounts.TESTING, color: "bg-cyan-500" },
              { status: "DONE", label: "Definition of Done", count: stageCounts.DONE, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${item.color}`} />
                  <span className="text-slate-700 font-medium">{item.label}</span>
                </div>
                <strong className="font-mono text-xs font-bold text-slate-800">
                  {item.count}
                </strong>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Tasks List */}
        <Card className="col-span-2 p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <History className="size-4 text-slate-600" />
              <span>Tugas Terbaru Dalam Siklus Eksekusi</span>
            </h3>
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.TASKS)}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Kelola Semua &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                onClick={() => navigate(ROUTE_PATHS.TASKS)}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-center justify-between gap-3 text-xs cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded shrink-0">
                    {task.task_code}
                  </span>
                  <span className="font-medium text-slate-800 truncate">{task.title}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={task.status as any} size="sm">
                    {task.status}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatManHours(task.estimated_man_hours)}
                  </span>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                Belum ada data tugas. Klik "Muat Data Demonstrasi" untuk melihat simulasi lengkap.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
