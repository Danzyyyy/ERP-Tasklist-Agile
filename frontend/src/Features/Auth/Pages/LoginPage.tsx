// src/Features/Auth/Pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { ROLE_DETAILS } from "../Constants/AuthConstant";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Input } from "@/Components/Elements/Input";
import { Label } from "@/Components/Elements/Label";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import type { UserRole } from "@/Types/auth";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import {
  ShieldCheck,
  CheckCircle2,
  Key,
  ArrowRight,
  User,
  Sliders,
  Sparkles,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  useDocumentTitle(
    "Masuk Sistem",
    "Halaman autentikasi akun simulasi multi-peran SOP F-1 ERP Modul E-4 PT. Anaheim Nimbus Universal.",
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { demoTokens, login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("PROJECT_MANAGER");
  const [customToken, setCustomToken] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);

  const selectedDemo = demoTokens.find((d) => d.role === selectedRole) || demoTokens[1];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenToUse = useCustomToken && customToken.trim() ? customToken.trim() : selectedDemo.token;
    login(tokenToUse, selectedRole);

    const destination = location.state?.from?.pathname || ROUTE_PATHS.DASHBOARD;
    navigate(destination, { replace: true });
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      {/* Title & Description */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-200">
          <Key className="size-3" />
          <span>Simulasi Autentikasi Modul F-1</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke Sistem ERP</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Pilih salah satu akun wewenang di bawah untuk mengakses ruang kerja eksekusi agile sprint.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Role Selection Cards */}
        <div className="space-y-2.5">
          <Label className="text-slate-800 text-xs font-bold">Pilih Akun Simulasi Aktor (Sprint 1):</Label>

          <div className="space-y-2">
            {demoTokens.map((item) => {
              const isSelected = selectedRole === item.role;
              const meta = ROLE_DETAILS[item.role];

              return (
                <div
                  key={item.token}
                  onClick={() => {
                    setSelectedRole(item.role);
                    setUseCustomToken(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold text-[10px] grid place-items-center font-mono ${
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {meta?.short || item.role.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            ({item.token})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      <div
                        className={`size-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Token Toggle (Optional Advanced Mode) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setUseCustomToken((v) => !v)}
            className="text-[11px] text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
          >
            <Sliders className="size-3" />
            <span>{useCustomToken ? "Gunakan token demo otomatis" : "Atur Bearer Token manual (Opsional)"}</span>
          </button>

          {useCustomToken && (
            <div className="mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2 animate-[fade_0.15s_ease]">
              <Label className="text-[11px]">Kustom Header Token (Bearer):</Label>
              <Input
                placeholder="Contoh: mock_tl atau token JWT Anda"
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full text-xs font-bold h-10 mt-2"
        >
          <span>Masuk sebagai {ROLE_DETAILS[selectedRole]?.label || selectedRole}</span>
          <ArrowRight className="size-4 ml-1.5" />
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
