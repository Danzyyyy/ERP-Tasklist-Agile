// src/Components/Layouts/Topbar.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Features/Auth/Hooks/useAuth";
import { ROLE_DETAILS } from "@/Features/Auth/Constants/AuthConstant";
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
import {
  Plus,
  ChevronDown,
  LogOut,
  FileText,
} from "lucide-react";

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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left Info */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-800">
              PT. Anaheim Nimbus Universal
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ Modul E-4</span>
          </div>
          <span className="text-[11px] text-slate-400 block truncate">
            Sistem Manajemen Eksekusi Agile, Dual-Approval Gate & Pelacakan Man-Hour
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Add Task */}
        <Button size="sm" variant="outline" onClick={onOpenTaskModal} className="h-8 text-xs">
          <Plus className="size-3.5 mr-1 text-blue-600" />
          <span>Buat Tugas</span>
        </Button>

        {/* User Profile & Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            aria-label="Menu Pengguna"
          >
            <Avatar size="sm">
              <AvatarFallback tone={getRoleTone(role)}>
                {roleMeta?.short || "USER"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {user?.name || "Pengguna"}
                </span>
                <ChevronDown className="size-3 text-slate-400 group-hover:text-slate-600" />
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5 leading-none">
                {roleMeta?.label || role || "Pengguna Aktif"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="right" className="w-64 p-1.5">
            {/* User Profile Summary */}
            <DropdownMenuLabel className="pb-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || "Pengguna Aktif"}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate font-mono">
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
                <div className="font-semibold text-xs text-slate-800">Buat Tugas Baru</div>
                <div className="text-[10px] text-slate-400">Daftarkan backlog agile sprint</div>
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
                <div className="text-[10px] text-red-400">Keluar ke Login Page untuk ganti akun</div>
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
