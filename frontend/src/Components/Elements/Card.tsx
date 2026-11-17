// src/Components/Elements/Card.tsx
// Anaheim Design Kit — Specimen 13: Card Containers (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cn } from "@/Utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  surface?: "default" | "muted" | "subtle" | "dark";
  selected?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export const Card = memo<CardProps>(
  ({ className, size = "md", surface = "default", selected = false, ref, ...props }) => {
    const sizeClasses = {
      sm: "rounded-md p-3",
      md: "rounded-lg p-4",
      lg: "rounded-xl p-6",
    };

    const surfaceClasses = {
      default: "bg-card text-card-foreground border-border",
      muted: "bg-muted text-foreground border-border",
      subtle: "bg-primary-subtle text-foreground border-primary-subtle-border",
      dark: "bg-sidebar text-sidebar-foreground border-sidebar-border",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border transition-all duration-150 shadow-2xs",
          sizeClasses[size],
          surfaceClasses[surface],
          selected && "border-2 border-primary ring-1 ring-primary/20",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export const CardHeader = memo<CardProps>(({ className, ref, ...props }) => (
  <div ref={ref} className={cn("flex flex-col space-y-1 pb-3", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = memo<
  React.HTMLAttributes<HTMLHeadingElement> & { ref?: React.Ref<HTMLHeadingElement> }
>(({ className, ref, ...props }) => (
  <h3
    ref={ref}
    className={cn("font-bold text-sm text-foreground leading-snug tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = memo<
  React.HTMLAttributes<HTMLParagraphElement> & { ref?: React.Ref<HTMLParagraphElement> }
>(({ className, ref, ...props }) => (
  <p ref={ref} className={cn("text-xs text-muted-foreground leading-relaxed", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = memo<CardProps>(({ className, ref, ...props }) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = memo<CardProps>(({ className, ref, ...props }) => (
  <div ref={ref} className={cn("flex items-center pt-3 border-t border-border/60", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export default Card;
