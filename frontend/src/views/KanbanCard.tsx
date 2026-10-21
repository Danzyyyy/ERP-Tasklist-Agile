import Icon from "../components/common/Icon";
import Badge from "../components/common/Badge";
import { Task } from "../types";

interface KanbanCardProps {
  task: Task;
  onDrag: (id: string) => void;
}

export default function KanbanCard({ task, onDrag }: KanbanCardProps) {
  return (
    <article
      className="bg-white border border-slate-200 rounded-lg p-2.5 mb-2 shadow-xs relative hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing group select-none"
      draggable
      onDragStart={() => onDrag(task.id)}
    >
      <div className="absolute left-1 top-7 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <Icon name="grip" size={14} />
      </div>

      <div className="flex items-center justify-between">
        <code className="text-blue-600 font-mono text-[9px] font-semibold">#{task.id}</code>
        <button
          aria-label="Menu tugas"
          type="button"
          className="text-slate-400 hover:text-slate-600 p-0.5"
        >
          <Icon name="more" size={15} />
        </button>
      </div>

      <h3 className="text-[11px] font-bold text-slate-800 leading-snug my-1.5 min-h-[28px]">
        {task.title}
      </h3>

      <div className="flex items-center gap-1.5 mb-2">
        <Badge tone={task.weight.toLowerCase()}>{task.weight}</Badge>
        {task.rework && <Badge tone="red">REWORK</Badge>}
      </div>

      <p className="border-t border-slate-100 pt-1.5 mb-2 text-[8px] text-slate-400 m-0">
        Modul: <strong className="text-slate-600 font-semibold">Rekening</strong>
      </p>

      <div className="grid grid-cols-[25px_1fr_auto] items-center gap-1.5">
        <span
          className={`w-[25px] h-[25px] rounded-md grid place-items-center text-white text-[9px] font-extrabold uppercase shrink-0 ${
            task.pic === "Ariel"
              ? "bg-gradient-to-br from-purple-500 to-purple-700"
              : "bg-gradient-to-br from-blue-500 to-blue-700"
          }`}
        >
          {task.pic.slice(0, 2)}
        </span>
        <span className="text-[8px] text-slate-600 font-semibold min-w-0 truncate">
          <small className="block text-[7px] text-slate-400 font-normal leading-none mb-0.5">
            PIC
          </small>
          {task.pic} ({task.role})
        </span>
        <span className="flex items-center gap-1 font-mono text-[8px] text-slate-500 whitespace-nowrap">
          <Icon name="clock" size={12} /> Est: {task.hours}h
        </span>
      </div>
    </article>
  );
}
