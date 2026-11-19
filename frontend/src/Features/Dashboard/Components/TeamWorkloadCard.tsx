// src/Features/Dashboard/Components/TeamWorkloadCard.tsx
import React, { memo } from "react";
import { Avatar, AvatarFallback } from "@/Components/Elements/Avatar";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
import { ArrowUpRight } from "lucide-react";
import type { TeamMemberWorkload } from "../Hooks/useDashboardMetrics";

export interface TeamWorkloadCardProps {
  teamWorkload: TeamMemberWorkload[];
  onAlokasiKanban: () => void;
}

export const TeamWorkloadCard = memo<TeamWorkloadCardProps>(
  ({ teamWorkload, onAlokasiKanban }) => {
    return (
      <Card size="md" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Anggota Tim & PIC</h3>
          <span className="text-[11px] text-muted-foreground font-mono">Beban Kerja Aktif</span>
        </div>

        <div className="flex items-center justify-between gap-1">
          {teamWorkload.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <Avatar size="lg" borderless>
                  <AvatarFallback
                    appearance={m.tone === "indigo" || m.tone === "emerald" ? "solid" : "subtle"}
                    tone={m.tone}
                  >
                    {m.id}
                  </AvatarFallback>
                </Avatar>
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
          <Button type="button" variant="link" onClick={onAlokasiKanban} className="gap-1">
            <span>Alokasi Kanban</span>
            <ArrowUpRight className="size-3" />
          </Button>
        </div>
      </Card>
    );
  },
);

TeamWorkloadCard.displayName = "TeamWorkloadCard";
