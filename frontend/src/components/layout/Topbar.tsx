import Icon from "../common/Icon";

interface TopbarProps {
  role: string;
  roleShort: string;
  onOpenProfile: () => void;
  onNotificationClick?: () => void;
}

export default function Topbar({
  role,
  roleShort,
  onOpenProfile,
  onNotificationClick,
}: TopbarProps) {
  return (
    <header className="h-[72px] bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-7 sticky top-0 z-10 select-none">
      <div className="flex items-center gap-2.5 relative pt-2.5">
        <span className="text-[8px] font-extrabold tracking-[0.13em] text-slate-400 absolute top-0 uppercase">
          PROYEK AKTIF
        </span>
        <strong className="text-[13px] font-bold text-slate-900 mt-1">
          Implementasi Core Banking
        </strong>
        <i className="w-px h-4 bg-slate-200 mt-1 not-italic" />
        <b className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[5px] font-semibold mt-1">
          Sprint 1 (Aktif)
        </b>
      </div>

      <div className="flex items-center h-full gap-4">
        <button
          className="w-9 h-9 relative grid place-items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Notifikasi"
          type="button"
          onClick={onNotificationClick}
        >
          <Icon name="bell" size={18} />
          <i className="absolute right-1 top-1 w-4 h-4 border-2 border-white bg-rose-600 text-white rounded-full text-[8px] font-bold not-italic grid place-items-center shadow-xs">
            4
          </i>
        </button>

        <div className="w-px h-7 bg-slate-200" />

        <div className="relative">
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Buka profil dan simulasi role"
            className="border-0 bg-transparent flex items-center gap-2.5 text-left p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="w-[33px] h-[33px] rounded-lg grid place-items-center text-white bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-extrabold relative shadow-xs">
              TU
              <i className="absolute w-2 h-2 bg-emerald-500 rounded-full border-2 border-white -right-0.5 -bottom-0.5 not-italic" />
            </span>
            <span className="min-w-[118px]">
              <b className="block text-[11px] font-bold text-slate-800">Tubagus</b>
              <small className="block text-[9px] text-slate-500 mt-0.5 font-medium">
                {roleShort} · {role}
              </small>
            </span>
            <span className="rotate-90 text-slate-400">
              <Icon name="chevron" size={14} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
