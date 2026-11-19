// src/Features/Reviews/Components/ReviewTabs.tsx
import React, { memo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/Components/Elements/Tabs";
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
    <Tabs
      variant="pills"
      value={activeTab}
      onValueChange={(value) => onTabChange(value as ReviewTabType)}
    >
      <TabsList>
        <TabsTrigger value="ALL" tone="default">
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
        </TabsTrigger>

        <TabsTrigger value="CODE_REVIEW" tone="primary">
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
        </TabsTrigger>

        <TabsTrigger value="TESTING" tone="accent">
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
        </TabsTrigger>

        <TabsTrigger value="SIGNOFF" tone="success">
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
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
});

ReviewTabs.displayName = "ReviewTabs";
export default ReviewTabs;
