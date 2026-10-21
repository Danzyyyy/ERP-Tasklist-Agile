import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import SelectField from "../components/common/SelectField";
import PageTitle from "../components/common/PageTitle";
import { View, KPIItem, AuditItem } from "../types";

interface DashboardViewProps {
  onNavigate: (view: View) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const kpis: KPIItem[] = [
    {
      label: "Progres Deliverable",
      value: "72.5%",
      detail: "145/200 Jam selesai",
      icon: "report",
      tone: "blue",
      trend: "+12.5% minggu ini",
    },
    {
      label: "Total Tugas Aktif",
      value: "12",
      suffix: "Tugas",
      detail: "7 sedang dikerjakan",
      icon: "task",
      tone: "indigo",
      trend: "3 jatuh tempo dekat",
    },
    {
      label: "Antrean Dual-Approval",
      value: "3",
      suffix: "Tugas",
      detail: "Menunggu TL & PM",
      icon: "shield",
      tone: "amber",
      trend: "Perlu tindakan",
    },
    {
      label: "Tingkat Rework / Bug",
      value: "8%",
      detail: "1 dari 12 tugas",
      icon: "review",
      tone: "rose",
      trend: "-4% dari sprint lalu",
    },
  ];

  const audit: AuditItem[] = [
    {
      initials: "TW",
      text: (
        <>
          <b className="text-slate-900 font-bold">Tubagus</b> menyetujui verifikasi PM untuk{" "}
          <code className="text-blue-600 font-mono text-[9px]">#TSK-05</code>
        </>
      ),
      time: "2 menit lalu",
      tone: "green",
    },
    {
      initials: "FR",
      text: (
        <>
          <b className="text-slate-900 font-bold">Fajri</b> memindahkan{" "}
          <code className="text-blue-600 font-mono text-[9px]">#TSK-03</code> ke Code Review
        </>
      ),
      time: "18 menit lalu",
      tone: "blue",
    },
    {
      initials: "AR",
      text: (
        <>
          <b className="text-slate-900 font-bold">Ariel</b> memperbarui estimasi{" "}
          <code className="text-blue-600 font-mono text-[9px]">#TSK-02</code> menjadi 16 jam
        </>
      ),
      time: "45 menit lalu",
      tone: "purple",
    },
    {
      initials: "FS",
      text: (
        <>
          <b className="text-slate-900 font-bold">Fauzan</b> merilis 2 tugas dari backlog Sprint 1
        </>
      ),
      time: "1 jam lalu",
      tone: "amber",
    },
  ];

  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto select-none">
      <PageTitle
        eyebrow="EXECUTIVE OVERVIEW / MODUL E-4"
        title="Dashboard Eksekusi Agile"
        description="Pantau kesehatan sprint, kapasitas tim, dan aktivitas terbaru secara real-time."
        action={
          <div className="h-[31px] px-2.5 border border-emerald-300 text-emerald-800 bg-emerald-50 rounded-md flex items-center gap-1.5 text-[10px] font-semibold shadow-2xs">
            <i className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_#d1fae5] not-italic" />
            Data langsung · 17 Okt, 16:08 WIB
          </div>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-3 mb-3">
        {kpis.map((kpi) => {
          const toneStyles: Record<string, { icon: string; text: string }> = {
            blue: { icon: "bg-blue-50 text-blue-600", text: "text-blue-600" },
            indigo: { icon: "bg-indigo-50 text-indigo-600", text: "text-indigo-600" },
            amber: { icon: "bg-amber-50 text-amber-600", text: "text-amber-600" },
            rose: { icon: "bg-rose-50 text-rose-600", text: "text-rose-600" },
          };
          const style = toneStyles[kpi.tone] || toneStyles.blue;

          return (
            <button
              type="button"
              className="min-h-[132px] p-3.5 border border-slate-200 rounded-xl bg-white text-left shadow-xs hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden group cursor-pointer"
              key={kpi.label}
              onClick={() =>
                kpi.label.includes("Approval") ? onNavigate("reviews") : onNavigate("tasklist")
              }
            >
              <div className={`w-8 h-8 rounded-lg grid place-items-center mb-2.5 ${style.icon}`}>
                <Icon name={kpi.icon} size={18} />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold block">{kpi.label}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <strong className="font-extrabold text-2xl tracking-tight text-slate-900">
                  {kpi.value}
                </strong>
                {kpi.suffix && (
                  <b className="text-[10px] text-slate-400 font-medium">{kpi.suffix}</b>
                )}
              </div>
              <p className="text-[9px] text-slate-500 m-0 mt-0.5">{kpi.detail}</p>
              <small className="absolute right-3.5 bottom-3.5 text-[8px] text-slate-400 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                {kpi.trend} <Icon name="arrow" size={12} />
              </small>
            </button>
          );
        })}
      </div>

      {/* Dashboard Panels Grid */}
      <div className="grid grid-cols-[1.45fr_1fr] gap-3">
        {/* Module Progress Panel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">
                Progres Jam Kerja per Modul
              </h2>
              <p className="text-[9px] text-slate-500 m-0">
                Realisasi man-hour terhadap estimasi Sprint 1
              </p>
            </div>
            <div className="w-[110px]">
              <SelectField value="Sprint 1" />
            </div>
          </div>
          <div className="p-4 px-4 pb-2">
            {[
              {
                name: "Manajemen Rekening",
                done: 64,
                total: 80,
                bar: "bg-gradient-to-r from-blue-600 to-blue-400",
              },
              {
                name: "Buka Tabungan",
                done: 28,
                total: 40,
                bar: "bg-gradient-to-r from-indigo-600 to-indigo-400",
              },
              {
                name: "Integrasi API",
                done: 53,
                total: 80,
                bar: "bg-gradient-to-r from-cyan-600 to-cyan-400",
              },
            ].map((bar) => (
              <div
                className="grid grid-cols-[135px_1fr_40px] items-center gap-3 mb-4.5"
                key={bar.name}
              >
                <div>
                  <strong className="block text-[10px] font-bold text-slate-800">{bar.name}</strong>
                  <span className="block font-mono text-[9px] text-slate-400 mt-0.5">
                    {bar.done} / {bar.total} Jam
                  </span>
                </div>
                <div className="h-4 rounded-md bg-slate-100 overflow-hidden relative">
                  <div
                    className={`h-full rounded-md ${bar.bar}`}
                    style={{ width: `${(bar.done / bar.total) * 100}%` }}
                  />
                </div>
                <b className="font-mono text-[10px] font-bold text-slate-700 text-right">
                  {Math.round((bar.done / bar.total) * 100)}%
                </b>
              </div>
            ))}
          </div>
          <div className="mx-12 ml-[150px] mb-3 flex justify-between text-[8px] font-mono text-slate-400 border-t border-slate-200 pt-1.5">
            <span>0h</span>
            <span>20h</span>
            <span>40h</span>
            <span>60h</span>
            <span>80h</span>
          </div>
        </section>

        {/* Workload Capacity Panel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">Distribusi Beban PIC</h2>
              <p className="text-[9px] text-slate-500 m-0">Kapasitas aktif berdasarkan estimasi</p>
            </div>
            <button
              className="text-slate-400 hover:text-slate-600 p-1"
              type="button"
              aria-label="Opsi beban kerja"
            >
              <Icon name="more" size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              {
                name: "Fajri",
                role: "Backend Engineer",
                used: 34,
                max: 40,
                avatar: "bg-blue-600",
              },
              {
                name: "Ariel",
                role: "Frontend Engineer",
                used: 26,
                max: 40,
                avatar: "bg-purple-600",
              },
              {
                name: "Fauzan",
                role: "System Analyst",
                used: 18,
                max: 32,
                avatar: "bg-emerald-600",
              },
            ].map((person) => (
              <div
                className="grid grid-cols-[33px_1fr_auto] gap-2.5 items-center p-3 px-4"
                key={person.name}
              >
                <span
                  className={`w-[33px] h-[33px] rounded-lg grid place-items-center text-white text-[10px] font-extrabold ${person.avatar}`}
                >
                  {person.name.slice(0, 2)}
                </span>
                <div>
                  <div className="flex items-baseline justify-between text-[10px] font-bold text-slate-800">
                    <span>
                      {person.name}{" "}
                      <small className="text-[8px] font-normal text-slate-400">{person.role}</small>
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full my-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                      style={{ width: `${(person.used / person.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[8px] text-slate-400 m-0">
                    <b className="text-slate-600 font-semibold">{person.used}h</b> dialokasikan dari{" "}
                    {person.max}h
                  </p>
                </div>
                <Badge tone={person.used / person.max > 0.8 ? "amber" : "green"}>
                  {Math.round((person.used / person.max) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Audit Log Panel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden min-h-[210px]">
          <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">Aktivitas & Audit Log</h2>
              <p className="text-[9px] text-slate-500 m-0">Perubahan terbaru pada workspace</p>
            </div>
            <Button variant="ghost">Lihat semua</Button>
          </div>
          <div className="p-3 px-4 space-y-3">
            {audit.map((item, i) => {
              const toneAvatar: Record<string, string> = {
                green: "text-emerald-700 bg-emerald-100",
                blue: "text-blue-700 bg-blue-100",
                purple: "text-purple-700 bg-purple-100",
                amber: "text-amber-700 bg-amber-100",
              };

              return (
                <div
                  className="grid grid-cols-[25px_1fr_6px] gap-2.5 items-center relative"
                  key={i}
                >
                  <span
                    className={`w-[25px] h-[25px] rounded-md grid place-items-center text-[8px] font-extrabold ${
                      toneAvatar[item.tone] || toneAvatar.blue
                    }`}
                  >
                    {item.initials}
                  </span>
                  <div>
                    <p className="text-[10px] text-slate-600 m-0 leading-normal">{item.text}</p>
                    <span className="text-[8px] text-slate-400">{item.time}</span>
                  </div>
                  <i className="w-1.5 h-1.5 rounded-full bg-blue-500 not-italic" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Sprint Health Score Panel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden min-h-[210px] flex flex-col justify-between">
          <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">Kesehatan Sprint</h2>
              <p className="text-[9px] text-slate-500 m-0">
                Prediksi berdasarkan velocity saat ini
              </p>
            </div>
            <Badge tone="green" dot>
              ON TRACK
            </Badge>
          </div>

          <div className="flex items-center p-5 px-4.5">
            <div
              className="w-[75px] h-[75px] rounded-full grid place-items-center relative shrink-0"
              style={{
                background: "conic-gradient(#10b981 86%, #e2e8f0 0)",
              }}
            >
              <div className="absolute inset-[7px] rounded-full bg-white flex flex-col items-center justify-center">
                <strong className="text-xl font-extrabold text-slate-900">86</strong>
                <span className="text-[8px] text-slate-400 -mt-1 font-semibold">/100</span>
              </div>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-600 ml-4 m-0">
              Target sprint diprediksi selesai{" "}
              <b className="text-emerald-700 font-bold">1 hari lebih awal</b>.
            </p>
          </div>

          <div className="grid grid-cols-3 border-t border-slate-200 divide-x divide-slate-100">
            <span className="text-center py-2.5 px-1 text-[8px] text-slate-400">
              <b className="block font-mono font-bold text-xs text-slate-800 mb-0.5">5.8</b>
              Velocity/hari
            </span>
            <span className="text-center py-2.5 px-1 text-[8px] text-slate-400">
              <b className="block font-mono font-bold text-xs text-slate-800 mb-0.5">92%</b>
              SLA terpenuhi
            </span>
            <span className="text-center py-2.5 px-1 text-[8px] text-slate-400">
              <b className="block font-mono font-bold text-xs text-slate-800 mb-0.5">1</b>
              Blocker aktif
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
