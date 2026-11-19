// src/Components/Elements/Tabs.tsx
// Anaheim Design Kit — Specimen 10: Navigation & Tabs (FigCraft 1:1 CVA Implementation)
import React, { createContext, useContext, useState, memo, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";

export type TabsVariant = "segmented" | "underline" | "pills";

interface TabsContextType {
  value: string;
  onValueChange: (val: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  children: ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  variant = "segmented",
  children,
  className,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, variant }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const tabsListVariants = cva("items-center", {
  variants: {
    variant: {
      segmented:
        "inline-flex h-9 justify-center rounded-md bg-muted p-1 text-muted-foreground border border-border/60",
      underline:
        "flex gap-5 sm:gap-6 border-b border-border text-xs font-semibold overflow-x-auto scrollbar-none",
      pills:
        "flex gap-2 border-b border-border pb-2 overflow-x-auto scrollbar-none",
    },
  },
  defaultVariants: {
    variant: "segmented",
  },
});

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
  bordered?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export const TabsList = memo<TabsListProps>(
  ({ className, variant, bordered = true, ref, ...props }) => {
    const context = useContext(TabsContext);
    const resolvedVariant = variant ?? context?.variant ?? "segmented";

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          tabsListVariants({ variant: resolvedVariant }),
          !bordered && "border-b-0 pb-0",
          className,
        )}
        {...props}
      />
    );
  },
);
TabsList.displayName = "TabsList";

const pillToneActiveMap = {
  default: "bg-foreground text-background shadow-xs",
  primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover",
  accent: "bg-accent text-accent-foreground shadow-xs",
  success: "bg-success text-success-foreground shadow-xs",
} as const;

export type TabsTriggerTone = keyof typeof pillToneActiveMap;

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  tone?: TabsTriggerTone;
  ref?: React.Ref<HTMLButtonElement>;
}

export const TabsTrigger = memo<TabsTriggerProps>(
  ({ className, value, tone = "default", children, ref, ...props }) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;
    const { variant } = context;

    const variantClasses =
      variant === "underline"
        ? cn(
            "relative inline-flex items-center gap-2 whitespace-nowrap pb-2.5 text-xs transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            isActive
              ? "text-primary border-b-2 border-primary font-bold"
              : "text-muted-foreground hover:text-foreground font-semibold",
          )
        : variant === "pills"
          ? cn(
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold transition-all cursor-pointer select-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? pillToneActiveMap[tone]
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          : cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3.5 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "bg-card text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50",
            );

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => context.onValueChange(value)}
        className={cn(variantClasses, className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = memo<TabsContentProps>(({ className, value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div role="tabpanel" className={cn("mt-3 outline-none animate-fade", className)} {...props}>
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";
export default Tabs;
