// src/Features/Approvals/Hooks/useApprovals.ts
import { useQuery } from "@tanstack/react-query";
import ApprovalService from "../Services/ApprovalService";
import { APPROVAL_QUERY_KEYS } from "../Constants/ApprovalConstant";

export const useApprovals = (taskId?: string) => {
  return useQuery({
    queryKey: APPROVAL_QUERY_KEYS.byTask(taskId || ""),
    queryFn: async () => {
      if (!taskId) return null;
      const res = await ApprovalService.getByTaskId(taskId);
      return res.data;
    },
    enabled: Boolean(taskId),
  });
};

export default useApprovals;
