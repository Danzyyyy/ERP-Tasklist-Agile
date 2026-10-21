import { useState } from "react";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import PageTitle from "../components/common/PageTitle";
import { deliverables, teamMembers } from "../constants/mockData";

interface ProjectsViewProps {
  notify: (message: string) => void;
}

export default function ProjectsView({ notify }: ProjectsViewProps) {
  const [selectedAction, setSelectedAction] = useState<"rollover" | "backlog">("rollover");

  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto select-none">
      <PageTitle
        eyebrow="PROJECT GOVERNANCE / MODUL D-1"
        title="Master Proyek"
        description="Informasi kontrak proyek, deliverable, anggota tim, dan kontrol siklus mingguan."
        action={<Button icon="plus">Tambah Deliverable</Button>}
      />

      {/* Project Hero Card */}
      <section className="min-h-[104px] p-4.5 border border-indigo-200 bg-gradient-to-r from-white via-white to-indigo-50/60 rounded-xl flex items-center mb-3.5 shadow-xs">
        <div className="w-[50px] h-[50px] rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white grid place-items-center mr-3.5 shrink-0 shadow-sm">
          <Icon name="folder" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono font-bold text-[9px] tracking-wider text-blue-600 block uppercase">
            PRJ-CB-2026-001
          </span>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight my-0.5">
            Implementasi Core Banking
          </h2>
          <p className="text-[10px] text-slate-500 m-0">
            PT. Anaheim Nimbus Universal · Enterprise Transformation Office
          </p>
        </div>
        <div className="flex items-center">
          <div className="min-w-[135px] px-4 py-0.5 border-l border-slate-200">
            <span className="block text-[8px] tracking-wider text-slate-400 uppercase mb-1">
              PERIODE PROYEK
            </span>
            <b className="block text-[11px] font-bold text-slate-800">01 Sep – 20 Des 2026</b>
          </div>
          <div className="min-w-[135px] px-4 py-0.5 border-l border-slate-200">
            <span className="block text-[8px] tracking-wider text-slate-400 uppercase mb-1">
              PROJECT MANAGER
            </span>
            <b className="block text-[11px] font-bold text-slate-800">Tubagus Muhammad W.</b>
          </div>
          <div className="min-w-[120px] px-4 py-0.5 border-l border-slate-200">
            <span className="block text-[8px] tracking-wider text-slate-400 uppercase mb-1">
              STATUS
            </span>
            <Badge tone="green" dot>
              IN PROGRESS
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(280px,0.72fr)] gap-3">
        <div>
          {/* Deliverable Panel */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-3">
            <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">
                  Deliverable & Modul Induk
                </h2>
                <p className="text-[9px] text-slate-500 m-0">
                  ENT-K04-01 · Akumulasi estimasi dan tenggat H-1
                </p>
              </div>
              <Badge tone="blue">3 DELIVERABLE</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {deliverables.map((item) => (
                <div
                  className="min-h-[70px] grid grid-cols-[20px_35px_1.2fr_1fr_0.9fr_45px] items-center gap-2.5 p-3 px-4 hover:bg-slate-50/70 transition-colors"
                  key={item.id}
                >
                  <button
                    type="button"
                    aria-label={`Expand ${item.title}`}
                    className="text-slate-400 hover:text-slate-600 rotate-90"
                  >
                    <Icon name="chevron" size={14} />
                  </button>
                  <span className="w-8 h-8 rounded-lg grid place-items-center bg-blue-50 text-blue-600 shrink-0">
                    <Icon name="folder" size={18} />
                  </span>
                  <div className="min-w-0">
                    <code className="font-mono font-semibold text-[8px] text-blue-600 block">
                      {item.id}
                    </code>
                    <strong className="block text-[11px] font-bold text-slate-800 truncate mt-0.5">
                      {item.title}
                    </strong>
                    <small className="block text-[8px] text-slate-400 mt-0.5">{item.modules}</small>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] font-semibold text-slate-600">
                      {item.hours}
                    </span>
                    <div className="h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-400">Tenggat deliverable</span>
                    <b className="flex items-center gap-1 text-[9px] font-bold text-slate-700 mt-0.5">
                      <Icon name="calendar" size={13} /> {item.due}
                    </b>
                    <small className="block text-[7px] text-rose-600 mt-0.5">
                      Tugas maksimal H-1
                    </small>
                  </div>
                  <Badge
                    tone={item.progress > 60 ? "green" : item.progress > 0 ? "amber" : "neutral"}
                  >
                    {item.progress}%
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Team Members Panel */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">Anggota Tim Proyek</h2>
                <p className="text-[9px] text-slate-500 m-0">
                  Sinkronisasi penugasan dari Modul F-2
                </p>
              </div>
              <Button variant="secondary" icon="users">
                Kelola Tim
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {teamMembers.map((member) => (
                <div
                  className="border border-slate-200 rounded-lg p-2.5 grid grid-cols-[30px_1fr_6px] gap-2 items-center bg-white hover:border-slate-300 transition-colors"
                  key={member.name}
                >
                  <span className="w-[30px] h-[30px] rounded-lg grid place-items-center text-white bg-blue-600 text-[9px] font-extrabold shrink-0">
                    {member.id}
                  </span>
                  <div className="min-w-0">
                    <strong className="block text-[10px] font-bold text-slate-800 truncate">
                      {member.name}
                    </strong>
                    <span className="block text-[8px] text-slate-400 mt-0.5 truncate">
                      {member.role}
                    </span>
                  </div>
                  <i
                    title="Online"
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_2px_#d1fae5] not-italic"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Weekly Cycle Closure & Change Log */}
        <aside className="space-y-3">
          <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="w-[35px] h-[35px] rounded-lg grid place-items-center bg-blue-50 text-blue-600 mb-2.5">
              <Icon name="clock" size={18} />
            </div>
            <span className="font-mono font-bold text-[8px] tracking-wider text-blue-600 uppercase block">
              Q-08 · WEEKLY CYCLE
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight mt-1 mb-1.5">
              Penutupan Siklus Mingguan
            </h2>
            <p className="text-[9px] text-slate-500 leading-relaxed m-0 mb-3">
              5 tugas aktif belum selesai saat Sprint 1 berakhir. Tentukan perlakuan untuk menjaga
              akurasi backlog.
            </p>
            <div className="grid grid-cols-3 bg-slate-50 border border-slate-200 rounded-lg mb-3 divide-x divide-slate-200">
              <span className="text-center py-2 px-1 text-[8px] text-slate-400">
                <b className="block font-mono font-bold text-xs text-slate-800 mb-0.5">5</b>
                Tugas Aktif
              </span>
              <span className="text-center py-2 px-1 text-[8px] text-slate-400">
                <b className="block font-mono font-bold text-xs text-slate-800 mb-0.5">42h</b>
                Sisa Estimasi
              </span>
              <span className="text-center py-2 px-1 text-[8px] text-slate-400">
                <b className="block font-mono font-bold text-xs text-slate-800 mb-0.5">2</b>
                Terblokir
              </span>
            </div>
            <div className="grid gap-2 mb-3">
              <button
                type="button"
                className={`min-h-[48px] grid grid-cols-[28px_1fr_10px] gap-2 items-center border rounded-lg bg-white text-left p-2 transition-colors cursor-pointer ${
                  selectedAction === "rollover"
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedAction("rollover")}
              >
                <span className="w-7 h-7 rounded-md grid place-items-center text-blue-600 bg-blue-100">
                  <Icon name="arrow" size={14} />
                </span>
                <div>
                  <b className="block text-[10px] font-bold text-slate-800">
                    Rollover ke Minggu Depan
                  </b>
                  <small className="block text-[8px] text-slate-400 mt-0.5">
                    Pertahankan status dan assignee
                  </small>
                </div>
                <i
                  className={`w-2.5 h-2.5 rounded-full border not-italic ${
                    selectedAction === "rollover"
                      ? "border-blue-600 border-4 bg-white"
                      : "border-slate-300"
                  }`}
                />
              </button>
              <button
                type="button"
                className={`min-h-[48px] grid grid-cols-[28px_1fr_10px] gap-2 items-center border rounded-lg bg-white text-left p-2 transition-colors cursor-pointer ${
                  selectedAction === "backlog"
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedAction("backlog")}
              >
                <span className="w-7 h-7 rounded-md grid place-items-center text-blue-600 bg-blue-100">
                  <Icon name="folder" size={14} />
                </span>
                <div>
                  <b className="block text-[10px] font-bold text-slate-800">
                    Kembalikan ke Backlog
                  </b>
                  <small className="block text-[8px] text-slate-400 mt-0.5">
                    Reset status menjadi Draft
                  </small>
                </div>
                <i
                  className={`w-2.5 h-2.5 rounded-full border not-italic ${
                    selectedAction === "backlog"
                      ? "border-blue-600 border-4 bg-white"
                      : "border-slate-300"
                  }`}
                />
              </button>
            </div>
            <Button
              className="w-full justify-center"
              onClick={() =>
                notify(
                  `${
                    selectedAction === "rollover" ? "Rollover" : "Pengembalian ke backlog"
                  } berhasil dijadwalkan untuk penutupan minggu.`,
                )
              }
            >
              Konfirmasi Penutupan Siklus
            </Button>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <span className="font-mono font-bold text-[8px] tracking-wider text-blue-600 uppercase block">
              Q-12 · CHANGE LOG / MOM D-3
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight mt-1 mb-1.5">
              Penyesuaian Tugas Aktif
            </h2>
            <p className="text-[9px] text-slate-500 leading-relaxed m-0 mb-3">
              Setiap perubahan scope tugas aktif wajib memiliki referensi notulen.
            </p>
            <div className="min-h-[49px] flex items-center gap-2.5 border border-amber-300 bg-amber-50/60 rounded-lg p-2.5 mb-3">
              <span className="w-8 h-8 rounded-md grid place-items-center bg-amber-200/80 text-amber-900 font-bold text-xs shrink-0">
                2
              </span>
              <div>
                <b className="block text-[10px] font-bold text-slate-800">
                  Perubahan menunggu review
                </b>
                <small className="block text-[8px] text-slate-500 mt-0.5">
                  MoM-2026-10-017 & 018
                </small>
              </div>
            </div>
            <Button variant="secondary" className="w-full justify-center">
              Buka Change Log
            </Button>
          </section>
        </aside>
      </div>
    </main>
  );
}
