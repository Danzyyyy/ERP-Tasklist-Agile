import Button from "../common/Button";
import Badge from "../common/Badge";
import Icon from "../common/Icon";
import { availableRoles, permissionsMatrix } from "../../constants/mockData";

interface ProfileDrawerProps {
  role: string;
  onRole: (role: string) => void;
  onClose: () => void;
}

export default function ProfileDrawer({ role, onRole, onClose }: ProfileDrawerProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs animate-[fade_0.15s]"
      onMouseDown={onClose}
      role="presentation"
    >
      <aside
        className="absolute right-0 top-0 bottom-0 w-[430px] bg-slate-50 shadow-2xl overflow-y-auto animate-[drawer_0.22s_ease] border-l-4 border-l-blue-600 flex flex-col"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Head */}
        <div className="h-[72px] px-5 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
          <div>
            <span className="text-blue-600 text-[8px] font-extrabold tracking-widest uppercase block">
              ACCOUNT & ACCESS
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5 m-0">Detail Profil</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Tutup drawer"
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Card */}
          <div className="p-5 bg-white flex gap-3.5 items-center border-b border-slate-200">
            <span className="w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white grid place-items-center text-sm font-extrabold relative shadow-sm shrink-0">
              TU
              <i className="w-2.5 h-2.5 absolute -right-0.5 -bottom-0.5 rounded-full bg-emerald-500 border-2 border-white not-italic" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 m-0 mb-0.5 truncate">
                Tubagus Muhammad Wildan
              </h3>
              <p className="text-[9px] text-slate-500 m-0 mb-1.5 truncate">
                Project Manager · Digital Transformation Office
              </p>
              <Badge tone="green" dot>
                AKUN AKTIF
              </Badge>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white border-b border-slate-200 px-5 py-2 divide-y divide-slate-100">
            <div className="py-2.5">
              <span className="block text-[8px] text-slate-400 font-bold tracking-wider mb-1 uppercase">
                ID PEGAWAI · UUID v7
              </span>
              <code className="font-mono text-[9px] text-slate-600">
                0192a71b-48e7-7c02-b915-a4f293d8c120
              </code>
            </div>
            <div className="py-2.5">
              <span className="block text-[8px] text-slate-400 font-bold tracking-wider mb-1 uppercase">
                STATUS AUTENTIKASI · MODUL F-1
              </span>
              <p className="text-[9px] text-slate-700 m-0 flex items-center gap-1.5">
                <i className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 not-italic" />
                JWT Token valid <b className="text-slate-400 font-normal">· Exp. 17:30 WIB</b>
              </p>
            </div>
            <div className="py-2.5">
              <span className="block text-[8px] text-slate-400 font-bold tracking-wider mb-1 uppercase">
                LAST SECURE LOGIN
              </span>
              <p className="text-[9px] text-slate-700 m-0">
                17 Oktober 2026 · 08:02 WIB{" "}
                <b className="text-slate-400 font-normal">· Jakarta, ID</b>
              </p>
            </div>
          </div>

          {/* RBAC Simulation Section */}
          <section className="bg-white mt-2.5 border-y border-slate-200 p-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-extrabold tracking-wider text-slate-700 uppercase">
                SIMULASI GANTI PERAN
              </span>
              <Badge tone="blue">RBAC LIVE</Badge>
            </div>
            <p className="text-[9px] text-slate-500 m-0 mb-3 leading-relaxed">
              Berpindah peran akan mengubah hak akses tombol dan antrean kerja secara instan.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableRoles.map((item) => {
                const isSelected = role === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`min-h-[50px] flex items-center gap-2 text-left p-2 border rounded-lg transition-colors ${
                      isSelected
                        ? "border-blue-400 bg-blue-50/70"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                    onClick={() => onRole(item.name)}
                  >
                    <i
                      className={`w-7 h-7 rounded-md grid place-items-center not-italic text-[9px] font-extrabold shrink-0 ${
                        isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.short}
                    </i>
                    <span className="flex-1 min-w-0">
                      <b className="block text-[9px] font-bold text-slate-800 truncate">
                        {item.name}
                      </b>
                      <small className="block text-[7px] text-slate-400 mt-0.5 truncate">
                        {item.desc}
                      </small>
                    </span>
                    {isSelected && (
                      <span className="text-blue-600 shrink-0">
                        <Icon name="check" size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Permission Matrix */}
          <section className="bg-white mt-2.5 border-y border-slate-200 p-5">
            <span className="block text-[9px] font-extrabold tracking-wider text-slate-700 mb-2 uppercase">
              MATRIKS HAK AKSES
            </span>
            <div className="divide-y divide-slate-100">
              {permissionsMatrix.map((permission) => (
                <div
                  key={permission[0]}
                  className="min-h-[30px] flex items-center justify-between py-1.5 text-[9px]"
                >
                  <span className="text-slate-600">{permission[0]}</span>
                  <b className="text-[8px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                    {permission[1]}
                  </b>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-slate-200 shrink-0">
          <Button variant="secondary" className="w-full justify-center">
            Kelola Keamanan Akun
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-slate-400 text-[8px] mt-2 mb-0">
            <Icon name="shield" size={13} /> Perubahan role tercatat pada audit log.
          </p>
        </div>
      </aside>
    </div>
  );
}
