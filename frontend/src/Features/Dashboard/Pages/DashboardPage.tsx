// src/Features/Dashboard/Pages/DashboardPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useDashboardOverview from "../Hooks/useDashboardOverview";
import useDashboardMetrics from "../Hooks/useDashboardMetrics";
import useGetModuleList from "@/Hooks/useGetModuleList";
import { useProject } from "@/Contexts/ProjectContext";
import useExecutionReadiness from "@/Hooks/useExecutionReadiness";
import { useAuth } from "@/Hooks/useAuth";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { Button } from "@/Components/Elements/Button";
import ModuleDeliverableCard from "../Components/ModuleDeliverableCard";
import { PriorityTasksCard } from "../Components/PriorityTasksCard";
import { StageComplexityCard } from "../Components/StageComplexityCard";
import { AtRiskTasksCard } from "../Components/AtRiskTasksCard";
import { SprintReadinessCard } from "../Components/SprintReadinessCard";
import { SprintSummaryCard } from "../Components/SprintSummaryCard";
import { TeamWorkloadCard } from "../Components/TeamWorkloadCard";
import { RecentActivitiesCard } from "../Components/RecentActivitiesCard";
import type { Task } from "@/Types/task";

export const DashboardPage: React.FC = () => {
  useDocumentTitle("Dashboard", "Semua progres, prioritas, dan keputusan tim. Dalam satu workspace.");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeProjectId, activeProject } = useProject();
  const { effectiveMetrics, tasks, goToTasks, goToKanban } = useDashboardOverview();
  const { data: modules = [] } = useGetModuleList();
  const { data: readiness } = useExecutionReadiness(activeProjectId);

  const {
    activeTasksCount,
    priorityTasks,
    stageStats,
    complexityBreakdown,
    atRiskTasks,
    teamWorkload,
    dynamicActivities,
    donutMetrics,
  } = useDashboardMetrics(tasks, effectiveMetrics.progressPercentage);

  const handleTaskClick = (t: Task) => {
    if (t.status === "DRAFT") {
      goToTasks();
    } else if (t.status === "CODE_REVIEW" || t.status === "TESTING") {
      navigate(ROUTE_PATHS.REVIEWS);
    } else {
      goToKanban();
    }
  };

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
          <Button
            type="button"
            onClick={goToTasks}
            className="h-9 px-4 rounded-lg text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <span>Kelola Tasklist</span>
          </Button>
        </div>

        {/* 1. Tugas Prioritas */}
        <PriorityTasksCard
          tasks={priorityTasks}
          activeCount={activeTasksCount}
          onViewAll={goToTasks}
          onTaskClick={handleTaskClick}
        />

        {/* 2. Modul & Deliverable Proyek */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Modul & Deliverable Proyek</h3>
            <Button
              type="button"
              variant="link"
              onClick={() => navigate(ROUTE_PATHS.PROJECTS)}
              className="text-xs font-semibold text-primary p-0 h-auto gap-1"
            >
              Lihat portfolio proyek ↗
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {modules.map((m) => {
              const featureSummary =
                m.features && m.features.length > 0
                  ? m.features.map((f) => f.name).join(" · ")
                  : "Tugas Mandiri (Tingkat Modul)";

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

        {/* 3. Distribusi Status & Kompleksitas */}
        <StageComplexityCard
          stageStats={stageStats}
          complexityBreakdown={complexityBreakdown}
          totalHours={effectiveMetrics.totalEstimatedManHours}
          onOpenBoard={goToKanban}
        />

        {/* 4. Tugas Berisiko & Tenggat Kritis */}
        <AtRiskTasksCard
          tasks={atRiskTasks}
          tasksAtRiskOrOverdueCount={effectiveMetrics.tasksAtRiskOrOverdue}
          onViewTasklist={goToTasks}
        />

        {/* 5. Tata Kelola & Kesiapan Eksekusi Sprint */}
        <SprintReadinessCard
          readyForExecution={readiness?.readyForExecution}
          activeProjectCode={activeProject?.canonicalCode || activeProjectId}
          activeProjectClient={activeProject?.clientName || "PT. Anaheim Nimbus Universal"}
          momStatusText={readiness?.momId ? "Dokumen MoM Disahkan" : "MoM Terverifikasi"}
          kickoffIdText={`ID: ${readiness?.kickoffId ? readiness.kickoffId.slice(0, 18) + "..." : "Terjadwal"}`}
          projectStatus={activeProject?.status || "REGISTERED"}
        />
      </div>

      {/* Right Column (approx 35% width: 4 cols out of 12) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Ringkasan Sprint Card with Donut Chart */}
        <SprintSummaryCard
          metrics={effectiveMetrics}
          stageStats={stageStats}
          donutMetrics={donutMetrics}
        />

        {/* Anggota Tim & PIC Card */}
        <TeamWorkloadCard
          teamWorkload={teamWorkload}
          onAlokasiKanban={goToKanban}
        />

        {/* Aktivitas Tim Card */}
        <RecentActivitiesCard activities={dynamicActivities} />
      </div>
    </div>
  );
};

export default DashboardPage;
