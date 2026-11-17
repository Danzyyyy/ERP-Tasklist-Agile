// src/Features/Reviews/Components/ReviewTabs.tsx
import React, { memo } from "react";
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
      <button
        type="button"
        onClick={() => onTabChange("ALL")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
          activeTab === "ALL"
            ? "bg-foreground text-background shadow-xs"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <span>Semua Pemeriksaan</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "ALL"
              ? "bg-background/20 text-background"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {tabCounts.all}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("CODE_REVIEW")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
          activeTab === "CODE_REVIEW"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <span>Code Review</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "CODE_REVIEW"
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-primary-subtle text-primary-subtle-foreground"
          }`}
        >
          {tabCounts.codeReview}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("TESTING")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
          activeTab === "TESTING"
            ? "bg-accent text-accent-foreground shadow-xs"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <span>QA Testing (Alur Rework)</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "TESTING"
              ? "bg-accent-foreground/20 text-accent-foreground"
              : "bg-accent-subtle text-accent-subtle-foreground"
          }`}
        >
          {tabCounts.testing}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("SIGNOFF")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
          activeTab === "SIGNOFF"
            ? "bg-success text-success-foreground shadow-xs"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <span>Gerbang Sign-Off (DoD)</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            activeTab === "SIGNOFF"
              ? "bg-success-foreground/20 text-success-foreground"
              : "bg-success-subtle text-success-subtle-foreground"
          }`}
        >
          {tabCounts.signoff}
        </span>
      </button>
    </div>
  );
});

ReviewTabs.displayName = "ReviewTabs";
export default ReviewTabs;

