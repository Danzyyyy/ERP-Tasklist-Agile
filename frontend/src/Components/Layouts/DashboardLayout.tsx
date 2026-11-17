// src/Components/Layouts/DashboardLayout.tsx
import React, { memo, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TaskModal from "@/Components/Modals/TaskModal";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { cn } from "@/Utils/cn";
import { ChevronRight } from "lucide-react";

const getBreadcrumbTitle = (pathname: string): string => {
  if (pathname === ROUTE_PATHS.DASHBOARD || pathname === `${ROUTE_PATHS.DASHBOARD}/`) return "Dashboard";
  if (pathname.startsWith(ROUTE_PATHS.MODULES)) return "Proyek";
  if (pathname.startsWith(ROUTE_PATHS.TASKS)) return "Tasklist";
  if (pathname.startsWith(ROUTE_PATHS.KANBAN)) return "Agile Board";
  if (pathname.startsWith(ROUTE_PATHS.REVIEWS)) return "Review & Testing";
  if (pathname.startsWith(ROUTE_PATHS.REPORTS)) return "Laporan";
  return "Dashboard";
};

const DashboardInner = memo(() => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { open, isMobile } = useSidebar();
  const location = useLocation();
  const currentTitle = getBreadcrumbTitle(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar with Quick Action wire-up */}
      <Sidebar onOpenTaskModal={() => setIsTaskModalOpen(true)} />

      {/* Main Content Area: dynamic margin responds to desktop toggle & mobile viewport */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen w-full transition-[margin] duration-300 ease-in-out min-w-0",
          !isMobile && open ? "md:ml-[240px]" : "md:ml-0",
        )}
      >
        <Topbar onOpenTaskModal={() => setIsTaskModalOpen(true)} />

        <main className="flex-1 w-full min-w-0 pt-4 pb-6 px-4 sm:px-8 space-y-4">
          {/* FigCraft 1:1: Context Meta Strip */}
          <div className="flex items-center justify-between py-1 text-xs mb-1">
            {/* Breadcrumb Trail */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
              <Link
                to={ROUTE_PATHS.DASHBOARD}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Workspace
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
              <span className="font-semibold text-foreground">
                {currentTitle}
              </span>
            </nav>

            {/* Active Cycle Pill (FigCraft 1:1) */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <span>SPRINT 1 AKTIF · 12 – 18 OKT 2026</span>
            </div>
          </div>

          <Outlet />
        </main>

        {/* Global Footer (FigCraft 1:1) */}
        <footer className="mt-auto border-t border-border bg-card px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground shrink-0">
          <span>© 2026 PT. Anaheim Nimbus Universal</span>
          <div className="flex items-center gap-2">
            <span>Modul E-4: Tasklist & Eksekusi Agile</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="size-2 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </footer>
      </div>

      {/* Global Task Creation Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
    </div>
  );
});

DashboardInner.displayName = "DashboardInner";

export const DashboardLayout = memo(() => {
  return (
    <SidebarProvider>
      <DashboardInner />
    </SidebarProvider>
  );
});

DashboardLayout.displayName = "DashboardLayout";
export default DashboardLayout;
