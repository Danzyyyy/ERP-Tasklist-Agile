// src/Components/Layouts/DashboardLayout.tsx
import React, { memo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TaskModal from "@/Features/Tasks/Components/TaskModal";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { cn } from "@/Utils/cn";

const DashboardInner = memo(() => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { open, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area: dynamic margin responds to desktop toggle & mobile viewport */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen w-full transition-[margin] duration-300 ease-in-out min-w-0",
          !isMobile && open ? "md:ml-64" : "md:ml-0",
        )}
      >
        <Topbar onOpenTaskModal={() => setIsTaskModalOpen(true)} />

        <main className="flex-1 p-3.5 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
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
