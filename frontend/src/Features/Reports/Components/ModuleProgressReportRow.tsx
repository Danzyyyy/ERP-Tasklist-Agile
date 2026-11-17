// src/Features/Reports/Components/ModuleProgressReportRow.tsx
import React from "react";
import useGetModuleProgress from "@/Hooks/useGetModuleProgress";
import { Progress } from "@/Components/Elements/Progress";

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
              ? "font-mono text-success font-bold"
              : "font-mono text-muted-foreground"
          }
        >
          {isLoading ? "Menghitung..." : `${doneHours} / ${totalHours} Jam · ${percentage.toFixed(1)}%`}
        </span>
      </div>
      <Progress value={percentage} height="h-2" tone="primary" animatedShine={false} />
    </div>
  );
};

export default ModuleProgressReportRow;
