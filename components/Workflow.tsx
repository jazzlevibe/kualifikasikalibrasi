
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardCheck, Activity, Check, User, Info, Calendar, Search, X, Zap, ChevronRight,
  ShieldCheck, AlertCircle, Sparkles, Loader2
} from 'lucide-react';
import { Instrument } from '../types';

interface WorkflowProps {
  instruments: Instrument[];
  onCalibrationSubmit: (instId: string, calDate: string) => void;
  initialInstId: string | null;
  clearSelection: () => void;
  currentUser: string;
}

const Workflow: React.FC<WorkflowProps> = ({ instruments, onCalibrationSubmit, initialInstId, clearSelection, currentUser }) => {
  const [selectedInstId, setSelectedInstId] = useState(initialInstId || '');
  const [activeStep, setActiveStep] = useState(1);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialInstId) setSelectedInstId(initialInstId);
  }, [initialInstId]);

  const [headerData, setHeaderData] = useState({
    calDate: new Date().toISOString().split('T')[0],
    envTemp: '22.5',
    envRH: '55.0',
    officer: currentUser,
  });

  const [conclusion, setConclusion] = useState<'MS' | 'TMS'>('MS');

  const selectedInst = useMemo(() => instruments.find(i => i.id === selectedInstId), [selectedInstId, instruments]);

  const handleSelectInstrument = (id: string) => {
    setSelectedInstId(id);
    setIsPickerOpen(false);
    setActiveStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstId) return;
    
    setIsSubmitting(true);
    // Mock processing time for better UX
    setTimeout(() => {
      onCalibrationSubmit(selectedInstId, headerData.calDate);
      clearSelection();
      setSelectedInstId('');
      setActiveStep(1);
      setIsSubmitting(false);
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between px-10 py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
      {[
        { id: 1, label: 'Kondisi', icon: Info },
        { id: 2, label: 'Pengujian', icon: Activity },
        { id: 3, label: 'Verifikasi', icon: ClipboardCheck }
      ].map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2 flex-1 relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10 ${
              activeStep === step.id 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                : activeStep > step.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {activeStep > step.id ? <Check size={20} strokeWidth={3} /> : <step.icon size={18} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep === step.id ? 'text-teal-600' : 'text-slate-400'}`}>
              {step.label}
            </span>
          </div>
          {idx < 2 && <div className={`w-full h-[2px] mb-4 ${activeStep > step.id ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto h-full pb-10">
      {!selectedInstId ? (
        <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 py-20">
           <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                 <Zap size={14} fill="currentColor" /> Sistem Input Kerja
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Mulai Kalibrasi Baru</h2>
              <p className="text-slate-500 max-w-md mx-auto text-sm font-medium">Lanjutkan pekerjaan yang dijadwalkan atau masukkan Kode ID Alat secara manual.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              <button 
                onClick={() => setIsPickerOpen(true)}
                className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-left flex flex-col gap-6 hover:border-teal-500 transition-all group"
              >
                 <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shadow-teal-500/20">
                    <Calendar size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Pilih Dari Jadwal</h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">Daftar alat jatuh tempo bulan ini.</p>
                 </div>
              </button>

              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-left flex flex-col gap-6 group hover:border-teal-500 transition-all">
                 <div className="w-16 h-16 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Search size={28} />
                 </div>
                 <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">ID Tag Manual</h3>
                    <input 
                      type="text" 
                      placeholder="Masukkan Kode ID..." 
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none font-bold text-sm border border-slate-100 dark:border-slate-800 focus:border-teal-500 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const found = instruments.find(i => i.code.toLowerCase() === (e.target as HTMLInputElement).value.toLowerCase());
                          if (found) handleSelectInstrument(found.id);
                        }
                      }}
                    />
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[600px] shadow-sm animate-in slide-in-from-bottom-6">
           {renderStepIndicator()}

           <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-10">
                 {activeStep === 1 && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="bg-slate-900 dark:bg-teal-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-white/5">
                             <div className="relative z-10">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-2">Pekerjaan Aktif</h3>
                                <h4 className="text-2xl font-black leading-tight mb-1 uppercase tracking-tight">{selectedInst?.name}</h4>
                                <p className="text-xs font-bold text-teal-500 tracking-wider">#{selectedInst?.code}</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
                                <div><p className="text-[9px] uppercase font-black text-teal-500 mb-1 tracking-widest">Parameter</p><p className="text-xs font-bold text-white">{selectedInst?.parameter}</p></div>
                                <div><p className="text-[9px] uppercase font-black text-teal-500 mb-1 tracking-widest">Toleransi</p><p className="text-xs font-bold text-emerald-400">{selectedInst?.tolerance}</p></div>
                             </div>
                          </div>

                          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Suhu Ambien (°C)</label>
                                <input type="number" step="0.1" className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none outline-none font-black text-xl focus:ring-2 focus:ring-teal-500 dark:text-white" value={headerData.envTemp} onChange={(e) => setHeaderData({...headerData, envTemp: e.target.value})} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kelembaban (%)</label>
                                <input type="number" step="0.1" className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none outline-none font-black text-xl focus:ring-2 focus:ring-teal-500 dark:text-white" value={headerData.envRH} onChange={(e) => setHeaderData({...headerData, envRH: e.target.value})} />
                             </div>
                             <div className="sm:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Petugas Pelaksana</label>
                                <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                   <User size={18} className="text-teal-600" />
                                   <span className="font-black text-sm uppercase tracking-tight">{headerData.officer}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeStep === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                       <div className="bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                          <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">
                             <Activity size={18} className="text-teal-600" /> Lembar Kerja Teknis GXP
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
                               <thead>
                                  <tr className="text-[10px] font-black text-slate-400 uppercase text-left tracking-widest">
                                     <th className="pb-4 px-2">Set Point</th>
                                     <th className="pb-4 px-2">Pembacaan</th>
                                     <th className="pb-4 px-2">Standar</th>
                                     <th className="pb-4 px-2 text-center">Deviasi</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                  {[1, 2, 3].map(i => (
                                     <tr key={i}>
                                        <td className="py-4 px-1"><input type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl font-black text-center text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:text-white" placeholder="0.0" /></td>
                                        <td className="py-4 px-1"><input type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl font-black text-center text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:text-white" placeholder="0.0" /></td>
                                        <td className="py-4 px-1"><input type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl font-black text-center text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:text-white" placeholder="0.0" /></td>
                                        <td className="py-4 px-1 text-center font-black text-teal-600 dark:text-teal-400 text-sm">0.00</td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeStep === 3 && (
                    <div className="space-y-6 animate-in fade-in max-w-xl mx-auto">
                       <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl space-y-10">
                          <div className="text-center">
                             <div className="w-20 h-20 bg-teal-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/20"><ShieldCheck size={36} /></div>
                             <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none uppercase">Status Akhir Kalibrasi</h3>
                             <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">Nyatakan kelaikan alat sesuai standar baku.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <button type="button" onClick={() => setConclusion('MS')} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${conclusion === 'MS' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20' : 'border-slate-50 dark:border-slate-800 text-slate-300'}`}>
                                <Check size={32} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">MS (Memenuhi Syarat)</span>
                             </button>
                             <button type="button" onClick={() => setConclusion('TMS')} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${conclusion === 'TMS' ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20' : 'border-slate-50 dark:border-slate-800 text-slate-300'}`}>
                                <AlertCircle size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">TMS (Tidak Memenuhi Syarat)</span>
                             </button>
                          </div>
                          <button 
                            disabled={isSubmitting}
                            type="submit" 
                            className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                          >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'SIMPAN & VALIDASI DATA'}
                          </button>
                       </div>
                    </div>
                 )}
              </form>
           </div>

           <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <button onClick={() => { setSelectedInstId(''); setActiveStep(1); }} className="px-6 py-3 text-slate-400 font-black hover:text-rose-500 transition-colors uppercase text-[10px] tracking-widest">Batal</button>
              <div className="flex gap-4">
                 {activeStep > 1 && <button onClick={() => setActiveStep(activeStep - 1)} className="px-8 py-3 text-slate-500 dark:text-slate-400 rounded-xl font-black border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest">KEMBALI</button>}
                 {activeStep < 3 && <button onClick={() => setActiveStep(activeStep + 1)} className="px-10 py-3 bg-teal-600 text-white rounded-xl font-black flex items-center gap-2 text-[10px] uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20">LANJUT <ChevronRight size={16} /></button>}
              </div>
           </div>
        </div>
      )}

      {/* Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsPickerOpen(false)}></div>
           <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-700">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Pilih Alat Dari Jadwal</h3>
                 <button onClick={() => setIsPickerOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><X className="text-slate-400" /></button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                 {instruments.map(inst => (
                   <button 
                    key={inst.id} 
                    onClick={() => handleSelectInstrument(inst.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-2xl transition-all border border-transparent hover:border-teal-100 group"
                   >
                      <div className="flex flex-col items-start">
                         <span className="text-sm font-black dark:text-white leading-none uppercase tracking-tight group-hover:text-teal-600">{inst.name}</span>
                         <span className="text-[10px] text-slate-400 font-black mt-2 uppercase tracking-widest">#{inst.code} • {inst.parameter}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Workflow;
