// src/Features/Tasks/Pages/TasklistPage.tsx
import React, { useState, useMemo } from "react";
import useTaskHierarchy from "../Hooks/useTaskHierarchy";
import useSeedDemoData from "../Hooks/useSeedDemoData";
import { useFilterParams } from "@/Hooks/useFilterParams";
import { TaskTreeRow, type TreeItem } from "../Components/TaskTreeRow";
import TaskModal from "../Components/TaskModal";
import TaskDetailModal from "../Components/TaskDetailModal";
import CreateModuleModal from "@/Features/Modules/Components/CreateModuleModal";
import CreateFeatureModal from "@/Features/Modules/Components/CreateFeatureModal";
import ApprovalModal from "@/Features/Approvals/Components/ApprovalModal";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Select } from "@/Components/Elements/Select";
import { Progress } from "@/Components/Elements/Progress";
import { Card } from "@/Components/Elements/Card";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import type { Task, Module } from "@/Types/task";
import {
  Plus,
  Search,
  Sparkles,
  Database,
  Layers,
  FolderPlus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Kanban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { TASK_STATUS_OPTIONS } from "@/Constants/CommonConstant";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";

export const TasklistPage: React.FC = () => {
  useDocumentTitle(
    "Tasklist & Dual-Approval",
    "Pengelolaan hierarki backlog tugas proyek agile dan evaluasi gerbang persetujuan rilis tugas (Dual-Approval Gate SOP-07).",
  );
  const navigate = useNavigate();
  const { data: hierarchy = [], isLoading, refetch } = useTaskHierarchy();
  const { seed, seeding } = useSeedDemoData();
  const { filters, setFilter } = useFilterParams<{
    module_id: string;
    status: string;
    search: string;
  }>();

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedModuleForFeature, setSelectedModuleForFeature] = useState<string | undefined>();
  const [activeTaskDetail, setActiveTaskDetail] = useState<Task | null>(null);
  const [approvalTask, setApprovalTask] = useState<Task | null>(null);

  // Expand / Collapse state
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Flatten & Filter hierarchy
  const { treeItems, deliverableStats } = useMemo(() => {
    const items: TreeItem[] = [];
    let totalEstimatedHours = 0;
    let doneHours = 0;
    let totalTasksCount = 0;
    let doneTasksCount = 0;

    const searchLower = (filters.search || "").toLowerCase();
    const statusFilter = filters.status || "ALL";
    const moduleFilter = filters.module_id || "ALL";

    hierarchy.forEach((mod) => {
      if (moduleFilter !== "ALL" && mod.id !== moduleFilter) return;

      const isModCollapsed = Boolean(collapsedNodes[mod.id]);
      items.push({ kind: "MODULE", data: mod, depth: 0, open: !isModCollapsed });

      // Direct Module Tasks
      if (mod.tasks && mod.tasks.length > 0) {
        mod.tasks.forEach((t) => {
          totalEstimatedHours += Number(t.estimated_man_hours) || 0;
          totalTasksCount += 1;
          if (t.status === "DONE") {
            doneHours += Number(t.estimated_man_hours) || 0;
            doneTasksCount += 1;
          }

          if (isModCollapsed) return;

          // Status & search filter
          if (statusFilter !== "ALL" && t.status !== statusFilter) return;
          if (
            searchLower &&
            !t.title.toLowerCase().includes(searchLower) &&
            !t.task_code.toLowerCase().includes(searchLower)
          ) {
            return;
          }

          items.push({ kind: "TASK", data: t, depth: 1 });
        });
      }

      // Feature Tasks
      if (mod.features && mod.features.length > 0) {
        mod.features.forEach((ftr) => {
          const isFtrCollapsed = isModCollapsed || Boolean(collapsedNodes[ftr.id]);
          if (!isModCollapsed) {
            items.push({
              kind: "FEATURE",
              data: ftr,
              module: mod,
              depth: 1,
              open: !isFtrCollapsed,
            });
          }

          if (ftr.tasks && ftr.tasks.length > 0) {
            ftr.tasks.forEach((t) => {
              totalEstimatedHours += Number(t.estimated_man_hours) || 0;
              totalTasksCount += 1;
              if (t.status === "DONE") {
                doneHours += Number(t.estimated_man_hours) || 0;
                doneTasksCount += 1;
              }

              if (isFtrCollapsed) return;

              if (statusFilter !== "ALL" && t.status !== statusFilter) return;
              if (
                searchLower &&
                !t.title.toLowerCase().includes(searchLower) &&
                !t.task_code.toLowerCase().includes(searchLower)
              ) {
                return;
              }

              items.push({ kind: "TASK", data: t, depth: 2 });
            });
          }
        });
      }
    });

    // Q-03 Mathematical Progress Ratio Formula (Safe against zero division)
    const progressPercentage =
      totalEstimatedHours > 0 ? (doneHours / totalEstimatedHours) * 100 : 0.0;

    return {
      treeItems: items,
      deliverableStats: {
        totalEstimatedHours,
        doneHours,
        totalTasksCount,
        doneTasksCount,
        progressPercentage,
      },
    };
  }, [hierarchy, filters, collapsedNodes]);

  return (
    <div className="space-y-4">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-subtle-foreground bg-primary-subtle px-2 py-0.5 rounded border border-primary-subtle-border">
              EXECUTION WORKSPACE / UI-K04-01
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight mt-1.5">
            Tasklist & Dual-Approval Gate
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hierarki pekerjaan (Modul &rarr; Fitur &rarr; Tugas) sesuai SOP-05 dan akuntabilitas rilis.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hierarchy.length === 0 && (
            <Button
              variant="outline"
              loading={seeding}
              onClick={seed}
              className="text-primary border-primary-subtle-border bg-primary-subtle/50 hover:bg-primary-subtle text-xs"
            >
              <Database className="size-3.5 mr-1 text-primary" />
              Muat Data Demonstrasi
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate(ROUTE_PATHS.KANBAN)}
            className="text-foreground text-xs"
          >
            <Kanban className="size-3.5 mr-1 text-primary" />
            Papan Kanban
          </Button>

          <Button variant="outline" onClick={() => setIsModuleModalOpen(true)} className="text-xs">
            <FolderPlus className="size-3.5 mr-1 text-muted-foreground" />
            Tambah Modul
          </Button>

          <Button variant="primary" onClick={() => setIsTaskModalOpen(true)} className="text-xs">
            <Plus className="size-3.5 mr-1" />
            Tambah Tugas Baru
          </Button>
        </div>
      </div>

      {/* Deliverable Progress Card (FTR-K04-07 & Q-03 Engine) */}
      <Card className="p-4 bg-gradient-to-r from-card via-card to-primary-subtle/40 border-primary-subtle-border shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary grid place-items-center shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground">
                  Progres Deliverable Sprint Aktif
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  (Formula Q-03: Man-Hour DONE / Total Man-Hour)
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono truncate block">
                {deliverableStats.doneTasksCount} dari {deliverableStats.totalTasksCount} tugas
                selesai (
                <b>{formatManHours(deliverableStats.doneHours)}</b> /{" "}
                {formatManHours(deliverableStats.totalEstimatedHours)})
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xl font-extrabold text-primary font-mono">
              {formatPercent(deliverableStats.progressPercentage)}
            </span>
            <span className="block text-[9px] text-muted-foreground font-medium">Akumulasi Selesai</span>
          </div>
        </div>

        <Progress
          value={deliverableStats.progressPercentage}
          tone="indigo"
          showLabel
          height="h-5"
        />

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" />
            Tugas baru dihitung otomatis ke persentase progres setelah resmi ditutup (DONE) oleh TL.
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RefreshCw className="size-3" />
            Segarkan
          </button>
        </div>
      </Card>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-2.5 px-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-3xl">
          {/* Module Filter */}
          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={filters.module_id || "ALL"}
              onChange={(e) => setFilter("module_id", e.target.value)}
            >
              <option value="ALL">Semua Modul</option>
              {hierarchy.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-44 shrink-0">
            <Select
              value={filters.status || "ALL"}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              {TASK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              placeholder="Cari kode tugas atau judul..."
              className="pl-8 h-8"
              value={filters.search || ""}
              onChange={(e) => setFilter("search", e.target.value)}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono self-end md:self-auto shrink-0">
          Total Baris: <b>{treeItems.length}</b>
        </div>
      </div>

      {/* Hierarchy Table */}
      <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[780px] border-collapse text-left">
          <thead>
            <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
              <th className="py-2.5 px-3">Hierarki Modul & Tugas (SOP-05)</th>
              <th className="py-2.5 px-3 w-28">Bobot (Q-01)</th>
              <th className="py-2.5 px-3 w-28">Estimasi (Q-02)</th>
              <th className="py-2.5 px-3 w-32">Tenggat (Q-11)</th>
              <th className="py-2.5 px-3 w-36">Pelaksana (PIC)</th>
              <th className="py-2.5 px-3 w-44">Status & Approval</th>
              <th className="py-2.5 px-3 w-20 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                  <RefreshCw className="size-5 animate-spin mx-auto text-primary mb-2" />
                  Memuat pohon hierarki deliverable proyek...
                </td>
              </tr>
            ) : treeItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary grid place-items-center mx-auto">
                      <Layers className="size-6" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      Belum Ada Modul atau Tugas
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Mulai dengan membuat Modul baru atau muat data simulasi sprint lengkap untuk
                      menguji seluruh skenario.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Button
                        variant="primary"
                        loading={seeding}
                        onClick={seed}
                        className="text-xs"
                      >
                        <Database className="size-3.5 mr-1" />
                        Muat Data Contoh Sprint
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsModuleModalOpen(true)}
                        className="text-xs"
                      >
                        Buat Modul Manual
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              treeItems.map((item, idx) => {
                const nodeId =
                  item.kind === "MODULE"
                    ? item.data.id
                    : item.kind === "FEATURE"
                    ? item.data.id
                    : item.data.id;

                return (
                  <TaskTreeRow
                    key={`${item.kind}-${nodeId}-${idx}`}
                    item={item}
                    isOpen={!collapsedNodes[nodeId]}
                    onToggle={() => toggleNode(nodeId)}
                    onSelectTask={(t) => setActiveTaskDetail(t)}
                    onOpenApproval={(t) => setApprovalTask(t)}
                    onAddFeature={(modId) => {
                      setSelectedModuleForFeature(modId);
                      setIsFeatureModalOpen(true);
                    }}
                    onAddTask={(modId) => {
                      setIsTaskModalOpen(true);
                    }}
                  />
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      <CreateModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
      />

      <CreateFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        defaultModuleId={selectedModuleForFeature}
      />

      <TaskDetailModal
        task={activeTaskDetail}
        isOpen={Boolean(activeTaskDetail)}
        onClose={() => setActiveTaskDetail(null)}
        onOpenApproval={(t) => setApprovalTask(t)}
      />

      <ApprovalModal
        task={approvalTask}
        isOpen={Boolean(approvalTask)}
        onClose={() => setApprovalTask(null)}
      />
    </div>
  );
};

export default TasklistPage;
