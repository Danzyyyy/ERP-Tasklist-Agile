// src/Hooks/useSidebarNavigation.ts
import { useMemo } from "react";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import useGetDeliverableProgress from "@/Hooks/useGetDeliverableProgress";
import { useSidebar } from "@/Components/Layouts/SidebarContext";
import { LayoutGrid, Folder, ListChecks, Columns3, ClipboardCheck, BarChart2 } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export function useSidebarNavigation() {
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar();
  const { data: metrics } = useGetDeliverableProgress();

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        to: ROUTE_PATHS.DASHBOARD,
        label: "Dashboard",
        icon: LayoutGrid,
      },
      {
        to: ROUTE_PATHS.PROJECTS,
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
      },
      {
        to: ROUTE_PATHS.REPORTS,
        label: "Laporan",
        icon: BarChart2,
      },
    ],
    [],
  );

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return {
    open,
    openMobile,
    setOpenMobile,
    metrics,
    navItems,
    handleNavClick,
    isMobile,
  };
}

export default useSidebarNavigation;
