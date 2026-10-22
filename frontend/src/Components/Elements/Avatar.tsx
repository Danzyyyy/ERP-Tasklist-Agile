// src/Components/Elements/Avatar.tsx
import React, { memo, useState } from "react";
import { cn } from "@/Utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "size-7 text-[10px]",
  default: "size-8 text-xs",
  lg: "size-10 text-sm",
};

export const Avatar = memo<AvatarProps>(({ className, size = "default", ...props }) => (
  <div
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full font-bold select-none",
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
  blue: "bg-blue-600 text-white",
  indigo: "bg-indigo-600 text-white",
  amber: "bg-amber-600 text-white",
  emerald: "bg-emerald-600 text-white",
  slate: "bg-slate-200 text-slate-700",
};

export const AvatarFallback = memo<AvatarFallbackProps>(
  ({ className, tone = "blue", children, ...props }) => (
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
