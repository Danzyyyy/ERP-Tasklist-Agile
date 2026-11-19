// src/Components/Layouts/Topbar.tsx
import React, { memo, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Hooks/useAuth";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import { ROLE_DETAILS } from "@/Constants/AuthConstant";
import SidebarTrigger from "./SidebarTrigger";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/Components/Elements/DropdownMenu";
import { Avatar, AvatarFallback } from "@/Components/Elements/Avatar";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Separator } from "@/Components/Elements/Separator";
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
          className="hidden md:flex items-center gap-2 h-[34px] w-64 lg:w-[320px] rounded-md border border-border bg-card px-2.5 text-xs shadow-2xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 cursor-text group"
        >
          <Search className="size-3.5 text-muted-foreground group-focus-within:text-primary shrink-0 transition-colors" />
          <Input
            ref={searchInputRef}
            type="text"
            variant="ghost"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas, modul, fitur, atau PIC..."
            aria-label="Cari tugas, modul, fitur, atau PIC"
          />
          {searchQuery ? (
            <Button
              type="button"
              variant="ghostMuted"
              size="iconXs"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
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
          </div>
        </div>
      </div>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notification Bell Trigger with Popover (FigCraft 1:1) */}
        <div className="relative" ref={notifRef}>
          <Button type="button" variant="outlineMuted" size="icon" onClick={() => setIsNotifOpen((prev) => !prev)} className="relative" aria-label="Notifikasi">
            <Bell className="size-4" />
            {recentTasks.length > 0 && <span className="size-2 rounded-full bg-primary ring-2 ring-card absolute top-1.5 right-1.5" />}
          </Button>

          {/* Notif Popover (Real Backend Task Feed) */}
          {isNotifOpen && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Aktivitas Tugas</h4>
                  <p className="text-[11px] text-muted-foreground">{recentTasks.length} tugas terdaftar</p>
                </div>
                <Button type="button" variant="linkMuted" onClick={() => setIsNotifOpen(false)}>
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
                      className="p-2.5 rounded-lg bg-muted/40 border border-border/80 flex items-start gap-2.5 text-xs hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <Avatar size="sm" borderless>
                        <AvatarFallback appearance="solid" tone="indigo">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
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
                className="w-full"
              >
                Lihat semua di Tasklist
              </Button>
            </div>
          )}
        </div>

        {/* SlidersHorizontal / Filter Button (FigCraft 1:1) */}
        <Button type="button" variant="outlineMuted" size="icon" onClick={() => navigate(ROUTE_PATHS.KANBAN)} aria-label="Filter Tampilan">
          <SlidersHorizontal className="size-3.5" />
        </Button>

        {/* Actions Divider */}
        <Separator orientation="vertical" size="md" />

        {/* User Profile & Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger variant="card" aria-label="Menu Pengguna">
            <Avatar size="md" borderless>
              <AvatarFallback appearance="solid" tone="indigo">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {user?.name ? user.name.replace(/\s*\([^)]*\)/g, "") : "Pengguna"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 font-medium">{role === "PROJECT_MANAGER" ? "Workspace Owner" : roleMeta?.label || "Workspace Owner"}</span>
            </div>

            <ChevronDown className="hidden sm:block size-3.5 text-muted-foreground group-hover:text-foreground shrink-0 ml-0.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="right" className="w-64">
            {/* User Profile Summary */}
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user?.name || "Pengguna Aktif"}</p>
                  <p className="text-[10px] text-muted-foreground truncate font-mono">{user?.email || "user@anaheim.id"}</p>
                </div>
                <Badge variant="outline" size="xs">
                  {roleMeta?.short || "ROLE"}
                </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Quick Action: Buat Tugas */}
            {canCreateTask && (
              <>
                <DropdownMenuItem comfortable onClick={onOpenTaskModal} className="gap-2.5">
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
            <DropdownMenuItem destructive comfortable onClick={handleLogout} className="gap-2.5">
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
