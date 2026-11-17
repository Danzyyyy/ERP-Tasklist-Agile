// src/Features/Dashboard/Components/TeamWorkloadCard.tsx
import React, { memo } from "react";
import { Button } from "@/Components/Elements/Button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/Utils/cn";
import type { TeamMemberWorkload } from "../Hooks/useDashboardMetrics";

export interface TeamWorkloadCardProps {
  teamWorkload: TeamMemberWorkload[];
  onAlokasiKanban: () => void;
}

export const TeamWorkloadCard = memo<TeamWorkloadCardProps>(
  ({ teamWorkload, onAlokasiKanban }) => {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Anggota Tim & PIC</h3>
          <span className="text-[11px] text-muted-foreground font-mono">Beban Kerja Aktif</span>
        </div>

        <div className="flex items-center justify-between gap-1">
          {teamWorkload.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "size-9 rounded-full font-bold text-xs grid place-items-center shadow-2xs relative",
                  m.tone === "indigo" && "bg-primary text-primary-foreground",
                  m.tone === "emerald" && "bg-success text-success-foreground",
                  m.tone === "purple" && "bg-primary-subtle text-primary border border-primary-subtle-border",
                  m.tone === "blue" && "bg-status-dev-bg text-status-dev-text border border-primary-subtle-border",
                  m.tone === "amber" && "bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border",
                )}
              >
                {m.id}
                {m.activeTasks > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-primary-foreground font-mono text-[9px] font-bold grid place-items-center ring-2 ring-card">
                    {m.activeTasks}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{m.name}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{teamWorkload.length} anggota tim inti</span>
          <Button
            type="button"
            variant="link"
            onClick={onAlokasiKanban}
            className="font-semibold text-primary p-0 h-auto gap-1 text-xs"
          >
            <span>Alokasi Kanban</span>
            <ArrowUpRight className="size-3" />
          </Button>
        </div>
      </div>
    );
  },
);

TeamWorkloadCard.displayName = "TeamWorkloadCard";
