// src/Features/Reports/Components/ModuleBurnoutChart.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

export interface ModuleBurnoutChartProps {
  data: Array<{
    name: string;
    fullName: string;
    Total: number;
    Done: number;
  }>;
}

export const ModuleBurnoutChart = memo<ModuleBurnoutChartProps>(({ data }) => {
  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <BarChart3 className="size-4 text-primary" />
          <span>Akumulasi Man-Hour per Modul (Total vs Done)</span>
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono">Satuan: Jam Kerja</span>
      </div>

      <div className="h-64 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card, #fff)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  border: "1px solid var(--color-border, #e2e8f0)",
                  color: "var(--color-foreground, #0f172a)",
                }}
              />
              <Bar dataKey="Total" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Total Jam" />
              <Bar
                dataKey="Done"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                name="Jam Selesai (Done)"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full grid place-items-center text-xs text-muted-foreground">
            Belum ada data modul untuk grafik
          </div>
        )}
      </div>
    </Card>
  );
});

ModuleBurnoutChart.displayName = "ModuleBurnoutChart";

export function ModuleBurnoutChartSkeleton() {
  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </Card>
  );
}

export default ModuleBurnoutChart;

