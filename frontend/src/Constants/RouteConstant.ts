// src/Constants/RouteConstant.ts

export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/auth/login",
  DASHBOARD: "/dashboard",
  MODULES: "/dashboard/modules",
  TASKS: "/dashboard/tasks",
  KANBAN: "/dashboard/kanban",
  REVIEWS: "/dashboard/reviews",
  REPORTS: "/dashboard/reports",
  UNAUTHORIZED: "/unauthorized",
} as const;

export const ROUTES = ROUTE_PATHS;
