
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, Instrument, AssetStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssetAndSchedule from './components/AssetAndSchedule';
import CertificateManagement from './components/CertificateManagement';
import Workflow from './components/Workflow';
import AuditTrail from './components/AuditTrail';
import QualificationModule from './components/QualificationModule';
import SettingsModule from './components/SettingsModule';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Check,
  Menu,
  ChevronRight,
  Settings,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  X,
  Clock,
  Trash2
} from 'lucide-react';
import { MOCK_USERS, INITIAL_INSTRUMENTS } from './constants';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.find(u => u.name === 'Samsul') || MOCK_USERS[0]);
  
  const [instruments, setInstruments] = useState<Instrument[]>(INITIAL_INSTRUMENTS);
  const [showToast, setShowToast] = useState<{show: boolean, msg: string, type: 'success' | 'danger', action?: () => void, actionLabel?: string}>({show: false, msg: '', type: 'success'});
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [preSelectedInstId, setPreSelectedInstId] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const dueSoonInstruments = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return instruments.filter(inst => {
      const nextCal = new Date(inst.nextCalibration);
      return nextCal >= today && nextCal <= nextWeek;
    });
  }, [instruments]);

  const triggerToast = (msg: string, type: 'success' | 'danger' = 'success', action?: () => void, actionLabel?: string) => {
    setShowToast({ show: true, msg, type, action, actionLabel });
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleCalibrationSubmit = (instId: string, calDate: string) => {
    setInstruments(prev => prev.map(inst => {
      if (inst.id === instId) {
        const next = new Date(calDate);
        next.setMonth(next.getMonth() + 6);
        return {
          ...inst,
          lastCalibration: calDate,
          nextCalibration: next.toISOString().split('T')[0],
          status: AssetStatus.OPERATIONAL
        };
      }
      return inst;
    }));
    
    triggerToast(
      'Kalibrasi Berhasil Disimpan!', 
      'success',
      () => setActiveTab('certificates'),
      'Lihat Sertifikat'
    );
  };

  const deleteInstrument = (id: string) => {
    setInstruments(prev => prev.filter(i => i.id !== id));
    triggerToast('Aset berhasil dihapus dari sistem', 'danger');
  };

  const navigateToTab = (tab: string, instId?: string) => {
    if (instId) setPreSelectedInstId(instId);
    setActiveTab(tab);
    setShowNotifications(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ENGINEER: return 'Teknisi QA';
      case UserRole.COORDINATOR: return 'Koordinator';
      case UserRole.SUPERVISOR: return 'Supervisor';
      case UserRole.QA: return 'QA Admin';
      case UserRole.ADMIN: return 'Administrator';
      default: return role;
    }
  };

  if (isLoggedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-700 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-teal-600 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-teal-500/30">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Pharma QA</h1>
            <p className="text-slate-500 mt-3 text-xs font-bold uppercase tracking-[0.2em]">Portal Kepatuhan Industri</p>
          </div>
          <div className="space-y-4">
            {MOCK_USERS.map((user) => (
              <button 
                key={user.id} 
                onClick={() => { setCurrentUser(user); setIsLoggedOut(false); setActiveTab('dashboard'); }} 
                className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-left group shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <UserIcon size={20} />
                </div>
                <div className="flex-1">
                   <p className="font-black text-slate-800 dark:text-white text-sm leading-none">{user.name}</p>
                   <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1.5">{getRoleLabel(user.role as UserRole)}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} setActiveTab={setActiveTab}
        userRole={currentUser.role as UserRole} isDark={isDarkMode}
        toggleTheme={toggleTheme} onLogout={() => setIsLoggedOut(true)}
      />
      
      <main className="flex-1 min-w-0 flex flex-col relative h-screen bg-white dark:bg-slate-950">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-50 shrink-0 shadow-sm shadow-slate-200/50 dark:shadow-black/20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 lg:hidden">
              <Menu size={20} className="text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{activeTab.replace('_', ' ')}</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Pharma QA v2.5</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl border transition-all relative ${
                  showNotifications 
                    ? 'bg-teal-600 text-white border-teal-600' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-500'
                }`}
              >
                <Bell size={20} />
                {dueSoonInstruments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                    {dueSoonInstruments.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2 duration-300">
                  <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lansiran Kepatuhan</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {dueSoonInstruments.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {dueSoonInstruments.map((inst) => {
                          const daysLeft = Math.ceil((new Date(inst.nextCalibration).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                          return (
                            <button 
                              key={inst.id}
                              onClick={() => navigateToTab('jobs', inst.id)}
                              className="w-full p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex gap-4 group"
                            >
                              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                                <AlertCircle size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-slate-800 dark:text-white truncate uppercase">{inst.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">#{inst.code} • {inst.parameter}</p>
                                <div className="mt-2 flex items-center gap-1.5 text-rose-600 font-black text-[9px] uppercase tracking-tighter">
                                  <Clock size={10} /> Jatuh tempo {daysLeft === 0 ? 'Hari Ini' : `dalam ${daysLeft} hari`}
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-teal-600 self-center" />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-10 text-center space-y-3">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-300">
                          <Bell size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">Semua parameter sesuai GMP.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block text-right">
              <p className="text-xs font-black text-slate-900 dark:text-white leading-none uppercase">{currentUser.name}</p>
              <p className="text-[9px] text-teal-600 font-black uppercase mt-1 tracking-widest">{getRoleLabel(currentUser.role as UserRole)}</p>
            </div>
            
            <div className="relative group">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 border-2 border-white dark:border-slate-800 cursor-pointer group-hover:scale-105 transition-transform">
                <UserIcon size={18} />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-slate-50/30 dark:bg-transparent">
          <div className="max-w-screen-2xl mx-auto">
             {activeTab === 'dashboard' && (
               <Dashboard 
                 instruments={instruments} 
                 onNavigate={navigateToTab} 
               />
             )}
             {activeTab === 'assets_schedule' && (
               <AssetAndSchedule 
                 instruments={instruments} 
                 setInstruments={setInstruments} 
                 triggerToast={triggerToast} 
                 onSelectForCalibration={(id) => navigateToTab('jobs', id)} 
                 onDeleteAsset={deleteInstrument}
               />
             )}
             {activeTab === 'certificates' && <CertificateManagement instruments={instruments} />}
             {activeTab === 'jobs' && (
               <Workflow 
                 instruments={instruments} 
                 onCalibrationSubmit={handleCalibrationSubmit} 
                 initialInstId={preSelectedInstId} 
                 clearSelection={() => setPreSelectedInstId(null)} 
                 currentUser={currentUser.name} 
               />
             )}
             {activeTab === 'audit' && <AuditTrail />}
             {activeTab === 'qualification' && <QualificationModule />}
             {activeTab === 'settings' && <SettingsModule />}
          </div>
        </div>
      </main>
      
      {showToast.show && (
        <div className={`fixed bottom-10 right-10 z-[100] ${showToast.type === 'danger' ? 'bg-rose-600' : 'bg-slate-900 dark:bg-slate-800'} text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-6 animate-in slide-in-from-right-10 border border-white/10`}>
          <div className={`${showToast.type === 'danger' ? 'bg-white text-rose-600' : 'bg-teal-500 text-white'} rounded-full p-1.5`}>
            {showToast.type === 'danger' ? <Trash2 size={18} /> : <Check size={18} strokeWidth={3} />}
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-bold">{showToast.msg}</span>
             {showToast.action && (
               <button 
                onClick={showToast.action}
                className="text-[10px] font-black text-teal-400 uppercase tracking-widest mt-1 flex items-center gap-1 hover:text-teal-300"
               >
                 {showToast.actionLabel} <ExternalLink size={10} />
               </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
