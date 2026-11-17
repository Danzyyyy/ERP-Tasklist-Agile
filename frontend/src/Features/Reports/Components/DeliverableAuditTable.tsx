// src/Features/Reports/Components/DeliverableAuditTable.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { formatManHours } from "@/Utils/formatters";
import type { Task } from "@/Types/task";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

export interface DeliverableAuditTableProps {
  tasks: Task[];
}

export const DeliverableAuditTable = memo<DeliverableAuditTableProps>(({ tasks }) => {
  return (
    <Card className="p-4 border-border bg-card">
      <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
        <FileSpreadsheet className="size-4 text-success" />
        <span>Matriks Verifikasi Deliverable Sprint 1 (Kelompok 4 / Kelas E)</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
              <th className="p-2.5">Kode Tugas</th>
              <th className="p-2.5">Judul Deliverable</th>
              <th className="p-2.5">Bobot</th>
              <th className="p-2.5">Estimasi Jam</th>
              <th className="p-2.5">Status Kanban</th>
              <th className="p-2.5">Ceklis PM (DoD)</th>
              <th className="p-2.5">Otorisasi TL (DONE)</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-border/70 hover:bg-muted/50">
                <td className="p-2.5 font-mono font-bold text-primary">{task.task_code}</td>
                <td className="p-2.5 font-medium text-foreground">{task.title}</td>
                <td className="p-2.5">
                  <Badge variant={task.complexity_weight} size="sm">
                    {task.complexity_weight}
                  </Badge>
                </td>
                <td className="p-2.5 font-mono font-bold text-foreground">
                  {formatManHours(task.estimated_man_hours)}
                </td>
                <td className="p-2.5">
                  <Badge variant={task.status} size="sm" dot>
                    {task.status}
                  </Badge>
                </td>
                <td className="p-2.5">
                  {task.is_pm_verified ? (
                    <span className="text-success-subtle-foreground font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="size-3 text-success" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">-</span>
                  )}
                </td>
                <td className="p-2.5">
                  {task.is_tl_signed ? (
                    <span className="text-success-subtle-foreground font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="size-3 text-success" />
                      Disahkan (DoD)
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

DeliverableAuditTable.displayName = "DeliverableAuditTable";

export function DeliverableAuditTableSkeleton() {
  return (
    <Card className="p-4 border-border bg-card space-y-3">
      <Skeleton className="h-4 w-72" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    </Card>
  );
}

export default DeliverableAuditTable;

