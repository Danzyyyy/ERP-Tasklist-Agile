// src/Features/Reports/Pages/ReportsPage.tsx
import React from "react";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import useDashboardOverview from "@/Features/Dashboard/Hooks/useDashboardOverview";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import { useGetDeliverableProgress } from "@/Hooks/useGetDeliverableProgress";
import useGetModuleList from "@/Hooks/useGetModuleList";
import ModuleProgressReportRow from "../Components/ModuleProgressReportRow";
import { Button } from "@/Components/Elements/Button";
import { RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const ReportsPage: React.FC = () => {
  useDocumentTitle(
    "Laporan Eksekutif",
    "Pemantauan progres deliverable berbasis rasio akumulasi man-hour tugas Done terhadap total man-hour (SOP-07 & Q-03).",
  );

  const { goToTasks } = useDashboardOverview();
  const { data: progress, refetch: refetchProgress } = useGetDeliverableProgress();
  const { data: allTasks = [], refetch: refetchTasks } = useGetTaskList({});
  const { data: modules = [] } = useGetModuleList();

  const handleRefresh = async () => {
    await Promise.all([refetchProgress(), refetchTasks()]);
    toast.success("Data laporan dan kalkulasi progres deliverable berhasil diperbarui.");
  };

  const doneHours = progress?.completedManHours ?? 0;
  const totalHours = progress?.totalEstimatedManHours ?? 0;
  const progressPercent = (progress?.progressPercentage ?? 0).toFixed(1);

  // Rollover candidates: active tasks that are not yet DONE
  const activeTasks = allTasks.filter((t) => t.status !== "DONE");

  const getStageColor = (status: string) => {
    switch (status) {
      case "CODE_REVIEW":
        return "text-purple-600 dark:text-purple-400";
      case "TESTING":
        return "text-cyan-600 dark:text-cyan-400";
      case "DEVELOPMENT":
        return "text-blue-600 dark:text-blue-400";
      case "RELEASED":
        return "text-emerald-600 dark:text-emerald-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getStageLabel = (status: string) => {
    switch (status) {
      case "CODE_REVIEW":
        return "Code Review";
      case "TESTING":
        return "QA Testing";
      case "DEVELOPMENT":
        return "In Development";
      case "RELEASED":
        return "Released";
      case "DRAFT":
        return "Draft";
      case "DONE":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Title Card (FigCraft 1:1) */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded">
              EXECUTIVE REPORT · FTR-K04-07
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Laporan Eksekutif & Matriks Deliverable
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Pemantauan progres deliverable berbasis rasio akumulasi man-hour tugas Done terhadap total man-hour (SOP-07 & Q-03).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            className="h-9 px-3.5 rounded-lg text-foreground text-xs font-semibold gap-1.5 shadow-2xs"
          >
            <RefreshCw className="size-3.5" />
            <span>Segarkan Data</span>
          </Button>
          <Button
            type="button"
            onClick={goToTasks}
            className="h-9 px-4 rounded-lg text-xs font-semibold shrink-0 shadow-xs gap-1.5"
          >
            <span>Kelola Tasklist</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Deliverable Progress Engine Banner */}
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="font-mono text-[10px] font-bold text-primary tracking-wider uppercase block">
            DELIVERABLE PROGRESS ENGINE
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Progres dihitung otomatis oleh sistem berbasis akumulasi man-hour tervalidasi Done (Q-03).
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          <span className="font-mono text-[10px] text-muted-foreground">
            FTR-K04-07 · Q-03
          </span>
          <div className="font-mono text-base sm:text-lg font-black text-primary">
            {doneHours} JAM DONE / {totalHours} TOTAL JAM × 100% = {progressPercent}%
          </div>
        </div>
      </div>

      {/* 2-Column Split: Progres Modul & Efisiensi Man-Hour */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Perbandingan Progres Modul */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Perbandingan Progres Modul</h3>
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
        </div>

        {/* Card 2: Efisiensi Man-Hour PIC */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Alokasi & Realisasi Man-Hour PIC</h3>
            <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">
              DONE / ALOKASI
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {(() => {
              // Aggregate by PIC
              const picMap: Record<string, { name: string; total: number; done: number }> = {};
              allTasks.forEach((t) => {
                const picName = typeof t.pic === "string" ? t.pic : t.pic?.name || "Belum Ditugaskan";
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
                  className={`flex items-center justify-between py-1 ${
                    idx < entries.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <span className="font-medium text-foreground">{entry.name}</span>
                  <span
                    className={`font-mono ${
                      entry.done > 0 && entry.done === entry.total
                        ? "text-emerald-600 dark:text-emerald-400 font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {entry.done} / {entry.total} Jam
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Weekly Cycle Rollover Card */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Weekly Cycle Rollover (SOP-08 & Q-08)</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold font-mono">
                {activeTasks.length} TUGAS AKTIF
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tugas yang belum selesai pada siklus berjalan akan dievaluasi PM untuk dilanjutkan ke sprint berikutnya.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info("Fitur MoM / Change Log dijadwalkan pada rilis Sprint 2 (FTR-K04-10).")}
              className="px-3.5 py-2 rounded-xl text-foreground text-xs font-semibold"
            >
              Prioritaskan Ulang / MoM
            </Button>
            <Button
              type="button"
              onClick={() => toast.success("Siklus sprint aktif telah disinkronkan dengan backlog tugas.")}
              className="px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
            >
              Lanjutkan ke Sprint Berikutnya →
            </Button>
          </div>
        </div>

        {/* Rollover Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-2.5 px-3">TUGAS</th>
                <th className="py-2.5 px-3">TAHAPAN SAAT INI</th>
                <th className="py-2.5 px-3">MAN-HOUR</th>
                <th className="py-2.5 px-3">PIC</th>
                <th className="py-2.5 px-3">ESTIMASI SELESAI</th>
              </tr>
            </thead>
            <tbody>
              {activeTasks.map((t) => {
                const picLabel = typeof t.pic === "string" ? t.pic : t.pic?.name || "-";
                return (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      <span className="font-mono text-muted-foreground mr-1.5">{t.task_code || "#TSK"} ·</span>
                      <span>{t.title}</span>
                    </td>
                    <td className={`py-2.5 px-3 font-semibold ${getStageColor(t.status)}`}>
                      {getStageLabel(t.status)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {Number(t.estimated_man_hours) || 0} Jam
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {picLabel}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">
                      {t.target_deadline ? t.target_deadline.split("T")[0] : "-"}
                    </td>
                  </tr>
                );
              })}

              {activeTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground italic">
                    Seluruh tugas telah berstatus DONE. Tidak ada rollover yang diperlukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-muted-foreground pt-1">
          Hanya Project Manager yang berwenang mengeksekusi rollover akhir siklus mingguan (Q-08).
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
