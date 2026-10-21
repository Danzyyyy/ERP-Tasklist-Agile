import { useState } from "react";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import SelectField from "../components/common/SelectField";
import Approval from "../components/common/Approval";
import { treeRows, statusTone } from "../constants/mockData";

interface TasklistViewProps {
  onCreate: () => void;
  onBoard: () => void;
  toast: (message: string) => void;
}

export default function TasklistView({ onCreate, onBoard, toast }: TasklistViewProps) {
  const [moduleOpen, setModuleOpen] = useState(true);
  const [featureOpen, setFeatureOpen] = useState(true);
  const [selected, setSelected] = useState<string[]>(["TSK-04"]);

  const visibleRows = treeRows.filter((row) => {
    if (!moduleOpen && row.depth > 0) return false;
    if (!featureOpen && row.depth === 2) return false;
    return true;
  });

  const toggleSelected = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto select-none">
      {/* Page Heading */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[8px] text-blue-600 tracking-[0.13em] font-extrabold uppercase m-0 mb-1.5">
            EXECUTION WORKSPACE <span className="text-slate-400">/ UI-K04-01</span>
          </p>
          <h1 className="text-[23px] font-extrabold tracking-[-0.035em] text-slate-900 leading-tight m-0">
            Tasklist & Persetujuan
          </h1>
          <p className="text-slate-500 text-[10px] mt-1.5 mb-0">
            Kelola struktur deliverable, estimasi, dan alur dual-approval dalam satu tampilan.
          </p>
        </div>
        <Button icon="plus" onClick={onCreate}>
          Tambah Modul/Task
        </Button>
      </div>

      {/* Progress Card */}
      <section className="border border-blue-200/80 bg-gradient-to-r from-white via-white to-blue-50/40 rounded-xl p-4 mb-3.5 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0">
            <Icon name="sparkle" size={18} />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[10px] font-bold text-slate-700">Progres Deliverable Sprint</span>
            <strong className="font-mono text-sm font-bold text-slate-900">
              145 <small className="text-[9px] text-slate-500 font-normal">/ 200 Jam</small>
            </strong>
          </div>
          <div className="ml-auto text-right">
            <strong className="block text-base font-extrabold text-blue-600">72.5%</strong>
            <span className="block text-[8px] text-slate-500 font-medium">Man-hour selesai</span>
          </div>
        </div>

        <div className="h-5 bg-slate-200/70 rounded-md overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 flex items-center justify-center text-white font-mono text-[9px] font-semibold rounded-md relative overflow-hidden"
            style={{ width: "72.5%" }}
          >
            <span className="relative z-10 drop-shadow-xs">
              72.5% (145/200 Jam Man-hour Selesai)
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_infinite]" />
          </div>
        </div>

        <p className="mt-2 m-0 flex items-center gap-1.5 text-[8px] text-slate-500">
          <span className="text-emerald-600">
            <Icon name="check" size={13} />
          </span>
          Dihitung otomatis dari total man-hour tugas berstatus DONE.
        </p>
      </section>

      {/* Table Card */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="min-h-[55px] flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-200 bg-slate-50/50">
          <div className="w-[130px]">
            <SelectField value="Semua Modul" />
          </div>
          <div className="w-[130px]">
            <SelectField value="Semua Status" />
          </div>
          <div className="w-[140px]">
            <SelectField value="Semua Assignee" />
          </div>
          <label className="ml-auto w-[210px] h-8 bg-white border border-slate-200 rounded-md flex items-center px-2.5 gap-2 text-slate-600 text-[10px] shadow-2xs">
            <span className="text-slate-400 shrink-0">
              <Icon name="search" size={16} />
            </span>
            <input
              className="border-0 outline-none w-full text-[10px] text-slate-700 placeholder:text-slate-400"
              placeholder="Cari tugas..."
            />
          </label>
          <button
            className="w-8 h-8 border border-slate-200 rounded-md bg-white text-slate-500 grid place-items-center hover:bg-slate-50 hover:text-slate-800 transition-colors shrink-0"
            type="button"
            aria-label="Opsi filter"
          >
            <Icon name="more" size={16} />
          </button>
        </div>

        {/* Head */}
        <div className="h-9 px-3.5 bg-slate-50 border-b border-slate-200 text-slate-400 text-[8px] font-extrabold tracking-wider grid grid-cols-[minmax(340px,2.5fr)_0.62fr_0.68fr_0.85fr_0.95fr_1fr_1fr] items-center uppercase">
          <span>STRUKTUR PEKERJAAN</span>
          <span>BOBOT</span>
          <span>ESTIMASI</span>
          <span>TENGGAT</span>
          <span>PIC</span>
          <span>STATUS</span>
          <span>DUAL-APPROVAL</span>
        </div>

        {/* Tree Rows */}
        <div className="divide-y divide-slate-100">
          {visibleRows.map((row) => {
            const isModul = row.kind === "Modul";
            const isFitur = row.kind === "Fitur";
            const rowBg = isModul
              ? "bg-blue-50/30"
              : isFitur
                ? "bg-slate-50/50"
                : "bg-white hover:bg-blue-50/20";

            return (
              <div
                className={`min-h-[54px] px-3.5 grid grid-cols-[minmax(340px,2.5fr)_0.62fr_0.68fr_0.85fr_0.95fr_1fr_1fr] items-center text-[10px] text-slate-600 transition-colors ${rowBg}`}
                key={row.id}
              >
                {/* Task Cell with Depth Indentation */}
                <div
                  className="flex items-center gap-2 min-w-0"
                  style={{ paddingLeft: `${row.depth * 23}px` }}
                >
                  {row.kind === "Tugas" ? (
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => toggleSelected(row.id)}
                      aria-label={`Pilih ${row.title}`}
                      className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600 cursor-pointer shrink-0"
                    />
                  ) : (
                    <button
                      type="button"
                      className={`w-4 h-4 grid place-items-center text-slate-400 hover:text-slate-600 transition-transform ${
                        (row.id === "module" ? moduleOpen : featureOpen) ? "rotate-90" : ""
                      }`}
                      onClick={() =>
                        row.id === "module"
                          ? setModuleOpen(!moduleOpen)
                          : setFeatureOpen(!featureOpen)
                      }
                      aria-label="Toggle baris hierarki"
                    >
                      <Icon name="chevron" size={14} />
                    </button>
                  )}

                  <span
                    className={`w-7 h-7 rounded-md grid place-items-center shrink-0 ${
                      row.kind === "Modul"
                        ? "bg-blue-100 text-blue-600"
                        : row.kind === "Fitur"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon
                      name={
                        row.kind === "Modul" ? "folder" : row.kind === "Fitur" ? "board" : "task"
                      }
                      size={15}
                    />
                  </span>

                  <span className="min-w-0 truncate">
                    {row.code && (
                      <b className="font-mono text-[8px] text-blue-600 font-semibold block leading-tight">
                        {row.code}
                      </b>
                    )}
                    <strong className="block text-slate-800 font-bold truncate leading-tight">
                      {row.title}
                    </strong>
                    {row.meta && (
                      <small className="block text-[8px] text-slate-400 mt-0.5 truncate">
                        {row.meta}
                      </small>
                    )}
                  </span>
                </div>

                {/* Weight */}
                <span>
                  {row.weight === "—" ? (
                    <span className="text-slate-300 font-mono">—</span>
                  ) : (
                    <Badge tone={row.weight.toLowerCase()}>{row.weight}</Badge>
                  )}
                </span>

                {/* Hours */}
                <span className="font-mono text-[9px] font-semibold text-slate-700">
                  {row.hours}
                </span>

                {/* Due */}
                <span className="text-[10px] text-slate-600">{row.due}</span>

                {/* PIC */}
                <span className="flex items-center gap-1.5 min-w-0">
                  <i className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[8px] font-extrabold not-italic grid place-items-center shrink-0">
                    {row.pic.slice(0, 2).toUpperCase()}
                  </i>
                  <span className="truncate">{row.pic}</span>
                </span>

                {/* Status */}
                <span>
                  <Badge tone={statusTone[row.status]} dot>
                    {row.status}
                  </Badge>
                </span>

                {/* Approval */}
                <Approval value={row.approval} />
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="min-h-[62px] bg-slate-50 border-t border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-slate-800">
              {selected.length} tugas dipilih
            </span>
            <small className="block text-[8px] text-slate-400 mt-0.5">
              Persetujuan memerlukan otorisasi TL dan PM
            </small>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onBoard}>
              Buka Agile Kanban Board <Icon name="arrow" size={14} />
            </Button>
            <Button
              icon="shield"
              onClick={() => toast("Permintaan dual-approval berhasil dikirim ke Technical Lead.")}
            >
              Setujui Rilis Terpilih (Dual-Approval)
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
