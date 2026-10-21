import { useState } from "react";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import SelectField from "../components/common/SelectField";
import KanbanCard from "./KanbanCard";
import { initialTasks, stages } from "../constants/mockData";
import { Task } from "../types";

interface KanbanViewProps {
  onCreate: () => void;
  onApproval: () => void;
}

export default function KanbanView({ onCreate, onApproval }: KanbanViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dragged, setDragged] = useState<string | null>(null);

  const drop = (stage: string) => {
    if (!dragged) return;
    const task = tasks.find((t) => t.id === dragged);
    if (stage === "DONE") {
      onApproval();
      setDragged(null);
      return;
    }
    if (task) {
      setTasks((all) => all.map((t) => (t.id === dragged ? { ...t, stage } : t)));
    }
    setDragged(null);
  };

  const stageHeaderColors: Record<string, string> = {
    indigo: "text-indigo-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    cyan: "text-cyan-600",
    green: "text-emerald-600",
  };

  return (
    <main className="p-[25px_30px_28px] max-w-[1440px] mx-auto select-none">
      {/* Board Heading */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[8px] text-blue-600 tracking-[0.13em] font-extrabold uppercase m-0 mb-1.5">
            SPRINT EXECUTION <span className="text-slate-400">/ UI-K04-03</span>
          </p>
          <h1 className="text-[23px] font-extrabold tracking-[-0.035em] text-slate-900 leading-tight m-0">
            Agile Kanban Board
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-1.5">
            <span>Sprint 1 · 14–25 Oktober 2026</span>
            <Badge tone="green" dot>
              AKTIF
            </Badge>
          </div>
        </div>
        <Button icon="plus" onClick={onCreate}>
          Buat Tugas Cepat
        </Button>
      </div>

      {/* Board Toolbar */}
      <div className="h-[52px] bg-white border border-slate-200 rounded-xl flex items-center justify-between px-3 py-2 mb-3.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-[125px]">
            <SelectField value="Semua PIC" />
          </div>
          <div className="w-[125px]">
            <SelectField value="Semua Modul" />
          </div>
          <label className="w-[210px] h-8 bg-white border border-slate-200 rounded-md flex items-center px-2.5 gap-2 text-slate-600 text-[10px]">
            <span className="text-slate-400 shrink-0">
              <Icon name="search" size={16} />
            </span>
            <input
              className="border-0 outline-none w-full text-[10px] text-slate-700 placeholder:text-slate-400"
              placeholder="Cari tugas..."
            />
          </label>
        </div>
        <div className="flex items-center gap-4.5 pr-1">
          <span className="text-[10px] text-slate-500">
            <strong className="font-mono font-bold text-xs text-slate-800 mr-1">12</strong> Tugas
          </span>
          <span className="text-[10px] text-slate-500">
            <strong className="font-mono font-bold text-xs text-slate-800 mr-1">89h</strong>{" "}
            Estimasi
          </span>
          <span className="text-[10px] text-slate-500">
            <strong className="font-mono font-bold text-xs text-slate-800 mr-1">42%</strong> Selesai
          </span>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-5 gap-2.5 items-start overflow-x-auto pb-1">
        {stages.map((stage) => {
          const stageTasks = tasks.filter((t) => t.stage === stage.id);
          const headerColor = stageHeaderColors[stage.tone] || "text-slate-600";

          return (
            <section
              className="bg-slate-100/80 border border-slate-200 rounded-xl min-h-[530px] overflow-hidden flex flex-col"
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(stage.id)}
            >
              {/* Column Header */}
              <div className="h-10 px-2.5 flex items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-xs">
                <span
                  className={`text-[9px] font-extrabold tracking-wider flex items-center gap-1.5 uppercase ${headerColor}`}
                >
                  <i className="w-1.5 h-1.5 rounded-xs bg-current not-italic" />
                  {stage.label}
                </span>
                <div className="flex items-center gap-1">
                  <b className="min-w-5 h-5 rounded-md grid place-items-center bg-white border border-slate-200 font-mono text-[9px] font-bold text-slate-700">
                    {stageTasks.length}
                  </b>
                  <button
                    type="button"
                    aria-label="Opsi kolom"
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <Icon name="more" size={15} />
                  </button>
                </div>
              </div>

              {/* Column Cards */}
              <div className="p-2 min-h-[485px] flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {stageTasks.map((task) => (
                    <KanbanCard task={task} key={task.id} onDrag={setDragged} />
                  ))}
                </div>

                <button
                  className="h-8 w-full border border-dashed border-slate-300 bg-transparent rounded-lg text-slate-500 text-[10px] font-medium flex items-center justify-center gap-1 hover:bg-white hover:text-blue-600 hover:border-blue-300 transition-colors mt-2"
                  type="button"
                  onClick={onCreate}
                >
                  <Icon name="plus" size={14} /> Tambah tugas
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* Board Hint */}
      <div className="mt-3 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
        <span className="text-blue-600">
          <Icon name="shield" size={15} />
        </span>
        <span>
          Tugas di tahap Testing memerlukan pengesahan PM & TL sebelum dipindahkan ke Done.
        </span>
      </div>
    </main>
  );
}
