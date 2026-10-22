// src/Pages/RootErrorBoundary.tsx
import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "@/Components/Elements/Button";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { AlertOctagon, RotateCcw } from "lucide-react";

export const RootErrorBoundary: React.FC = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 grid place-items-center mb-4 shadow-xs">
        <AlertOctagon className="size-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Terjadi Kesalahan Aplikasi</h1>
      <p className="text-xs text-slate-500 max-w-md mt-2 mb-2 font-mono bg-white p-3 rounded-xl border border-slate-200 text-left overflow-auto max-h-40">
        {error?.message || "Kesalahan perenderan rute tidak terduga."}
      </p>
      <div className="flex items-center gap-2 mt-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RotateCcw className="size-3.5 mr-1" />
          Muat Ulang Halaman
        </Button>
        <Button variant="primary" onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
          Ke Dashboard Utama
        </Button>
      </div>
    </div>
  );
};

export default RootErrorBoundary;
