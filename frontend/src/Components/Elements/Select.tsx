// src/Components/Elements/Select.tsx
// Anaheim Design Kit — Specimen 04: Select & Dropdown Menu (FigCraft 1:1 Implementation)
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useImperativeHandle,
  memo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/Utils/cn";
import { ChevronDown, Check } from "lucide-react";

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between border border-input bg-card text-foreground shadow-2xs transition-colors font-medium cursor-pointer select-none hover:border-[#cbd5e1] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
  {
    variants: {
      sizeVariant: {
        sm: "h-8 px-2.5 py-1 text-xs rounded-sm",
        default: "h-9 px-3 py-1.5 text-xs rounded-md",
        lg: "h-[42px] px-4 py-2 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      sizeVariant: "default",
    },
  },
);

// ============================================================================
// Helper hook for Floating Portal Positioning
// ============================================================================

interface FloatingCoords {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  placement: "bottom" | "top";
}

function useFloatingPosition(
  triggerRef: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
): FloatingCoords | null {
  const [coords, setCoords] = useState<FloatingCoords | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownEstimatedHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;
    const shouldFlip = spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight;

    if (shouldFlip) {
      setCoords({
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: rect.width,
        placement: "top",
      });
    } else {
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        placement: "bottom",
      });
    }
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      setCoords(null);
    };
  }, [isOpen, updatePosition]);

  return coords;
}

// ============================================================================
// Types & Context for Shadcn Compound Pattern
// ============================================================================

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextType | null>(null);

export interface SelectCompoundProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

export const SelectRoot: React.FC<SelectCompoundProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  disabled,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isControlledValue = controlledValue !== undefined;
  const value = isControlledValue ? controlledValue : uncontrolledValue;

  const isControlledOpen = controlledOpen !== undefined;
  const open = isControlledOpen ? controlledOpen : uncontrolledOpen;

  const handleValueChange = (val: string) => {
    if (!isControlledValue) setUncontrolledValue(val);
    if (onValueChange) onValueChange(val);
    handleOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof nextOpen === "function" ? nextOpen(open) : nextOpen;
    if (!isControlledOpen) setUncontrolledOpen(resolved);
    if (onOpenChange) onOpenChange(resolved);
  };

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen: handleOpenChange,
        triggerRef,
        contentRef,
        disabled,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof selectTriggerVariants> {
  error?: boolean;
}

export const SelectTrigger = memo<SelectTriggerProps>(
  ({ className, sizeVariant, children, error, disabled, ...props }) => {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error("SelectTrigger must be used within Select");

    const isDisabled = disabled || ctx.disabled;

    return (
      <button
        ref={ctx.triggerRef}
        type="button"
        role="combobox"
        aria-expanded={ctx.open}
        disabled={isDisabled}
        onClick={() => ctx.setOpen((prev) => !prev)}
        className={cn(
          selectTriggerVariants({ sizeVariant }),
          error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive bg-destructive-subtle/30 text-destructive",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
            ctx.open && "rotate-180 text-primary",
          )}
        />
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = "Pilih opsi...",
  className,
}) => {
  const ctx = useContext(SelectContext);
  return (
    <span
      className={cn("truncate text-left flex-1", !ctx?.value && "text-muted-foreground", className)}
    >
      {ctx?.value || placeholder}
    </span>
  );
};

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
}

export const SelectContent = memo<SelectContentProps>(
  ({ className, children, style, ...props }) => {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error("SelectContent must be used within Select");

    const coords = useFloatingPosition(ctx.triggerRef, ctx.open);

    useEffect(() => {
      if (!ctx.open) return;

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          ctx.contentRef.current &&
          !ctx.contentRef.current.contains(target) &&
          ctx.triggerRef.current &&
          !ctx.triggerRef.current.contains(target)
        ) {
          ctx.setOpen(false);
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          ctx.setOpen(false);
          ctx.triggerRef.current?.focus();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [ctx]);

    if (!ctx.open || !coords) return null;

    return createPortal(
      <div
        ref={ctx.contentRef}
        role="listbox"
        style={{
          position: "fixed",
          top: coords.placement === "top" ? undefined : `${coords.top}px`,
          bottom: coords.placement === "top" ? `${coords.bottom}px` : undefined,
          left: `${coords.left}px`,
          width: `${coords.width}px`,
          zIndex: 99999,
          ...style,
        }}
        className={cn(
          "max-h-60 overflow-y-auto rounded-lg border border-border bg-card p-1 text-card-foreground shadow-xl animate-pop",
          className,
        )}
        {...props}
      >
        {children}
      </div>,
      document.body,
    );
  },
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const SelectItem = memo<SelectItemProps>(
  ({ className, value, disabled, children, ...props }) => {
    const ctx = useContext(SelectContext);
    if (!ctx) throw new Error("SelectItem must be used within Select");

    const isSelected = ctx.value === value;

    const handleClick = () => {
      if (disabled) return;
      ctx.onValueChange(value);
    };

    return (
      <div
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors select-none",
          "hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
          isSelected && "bg-primary-subtle text-primary-subtle-foreground font-semibold",
          disabled && "pointer-events-none opacity-40 cursor-not-allowed",
          className,
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {isSelected && <Check className="size-3.5 text-primary shrink-0 stroke-[2.5]" />}
      </div>
    );
  },
);
SelectItem.displayName = "SelectItem";

export const SelectGroup = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }) => (
  <div className={cn("p-1", className)} {...props} />
));
SelectGroup.displayName = "SelectGroup";

