// src/Features/Dashboard/Components/StageComplexityCard.tsx
import React, { memo } from "react";
import { Button } from "@/Components/Elements/Button";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { ArrowUpRight, Layers } from "lucide-react";
import type { TaskStatus } from "@/Types/task";

export interface StageComplexityCardProps {
  stageStats: Record<TaskStatus, number>;
  complexityBreakdown: { low: number; medium: number; high: number };
  totalHours: number;
  onOpenBoard: () => void;
}

export const StageComplexityCard = memo<StageComplexityCardProps>(
  ({ stageStats, complexityBreakdown, totalHours, onOpenBoard }) => {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Distribusi Status & Kompleksitas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rekapitulasi riil status tugas dan alokasi man-hour berdasarkan kompleksitas
            </p>
          </div>
          <Button
            type="button"
            variant="link"
            onClick={onOpenBoard}
            className="text-xs font-semibold text-primary p-0 h-auto gap-1"
          >
            <span>Buka Board</span>
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>

        {/* 6 Stage Status Pills with Semantic Tokens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          <div className="p-2.5 rounded-xl border border-border bg-muted/50 text-center">
            <span className="text-xs font-mono font-bold text-muted-foreground">DRAFT</span>
            <p className="text-lg font-black text-foreground mt-0.5">{stageStats.DRAFT}</p>
            <span className="text-[10px] text-muted-foreground">Dual Approval</span>
          </div>

          <div className="p-2.5 rounded-xl border border-success-subtle-border bg-success-subtle/50 text-center">
            <span className="text-xs font-mono font-bold text-success-subtle-foreground">
              RELEASED
            </span>
            <p className="text-lg font-black text-foreground mt-0.5">{stageStats.RELEASED}</p>
            <span className="text-[10px] text-muted-foreground">Siap Diambil</span>
          </div>

          <div className="p-2.5 rounded-xl border border-primary-subtle-border bg-status-dev-bg text-center">
            <span className="text-xs font-mono font-bold text-status-dev-text">DEV</span>
            <p className="text-lg font-black text-foreground mt-0.5">{stageStats.DEVELOPMENT}</p>
            <span className="text-[10px] text-muted-foreground">In Progress</span>
          </div>

          <div className="p-2.5 rounded-xl border border-purple-subtle-border bg-status-review-bg text-center">
            <span className="text-xs font-mono font-bold text-status-review-text">REVIEW</span>
            <p className="text-lg font-black text-foreground mt-0.5">{stageStats.CODE_REVIEW}</p>
            <span className="text-[10px] text-muted-foreground">Review TL/PM</span>
          </div>

          <div className="p-2.5 rounded-xl border border-cyan-subtle-border bg-status-testing-bg text-center">
            <span className="text-xs font-mono font-bold text-status-testing-text">TESTING</span>
            <p className="text-lg font-black text-foreground mt-0.5">{stageStats.TESTING}</p>
            <span className="text-[10px] text-muted-foreground">Uji QA & DoD</span>
          </div>

          <div className="p-2.5 rounded-xl border border-success-subtle-border bg-status-done-bg text-center">
            <span className="text-xs font-mono font-bold text-status-done-text">DONE</span>
            <p className="text-lg font-black text-foreground mt-0.5">{stageStats.DONE}</p>
            <span className="text-[10px] text-muted-foreground">Disahkan</span>
          </div>
        </div>

        {/* Complexity Allocation Bar with Semantic Tokens */}
        <div className="pt-2 border-t border-border/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="size-3.5 text-primary" />
              Alokasi Beban Jam Man-Hour (Bobot Kompleksitas)
            </span>
            <span className="font-mono text-muted-foreground">Total: {totalHours} Jam</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-destructive-subtle border border-destructive-subtle-border flex items-center justify-between">
              <div>
                <span className="font-bold text-destructive-subtle-foreground text-[11px]">
                  HIGH (Bobot 3×)
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">Kompleksitas Tinggi</p>
              </div>
              <span className="font-mono font-black text-destructive-subtle-foreground text-sm">
                {complexityBreakdown.high} Jam
              </span>
            </div>

            <div className="p-2 rounded-lg bg-warning-subtle border border-warning-subtle-border flex items-center justify-between">
              <div>
                <span className="font-bold text-warning-subtle-foreground text-[11px]">
                  MEDIUM (Bobot 2×)
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">Kompleksitas Menengah</p>
              </div>
              <span className="font-mono font-black text-warning-subtle-foreground text-sm">
                {complexityBreakdown.medium} Jam
              </span>
            </div>

            <div className="p-2 rounded-lg bg-muted border border-border flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground text-[11px]">LOW (Bobot 1×)</span>
                <p className="text-xs text-muted-foreground mt-0.5">Kompleksitas Standar</p>
              </div>
              <span className="font-mono font-black text-foreground text-sm">
                {complexityBreakdown.low} Jam
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

StageComplexityCard.displayName = "StageComplexityCard";

// Companion Skeleton
export const StageComplexityCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
};
