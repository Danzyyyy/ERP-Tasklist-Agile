// src/Pages/LoadingApp.tsx
import React, { memo } from "react";
import { Loader2 } from "lucide-react";

export const LoadingApp = memo(() => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 font-mono tracking-tight">
          Memuat Modul ERP E-4...
        </p>
      </div>
    </div>
  );
});

LoadingApp.displayName = "LoadingApp";
export default LoadingApp;
