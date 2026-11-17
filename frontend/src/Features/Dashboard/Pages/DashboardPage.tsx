// src/Features/Dashboard/Pages/DashboardPage.tsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useDashboardOverview from "../Hooks/useDashboardOverview";
import useGetModuleList from "@/Hooks/useGetModuleList";
import { useProject } from "@/Contexts/ProjectContext";
import useExecutionReadiness from "@/Hooks/useExecutionReadiness";
import { useAuth } from "@/Hooks/useAuth";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import ModuleDeliverableCard from "../Components/ModuleDeliverableCard";
import { cn } from "@/Utils/cn";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Activity,
  Calendar,
} from "lucide-react";

function getInitials(name?: string | null): string {
  if (!name || name === "Belum Ditugaskan") return "--";
  const lower = name.toLowerCase();
  if (lower.includes("wildan") || lower.includes("tubagus")) return "TW";
  if (lower.includes("fauzan")) return "FZ";
  if (lower.includes("ariel")) return "AR";
  if (lower.includes("fajri")) return "FJ";
  if (lower.includes("valdric")) return "VD";

  const clean = name.replace(/\([^)]*\)/g, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getAvatarBg(initials: string): string {
  switch (initials) {
    case "TW":
      return "bg-indigo-600 text-white";
    case "FZ":
      return "bg-emerald-600 text-white";
    case "AR":
      return "bg-purple-600 text-white";
    case "FJ":
      return "bg-blue-600 text-white";
    case "VD":
      return "bg-amber-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
}

export const DashboardPage: React.FC = () => {
  useDocumentTitle("Dashboard", "Semua progres, prioritas, dan keputusan tim. Dalam satu workspace.");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeProjectId, activeProject } = useProject();
  const { effectiveMetrics, tasks, goToTasks, goToKanban } = useDashboardOverview();
  const { data: modules = [] } = useGetModuleList();
  const { data: readiness } = useExecutionReadiness(activeProjectId);

  const completedHours = effectiveMetrics.completedManHours || 0;
  const totalHours = effectiveMetrics.totalEstimatedManHours || 0;
  const percent = effectiveMetrics.progressPercentage ? effectiveMetrics.progressPercentage.toFixed(1) : "0.0";
  const completedCount = effectiveMetrics.completedTasks || 0;
  const totalCount = effectiveMetrics.totalTasks || 0;

  // Real Priority Tasks Calculation (Active, Overdue first, Highest Complexity, In-progress status)
  const activeTasks = useMemo(() => tasks.filter((t) => t.status !== "DONE"), [tasks]);
  const activeTasksCount = activeTasks.length;

  const priorityTasks = useMemo(() => {
    const pool = activeTasks.length > 0 ? activeTasks : tasks;
    return [...pool]
      .sort((a, b) => {
        const now = Date.now();
        const aDeadline = a.target_deadline ? new Date(a.target_deadline).getTime() : Infinity;
        const bDeadline = b.target_deadline ? new Date(b.target_deadline).getTime() : Infinity;

        // 1. Overdue tasks first
        const aOverdue = aDeadline < now && a.status !== "DONE";
        const bOverdue = bDeadline < now && b.status !== "DONE";
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        // 2. Complexity weight: HIGH (3) > MEDIUM (2) > LOW (1)
        const weightScore: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const aWeight = weightScore[a.complexity_weight as string] || 1;
        const bWeight = weightScore[b.complexity_weight as string] || 1;
        if (bWeight !== aWeight) return bWeight - aWeight;

        // 3. Status priority: DEVELOPMENT > CODE_REVIEW > TESTING > RELEASED > DRAFT
        const statusScore: Record<string, number> = {
          DEVELOPMENT: 5,
          CODE_REVIEW: 4,
          TESTING: 3,
          RELEASED: 2,
          DRAFT: 1,
          DONE: 0,
        };
        const aStatus = statusScore[a.status] ?? 0;
        const bStatus = statusScore[b.status] ?? 0;
        if (bStatus !== aStatus) return bStatus - aStatus;

        // 4. Earliest deadline
        return aDeadline - bDeadline;
      })
      .slice(0, 3);
  }, [activeTasks, tasks]);

  // Stage counts
  const stageStats = useMemo(() => {
    const counts = {
      DRAFT: 0,
      RELEASED: 0,
      DEVELOPMENT: 0,
      CODE_REVIEW: 0,
      TESTING: 0,
      DONE: 0,
    };
    tasks.forEach((t) => {
      if (counts[t.status as keyof typeof counts] !== undefined) {
        counts[t.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [tasks]);

  // Complexity man-hours breakdown
  const complexityBreakdown = useMemo(() => {
    let low = 0;
    let medium = 0;
    let high = 0;
    tasks.forEach((t) => {
      const h = Number(t.estimated_man_hours) || 0;
      if (t.complexity_weight === "HIGH") high += h;
      else if (t.complexity_weight === "MEDIUM") medium += h;
      else low += h;
    });
    return { low, medium, high };
  }, [tasks]);

  // Upcoming & at-risk tasks
  const atRiskTasks = useMemo(() => {
    const now = Date.now();
    return tasks
      .filter((t) => t.status !== "DONE")
      .map((t) => {
        const deadline = t.target_deadline ? new Date(t.target_deadline).getTime() : Infinity;
        const isOverdue = deadline < now;
        const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return {
          ...t,
          isOverdue,
          daysRemaining,
        };
      })
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.daysRemaining - b.daysRemaining;
      })
      .slice(0, 4);
  }, [tasks]);

  // Team Workload calculation
  const teamWorkload = useMemo(() => {
    const members = [
      { id: "TW", name: "Wildan", role: "PM", color: "bg-indigo-600", activeTasks: 0 },
      { id: "FZ", name: "Fauzan", role: "TL", color: "bg-emerald-600", activeTasks: 0 },
      { id: "AR", name: "Ariel", role: "Dev", color: "bg-purple-600", activeTasks: 0 },
      { id: "FJ", name: "Fajri", role: "Dev", color: "bg-blue-600", activeTasks: 0 },
      { id: "VD", name: "Valdric", role: "QA", color: "bg-amber-600", activeTasks: 0 },
    ];

    tasks.forEach((t) => {
      if (t.status === "DONE") return;
      const pic = (t.assignee_name || "").toLowerCase();
      if (pic.includes("ariel")) members[2].activeTasks++;
      else if (pic.includes("fajri")) members[3].activeTasks++;
      else if (t.status === "TESTING") members[4].activeTasks++;
      else if (t.status === "CODE_REVIEW") members[1].activeTasks++;
      else if (t.status === "DRAFT") members[0].activeTasks++;
    });

    return members;
  }, [tasks]);

  // Dynamic Recent Activities from actual tasks
  const dynamicActivities = useMemo(() => {
    const list: Array<{ id: string; title: string; subtitle: string; tone: "emerald" | "amber" | "blue" | "purple" }> = [];

    const doneTasks = tasks.filter((t) => t.status === "DONE");
    doneTasks.slice(0, 2).forEach((t) => {
      list.push({
        id: `done-${t.id}`,
        title: `${t.title} disahkan`,
        subtitle: `${t.tl_signed_by || "Fauzan (TL)"} · Selesai`,
        tone: "emerald",
      });
    });

    const testingTasks = tasks.filter((t) => t.status === "TESTING");
    testingTasks.slice(0, 2).forEach((t) => {
      list.push({
        id: `test-${t.id}`,
        title: `${t.title} siap diuji QA`,
        subtitle: `${t.assignee_name || "Tim"} · Tahap Testing`,
        tone: "amber",
      });
    });

    const crTasks = tasks.filter((t) => t.status === "CODE_REVIEW");
    crTasks.slice(0, 1).forEach((t) => {
      list.push({
        id: `cr-${t.id}`,
        title: `${t.title} diajukan code review`,
        subtitle: `${t.assignee_name || "Tim"} · Code Review`,
        tone: "purple",
      });
    });

    const devTasks = tasks.filter((t) => t.status === "DEVELOPMENT");
    devTasks.slice(0, 1).forEach((t) => {
      list.push({
        id: `dev-${t.id}`,
        title: `${t.title} sedang dikerjakan`,
        subtitle: `${t.assignee_name || "Developer"} · In Progress`,
        tone: "blue",
      });
    });

    return list.slice(0, 3);
  }, [tasks]);

  // Donut SVG circumference calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (parseFloat(percent) / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left Column (approx 65% width: 8 cols out of 12) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Hero Banner Card */}
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Selamat pagi, {user?.name?.split(" ")[0] || "Pengguna"}.
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Semua progres, prioritas, dan keputusan tim. Dalam satu workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={goToTasks}
            className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Kelola Tasklist</span>
          </button>
        </div>

        {/* Tugas Prioritas Section (Real Data from Backend) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Tugas Prioritas</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-mono">
                {String(activeTasksCount).padStart(2, "0")}
              </span>
            </div>
            <button
              type="button"
              onClick={goToTasks}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat semua tugas ↗
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {priorityTasks.map((t) => {
              const picName =
                typeof t.pic === "string"
                  ? t.pic
                  : t.pic?.name || t.assignee_name || "Belum Ditugaskan";
              const initials = getInitials(picName);
              const isOverdue =
                t.target_deadline &&
                new Date(t.target_deadline).getTime() < Date.now() &&
                t.status !== "DONE";

              let complexityBadge = "bg-slate-50 dark:bg-slate-900 text-slate-700 border-slate-200";
              if (t.complexity_weight === "HIGH") {
                complexityBadge =
                  "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900";
              } else if (t.complexity_weight === "MEDIUM") {
                complexityBadge =
                  "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900";
              } else if (t.complexity_weight === "LOW") {
                complexityBadge =
                  "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900";
              }

              let stageText = "Siap dikerjakan →";
              let stageClass = "text-slate-700 dark:text-slate-300";
              let clickTarget = goToKanban;

              if (t.status === "DRAFT") {
                stageText = "Menunggu approval";
                stageClass = "text-amber-600 dark:text-amber-400";
                clickTarget = goToTasks;
              } else if (t.status === "DEVELOPMENT") {
                stageText = "In progress";
                stageClass = "text-blue-600 dark:text-blue-400";
                clickTarget = goToKanban;
              } else if (t.status === "CODE_REVIEW") {
                stageText = "Code review";
                stageClass = "text-purple-600 dark:text-purple-400";
                clickTarget = () => navigate(ROUTE_PATHS.REVIEWS);
              } else if (t.status === "TESTING") {
                stageText = "QA Testing";
                stageClass = "text-cyan-600 dark:text-cyan-400";
                clickTarget = () => navigate(ROUTE_PATHS.REVIEWS);
              } else if (t.status === "DONE") {
                stageText = "Selesai (Done)";
                stageClass = "text-emerald-600 dark:text-emerald-400";
                clickTarget = goToKanban;
              }

              return (
                <div
                  key={t.id}
                  onClick={clickTarget}
                  className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{t.task_code || "#TSK"}</span>
                      {isOverdue ? (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                          OVERDUE
                        </span>
                      ) : t.target_deadline ? (
                        <span className="text-[11px] text-muted-foreground">
                          {t.target_deadline.split("T")[0]}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1" title={t.title}>
                        {t.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {t.module?.name || t.feature?.name || "Modul Proyek"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", complexityBadge)}>
                        {t.complexity_weight || "MEDIUM"}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {Number(t.estimated_man_hours) || 0} Jam
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <div
                      className={cn(
                        "size-6 rounded-full font-bold text-[10px] grid place-items-center",
                        getAvatarBg(initials),
                      )}
                    >
                      {initials}
                    </div>
                    <span className={cn("text-xs font-medium", stageClass)}>{stageText}</span>
                  </div>
                </div>
              );
            })}

            {priorityTasks.length === 0 && (
              <div className="col-span-3 p-6 rounded-xl border border-dashed border-border bg-card text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">Belum ada tugas aktif</p>
                <p className="text-[11px] text-muted-foreground">
                  Seluruh tugas telah diselesaikan atau belum dibuat.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modul & Deliverable Proyek Section (Formula Q-03 Backend Live Consumption) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Modul & Deliverable Proyek</h3>
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATHS.PROJECTS)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat portfolio proyek ↗
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {modules.map((m) => {
              let featureSummary = "Tugas Mandiri (Tingkat Modul)";
              if (m.features && m.features.length > 0) {
                featureSummary = m.features.map((f) => f.name).join(" · ");
              }

              return (
                <ModuleDeliverableCard
                  key={m.id}
                  moduleId={m.id}
                  moduleCode={m.code}
                  moduleName={m.name}
                  featureSummary={featureSummary}
                  tlName="Fauzan (TL)"
                />
              );
            })}

            {modules.length === 0 && (
              <div className="col-span-2 p-6 rounded-xl border border-dashed border-border bg-card text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">Belum ada modul terdaftar</p>
                <p className="text-[11px] text-muted-foreground">
                  Buat modul baru melalui menu Proyek & Deliverable.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: Distribusi Status & Beban Kompleksitas (Data Rill Backend) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Distribusi Status & Kompleksitas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Rekapitulasi riil status tugas dan alokasi man-hour berdasarkan kompleksitas
              </p>
            </div>
            <button
              type="button"
              onClick={goToKanban}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Board</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          {/* 6 Stage Status Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            <div className="p-2.5 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-slate-900/40 text-center">
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">DRAFT</span>
              <p className="text-lg font-black text-foreground mt-0.5">{stageStats.DRAFT}</p>
              <span className="text-[10px] text-muted-foreground">Dual Approval</span>
            </div>
            <div className="p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">RELEASED</span>
              <p className="text-lg font-black text-foreground mt-0.5">{stageStats.RELEASED}</p>
              <span className="text-[10px] text-muted-foreground">Siap Diambil</span>
            </div>
            <div className="p-2.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 text-center">
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">DEV</span>
              <p className="text-lg font-black text-foreground mt-0.5">{stageStats.DEVELOPMENT}</p>
              <span className="text-[10px] text-muted-foreground">In Progress</span>
            </div>
            <div className="p-2.5 rounded-xl border border-purple-200/80 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 text-center">
              <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">REVIEW</span>
              <p className="text-lg font-black text-foreground mt-0.5">{stageStats.CODE_REVIEW}</p>
              <span className="text-[10px] text-muted-foreground">Review TL/PM</span>
            </div>
            <div className="p-2.5 rounded-xl border border-cyan-200/80 dark:border-cyan-900/50 bg-cyan-50/40 dark:bg-cyan-950/20 text-center">
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400">TESTING</span>
              <p className="text-lg font-black text-foreground mt-0.5">{stageStats.TESTING}</p>
              <span className="text-[10px] text-muted-foreground">Uji QA & DoD</span>
            </div>
            <div className="p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 text-center">
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">DONE</span>
              <p className="text-lg font-black text-foreground mt-0.5">{stageStats.DONE}</p>
              <span className="text-[10px] text-muted-foreground">Disahkan</span>
            </div>
          </div>

          {/* Complexity Allocation Bar */}
          <div className="pt-2 border-t border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                Alokasi Beban Jam Man-Hour (Bobot Kompleksitas)
              </span>
              <span className="font-mono text-muted-foreground">
                Total: {totalHours} Jam
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-700 dark:text-rose-300 text-[11px]">HIGH (Bobot 3×)</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Kompleksitas Tinggi</p>
                </div>
                <span className="font-mono font-black text-rose-700 dark:text-rose-300 text-sm">
                  {complexityBreakdown.high} Jam
                </span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-300 text-[11px]">MEDIUM (Bobot 2×)</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Kompleksitas Menengah</p>
                </div>
                <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-sm">
                  {complexityBreakdown.medium} Jam
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">LOW (Bobot 1×)</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Kompleksitas Standar</p>
                </div>
                <span className="font-mono font-black text-slate-700 dark:text-slate-300 text-sm">
                  {complexityBreakdown.low} Jam
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Tugas Berisiko & Menjelang Tenggat (Data Rill Backend) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Tugas Berisiko & Tenggat Kritis</h3>
              {effectiveMetrics.tasksAtRiskOrOverdue > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                  <AlertTriangle className="size-2.5" />
                  {effectiveMetrics.tasksAtRiskOrOverdue} Perlu Perhatian
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  Semua Sesuai Jadwal
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={goToTasks}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Tasklist</span>
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border/60">
            {atRiskTasks.map((t) => {
              const pic = t.assignee_name || "Belum Ditugaskan";
              const initials = getInitials(pic);
              const avatarBg = getAvatarBg(initials);
              const deadlineDate = t.target_deadline ? t.target_deadline.split("T")[0] : "-";

              return (
                <div
                  key={t.id}
                  onClick={goToTasks}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 rounded-lg px-2 -mx-2 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("size-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs", avatarBg)}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {t.task_code} · {t.module?.name || "Modul Utama"} · {Number(t.estimated_man_hours) || 8} Jam
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {t.isOverdue ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                        <AlertTriangle className="size-3 text-rose-600" />
                        Terlambat ({Math.abs(t.daysRemaining)} hari)
                      </span>
                    ) : t.daysRemaining <= 2 ? (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                        <Clock className="size-3 text-amber-600" />
                        {t.daysRemaining} hari tersisa
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        {deadlineDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {atRiskTasks.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Tidak ada tugas aktif atau tertunda saat ini.
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Tata Kelola & Kesiapan Eksekusi Sprint (Modul E-3 Prioritas P6 & D-1) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Tata Kelola & Kesiapan Eksekusi (Modul E-3)</h3>
            </div>
            {readiness?.readyForExecution ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-600" />
                Siap Eksekusi Agile (P6 Passed)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                <Clock className="size-3 text-amber-600" />
                Pending Kickoff MoM
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">KODE PROYEK D-1</p>
              <p className="text-xs font-bold text-foreground truncate">
                {activeProject?.canonicalCode || activeProjectId}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {activeProject?.clientName || "PT. Anaheim Nimbus Universal"}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">KICKOFF MEETING & MOM</p>
              <p className="text-xs font-bold text-foreground truncate">
                {readiness?.momId ? "Dokumen MoM Disahkan" : "MoM Terverifikasi"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                ID: {readiness?.kickoffId ? readiness.kickoffId.slice(0, 18) + "..." : "Terjadwal"}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">STATUS INTAKE D-1</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {activeProject?.status || "REGISTERED"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                PO Diterima · Dokumen Lengkap
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (approx 35% width: 4 cols out of 12) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Ringkasan Sprint Card with Donut Chart */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Ringkasan Sprint</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-[10px] font-bold">
              LIVE
            </span>
          </div>

          {/* Donut and Man-hour Summary */}
          <div className="flex items-center gap-4 py-1">
            {/* SVG Circular Donut */}
            <div className="relative size-24 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r={radius} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-primary transition-all duration-500 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-foreground leading-tight">{percent}%</span>
                <span className="text-[8px] uppercase font-bold tracking-wider text-muted-foreground leading-tight">DELIVERABLE</span>
              </div>
            </div>

            {/* Man-hour Ratio Info */}
            <div className="min-w-0">
              <div className="text-2xl font-black text-foreground tracking-tight">
                {completedHours} / {totalHours}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Jam man-hour selesai</p>
              <p className="text-xs font-semibold text-foreground mt-1">
                {completedCount} dari {totalCount} tugas telah disahkan
              </p>
            </div>
          </div>

          <div className="h-px bg-border/80" />

          {/* Bottom Stage Counts (Dynamic Data) */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono mr-1.5">
                {String(stageStats.DEVELOPMENT).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground font-medium">In progress</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono mr-1.5">
                {String(stageStats.CODE_REVIEW + stageStats.TESTING + stageStats.DRAFT).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground font-medium">Review & Gate</span>
            </div>
          </div>
        </div>

        {/* Anggota Tim & PIC Card (Dynamic Tasks Workload) */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Anggota Tim & PIC</h3>
            <span className="text-[11px] text-muted-foreground font-mono">Beban Kerja Aktif</span>
          </div>

          <div className="flex items-center justify-between gap-1">
            {teamWorkload.map((m) => (
              <div key={m.id} className="flex flex-col items-center gap-1.5">
                <div className={cn("size-9 rounded-full text-white font-bold text-xs grid place-items-center shadow-2xs relative", m.color)}>
                  {m.id}
                  {m.activeTasks > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-white font-mono text-[9px] font-bold grid place-items-center ring-2 ring-card">
                      {m.activeTasks}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{m.name}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">5 anggota tim inti</span>
            <button
              type="button"
              onClick={goToKanban}
              className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Alokasi Kanban</span>
              <ArrowUpRight className="size-3" />
            </button>
          </div>
        </div>

        {/* Aktivitas Tim Card (Dynamic Events from Actual Tasks) */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Aktivitas Tim</h3>
            <Activity className="size-3.5 text-primary" />
          </div>

          <div className="space-y-3 text-xs">
            {dynamicActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0 mt-1",
                    act.tone === "emerald" && "bg-emerald-500",
                    act.tone === "amber" && "bg-amber-500",
                    act.tone === "purple" && "bg-purple-500",
                    act.tone === "blue" && "bg-blue-500",
                  )}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{act.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{act.subtitle}</p>
                </div>
              </div>
            ))}

            {dynamicActivities.length === 0 && (
              <p className="text-xs text-muted-foreground py-2 text-center">Belum ada aktivitas tercatat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
