// src/Features/Dashboard/Components/SprintReadinessCard.tsx
import React, { memo } from "react";
import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export interface SprintReadinessCardProps {
  readyForExecution?: boolean;
  activeProjectCode: string;
  activeProjectClient: string;
  momStatusText: string;
  kickoffIdText: string;
  projectStatus: string;
}

export const SprintReadinessCard = memo<SprintReadinessCardProps>(
  ({
    readyForExecution = false,
    activeProjectCode,
    activeProjectClient,
    momStatusText,
    kickoffIdText,
    projectStatus,
  }) => {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" />
            <h3 className="text-sm font-bold text-foreground">
              Tata Kelola & Kesiapan Eksekusi (Modul E-3)
            </h3>
          </div>
          {readyForExecution ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-subtle text-success-subtle-foreground border border-success-subtle-border flex items-center gap-1">
              <CheckCircle2 className="size-3 text-success" />
              Siap Eksekusi Agile (P6 Passed)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warning-subtle text-warning-subtle-foreground border border-warning-subtle-border flex items-center gap-1">
              <Clock className="size-3 text-warning-subtle-foreground" />
              Pending Kickoff MoM
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              KODE PROYEK D-1
            </p>
            <p className="text-xs font-bold text-foreground truncate">{activeProjectCode}</p>
            <p className="text-[11px] text-muted-foreground truncate">{activeProjectClient}</p>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              KICKOFF MEETING & MOM
            </p>
            <p className="text-xs font-bold text-foreground truncate">{momStatusText}</p>
            <p className="text-[11px] text-muted-foreground truncate">{kickoffIdText}</p>
          </div>

          <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              STATUS INTAKE D-1
            </p>
            <p className="text-xs font-bold text-success-subtle-foreground">{projectStatus}</p>
            <p className="text-[11px] text-muted-foreground">PO Diterima · Dokumen Lengkap</p>
          </div>
        </div>
      </div>
    );
  },
);

SprintReadinessCard.displayName = "SprintReadinessCard";
