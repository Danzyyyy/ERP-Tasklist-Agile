// src/Components/Layouts/AuthLayout.tsx
import React, { memo } from "react";
import { Outlet } from "react-router-dom";

const AGILE_STAGE_BARS = [
  { label: "RELEASED", heightClass: "h-7", barClass: "bg-[#4338CA]", active: false },
  { label: "DEV", heightClass: "h-11", barClass: "bg-[#4F46E5]", active: false },
  { label: "REVIEW", heightClass: "h-8", barClass: "bg-[#4338CA]", active: false },
  { label: "TESTING", heightClass: "h-14", barClass: "bg-[#818CF8]", active: true },
  { label: "DONE", heightClass: "h-10", barClass: "bg-[#4F46E5]", active: false },
] as const;

export const AuthLayout = memo(() => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-card selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Left Panel: Clean White Form Surface (FigCraft 07 · Sign In) */}
      <div className="flex flex-col justify-between bg-card px-6 sm:px-12 lg:px-14 xl:px-16 py-7 sm:py-8">
        {/* Top Brand Bar (Primary Anaheim Logo, matching Sidebar) */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-md bg-primary grid place-items-center text-primary-foreground shadow-xs font-black text-sm shrink-0">
              A
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-bold tracking-wider uppercase text-foreground leading-tight truncate">
                ANAHEIM ERP
              </h1>
              <p className="text-[10.5px] text-muted-foreground leading-tight truncate">
                Workspace Proyek · v1.0
              </p>
            </div>
          </div>
        </header>

        {/* Center Form View */}
        <main className="my-auto py-8 w-full max-w-[560px] mx-auto">
          <Outlet />
        </main>

        {/* Minimal Honest Footer */}
        <footer className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>© 2026 PT. Anaheim Nimbus Universal</span>
          <span>Anaheim ERP · Tasklist &amp; Eksekusi Agile</span>
        </footer>
      </div>

      {/* Right Panel: Indigo-Navy Hero Showcase (FigCraft 07 · Sign In) */}
      <aside className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#0F172A] via-[#1E1B4B] via-55% to-[#3730A3] px-12 xl:px-16 py-8 text-white relative overflow-hidden">
        {/* Subtle Radial Ambient Depth */}
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-primary/25 blur-3xl" />

        {/* Top Company Eyebrow */}
        <div className="relative z-10 text-[11px] font-bold tracking-[0.14em] uppercase text-[#A5B4FC]">
          ANAHEIM NIMBUS UNIVERSAL
        </div>

        {/* Center Hero Copy & Visual Cards */}
        <div className="relative z-10 my-auto space-y-6 max-w-[580px]">
          <div className="space-y-3">
            <h2 className="text-3xl xl:text-[34px] font-extrabold tracking-tight text-white leading-[1.18]">
              Built for clarity.
              <br />
              Designed for your next sprint.
            </h2>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              One workspace. Every decision, accounted for.
            </p>
          </div>

          {/* Card 1: 5-Stage Agile Execution Visual */}
          <div className="rounded-lg border border-[#4338CA] bg-[#1E2547]/90 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#E2E8F0]">
                Alur Eksekusi Sprint · 5 Tahap
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/25 border border-[#6366F1]/40 text-[10px] font-mono font-bold tracking-wider uppercase text-[#C7D2FE]">
                AGILE BOARD
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Manajemen Deliverable
              </span>
              <span className="text-xs text-[#94A3B8]">
                Terstruktur dari rilis hingga pengesahan akhir
              </span>
            </div>

            {/* 5 Stage Bars */}
            <div className="grid grid-cols-5 gap-2 items-end pt-2">
              {AGILE_STAGE_BARS.map((stage) => (
                <div key={stage.label} className="flex flex-col items-center gap-2">
                  <div className="w-full h-16 flex items-end">
                    <div className={`w-full rounded-sm ${stage.heightClass} ${stage.barClass}`} />
                  </div>
                  <span
                    className={`text-[10px] font-mono tracking-wider ${
                      stage.active ? "text-[#E2E8F0] font-semibold" : "text-[#94A3B8]"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1 flex items-center justify-between gap-2 text-[11px] border-t border-white/10">
              <span className="text-[#CBD5E1]">Estimasi &amp; Realisasi Jam Kerja</span>
              <span className="text-[#A5B4FC] font-medium">Verifikasi PM &amp; Sign-off TL</span>
            </div>
          </div>

          {/* Card 2: Role-Based & Layered Verification */}
          <div className="rounded-lg border border-[#4338CA] bg-[#1E2547]/90 p-5 space-y-1.5">
            <h3 className="text-sm font-bold text-white">
              Kontrol Peran &amp; Verifikasi Berlapis.
            </h3>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Persetujuan rilis TL &amp; PM, status selesai terkunci permanen, dan manajemen akses
              berbasis peran.
            </p>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 flex items-center justify-end text-[11px] font-semibold tracking-wider uppercase text-[#A5B4FC]">
          <span>ENTERPRISE AGILE EXECUTION</span>
        </div>
      </aside>
    </div>
  );
});

AuthLayout.displayName = "AuthLayout";
export default AuthLayout;
