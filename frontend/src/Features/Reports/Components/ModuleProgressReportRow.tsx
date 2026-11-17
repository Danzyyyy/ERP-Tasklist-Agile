// src/Features/Reports/Components/ModuleProgressReportRow.tsx
import React from "react";
import useGetModuleProgress from "@/Hooks/useGetModuleProgress";

export interface ModuleProgressReportRowProps {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
}

export const ModuleProgressReportRow: React.FC<ModuleProgressReportRowProps> = ({
  moduleId,
  moduleCode,
  moduleName,
}) => {
  // Konsumsi langsung kalkulasi resmi Formula Q-03 dari Backend: GET /modules/{moduleId}/progress
  const { data: progress, isLoading } = useGetModuleProgress(moduleId);

  const doneHours = progress?.completedManHours ?? 0;
  const totalHours = progress?.totalEstimatedManHours ?? 0;
  const percentage = progress?.progressPercentage ?? 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">
          {moduleCode} — {moduleName}
        </span>
        <span
          className={
            percentage === 100
              ? "font-mono text-emerald-600 dark:text-emerald-400 font-bold"
              : "font-mono text-muted-foreground"
          }
        >
          {isLoading ? "Menghitung..." : `${doneHours} / ${totalHours} Jam · ${percentage.toFixed(1)}%`}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};

export default ModuleProgressReportRow;
