import { useState } from "react";
import Icon from "../components/common/Icon";
import Badge from "../components/common/Badge";
import PageTitle from "../components/common/PageTitle";
import { reviewItems } from "../constants/mockData";

interface ReviewsViewProps {
  onOpen: () => void;
  role: string;
}

export default function ReviewsView({ onOpen, role }: ReviewsViewProps) {
  const [tab, setTab] = useState("Semua Antrean");

  const filteredReviews = reviewItems.filter(
    (item) =>
      tab === "Semua Antrean" || item.stage.includes(tab.replace("Pengesahan", "Pengesahan")),
  );

  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto select-none">
      <PageTitle
        eyebrow="QUALITY ASSURANCE / MODUL E-4"
        title="Review & Testing"
        description={
          <>
            Antrean quality gate berdasarkan peran aktif:{" "}
            <b className="text-slate-900 font-bold">{role}</b>.
          </>
        }
        action={
          <div className="h-[31px] px-2.5 border border-amber-300 text-amber-800 bg-amber-50 rounded-md flex items-center gap-1.5 text-[10px] font-semibold shadow-2xs">
            <i className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_0_3px_#fef3c7] not-italic" />
            3 antrean memerlukan tindakan
          </div>
        }
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-4 gap-2.5 mb-3">
        {[
          {
            label: "Code Review",
            val: "1",
            sub: "Rata-rata 3.2 jam",
            icon: "review" as const,
            bg: "bg-purple-50 text-purple-600",
          },
          {
            label: "QA Testing",
            val: "1",
            sub: "Dalam batas SLA",
            icon: "check" as const,
            bg: "bg-cyan-50 text-cyan-600",
          },
          {
            label: "Menunggu Pengesahan",
            val: "1",
            sub: "PM / Technical Lead",
            icon: "shield" as const,
            bg: "bg-amber-50 text-amber-600",
          },
          {
            label: "Lulus Minggu Ini",
            val: "8",
            sub: "92% first-pass rate",
            icon: "sparkle" as const,
            bg: "bg-emerald-50 text-emerald-600",
          },
        ].map((s) => (
          <div
            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs"
            key={s.label}
          >
            <span
              className={`w-[35px] h-[35px] rounded-lg grid place-items-center shrink-0 ${s.bg}`}
            >
              <Icon name={s.icon} size={18} />
            </span>
            <div className="flex-1 grid grid-cols-[auto_1fr] items-center gap-x-2">
              <span className="text-[9px] text-slate-500 leading-tight">{s.label}</span>
              <strong className="text-base font-extrabold text-slate-900 row-span-2 col-start-2 text-right">
                {s.val}
              </strong>
              <small className="text-[8px] text-slate-400 leading-tight">{s.sub}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Review Queue Table */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Tabs Bar */}
        <div className="h-[52px] flex items-end px-3.5 border-b border-slate-200">
          <div className="flex items-center gap-1">
            {["Semua Antrean", "Code Review", "QA Testing", "Pengesahan"].map((item) => {
              const isActive = tab === item;
              return (
                <button
                  type="button"
                  className={`h-10 px-3.5 border-b-2 font-bold text-[10px] flex items-center transition-colors ${
                    isActive
                      ? "text-blue-600 border-blue-600"
                      : "text-slate-500 border-transparent hover:text-slate-800"
                  }`}
                  onClick={() => setTab(item)}
                  key={item}
                >
                  {item}
                  <span className="inline-grid min-w-4 h-4 place-items-center bg-slate-100 rounded text-[8px] font-mono font-bold ml-1.5 px-1">
                    {item === "Semua Antrean" ? 3 : 1}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="w-[190px] h-8 bg-white border border-slate-200 rounded-md flex items-center px-2.5 gap-2 text-slate-600 text-[10px] ml-auto mb-2">
            <span className="text-slate-400 shrink-0">
              <Icon name="search" size={16} />
            </span>
            <input
              className="border-0 outline-none w-full text-[10px] text-slate-700 placeholder:text-slate-400"
              placeholder="Cari tugas..."
            />
          </label>
        </div>

        {/* Table Head */}
        <div className="h-9 px-3.5 bg-slate-50 text-slate-400 text-[8px] font-extrabold tracking-wider grid grid-cols-[1.7fr_1fr_0.8fr_0.9fr_0.65fr_0.5fr] items-center uppercase">
          <span>TUGAS</span>
          <span>TAHAP QUALITY GATE</span>
          <span>PELAKSANA</span>
          <span>REVIEWER / PIC</span>
          <span>WAKTU ANTRE</span>
          <span>AKSI</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {filteredReviews.map((item) => (
            <button
              type="button"
              className="w-full min-h-[69px] px-3.5 py-2 grid grid-cols-[1.7fr_1fr_0.8fr_0.9fr_0.65fr_0.5fr] items-center text-left text-slate-600 hover:bg-blue-50/30 transition-colors cursor-pointer"
              onClick={onOpen}
              key={item.id}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg grid place-items-center bg-slate-100 text-slate-500 shrink-0">
                  <Icon name="task" size={16} />
                </span>
                <div className="min-w-0 truncate">
                  <code className="text-blue-600 font-mono text-[8px] font-semibold block">
                    #{item.id}
                  </code>
                  <strong className="block text-[10px] font-bold text-slate-800 truncate">
                    {item.title}
                  </strong>
                  <small className="block text-[8px] text-slate-400 mt-0.5 truncate">
                    Modul: Manajemen Rekening
                  </small>
                </div>
              </div>

              <span>
                <Badge tone={item.tone} dot>
                  {item.stage.toUpperCase()}
                </Badge>
              </span>

              <span className="flex items-center gap-1.5 min-w-0">
                <i className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[8px] font-extrabold not-italic grid place-items-center shrink-0">
                  {item.owner.slice(0, 2)}
                </i>
                <span className="text-[9px] text-slate-700 truncate">{item.owner}</span>
              </span>

              <span className="flex items-center gap-1.5 min-w-0">
                <i className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[8px] font-extrabold not-italic grid place-items-center shrink-0">
                  {item.reviewer.slice(0, 2)}
                </i>
                <span className="text-[9px] text-slate-700 truncate">{item.reviewer}</span>
              </span>

              <div>
                <b className="block font-mono text-[9px] font-bold text-slate-800">{item.age}</b>
                <small className="block text-[8px] text-slate-400 mt-0.5">SLA 8 jam</small>
              </div>

              <span className="text-blue-600 text-[9px] font-bold flex items-center gap-1">
                Periksa <Icon name="arrow" size={13} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Quality Note */}
      <div className="mt-3 border border-blue-200 bg-blue-50/70 rounded-xl p-3 flex gap-2.5 text-blue-700">
        <span className="text-blue-600 shrink-0">
          <Icon name="shield" size={18} />
        </span>
        <div>
          <strong className="block text-[10px] font-bold text-slate-900">
            Kontrol otorisasi aktif
          </strong>
          <p className="m-0 mt-0.5 text-[9px] text-slate-600 leading-normal">
            Tombol pengesahan akhir hanya tersedia bagi Technical Lead setelah empat verifikasi PM
            terpenuhi. Peran saat ini: <b className="text-slate-900">{role}</b>.
          </p>
        </div>
      </div>
    </main>
  );
}
