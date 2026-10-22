// src/Features/Modules/Pages/ModulesPage.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useModules from "../Hooks/useModules";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import CreateModuleModal from "../Components/CreateModuleModal";
import CreateFeatureModal from "../Components/CreateFeatureModal";
import { Card } from "@/Components/Elements/Card";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { formatManHours } from "@/Utils/formatters";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import {
  FolderKanban,
  FolderTree,
  Plus,
  Layers,
  FileCode2,
  ListTodo,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";

export const ModulesPage: React.FC = () => {
  useDocumentTitle(
    "Struktur Proyek & Modul",
    "Manajemen hierarki 3 tingkat Modul, Fitur, dan Tugas Proyek PT. Anaheim Nimbus Universal sesuai SOP-05.",
  );
  const navigate = useNavigate();
  const { role } = useAuth();
  const { data: modules = [], isLoading: isModulesLoading } = useModules();
  const { data: tasks = [] } = useTasks();

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>(undefined);

  const canManage = role === "TECHNICAL_LEAD" || role === "PROJECT_MANAGER";

  // Calculate project summary metrics
  const projectMetrics = useMemo(() => {
    const totalModules = modules.length;
    const totalFeatures = modules.reduce((acc, m) => acc + (m.features?.length || 0), 0);
    const totalTasks = tasks.length;
    const totalManHours = tasks.reduce(
      (acc, t) => acc + (Number(t.estimated_man_hours) || 0),
      0,
    );

    return {
      totalModules,
      totalFeatures,
      totalTasks,
      totalManHours,
    };
  }, [modules, tasks]);

  const handleOpenAddFeature = (moduleId?: string) => {
    setSelectedModuleId(moduleId);
    setIsFeatureModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            STRUKTUR PROYEK & HIERARKI KERJA / FTR-K04-01
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <FolderKanban className="size-6 text-blue-600" />
            <span>Manajemen Modul & Fitur Proyek</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hierarki terstruktur sesuai SOP-05: Proyek &rarr; Modul Proyek &rarr; Fitur (Opsional / Q-13) &rarr; Tugas Sprint.
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleOpenAddFeature()}
              className="text-xs h-9"
              disabled={modules.length === 0}
            >
              <Plus className="size-3.5 mr-1 text-indigo-600" />
              <span>Tambah Fitur</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => setIsModuleModalOpen(true)}
              className="text-xs h-9"
            >
              <Plus className="size-3.5 mr-1" />
              <span>Tambah Modul</span>
            </Button>
          </div>
        )}
      </div>

      {/* Project Overview Card */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono font-semibold">
              <span>PROYEK ID: PROJ-ERP-01</span>
              <span>·</span>
              <span>KELOMPOK 4 / KELAS E</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-1">
              PT. Anaheim Nimbus Universal — Modul E-4
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sistem Tasklist dan Eksekusi Agile, Dual-Approval Task Release Gate, serta Pelacakan Progres Man-Hour Riil.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 py-1">
              <span className="block text-lg font-black font-mono text-white">
                {projectMetrics.totalModules}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Modul</span>
            </div>

            <div className="text-center px-3 py-1 border-l border-white/10">
              <span className="block text-lg font-black font-mono text-indigo-400">
                {projectMetrics.totalFeatures}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Fitur</span>
            </div>

            <div className="text-center px-3 py-1 border-l border-white/10">
              <span className="block text-lg font-black font-mono text-emerald-400">
                {projectMetrics.totalTasks}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tugas</span>
            </div>

            <div className="text-center px-3 py-1 border-l border-white/10">
              <span className="block text-lg font-black font-mono text-amber-400">
                {formatManHours(projectMetrics.totalManHours)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Man-Hour</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Modules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="size-4 text-blue-600" />
            <span>Daftar Modul & Fitur Terdaftar</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            {modules.length} Modul Terkonfigurasi
          </span>
        </div>

        {modules.length === 0 ? (
          <Card className="p-8 text-center bg-white border-dashed border-2 border-slate-200">
            <FolderTree className="size-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">Belum Ada Modul Proyek</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Modul merupakan tingkat teratas pengelompokan deliverable dalam SOP-05. Silakan tambahkan modul pertama untuk mulai mendaftarkan fitur dan tugas.
            </p>
            {canManage && (
              <Button
                variant="primary"
                onClick={() => setIsModuleModalOpen(true)}
                className="mt-4 text-xs"
              >
                <Plus className="size-3.5 mr-1" />
                Tambah Modul Pertama
              </Button>
            )}
          </Card>
        ) : (
          modules.map((mod) => {
            const moduleTasks = tasks.filter((t) => t.module_id === mod.id);
            const moduleHours = moduleTasks.reduce(
              (acc, t) => acc + (Number(t.estimated_man_hours) || 0),
              0,
            );
            const features = mod.features || [];

            return (
              <Card key={mod.id} className="p-5 border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all">
                {/* Module Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {mod.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {mod.name}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        {features.length} Fitur
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {moduleTasks.length} Tugas ({formatManHours(moduleHours)})
                      </Badge>
                    </div>

                    {mod.description && (
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {mod.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canManage && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenAddFeature(mod.id)}
                        className="text-xs h-8"
                      >
                        <Plus className="size-3 mr-1 text-blue-600" />
                        Tambah Fitur
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`${ROUTE_PATHS.TASKS}?module_id=${mod.id}`)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <span>Lihat Tugas</span>
                      <ArrowRight className="size-3 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Features Sub-List */}
                <div className="pt-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Fitur di dalam Modul Ini (SOP-05 / WI-04)</span>
                    <span className="font-normal lowercase text-slate-400">
                      Level fitur bersifat opsional (Q-13)
                    </span>
                  </div>

                  {features.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="size-4 text-slate-400 shrink-0" />
                        <span>
                          Modul ini belum memiliki fitur terdaftar. Tugas dapat langsung bernaung di bawah modul.
                        </span>
                      </div>
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => handleOpenAddFeature(mod.id)}
                          className="text-xs font-semibold text-blue-600 hover:underline shrink-0"
                        >
                          + Tambah Fitur
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features.map((ftr) => {
                        const ftrTasks = tasks.filter((t) => t.feature_id === ftr.id);
                        const ftrHours = ftrTasks.reduce(
                          (acc, t) => acc + (Number(t.estimated_man_hours) || 0),
                          0,
                        );

                        return (
                          <div
                            key={ftr.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-200 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 truncate">
                                  {ftr.code}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {ftrTasks.length} Tugas · {formatManHours(ftrHours)}
                                </span>
                              </div>

                              <h5 className="font-bold text-xs text-slate-900 mt-2 leading-snug">
                                {ftr.name}
                              </h5>

                              {ftr.description && (
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {ftr.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {ftr.id.slice(0, 8)}...
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `${ROUTE_PATHS.TASKS}?module_id=${mod.id}&feature_id=${ftr.id}`,
                                  )
                                }
                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Filter Tasklist</span>
                                <ArrowRight className="size-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreateModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
      />

      <CreateFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={() => {
          setIsFeatureModalOpen(false);
          setSelectedModuleId(undefined);
        }}
        defaultModuleId={selectedModuleId}
      />
    </div>
  );
};

export default ModulesPage;
