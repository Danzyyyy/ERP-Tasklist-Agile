// src/Features/Auth/Pages/LoginPage.tsx
import React from "react";
import { useLoginForm } from "../Hooks/useLoginForm";
import RoleSelector from "../Components/RoleSelector";
import { Button } from "@/Components/Elements/Button";
import { Checkbox } from "@/Components/Elements/Checkbox";
import { Input } from "@/Components/Elements/Input";
import { Label } from "@/Components/Elements/Label";
import { Separator } from "@/Components/Elements/Separator";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { Eye, EyeOff } from "lucide-react";

export const LoginPage: React.FC = () => {
  useDocumentTitle(
    "Masuk Sistem",
    "Halaman autentikasi akun multi-peran Anaheim ERP PT. Anaheim Nimbus Universal.",
  );

  const {
    demoTokens,
    selectedToken,
    selectToken,
    identifier,
    handleIdentifierChange,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    rememberSession,
    setRememberSession,
    handleLogin,
  } = useLoginForm();

  return (
    <div className="w-full space-y-5">
      {/* Eyebrow, Heading & Subtitle (FigCraft 07 · Sign In) */}
      <div>
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-primary block">
          AKSES WORKSPACE
        </span>
        <h2 className="text-2xl sm:text-[28px] font-extrabold text-foreground tracking-tight leading-tight mt-1">
          Masuk ke Anaheim ERP
        </h2>
        <p className="text-xs sm:text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
          Masuk dengan akun perusahaan Anda atau pilih akun demo untuk pratinjau peran.
        </p>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleLogin} className="space-y-3.5">
        <div>
          <Label htmlFor="login-identifier">Email atau Username</Label>
          <Input
            id="login-identifier"
            type="text"
            autoComplete="username"
            placeholder="pm@anaheim.id"
            value={identifier}
            onChange={(e) => handleIdentifierChange(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <Button
                type="button"
                variant="ghostMuted"
                size="iconXs"
                onClick={toggleShowPassword}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            }
          />
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer select-none pt-0.5">
          <Checkbox checked={rememberSession} onCheckedChange={setRememberSession} />
          <span className="text-xs text-muted-foreground">Ingat sesi perangkat ini</span>
        </label>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Masuk ke Workspace
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <Separator className="flex-1 w-auto" />
        <span className="text-[11px] text-muted-foreground shrink-0">
          atau coba dengan akun demo
        </span>
        <Separator className="flex-1 w-auto" />
      </div>

      {/* Interactive Demo Accounts Card */}
      <div className="space-y-2">
        <RoleSelector
          demoTokens={demoTokens}
          selectedToken={selectedToken}
          onSelectToken={selectToken}
        />
        <p className="text-[11px] text-muted-foreground">
          Pilih salah satu akun demo di atas untuk langsung mencoba hak akses sesuai peran di
          workspace.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
