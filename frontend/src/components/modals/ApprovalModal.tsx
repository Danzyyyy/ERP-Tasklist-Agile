import { useState } from "react";
import ModalShell from "./ModalShell";
import Button from "../common/Button";
import Badge from "../common/Badge";
import Icon from "../common/Icon";

interface ApprovalModalProps {
  role: string;
  onClose: () => void;
  onSuccess: () => void;
  onReject: () => void;
}

export default function ApprovalModal({ role, onClose, onSuccess, onReject }: ApprovalModalProps) {
  const [checks, setChecks] = useState([true, true, false, false]);
  const [review, setReview] = useState("approved");

  const complete = checks.every(Boolean);
  const canApprove = complete && role === "Technical Lead";

  const toggleCheck = (i: number) => {
    setChecks((all) => all.map((v, x) => (x === i ? !v : v)));
  };

  const handleReject = () => {
    onReject();
    onClose();
  };

  return (
    <ModalShell onClose={onClose} size="approval">
      {/* Modal Head */}
      <div className="min-h-[76px] px-6 py-3.5 flex items-center justify-between border-b border-slate-200">
        <div>
          <span className="text-blue-600 text-[9px] font-extrabold tracking-wider uppercase block">
            UI-K04-04 · QUALITY GATE
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1 mb-0">
            Pemeriksaan & Pengesahan Tugas
          </h2>
        </div>
        <button
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          onClick={onClose}
          type="button"
          aria-label="Tutup modal"
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Task Summary Banner */}
      <div className="mx-6 mt-3.5 border border-blue-100 bg-blue-50/40 rounded-lg min-h-[55px] flex items-center gap-3.5 p-3 text-slate-700">
        <div className="mr-auto">
          <code className="text-blue-600 font-mono text-[9px] font-semibold block">#TSK-05</code>
          <strong className="text-xs font-bold block mt-0.5 text-slate-900">
            Endpoint Cek Saldo
          </strong>
        </div>
        <span className="text-[9px] text-slate-500 border-l border-slate-200 pl-3">
          Modul: <b className="text-slate-700">Rekening</b>
        </span>
        <span className="text-[9px] text-slate-500 border-l border-slate-200 pl-3">
          Fitur: <b className="text-slate-700">Cek Saldo</b>
        </span>
        <span className="text-[9px] text-slate-500 border-l border-slate-200 pl-3">
          Estimasi: <b className="text-slate-700 font-mono">12.00 Jam</b>
        </span>
        <span className="text-[9px] text-slate-500 border-l border-slate-200 pl-3">
          Pelaksana: <b className="text-slate-700">Fajri (BE)</b>
        </span>
        <Badge tone="cyan" dot>
          TESTING
        </Badge>
      </div>

      {/* Tabs */}
      <div className="h-12 mx-6 grid grid-cols-3 border-b border-slate-200">
        <button
          type="button"
          className="border-b-2 border-transparent text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1.5"
        >
          <span className="w-5 h-5 rounded-full bg-slate-100 grid place-items-center text-[9px] font-bold">
            1
          </span>
          Code Review{" "}
          <span className="text-emerald-600">
            <Icon name="check" size={13} />
          </span>
        </button>
        <button
          type="button"
          className="border-b-2 border-transparent text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1.5"
        >
          <span className="w-5 h-5 rounded-full bg-slate-100 grid place-items-center text-[9px] font-bold">
            2
          </span>
          QA Testing{" "}
          <span className="text-emerald-600">
            <Icon name="check" size={13} />
          </span>
        </button>
        <button
          type="button"
          className="border-b-2 border-blue-600 text-blue-600 text-[10px] font-bold flex items-center justify-center gap-1.5"
        >
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white grid place-items-center text-[9px] font-bold">
            3
          </span>
          Pengesahan Selesai
        </button>
      </div>

      {/* Body: 2 columns */}
      <div className="p-5 px-6 grid grid-cols-[0.9fr_1.1fr] gap-5">
        {/* Left Column: Review Form */}
        <div className="pr-5 border-r border-slate-200 space-y-3.5">
          <label className="block">
            <span className="block text-[9px] text-slate-700 font-bold mb-1.5">
              Catatan Code Review
            </span>
            <textarea
              className="w-full h-16 p-2 rounded-md border border-slate-300 text-[10px] text-slate-700 resize-none focus:outline-none focus:border-blue-500"
              defaultValue="Struktur service dan repository sudah sesuai standar arsitektur. Error handling telah ditambahkan."
            />
          </label>

          <fieldset className="block border-0 p-0 m-0">
            <legend className="block text-[9px] text-slate-700 font-bold mb-1.5">
              Hasil Review
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`min-h-[48px] border rounded-lg p-2 flex items-start gap-2 cursor-pointer transition-colors ${
                  review === "approved"
                    ? "border-emerald-300 bg-emerald-50/60"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="review"
                  checked={review === "approved"}
                  onChange={() => setReview("approved")}
                  className="accent-blue-600 mt-0.5 cursor-pointer"
                />
                <div>
                  <b className="block text-[10px] text-slate-800 font-bold">Disetujui</b>
                  <small className="block text-[8px] text-slate-500 mt-0.5">
                    Kode memenuhi standar review
                  </small>
                </div>
              </label>

              <label
                className={`min-h-[48px] border rounded-lg p-2 flex items-start gap-2 cursor-pointer transition-colors ${
                  review === "rework"
                    ? "border-rose-300 bg-rose-50/60"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="review"
                  checked={review === "rework"}
                  onChange={() => setReview("rework")}
                  className="accent-blue-600 mt-0.5 cursor-pointer"
                />
                <div>
                  <b className="block text-[10px] text-slate-800 font-bold">
                    Perlu Revisi (Rework)
                  </b>
                  <small className="block text-[8px] text-slate-500 mt-0.5">
                    Kembalikan ke Development
                  </small>
                </div>
              </label>
            </div>
          </fieldset>

          <label className="block">
            <span className="block text-[9px] text-slate-700 font-bold mb-1.5">
              Catatan / Temuan Bug
            </span>
            <textarea
              className="w-full h-12 p-2 rounded-md border border-slate-300 text-[10px] text-slate-700 resize-none focus:outline-none focus:border-blue-500"
              placeholder="Tuliskan temuan QA jika ada..."
            />
          </label>
        </div>

        {/* Right Column: Verification & TL Authorization */}
        <div className="space-y-3">
          {/* PM Verification Box */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="h-9 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-3">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-800">
                <span className="text-blue-600">
                  <Icon name="shield" size={15} />
                </span>
                Ceklis Verifikasi PM
              </span>
              <small className="text-[9px] text-slate-500 font-medium">
                {checks.filter(Boolean).length}/4 selesai
              </small>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                "Dokumentasi API diperbarui di Swagger/Postman",
                "Tidak ada isu regresi pada modul terkait",
                "Implementasi fungsi caching stabil",
                "Seluruh kriteria penerimaan terpenuhi",
              ].map((text, i) => (
                <label
                  className="min-h-8 flex items-center gap-2.5 px-3 py-1.5 text-[9px] text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  key={text}
                >
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => toggleCheck(i)}
                    className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verified Status Card */}
          <div className="flex items-center gap-2.5 border border-emerald-300 bg-emerald-50 rounded-lg p-2.5 text-emerald-800">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white grid place-items-center shrink-0">
              <Icon name="check" size={13} />
            </span>
            <div>
              <strong className="block text-[10px] font-bold">DIVERIFIKASI</strong>
              <span className="block text-[8px] text-emerald-700 mt-0.5">
                Oleh: Tubagus · 17 Okt 2026, 16:00 WIB
              </span>
            </div>
          </div>

          {/* TL Box */}
          <div className="border border-slate-200 rounded-lg p-3 bg-white shadow-xs">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-800">
              <span className="text-purple-600">
                <Icon name="shield" size={15} />
              </span>
              <strong>Otorisasi Akhir TL</strong>
            </div>
            <label className="flex items-center gap-2 text-[9px] text-slate-700 mt-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer"
              />
              <span>Kode telah memenuhi standar arsitektur</span>
            </label>
            <p className="text-[8px] text-slate-500 mt-2 m-0">
              Status TL:{" "}
              <b className={role === "Technical Lead" ? "text-emerald-700" : "text-amber-700"}>
                {role === "Technical Lead" ? "SIAP DIOTORISASI" : "MENUNGGU PENGESAHAN"}
              </b>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="min-h-[64px] border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between sticky bottom-0">
        <Button variant="danger" onClick={handleReject}>
          Tolak & Kembalikan ke Development
        </Button>
        <div className="flex items-center gap-3">
          <small className="text-[9px] text-slate-400 max-w-[120px] text-right leading-tight">
            {!complete
              ? "Lengkapi 4 ceklis PM"
              : role !== "Technical Lead"
                ? "Hanya dapat dieksekusi Technical Lead"
                : "Semua verifikasi lengkap"}
          </small>
          <Button icon="shield" disabled={!canApprove} onClick={onSuccess}>
            Setujui dan Selesaikan Tugas
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
