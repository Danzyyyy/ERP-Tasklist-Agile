// src/Features/Kanban/Components/KanbanFilterBar.tsx
import React, { memo } from "react";
import { ChevronDown } from "lucide-react";
import type { Module } from "@/Types/task";

export interface KanbanFilterBarProps {
  modules: Module[];
  filters: {
    module_id?: string;
    assignee_id?: string;
    complexity?: string;
    search?: string;
  };
  setFilter: (key: string, value: string) => void;
  totalActiveCount: number;
}

export const KanbanFilterBar = memo<KanbanFilterBarProps>(
  ({ modules, filters, setFilter }) => {
    return (
      <div className="bg-card border border-border rounded-xl p-2.5 px-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Semua Modul Dropdown */}
          <div className="relative">
            <select
              value={filters.module_id || "ALL"}
              onChange={(e) => setFilter("module_id", e.target.value)}
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
              onChange={(e) => setFilter("assignee_id", e.target.value)}
              className="appearance-none h-8.5 pl-3 pr-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua PIC</option>
              <option value="Ariel">Ariel (FE)</option>
              <option value="Fajri">Fajri (BE)</option>
              <option value="Fauzan">Fauzan (TL)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Semua Bobot Dropdown */}
          <div className="relative">
            <select
              value={filters.complexity || "ALL"}
              onChange={(e) => setFilter("complexity", e.target.value)}
              className="appearance-none h-8.5 pl-3 pr-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Semua Bobot</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Count Text */}
          <span className="text-xs text-muted-foreground ml-2 font-medium">
            6 tugas dirilis · 2 draft
          </span>
        </div>

        {/* Sprint 1 Aktif Button */}
        <button
          type="button"
          className="h-8.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer ml-auto"
        >
          Sprint 1 Aktif
        </button>
      </div>
    );
  },
);

KanbanFilterBar.displayName = "KanbanFilterBar";
export default KanbanFilterBar;
