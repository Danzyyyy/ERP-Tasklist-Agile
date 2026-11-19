// src/Contexts/ProjectContext.tsx
import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProjectService from "@/Services/ProjectService";
import { PROJECT_QUERY_KEYS } from "@/Constants/ProjectConstant";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import { MODULE_QUERY_KEYS } from "@/Constants/ModuleConstant";
import { PROGRESS_QUERY_KEYS } from "@/Constants/ProgressConstant";
import type { ProjectItem, ProjectGuardResponse } from "@/Types/task";

export interface ProjectContextType {
  activeProjectId: string;
  activeProject: ProjectItem | null;
  projects: ProjectItem[];
  isLoadingProjects: boolean;
  guard: ProjectGuardResponse | null;
  isAllowed: boolean;
  setActiveProjectId: (id: string) => void;
  refetchProjects: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = "erp_active_project_id";
const DEFAULT_PROJECT_ID = "PROJ-ERP-01";

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_PROJECT_ID;
  });

  // Fetch all projects for switcher
  const {
    data: projectsData,
    isLoading: isLoadingProjects,
    refetch: refetchProjectsQuery,
  } = useQuery({
    queryKey: PROJECT_QUERY_KEYS.list({ status: "ALL" }),
    queryFn: async () => {
      const res = await ProjectService.getAll({ status: "ALL" });
      return res.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const projects = projectsData || [];

  // Active project object
  const activeProject = useMemo(() => {
    return projects.find((p) => p.projectId === activeProjectId) || null;
  }, [projects, activeProjectId]);

  // Fetch guard for active project
  const { data: guardData } = useQuery({
    queryKey: PROJECT_QUERY_KEYS.guard(activeProjectId),
    queryFn: async () => {
      try {
        const res = await ProjectService.getGuard(activeProjectId);
        return res;
      } catch {
        return {
          status: "error",
          projectId: activeProjectId,
          allowed: true, // fallback to allow UI navigation
          projectStatus: "REGISTERED",
          message: "Fallback guard active",
        } as ProjectGuardResponse;
      }
    },
    enabled: Boolean(activeProjectId),
  });

  const guard = guardData || null;
  const isAllowed = guard ? guard.allowed : true;

  const setActiveProjectId = useCallback(
    (id: string) => {
      setActiveProjectIdState(id);
      localStorage.setItem(STORAGE_KEY, id);
      // Invalidate queries so that dashboard, kanban, modules, and tasks update automatically
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: MODULE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
    },
    [queryClient],
  );

  const refetchProjects = useCallback(async () => {
    await refetchProjectsQuery();
  }, [refetchProjectsQuery]);

  const value = useMemo<ProjectContextType>(
    () => ({
      activeProjectId,
      activeProject,
      projects,
      isLoadingProjects,
      guard,
      isAllowed,
      setActiveProjectId,
      refetchProjects,
    }),
    [
      activeProjectId,
      activeProject,
      projects,
      isLoadingProjects,
      guard,
      isAllowed,
      setActiveProjectId,
      refetchProjects,
    ],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

export default ProjectProvider;
