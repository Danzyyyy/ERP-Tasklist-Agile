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
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Input } from "@/Components/Elements/Input";
import { Tabs, TabsList, TabsTrigger } from "@/Components/Elements/Tabs";
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
  useDocumentTitle("Daftar Proyek", "Portofolio Proyek & Manajemen Deliverable Anaheim ERP");

  const navigate = useNavigate();
  const { projects, activeProjectId, activeProject, isLoadingProjects, setActiveProjectId } = useProject();

  const {
    isModuleModalOpen,
    setIsModuleModalOpen,
    isFeatureModalOpen,
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

      const matchStatus = statusFilter === "ALL" || p.status === statusFilter;

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
      <Card
        size="md"
        padding="lg"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <FolderKanban className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Portofolio &amp; Daftar Proyek</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar proyek terdaftar dan status kesiapan eksekusi. Pilih proyek aktif untuk mengelola tasklist dan papan agile.
          </p>
        </div>

        {activeTab === "MODULES" && (
          <Button type="button" onClick={() => setIsModuleModalOpen(true)} className="shrink-0">
            <Plus className="size-3.5" />
            <span>Tambah Modul Baru</span>
          </Button>
        )}
      </Card>

      {/* Tabs */}
      <Tabs
        variant="underline"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "PROJECTS" | "MODULES")}
      >
        <TabsList>
          <TabsTrigger value="PROJECTS">
            <span>Daftar Proyek Tersedia</span>
            <Badge variant="default" size="xs" mono>
              {projects.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="MODULES">
            <span>Modul &amp; Deliverable ({activeProject?.projectName || activeProjectId})</span>
            <Badge variant="default" size="xs" mono>
              {projectModules.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* TAB 1: PROJECTS LIST */}
      {activeTab === "PROJECTS" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card
            size="md"
            padding="sm"
            className="flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="w-full sm:w-80">
              <Input
                type="text"
                variant="subtle"
                sizeVariant="sm"
                leftIcon={<Search className="size-3.5" />}
                placeholder="Cari nama proyek, kode, atau klien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(["ALL", "REGISTERED", "UNDER_REVIEW"] as const).map((st) => (
                <Button
                  key={st}
                  type="button"
                  variant={statusFilter === st ? "default" : "muted"}
                  size="xs"
                  onClick={() => setStatusFilter(st)}
                >
                  {st === "ALL" && "Semua"}
                  {st === "REGISTERED" && "Registered (Siap)"}
                  {st === "UNDER_REVIEW" && "Under Review"}
                </Button>
              ))}
            </div>
          </Card>

          {/* Project Cards Grid */}
          {isLoadingProjects ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Memuat daftar proyek dari backend...</div>
          ) : filteredProjects.length === 0 ? (
            <Card size="md" padding="empty" dashed className="space-y-1">
              <p className="text-xs font-semibold text-foreground text-center">Tidak ada proyek yang sesuai</p>
              <p className="text-[11px] text-muted-foreground text-center">Coba ubah kata kunci pencarian atau filter status.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((proj) => {
                const isActive = proj.projectId === activeProjectId;
                const isRegistered = proj.status === "REGISTERED";

                return (
                  <Card
                    key={proj.projectId}
                    size="md"
                    padding="relaxed"
                    selected={isActive}
                    interactive={isActive ? "none" : "subtle"}
                    className="space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="default" size="sm" shape="rounded" mono>
                          {proj.canonicalCode || proj.projectId}
                        </Badge>

                        {isRegistered ? (
                          <Badge variant="success" size="sm">
                            <ShieldCheck className="size-3" />
                            REGISTERED
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            <AlertCircle className="size-3" />
                            UNDER REVIEW
                          </Badge>
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
                        <div className="p-2.5 rounded-xl border border-border/70 bg-muted/30 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Layers className="size-3" />
                            Modul
                          </span>
                          <p className="text-xs font-bold text-foreground font-mono">{proj.moduleCount} Modul</p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-border/70 bg-muted/30 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <ListTodo className="size-3" />
                            Tugas
                          </span>
                          <p className="text-xs font-bold text-foreground font-mono">{proj.taskCount} Task</p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-border/70 bg-muted/30 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <FileCheck2 className="size-3" />
                            Status PO
                          </span>
                          <p className={cn("text-[11px] font-bold", proj.poReceived ? "text-success" : "text-warning")}>
                            {proj.poReceived ? "Diterima" : "Pending PO"}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-border/70 bg-muted/30 space-y-0.5">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Dokumen
                          </span>
                          <p className={cn("text-[11px] font-bold", proj.documentsComplete ? "text-success" : "text-warning")}>
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
                          <span className="text-[11px] font-semibold text-foreground truncate max-w-[160px]">{proj.pmName || "Belum Ditugaskan"}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="text-[11px] flex items-center gap-1">
                            <User className="size-3" />
                            AM:
                          </span>
                          <span className="text-[11px] font-medium text-foreground truncate max-w-[160px]">{proj.amName || "-"}</span>
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
                          <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                            <CheckCircle2 className="size-4 text-success" />
                            <span>Proyek Aktif Saat Ini</span>
                          </div>
                          <Button type="button" variant="link" onClick={() => navigate(ROUTE_PATHS.DASHBOARD)} className="gap-1">
                            <span>Buka Dashboard</span>
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <Button
                            type="button"
                            variant={isRegistered ? "default" : "warningSubtle"}
                            size="sm"
                            onClick={() => handleSelectProject(proj.projectId, proj.projectName)}
                            className="w-full"
                          >
                            <span>Pilih &amp; Alihkan ke Proyek Ini</span>
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MODULES & DELIVERABLES OF ACTIVE PROJECT */}
      {activeTab === "MODULES" && (
        <div className="space-y-4">
          <Card size="md" className="flex items-center justify-between gap-3">
            <div className="text-xs">
              <p className="font-bold text-foreground">
                Daftar Modul untuk Proyek: <span className="text-primary">{activeProject?.projectName || activeProjectId}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Modul-modul ini terikat dengan proyek aktif. Penambahan modul baru otomatis terdaftar ke proyek ini.</p>
            </div>
            <Button type="button" size="sm" onClick={() => setIsModuleModalOpen(true)}>
              <Plus className="size-3" />
              <span>Tambah Modul</span>
            </Button>
          </Card>

          {isLoadingModules ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Memuat data modul...</div>
          ) : projectModules.length === 0 ? (
            <Card size="md" padding="empty" dashed className="flex flex-col items-center space-y-2">
              <Layers className="size-8 text-muted-foreground" />
              <p className="text-xs font-semibold text-foreground text-center">Belum ada modul pada proyek ini</p>
              <p className="text-[11px] text-muted-foreground max-w-sm text-center">Proyek ini belum memiliki modul deliverable. Klik tombol di atas untuk membuat modul pertama.</p>
              <Button type="button" size="sm" onClick={() => setIsModuleModalOpen(true)} className="mt-2">
                <Plus className="size-3.5" />
                <span>Buat Modul Sekarang</span>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectModules.map((m) => {
                const featureCount = m.features?.length || 0;
                const taskCount = m.tasks?.length || 0;

                return (
                  <Card
                    key={m.id}
                    size="md"
                    padding="relaxed"
                    interactive="primary"
                    className="space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="default" size="sm" shape="rounded" mono>
                          {m.code || "MOD"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {taskCount} Tugas · {featureCount} Fitur
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground line-clamp-1" title={m.name}>
                          {m.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description || "Tidak ada deskripsi modul."}</p>
                      </div>

                      {/* Features list preview */}
                      {featureCount > 0 && (
                        <div className="pt-2 border-t border-border/60">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Fitur-fitur Modul:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.features?.map((f) => (
                              <Badge key={f.id} variant="secondary" size="sm" casing="lowercase">
                                {f.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <Button type="button" variant="link" onClick={() => handleOpenAddFeature(m.id)} className="gap-1">
                        <Plus className="size-3" />
                        <span>Tambah Fitur</span>
                      </Button>

                      <Button
                        type="button"
                        variant="linkMuted"
                        onClick={() => navigate(ROUTE_PATHS.TASKS)}
                        className="gap-1"
                      >
                        <span>Lihat di Tasklist</span>
                        <ExternalLink className="size-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals for Create Module & Feature */}
      <CreateModuleModal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} />

      <CreateFeatureModal
        isOpen={isFeatureModalOpen}
        onClose={handleCloseFeatureModal}
        moduleId={selectedModuleId}
      />
    </div>
  );
};

export default ProjectsPage;
