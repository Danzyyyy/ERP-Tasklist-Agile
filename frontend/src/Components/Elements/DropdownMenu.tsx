// src/Components/Elements/DropdownMenu.tsx
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

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      <button
        ref={context.triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={context.open}
        onClick={handleClick}
        className={cn("inline-flex items-center justify-center cursor-pointer", className)}
        {...props}
      >
        {children}
      </button>
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

    // Handle outside click and Escape key
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
          "absolute z-50 mt-1.5 min-w-[190px] rounded-xl border border-slate-200 bg-white p-1 text-slate-800 shadow-xl transition-all animate-[pop_0.15s_ease]",
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
          "relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none select-none cursor-pointer transition-colors",
          "hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900",
          destructive && "text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50",
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

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const DropdownMenuLabel = memo<DropdownMenuLabelProps>(
  ({ className, inset, ...props }) => (
    <div
      className={cn(
        "px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuSeparator = memo<React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }) => (
    <div className={cn("-mx-1 my-1 h-px bg-slate-100", className)} {...props} />
  ),
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuShortcut = memo<React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }) => (
    <span
      className={cn("ml-auto text-[10px] font-mono tracking-widest text-slate-400", className)}
      {...props}
    />
  ),
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
