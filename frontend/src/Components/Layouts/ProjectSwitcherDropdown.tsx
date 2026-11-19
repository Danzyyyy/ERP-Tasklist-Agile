// src/Components/Layouts/ProjectSwitcherDropdown.tsx
import React, { memo } from "react";
import { useProject } from "@/Contexts/ProjectContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/Components/Elements/DropdownMenu";
import { Badge } from "@/Components/Elements/Badge";
import { ChevronDown, Check, FolderKanban, ShieldCheck, AlertCircle } from "lucide-react";

export const ProjectSwitcherDropdown = memo(() => {
  const { activeProjectId, activeProject, projects, isLoadingProjects, setActiveProjectId } =
    useProject();

  const displayName = activeProject
    ? activeProject.projectName
    : activeProjectId || "Pilih Proyek";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        variant="outline"
        className="hidden lg:flex max-w-[240px] justify-between gap-2"
        aria-label="Ganti Proyek Aktif"
      >
        <div className="flex items-center gap-1.5 truncate">
          <FolderKanban className="size-3.5 text-primary shrink-0" />
          <span className="truncate">{displayName}</span>
        </div>
        <ChevronDown className="size-3 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80 space-y-1">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Proyek Tersedia</span>
          <span className="text-[10px] font-mono lowercase font-normal">
            {projects.length} proyek
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

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
                  selected={isSelected}
                  comfortable
                  onClick={() => setActiveProjectId(proj.projectId)}
                  className="items-start justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {proj.canonicalCode || proj.projectId}
                      </span>
                      {isRegistered ? (
                        <Badge variant="success" size="xs" shape="rounded" casing="normal" mono>
                          <ShieldCheck className="size-2.5" />
                          Reg
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="xs" shape="rounded" casing="normal" mono>
                          <AlertCircle className="size-2.5" />
                          Review
                        </Badge>
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
