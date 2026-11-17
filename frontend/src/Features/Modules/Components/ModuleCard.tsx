// src/Features/Modules/Components/ModuleCard.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/Components/Elements/Card";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { formatManHours } from "@/Utils/formatters";
import type { Module, Task } from "@/Types/task";
import { Plus, ArrowRight, Info } from "lucide-react";

export interface ModuleCardProps {
  module: Module;
  tasks: Task[];
  canManage: boolean;
  onAddFeature: (moduleId: string) => void;
}

export const ModuleCard = memo<ModuleCardProps>(({ module: mod, tasks, canManage, onAddFeature }) => {
  const navigate = useNavigate();
  const moduleTasks = tasks.filter((t) => t.module_id === mod.id);
  const moduleHours = moduleTasks.reduce(
    (acc, t) => acc + (Number(t.estimated_man_hours) || 0),
    0,
  );
  const features = mod.features || [];

  return (
    <Card className="p-5 border-border bg-card shadow-2xs hover:border-border transition-all">
      {/* Module Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-border/70">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold bg-primary-subtle text-primary-subtle-foreground px-2 py-0.5 rounded border border-primary-subtle-border">
              {mod.code}
            </span>
            <h4 className="text-sm font-bold text-foreground truncate">{mod.name}</h4>
            <Badge variant="outline" className="text-[10px]">
              {features.length} Fitur
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {moduleTasks.length} Tugas ({formatManHours(moduleHours)})
            </Badge>
          </div>

          {mod.description && (
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              {mod.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddFeature(mod.id)}
              className="text-xs h-8"
            >
              <Plus className="size-3 mr-1 text-primary" />
              Tambah Fitur
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`${ROUTE_PATHS.TASKS}?module_id=${mod.id}`)}
            className="text-xs h-8 text-primary hover:text-primary-hover hover:bg-primary-subtle"
          >
            <span>Lihat Tugas</span>
            <ArrowRight className="size-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* Features Sub-List */}
      <div className="pt-4">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Fitur di dalam Modul Ini (SOP-05 / WI-04)</span>
          <span className="font-normal lowercase text-muted-foreground">
            Level fitur bersifat opsional (Q-13)
          </span>
        </div>

        {features.length === 0 ? (
          <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-muted-foreground shrink-0" />
              <span>
                Modul ini belum memiliki fitur terdaftar. Tugas dapat langsung bernaung di bawah
                modul.
              </span>
            </div>
            {canManage && (
              <button
                type="button"
                onClick={() => onAddFeature(mod.id)}
                className="text-xs font-semibold text-primary hover:underline shrink-0 cursor-pointer"
              >
                + Tambah Fitur
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((ftr) => {
              const ftrTasks = tasks.filter((t) => t.feature_id === ftr.id);
              const ftrHours = ftrTasks.reduce(
                (acc, t) => acc + (Number(t.estimated_man_hours) || 0),
                0,
              );

              return (
                <div
                  key={ftr.id}
                  className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/40 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary-subtle-foreground bg-primary-subtle px-2 py-0.5 rounded border border-primary-subtle-border truncate">
                        {ftr.code}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {ftrTasks.length} Tugas · {formatManHours(ftrHours)}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-foreground mt-2 leading-snug">
                      {ftr.name}
                    </h5>

                    {ftr.description && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {ftr.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-border/80 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ID: {ftr.id.slice(0, 8)}...
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `${ROUTE_PATHS.TASKS}?module_id=${mod.id}&feature_id=${ftr.id}`,
                        )
                      }
                      className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer"
                    >
                      <span>Filter Tasklist</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
});

ModuleCard.displayName = "ModuleCard";

export function ModuleCardSkeleton() {
  return (
    <Card className="p-5 border-border bg-card shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-border/70">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="p-3.5 rounded-xl border border-border bg-card/60 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ModuleCard;

