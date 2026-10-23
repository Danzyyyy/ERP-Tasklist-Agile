// src/Components/Layouts/AuthLayout.tsx
import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import { FolderKanban, ShieldCheck, CheckCircle2, TrendingUp, Layers } from "lucide-react";

export const AuthLayout = memo(() => {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 sm:p-6 selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-border bg-card grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Brand & Specifications Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-60 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 grid place-items-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <FolderKanban className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-400">
                  Modul E-4 / ERP Software
                </span>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                  PT. Anaheim Nimbus Universal
                </h1>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-black text-white leading-snug">
                Tasklist dan Eksekusi Agile
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Platform manajemen deliverable proyek, alur dual-approval rilis tugas, papan kanban 5
                tahap, dan kalkulasi rasio jam kerja (man-hour).
              </p>
            </div>
          </div>

          {/* Specification Highlights */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-white block font-bold">Dual-Approval Task Release (FTR-K04-03)</strong>
                <span className="text-slate-300">Persetujuan independen TL dan PM sebelum tugas masuk sprint.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Layers className="size-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-white block font-bold">Agile Kanban & Rework (FTR-K04-04/05)</strong>
                <span className="text-slate-300">Visualisasi 5 tahap dan otomasi pembalikan alur saat bug ditemukan.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <TrendingUp className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-white block font-bold">Kalkulasi Progres Riil (FTR-K04-07 & Q-03)</strong>
                <span className="text-slate-300">Rasio matematis berbasis akumulasi man-hour tugas berstatus DONE.</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
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
