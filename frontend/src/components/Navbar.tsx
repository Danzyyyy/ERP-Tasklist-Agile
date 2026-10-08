import React from 'react';
import { 
  Kanban, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  UserCheck, 
  Code2, 
  CheckCircle2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types/task.types';

interface NavbarProps {
  currentTab: 'dashboard' | 'hierarchy' | 'kanban';
  onSelectTab: (tab: 'dashboard' | 'hierarchy' | 'kanban') => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole, token: string) => void;
}

const ROLES_CONFIG: {
  role: UserRole;
  name: string;
  token: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
}[] = [
  {
    role: 'TECHNICAL_LEAD',
    name: 'Fauzan (TL)',
    token: 'mock_tl',
    icon: ShieldCheck,
    color: 'from-amber-500 to-orange-600',
    badge: 'Dual-Approval & Sign-off',
  },
  {
    role: 'PROJECT_MANAGER',
    name: 'Tubagus M. Wildan (PM)',
    token: 'mock_pm',
    icon: UserCheck,
    color: 'from-blue-500 to-indigo-600',
    badge: 'Dual-Approval & PM Verify',
  },
  {
    role: 'DEVELOPER',
    name: 'Ariel (Dev)',
    token: 'mock_dev',
    icon: Code2,
    color: 'from-emerald-500 to-teal-600',
    badge: 'Code Execution',
  },
  {
    role: 'TESTER',
    name: 'Valdric (QA)',
    token: 'mock_tester',
    icon: CheckCircle2,
    color: 'from-purple-500 to-pink-600',
    badge: 'QA & Rework Gate',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  onRoleChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const activeRoleData = ROLES_CONFIG.find((r) => r.role === currentRole) || ROLES_CONFIG[0];
  const ActiveIcon = activeRoleData.icon;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-base">
                  PT. ANAHEIM NIMBUS UNIVERSAL
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Modul E-4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelompok 4 Kelas E • Tasklist dan Eksekusi Agile
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-850 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Progres</span>
            </button>

            <button
              onClick={() => onSelectTab('hierarchy')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'hierarchy'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Hierarki Tugas (SOP-05)</span>
            </button>

            <button
              onClick={() => onSelectTab('kanban')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Papan Agile (5 Kolom)</span>
            </button>
          </nav>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/80 transition-all text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${activeRoleData.color} flex items-center justify-center text-white shadow-sm`}>
                <ActiveIcon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <span>{activeRoleData.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-indigo-400 font-mono">
                  {activeRoleData.role}
                </div>
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                    Pilih Peran Pengguna (Modul F-1)
                  </div>
                  <div className="space-y-1 mt-1">
                    {ROLES_CONFIG.map((item) => {
                      const Icon = item.icon;
                      const isSelected = item.role === currentRole;
                      return (
                        <button
                          key={item.role}
                          onClick={() => {
                            onRoleChange(item.role, item.token);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                              : 'hover:bg-slate-850 text-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-100 truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.badge}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
