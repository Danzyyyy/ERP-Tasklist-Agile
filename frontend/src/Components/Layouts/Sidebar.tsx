// src/Components/Layouts/Sidebar.tsx
import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { useTasks } from "@/Features/Tasks/Hooks/useTasks";
import useDeliverableProgress from "@/Features/Dashboard/Hooks/useDeliverableProgress";
import { Progress } from "@/Components/Elements/Progress";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import {
  LayoutGrid,
  Folder,
  ListChecks,
  Columns3,
  ClipboardCheck,
  BarChart2,
  FolderKanban,
  Sparkles,
} from "lucide-react";

export const Sidebar = memo(() => {
  const { data: tasks = [] } = useTasks();
  const { data: metrics } = useDeliverableProgress();

  const reviewTestingCount = tasks.filter(
    (t) => t.status === "CODE_REVIEW" || t.status === "TESTING",
  ).length;

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
      badge: reviewTestingCount > 0 ? reviewTestingCount : 3,
    },
    {
      to: ROUTE_PATHS.REPORTS,
      label: "Laporan",
      icon: BarChart2,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0c1322] text-slate-200 border-r border-slate-800/80 flex flex-col z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/70 bg-[#090e1a]/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 grid place-items-center text-white shadow-md shadow-blue-500/20 shrink-0">
          <FolderKanban className="size-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xs font-bold tracking-tight text-white truncate">
            PT. Anaheim Nimbus Universal
          </h1>
          <p className="text-[10px] text-slate-400 font-mono truncate">ERP Modul E-4</p>
        </div>
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
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1d4ed8] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
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
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Sparkles className="size-3 text-blue-400" />
            Deliverable Sprint
          </span>
          <span className="font-mono text-xs font-extrabold text-blue-400">
            {formatPercent(metrics?.progressPercentage || 0)}
          </span>
        </div>

        <Progress
          value={metrics?.progressPercentage || 0}
          height="h-2"
          tone="blue"
          animatedShine={false}
        />

        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
          <span>
            {formatManHours(metrics?.completedManHours || 0)} / {formatManHours(metrics?.totalEstimatedManHours || 0)}
          </span>
          <span>{metrics?.completedTasks || 0}/{metrics?.totalTasks || 0} Done</span>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
