// src/Components/Layouts/Sidebar.tsx
import React, { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { useSidebarNavigation } from "@/Hooks/useSidebarNavigation";
import { useAuth } from "@/Hooks/useAuth";
import { Progress } from "@/Components/Elements/Progress";
import { formatPercent, formatManHours } from "@/Utils/formatters";
import { cn } from "@/Utils/cn";
import { Sparkles, X, Plus, LogOut } from "lucide-react";

export interface SidebarProps {
  onOpenTaskModal?: () => void;
}

export const Sidebar = memo<SidebarProps>(({ onOpenTaskModal }) => {
  const { open, openMobile, isMobile, setOpenMobile, metrics, navItems, handleNavClick } =
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
          // Mobile Sheet styling
          isMobile
            ? cn(
                "z-50 w-72 shadow-2xl",
                openMobile ? "translate-x-0" : "-translate-x-full pointer-events-none",
              )
            : // Desktop Collapsible styling (240px)
              cn(
                "z-30 w-[240px]",
                open
                  ? "translate-x-0 opacity-100 pointer-events-auto"
                  : "-translate-x-full opacity-0 pointer-events-none",
              ),
        )}
        aria-label="Sidebar Navigasi"
      >
        {/* Brand Header (FigCraft 1:1: H 72px, border-b #e2e8f0, ANAHEIM / ERP MODUL E-4 · v1.0) */}
        <div className="h-[72px] flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-primary grid place-items-center text-primary-foreground shadow-xs font-black text-sm shrink-0">
              A
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-bold tracking-wider uppercase text-foreground leading-tight truncate">
                ANAHEIM
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono leading-tight truncate">
                ERP MODUL E-4 · v1.0
              </p>
            </div>
          </div>

          {/* Close button for Mobile Sheet */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted grid place-items-center cursor-pointer shrink-0 transition-colors"
              aria-label="Tutup Sidebar"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Primary Navigation (FigCraft 1:1: 40px item height, Heading 'WORKSPACE') */}
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
                    "flex items-center justify-between px-3 h-[38px] rounded-lg text-sm transition-colors group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 dark:text-slate-300 dark:hover:bg-slate-800/80 font-medium",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          "size-4.5 shrink-0 transition-colors",
                          isActive
                            ? "text-primary-foreground stroke-[2.2]"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 stroke-[2]",
                        )}
                      />
                      <span className="truncate text-[13px]">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md font-mono text-[11px] leading-tight min-w-5 text-center",
                          isActive
                            ? "bg-indigo-900/40 text-primary-foreground font-bold"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-semibold",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (FigCraft 1:1: + Tambah Modul / Task, Divider & Account Row) */}
        <div className="px-3 pb-3 pt-1 border-t border-border shrink-0 space-y-2">
          {/* + Tambah Modul / Task Button */}
          <button
            type="button"
            onClick={onOpenTaskModal}
            className="w-full h-9 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Tambah Modul / Task</span>
          </button>

          {/* Footer Divider */}
          <div className="h-px bg-border my-1" />

          {/* Organization Account Row */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                AN
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  PT. Anaheim Nimbus
                </p>
                <p className="text-[10px] text-muted-foreground font-mono truncate">
                  Universal · Enterprise
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
              title="Keluar (Logout)"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
