// src/Components/Layouts/SidebarTrigger.tsx
import React, { memo } from "react";
import { useSidebar } from "./SidebarContext";
import { PanelLeft } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = memo<SidebarTriggerProps>(({ className, ...props }) => {
  const { toggleSidebar, isMobile, open, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        className,
      )}
      aria-label={isOpen ? "Tutup Sidebar (Ctrl+B)" : "Buka Sidebar (Ctrl+B)"}
      title={isOpen ? "Tutup Sidebar (Ctrl+B)" : "Buka Sidebar (Ctrl+B)"}
      {...props}
    >
      <PanelLeft className="size-4.5" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";
export default SidebarTrigger;
