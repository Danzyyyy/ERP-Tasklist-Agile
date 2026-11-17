// src/Hooks/useExecutionReadiness.ts
import { useQuery } from "@tanstack/react-query";
import ProjectService from "@/Services/ProjectService";
import { PROJECT_QUERY_KEYS } from "@/Constants/ProjectConstant";
import { useProject } from "@/Contexts/ProjectContext";
import type { ExecutionReadiness } from "@/Types/task";

const DEFAULT_READINESS: ExecutionReadiness = {
  projectId: "PROJ-ERP-01",
  status: "COMPLETED",
  readyForExecution: true,
};

export const useExecutionReadiness = (projectId?: string) => {
  const { activeProjectId } = useProject();
  const effectiveProjectId = projectId || activeProjectId || "PROJ-ERP-01";

  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.readiness(effectiveProjectId),
    queryFn: async (): Promise<ExecutionReadiness> => {
      try {
        const res = await ProjectService.getExecutionReadiness(effectiveProjectId);
        return res.data || DEFAULT_READINESS;
      } catch {
        return DEFAULT_READINESS;
      }
    },
    enabled: Boolean(effectiveProjectId),
  });
};

export default useExecutionReadiness;
