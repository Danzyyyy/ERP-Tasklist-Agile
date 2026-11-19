// src/Components/Elements/Card.tsx
// Anaheim Design Kit — Specimen 13: Card Containers (FigCraft 1:1 CVA Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const cardVariants = cva("border transition-all duration-150 shadow-2xs", {
  variants: {
    size: {
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
    },
    padding: {
      none: "p-0",
      xs: "px-3 py-2.5",
      sm: "p-3",
      compact: "p-3.5",
      md: "p-4",
      relaxed: "p-5",
      lg: "p-5 sm:p-6",
      empty: "py-12 px-6",
    },
    surface: {
      default: "bg-card text-card-foreground border-border",
      translucent: "bg-card/60 text-card-foreground border-border",
      muted: "bg-muted text-foreground border-border",
      subtle: "bg-primary-subtle text-foreground border-primary-subtle-border",
      primaryTint: "bg-primary/5 text-card-foreground border-primary ring-1 ring-primary",
      successOutline: "bg-card text-card-foreground border-success-subtle-border",
      warningOutline: "bg-card/60 text-card-foreground border-warning-subtle-border",
      dark: "bg-sidebar text-sidebar-foreground border-sidebar-border shadow-md",
      destructiveSubtle:
        "bg-destructive-subtle/15 text-card-foreground border-destructive-subtle-border",
      brandGradient:
        "bg-linear-to-r from-card via-card to-primary-subtle/40 text-card-foreground border-primary-subtle-border",
      darkGradient:
        "bg-linear-to-r from-sidebar via-sidebar to-primary-subtle-foreground text-sidebar-foreground border-sidebar-border shadow-md",
    },
    interactive: {
      none: "",
      subtle: "hover:shadow-xs",
      primary: "hover:border-primary/50 hover:shadow-xs",
      mutedPrimary: "hover:bg-muted/40 hover:border-primary/40",
      elevated: "hover:border-primary/50 hover:shadow-md",
      warning: "hover:border-warning/50 hover:shadow-xs",
      destructive: "hover:border-destructive/50 hover:shadow-xs",
    },
  },
  defaultVariants: {
    size: "md",
    surface: "default",
    interactive: "none",
  },
});

const DEFAULT_PADDING_BY_SIZE = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  selected?: boolean;
  dragOver?: boolean;
  dashed?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export const Card = memo<CardProps>(
  ({
    className,
    size = "md",
    padding,
    surface = "default",
    interactive = "none",
    selected = false,
    dragOver = false,
    dashed = false,
    ref,
    ...props
  }) => {
    const resolvedPadding = padding ?? DEFAULT_PADDING_BY_SIZE[size ?? "md"];

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ size, padding: resolvedPadding, surface, interactive }),
          dashed && "border-dashed",
          selected && "border-2 border-primary ring-1 ring-primary/20",
          dragOver && "border-primary ring-2 ring-primary/20 bg-primary-subtle/40",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export const CardHeader = memo<
  React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
>(({ className, ref, ...props }) => (
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
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = memo<
  React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
>(({ className, ref, ...props }) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = memo<
  React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
>(({ className, ref, ...props }) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-3 border-t border-border/60", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export default Card;
