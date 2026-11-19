// src/Components/Elements/Alert.tsx
// Anaheim Design Kit — Specimen 06: Alert Notification Banners (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const alertVariants = cva(
  "relative w-full rounded-lg border text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg]:shrink-0 transition-colors shadow-2xs",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border [&>svg]:text-foreground",
        destructive:
          "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-subtle-border [&>svg]:text-destructive-subtle-foreground",
        warning:
          "bg-warning-subtle text-warning-subtle-foreground border-warning-subtle-border [&>svg]:text-warning-subtle-foreground",
        success:
          "bg-success-subtle text-success-subtle-foreground border-success-subtle-border [&>svg]:text-success-subtle-foreground",
        successSoft:
          "bg-success-subtle/40 text-foreground border-success-subtle-border [&>svg]:text-success",
        info:
          "bg-cyan-subtle text-cyan-subtle-foreground border-cyan-subtle-border [&>svg]:text-cyan-subtle-foreground",
      },
      size: {
        sm: "p-3",
        default: "p-3.5 sm:p-4",
        lg: "p-5 sm:p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  ref?: React.Ref<HTMLDivElement>;
}

export const Alert = memo<AlertProps>(({ className, variant, size, children, ref, ...props }) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant, size }), className)} {...props}>
    {children}
  </div>
));
Alert.displayName = "Alert";

export const AlertTitle = memo<React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }) => (
    <h5 className={cn("mb-1 font-bold leading-none tracking-tight text-xs", className)} {...props}>
      {children}
    </h5>
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = memo<React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }) => (
    <div className={cn("text-[11.5px] leading-relaxed opacity-90", className)} {...props}>
      {children}
    </div>
  ),
);
AlertDescription.displayName = "AlertDescription";
export default Alert;
