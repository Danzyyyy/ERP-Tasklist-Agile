// src/Features/Auth/Pages/LoginPage.tsx
import React from "react";
import { useLoginForm } from "../Hooks/useLoginForm";
import RoleSelector from "../Components/RoleSelector";
import { Button } from "@/Components/Elements/Button";
import { Input } from "@/Components/Elements/Input";
import { Label } from "@/Components/Elements/Label";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { Key, ArrowRight, Sliders } from "lucide-react";

export const LoginPage: React.FC = () => {
  useDocumentTitle(
    "Masuk Sistem",
    "Halaman autentikasi akun simulasi multi-peran SOP F-1 ERP Modul E-4 PT. Anaheim Nimbus Universal.",
  );

  const {
    demoTokens,
    selectedToken,
    selectedDemo,
    selectToken,
    customToken,
    setCustomToken,
    useCustomToken,
    toggleCustomToken,
    handleLogin,
  } = useLoginForm();

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      {/* Title & Description */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary-subtle-foreground text-[10px] font-bold uppercase tracking-wider mb-2 border border-primary-subtle-border">
          <Key className="size-3" />
          <span>Simulasi Autentikasi Modul F-1</span>
        </div>
        <h2 className="text-2xl font-black text-foreground tracking-tight">Masuk ke Sistem ERP</h2>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Pilih salah satu akun wewenang di bawah untuk mengakses ruang kerja eksekusi agile sprint.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Role Selection Component */}
        <RoleSelector
          demoTokens={demoTokens}
          selectedToken={selectedToken}
          onSelectToken={selectToken}
        />

        {/* Custom Token Toggle (Optional Advanced Mode) */}
        <div className="pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={toggleCustomToken}
            className="text-[11px] text-muted-foreground hover:text-primary font-medium flex items-center gap-1 transition-colors h-auto p-0"
          >
            <Sliders className="size-3" />
            <span>
              {useCustomToken
                ? "Gunakan token demo otomatis"
                : "Atur Bearer Token manual (Opsional)"}
            </span>
          </Button>

          {useCustomToken && (
            <div className="mt-2 p-3 rounded-xl border border-border bg-muted/40 space-y-2 animate-[fade_0.15s_ease]">
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
          <span>Masuk sebagai {selectedDemo?.name || selectedToken}</span>
          <ArrowRight className="size-4 ml-1.5" />
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
