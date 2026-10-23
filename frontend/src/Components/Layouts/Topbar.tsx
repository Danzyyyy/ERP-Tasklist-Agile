// src/Components/Layouts/Topbar.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import { ROLE_DETAILS } from "@/Features/Auth/Constants/AuthConstant";
import SidebarTrigger from "./SidebarTrigger";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/Components/Elements/DropdownMenu";
import { Avatar, AvatarFallback } from "@/Components/Elements/Avatar";
import { Badge } from "@/Components/Elements/Badge";
import { Button } from "@/Components/Elements/Button";
import { ROUTES } from "@/Constants/RouteConstant";
import { Plus, ChevronDown, LogOut, FileText } from "lucide-react";

export interface TopbarProps {
  onOpenTaskModal: () => void;
}

export const Topbar = memo<TopbarProps>(({ onOpenTaskModal }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const roleMeta = role ? ROLE_DETAILS[role] : null;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getRoleTone = (r?: string | null): "blue" | "indigo" | "amber" | "emerald" | "slate" => {
    switch (r) {
      case "TECHNICAL_LEAD":
        return "blue";
      case "PROJECT_MANAGER":
        return "indigo";
      case "DEVELOPER":
        return "amber";
      case "TESTER":
        return "emerald";
      default:
        return "slate";
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left Info with Shadcn SidebarTrigger */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <SidebarTrigger />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold text-xs text-foreground truncate">
              PT. Anaheim Nimbus Universal
            </span>
            <span className="text-[10px] text-muted-foreground font-mono shrink-0">
              / Modul E-4
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground hidden md:block truncate">
            Sistem Manajemen Eksekusi Agile, Dual-Approval Gate & Pelacakan Man-Hour
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Add Task */}
        <Button
          size="sm"
          variant="outline"
          onClick={onOpenTaskModal}
          className="h-8 text-xs px-2.5 sm:px-3"
        >
          <Plus className="size-3.5 sm:mr-1 text-primary" />
          <span className="hidden sm:inline">Buat Tugas</span>
          <span className="sm:hidden text-[11px]">Tugas</span>
        </Button>

        {/* User Profile & Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-border bg-secondary/80 hover:bg-secondary hover:border-border transition-all text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label="Menu Pengguna"
          >
            <Avatar size="sm">
              <AvatarFallback tone={getRoleTone(role)}>{roleMeta?.short || "USER"}</AvatarFallback>
            </Avatar>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {user?.name || "Pengguna"}
                </span>
                <ChevronDown className="size-3 text-muted-foreground group-hover:text-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5 leading-none">
                {roleMeta?.label || role || "Pengguna Aktif"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="right" className="w-64 p-1.5">
            {/* User Profile Summary */}
            <DropdownMenuLabel className="pb-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {user?.name || "Pengguna Aktif"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate font-mono">
                    {user?.email || "user@anaheim.id"}
                  </p>
                </div>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 uppercase">
                  {roleMeta?.short || "ROLE"}
                </Badge>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Quick Action: Buat Tugas */}
            <DropdownMenuItem onClick={onOpenTaskModal} className="gap-2.5 py-2">
              <FileText className="size-4 text-emerald-600 shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-xs text-foreground">Buat Tugas Baru</div>
                <div className="text-[10px] text-muted-foreground">
                  Daftarkan backlog agile sprint
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout Action (Wajib lewat Login Page untuk ganti akun) */}
            <DropdownMenuItem
              destructive
              onClick={handleLogout}
              className="gap-2.5 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-4 shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-xs">Keluar (Logout)</div>
                <div className="text-[10px] text-red-400">
                  Keluar ke Login Page untuk ganti akun
                </div>
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
