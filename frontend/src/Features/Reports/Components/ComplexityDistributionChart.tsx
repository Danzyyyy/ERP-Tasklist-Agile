// src/Features/Reports/Components/ComplexityDistributionChart.tsx
import React, { memo } from "react";
import { Card } from "@/Components/Elements/Card";
import { Skeleton } from "@/Components/Elements/Skeleton";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

export interface ComplexityDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export const ComplexityDistributionChart = memo<ComplexityDistributionChartProps>(({ data }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <PieChartIcon className="size-4 text-warning" />
          <span>Proporsi Beban Kerja Berdasarkan Bobot</span>
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono">Man-Hour Total</span>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card, #fff)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  border: "1px solid var(--color-border, #e2e8f0)",
                  color: "var(--color-foreground, #0f172a)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-muted-foreground">Belum ada data bobot untuk grafik</div>
        )}
      </div>
    </Card>
  );
});

ComplexityDistributionChart.displayName = "ComplexityDistributionChart";

export function ComplexityDistributionChartSkeleton() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="h-64 w-full flex flex-col items-center justify-center gap-4">
        <Skeleton className="size-40 rounded-full" />
        <div className="flex gap-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </Card>
  );
}

export default ComplexityDistributionChart;

