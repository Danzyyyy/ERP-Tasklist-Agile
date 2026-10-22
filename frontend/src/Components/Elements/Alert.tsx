// src/Components/Elements/Alert.tsx
import React, { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const alertVariants = cva(
  "relative w-full rounded-xl border p-4 text-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-900 border-slate-200",
        destructive: "border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600",
        warning: "border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600",
        success: "border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600",
        info: "border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600",
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
