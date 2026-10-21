import { useState } from "react";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import SelectField from "../components/common/SelectField";
import PageTitle from "../components/common/PageTitle";
import {
  statusTone,
  hoursReportData,
  reworkLogs,
  apiConsumers,
  samplePayload,
} from "../constants/mockData";

interface ReportsViewProps {
  notify: (message: string) => void;
}

export default function ReportsView({ notify }: ReportsViewProps) {
  const [format, setFormat] = useState<"PDF" | "CSV">("PDF");

  const copyPayload = () => {
    navigator.clipboard?.writeText(samplePayload);
    notify("Payload JSON berhasil disalin ke clipboard.");
  };

  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto select-none">
      <PageTitle
        eyebrow="ANALYTICS & INTEGRATION / ENT-K04-06"
        title="Laporan Eksekusi Sprint"
        description="Analisis estimasi, aktualisasi jam kerja, rework, dan status integrasi lintas modul."
        action={
          <div className="flex items-center gap-2">
            <div className="flex border border-slate-200 rounded-md bg-white p-0.5">
              <button
                type="button"
                className={`border-0 rounded px-2.5 py-1 text-[9px] font-bold transition-colors ${
                  format === "PDF"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setFormat("PDF")}
              >
                PDF
              </button>
              <button
                type="button"
                className={`border-0 rounded px-2.5 py-1 text-[9px] font-bold transition-colors ${
                  format === "CSV"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setFormat("CSV")}
              >
                CSV
              </button>
            </div>
            <Button
              icon="report"
              onClick={() => notify(`Laporan Sprint 1 berhasil diekspor dalam format ${format}.`)}
            >
              Export {format}
            </Button>
          </div>
        }
      />

      {/* Report Summary Cards */}
      <div className="grid grid-cols-4 bg-white border border-slate-200 rounded-xl mb-3 shadow-xs divide-x divide-slate-200">
        <div className="p-3.5 px-4">
          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">
            ESTIMASI TOTAL
          </span>
          <strong className="block font-mono text-lg font-bold text-slate-800 my-1">200.0h</strong>
          <small className="block text-[8px] text-slate-500">Sprint 1</small>
        </div>
        <div className="p-3.5 px-4">
          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">
            AKTUAL TERCATAT
          </span>
          <strong className="block font-mono text-lg font-bold text-slate-800 my-1">145.0h</strong>
          <small className="block text-[8px] text-slate-500">72.5% utilisasi</small>
        </div>
        <div className="p-3.5 px-4">
          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">
            VARIANCE
          </span>
          <strong className="block font-mono text-lg font-bold text-emerald-600 my-1">-8.4h</strong>
          <small className="block text-[8px] text-slate-500">Di bawah estimasi</small>
        </div>
        <div className="p-3.5 px-4">
          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">
            REWORK HOURS
          </span>
          <strong className="block font-mono text-lg font-bold text-rose-600 my-1">12.0h</strong>
          <small className="block text-[8px] text-slate-500">8.3% aktual</small>
        </div>
      </div>

      {/* Hours Table & Rework Log Grid */}
      <div className="grid grid-cols-[1.45fr_0.85fr] gap-3 mb-3">
        {/* Hours Table Panel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">
                Estimasi vs Aktual Man-Hour
              </h2>
              <p className="text-[9px] text-slate-500 m-0">
                Perbandingan berdasarkan timesheet tugas
              </p>
            </div>
            <div className="w-[125px]">
              <SelectField value="Semua Modul" />
            </div>
          </div>
          <div className="h-8 px-4 bg-slate-50 border-b border-slate-200 text-slate-400 text-[8px] font-extrabold tracking-wider grid grid-cols-[1.6fr_0.65fr_0.65fr_0.65fr_0.8fr] items-center uppercase">
            <span>TUGAS</span>
            <span>ESTIMASI</span>
            <span>AKTUAL</span>
            <span>VARIANCE</span>
            <span>STATUS</span>
          </div>
          <div className="divide-y divide-slate-100">
            {hoursReportData.map((row) => (
              <div
                className="min-h-10 px-4 py-2 grid grid-cols-[1.6fr_0.65fr_0.65fr_0.65fr_0.8fr] items-center text-[10px] hover:bg-slate-50/50 transition-colors"
                key={row[0]}
              >
                <div className="min-w-0 pr-2">
                  <code className="text-blue-600 font-mono text-[8px] font-semibold block">
                    {row[0]}
                  </code>
                  <strong className="block text-slate-800 font-bold truncate mt-0.5">
                    {row[1]}
                  </strong>
                </div>
                <span className="font-mono text-[9px] text-slate-600">{row[2]}</span>
                <span className="font-mono text-[9px] text-slate-600">{row[3]}</span>
                <span
                  className={`font-mono text-[9px] font-semibold ${
                    row[4].startsWith("+") ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {row[4]}
                </span>
                <span>
                  <Badge tone={statusTone[row[5]]}>{row[5]}</Badge>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Rework Log Panel */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">
                Riwayat Penolakan / Rework
              </h2>
              <p className="text-[9px] text-slate-500 m-0">
                ENT-K04-06 · Audit trail tidak dapat diubah
              </p>
            </div>
            <Badge tone="red">3 LOG</Badge>
          </div>
          <div className="divide-y divide-slate-100">
            {reworkLogs.map((log) => (
              <div
                className="p-3 px-4 grid grid-cols-[8px_1fr] gap-3 items-start hover:bg-slate-50/50 transition-colors"
                key={log.task + log.time}
              >
                <i className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_0_3px_#ffe4e6] mt-1 not-italic" />
                <div>
                  <span className="flex items-center gap-1.5 text-[10px]">
                    <code className="text-rose-600 font-mono text-[9px] font-semibold">
                      {log.task}
                    </code>
                    <b className="text-slate-800 font-bold">{log.title}</b>
                  </span>
                  <p className="text-[9px] text-slate-600 leading-normal my-1 m-0">{log.reason}</p>
                  <small className="block text-[8px] text-slate-400">
                    {log.by} · {log.time}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* REST API Panel */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="min-h-[59px] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
              <Icon name="sparkle" size={18} />
            </span>
            <div>
              <h2 className="text-xs font-bold text-slate-900 m-0 mb-0.5">
                Status Sinkronisasi REST API
              </h2>
              <p className="text-[9px] text-slate-500 m-0">
                API-K04-01 & API-K04-02 · Event-driven task execution
              </p>
            </div>
          </div>
          <Badge tone="green" dot>
            200 OK · CONNECTED
          </Badge>
        </div>

        <div className="grid grid-cols-[0.85fr_1.15fr] min-h-[175px]">
          {/* Consumers List */}
          <div className="p-4 border-r border-slate-200">
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              MODUL KONSUMEN
            </span>
            <div className="divide-y divide-slate-100">
              {apiConsumers.map((consumer) => (
                <div
                  className="min-h-10 grid grid-cols-[22px_1fr_auto] gap-2 items-center py-2"
                  key={consumer.code}
                >
                  <i className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center not-italic shrink-0">
                    <Icon name="check" size={12} />
                  </i>
                  <div className="min-w-0">
                    <b className="block text-[10px] font-bold text-slate-800 truncate">
                      {consumer.code} · {consumer.name}
                    </b>
                    <code className="block font-mono text-[8px] text-slate-400 mt-0.5 truncate">
                      {consumer.endpoint}
                    </code>
                  </div>
                  <span className="font-mono text-[9px] text-emerald-600 font-semibold shrink-0">
                    24ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* JSON Payload Preview */}
          <div className="bg-slate-950 text-slate-300 m-3 rounded-lg overflow-hidden flex flex-col shadow-inner">
            <div className="h-8 px-3 flex items-center justify-between bg-slate-900 border-b border-slate-800 text-[8px] font-bold tracking-wider uppercase">
              <span className="flex items-center gap-1.5 text-slate-300">
                <i className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] not-italic" />
                LIVE PAYLOAD PREVIEW
              </span>
              <button
                type="button"
                onClick={copyPayload}
                className="text-blue-400 hover:text-blue-300 text-[8px] transition-colors cursor-pointer"
              >
                Salin JSON
              </button>
            </div>
            <pre className="p-3 font-mono text-[8.5px] leading-relaxed text-indigo-300 m-0 overflow-auto whitespace-pre-wrap flex-1">
              {samplePayload}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
