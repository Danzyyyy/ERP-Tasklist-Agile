// src/Features/Tasks/Components/TasklistFilterBar.tsx
import React, { memo } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/Components/Elements/Button";
import { Select } from "@/Components/Elements/Select";
import { Input } from "@/Components/Elements/Input";
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

export const TasklistFilterBar = memo<TasklistFilterBarProps>(({ modules, filters, onFilterChange, onOpenTaskModal }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-2.5 px-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Semua Modul Dropdown */}
        <div className="w-40">
          <Select value={filters.module_id || "ALL"} onChange={(e) => onFilterChange("module_id", e.target.value)} className="h-8.5 text-xs font-medium">
            <option value="ALL">Semua Modul</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code || m.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Semua PIC Dropdown */}
        <div className="w-36">
          <Select value={filters.assignee_id || "ALL"} onChange={(e) => onFilterChange("assignee_id", e.target.value)} className="h-8.5 text-xs font-medium">
            <option value="ALL">Semua PIC</option>
            <option value="Ariel">Ariel (FE)</option>
            <option value="Fajri">Fajri (BE)</option>
            <option value="Fauzan">Fauzan (TL)</option>
          </Select>
        </div>

        {/* Semua Status Dropdown */}
        <div className="w-36">
          <Select value={filters.status || "ALL"} onChange={(e) => onFilterChange("status", e.target.value)} className="h-8.5 text-xs font-medium">
            <option value="ALL">Semua Status</option>
            <option value="DRAFT">DRAFT</option>
            <option value="RELEASED">RELEASED</option>
            <option value="DEVELOPMENT">IN PROGRESS</option>
            <option value="CODE_REVIEW">CODE REVIEW</option>
            <option value="TESTING">TESTING</option>
            <option value="DONE">DONE</option>
          </Select>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Cari tugas..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full h-8.5 pl-8 pr-3 text-xs"
          />
        </div>
      </div>

      {/* + Tambah Modul / Task Button */}
      <Button type="button" onClick={onOpenTaskModal} className="h-8.5 px-3.5 rounded-lg text-xs font-semibold gap-1.5 shadow-xs shrink-0">
        <Plus className="size-3.5" />
        <span>Tambah Modul / Task</span>
      </Button>
    </div>
  );
});

TasklistFilterBar.displayName = "TasklistFilterBar";
export default TasklistFilterBar;
