// src/Features/Kanban/Types/KanbanType.ts
import type { Task, TaskStatus } from "@/Types/task";

export interface KanbanColumnDef {
  id: TaskStatus;
  title: string;
  step: number;
  description: string;
  tone: string;
}

export interface KanbanMovePayload {
  task: Task;
  targetStatus: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
}
