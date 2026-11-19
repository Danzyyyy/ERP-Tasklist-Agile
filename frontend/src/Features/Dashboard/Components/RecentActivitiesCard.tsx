// src/Features/Dashboard/Components/RecentActivitiesCard.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Activity } from "lucide-react";
import { cn } from "@/Utils/cn";
import type { ActivityEvent } from "../Hooks/useDashboardMetrics";

export interface RecentActivitiesCardProps {
  activities: ActivityEvent[];
}

export const RecentActivitiesCard = memo<RecentActivitiesCardProps>(({ activities }) => {
  return (
    <Card size="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Aktivitas Tim</h3>
        <Activity className="size-3.5 text-primary" />
      </div>

      <div className="space-y-3 text-xs">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-2.5">
            <span
              className={cn(
                "size-2 rounded-full shrink-0 mt-1",
                act.tone === "success" && "bg-success",
                act.tone === "warning" && "bg-warning",
                act.tone === "purple" && "bg-primary",
                act.tone === "primary" && "bg-primary",
              )}
            />
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{act.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{act.subtitle}</p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-xs text-muted-foreground py-2 text-center">
            Belum ada aktivitas tercatat.
          </p>
        )}
      </div>
    </Card>
  );
});

RecentActivitiesCard.displayName = "RecentActivitiesCard";
