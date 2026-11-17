// src/Components/Layouts/ProjectSwitcherDropdown.tsx
import React, { memo } from "react";
import { useProject } from "@/Contexts/ProjectContext";
import { Button } from "@/Components/Elements/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/Components/Elements/DropdownMenu";
import { ChevronDown, Check, FolderKanban, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/Utils/cn";

export const ProjectSwitcherDropdown = memo(() => {
  const { activeProjectId, activeProject, projects, isLoadingProjects, setActiveProjectId } =
    useProject();

  const displayName = activeProject
    ? activeProject.projectName
    : activeProjectId || "Pilih Proyek";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="hidden lg:flex items-center justify-between gap-2 h-[34px] max-w-[240px] px-3 rounded-lg text-xs font-semibold shadow-2xs group"
          aria-label="Ganti Proyek Aktif"
        >
          <div className="flex items-center gap-1.5 truncate">
            <FolderKanban className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{displayName}</span>
          </div>
          <ChevronDown className="size-3 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-80 rounded-xl border border-border bg-card shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95"
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Proyek Tersedia</span>
          <span className="text-[10px] font-mono lowercase font-normal">
            {projects.length} proyek
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        {isLoadingProjects ? (
          <div className="py-4 text-center text-xs text-muted-foreground">Memuat proyek...</div>
        ) : projects.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">Tidak ada proyek</div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-1">
            {projects.map((proj) => {
              const isSelected = proj.projectId === activeProjectId;
              const isRegistered = proj.status === "REGISTERED";

              return (
                <DropdownMenuItem
                  key={proj.projectId}
                  onClick={() => setActiveProjectId(proj.projectId)}
                  className={cn(
                    "flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs select-none",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {proj.canonicalCode || proj.projectId}
                      </span>
                      {isRegistered ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-success-subtle text-success-subtle-foreground border border-success-subtle-border">
                          <ShieldCheck className="size-2.5" />
                          Reg
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border">
                          <AlertCircle className="size-2.5" />
                          Review
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground truncate mt-0.5">
                      {proj.projectName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {proj.clientName} · {proj.moduleCount} Modul · {proj.taskCount} Task
                    </p>
                  </div>

                  {isSelected && <Check className="size-4 text-primary shrink-0 mt-1" />}
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ProjectSwitcherDropdown.displayName = "ProjectSwitcherDropdown";
export default ProjectSwitcherDropdown;
