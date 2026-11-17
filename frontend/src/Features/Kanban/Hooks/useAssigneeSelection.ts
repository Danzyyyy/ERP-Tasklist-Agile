// src/Features/Kanban/Hooks/useAssigneeSelection.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/Hooks/useAuth";
import { DEMO_DEVELOPERS } from "../Constants/KanbanConstant";
import type { Task } from "@/Types/task";

function getDefaultAssigneeId(task?: Task | null, userId?: string, userRole?: string | null): string {
  if (task?.assignee_id && DEMO_DEVELOPERS.some((d) => d.id === task.assignee_id)) {
    return task.assignee_id;
  }
  if (userRole === "DEVELOPER" && userId && DEMO_DEVELOPERS.some((d) => d.id === userId)) {
    return userId;
  }
  return DEMO_DEVELOPERS[0].id;
}

export function useAssigneeSelection(
  onConfirm: (assigneeId: string, assigneeName: string) => void,
  onClose: () => void,
  task?: Task | null,
  isOpen?: boolean,
) {
  const { user, role } = useAuth();
  const isDeveloper = role === "DEVELOPER";

  // Filter developers based on role guard: Developer can only assign themselves
  const availableDevelopers = isDeveloper && user?.id
    ? DEMO_DEVELOPERS.filter((d) => d.id === user.id)
    : DEMO_DEVELOPERS;

  const [selectedId, setSelectedId] = useState<string>(() =>
    getDefaultAssigneeId(task, user?.id, role),
  );

  useEffect(() => {
    if (isOpen) {
      if (isDeveloper && user?.id) {
        setSelectedId(user.id);
      } else {
        setSelectedId(getDefaultAssigneeId(task, user?.id, role));
      }
    }
  }, [isOpen, task, user?.id, role, isDeveloper]);

  const handleConfirm = () => {
    const dev = availableDevelopers.find((d) => d.id === selectedId) || availableDevelopers[0];
    if (dev) {
      onConfirm(dev.id, dev.name);
    }
    onClose();
  };

  return {
    selectedId,
    setSelectedId,
    developers: availableDevelopers,
    isDeveloperSelfAssign: isDeveloper,
    handleConfirm,
  };
}

export default useAssigneeSelection;

