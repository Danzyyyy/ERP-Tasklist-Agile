import Icon from "./Icon";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 w-[350px] min-h-[68px] bg-white border border-emerald-200 border-l-4 border-l-emerald-600 rounded-lg shadow-xl p-3 flex items-start gap-2.5 animate-[slide_0.25s_ease]">
      <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
        <Icon name="check" size={17} />
      </span>
      <div className="flex-1 min-w-0">
        <strong className="block text-[11px] font-bold text-slate-800">Aksi berhasil</strong>
        <p className="text-[10px] text-slate-500 leading-normal mt-1 m-0">{message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors shrink-0"
        type="button"
      >
        <Icon name="x" size={15} />
      </button>
    </div>
  );
}
