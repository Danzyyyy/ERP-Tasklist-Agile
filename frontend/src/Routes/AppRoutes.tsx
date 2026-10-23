// src/Routes/AppRoutes.tsx
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import LoadingApp from "@/Pages/LoadingApp";
import RootErrorBoundary from "@/Pages/RootErrorBoundary";
import NotFound from "@/Pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded layouts & pages
const AuthLayout = lazy(() => import("@/Components/Layouts/AuthLayout"));
const LoginPage = lazy(() => import("@/Features/Auth/Pages/LoginPage"));
const DashboardLayout = lazy(() => import("@/Components/Layouts/DashboardLayout"));
const DashboardPage = lazy(() => import("@/Features/Dashboard/Pages/DashboardPage"));
const TasklistPage = lazy(() => import("@/Features/Tasks/Pages/TasklistPage"));
const KanbanPage = lazy(() => import("@/Features/Kanban/Pages/KanbanPage"));
const ReviewsPage = lazy(() => import("@/Features/Reviews/Pages/ReviewsPage"));
const ReportsPage = lazy(() => import("@/Features/Reports/Pages/ReportsPage"));
const ModulesPage = lazy(() => import("@/Features/Modules/Pages/ModulesPage"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth",
    element: (
      <Suspense fallback={<LoadingApp />}>
        <AuthLayout />
      </Suspense>
    ),
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingApp />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingApp />}>
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingApp />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "modules",
        element: (
          <Suspense fallback={<LoadingApp />}>
            <ModulesPage />
          </Suspense>
        ),
      },
      {
        path: "projects",
        element: <Navigate to="/dashboard/modules" replace />,
      },
      {
        path: "tasks",
        element: (
          <Suspense fallback={<LoadingApp />}>
            <TasklistPage />
          </Suspense>
        ),
      },
      {
        path: "kanban",
        element: (
          <Suspense fallback={<LoadingApp />}>
            <KanbanPage />
          </Suspense>
        ),
      },
      {
        path: "reviews",
        element: (
          <Suspense fallback={<LoadingApp />}>
            <ReviewsPage />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<LoadingApp />}>
            <ReportsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
export default router;
