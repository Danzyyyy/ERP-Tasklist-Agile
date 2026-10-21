import { FormEvent, useState } from "react";
import ModalShell from "./ModalShell";
import Button from "../common/Button";
import Icon from "../common/Icon";
import SelectField from "../common/SelectField";

interface TaskModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function TaskModal({ onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [complexity, setComplexity] = useState("MEDIUM");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (title.trim()) {
      onSave();
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* Modal Head */}
        <div className="min-h-[84px] px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div>
            <span className="text-blue-600 text-[9px] font-extrabold tracking-wider uppercase block">
              UI-K04-02 · TASK TEMPLATE
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1 mb-0.5">
              Form Input Tugas Proyek
            </h2>
            <p className="text-[10px] text-slate-500 m-0">
              Lengkapi detail tugas untuk ditambahkan ke dalam sprint.
            </p>
          </div>
          <button
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Tutup form"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-3.5">
          <SelectField label="Modul Induk *" value="Modul 1: Manajemen Rekening" />
          <SelectField label="Fitur Terkait" optional value="Fitur 1.1: Buka Tabungan" />

          <label className="block col-span-2">
            <span className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
              Judul Tugas *
            </span>
            <input
              className={`w-full h-9 px-2.5 rounded-md border text-[10px] focus:outline-none focus:border-blue-500 transition-colors ${
                submitted && !title ? "border-rose-400 bg-rose-50/50" : "border-slate-300 bg-white"
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Implementasi endpoint mutasi rekening"
            />
            {submitted && !title && (
              <small className="text-[8px] text-rose-600 block mt-1">
                Judul tugas wajib diisi.
              </small>
            )}
          </label>

          <label className="block col-span-2">
            <span className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
              Deskripsi Teknis *
            </span>
            <textarea
              className="w-full h-16 p-2.5 rounded-md border border-slate-300 text-[10px] text-slate-700 resize-none focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Jelaskan konteks teknis, kriteria penerimaan, dan output yang diharapkan..."
              defaultValue="Implementasikan fungsi sesuai kontrak API dan standar arsitektur Core Banking."
            />
          </label>

          <fieldset className="block border-0 p-0 m-0">
            <legend className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
              Bobot Kompleksitas *
            </legend>
            <div className="grid grid-cols-3 gap-1.5">
              {(["LOW", "MEDIUM", "HIGH"] as const).map((v) => {
                const isSelected = complexity === v;
                const toneStyle =
                  v === "LOW"
                    ? isSelected
                      ? "border-slate-400 bg-slate-100 text-slate-800"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    : v === "MEDIUM"
                      ? isSelected
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      : isSelected
                        ? "border-rose-400 bg-rose-50 text-rose-900"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50";

                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setComplexity(v)}
                    className={`h-9 border rounded-md flex items-center justify-center gap-1.5 text-[9px] font-extrabold cursor-pointer transition-colors ${toneStyle}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {v}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <span className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
              Estimasi Man-Hour *
            </span>
            <span className="flex items-center h-9 border border-slate-300 rounded-md overflow-hidden bg-white focus-within:border-blue-500">
              <input
                type="number"
                min=".5"
                step=".5"
                defaultValue="16.00"
                className="flex-1 w-0 h-full border-0 outline-none px-2.5 font-mono text-[10px] text-slate-700"
              />
              <b className="h-full px-3 border-l border-slate-200 grid place-items-center text-slate-500 text-[9px] bg-slate-50 font-bold">
                Jam
              </b>
            </span>
            <small className="text-[8px] text-slate-400 block mt-1">
              Minimal estimasi 0.5 jam.
            </small>
          </label>

          <label className="block">
            <span className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
              Tenggat Tugas *
            </span>
            <span className="flex items-center justify-between h-9 border border-slate-300 rounded-md px-2.5 bg-white focus-within:border-blue-500">
              <input
                type="text"
                defaultValue="2026-10-18"
                className="flex-1 border-0 outline-none text-[10px] text-slate-700"
              />
              <span className="text-slate-400">
                <Icon name="calendar" size={16} />
              </span>
            </span>
            <small className="text-[8px] text-rose-600 block mt-1">
              Maksimal H-1 dari Deliverable (25 Okt 2026)
            </small>
          </label>

          <SelectField label="PIC Pelaksana *" value="Pilih Karyawan" />
          <SelectField label="Dependensi Tugas" optional value="Tidak ada dependensi" />

          <fieldset className="block col-span-2 border-0 p-0 m-0">
            <legend className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold mb-1.5">
              Perilaku Dependensi
            </legend>
            <div className="flex items-center gap-6 h-8 text-[10px] text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dep"
                  defaultChecked
                  className="accent-blue-600 cursor-pointer"
                />
                Blocking (Hard Block)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="dep" className="accent-blue-600 cursor-pointer" />
                Peringatan (Warning)
              </label>
            </div>
          </fieldset>
        </div>

        {/* Modal Footer */}
        <div className="min-h-[64px] border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between sticky bottom-0">
          <p className="text-[9px] text-slate-500 flex items-center gap-1.5 m-0">
            <span className="text-blue-600">
              <Icon name="shield" size={15} />
            </span>
            Tersimpan sebagai DRAFT sebelum dual-approval.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Draft Task</Button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
