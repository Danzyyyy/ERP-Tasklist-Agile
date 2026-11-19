// src/Features/Reviews/Components/ReviewTaskCard.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { formatDate, formatManHours } from "@/Utils/formatters";
import { useAuth } from "@/Hooks/useAuth";
import { canApproveReleaseRole, canRoleSubmitReview, isTaskRework } from "@/Utils/taskUtils";
import type { Task } from "@/Types/task";
import { FileCode2, CheckCircle2, ShieldCheck, FileCheck2, Clock, User, Eye } from "lucide-react";

export interface ReviewTaskCardProps {
  task: Task;
  onOpenReview: (task: Task) => void;
  onOpenSignOff: (task: Task) => void;
  onOpenDetail: (task: Task) => void;
}

export const ReviewTaskCard = memo<ReviewTaskCardProps>(
  ({ task, onOpenReview, onOpenSignOff, onOpenDetail }) => {
    const { role } = useAuth();
    const hasRework = isTaskRework(task);
    const reviewStage = task.status === "TESTING" ? "TESTING" : "CODE_REVIEW";
    const canSubmitReview =
      (task.status === "CODE_REVIEW" || task.status === "TESTING") &&
      canRoleSubmitReview(role, reviewStage);
    const canSignOff = task.status === "TESTING" && canApproveReleaseRole(role);

    return (
      <Card
        surface={hasRework ? "destructiveSubtle" : "default"}
        interactive="subtle"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="default" shape="rounded" mono>
                {task.task_code}
              </Badge>
              <Badge variant={task.status} dot>
                {task.status}
              </Badge>
              <Badge variant={task.complexity_weight} size="sm">
                {task.complexity_weight}
              </Badge>
              {hasRework && <Badge variant="REWORK">REWORK / BUG</Badge>}
            </div>

            <h3 className="text-sm font-bold text-foreground leading-snug">{task.title}</h3>

            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3 text-muted-foreground" />
                Estimasi: {formatManHours(task.estimated_man_hours)}
              </span>
              <span className="flex items-center gap-1">
                <User className="size-3 text-muted-foreground" />
                PIC: {task.assignee_name || "Belum ada"}
              </span>
              <span>Tenggat: {formatDate(task.target_deadline)}</span>
            </div>

            {/* DoD indicators */}
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                  task.is_pm_verified
                    ? "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <CheckCircle2 className="size-3" />
                PM Verify: {task.is_pm_verified ? "Lolos" : "Belum"}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                  task.is_tl_signed
                    ? "bg-success-subtle text-success-subtle-foreground border border-success-subtle-border"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <ShieldCheck className="size-3" />
                TL Sign-off: {task.is_tl_signed ? "Lolos (DONE)" : "Belum"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5 shrink-0">
            {canSubmitReview && (
              <Button size="sm" variant="primary" onClick={() => onOpenReview(task)}>
                <FileCode2 className="size-3.5 mr-1" />
                Review / Testing
              </Button>
            )}

            {canSignOff && (
              <Button size="sm" variant="success" onClick={() => onOpenSignOff(task)}>
                <FileCheck2 className="size-3.5 mr-1" />
                Sign-Off (DoD)
              </Button>
            )}

            <Button
              size="sm"
              variant="ghostMuted"
              onClick={() => onOpenDetail(task)}
            >
              <Eye className="size-3.5 mr-1" />
              Detail & Riwayat
            </Button>
          </div>
        </div>
      </Card>
    );
  },
);

ReviewTaskCard.displayName = "ReviewTaskCard";

export function ReviewTaskCardSkeleton() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-5 w-28 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}

export default ReviewTaskCard;

