// src/Pages/LoadingApp.tsx
import React, { memo } from "react";
import { Loader2 } from "lucide-react";

export const LoadingApp = memo(() => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground font-mono tracking-tight">
          Memuat Modul ERP E-4...
        </p>
      </div>
    </div>
  );
});

LoadingApp.displayName = "LoadingApp";
export default LoadingApp;
