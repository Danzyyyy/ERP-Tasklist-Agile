// src/Features/Modules/Pages/ModulesPage.tsx
import React, { useState } from "react";
import useModulesOverview from "../Hooks/useModulesOverview";
import CreateModuleModal from "@/Components/Modals/CreateModuleModal";
import CreateFeatureModal from "@/Components/Modals/CreateFeatureModal";
import { useDocumentTitle } from "@/Hooks/useDocumentTitle";
import { Button } from "@/Components/Elements/Button";
import { Badge } from "@/Components/Elements/Badge";
import { Progress } from "@/Components/Elements/Progress";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { cn } from "@/Utils/cn";

export const ModulesPage: React.FC = () => {
  useDocumentTitle("Proyek", "Implementasi Core Banking · PT. Anaheim Nimbus Universal");

  const { isModuleModalOpen, setIsModuleModalOpen, isFeatureModalOpen, selectedModuleId, handleCloseFeatureModal } =
    useModulesOverview();

  const [activeTab, setActiveTab] = useState<"SCHEDULE" | "DELIVERABLES">("SCHEDULE");

  return (
    <div className="space-y-4">
      {/* Page Title Card (FigCraft 1:1) */}
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Proyek & Deliverable</h2>
          <p className="text-xs text-muted-foreground mt-1">Implementasi Core Banking · PT. Anaheim Nimbus Universal</p>
        </div>
        <Button
          type="button"
          onClick={() => setIsModuleModalOpen(true)}
          className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>Tambah Modul Baru</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border text-xs font-semibold">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab("SCHEDULE")}
          className={cn(
            "pb-2.5 transition-all relative h-auto rounded-none p-0 hover:bg-transparent",
            activeTab === "SCHEDULE" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Jadwal & Kalender Sprint
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveTab("DELIVERABLES")}
          className={cn(
            "pb-2.5 transition-all relative h-auto rounded-none p-0 hover:bg-transparent",
            activeTab === "DELIVERABLES" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Proyek & Deliverable
        </Button>
      </div>

      {/* Sprint Calendar Card */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">12 – 18 Oktober 2026</h3>
            <p className="text-xs text-muted-foreground mt-0.5">UTC+7 · Sprint 1 Workspace</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <Button type="button" variant="ghost" size="iconSm" className="size-7 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                <ChevronLeft className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="iconSm" className="size-7 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <Button type="button" className="h-8 px-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Plus className="size-3.5" />
              <span>Jadwal Baru</span>
            </Button>
          </div>
        </div>

        {/* 6 Days Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Senin 12 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SENIN</div>
            <div className="text-lg font-black text-foreground">12</div>
            <div className="p-3 rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-primary">
                <Clock className="size-3" />
                <span>09:00</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">Daily Standup Meeting</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">AGILE · Tubagus</p>
              </div>
            </div>
          </div>

          {/* Selasa 13 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SELASA</div>
            <div className="text-lg font-black text-foreground">13</div>
            <div className="p-3 rounded-xl border border-success-subtle-border bg-success-subtle text-success-subtle-foreground space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-success">
                <Clock className="size-3" />
                <span>10:00</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">DDL & Skema DB · H-1</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">BACKEND · Fajri</p>
              </div>
            </div>
          </div>

          {/* Rabu 14 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">RABU</div>
            <div className="text-lg font-black text-foreground">14</div>
            <div className="p-3 rounded-xl border border-purple-subtle-border bg-purple-subtle text-purple-subtle-foreground space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-purple-subtle-foreground">
                <Clock className="size-3" />
                <span>13:00</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">Code Review</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">API Validasi KTP · Fauzan</p>
              </div>
            </div>
          </div>

          {/* Kamis 15 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">KAMIS</div>
            <div className="text-lg font-black text-foreground">15</div>
            <div className="p-3 rounded-xl border border-dashed border-border text-center py-6">
              <span className="text-xs text-muted-foreground">Tidak ada jadwal</span>
            </div>
          </div>

          {/* Jumat 16 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">JUMAT</div>
            <div className="text-lg font-black text-foreground">16</div>
            <div className="p-3 rounded-xl border border-destructive-subtle-border bg-destructive-subtle text-destructive-subtle-foreground space-y-2">
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-destructive">
                <Clock className="size-3" />
                <span>15:00</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">Verifikasi PM & Sign-off TL</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">APPROVAL · Tubagus</p>
              </div>
            </div>
          </div>

          {/* Sabtu 17 */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SABTU</div>
            <div className="text-lg font-black text-foreground">17</div>
            <div className="p-3 rounded-xl border border-dashed border-border text-center py-6">
              <span className="text-xs text-muted-foreground">Tidak ada jadwal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Module Deliverables */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Module Deliverables</h3>
          <span className="text-xs text-muted-foreground font-mono">2 modul aktif · 8 tugas · 96 Jam</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: MOD-01 */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <Badge variant="primary" size="sm">
                MOD-01
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Sprint 1 · 25 Okt 2026</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Manajemen Rekening</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Fitur 1.1 Buka Tabungan / Fitur 1.2 Monitoring Saldo</p>
            </div>
            <div className="space-y-1.5">
              <Progress value={0} height="h-2" tone="primary" />
              <div className="text-right text-xs font-mono text-muted-foreground">0.0%</div>
            </div>
            <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">0 / 72 Jam selesai</div>
          </div>

          {/* Card 2: MOD-02 */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <Badge variant="primary" size="sm">
                MOD-02
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Sprint 1 · 28 Okt 2026</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Autentikasi & Keamanan</h4>
              <p className="text-xs text-muted-foreground mt-0.5">JWT & Otorisasi Peran</p>
            </div>
            <div className="space-y-1.5">
              <Progress value={100} height="h-2" tone="primary" />
              <div className="text-right text-xs font-mono text-primary font-bold">100.0%</div>
            </div>
            <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">24 / 24 Jam selesai</div>
          </div>
        </div>
      </div>

      <CreateModuleModal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} />
      <CreateFeatureModal isOpen={isFeatureModalOpen} onClose={handleCloseFeatureModal} moduleId={selectedModuleId} />
    </div>
  );
};

export default ModulesPage;
