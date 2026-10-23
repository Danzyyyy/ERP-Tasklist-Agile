// src/Components/Layouts/Sidebar.tsx
import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import useDeliverableProgress from "@/Features/Dashboard/Hooks/useDeliverableProgress";
import { Progress } from "@/Components/Elements/Progress";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import { useSidebar } from "./SidebarContext";
import { cn } from "@/Utils/cn";
import {
  LayoutGrid,
  Folder,
  ListChecks,
  Columns3,
  ClipboardCheck,
  BarChart2,
  FolderKanban,
  Sparkles,
  X,
} from "lucide-react";

export const Sidebar = memo(() => {
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar();
  const { data: tasks = [] } = useTasks();
  const { data: metrics } = useDeliverableProgress();

  const reviewTestingCount = tasks.filter((t) => {
    const hasReviewLogs = Boolean(
      (t.reviewLogs && t.reviewLogs.length > 0) ||
      ((t as any).review_logs && (t as any).review_logs.length > 0),
    );
    const isSignOff = Boolean(
      t.status === "TESTING" ||
      t.status === "DONE" ||
      t.is_pm_verified ||
      t.is_tl_signed,
    );
    return (
      t.status === "CODE_REVIEW" ||
      t.status === "TESTING" ||
      Boolean(t.rework) ||
      hasReviewLogs ||
      isSignOff
    );
  }).length;

  const NAV_ITEMS = [
    {
      to: ROUTE_PATHS.DASHBOARD,
      label: "Dashboard",
      icon: LayoutGrid,
    },
    {
      to: ROUTE_PATHS.MODULES,
      label: "Proyek",
      icon: Folder,
    },
    {
      to: ROUTE_PATHS.TASKS,
      label: "Tasklist",
      icon: ListChecks,
    },
    {
      to: ROUTE_PATHS.KANBAN,
      label: "Agile Board",
      icon: Columns3,
    },
    {
      to: ROUTE_PATHS.REVIEWS,
      label: "Review & Testing",
      icon: ClipboardCheck,
      badge: reviewTestingCount > 0 ? reviewTestingCount : undefined,
    },
    {
      to: ROUTE_PATHS.REPORTS,
      label: "Laporan",
      icon: BarChart2,
    },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (Shadcn Sheet pattern) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 md:hidden",
          openMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpenMobile(false)}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col select-none transition-all duration-300 ease-in-out",
          // Mobile Sheet styling
          isMobile
            ? cn(
                "z-50 w-72 shadow-2xl",
                openMobile ? "translate-x-0" : "-translate-x-full pointer-events-none",
              )
            : // Desktop Collapsible styling
              cn(
                "z-30 w-64",
                open
                  ? "translate-x-0 opacity-100 pointer-events-auto"
                  : "-translate-x-full opacity-0 pointer-events-none",
              ),
        )}
        aria-label="Sidebar Navigasi"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border bg-sidebar/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary grid place-items-center text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20 shrink-0">
              <FolderKanban className="size-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-bold tracking-tight text-sidebar-foreground truncate">
                PT. Anaheim Nimbus Universal
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60 font-mono truncate">ERP Modul E-4</p>
            </div>
          </div>

          {/* Close button for Mobile Sheet */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="size-8 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent grid place-items-center cursor-pointer shrink-0 transition-colors"
              aria-label="Tutup Sidebar"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Navigation List - Clean & Simple */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTE_PATHS.DASHBOARD}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-semibold"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  )
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className="size-[18px] shrink-0 stroke-[2.2]" />
                  <span className="truncate text-[13px]">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-md bg-white text-rose-600 font-extrabold text-[11px] leading-tight shadow-xs min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Mini Deliverable Progress Widget */}
        <div className="p-3 m-3 rounded-xl bg-sidebar-accent border border-sidebar-border space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-sidebar-foreground font-bold flex items-center gap-1.5">
              <Sparkles className="size-3 text-sidebar-ring" />
              Deliverable Sprint
            </span>
            <span className="font-mono text-xs font-extrabold text-sidebar-ring">
              {formatPercent(metrics?.progressPercentage || 0)}
            </span>
          </div>

          <Progress
            value={metrics?.progressPercentage || 0}
            height="h-2"
            tone="blue"
            animatedShine={false}
          />

          <div className="flex items-center justify-between text-[9px] text-sidebar-foreground/60 font-mono">
            <span>
              {formatManHours(metrics?.completedManHours || 0)} /{" "}
              {formatManHours(metrics?.totalEstimatedManHours || 0)}
            </span>
            <span>
              {metrics?.completedTasks || 0}/{metrics?.totalTasks || 0} Done
            </span>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
