// src/Features/Tasks/Components/TasklistFilterBar.tsx
import React, { memo } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
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
  onFilterChange: (key: any, value?: any) => void;
  onOpenTaskModal: () => void;
}

export const TasklistFilterBar = memo<TasklistFilterBarProps>(({ modules, filters, onFilterChange, onOpenTaskModal }) => {
  return (
    <Card
      size="md"
      padding="xs"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Semua Modul Dropdown */}
        <div className="w-40">
          <Select sizeVariant="sm" value={filters.module_id || "ALL"} onChange={(e) => onFilterChange("module_id", e.target.value)}>
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
          <Select sizeVariant="sm" value={filters.assignee_id || "ALL"} onChange={(e) => onFilterChange("assignee_id", e.target.value)}>
            <option value="ALL">Semua PIC</option>
            <option value="Ariel">Ariel (FE)</option>
            <option value="Fajri">Fajri (BE)</option>
            <option value="Fauzan">Fauzan (TL)</option>
          </Select>
        </div>

        {/* Semua Status Dropdown */}
        <div className="w-36">
          <Select sizeVariant="sm" value={filters.status || "ALL"} onChange={(e) => onFilterChange("status", e.target.value)}>
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
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            type="text"
            sizeVariant="sm"
            leftIcon={<Search className="size-3.5" />}
            placeholder="Cari tugas..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* + Tambah Modul / Task Button */}
      <Button type="button" size="sm" onClick={onOpenTaskModal} className="shrink-0">
        <Plus className="size-3.5" />
        <span>Tambah Modul / Task</span>
      </Button>
    </Card>
  );
});

TasklistFilterBar.displayName = "TasklistFilterBar";
export default TasklistFilterBar;
