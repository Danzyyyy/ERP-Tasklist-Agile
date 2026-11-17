// src/Features/Modules/Components/ProjectOverviewCard.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { formatManHours } from "@/Utils/formatters";

export interface ProjectOverviewCardProps {
  metrics: {
    totalModules: number;
    totalFeatures: number;
    totalTasks: number;
    totalManHours: number;
  };
}

export const ProjectOverviewCard = memo<ProjectOverviewCardProps>(({ metrics }) => {
  return (
    <Card className="p-5 bg-linear-to-r from-sidebar via-sidebar to-primary-subtle-foreground text-sidebar-foreground border-sidebar-border shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-primary font-mono font-semibold">
            <span>PROYEK ID: PROJ-ERP-01</span>
            <span>·</span>
            <span>KELOMPOK 4 / KELAS E</span>
          </div>
          <h2 className="text-lg font-bold text-sidebar-foreground tracking-tight mt-1">
            PT. Anaheim Nimbus Universal — Modul E-4
          </h2>
          <p className="text-xs text-sidebar-muted mt-1 max-w-2xl leading-relaxed">
            Sistem Tasklist dan Eksekusi Agile, Dual-Approval Task Release Gate, serta Pelacakan
            Progres Man-Hour Riil.
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sidebar-accent/60 p-3 rounded-xl border border-sidebar-border shrink-0">
          <div className="text-center px-3 py-1">
            <span className="block text-lg font-black font-mono text-sidebar-foreground">
              {metrics.totalModules}
            </span>
            <span className="text-[10px] text-sidebar-muted uppercase tracking-wider">Modul</span>
          </div>

          <div className="text-center px-3 py-1 border-l border-sidebar-border">
            <span className="block text-lg font-black font-mono text-primary">
              {metrics.totalFeatures}
            </span>
            <span className="text-[10px] text-sidebar-muted uppercase tracking-wider">Fitur</span>
          </div>

          <div className="text-center px-3 py-1 border-l border-sidebar-border">
            <span className="block text-lg font-black font-mono text-success">
              {metrics.totalTasks}
            </span>
            <span className="text-[10px] text-sidebar-muted uppercase tracking-wider">Tugas</span>
          </div>

          <div className="text-center px-3 py-1 border-l border-sidebar-border">
            <span className="block text-lg font-black font-mono text-warning">
              {formatManHours(metrics.totalManHours)}
            </span>
            <span className="text-[10px] text-sidebar-muted uppercase tracking-wider">Man-Hour</span>
          </div>
        </div>
      </div>
    </Card>
  );
});

ProjectOverviewCard.displayName = "ProjectOverviewCard";

export function ProjectOverviewCardSkeleton() {
  return (
    <Card className="p-5 bg-sidebar border-sidebar-border shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3.5 w-48 bg-sidebar-accent" />
          <Skeleton className="h-6 w-80 bg-sidebar-accent" />
          <Skeleton className="h-4 w-96 bg-sidebar-accent" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sidebar-accent/40 p-3 rounded-xl border border-sidebar-border shrink-0">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="text-center px-3 py-1 space-y-1">
              <Skeleton className="h-6 w-10 mx-auto bg-sidebar-accent" />
              <Skeleton className="h-2.5 w-12 mx-auto bg-sidebar-accent" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default ProjectOverviewCard;
