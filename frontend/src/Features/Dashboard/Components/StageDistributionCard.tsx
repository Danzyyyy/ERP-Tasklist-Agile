// src/Features/Dashboard/Components/StageDistributionCard.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import type { TaskStatus } from "@/Types/task";
import { Kanban } from "lucide-react";

export interface StageDistributionCardProps {
  stageCounts: Record<TaskStatus, number>;
  onGoToKanban: () => void;
}

const STAGE_ITEMS = [
  {
    status: "DRAFT",
    label: "Draft (Menunggu Approval)",
    color: "bg-muted-foreground/60",
  },
  {
    status: "RELEASED",
    label: "Released (Siap Kerja)",
    color: "bg-purple-subtle-foreground",
  },
  {
    status: "DEVELOPMENT",
    label: "In Development",
    color: "bg-primary",
  },
  {
    status: "CODE_REVIEW",
    label: "Code Review",
    color: "bg-purple-subtle-foreground",
  },
  {
    status: "TESTING",
    label: "QA Testing",
    color: "bg-cyan-subtle-foreground",
  },
  {
    status: "DONE",
    label: "Definition of Done",
    color: "bg-success",
  },
] as const;

export const StageDistributionCard = memo<StageDistributionCardProps>(
  ({ stageCounts, onGoToKanban }) => {
    return (
      <Card className="p-4 border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Kanban className="size-4 text-primary" />
            <span>Distribusi Tahapan Sprint (SOP-08)</span>
          </h3>
          <button
            type="button"
            onClick={onGoToKanban}
            className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            Lihat Papan &rarr;
          </button>
        </div>

        <div className="space-y-2">
          {STAGE_ITEMS.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${item.color}`} />
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
              <strong className="font-mono text-xs font-bold text-foreground">
                {stageCounts[item.status as TaskStatus] || 0}
              </strong>
            </div>
          ))}
        </div>
      </Card>
    );
  },
);

StageDistributionCard.displayName = "StageDistributionCard";

export function StageDistributionCardSkeleton() {
  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="h-3.5 w-36" />
            </div>
            <Skeleton className="h-4 w-6" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default StageDistributionCard;

