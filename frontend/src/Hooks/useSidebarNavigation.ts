// src/Hooks/useSidebarNavigation.ts
import { useMemo } from "react";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import useGetDeliverableProgress from "@/Hooks/useGetDeliverableProgress";
import { useSidebar } from "@/Components/Layouts/SidebarContext";
import { isTaskRework } from "@/Utils/taskUtils";
import { LayoutGrid, Folder, ListChecks, Columns3, ClipboardCheck, BarChart2 } from "lucide-react";

export function useSidebarNavigation() {
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar();
  const { data: tasks = [] } = useGetTaskList();
  const { data: metrics } = useGetDeliverableProgress();

  const reviewTestingCount = useMemo(() => {
    return tasks.filter(
      (t) =>
        t.status === "CODE_REVIEW" ||
        t.status === "TESTING" ||
        t.status === "DONE" ||
        isTaskRework(t),
    ).length;
  }, [tasks]);

  const navItems = useMemo(
    () => [
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
    ],
    [reviewTestingCount],
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
