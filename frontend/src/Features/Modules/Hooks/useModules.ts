// src/Features/Modules/Hooks/useModules.ts
import { useQuery } from "@tanstack/react-query";
import ModuleService from "../Services/ModuleService";
import { MODULE_QUERY_KEYS } from "../Constants/ModuleConstant";
import type { ModuleQueryParams } from "../Types/ModuleType";

export const useModules = (params: ModuleQueryParams = { project_id: "PROJ-ERP-01" }) => {
  return useQuery({
    queryKey: MODULE_QUERY_KEYS.list(params),
    queryFn: async () => {
      const res = await ModuleService.getAll(params);
      return res.data || [];
    },
  });
};

export default useModules;
