// src/Hooks/useSignOffForm.ts
import { useAuth } from "@/Hooks/useAuth";
import usePmVerify from "@/Hooks/usePmVerify";
import useTlSignoff from "@/Hooks/useTlSignoff";
import useGetTaskDetail from "@/Hooks/useGetTaskDetail";
import type { Task } from "@/Types/task";

export function useSignOffForm(task: Task | null, onClose: () => void, isOpen = true) {
  const { role } = useAuth();
  const { data: freshTask } = useGetTaskDetail(task?.id, Boolean(task?.id && isOpen));
  const activeTask = freshTask ?? task;

  const { mutate: pmVerify, isPending: isPmPending } = usePmVerify(activeTask?.id, () => {
    // Keep modal open so TL can immediately see Gate 1 pass and sign off if in demo
  });

  const { mutate: tlSignoff, isPending: isTlPending } = useTlSignoff(activeTask?.id, () => {
    onClose();
  });

  const isPm = role === "PROJECT_MANAGER";
  const isTl = role === "TECHNICAL_LEAD";

  const isPmVerified = Boolean(activeTask?.is_pm_verified);
  const isTlSigned = Boolean(activeTask?.is_tl_signed);

  const handlePmVerify = () => {
    if (!task) return;
    pmVerify();
  };

  const handleTlSignoff = () => {
    if (!task) return;
    tlSignoff();
  };

  return {
    activeTask,
    isPm,
    isTl,
    isPmVerified,
    isTlSigned,
    handlePmVerify,
    handleTlSignoff,
    isPmPending,
    isTlPending,
    isPending: isPmPending || isTlPending,
  };
}

export default useSignOffForm;
