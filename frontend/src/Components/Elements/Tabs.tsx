// src/Components/Elements/Tabs.tsx
// Anaheim Design Kit — Specimen 10: Navigation & Tabs (FigCraft 1:1 Implementation)
import React, { createContext, useContext, useState, memo, type ReactNode } from "react";
import { cn } from "@/Utils/cn";
import { Button } from "./Button";

interface TabsContextType {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
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
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }) => (
  <div
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md bg-[#f1f5f9] p-1 text-muted-foreground border border-border/60",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = memo<TabsTriggerProps>(({ className, value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = context.value === value;

  return (
    <Button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onValueChange(value)}
      variant="ghost"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3.5 py-1 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 h-auto",
        isActive
          ? "bg-white text-foreground shadow-xs font-bold hover:bg-white hover:text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-white/40",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = memo<TabsContentProps>(({ className, value, children, ...props }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("mt-3 outline-none animate-fade", className)}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";
export default Tabs;
