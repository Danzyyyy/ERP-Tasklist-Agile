// src/Hooks/useGetModuleList.ts
import { useQuery } from "@tanstack/react-query";
import ModuleService from "@/Services/ModuleService";
import { MODULE_QUERY_KEYS } from "@/Constants/ModuleConstant";
import { useProject } from "@/Contexts/ProjectContext";
import type { ModuleQueryParams } from "@/Types/task";

export const useGetModuleList = (params?: ModuleQueryParams) => {
  const { activeProjectId } = useProject();
  const effectiveProjectId = params?.project_id || activeProjectId || "PROJ-ERP-01";
  const effectiveParams: ModuleQueryParams = { ...params, project_id: effectiveProjectId };

  return useQuery({
    queryKey: MODULE_QUERY_KEYS.list(effectiveParams),
    queryFn: async () => {
      const res = await ModuleService.getAll(effectiveParams);
      return res.data || [];
    },
  });
};

export default useGetModuleList;

