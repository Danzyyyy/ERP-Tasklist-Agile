// src/Components/Elements/DataTable.tsx
// Anaheim Design Kit — Specimen 11: Standard Data Table (Card MD Base + DataTableRow · No Checkbox)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card } from "./Card";
import { Skeleton } from "./Skeleton";
import { cn } from "@/Utils/cn";

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  footer?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export const DataTable = memo<DataTableProps>(
  ({ className, children, footer, ref, ...props }) => {
    return (
      <Card
        ref={ref}
        size="md"
        surface="default"
        padding="none"
        className={cn("overflow-hidden", className)}
        {...props}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">{children}</table>
        </div>
        {footer && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-border bg-muted/60 px-4 py-2.5 text-xs">
            {footer}
          </div>
        )}
      </Card>
    );
  },
);
DataTable.displayName = "DataTable";

export const DataTableHeader = memo<
  React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }
>(({ className, ref, ...props }) => <thead ref={ref} className={cn(className)} {...props} />);
DataTableHeader.displayName = "DataTableHeader";

export const DataTableBody = memo<
  React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }
>(({ className, ref, ...props }) => (
  <tbody ref={ref} className={cn("divide-y divide-border/60 bg-card", className)} {...props} />
));
DataTableBody.displayName = "DataTableBody";

export const dataTableRowVariants = cva("transition-colors duration-150", {
  variants: {
    rowType: {
      header: "bg-background border-b border-border",
      default: "bg-card hover:bg-background/80",
      hover: "bg-background",
      active: "bg-primary-subtle/80 shadow-[inset_2px_0_0_0_var(--primary)]",
      treeGroup: "bg-background/90 border-b border-border font-semibold select-none",
      treeSubgroup: "bg-card border-b border-border/70 font-medium select-none",
      treeLeaf: "bg-card border-b border-border/60 hover:bg-background/80 cursor-pointer group",
    },
  },
  defaultVariants: {
    rowType: "default",
  },
});

export interface DataTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof dataTableRowVariants> {
  ref?: React.Ref<HTMLTableRowElement>;
}

export const DataTableRow = memo<DataTableRowProps>(({ className, rowType, ref, ...props }) => (
  <tr ref={ref} className={cn(dataTableRowVariants({ rowType }), className)} {...props} />
));
DataTableRow.displayName = "DataTableRow";

export interface DataTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  ref?: React.Ref<HTMLTableCellElement>;
}

export const DataTableHead = memo<DataTableHeadProps>(
  ({ className, align = "left", ref, ...props }) => (
    <th
      ref={ref}
      className={cn(
        "h-9 px-3.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  ),
);
DataTableHead.displayName = "DataTableHead";

const dataTableCellVariants = cva("px-3.5 align-middle", {
  variants: {
    density: {
      default: "py-2.5",
      compact: "py-2",
      tight: "py-1.5",
    },
    size: {
      default: "text-xs",
      xs: "text-[11px]",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive-subtle-foreground",
      success: "text-success-subtle-foreground",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    density: "default",
    size: "default",
    tone: "default",
    weight: "normal",
    align: "left",
  },
});

export interface DataTableCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align">,
    VariantProps<typeof dataTableCellVariants> {
  tabular?: boolean;
  nowrap?: boolean;
  ref?: React.Ref<HTMLTableCellElement>;
}

export const DataTableCell = memo<DataTableCellProps>(
  ({
    className,
    density,
    size,
    tone,
    weight,
    align,
    tabular = false,
    nowrap = false,
    ref,
    ...props
  }) => (
    <td
      ref={ref}
      className={cn(
        dataTableCellVariants({ density, size, tone, weight, align }),
        tabular && "font-mono tabular-nums",
        nowrap && "whitespace-nowrap",
        className,
      )}
      {...props}
    />
  ),
);
DataTableCell.displayName = "DataTableCell";

export interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
  rows = 5,
  columns = 5,
  className,
}) => (
  <DataTable className={className}>
    <DataTableHeader>
      <DataTableRow rowType="header">
        {Array.from({ length: columns }).map((_, idx) => (
          <DataTableHead key={idx}>
            <Skeleton className="h-3 w-20" />
          </DataTableHead>
        ))}
      </DataTableRow>
    </DataTableHeader>
    <DataTableBody>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <DataTableRow key={rIdx}>
          {Array.from({ length: columns }).map((_, cIdx) => (
            <DataTableCell key={cIdx}>
              <Skeleton className={cn("h-4", cIdx === 0 ? "w-48" : "w-20")} />
            </DataTableCell>
          ))}
        </DataTableRow>
      ))}
    </DataTableBody>
  </DataTable>
);

export default DataTable;
