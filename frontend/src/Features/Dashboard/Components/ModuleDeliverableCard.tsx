// src/Features/Dashboard/Components/ModuleDeliverableCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useGetModuleProgress from "@/Hooks/useGetModuleProgress";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { cn } from "@/Utils/cn";

export interface ModuleDeliverableCardProps {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  featureSummary: string;
  tlName?: string;
}

export const ModuleDeliverableCard: React.FC<ModuleDeliverableCardProps> = ({
  moduleId,
  moduleCode,
  moduleName,
  featureSummary,
  tlName = "Fauzan",
}) => {
  const navigate = useNavigate();
  // Konsumsi langsung kalkulasi resmi Formula Q-03 dari Backend: GET /modules/{moduleId}/progress
  const { data: progress, isLoading } = useGetModuleProgress(moduleId);

  const doneHours = progress?.completedManHours ?? 0;
  const totalHours = progress?.totalEstimatedManHours ?? 0;
  const percentage = progress?.progressPercentage ?? 0;
  const totalTasks = progress?.totalTasks ?? 0;
  const completedTasks = progress?.completedTasks ?? 0;
  const activeTasks = Math.max(0, totalTasks - completedTasks);

  return (
    <div
      onClick={() => navigate(ROUTE_PATHS.PROJECTS)}
      className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-primary/50 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-[10px] font-bold font-mono">
            {moduleCode}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            Formula Q-03 Backend
          </span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-foreground line-clamp-1" title={moduleName}>
            {moduleName}
          </h4>
          <p
            className="text-xs text-muted-foreground mt-0.5 line-clamp-1"
            title={featureSummary}
          >
            {featureSummary}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">
              {isLoading ? "Menghitung..." : `${doneHours} / ${totalHours} Jam`}
            </span>
            <span
              className={cn(
                "font-bold",
                percentage === 100
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-primary",
              )}
            >
              {isLoading ? "..." : `${percentage.toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {isLoading ? "..." : `${activeTasks} tugas aktif · ${totalTasks} total`}
        </span>
        <span className="font-medium text-foreground">TL: {tlName}</span>
      </div>
    </div>
  );
};

export default ModuleDeliverableCard;
