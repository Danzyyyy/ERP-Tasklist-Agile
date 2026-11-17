// src/Components/Elements/Alert.tsx
// Anaheim Design Kit — Specimen 06: Alert Notification Banners (FigCraft 1:1 Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const alertVariants = cva(
  "relative w-full rounded-lg border p-3.5 sm:p-4 text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-2px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg]:shrink-0 transition-colors shadow-2xs",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border [&>svg]:text-foreground",
        destructive:
          "bg-[#fef2f2] text-[#991b1b] border-[#fecaca] [&>svg]:text-[#991b1b]",
        warning:
          "bg-[#fffbeb] text-[#92400e] border-[#fde68a] [&>svg]:text-[#92400e]",
        success:
          "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0] [&>svg]:text-[#065f46]",
        info:
          "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd] [&>svg]:text-[#0369a1]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  ref?: React.Ref<HTMLDivElement>;
}

export const Alert = memo<AlertProps>(({ className, variant, children, ref, ...props }) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
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
