// src/Features/Dashboard/Components/ModuleDeliverableCard.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import useGetModuleProgress, { DEFAULT_MODULE_METRICS } from "@/Hooks/useGetModuleProgress";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
import { Progress } from "@/Components/Elements/Progress";
import { cn } from "@/Utils/cn";

export interface ModuleDeliverableCardProps {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  featureSummary: string;
  tlName?: string;
}

export const ModuleDeliverableCard = memo<ModuleDeliverableCardProps>(
  ({ moduleId, moduleCode, moduleName, featureSummary, tlName = "Fauzan" }) => {
    const navigate = useNavigate();
    // Konsumsi kalkulasi progres modul langsung dari backend: GET /modules/{moduleId}/progress
    const { data: progress = DEFAULT_MODULE_METRICS, isLoading } = useGetModuleProgress(moduleId);

    const doneHours = progress.completedManHours;
    const totalHours = progress.totalEstimatedManHours;
    const percentage = progress.progressPercentage;
    const totalTasks = progress.totalTasks;
    const completedTasks = progress.completedTasks;
    const activeTasks = totalTasks > completedTasks ? totalTasks - completedTasks : 0;

    return (
      <Card
        size="md"
        interactive="primary"
        onClick={() => navigate(ROUTE_PATHS.PROJECTS)}
        className="space-y-3 cursor-pointer flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <Badge variant="primary" size="sm" shape="rounded" mono>
              {moduleCode}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono">Progres Modul</span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground line-clamp-1" title={moduleName}>
              {moduleName}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" title={featureSummary}>
              {featureSummary}
            </p>
          </div>

          <div className="space-y-1.5">
            <Progress value={percentage} height="h-1.5" tone="primary" animatedShine={false} />
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">
                {isLoading ? "Menghitung..." : `${formatManHours(doneHours)} / ${formatManHours(totalHours)} Jam`}
              </span>
              <span className={cn("font-bold", percentage === 100 ? "text-success" : "text-primary")}>
                {isLoading ? "..." : `${formatPercent(percentage)}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>{isLoading ? "..." : `${activeTasks} tugas aktif · ${totalTasks} total`}</span>
          <span className="font-medium text-foreground">TL: {tlName}</span>
        </div>
      </Card>
    );
  },
);

ModuleDeliverableCard.displayName = "ModuleDeliverableCard";
export default ModuleDeliverableCard;
