// src/Components/Layouts/Sidebar.tsx
import React, { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { useSidebarNavigation } from "@/Hooks/useSidebarNavigation";
import { useAuth } from "@/Hooks/useAuth";
import { cn } from "@/Utils/cn";
import { Button } from "@/Components/Elements/Button";
import { X, Plus, LogOut } from "lucide-react";

export interface SidebarProps {
  onOpenTaskModal?: () => void;
}

export const Sidebar = memo<SidebarProps>(({ onOpenTaskModal }) => {
  const { open, openMobile, isMobile, setOpenMobile, navItems, handleNavClick } =
    useSidebarNavigation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/60 backdrop-blur-xs transition-opacity duration-300 md:hidden",
          openMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpenMobile(false)}
        aria-hidden="true"
      />

      {/* Sidebar Panel (FigCraft 1:1 Crisp 240px White Surface) */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-card text-foreground border-r border-border flex flex-col select-none transition-all duration-300 ease-in-out",
          isMobile
            ? cn(
                "z-50 w-72 shadow-2xl",
                openMobile ? "translate-x-0" : "-translate-x-full pointer-events-none",
              )
            : cn(
                "z-30 w-[240px]",
                open
                  ? "translate-x-0 opacity-100 pointer-events-auto"
                  : "-translate-x-full opacity-0 pointer-events-none",
              ),
        )}
        aria-label="Sidebar Navigasi"
      >
        {/* Brand Header (FigCraft 1:1: H 72px, ANAHEIM / Workspace Proyek · v1.0) */}
        <div className="h-[72px] flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-md bg-primary grid place-items-center text-primary-foreground shadow-xs font-black text-sm shrink-0">
              A
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-bold tracking-wider uppercase text-foreground leading-tight truncate">
                ANAHEIM
              </h1>
              <p className="text-[10.5px] text-muted-foreground leading-tight truncate">
                Workspace Proyek · v1.0
              </p>
            </div>
          </div>

          {isMobile && (
            <Button
              type="button"
              variant="ghostMuted"
              size="iconSm"
              onClick={() => setOpenMobile(false)}
              aria-label="Tutup Sidebar"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Primary Navigation (FigCraft SidebarNavItem: No Trailing Count Badge) */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            WORKSPACE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === ROUTE_PATHS.DASHBOARD}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 px-3 h-[38px] rounded-md text-sm transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted font-medium",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary-foreground stroke-[2.2]"
                          : "text-muted-foreground group-hover:text-foreground stroke-[2]",
                      )}
                    />
                    <span className="truncate text-[13px]">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (FigCraft 1:1: + Tambah Task + Red Keluar Button) */}
        <div className="px-3 pb-3.5 pt-3 border-t border-border shrink-0 space-y-2">
          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={onOpenTaskModal}
            className="w-full"
          >
            <Plus className="size-3.5 shrink-0" />
            <span>Tambah Task</span>
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            align="between"
            onClick={handleLogout}
            className="w-full"
            title="Keluar dari akun"
          >
            <span>Keluar</span>
            <LogOut className="size-3.5 shrink-0" />
          </Button>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
