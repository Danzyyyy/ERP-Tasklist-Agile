// src/Components/Elements/TreeTable.tsx
// Anaheim Design Kit — Specimen 12: Hierarchical Tree Table Row (Folder/File · Indented Rails · No Checkbox)
import React, { memo } from "react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { DataTableRow } from "./DataTable";
import { Skeleton } from "./Skeleton";
import { cn } from "@/Utils/cn";

export type TreeTableRowLevel = "group" | "subgroup" | "item-direct" | "item-nested";

export interface TreeTableRowProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, "title"> {
  level: TreeTableRowLevel;
  isExpanded?: boolean;
  onToggle?: () => void;
  code?: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  primaryColSpan?: number;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLTableRowElement>;
}

const DEPTH_BY_LEVEL: Record<TreeTableRowLevel, number> = {
  group: 0,
  subgroup: 1,
  "item-direct": 1,
  "item-nested": 2,
};

export const TreeTableRow = memo<TreeTableRowProps>(
  ({
    level,
    isExpanded = true,
    onToggle,
    code,
    title,
    meta,
    primaryColSpan,
    children,
    className,
    onClick,
    ref,
    ...props
  }) => {
    const depth = DEPTH_BY_LEVEL[level];
    const isBranch = level === "group" || level === "subgroup";
    const isGroup = level === "group";

    const rowType = isGroup ? "treeGroup" : level === "subgroup" ? "treeSubgroup" : "treeLeaf";

    return (
      <DataTableRow ref={ref} rowType={rowType} onClick={onClick} className={className} {...props}>
        <td
          colSpan={primaryColSpan}
          className={cn(
            "px-3.5 align-middle",
            isGroup ? "py-2" : level === "subgroup" ? "py-1.5" : "py-2",
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Vertical Indented Tree Guide Rails */}
            {depth > 0 && (
              <div className="flex items-stretch self-stretch shrink-0" aria-hidden="true">
                {Array.from({ length: depth }).map((_, idx) => (
                  <span
                    key={idx}
                    className="w-[18px] flex items-center pl-1.5 shrink-0"
                  >
                    <span className="w-px h-6 bg-border block" />
                  </span>
                ))}
              </div>
            )}

            {/* Expand/Collapse Chevron ONLY for Folder Branches (Module / Optional Feature) */}
            {isBranch && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle?.();
                }}
                aria-label={isExpanded ? "Tutup grup" : "Buka grup"}
                className="inline-flex items-center justify-center size-4 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
              </button>
            )}

            {/* Semantic Folder vs File Icon */}
            {isBranch ? (
              <Folder
                className={cn(
                  "size-3.5 shrink-0",
                  isGroup && isExpanded ? "text-primary" : "text-muted-foreground",
                )}
              />
            ) : (
              <File className="size-3.5 shrink-0 text-muted-foreground/80 group-hover:text-primary transition-colors" />
            )}

            {/* Item Code */}
            {code && (
              <span
                className={cn(
                  "font-mono tabular-nums shrink-0",
                  isGroup
                    ? isExpanded
                      ? "text-[11px] font-semibold text-primary"
                      : "text-[11px] font-semibold text-muted-foreground"
                    : level === "subgroup"
                      ? "text-[11px] font-medium text-muted-foreground"
                      : "text-[11px] font-medium text-muted-foreground w-[58px]",
                )}
              >
                {code}
              </span>
            )}

            {/* Title */}
            <span
              onClick={
                isBranch
                  ? (e) => {
                      e.stopPropagation();
                      onToggle?.();
                    }
                  : undefined
              }
              className={cn(
                "truncate transition-colors",
                isGroup
                  ? "text-xs font-semibold text-foreground hover:text-primary cursor-pointer"
                  : level === "subgroup"
                    ? "text-xs font-medium text-foreground hover:text-primary cursor-pointer"
                    : "text-xs font-medium text-foreground group-hover:text-primary",
              )}
            >
              {title}
            </span>

            {/* Optional Metadata Subtitle */}
            {meta && (
              <span className="text-[11px] text-muted-foreground font-normal shrink-0">
                · {meta}
              </span>
            )}
          </div>
        </td>

        {children}
      </DataTableRow>
    );
  },
);
TreeTableRow.displayName = "TreeTableRow";

export const TreeTableSkeletonRows: React.FC<{ count?: number; columns?: number }> = ({
  count = 6,
  columns = 8,
}) => (
  <>
    {Array.from({ length: count }).map((_, idx) => (
      <DataTableRow key={idx}>
        {Array.from({ length: columns }).map((_, cIdx) => (
          <td key={cIdx} className="py-2.5 px-3.5">
            <Skeleton className={cn("h-4", cIdx === 0 ? "w-56" : "w-14")} />
          </td>
        ))}
      </DataTableRow>
    ))}
  </>
);

export default TreeTableRow;
