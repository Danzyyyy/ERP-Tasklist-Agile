// src/Features/Dashboard/Components/SprintReadinessCard.tsx
import React, { memo } from "react";
import { Badge } from "@/Components/Elements/Badge";
import { Card } from "@/Components/Elements/Card";
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
      <Card size="md" padding="relaxed" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" />
            <h3 className="text-sm font-bold text-foreground">
              Tata Kelola &amp; Kesiapan Eksekusi Proyek
            </h3>
          </div>
          {readyForExecution ? (
            <Badge variant="success" size="sm" casing="normal">
              <CheckCircle2 className="size-3 text-success" />
              Siap Eksekusi Agile
            </Badge>
          ) : (
            <Badge variant="warning" size="sm" casing="normal">
              <Clock className="size-3 text-warning-subtle-foreground" />
              Menunggu Kickoff MoM
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-md border border-border bg-muted/40 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              KODE PROYEK AKTIF
            </p>
            <p className="text-xs font-bold text-foreground truncate">{activeProjectCode}</p>
            <p className="text-[11px] text-muted-foreground truncate">{activeProjectClient}</p>
          </div>

          <div className="p-3 rounded-md border border-border bg-muted/40 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              KICKOFF MEETING &amp; MOM
            </p>
            <p className="text-xs font-bold text-foreground truncate">{momStatusText}</p>
            <p className="text-[11px] text-muted-foreground truncate">{kickoffIdText}</p>
          </div>

          <div className="p-3 rounded-md border border-border bg-muted/40 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              STATUS REGISTRASI PROYEK
            </p>
            <p className="text-xs font-bold text-success-subtle-foreground">{projectStatus}</p>
            <p className="text-[11px] text-muted-foreground">PO Diterima · Dokumen Lengkap</p>
          </div>
        </div>
      </Card>
    );
  },
);

SprintReadinessCard.displayName = "SprintReadinessCard";
