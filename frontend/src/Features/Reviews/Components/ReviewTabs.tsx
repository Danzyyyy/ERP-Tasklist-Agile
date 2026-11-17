// src/Features/Reviews/Components/ReviewTabs.tsx
import React, { memo } from "react";
import { Button } from "@/Components/Elements/Button";
import { cn } from "@/Utils/cn";
import type { ReviewTabType } from "../Hooks/useReviewsOverview";

export interface ReviewTabsProps {
  activeTab: ReviewTabType;
  tabCounts: {
    all: number;
    codeReview: number;
    testing: number;
    signoff: number;
  };
  onTabChange: (tab: ReviewTabType) => void;
}

export const ReviewTabs = memo<ReviewTabsProps>(({ activeTab, tabCounts, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onTabChange("ALL")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 h-auto rounded-lg text-xs font-bold transition-all shrink-0",
          activeTab === "ALL"
            ? "bg-foreground text-background shadow-xs hover:bg-foreground hover:text-background"
            : "text-muted-foreground hover:bg-muted",
        )}
      >
        <span>Semua Pemeriksaan</span>
        <span
          className={cn(
            "px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold",
            activeTab === "ALL"
              ? "bg-background/20 text-background"
              : "bg-muted text-muted-foreground",
          )}
        >
          {tabCounts.all}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onTabChange("CODE_REVIEW")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 h-auto rounded-lg text-xs font-bold transition-all shrink-0",
          activeTab === "CODE_REVIEW"
            ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover hover:text-primary-foreground"
            : "text-muted-foreground hover:bg-muted",
        )}
      >
        <span>Code Review</span>
        <span
          className={cn(
            "px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold",
            activeTab === "CODE_REVIEW"
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-primary-subtle text-primary-subtle-foreground",
          )}
        >
          {tabCounts.codeReview}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onTabChange("TESTING")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 h-auto rounded-lg text-xs font-bold transition-all shrink-0",
          activeTab === "TESTING"
            ? "bg-accent text-accent-foreground shadow-xs hover:bg-accent hover:text-accent-foreground"
            : "text-muted-foreground hover:bg-muted",
        )}
      >
        <span>QA Testing (Alur Rework)</span>
        <span
          className={cn(
            "px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold",
            activeTab === "TESTING"
              ? "bg-accent-foreground/20 text-accent-foreground"
              : "bg-accent-subtle text-accent-subtle-foreground",
          )}
        >
          {tabCounts.testing}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => onTabChange("SIGNOFF")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 h-auto rounded-lg text-xs font-bold transition-all shrink-0",
          activeTab === "SIGNOFF"
            ? "bg-success text-success-foreground shadow-xs hover:bg-success hover:text-success-foreground"
            : "text-muted-foreground hover:bg-muted",
        )}
      >
        <span>Gerbang Sign-Off (DoD)</span>
        <span
          className={cn(
            "px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold",
            activeTab === "SIGNOFF"
              ? "bg-success-foreground/20 text-success-foreground"
              : "bg-success-subtle text-success-subtle-foreground",
          )}
        >
          {tabCounts.signoff}
        </span>
      </Button>
    </div>
  );
});

ReviewTabs.displayName = "ReviewTabs";
export default ReviewTabs;
