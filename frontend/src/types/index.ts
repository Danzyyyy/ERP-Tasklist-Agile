import { ReactNode } from "react";

export type IconName =
  | "dashboard"
  | "folder"
  | "task"
  | "board"
  | "review"
  | "report"
  | "bell"
  | "chevron"
  | "search"
  | "plus"
  | "clock"
  | "calendar"
  | "users"
  | "more"
  | "check"
  | "x"
  | "shield"
  | "sparkle"
  | "arrow"
  | "grip";

export type View = "dashboard" | "projects" | "tasklist" | "kanban" | "reviews" | "reports";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export interface NavItem {
  label: string;
  icon: IconName;
  view: View;
}

export interface TreeRow {
  id: string;
  depth: number;
  kind: "Modul" | "Fitur" | "Tugas" | string;
  title: string;
  meta?: string;
  code?: string;
  weight: string;
  hours: string;
  due: string;
  pic: string;
  status: string;
  approval: string;
}

export interface Task {
  id: string;
  title: string;
  weight: "LOW" | "MEDIUM" | "HIGH" | string;
  pic: string;
  role: string;
  hours: number;
  rework?: boolean;
  stage: string;
}

export interface Stage {
  id: string;
  label: string;
  tone: string;
}

export interface RoleInfo {
  name: string;
  short: string;
  desc: string;
}

export interface KPIItem {
  label: string;
  value: string;
  suffix?: string;
  detail: string;
  icon: IconName;
  tone: string;
  trend: string;
}

export interface AuditItem {
  initials: string;
  text: ReactNode;
  time: string;
  tone: string;
}

export interface DeliverableItem {
  id: string;
  title: string;
  modules: string;
  hours: string;
  due: string;
  progress: number;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  id: string;
  tone: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  stage: string;
  tone: string;
  owner: string;
  reviewer: string;
  age: string;
  priority: string;
}
