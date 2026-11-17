// src/Features/Kanban/Hooks/useKanbanBoard.ts
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import { useUpdateTaskStatus } from "@/Hooks/useUpdateTaskStatus";
import useAssignTask from "@/Features/Tasks/Hooks/useAssignTask";
import useGetModuleList from "@/Hooks/useGetModuleList";
import { useFilterParams } from "@/Hooks/useFilterParams";
import { useAuth } from "@/Hooks/useAuth";
import {
  canCreateTaskRole,
  canRoleDragKanbanCard,
  canRolePerformKanbanTransition,
  canTransitionKanbanStatus,
  getTransitionRejectionReason,
} from "@/Utils/taskUtils";
import type { ReviewResult, ReviewType, Task, TaskStatus } from "@/Types/task";

export interface KanbanAssigneeModalState {
  task: Task;
  mode: "TRANSITION" | "ASSIGN_ONLY";
}

export interface KanbanReviewModalState {
  task: Task;
  initialReviewType?: ReviewType;
  initialResult?: ReviewResult;
}

export function useKanbanBoard() {
  const { role } = useAuth();
  const { data: tasks = [], isLoading, refetch } = useGetTaskList();
  const { data: modules = [] } = useGetModuleList();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTaskStatus();
  const { mutate: assignTask } = useAssignTask();

  const { filters, setFilter } = useFilterParams<{
    module_id: string;
    assignee_id: string;
    search: string;
  }>();

  // Drag & Modals state
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [assigneeModalState, setAssigneeModalState] = useState<KanbanAssigneeModalState | null>(
    null,
  );
  const [reviewModalState, setReviewModalState] = useState<KanbanReviewModalState | null>(null);
  const [signOffTask, setSignOffTask] = useState<Task | null>(null);

  const canCreateTask = canCreateTaskRole(role);

  // Filter tasks for board
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Hide DRAFT from Kanban board (FTR-K04-03: must be RELEASED first)
      if (t.status === "DRAFT") return false;

      if (filters.module_id && filters.module_id !== "ALL" && t.module_id !== filters.module_id) {
        return false;
      }
      if (
        filters.assignee_id &&
        filters.assignee_id !== "ALL" &&
        t.assignee_id !== filters.assignee_id
      ) {
        return false;
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.task_code.toLowerCase().includes(query) ||
          (t.assignee_name && t.assignee_name.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [tasks, filters]);

  const handleDragStartTask = (task: Task) => {
    if (!canRoleDragKanbanCard(role, task.status)) return;
    setDraggedTask(task);
  };

  const handleDragEndTask = () => {
    setDraggedTask(null);
  };

  const openReviewModal = (
    task: Task,
    initialReviewType?: ReviewType,
    initialResult?: ReviewResult,
  ) => {
    setReviewModalState({ task, initialReviewType, initialResult });
  };

  const openAssignModal = (task: Task) => {
    if (task.status === "DONE") {
      toast.error("Tugas yang telah berstatus DONE tidak dapat diubah pelaksananya (PIC).");
      return;
    }
    if (task.status === "DRAFT") {
      toast.error("Tugas berstatus DRAFT belum dapat ditugaskan ke pengembang sebelum disetujui rilis.");
      return;
    }
    if (role === "TESTER") {
      toast.error("Akses ditolak. Peran Tester tidak berwenang menugaskan pengembang pada tugas.");
      return;
    }
    setAssigneeModalState({ task, mode: "ASSIGN_ONLY" });
  };

  // Handle stage transitions with strict Finite State Machine + RBAC guard
  const handleTransition = (task: Task, targetStatus: TaskStatus) => {
    if (task.status === targetStatus) return;

    if (
      !canTransitionKanbanStatus(task.status, targetStatus) ||
      !canRolePerformKanbanTransition(role, task.status, targetStatus)
    ) {
      toast.error(getTransitionRejectionReason(task.status, targetStatus, role));
      return;
    }

    // REQ-03: Code Review -> Testing MUST go through ReviewModal (PASSED) for audit trail
    if (task.status === "CODE_REVIEW" && targetStatus === "TESTING") {
      openReviewModal(task, "CODE_REVIEW", "PASSED");
      return;
    }

    // REQ-03: Backward move from Code Review or Testing -> Development MUST trigger Rework ReviewModal (REJECTED)
    if (
      (task.status === "CODE_REVIEW" || task.status === "TESTING") &&
      targetStatus === "DEVELOPMENT"
    ) {
      openReviewModal(
        task,
        task.status === "TESTING" ? "TESTING" : "CODE_REVIEW",
        "REJECTED",
      );
      return;
    }

    // REQ-04: Moving RELEASED -> DEVELOPMENT requires an assignee
    if (targetStatus === "DEVELOPMENT" && !task.assignee_id) {
      setAssigneeModalState({ task, mode: "TRANSITION" });
      return;
    }

    // REQ-05: Two-Gate DoD: Moving TESTING -> DONE requires PM verify + TL signoff modal
    if (targetStatus === "DONE") {
      setSignOffTask(task);
      return;
    }

    // Remaining valid direct transition (e.g., RELEASED with assignee -> DEVELOPMENT, DEVELOPMENT -> CODE_REVIEW)
    updateStatus({
      taskId: task.id,
      status: targetStatus,
      assigneeId: task.assignee_id,
      assigneeName: task.assignee_name,
    });
  };

  const handleAssigneeConfirm = (assigneeId: string, assigneeName: string) => {
    if (!assigneeModalState) return;
    const { task, mode } = assigneeModalState;

    if (mode === "ASSIGN_ONLY") {
      assignTask({
        taskId: task.id,
        assigneeId,
        assigneeName,
      });
    } else {
      updateStatus({
        taskId: task.id,
        status: "DEVELOPMENT",
        assigneeId,
        assigneeName,
      });
    }
    setAssigneeModalState(null);
  };

  const handleDropTask = (taskId: string, targetStatus: TaskStatus) => {
    setDraggedTask(null);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status === targetStatus) return;
    handleTransition(task, targetStatus);
  };

  // Group tasks by column status
  const columnTasksMap = useMemo(() => {
    const map: Record<string, Task[]> = {
      RELEASED: [],
      DEVELOPMENT: [],
      CODE_REVIEW: [],
      TESTING: [],
      DONE: [],
    };
    filteredTasks.forEach((t) => {
      if (map[t.status]) {
        map[t.status].push(t);
      }
    });
    return map;
  }, [filteredTasks]);

  // Sprint execution metrics
  const sprintMetrics = useMemo(() => {
    const now = Date.now();
    let inProgressCount = 0;
    let doneCount = 0;
    let overdueCount = 0;

    filteredTasks.forEach((t) => {
      if (t.status === "DEVELOPMENT" || t.status === "CODE_REVIEW") {
        inProgressCount++;
      } else if (t.status === "DONE") {
        doneCount++;
      }
      if (t.target_deadline && t.status !== "DONE" && new Date(t.target_deadline).getTime() < now) {
        overdueCount++;
      }
    });

    return {
      totalTasksCount: filteredTasks.length,
      inProgressCount,
      doneCount,
      overdueCount,
    };
  }, [filteredTasks]);

  return {
    userRole: role,
    tasks,
    modules,
    filteredTasks,
    columnTasksMap,
    sprintMetrics,
    filters,
    setFilter,
    isLoading,
    isUpdatingStatus,
    canCreateTask,
    refetch,
    // Drag & Transitions
    draggedTask,
    handleDragStartTask,
    handleDragEndTask,
    handleTransition,
    handleDropTask,
    handleAssigneeConfirm,
    openAssignModal,
    openReviewModal,
    // Modals
    selectedTask,
    setSelectedTask,
    isTaskModalOpen,
    setIsTaskModalOpen,
    assigneeModalState,
    setAssigneeModalState,
    reviewModalState,
    setReviewModalState,
    signOffTask,
    setSignOffTask,
  };
}

export default useKanbanBoard;
