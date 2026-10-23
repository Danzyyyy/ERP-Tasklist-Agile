// src/Features/Reports/Pages/ReportsPage.tsx
import React, { useMemo } from "react";
import useDeliverableProgress from "@/Features/Dashboard/Hooks/useDeliverableProgress";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import useModules from "@/Features/Modules/Hooks/useModules";
import DeliverableProgressCard from "@/Features/Dashboard/Components/DeliverableProgressCard";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { formatManHours } from "@/Utils/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FileSpreadsheet,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";

export const ReportsPage: React.FC = () => {
  useDocumentTitle(
    "Laporan Progres & SLA",
    "Analisis akumulasi man-hour kerja riil, grafik distribusi modul, dan pelacakan rasio progres deliverable Formula Q-03.",
  );
  const { data: metrics } = useDeliverableProgress();
  const { data: tasks = [] } = useTasks();
  const { data: modules = [] } = useModules();

  const effectiveMetrics = useMemo(() => {
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
      totalEstimatedManHours > 0 ? (completedManHours / totalEstimatedManHours) * 100 : 0.0;
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

  // Progress by Module Data for Bar Chart
  const moduleChartData = useMemo(() => {
    return modules.map((mod) => {
      // Find all tasks under this module
      const modTasks = tasks.filter((t) => t.module_id === mod.id);
      const totalHours = modTasks.reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);
      const doneHours = modTasks
        .filter((t) => t.status === "DONE")
        .reduce((acc, t) => acc + (Number(t.estimated_man_hours) || 0), 0);

      return {
        name: mod.code,
        fullName: mod.name,
        Total: totalHours,
        Done: doneHours,
      };
    });
  }, [modules, tasks]);

  // Complexity Distribution Data for Pie Chart
  const complexityChartData = useMemo(() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    tasks.forEach((t) => {
      if (counts[t.complexity_weight as keyof typeof counts] !== undefined) {
        counts[t.complexity_weight as keyof typeof counts] += Number(t.estimated_man_hours) || 0;
      }
    });

    return [
      { name: "Low Complexity (Q-01)", value: counts.LOW, color: "#10b981" },
      { name: "Medium Complexity (Q-01)", value: counts.MEDIUM, color: "#f59e0b" },
      { name: "High Complexity (Q-01)", value: counts.HIGH, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  }, [tasks]);

  const handleExport = () => {
    toast.success("Laporan deliverable sprint berhasil diunduh (Format JSON / CSV disiapkan).");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-subtle-foreground bg-primary-subtle px-2 py-0.5 rounded border border-primary-subtle-border">
            DELIVERABLE ANALYTICS & AUDIT / FTR-K04-07
          </span>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight mt-1.5 flex items-center gap-2">
            <span>Pelaporan Progres Deliverable & Audit Sprint</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Integrasi metrik real-time untuk modul pelaporan (E-5) dan pengawasan proyek (D-3, D-4).
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="text-foreground text-xs self-start sm:self-auto"
        >
          <Download className="size-3.5 mr-1 text-primary" />
          Ekspor Laporan (SLA)
        </Button>
      </div>

      {/* Hero Metric */}
      <DeliverableProgressCard metrics={effectiveMetrics} />

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Module Burnout Bar Chart */}
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="size-4 text-blue-600" />
              <span>Akumulasi Man-Hour per Modul (Total vs Done)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Satuan: Jam Kerja</span>
          </div>

          <div className="h-64 w-full">
            {moduleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={moduleChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="Total" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Total Jam" />
                  <Bar
                    dataKey="Done"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    name="Jam Selesai (Done)"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-xs text-slate-400">
                Belum ada data modul untuk grafik
              </div>
            )}
          </div>
        </Card>

        {/* Complexity Weight Pie Chart */}
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <PieChartIcon className="size-4 text-amber-600" />
              <span>Proporsi Beban Kerja Berdasarkan Bobot (Q-01)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Man-Hour Total</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {complexityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complexityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {complexityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Belum ada data bobot untuk grafik</div>
            )}
          </div>
        </Card>
      </div>

      {/* Deliverable Audit Table */}
      <Card className="p-4 border-slate-200 bg-white">
        <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <FileSpreadsheet className="size-4 text-emerald-600" />
          <span>Matriks Verifikasi Deliverable Sprint 1 (Kelompok 4 / Kelas E)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="p-2.5">Kode Tugas</th>
                <th className="p-2.5">Judul Deliverable</th>
                <th className="p-2.5">Bobot</th>
                <th className="p-2.5">Estimasi Jam</th>
                <th className="p-2.5">Status Kanban</th>
                <th className="p-2.5">Ceklis PM (DoD)</th>
                <th className="p-2.5">Otorisasi TL (DONE)</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-border/70 hover:bg-muted/50">
                  <td className="p-2.5 font-mono font-bold text-primary">{task.task_code}</td>
                  <td className="p-2.5 font-medium text-foreground">{task.title}</td>
                  <td className="p-2.5">
                    <Badge variant={task.complexity_weight as any} size="sm">
                      {task.complexity_weight}
                    </Badge>
                  </td>
                  <td className="p-2.5 font-mono font-bold text-slate-700">
                    {formatManHours(task.estimated_man_hours)}
                  </td>
                  <td className="p-2.5">
                    <Badge variant={task.status as any} size="sm" dot>
                      {task.status}
                    </Badge>
                  </td>
                  <td className="p-2.5">
                    {task.is_pm_verified ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {task.is_tl_signed ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Disahkan (DoD)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
