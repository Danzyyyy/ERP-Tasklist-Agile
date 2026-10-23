// src/Components/Elements/Alert.tsx
import React, { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border",
        destructive: "border-destructive-subtle-border bg-destructive-subtle text-destructive-subtle-foreground [&>svg]:text-destructive",
        warning: "border-warning-subtle-border bg-warning-subtle text-warning-subtle-foreground [&>svg]:text-warning",
        success: "border-success-subtle-border bg-success-subtle text-success-subtle-foreground [&>svg]:text-success",
        info: "border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground [&>svg]:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  ),
);
Alert.displayName = "Alert";

export const AlertTitle = memo<React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }) => (
    <h5
      className={cn("mb-1 font-bold leading-none tracking-tight text-xs", className)}
      {...props}
    >
      {children}
    </h5>
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = memo<React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }) => (
    <div className={cn("text-[11px] leading-relaxed opacity-90", className)} {...props}>
      {children}
    </div>
  ),
);
AlertDescription.displayName = "AlertDescription";
