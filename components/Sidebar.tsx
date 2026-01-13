
import React from 'react';
import { 
  LayoutGrid, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  ClipboardList,
  FileCheck,
  History,
  Briefcase,
  ShieldCheck,
  Shield,
  ChevronRight,
  Layers,
  Activity,
  Sliders
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  isDark: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  activeTab, 
  setActiveTab, 
  userRole,
  isDark,
  toggleTheme,
  onLogout
}) => {
  const groups = [
    {
      title: 'Utama',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'assets_schedule', label: 'Aset & Jadwal', icon: Briefcase },
      ]
    },
    {
      title: 'Operasional',
      items: [
        { id: 'jobs', label: 'Work Order', icon: ClipboardList },
        { id: 'qualification', label: 'Kualifikasi', icon: ShieldCheck },
      ]
    },
    {
      title: 'Laporan',
      items: [
        { id: 'certificates', label: 'Sertifikat', icon: FileCheck },
        { id: 'audit', label: 'Log Audit', icon: History, roles: [UserRole.ADMIN, UserRole.QA] },
      ]
    },
    {
      title: 'Sistem',
      items: [
        { id: 'settings', label: 'Pengaturan', icon: Settings, roles: [UserRole.ADMIN, UserRole.QA] },
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-slate-950 flex flex-col z-[60] transition-all duration-500 ease-in-out border-r border-slate-200 dark:border-slate-800
        ${isOpen ? 'w-72 shadow-2xl shadow-slate-900/10 dark:shadow-black/40' : 'w-0 lg:w-24 -translate-x-full lg:translate-x-0 shadow-none'}`}
      >
        <div className="p-6 h-20 flex items-center gap-4 overflow-hidden shrink-0 border-b border-slate-200 dark:border-slate-900">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-teal-500/30 ring-4 ring-teal-50 dark:ring-teal-900/20">
            <Shield size={24} fill="currentColor" />
          </div>
          <div className={`transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <span className="font-black text-slate-900 dark:text-white block text-sm tracking-tight leading-none uppercase">Pharma QA</span>
            <span className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] mt-1 inline-block">Enterprise v2.5</span>
          </div>
        </div>

        <div className="flex-1 mt-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <p className={`text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-4 mb-2 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  if (item.roles && !item.roles.includes(userRole)) return null;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative ${
                        isActive 
                          ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/20' 
                          : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-teal-600 dark:hover:text-teal-400'
                      }`}
                    >
                      <item.icon size={20} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} />
                      
                      <span className={`font-bold text-xs whitespace-nowrap transition-all duration-500 ${
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'
                      }`}>
                        {item.label}
                      </span>

                      {!isOpen && (
                        <div className="absolute left-full ml-6 px-3 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all hidden lg:block whitespace-nowrap z-[70] shadow-xl uppercase tracking-widest">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/20 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all text-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:text-teal-600"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className={`font-bold text-xs transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}>
              {isDark ? 'Mode Terang' : 'Mode Gelap'}
            </span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className={`font-bold text-xs transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}>
              Keluar Sesi
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
