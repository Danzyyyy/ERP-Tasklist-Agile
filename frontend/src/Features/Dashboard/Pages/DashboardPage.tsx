// src/Features/Dashboard/Pages/DashboardPage.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useDashboardOverview from "../Hooks/useDashboardOverview";
import useGetModuleList from "@/Hooks/useGetModuleList";
import { useAuth } from "@/Hooks/useAuth";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { cn } from "@/Utils/cn";

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
  const { effectiveMetrics, tasks, goToTasks, goToKanban } = useDashboardOverview();
  const { data: modules = [] } = useGetModuleList();

  const [moduleFilter, setModuleFilter] = useState<"ONGOING" | "PENDING">("ONGOING");

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

  // Real Module Deliverables Progress Calculation
  const moduleDeliverables = useMemo(() => {
    return modules.map((m) => {
      const mTasks = tasks.filter((t) => t.module_id === m.id);
      const mTotalTasks = mTasks.length;
      const mDoneTasks = mTasks.filter((t) => t.status === "DONE").length;
      const mTotalHours = mTasks.reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);
      const mDoneHours = mTasks
        .filter((t) => t.status === "DONE")
        .reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);
      const mPercent = mTotalHours > 0 ? (mDoneHours / mTotalHours) * 100 : 0;
      const mActiveTasksCount = mTotalTasks - mDoneTasks;

      let featureSummary = "Tugas Mandiri (Tingkat Modul)";
      if (m.features && m.features.length > 0) {
        featureSummary = m.features.map((f) => f.name).join(" · ");
      }

      return {
        id: m.id,
        code: m.code,
        name: m.name,
        featureSummary,
        totalTasks: mTotalTasks,
        doneTasks: mDoneTasks,
        activeTasks: mActiveTasksCount,
        totalHours: mTotalHours,
        doneHours: mDoneHours,
        percentage: mPercent,
        isOngoing: mPercent < 100 && mTotalTasks > 0,
        hasDraft: mTasks.some((t) => t.status === "DRAFT"),
      };
    });
  }, [modules, tasks]);

  const filteredModules = useMemo(() => {
    if (moduleFilter === "ONGOING") {
      const ongoing = moduleDeliverables.filter((m) => m.isOngoing);
      return ongoing.length > 0 ? ongoing : moduleDeliverables;
    }
    const pending = moduleDeliverables.filter(
      (m) => !m.isOngoing || m.hasDraft || m.totalTasks === 0,
    );
    return pending.length > 0 ? pending : moduleDeliverables;
  }, [moduleDeliverables, moduleFilter]);

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
              Selamat pagi, {user?.name?.split(" ")[0] || "Wildan"}.
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

        {/* Modul & Deliverable Proyek Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Modul & Deliverable Proyek</h3>
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setModuleFilter("ONGOING")}
                className={cn(
                  "px-3 py-1 rounded-md font-medium transition-all cursor-pointer",
                  moduleFilter === "ONGOING" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Ongoing
              </button>
              <button
                type="button"
                onClick={() => setModuleFilter("PENDING")}
                className={cn(
                  "px-3 py-1 rounded-md font-medium transition-all cursor-pointer",
                  moduleFilter === "PENDING" ? "bg-card text-foreground font-semibold shadow-2xs" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pending / Draft
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredModules.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(ROUTE_PATHS.MODULES)}
                className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-[10px] font-bold font-mono">
                      {m.code}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">Sprint 1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1" title={m.name}>
                      {m.name}
                    </h4>
                    <p
                      className="text-xs text-muted-foreground mt-0.5 line-clamp-1"
                      title={m.featureSummary}
                    >
                      {m.featureSummary}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, m.percentage))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-muted-foreground">
                        {m.doneHours} / {m.totalHours} Jam
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          m.percentage === 100
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-primary",
                        )}
                      >
                        {m.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {m.activeTasks} tugas aktif · {m.totalTasks} total
                  </span>
                  <span className="font-medium text-foreground">TL: Fauzan</span>
                </div>
              </div>
            ))}

            {filteredModules.length === 0 && (
              <div className="col-span-2 p-6 rounded-xl border border-dashed border-border bg-card text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">Belum ada modul terdaftar</p>
                <p className="text-[11px] text-muted-foreground">
                  Buat modul baru melalui menu Proyek & Deliverable.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Eksekusi Section (Gantt Schedule) */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Timeline Eksekusi</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Alokasi man-hour & tenggat tugas</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">12 – 18 Oktober 2026</span>
              <span className="px-2.5 py-1 text-xs border border-border rounded-lg bg-card text-foreground font-semibold shadow-2xs">Week</span>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] space-y-3">
              {/* Day Columns Header */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground font-medium border-b border-border/60 pb-2">
                <span>Sen 12</span>
                <span>Sel 13</span>
                <span>Rab 14</span>
                <span>Kam 15</span>
                <span>Jum 16</span>
                <span>Sab 17</span>
                <span>Min 18</span>
              </div>

              {/* Row 1: DDL & Skema DB */}
              <div className="flex items-center gap-3">
                <div className="w-28 text-xs font-semibold text-foreground truncate shrink-0">DDL & Skema DB</div>
                <div className="flex-1 grid grid-cols-7 gap-2">
                  <div className="col-span-2 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center justify-center">
                    8.0h
                  </div>
                </div>
              </div>

              {/* Row 2: UI Form Nasabah */}
              <div className="flex items-center gap-3">
                <div className="w-28 text-xs font-semibold text-foreground truncate shrink-0">UI Form Nasabah</div>
                <div className="flex-1 grid grid-cols-7 gap-2">
                  <div className="col-start-2 col-span-3 h-7 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                    16.0h
                  </div>
                </div>
              </div>

              {/* Row 3: API Validasi KTP */}
              <div className="flex items-center gap-3">
                <div className="w-28 text-xs font-semibold text-foreground truncate shrink-0">API Validasi KTP</div>
                <div className="flex-1 grid grid-cols-7 gap-2">
                  <div className="col-start-3 col-span-3 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
                    16.0h
                  </div>
                </div>
              </div>

              {/* Row 4: Setup Logging */}
              <div className="flex items-center gap-3">
                <div className="w-28 text-xs font-semibold text-foreground truncate shrink-0">Setup Logging</div>
                <div className="flex-1 grid grid-cols-7 gap-2">
                  <div className="col-start-4 col-span-2 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center">
                    8.0h
                  </div>
                </div>
              </div>
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

          {/* Bottom Stage Counts */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono mr-1.5">03</span>
              <span className="text-muted-foreground font-medium">In progress</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono mr-1.5">02</span>
              <span className="text-muted-foreground font-medium">Approval</span>
            </div>
          </div>
        </div>

        {/* Anggota Tim & PIC Card */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
          <h3 className="text-sm font-bold text-foreground">Anggota Tim & PIC</h3>

          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-9 rounded-full bg-indigo-600 text-white font-bold text-xs grid place-items-center shadow-2xs">TW</div>
              <span className="text-[11px] text-muted-foreground font-medium">Wildan</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="size-9 rounded-full bg-emerald-600 text-white font-bold text-xs grid place-items-center shadow-2xs">FZ</div>
              <span className="text-[11px] text-muted-foreground font-medium">Fauzan</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="size-9 rounded-full bg-purple-600 text-white font-bold text-xs grid place-items-center shadow-2xs">AR</div>
              <span className="text-[11px] text-muted-foreground font-medium">Ariel</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="size-9 rounded-full bg-blue-600 text-white font-bold text-xs grid place-items-center shadow-2xs">FJ</div>
              <span className="text-[11px] text-muted-foreground font-medium">Fajri</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="size-9 rounded-full bg-amber-600 text-white font-bold text-xs grid place-items-center shadow-2xs">VD</div>
              <span className="text-[11px] text-muted-foreground font-medium">Valdric</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">5 anggota</span>
            <button type="button" className="font-semibold text-primary hover:underline cursor-pointer">
              Kelola tim ↗
            </button>
          </div>
        </div>

        {/* Aktivitas Tim Card */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs">
          <h3 className="text-sm font-bold text-foreground">Aktivitas Tim</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="size-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">Login JWT & RBAC disahkan</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Fauzan · 10 Okt, 16.42</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="size-2 rounded-full bg-amber-500 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">Endpoint Cek Saldo siap diuji</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Fajri · 12 Okt, 09.15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
