// src/Features/Dashboard/Components/AtRiskTasksCard.tsx
import React, { memo } from "react";
import { Button } from "@/Components/Elements/Button";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { getInitials, getAvatarBg } from "@/Utils/taskUtils";
import { cn } from "@/Utils/cn";
import { AlertTriangle, Clock, Calendar, ArrowUpRight } from "lucide-react";
import type { Task } from "@/Types/task";

export interface AtRiskTaskItem extends Task {
  isOverdue: boolean;
  daysRemaining: number;
}

export interface AtRiskTasksCardProps {
  tasks: AtRiskTaskItem[];
  tasksAtRiskOrOverdueCount: number;
  onViewTasklist: () => void;
}

export const AtRiskTasksCard = memo<AtRiskTasksCardProps>(
  ({ tasks, tasksAtRiskOrOverdueCount, onViewTasklist }) => {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Tugas Berisiko & Tenggat Kritis</h3>
            {tasksAtRiskOrOverdueCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border flex items-center gap-1">
                <AlertTriangle className="size-2.5" />
                {tasksAtRiskOrOverdueCount} Perlu Perhatian
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success-subtle-foreground border border-success-subtle-border">
                Semua Sesuai Jadwal
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="link"
            onClick={onViewTasklist}
            className="text-xs font-semibold text-primary p-0 h-auto gap-1"
          >
            <span>Lihat Tasklist</span>
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>

        <div className="divide-y divide-border/60">
          {tasks.map((t) => {
            const pic = t.assignee_name || "Belum Ditugaskan";
            const initials = getInitials(pic);
            const avatarBg = getAvatarBg(initials);
            const deadlineDate = t.target_deadline ? t.target_deadline.split("T")[0] : "-";

            return (
              <div
                key={t.id}
                onClick={onViewTasklist}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-muted/50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs",
                      avatarBg,
                    )}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {t.task_code} · {t.module?.name || "Modul Utama"} ·{" "}
                      {Number(t.estimated_man_hours) || 8} Jam
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {t.isOverdue ? (
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-subtle-border flex items-center gap-1">
                      <AlertTriangle className="size-3 text-destructive" />
                      Terlambat ({Math.abs(t.daysRemaining)} hari)
                    </span>
                  ) : t.daysRemaining <= 2 ? (
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border flex items-center gap-1">
                      <Clock className="size-3 text-warning-subtle-foreground" />
                      {t.daysRemaining} hari tersisa
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono font-medium bg-muted text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground" />
                      {deadlineDate}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">
              Tidak ada tugas aktif atau tertunda saat ini.
            </div>
          )}
        </div>
      </div>
    );
  },
);

AtRiskTasksCard.displayName = "AtRiskTasksCard";

// Companion Skeleton
export const AtRiskTasksCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};
