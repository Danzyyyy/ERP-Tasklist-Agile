// src/Components/Layouts/AuthLayout.tsx
import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import { FolderKanban, ShieldCheck, TrendingUp, Layers } from "lucide-react";

export const AuthLayout = memo(() => {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 sm:p-6 selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-border bg-card grid grid-cols-1 lg:grid-cols-12 min-h-160">
        {/* Left Side: Brand & Specifications Showcase */}
        <div className="lg:col-span-5 bg-linear-to-br from-sidebar via-sidebar to-primary-subtle-foreground p-8 text-sidebar-foreground flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-60 rounded-full bg-sidebar-primary/20 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-primary to-sidebar-primary grid place-items-center text-primary-foreground shadow-lg shadow-primary/30 shrink-0">
                <FolderKanban className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-sidebar-ring">
                  Modul E-4 / ERP Software
                </span>
                <h1 className="text-base font-extrabold tracking-tight text-sidebar-foreground leading-tight">
                  PT. Anaheim Nimbus Universal
                </h1>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-black text-sidebar-foreground leading-snug">
                Tasklist dan Eksekusi Agile
              </h2>
              <p className="text-xs text-sidebar-muted mt-1 leading-relaxed">
                Platform manajemen deliverable proyek, alur dual-approval rilis tugas, papan kanban
                5 tahap, dan kalkulasi rasio jam kerja (man-hour).
              </p>
            </div>
          </div>

          {/* Specification Highlights */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border backdrop-blur-xs">
              <ShieldCheck className="size-4 text-warning shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-sidebar-foreground block font-bold">
                  Dual-Approval Task Release (FTR-K04-03)
                </strong>
                <span className="text-sidebar-muted">
                  Persetujuan independen TL dan PM sebelum tugas masuk sprint.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border backdrop-blur-xs">
              <Layers className="size-4 text-sidebar-ring shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-sidebar-foreground block font-bold">
                  Agile Kanban & Rework (FTR-K04-04/05)
                </strong>
                <span className="text-sidebar-muted">
                  Visualisasi 5 tahap dan otomasi pembalikan alur saat bug ditemukan.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border backdrop-blur-xs">
              <TrendingUp className="size-4 text-success shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-sidebar-foreground block font-bold">
                  Kalkulasi Progres Riil (FTR-K04-07 & Q-03)
                </strong>
                <span className="text-sidebar-muted">
                  Rasio matematis berbasis akumulasi man-hour tugas berstatus DONE.
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-4 border-t border-sidebar-border text-[10px] text-sidebar-muted flex items-center justify-between">
            <span>SOP-05, SOP-07, SOP-08</span>
            <span className="font-mono">Kelompok 4 · Kelas E</span>
          </div>
        </div>

        {/* Right Side: Form View */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
});

AuthLayout.displayName = "AuthLayout";
export default AuthLayout;
