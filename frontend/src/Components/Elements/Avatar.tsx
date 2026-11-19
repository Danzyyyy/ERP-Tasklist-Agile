// src/Components/Elements/Avatar.tsx
// Anaheim Design Kit — Specimen 07: Avatar & User Presence (FigCraft 1:1 Implementation)
import React, { memo, useState } from "react";
import { cn } from "@/Utils/cn";

export type AvatarTone = "blue" | "indigo" | "purple" | "amber" | "emerald" | "slate";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "md" | "lg" | "xl";
  borderless?: boolean;
}

const sizeClasses = {
  xs: "size-6 text-[10px]",
  sm: "size-7 text-[10px]",
  default: "size-8 text-xs",
  md: "size-[34px] text-xs",
  lg: "size-9 text-xs",
  xl: "size-10 text-sm",
};

export const Avatar = memo<AvatarProps>(
  ({ className, size = "default", borderless = false, ...props }) => (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full font-bold select-none shadow-2xs",
        !borderless && "border-2 border-white",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = memo<AvatarImageProps>(({ className, onError, ...props }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <img
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "blue" | "indigo" | "purple" | "amber" | "emerald" | "slate";
  appearance?: "subtle" | "solid";
}

const subtleToneMap = {
  indigo: "bg-primary-subtle text-primary-subtle-foreground",
  purple: "bg-purple-subtle text-purple-subtle-foreground",
  blue: "bg-cyan-subtle text-cyan-subtle-foreground",
  amber: "bg-warning-subtle text-warning-subtle-foreground",
  emerald: "bg-success-subtle text-success-subtle-foreground",
  slate: "bg-muted text-muted-foreground",
};

const solidToneMap = {
  indigo: "bg-primary text-primary-foreground",
  purple: "bg-[#7C3AED] text-white",
  blue: "bg-[#2563EB] text-white",
  amber: "bg-[#D97706] text-white",
  emerald: "bg-[#059669] text-white",
  slate: "bg-muted-foreground text-white",
};

export const AvatarFallback = memo<AvatarFallbackProps>(
  ({ className, tone = "indigo", appearance = "subtle", children, ...props }) => (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-bold uppercase",
        appearance === "solid" ? solidToneMap[tone] : subtleToneMap[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
AvatarFallback.displayName = "AvatarFallback";

export default Avatar;
