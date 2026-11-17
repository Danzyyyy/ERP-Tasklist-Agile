// src/Components/Elements/DropdownMenu.tsx
// Anaheim Design Kit — Specimen 04: Dropdown Menu (FigCraft 1:1 Implementation)
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  memo,
  type ReactNode,
} from "react";
import { cn } from "@/Utils/cn";
import { Button } from "./Button";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  close: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

export interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const next = typeof value === "function" ? value(open) : value;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    if (onOpenChange) {
      onOpenChange(next);
    }
  };

  const close = () => setOpen(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, close }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = memo<DropdownMenuTriggerProps>(
  ({ className, children, onClick, ...props }) => {
    const context = useContext(DropdownMenuContext);
    if (!context) {
      throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      context.setOpen((prev) => !prev);
      if (onClick) onClick(e);
    };

    return (
      <Button
        ref={context.triggerRef}
        type="button"
        variant="ghost"
        aria-haspopup="true"
        aria-expanded={context.open}
        onClick={handleClick}
        className={cn("inline-flex items-center justify-center cursor-pointer select-none h-auto p-0 hover:bg-transparent", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "center";
  sideOffset?: number;
}

export const DropdownMenuContent = memo<DropdownMenuContentProps>(
  ({ className, align = "right", children, ...props }) => {
    const context = useContext(DropdownMenuContext);
    const contentRef = useRef<HTMLDivElement | null>(null);

    if (!context) {
      throw new Error("DropdownMenuContent must be used within DropdownMenu");
    }

    useEffect(() => {
      if (!context.open) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          context.triggerRef.current &&
          !context.triggerRef.current.contains(target)
        ) {
          context.close();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          context.close();
          context.triggerRef.current?.focus();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [context]);

    if (!context.open) return null;

    const alignmentClasses = {
      left: "left-0 origin-top-left",
      right: "right-0 origin-top-right",
      center: "left-1/2 -translate-x-1/2 origin-top",
    };

    return (
      <div
        ref={contentRef}
        role="menu"
        aria-orientation="vertical"
        className={cn(
          "absolute z-50 mt-1.5 min-w-[180px] rounded-lg border border-border bg-card p-1 text-card-foreground shadow-xl transition-all animate-pop",
          alignmentClasses[align],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  destructive?: boolean;
  inset?: boolean;
}

export const DropdownMenuItem = memo<DropdownMenuItemProps>(
  ({ className, disabled, destructive, inset, children, onClick, ...props }) => {
    const context = useContext(DropdownMenuContext);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (onClick) onClick(e);
      context?.close();
    };

    return (
      <div
        role="menuitem"
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none select-none cursor-pointer transition-colors duration-150",
          "hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
          destructive &&
            "text-destructive hover:bg-[#fef2f2] hover:text-[#991b1b] focus:bg-[#fef2f2]",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuLabel = memo<React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }) => (
    <div
      className={cn(
        "px-2.5 py-1.5 text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider",
        className,
      )}
      {...props}
    />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = memo<React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }) => (
    <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  ),
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuShortcut = memo<React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }) => (
    <span
      className={cn(
        "ml-auto text-[10px] font-mono tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export default DropdownMenu;
