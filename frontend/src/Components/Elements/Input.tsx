// src/Components/Elements/Input.tsx
// Anaheim Design Kit — Specimen 02: Input (FigCraft 1:1 CVA Implementation)
import React, { memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export const inputVariants = cva(
  "flex w-full transition-colors duration-150 placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground/60 disabled:border-border",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-card text-foreground shadow-2xs focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        subtle:
          "border border-input bg-background text-foreground shadow-2xs focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        ghost:
          "border-0 bg-transparent text-foreground shadow-none p-0 h-auto leading-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent",
      },
      sizeVariant: {
        sm: "h-8 px-2.5 py-1 text-xs rounded-sm",
        default: "h-9 px-3 py-1.5 text-xs rounded-md",
        lg: "h-[42px] px-4 py-2 text-sm rounded-lg",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        className: "h-auto p-0 rounded-none text-xs",
      },
    ],
    defaultVariants: {
      variant: "default",
      sizeVariant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  mono?: boolean;
  uppercase?: boolean;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export const Input = memo<InputProps>(
  ({
    className,
    type = "text",
    variant,
    sizeVariant,
    error,
    mono = false,
    uppercase = false,
    leftIcon,
    rightElement,
    ref,
    ...props
  }) => {
    const inputEl = (
      <input
        ref={ref}
        type={type}
        className={cn(
          inputVariants({ variant, sizeVariant }),
          mono && "font-mono",
          uppercase && "uppercase font-bold",
          leftIcon && "pl-8",
          rightElement && "pr-9",
          error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive bg-destructive-subtle/30 text-destructive",
          className,
        )}
        {...props}
      />
    );

    if (!leftIcon && !rightElement) {
      return inputEl;
    }

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 flex items-center">
            {leftIcon}
          </span>
        )}
        {inputEl}
        {rightElement && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex items-center">
            {rightElement}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
