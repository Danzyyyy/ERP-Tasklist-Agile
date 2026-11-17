// src/Features/Dashboard/Hooks/useDashboardMetrics.ts
import { useMemo } from "react";
import type { Task, ComplexityWeight, TaskStatus } from "@/Types/task";

export interface TeamMemberWorkload {
  id: string;
  name: string;
  role: string;
  tone: "indigo" | "emerald" | "purple" | "blue" | "amber";
  activeTasks: number;
}

export interface ActivityEvent {
  id: string;
  title: string;
  subtitle: string;
  tone: "success" | "warning" | "purple" | "primary";
}

export interface PriorityTaskItem extends Task {
  isOverdue: boolean;
}

export function useDashboardMetrics(tasks: Task[], progressPercentage = 0) {
  // 1. Active Tasks
  const activeTasks = useMemo(() => tasks.filter((t) => t.status !== "DONE"), [tasks]);
  const activeTasksCount = activeTasks.length;

  // 2. Priority Tasks (Overdue > Complexity > Status priority > Earliest deadline)
  const priorityTasks = useMemo<PriorityTaskItem[]>(() => {
    const pool = activeTasks.length > 0 ? activeTasks : tasks;
    const now = Date.now();
    return [...pool]
      .sort((a, b) => {
        const aDeadline = a.target_deadline ? new Date(a.target_deadline).getTime() : Infinity;
        const bDeadline = b.target_deadline ? new Date(b.target_deadline).getTime() : Infinity;

        // 1. Overdue tasks first
        const aOverdue = aDeadline < now && a.status !== "DONE";
        const bOverdue = bDeadline < now && b.status !== "DONE";
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;

        // 2. Complexity weight: HIGH (3) > MEDIUM (2) > LOW (1)
        const weightScore: Record<ComplexityWeight, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const aWeight = weightScore[a.complexity_weight] || 1;
        const bWeight = weightScore[b.complexity_weight] || 1;
        if (bWeight !== aWeight) return bWeight - aWeight;

        // 3. Status priority: DEVELOPMENT > CODE_REVIEW > TESTING > RELEASED > DRAFT
        const statusScore: Record<TaskStatus, number> = {
          DEVELOPMENT: 5,
          CODE_REVIEW: 4,
          TESTING: 3,
          RELEASED: 2,
          DRAFT: 1,
          DONE: 0,
        };
        const aStatus = statusScore[a.status] ?? 0;
        const bStatus = statusScore[b.status] ?? 0;
        if (bStatus !== aStatus) return bStatus - aStatus;

        // 4. Earliest deadline
        return aDeadline - bDeadline;
      })
      .slice(0, 3)
      .map((t) => {
        const deadline = t.target_deadline ? new Date(t.target_deadline).getTime() : Infinity;
        return {
          ...t,
          isOverdue: deadline < now && t.status !== "DONE",
        };
      });
  }, [activeTasks, tasks]);

  // 3. Stage counts
  const stageStats = useMemo(() => {
    const counts: Record<TaskStatus, number> = {
      DRAFT: 0,
      RELEASED: 0,
      DEVELOPMENT: 0,
      CODE_REVIEW: 0,
      TESTING: 0,
      DONE: 0,
    };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }, [tasks]);

  // 4. Complexity man-hours breakdown
  const complexityBreakdown = useMemo(() => {
    return tasks.reduce(
      (acc, t) => {
        const h = Number(t.estimated_man_hours) || 0;
        if (t.complexity_weight === "HIGH") acc.high += h;
        else if (t.complexity_weight === "MEDIUM") acc.medium += h;
        else acc.low += h;
        return acc;
      },
      { low: 0, medium: 0, high: 0 },
    );
  }, [tasks]);

  // 5. At-Risk and Critical Countdown Tasks
  const atRiskTasks = useMemo(() => {
    const now = Date.now();
    return tasks
      .filter((t) => t.status !== "DONE")
      .map((t) => {
        const deadline = t.target_deadline ? new Date(t.target_deadline).getTime() : Infinity;
        const isOverdue = deadline < now;
        const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return {
          ...t,
          isOverdue,
          daysRemaining,
        };
      })
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.daysRemaining - b.daysRemaining;
      })
      .slice(0, 4);
  }, [tasks]);

  // 6. Dynamic Team Workload
  const teamWorkload = useMemo<TeamMemberWorkload[]>(() => {
    const members: TeamMemberWorkload[] = [
      { id: "TW", name: "Wildan", role: "PM", tone: "indigo", activeTasks: 0 },
      { id: "FZ", name: "Fauzan", role: "TL", tone: "emerald", activeTasks: 0 },
      { id: "AR", name: "Ariel", role: "Dev", tone: "purple", activeTasks: 0 },
      { id: "FJ", name: "Fajri", role: "Dev", tone: "blue", activeTasks: 0 },
      { id: "VD", name: "Valdric", role: "QA", tone: "amber", activeTasks: 0 },
    ];

    tasks.forEach((t) => {
      if (t.status === "DONE") return;
      const pic = (t.assignee_name || "").toLowerCase();
      if (pic.includes("ariel")) members[2].activeTasks++;
      else if (pic.includes("fajri")) members[3].activeTasks++;
      else if (t.status === "TESTING") members[4].activeTasks++;
      else if (t.status === "CODE_REVIEW") members[1].activeTasks++;
      else if (t.status === "DRAFT") members[0].activeTasks++;
    });

    return members;
  }, [tasks]);

  // 7. Dynamic Activities
  const dynamicActivities = useMemo<ActivityEvent[]>(() => {
    const list: ActivityEvent[] = [];

    const doneTasks = tasks.filter((t) => t.status === "DONE");
    doneTasks.slice(0, 2).forEach((t) => {
      list.push({
        id: `done-${t.id}`,
        title: `${t.title} disahkan`,
        subtitle: `${t.tl_signed_by || "Fauzan (TL)"} · Selesai`,
        tone: "success",
      });
    });

    const testingTasks = tasks.filter((t) => t.status === "TESTING");
    testingTasks.slice(0, 2).forEach((t) => {
      list.push({
        id: `test-${t.id}`,
        title: `${t.title} siap diuji QA`,
        subtitle: `${t.assignee_name || "Tim"} · Tahap Testing`,
        tone: "warning",
      });
    });

    const crTasks = tasks.filter((t) => t.status === "CODE_REVIEW");
    crTasks.slice(0, 1).forEach((t) => {
      list.push({
        id: `cr-${t.id}`,
        title: `${t.title} diajukan code review`,
        subtitle: `${t.assignee_name || "Tim"} · Code Review`,
        tone: "purple",
      });
    });

    const devTasks = tasks.filter((t) => t.status === "DEVELOPMENT");
    devTasks.slice(0, 1).forEach((t) => {
      list.push({
        id: `dev-${t.id}`,
        title: `${t.title} sedang dikerjakan`,
        subtitle: `${t.assignee_name || "Developer"} · In Progress`,
        tone: "primary",
      });
    });

    return list.slice(0, 3);
  }, [tasks]);

  // 8. Donut SVG metrics
  const donutMetrics = useMemo(() => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    return { radius, circumference, strokeDashoffset };
  }, [progressPercentage]);

  return {
    activeTasksCount,
    priorityTasks,
    stageStats,
    complexityBreakdown,
    atRiskTasks,
    teamWorkload,
    dynamicActivities,
    donutMetrics,
  };
}

export default useDashboardMetrics;
