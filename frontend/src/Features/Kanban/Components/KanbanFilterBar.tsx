// src/Features/Kanban/Components/KanbanFilterBar.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Select } from "@/Components/Elements/Select";
import { useProject } from "@/Contexts/ProjectContext";
import type { Module } from "@/Types/task";

export interface KanbanFilterBarProps {
  modules: Module[];
  filters: {
    module_id?: string;
    assignee_id?: string;
    complexity?: string;
    search?: string;
  };
  setFilter: (key: any, value?: any) => void;
  totalActiveCount: number;
}

export const KanbanFilterBar = memo<KanbanFilterBarProps>(
  ({ modules, filters, setFilter, totalActiveCount }) => {
    const { activeProject } = useProject();

    return (
      <Card
        size="md"
        padding="xs"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Semua Modul Dropdown */}
          <div className="w-40">
            <Select
              sizeVariant="sm"
              value={filters.module_id || "ALL"}
              onChange={(e) => setFilter("module_id", e.target.value)}
            >
              <option value="ALL">Semua Modul</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code || m.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Semua PIC Dropdown */}
          <div className="w-40">
            <Select
              sizeVariant="sm"
              value={filters.assignee_id || "ALL"}
              onChange={(e) => setFilter("assignee_id", e.target.value)}
            >
              <option value="ALL">Semua PIC</option>
              <option value="Ariel">Ariel (Frontend Dev)</option>
              <option value="Fajri">Muhamad Fajri (Backend Dev)</option>
              <option value="Fauzan">Fauzan (Technical Lead)</option>
              <option value="Tubagus">Tubagus M. Wildan (PM)</option>
              <option value="Valdric">Valdric (QA Tester)</option>
            </Select>
          </div>

          {/* Semua Bobot Dropdown */}
          <div className="w-36">
            <Select
              sizeVariant="sm"
              value={filters.complexity || "ALL"}
              onChange={(e) => setFilter("complexity", e.target.value)}
            >
              <option value="ALL">Semua Bobot</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </Select>
          </div>

          {/* Count Text (Dynamic Backend Count) */}
          <span className="text-xs text-muted-foreground ml-2 font-medium">
            {totalActiveCount} tugas di board
          </span>
        </div>

        {/* Dynamic Project Status Badge */}
        <Badge variant="primary" size="lg" shape="rounded" mono className="ml-auto">
          {activeProject?.canonicalCode || "PROJ-ERP-01"} · {activeProject?.status || "AKTIF"}
        </Badge>
      </Card>
    );
  },
);

KanbanFilterBar.displayName = "KanbanFilterBar";
export default KanbanFilterBar;