export const SelectLabel = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }) => (
  <div
    className={cn(
      "px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

export const SelectSeparator = memo<React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }) => (
    <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  ),
);
SelectSeparator.displayName = "SelectSeparator";

// ============================================================================
// Hybrid Drop-in Select (Works with <option> or Compound components)
// ============================================================================

interface ParsedOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

function extractOptions(children: ReactNode): ParsedOption[] {
  const options: ParsedOption[] = [];
  React.Children.forEach(children, (child) => {
    if (
      !React.isValidElement<{
        value?: string | number | boolean;
        children?: ReactNode;
        disabled?: boolean;
      }>(child)
    ) {
      return;
    }
    if (child.type === "option") {
      options.push({
        value: String(child.props.value ?? ""),
        label: child.props.children,
        disabled: child.props.disabled,
      });
    } else if (child.props && child.props.children) {
      options.push(...extractOptions(child.props.children));
    }
  });
  return options;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectTriggerVariants> {
  error?: boolean;
  onValueChange?: (val: string) => void;
  ref?: React.Ref<HTMLSelectElement>;
}

export const Select: React.FC<SelectProps> = ({
  className,
  sizeVariant,
  children,
  error,
  disabled,
  value: controlledValue,
  defaultValue,
  onChange,
  onValueChange,
  name,
  id,
  ref: forwardedRef,
  ...props
}) => {
  // Check if children contain <option> tags
  const options = extractOptions(children);
  const hasOptionTags = options.length > 0;

  // If used as pure Shadcn compound: <SelectRoot> ... </SelectRoot>
  if (!hasOptionTags) {
    return (
      <SelectRoot
        value={controlledValue as string}
        defaultValue={defaultValue as string}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        {children}
      </SelectRoot>
    );
  }

  // Drop-in mode: Parse options into Shadcn floating portal menu with hidden sync select
  const internalSelectRef = useRef<HTMLSelectElement | null>(null);
  useImperativeHandle(forwardedRef, () => internalSelectRef.current!);

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Floating position hook (Portaled to document.body)
  const coords = useFloatingPosition(triggerRef, open);

  // Initial value
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (controlledValue !== undefined) return String(controlledValue);
    if (defaultValue !== undefined) return String(defaultValue);
    return options[0]?.value ?? "";
  });

  const activeValue = controlledValue !== undefined ? String(controlledValue) : internalValue;
  const selectedOption = options.find((opt) => opt.value === activeValue) || options[0];

  // Click outside and Escape handler
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelectOption = (opt: ParsedOption) => {
    if (opt.disabled) return;

    setInternalValue(opt.value);
    setOpen(false);

    if (onValueChange) {
      onValueChange(opt.value);
    }

    // Sync with hidden native select for react-hook-form
    if (internalSelectRef.current) {
      internalSelectRef.current.value = opt.value;
      const changeEvent = new Event("change", { bubbles: true });
      internalSelectRef.current.dispatchEvent(changeEvent);

      if (onChange) {
        const syntheticEvent = {
          target: internalSelectRef.current,
          currentTarget: internalSelectRef.current,
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    }
  };

  return (
    <div className="relative w-full">
      {/* Hidden native select to maintain react-hook-form ref and accessibility */}
      <select
        ref={internalSelectRef}
        name={name}
        id={id}
        value={activeValue}
        disabled={disabled}
        onChange={onChange}
        className="sr-only pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {typeof opt.label === "string" ? opt.label : opt.value}
          </option>
        ))}
      </select>

      {/* Custom Shadcn Styled Trigger */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          selectTriggerVariants({ sizeVariant }),
          error &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive bg-destructive-subtle/30 text-destructive",
          className,
        )}
      >
        <span className="truncate text-left flex-1 font-medium">
          {selectedOption?.label || "Pilih..."}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ml-1.5",
            open && "rotate-180 text-primary",
          )}
        />
      </button>

      {/* Truly Floating Dropdown Content via React Portal to document.body */}
      {open &&
        coords &&
        createPortal(
          <div
            ref={contentRef}
            role="listbox"
            style={{
              position: "fixed",
              top: coords.placement === "top" ? undefined : `${coords.top}px`,
              bottom: coords.placement === "top" ? `${coords.bottom}px` : undefined,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 99999,
            }}
            className={cn(
              "max-h-60 overflow-y-auto rounded-lg border border-border bg-card p-1 text-card-foreground shadow-xl animate-pop",
            )}
          >
            {options.map((opt) => {
              const isSelected = opt.value === activeValue;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onClick={() => handleSelectOption(opt)}
                  className={cn(
                    "relative flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors select-none",
                    "hover:bg-muted hover:text-foreground",
                    isSelected && "bg-primary-subtle text-primary-subtle-foreground font-semibold",
                    opt.disabled && "pointer-events-none opacity-40 cursor-not-allowed",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="size-3.5 text-primary shrink-0 stroke-[2.5]" />
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

Select.displayName = "Select";
export default Select;
