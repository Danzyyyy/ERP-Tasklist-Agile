// src/Features/Tasks/Components/TasklistFilterBar.tsx
import React, { memo } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";
import type { Module } from "@/Types/task";

export interface TasklistFilterBarProps {
  modules: Module[];
  filters: {
    module_id?: string;
    assignee_id?: string;
    status?: string;
    search?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onOpenTaskModal: () => void;
}

export const TasklistFilterBar = memo<TasklistFilterBarProps>(
  ({ modules, filters, onFilterChange, onOpenTaskModal }) => {
    return (
      <div className="bg-card border border-border rounded-xl p-2.5 px-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Semua Modul Dropdown */}
          <div className="relative">
            <select
              value={filters.module_id || "ALL"}
              onChange={(e) => onFilterChange("module_id", e.target.value)}
              className="appearance-none h-8.5 pl-3 pr-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua Modul</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code || m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Semua PIC Dropdown */}
          <div className="relative">
            <select
              value={filters.assignee_id || "ALL"}
              onChange={(e) => onFilterChange("assignee_id", e.target.value)}
              className="appearance-none h-8.5 pl-3 pr-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua PIC</option>
              <option value="Ariel">Ariel (FE)</option>
              <option value="Fajri">Fajri (BE)</option>
              <option value="Fauzan">Fauzan (TL)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Semua Status Dropdown */}
          <div className="relative">
            <select
              value={filters.status || "ALL"}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="appearance-none h-8.5 pl-3 pr-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="RELEASED">RELEASED</option>
              <option value="DEVELOPMENT">IN PROGRESS</option>
              <option value="CODE_REVIEW">CODE REVIEW</option>
              <option value="TESTING">TESTING</option>
              <option value="DONE">DONE</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={filters.search || ""}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="w-full h-8.5 pl-8 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* + Tambah Modul / Task Button */}
        <button
          type="button"
          onClick={onOpenTaskModal}
          className="h-8.5 px-3.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Tambah Modul / Task</span>
        </button>
      </div>
    );
  },
);

TasklistFilterBar.displayName = "TasklistFilterBar";
export default TasklistFilterBar;
