// src/Components/Elements/Card.tsx
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = memo<CardProps>(({ className, ...props }) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-2xs transition-all",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = memo<CardProps>(({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1 p-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = memo<React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }) => (
  <h3 className={cn("font-bold text-sm text-foreground leading-snug tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = memo<React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }) => (
  <p className={cn("text-xs text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = memo<CardProps>(({ className, ...props }) => (
  <div className={cn("p-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = memo<CardProps>(({ className, ...props }) => (
  <div className={cn("flex items-center p-4 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";
