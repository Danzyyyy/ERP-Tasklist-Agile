// src/Pages/RootErrorBoundary.tsx
import React from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button } from "@/Components/Elements/Button";
import { Card } from "@/Components/Elements/Card";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";
import { AlertOctagon, RotateCcw } from "lucide-react";

export const RootErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}: ${error.data || "Halaman bermasalah"}`
    : error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Kesalahan perenderan rute tidak terduga.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="w-16 h-16 rounded-xl bg-destructive-subtle text-destructive grid place-items-center mb-4 shadow-xs">
        <AlertOctagon className="size-8" />
      </div>
      <h1 className="text-xl font-bold text-foreground tracking-tight">
        Terjadi Kesalahan Aplikasi
      </h1>
      <Card size="md" padding="sm" className="max-w-md w-full mt-2 mb-2 overflow-auto">
        <p className="text-xs text-muted-foreground font-mono text-left max-h-36">
          {errorMessage}
        </p>
      </Card>
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
