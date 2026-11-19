// src/Features/Reports/Pages/ReportsPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import useDashboardOverview from "@/Features/Dashboard/Hooks/useDashboardOverview";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import {
  useGetDeliverableProgress,
  DEFAULT_DELIVERABLE_METRICS,
} from "@/Hooks/useGetDeliverableProgress";
import useGetModuleList from "@/Hooks/useGetModuleList";
import ModuleProgressReportRow from "../Components/ModuleProgressReportRow";
import { Avatar, AvatarFallback } from "@/Components/Elements/Avatar";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/Components/Elements/DataTable";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { getAvatarTone, getInitials, getTaskAssigneeName, isTaskRework } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";
import { RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const ReportsPage: React.FC = () => {
  useDocumentTitle(
    "Laporan Eksekutif",
    "Ringkasan capaian deliverable berdasarkan rasio jam kerja selesai dan pemantauan risiko tenggat.",
  );

  const navigate = useNavigate();
  const { goToTasks } = useDashboardOverview();
  const { data: progress = DEFAULT_DELIVERABLE_METRICS, refetch: refetchProgress } =
    useGetDeliverableProgress();
  const { data: allTasks = [], refetch: refetchTasks } = useGetTaskList({});
  const { data: modules = [] } = useGetModuleList();

  const handleRefresh = async () => {
    await Promise.all([refetchProgress(), refetchTasks()]);
    toast.success("Data laporan dan kalkulasi progres deliverable berhasil diperbarui.");
  };

  const doneHours = progress.completedManHours;
  const totalHours = progress.totalEstimatedManHours;
  const progressPercent = progress.progressPercentage.toFixed(1);

  const activeTasks = allTasks.filter((t) => t.status !== "DONE");
  const remainingEstimatedHours = activeTasks.reduce(
    (sum, t) => sum + (Number(t.estimated_man_hours) || 0),
    0,
  );

  const getStageLabel = (status: string, isRework?: boolean) => {
    if (status === "DEVELOPMENT" && isRework) return "Development · Rework";
    switch (status) {
      case "CODE_REVIEW":
        return "Code Review";
      case "TESTING":
        return "Testing · Menunggu PM";
      case "DEVELOPMENT":
        return "In Development";
      case "RELEASED":
        return "Released";
      case "DRAFT":
        return "Draft · PM Pending";
      case "DONE":
        return "Done";
      default:
        return status;
    }
  };

  const getStageBadgeVariant = (status: string, isRework?: boolean) => {
    if (status === "DEVELOPMENT" && isRework) return "REWORK";
    return status;
  };

  return (
    <div className="space-y-4">
      {/* Page Title Card (FigCraft 1:1) */}
      <Card
        size="md"
        padding="lg"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Laporan Eksekutif &amp; Matriks Deliverable
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Ringkasan capaian deliverable berdasarkan rasio jam kerja selesai dan pemantauan risiko tenggat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
          >
            <RefreshCw className="size-3.5" />
            <span>Segarkan Kalkulasi</span>
          </Button>
          <Button
            type="button"
            onClick={goToTasks}
            className="shrink-0"
          >
            <span>Kelola Tasklist</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </Card>

      {/* Deliverable Progress Summary Banner */}
      <Card
        size="md"
        padding="relaxed"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <span className="font-mono text-[10.5px] font-bold text-primary tracking-wider uppercase block">
            RINGKASAN DELIVERABLE PROYEK
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rasio jam kerja selesai dibanding total estimasi. Realisasi aktual:{" "}
            {progress.actualManHoursSpent.toFixed(1)} Jam · {progress.tasksAtRiskOrOverdue} Risiko H-1.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          <Badge variant="default" size="sm">
            RASIO REAL-TIME
          </Badge>
          <div className="font-mono tabular-nums text-base sm:text-lg font-black text-primary">
            {doneHours.toFixed(1)} JAM DONE / {totalHours.toFixed(1)} TOTAL JAM × 100% ={" "}
            {progressPercent}%
          </div>
        </div>
      </Card>

      {/* 2-Column Split: Progres Modul & Alokasi Man-Hour PIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card size="md" padding="relaxed" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Perbandingan Progres per Modul</h3>
            <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">
              {modules.length} MODUL AKTIF
            </span>
          </div>

          <div className="space-y-3">
            {modules.map((m) => (
              <ModuleProgressReportRow
                key={m.id}
                moduleId={m.id}
                moduleCode={m.code}
                moduleName={m.name}
              />
            ))}

            {modules.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Belum ada modul terdaftar.</p>
            )}
          </div>
        </Card>

        <Card size="md" padding="relaxed" className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Alokasi &amp; Realisasi Man-Hour PIC</h3>
            <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">
              DONE / ESTIMASI
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {(() => {
              const picMap: Record<string, { name: string; total: number; done: number }> = {};
              allTasks.forEach((t) => {
                const picName = getTaskAssigneeName(t);
                if (!picMap[picName]) {
                  picMap[picName] = { name: picName, total: 0, done: 0 };
                }
                const hrs = Number(t.estimated_man_hours) || 0;
                picMap[picName].total += hrs;
                if (t.status === "DONE") {
                  picMap[picName].done += hrs;
                }
              });

              const entries = Object.values(picMap);
              if (entries.length === 0) {
                return <p className="text-xs text-muted-foreground italic">Belum ada tugas.</p>;
              }

              return entries.map((entry, idx) => (
                <div
                  key={entry.name}
                  className={cn(
                    "flex items-center justify-between py-1",
                    idx < entries.length - 1 && "border-b border-border/50",
                  )}
                >
                  <span className="font-medium text-foreground">{entry.name}</span>
                  <span
                    className={cn(
                      "font-mono tabular-nums",
                      entry.done > 0 && entry.done === entry.total
                        ? "text-success font-bold"
                        : "text-muted-foreground",
                    )}
                  >
                    {entry.done.toFixed(1)} / {entry.total.toFixed(1)} Jam
                  </span>
                </div>
              ));
            })()}
          </div>
        </Card>
      </div>

      {/* Active Tasks & H-1 Risk Audit Card using Live Design Kit DataTable + DataTableRow */}
      <Card size="md" padding="relaxed" className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Tugas Belum Selesai &amp; Audit Risiko H-1
              </h3>
              <Badge variant="primary" size="sm">
                {activeTasks.length} TUGAS AKTIF
              </Badge>
              <span className="text-xs text-muted-foreground">
                {remainingEstimatedHours.toFixed(1)} Jam estimasi tersisa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToTasks}
            >
              Buka Tasklist
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate(ROUTE_PATHS.KANBAN)}
            >
              Buka Agile Board →
            </Button>
          </div>
        </div>

        {/* Standard DataTable Primitive (Card MD Base + DataTableRow) */}
        <DataTable>
          <DataTableHeader>
            <DataTableRow rowType="header">
              <DataTableHead>TUGAS &amp; MODUL</DataTableHead>
              <DataTableHead className="w-48">TAHAPAN SAAT INI</DataTableHead>
              <DataTableHead align="right" className="w-28">
                EST / AKTUAL
              </DataTableHead>
              <DataTableHead className="w-48">PIC PELAKSANA</DataTableHead>
              <DataTableHead align="right" className="w-32">
                TENGGAT H-1
              </DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {activeTasks.map((t) => {
              const hasPic = Boolean(t.assignee_name);
              const picLabel = getTaskAssigneeName(t);
              const picInitial = hasPic ? getInitials(picLabel) : "";
              const picTone = hasPic ? getAvatarTone(picInitial) : "slate";

              const estHrs = Number(t.estimated_man_hours) || 0;
              const actHrs = Number(t.actual_man_hours) || 0;

              const dlDate = t.target_deadline ? new Date(t.target_deadline) : null;
              const isValidDl = dlDate !== null && !Number.isNaN(dlDate.getTime());
              const isUrgent =
                isValidDl && dlDate.getTime() - Date.now() <= 24 * 60 * 60 * 1000;
              const dlText = isValidDl
                ? isUrgent
                  ? `${dlDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} · H-1!`
                  : dlDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                : "—";

              return (
                <DataTableRow key={t.id}>
                  <DataTableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono tabular-nums text-[11px] font-semibold text-primary shrink-0 w-14">
                        {t.task_code || "TSK"}
                      </span>
                      <span className="font-medium text-foreground truncate">{t.title}</span>
                      {t.module?.code && (
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          ({t.module.code})
                        </span>
                      )}
                    </div>
                  </DataTableCell>

                  <DataTableCell>
                    <Badge variant={getStageBadgeVariant(t.status, isTaskRework(t))} size="sm">
                      {getStageLabel(t.status, isTaskRework(t))}
                    </Badge>
                  </DataTableCell>

                  <DataTableCell align="right" tabular nowrap weight="medium">
                    {estHrs.toFixed(1)} / {actHrs.toFixed(1)} h
                  </DataTableCell>

                  <DataTableCell>
                    {hasPic ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar size="xs" borderless>
                          <AvatarFallback appearance="solid" tone={picTone}>
                            {picInitial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground truncate">{picLabel}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Belum Ditugaskan</span>
                    )}
                  </DataTableCell>

                  <DataTableCell
                    align="right"
                    tabular
                    nowrap
                    weight={isUrgent ? "bold" : "normal"}
                    tone={isUrgent ? "destructive" : "muted"}
                  >
                    {dlText}
                  </DataTableCell>
                </DataTableRow>
              );
            })}

            {activeTasks.length === 0 && (
              <DataTableRow>
                <td
                  colSpan={5}
                  className="py-6 text-center text-xs text-muted-foreground italic"
                >
                  Seluruh tugas telah berstatus selesai. Tidak ada tugas aktif tersisa.
                </td>
              </DataTableRow>
            )}
          </DataTableBody>
        </DataTable>

        <p className="text-[11px] text-muted-foreground pt-0.5">
          Data progres dihitung otomatis secara real-time berdasarkan status penyelesaian tugas pada proyek aktif.
        </p>
      </Card>
    </div>
  );
};

export default ReportsPage;
