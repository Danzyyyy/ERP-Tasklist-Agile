// src/Components/Layouts/Topbar.tsx
import React, { memo, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Hooks/useAuth";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import { ROLE_DETAILS } from "@/Constants/AuthConstant";
import SidebarTrigger from "./SidebarTrigger";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/Components/Elements/DropdownMenu";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { canCreateTaskRole } from "@/Utils/taskUtils";
import { ChevronDown, LogOut, FileText, Search, Bell, SlidersHorizontal } from "lucide-react";
import ProjectSwitcherDropdown from "./ProjectSwitcherDropdown";

export interface TopbarProps {
  onOpenTaskModal: () => void;
}

export const Topbar = memo<TopbarProps>(({ onOpenTaskModal }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const roleMeta = role ? ROLE_DETAILS[role] : null;
  const canCreateTask = canCreateTaskRole(role);
  const { data: recentTasks = [] } = useGetTaskList({});

  const userInitials = useMemo(() => {
    if (!user?.name) return "U";
    const clean = user.name.replace(/\([^)]*\)/g, "").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [user?.name]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotifOpen]);

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <header className="h-[72px] bg-card border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left Info & Search with Shadcn SidebarTrigger */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <SidebarTrigger />

        {/* Global Command Search Bar (FigCraft 1:1: 320x34) - Real Interactive Input */}
        <div
          onClick={() => searchInputRef.current?.focus()}
          className="hidden md:flex items-center gap-2 h-[34px] w-64 lg:w-[320px] rounded-lg border border-border bg-card px-2.5 text-xs shadow-2xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 cursor-text group"
        >
          <Search className="size-3.5 text-muted-foreground group-focus-within:text-primary shrink-0 transition-colors" />
          <Input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, modul, fitur, atau PIC..."
            className="w-full bg-transparent border-0 p-0 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent shadow-none leading-none h-auto"
            aria-label="Cari tugas, modul, fitur, atau PIC"
          />
          {searchQuery ? (
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="size-4 p-0 text-muted-foreground hover:text-foreground text-[11px] font-semibold"
              aria-label="Hapus pencarian"
            >
              ×
            </Button>
          ) : (
            <kbd className="ml-auto pointer-events-none inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
              ⌘ K
            </kbd>
          )}
        </div>

        {/* Project Selector Dropdown Pill (FigCraft 1:1) */}
        <ProjectSwitcherDropdown />

        {/* Mobile / Compact brand title */}
        <div className="md:hidden min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-foreground truncate">Anaheim ERP</span>
            <span className="text-[10px] text-muted-foreground font-mono shrink-0">/ E-4</span>
          </div>
        </div>
      </div>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notification Bell Trigger with Popover (FigCraft 1:1) */}
        <div className="relative" ref={notifRef}>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="rounded-lg relative text-muted-foreground hover:text-foreground shadow-2xs"
            aria-label="Notifikasi"
          >
            <Bell className="size-4" />
            {recentTasks.length > 0 && <span className="size-2 rounded-full bg-primary ring-2 ring-card absolute top-1.5 right-1.5" />}
          </Button>

          {/* Notif Popover (Real Backend Task Feed) */}
          {isNotifOpen && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Aktivitas Tugas</h4>
                  <p className="text-[11px] text-muted-foreground">{recentTasks.length} tugas terdaftar</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsNotifOpen(false)} className="text-xs text-muted-foreground hover:text-primary h-auto p-1">
                  Tutup
                </Button>
              </div>

              <div className="space-y-2">
                {recentTasks.slice(0, 4).map((t) => {
                  const assignee = t.assignee_name || "Belum Ditugaskan";
                  const initial = assignee.slice(0, 2).toUpperCase();

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        navigate(ROUTE_PATHS.TASKS);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border/80 flex items-start gap-2.5 text-xs hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <div className="size-7 rounded-full bg-primary text-white font-bold text-[10px] grid place-items-center shrink-0">{initial}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-xs leading-tight truncate">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          {t.task_code} · {t.status} · {assignee}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {recentTasks.length === 0 && <p className="text-xs text-muted-foreground py-3 text-center">Belum ada aktivitas tugas tercatat.</p>}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNotifOpen(false);
                  navigate(ROUTE_PATHS.TASKS);
                }}
                className="w-full text-xs font-semibold rounded-xl"
              >
                Lihat semua di Tasklist
              </Button>
            </div>
          )}
        </div>

        {/* SlidersHorizontal / Filter Button (FigCraft 1:1) */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => navigate(ROUTE_PATHS.KANBAN)}
          className="rounded-lg text-muted-foreground hover:text-foreground shadow-2xs"
          aria-label="Filter Tampilan"
        >
          <SlidersHorizontal className="size-3.5" />
        </Button>

        {/* Actions Divider */}
        <div className="h-6 w-px bg-border shrink-0" />

        {/* User Profile & Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 sm:gap-2.5 px-2.5 h-[42px] rounded-lg border border-border bg-card hover:bg-muted/70 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shadow-2xs"
            aria-label="Menu Pengguna"
          >
            <div className="size-[34px] rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">{userInitials}</div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {user?.name ? user.name.replace(/\s*\([^)]*\)/g, "") : "Pengguna"}
                </span>
                <ChevronDown className="size-3 text-muted-foreground group-hover:text-foreground shrink-0" />
              </div>
              <span className="text-[10px] text-muted-foreground block mt-1 leading-none font-medium">
                {role === "PROJECT_MANAGER" ? "Workspace Owner" : roleMeta?.label || "Workspace Owner"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="right" className="w-64 p-1.5">
            {/* User Profile Summary */}
            <DropdownMenuLabel className="pb-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user?.name || "Pengguna Aktif"}</p>
                  <p className="text-[10px] text-muted-foreground truncate font-mono">{user?.email || "user@anaheim.id"}</p>
                </div>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 uppercase">
                  {roleMeta?.short || "ROLE"}
                </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Quick Action: Buat Tugas */}
            {canCreateTask && (
              <>
                <DropdownMenuItem onClick={onOpenTaskModal} className="gap-2.5 py-2">
                  <FileText className="size-4 text-success shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-xs text-foreground">Buat Tugas Baru</div>
                    <div className="text-[10px] text-muted-foreground">Daftarkan backlog agile sprint</div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            )}

            {/* Logout Action (Wajib lewat Login Page untuk ganti akun) */}
            <DropdownMenuItem destructive onClick={handleLogout} className="gap-2.5 py-2 text-destructive hover:bg-destructive-subtle hover:text-destructive-subtle-foreground">
              <LogOut className="size-4 shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-xs">Keluar (Logout)</div>
                <div className="text-[10px] text-destructive/80">Keluar ke Login Page untuk ganti akun</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

Topbar.displayName = "Topbar";
export default Topbar;
