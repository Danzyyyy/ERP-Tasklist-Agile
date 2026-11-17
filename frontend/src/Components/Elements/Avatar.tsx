// src/Components/Elements/Avatar.tsx
// Anaheim Design Kit — Specimen 07: Avatar & User Presence (FigCraft 1:1 Implementation)
import React, { memo, useState } from "react";
import { cn } from "@/Utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "size-7 text-[10.5px]",
  default: "size-8 text-xs",
  lg: "size-10 text-sm",
};

export const Avatar = memo<AvatarProps>(({ className, size = "default", ...props }) => (
  <div
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full font-bold select-none border-2 border-white shadow-2xs",
      sizeClasses[size],
      className,
    )}
    {...props}
  />
));
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
  tone?: "blue" | "indigo" | "amber" | "emerald" | "slate";
}

const toneMap = {
  indigo: "bg-[#eef2ff] text-[#4338ca]",
  blue: "bg-[#f0f9ff] text-[#0369a1]",
  amber: "bg-[#fffbeb] text-[#b45309]",
  emerald: "bg-[#ecfdf5] text-[#065f46]",
  slate: "bg-[#f1f5f9] text-[#475569]",
};

export const AvatarFallback = memo<AvatarFallbackProps>(
  ({ className, tone = "indigo", children, ...props }) => (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-bold uppercase",
        toneMap[tone],
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
