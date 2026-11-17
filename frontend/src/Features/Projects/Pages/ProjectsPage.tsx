// src/Features/Projects/Pages/ProjectsPage.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/Contexts/ProjectContext";
import useGetModuleList from "@/Hooks/useGetModuleList";
import useModulesOverview from "@/Features/Modules/Hooks/useModulesOverview";
import CreateModuleModal from "@/Components/Modals/CreateModuleModal";
import CreateFeatureModal from "@/Components/Modals/CreateFeatureModal";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { cn } from "@/Utils/cn";
import { toast } from "sonner";
import {
  FolderKanban,
  ShieldCheck,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Layers,
  ListTodo,
  User,
  Plus,
  ArrowRight,
  ExternalLink,
  Search,
} from "lucide-react";

export const ProjectsPage: React.FC = () => {
  useDocumentTitle(
    "Daftar Proyek",
    "Portofolio Proyek D-1 & Manajemen Deliverable Modul E-4",
  );

  const navigate = useNavigate();
  const {
    projects,
    activeProjectId,
    activeProject,
    isLoadingProjects,
    setActiveProjectId,
  } = useProject();

  const {
    isModuleModalOpen,
    setIsModuleModalOpen,
    isFeatureModalOpen,
    setIsFeatureModalOpen,
    selectedModuleId,
    handleOpenAddFeature,
    handleCloseFeatureModal,
  } = useModulesOverview();

  const { data: rawModules = [], isLoading: isLoadingModules } = useGetModuleList();

  const [activeTab, setActiveTab] = useState<"PROJECTS" | "MODULES">("PROJECTS");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "REGISTERED" | "UNDER_REVIEW">("ALL");

  // Filter projects by search and status
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.canonicalCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Modules belonging to the active project
  const projectModules = useMemo(() => {
    return rawModules.filter((m) => {
      // If module has project_id, match it; otherwise if it's default ERP project, associate it
      if (m.project_id) {
        return m.project_id === activeProjectId;
      }
      return activeProjectId === "PROJ-ERP-01";
    });
  }, [rawModules, activeProjectId]);

  const handleSelectProject = (projectId: string, projectName: string) => {
    setActiveProjectId(projectId);
    toast.success(`Konteks proyek dialihkan ke: ${projectName}`);
  };

  return (
    <div className="space-y-4">
      {/* Page Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <FolderKanban className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Portofolio & Daftar Proyek
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Integrasi Modul D-1 (Project Intake) dan Modul E-3 (Execution Readiness). Pilih proyek aktif untuk mengelola tasklist dan sprint agile.
          </p>
        </div>

        {activeTab === "MODULES" && (
          <Button
            type="button"
            onClick={() => setIsModuleModalOpen(true)}
            className="h-9 px-4 rounded-lg text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>Tambah Modul Baru</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border text-xs font-semibold">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab("PROJECTS")}
          className={cn(
            "pb-2.5 transition-all relative flex items-center gap-2 rounded-none h-auto px-0",
            activeTab === "PROJECTS"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span>Daftar Proyek Tersedia</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-muted text-foreground">
            {projects.length}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab("MODULES")}
          className={cn(
            "pb-2.5 transition-all relative flex items-center gap-2 rounded-none h-auto px-0",
            activeTab === "MODULES"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span>Modul & Deliverable ({activeProject?.projectName || activeProjectId})</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-muted text-foreground">
            {projectModules.length}
          </span>
        </Button>
      </div>

      {/* TAB 1: PROJECTS LIST */}
      {activeTab === "PROJECTS" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="rounded-xl border border-border bg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Cari nama proyek, kode, atau klien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-background"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(["ALL", "REGISTERED", "UNDER_REVIEW"] as const).map((st) => (
                <Button
                  key={st}
                  type="button"
                  variant={statusFilter === st ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium h-auto",
                    statusFilter === st
                      ? "shadow-2xs"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {st === "ALL" && "Semua"}
                  {st === "REGISTERED" && "Registered (Siap)"}
                  {st === "UNDER_REVIEW" && "Under Review"}
                </Button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          {isLoadingProjects ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Memuat daftar proyek dari backend...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-12 rounded-2xl border border-dashed border-border text-center space-y-1">
              <p className="text-xs font-semibold text-foreground">Tidak ada proyek yang sesuai</p>
              <p className="text-[11px] text-muted-foreground">Coba ubah kata kunci pencarian atau filter status.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((proj) => {
                const isActive = proj.projectId === activeProjectId;
                const isRegistered = proj.status === "REGISTERED";

                return (
                  <div
                    key={proj.projectId}
                    className={cn(
                      "rounded-2xl border bg-card p-5 space-y-4 transition-all shadow-2xs flex flex-col justify-between",
                      isActive
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-border hover:border-border/80 hover:shadow-xs",
                    )}
                  >
                    <div className="space-y-3.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md font-bold bg-muted text-foreground border border-border/80">
                          {proj.canonicalCode || proj.projectId}
                        </span>

                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="size-3 text-emerald-600" />
                            REGISTERED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <AlertCircle className="size-3 text-amber-600" />
                            UNDER REVIEW
                          </span>
                        )}
                      </div>

                      {/* Project Title & Client */}
                      <div>
                        <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2" title={proj.projectName}>
                          {proj.projectName}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                          <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{proj.clientName}</span>
                        </p>
                      </div>

                      {/* Metrics 4-Box Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="p-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Layers className="size-3" />
                            Modul
                          </span>
                          <p className="text-xs font-bold text-foreground font-mono">
                            {proj.moduleCount ?? 0} Modul
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <ListTodo className="size-3" />
                            Tugas
                          </span>
                          <p className="text-xs font-bold text-foreground font-mono">
                            {proj.taskCount ?? 0} Task
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <FileCheck2 className="size-3" />
                            Status PO
                          </span>
                          <p className={cn("text-[11px] font-bold", proj.poReceived ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                            {proj.poReceived ? "Diterima" : "Pending PO"}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/40 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Dokumen
                          </span>
                          <p className={cn("text-[11px] font-bold", proj.documentsComplete ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                            {proj.documentsComplete ? "Lengkap" : "Kurang"}
                          </p>
                        </div>
                      </div>

                      {/* AM & PM Info */}
                      <div className="pt-2 border-t border-border/60 text-xs space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="text-[11px] flex items-center gap-1">
                            <User className="size-3" />
                            PM:
                          </span>
                          <span className="text-[11px] font-semibold text-foreground truncate max-w-[160px]">
                            {proj.pmName || "Belum Ditugaskan"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="text-[11px] flex items-center gap-1">
                            <User className="size-3" />
                            AM:
                          </span>
                          <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">
                            {proj.amName || "-"}
                          </span>
                        </div>
                        {proj.startDate && (
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span className="text-[11px] flex items-center gap-1">
                              <Calendar className="size-3" />
                              Periode:
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {proj.startDate} s/d {proj.targetEndDate || "Selesai"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-border/60">
                      {isActive ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            <span>Proyek Aktif Saat Ini</span>
                          </div>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
                            className="text-xs font-semibold text-primary p-0 h-auto gap-1"
                          >
                            <span>Buka Dashboard</span>
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <Button
                            type="button"
                            variant={isRegistered ? "default" : "outline"}
                            onClick={() => handleSelectProject(proj.projectId, proj.projectName)}
                            className={cn(
                              "w-full h-8.5 rounded-lg text-xs font-semibold gap-1.5 shadow-2xs",
                              !isRegistered &&
                                "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100",
                            )}
                          >
                            <span>Pilih & Alihkan ke Proyek Ini</span>
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MODULES & DELIVERABLES OF ACTIVE PROJECT */}
      {activeTab === "MODULES" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3 text-xs shadow-2xs">
            <div>
              <p className="font-bold text-foreground">
                Daftar Modul untuk Proyek: <span className="text-primary">{activeProject?.projectName || activeProjectId}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Modul-modul ini terikat dengan proyek aktif. Penambahan modul baru otomatis terdaftar ke proyek ini.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsModuleModalOpen(true)}
              className="h-8 px-3 rounded-lg text-xs font-semibold gap-1 shadow-xs"
            >
              <Plus className="size-3" />
              <span>Tambah Modul</span>
            </Button>
          </div>

          {isLoadingModules ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Memuat data modul...
            </div>
          ) : projectModules.length === 0 ? (
            <div className="py-12 rounded-2xl border border-dashed border-border bg-card text-center space-y-2">
              <Layers className="size-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground">Belum ada modul pada proyek ini</p>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                Proyek ini belum memiliki modul deliverable. Klik tombol di atas untuk membuat modul pertama.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsModuleModalOpen(true)}
                className="mt-2 h-8 px-4 rounded-lg text-xs font-semibold gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Buat Modul Sekarang</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectModules.map((m) => {
                const featureCount = m.features?.length || 0;
                const taskCount = m.tasks?.length || 0;

                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-border bg-card p-5 space-y-3.5 hover:border-primary/50 transition-all shadow-2xs flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {m.code || "MOD"}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {taskCount} Tugas · {featureCount} Fitur
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1" title={m.name}>
                          {m.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {m.description || "Tidak ada deskripsi modul."}
                        </p>
                      </div>

                      {/* Features list preview */}
                      {featureCount > 0 && (
                        <div className="pt-2 border-t border-border/60">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Fitur-fitur Modul:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.features?.map((f) => (
                              <span
                                key={f.id}
                                className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                              >
                                {f.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => handleOpenAddFeature(m.id)}
                        className="text-primary font-semibold gap-1 p-0 h-auto text-xs"
                      >
                        <Plus className="size-3" />
                        <span>Tambah Fitur</span>
                      </Button>

                      <Button
                        type="button"
                        variant="link"
                        onClick={() => navigate(ROUTE_PATHS.TASKS)}
                        className="text-muted-foreground hover:text-foreground font-medium gap-1 p-0 h-auto text-xs"
                      >
                        <span>Lihat di Tasklist</span>
                        <ExternalLink className="size-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals for Create Module & Feature */}
      <CreateModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
      />

      <CreateFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={handleCloseFeatureModal}
        moduleId={selectedModuleId || ""}
      />
    </div>
  );
};

export default ProjectsPage;
