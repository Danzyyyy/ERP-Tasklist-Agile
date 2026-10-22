// src/Pages/NotFound.tsx
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Components/Elements/Button";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { FileQuestion, ArrowLeft } from "lucide-react";

export const NotFound = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 grid place-items-center mb-4 shadow-xs">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-slate-500 max-w-sm mt-2 mb-6">
        Halaman atau rute yang Anda tuju tidak terdaftar pada Modul E-4 Tasklist dan Eksekusi Agile.
      </p>
      <Button variant="primary" onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
        <ArrowLeft className="size-3.5 mr-1.5" />
        Kembali ke Dashboard
      </Button>
    </div>
  );
});

NotFound.displayName = "NotFound";
export default NotFound;
