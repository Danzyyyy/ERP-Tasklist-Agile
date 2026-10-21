import Icon from "../common/Icon";
import Badge from "../common/Badge";
import { View } from "../../types";
import { navItems } from "../../constants/mockData";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-[238px] min-h-screen fixed inset-y-0 left-0 z-20 bg-slate-900 text-slate-300 flex flex-col border-r border-white/5 select-none">
      {/* Brand */}
      <div className="h-[72px] px-[22px] flex items-center gap-[11px] border-b border-slate-700/50">
        <div className="w-8 h-8 relative drop-shadow-[0_4px_10px_rgba(37,99,235,0.35)] flex items-center justify-center shrink-0">
          <div
            className="absolute inset-[1px] bg-gradient-to-br from-blue-400 to-blue-600"
            style={{ clipPath: "polygon(50% 0, 100% 88%, 0 88%)" }}
          />
          <div
            className="absolute inset-[9px_9px_8px] bg-slate-900"
            style={{ clipPath: "polygon(50% 0, 100% 88%, 0 88%)" }}
          />
        </div>
        <div>
          <strong className="block text-white text-sm tracking-[0.14em] font-extrabold leading-tight">
            ANAHEIM
          </strong>
          <small className="block text-slate-400 text-[8px] tracking-[0.16em] uppercase mt-0.5">
            Nimbus Universal
          </small>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="p-[18px_14px_8px]">
        <span className="block px-2.5 text-slate-400 font-bold tracking-[0.12em] text-[9px] mb-2 uppercase">
          ERP WORKSPACE
        </span>
        <button
          type="button"
          className="w-full border border-slate-700/60 bg-white/[0.04] text-slate-200 rounded-lg p-[9px_10px] flex items-center gap-[9px] text-[11px] hover:bg-white/[0.08] transition-colors"
        >
          <i className="w-[25px] h-[25px] rounded-[6px] grid place-items-center bg-blue-900/80 text-blue-300 not-italic text-[9px] font-extrabold shrink-0">
            CB
          </i>
          <b className="flex-1 text-left font-semibold text-slate-100">Core Banking</b>
          <span className="rotate-90 text-slate-400 shrink-0">
            <Icon name="chevron" size={14} />
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-[14px_12px] flex-1">
        <span className="block px-2.5 text-slate-400 font-bold tracking-[0.12em] text-[9px] mb-2 uppercase">
          UTAMA
        </span>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.view === currentView;
            return (
              <button
                key={item.label}
                type="button"
                className={`w-full h-[42px] border-0 rounded-[7px] flex items-center gap-3 px-3 text-xs font-semibold relative transition-colors ${
                  isActive
                    ? "text-white bg-gradient-to-r from-blue-600/30 to-blue-600/10 before:content-[''] before:w-[3px] before:h-6 before:absolute before:-left-3 before:rounded-r-[3px] before:bg-blue-500 before:shadow-[0_0_16px_#3b82f6] [&_svg]:text-blue-400"
                    : "text-slate-400 hover:text-blue-100 hover:bg-white/[0.04] [&_svg]:text-slate-400"
                }`}
                onClick={() => onViewChange(item.view)}
              >
                <Icon name={item.icon} size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.label === "Review & Testing" && (
                  <b className="w-5 h-5 rounded-[6px] bg-rose-500/20 text-rose-300 grid place-items-center text-[9px] font-bold">
                    3
                  </b>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto p-3.5 border-t border-slate-700/50">
        <div className="bg-white/[0.04] border border-slate-700/60 rounded-[9px] p-3 mb-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-extrabold tracking-wider text-slate-400">
              SPRINT 1
            </span>
            <Badge tone="green">AKTIF</Badge>
          </div>
          <strong className="text-white text-[11px] block mt-2 font-bold">8 hari tersisa</strong>
          <div className="h-1 bg-slate-700 rounded-full my-2 overflow-hidden">
            <div className="w-[42%] h-full bg-blue-500 rounded-full" />
          </div>
          <small className="text-[8px] text-slate-400 block">42% sprint terselesaikan</small>
        </div>

        <button
          className="w-full flex items-center gap-2.5 bg-transparent border-0 text-slate-400 p-2 text-left hover:text-slate-200 transition-colors rounded-lg"
          type="button"
        >
          <span className="w-[27px] h-[27px] border border-slate-700 rounded-full grid place-items-center text-xs font-bold shrink-0">
            ?
          </span>
          <div>
            <b className="block text-[10px] font-semibold text-slate-300">Pusat Bantuan</b>
            <small className="block text-[8px] text-slate-400 mt-0.5">Dokumentasi modul</small>
          </div>
        </button>
      </div>
    </aside>
  );
}
