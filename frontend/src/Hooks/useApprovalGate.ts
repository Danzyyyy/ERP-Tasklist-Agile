// src/Hooks/useApprovalGate.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/Hooks/useAuth";
import useGetApprovalList from "@/Hooks/useGetApprovalList";
import useSubmitApproval from "@/Hooks/useSubmitApproval";
import {
  SubmitApprovalSchema,
  type SubmitApprovalInput,
  type SubmitApprovalOutput,
} from "@/Schemas/ApprovalSchema";
import type { Task } from "@/Types/task";

export function useApprovalGate(task: Task | null, onClose: () => void) {
  const { role, user } = useAuth();

  const form = useForm<SubmitApprovalInput, unknown, SubmitApprovalOutput>({
    resolver: zodResolver(SubmitApprovalSchema),
    defaultValues: {
      status: "APPROVED",
      notes: "",
    },
  });

  const { data: approvalsData } = useGetApprovalList(task?.id);
  const { mutateAsync: submitApproval, isPending } = useSubmitApproval(task?.id, () => {
    form.reset({
      status: "APPROVED",
      notes: "",
    });
    onClose();
  });

  const approvalsList = approvalsData?.approvals || task?.approvals || [];
  const tlApproval = approvalsList.find((a) => a.role === "TECHNICAL_LEAD");
  const pmApproval = approvalsList.find((a) => a.role === "PROJECT_MANAGER");

  const isTl = role === "TECHNICAL_LEAD";
  const isPm = role === "PROJECT_MANAGER";
  const canApprove = isTl || isPm;

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (!task) return;
    form.setValue("status", status);
    const isValid = await form.trigger();
    if (!isValid) return;

    const rawNotes = form.getValues("notes") || "";
    await submitApproval({
      status,
      notes:
        rawNotes.trim() ||
        (status === "APPROVED"
          ? `Disetujui oleh ${user?.name || role} sesuai SOP-07.`
          : `Ditolak oleh ${user?.name || role}. Perlu penyesuaian estimasi/skup.`),
    });
  };

  return {
    form,
    register: form.register,
    errors: form.formState.errors,
    tlApproval,
    pmApproval,
    isTl,
    isPm,
    role,
    canApprove,
    handleDecision,
    isPending,
  };
}

export default useApprovalGate;

