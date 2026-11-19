// src/Features/Reports/Components/DeliverableAuditTable.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Badge } from "@/Components/Elements/Badge";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  DataTableSkeleton,
} from "@/Components/Elements/DataTable";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { formatManHours } from "@/Utils/formatters";
import type { Task } from "@/Types/task";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

export interface DeliverableAuditTableProps {
  tasks: Task[];
}

export const DeliverableAuditTable = memo<DeliverableAuditTableProps>(({ tasks }) => {
  return (
    <Card size="md" className="space-y-3">
      <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
        <FileSpreadsheet className="size-4 text-success" />
        <span>Matriks Verifikasi Deliverable Proyek</span>
      </h3>

      <DataTable>
        <DataTableHeader>
          <DataTableRow rowType="header">
            <DataTableHead>Kode Tugas</DataTableHead>
            <DataTableHead>Judul Deliverable</DataTableHead>
            <DataTableHead>Bobot</DataTableHead>
            <DataTableHead align="right">Estimasi Jam</DataTableHead>
            <DataTableHead>Tahapan</DataTableHead>
            <DataTableHead>Ceklis PM</DataTableHead>
            <DataTableHead>Pengesahan TL</DataTableHead>
          </DataTableRow>
        </DataTableHeader>
        <DataTableBody>
          {tasks.map((task) => (
            <DataTableRow key={task.id}>
              <DataTableCell tabular nowrap tone="primary" weight="bold">
                {task.task_code}
              </DataTableCell>
              <DataTableCell weight="medium">{task.title}</DataTableCell>
              <DataTableCell>
                <Badge variant={task.complexity_weight} size="sm">
                  {task.complexity_weight}
                </Badge>
              </DataTableCell>
              <DataTableCell align="right" tabular nowrap weight="semibold">
                {formatManHours(task.estimated_man_hours)}
              </DataTableCell>
              <DataTableCell>
                <Badge variant={task.status} size="sm" dot>
                  {task.status}
                </Badge>
              </DataTableCell>
              <DataTableCell>
                {task.is_pm_verified ? (
                  <span className="text-success-subtle-foreground font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="size-3 text-success" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[11px]">—</span>
                )}
              </DataTableCell>
              <DataTableCell>
                {task.is_tl_signed ? (
                  <span className="text-success-subtle-foreground font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="size-3 text-success" />
                    Disahkan
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[11px]">—</span>
                )}
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </Card>
  );
});

DeliverableAuditTable.displayName = "DeliverableAuditTable";

export function DeliverableAuditTableSkeleton() {
  return (
    <Card size="md" className="space-y-3">
      <Skeleton className="h-4 w-64" />
      <DataTableSkeleton rows={5} columns={7} />
    </Card>
  );
}

export default DeliverableAuditTable;
