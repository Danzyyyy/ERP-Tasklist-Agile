// src/Components/Layouts/DashboardLayout.tsx
import React, { memo, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TaskModal from "@/Features/Tasks/Components/TaskModal";

export const DashboardLayout = memo(() => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Topbar onOpenTaskModal={() => setIsTaskModalOpen(true)} />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
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

DashboardLayout.displayName = "DashboardLayout";
export default DashboardLayout;
