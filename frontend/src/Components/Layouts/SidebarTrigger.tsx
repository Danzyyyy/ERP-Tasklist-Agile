// src/Components/Layouts/SidebarTrigger.tsx
import React, { memo } from "react";
import { useSidebar } from "./SidebarContext";
import { Button } from "@/Components/Elements/Button";
import { PanelLeft } from "lucide-react";
import { cn } from "@/Utils/cn";

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = memo<SidebarTriggerProps>(({ className, ...props }) => {
  const { toggleSidebar, isMobile, open, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label={isOpen ? "Tutup Sidebar (Ctrl+B)" : "Buka Sidebar (Ctrl+B)"}
      title={isOpen ? "Tutup Sidebar (Ctrl+B)" : "Buka Sidebar (Ctrl+B)"}
      className={cn(className)}
      {...props}
    >
      <PanelLeft className="size-4.5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";
export default SidebarTrigger;
