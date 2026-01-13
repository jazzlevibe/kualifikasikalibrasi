
import React, { useState } from 'react';
import { 
  ShieldCheck, Layers, CheckCircle2, ClipboardCheck, FileText, Clock, ChevronRight,
  Zap, Check, AlertCircle, Target, X, User, Activity, ShieldAlert, Calendar,
  ClipboardList, Plus, Save, Beaker, Edit, Trash2, Edit2, Loader2
} from 'lucide-react';

interface ProtocolItem {
  id: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'FAILED';
  date: string;
  procedure: string;
  acceptanceCriteria: string;
  tester: string;
  results?: string;
}

const INITIAL_PROTOCOLS: Record<string, ProtocolItem[]> = {
  IQ: [
    { 
      id: 'IQ-001', 
      title: 'Verifikasi Komponen Utama', 
      status: 'COMPLETED', 
      date: '20-03-2024',
      procedure: 'Memeriksa kesesuaian serial number komponen kritis (Motor, Sensor, PLC) dengan daftar material pada manual book.',
      acceptanceCriteria: 'Semua serial number harus cocok 100% dengan dokumen teknis pabrikan.',
      tester: 'Juan (Engineer)',
      results: 'Ditemukan kesesuaian pada 15 titik pemeriksaan. Tidak ada deviasi.'
    },
    { 
      id: 'IQ-002', 
      title: 'Cek Utilitas (Listrik/Udara)', 
      status: 'COMPLETED', 
      date: '19-03-2024',
      procedure: 'Mengukur voltase input dan tekanan udara kompresi yang masuk ke sistem menggunakan multimeter dan manometer terkalibrasi.',
      acceptanceCriteria: 'Voltase: 220V ± 10%, Tekanan Udara: 6-8 Bar.',
      tester: 'Ade (Coordinator)',
      results: 'Voltase stabil di 222V, Tekanan udara konstan di 7.2 Bar.'
    },
  ],
  DQ: [], OQ: [], PQ: []
};

const QualificationModule: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'DQ' | 'IQ' | 'OQ' | 'PQ'>('IQ');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolItem | null>(null);
  const [protocols, setProtocols] = useState<Record<string, ProtocolItem[]>>(INITIAL_PROTOCOLS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newProtocol, setNewProtocol] = useState({
    title: '',
    procedure: '',
    acceptanceCriteria: '',
    tester: '',
    status: 'PENDING' as ProtocolItem['status']
  });

  const stages = [
    { id: 'DQ', label: 'Design Qualification', icon: FileText },
    { id: 'IQ', label: 'Installation Qualification', icon: Layers },
    { id: 'OQ', label: 'Operational Qualification', icon: Zap },
    { id: 'PQ', label: 'Performance Qualification', icon: Target },
  ];

  const handleOpenEdit = (e: React.MouseEvent, item: ProtocolItem) => {
    e.stopPropagation();
    setEditingId(item.id);
    setNewProtocol({
      title: item.title,
      procedure: item.procedure,
      acceptanceCriteria: item.acceptanceCriteria,
      tester: item.tester,
      status: item.status
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteProtocol = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Hapus protocol kualifikasi ini?')) {
      setProtocols(prev => ({
        ...prev,
        [activeStage]: prev[activeStage].filter(p => p.id !== id)
      }));
    }
  };

  const handleSaveProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProtocols(prev => ({
        ...prev,
        [activeStage]: prev[activeStage].map(p => 
          p.id === editingId ? { ...p, ...newProtocol } : p
        )
      }));
    } else {
      const newItem: ProtocolItem = {
        ...newProtocol,
        id: `${activeStage}-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString('id-ID'),
      };
      setProtocols(prev => ({
        ...prev,
        [activeStage]: [...prev[activeStage], newItem]
      }));
    }

    setIsAddModalOpen(false);
    setEditingId(null);
    setNewProtocol({ title: '', procedure: '', acceptanceCriteria: '', tester: '', status: 'PENDING' });
  };

  const getStatusStyle = (status: ProtocolItem['status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 border-emerald-200';
      case 'IN_PROGRESS': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 border-teal-200';
      case 'FAILED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 border-rose-200';
      default: return 'bg-slate-100 text-slate-500 dark:bg-slate-800 border-slate-200';
    }
  };

  const renderStatusBadge = (status: ProtocolItem['status']) => {
    const style = getStatusStyle(status);
    let Icon = Clock;
    let iconClass = "";

    if (status === 'COMPLETED') {
      Icon = Check;
    } else if (status === 'FAILED') {
      Icon = AlertCircle;
    } else if (status === 'IN_PROGRESS') {
      Icon = Loader2;
      iconClass = "animate-spin";
    }

    return (
      <div 
        key={status}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm animate-in fade-in zoom-in-95 duration-300 ${style}`}
      >
        <Icon size={12} className={iconClass} strokeWidth={3} />
        {status.replace('_', ' ')}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-teal-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Kualifikasi Validasi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 tracking-widest">GMP Compliance Facility Management</p>
           </div>
        </div>
        <button 
          onClick={() => { setEditingId(null); setIsAddModalOpen(true); }}
          className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-teal-700 transition-all flex items-center gap-2"
        >
           <Plus size={18} /> Protocol Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="space-y-3">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id as any)}
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-start gap-4 ${
                  activeStage === stage.id 
                    ? 'bg-white dark:bg-slate-800 border-teal-600 shadow-xl scale-[1.02]' 
                    : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400 opacity-80 hover:bg-white'
                }`}
              >
                 <div className={`p-3 rounded-xl border ${activeStage === stage.id ? 'bg-teal-100 text-teal-600 border-teal-200' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                    <stage.icon size={20} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-widest leading-none">{stage.id} Stage</h4>
                    <p className="text-[10px] font-bold mt-1.5 leading-tight">{stage.label}</p>
                 </div>
              </button>
            ))}
         </div>

         <div className="lg:col-span-3 rounded-[2.5rem] bg-white dark:bg-slate-800 p-10 flex flex-col min-h-[500px] border border-slate-200 dark:border-slate-700 shadow-md">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200 dark:border-slate-700">
               <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">{activeStage} Protocol Status</h3>
               <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase border border-emerald-100">
                AREA: ASEPTIC FILLING 02
               </span>
            </div>

            <div className="flex-1 space-y-4">
               {protocols[activeStage]?.length > 0 ? (
                 protocols[activeStage].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedProtocol(item)}
                    className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 group hover:border-teal-500 transition-all cursor-pointer"
                  >
                     <div className="flex items-center gap-4">
                        <div 
                          key={item.status}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all animate-in fade-in zoom-in-90 duration-300 ${getStatusStyle(item.status)}`}
                        >
                           {item.status === 'COMPLETED' ? <Check size={20} strokeWidth={3} /> : 
                            item.status === 'FAILED' ? <AlertCircle size={20} /> :
                            item.status === 'IN_PROGRESS' ? <Loader2 size={20} className="animate-spin" /> : <Clock size={20} />}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">{item.title}</p>
                           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-2">ID: {item.id} • Dibuat: {item.date}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        {renderStatusBadge(item.status)}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={(e) => handleOpenEdit(e, item)}
                            className="p-2 bg-white dark:bg-slate-700 text-slate-500 hover:text-teal-600 rounded-lg border border-slate-200 dark:border-slate-600"
                           >
                             <Edit2 size={14} />
                           </button>
                           <button 
                            onClick={(e) => handleDeleteProtocol(e, item.id)}
                            className="p-2 bg-white dark:bg-slate-700 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-200 dark:border-slate-600"
                           >
                             <Trash2 size={14} />
                           </button>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600" />
                     </div>
                  </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <ClipboardList size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">Belum ada dokumen protocol</p>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* CRUD Modal (Add/Edit) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-12 fade-in duration-500 ease-out border border-slate-300 dark:border-slate-700">
            <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl border border-teal-200 shadow-sm">
                  <Beaker size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">
                    {editingId ? 'Edit Protocol' : 'Rancang Protocol'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-2 tracking-widest">Fase Kualifikasi: {activeStage}</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-white dark:bg-slate-700 rounded-2xl text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-600 shadow-sm transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveProtocol} className="p-10 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nama Protocol Kerja *</label>
                <input 
                  required type="text" 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-sm text-slate-800 dark:text-white focus:border-teal-500 transition-all"
                  value={newProtocol.title}
                  onChange={(e) => setNewProtocol({...newProtocol, title: e.target.value})}
                  placeholder="Contoh: Validasi Integritas Filter HEPA"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Analis / Penguji *</label>
                  <input 
                    required type="text" 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-sm dark:text-white focus:border-teal-500"
                    value={newProtocol.tester}
                    onChange={(e) => setNewProtocol({...newProtocol, tester: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Status GXP</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-sm dark:text-white focus:border-teal-500"
                    value={newProtocol.status}
                    onChange={(e) => setNewProtocol({...newProtocol, status: e.target.value as any})}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Prosedur Pengujian Klinis *</label>
                <textarea 
                  required rows={3}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-medium text-sm dark:text-white resize-none focus:border-teal-500"
                  value={newProtocol.procedure}
                  onChange={(e) => setNewProtocol({...newProtocol, procedure: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-all">Batalkan</button>
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-all">
                  <Save size={16} /> {editingId ? 'Simpan Data' : 'Terbitkan Protocol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Protocol Detail Modal */}
      {selectedProtocol && !isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedProtocol(null)}></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 border border-slate-300 dark:border-slate-700">
             <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                   <div 
                    key={selectedProtocol.status}
                    className={`p-3 rounded-2xl border shadow-md animate-in fade-in zoom-in-95 duration-300 ${getStatusStyle(selectedProtocol.status)}`}
                   >
                      {selectedProtocol.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : 
                       selectedProtocol.status === 'FAILED' ? <AlertCircle size={24} /> :
                       selectedProtocol.status === 'IN_PROGRESS' ? <Loader2 size={24} className="animate-spin" /> : <Activity size={24} />}
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase leading-none">{selectedProtocol.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">ID: {selectedProtocol.id}</p>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        {renderStatusBadge(selectedProtocol.status)}
                      </div>
                   </div>
                </div>
                <button onClick={() => setSelectedProtocol(null)} className="p-3 text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
             </div>

             <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Langkah Pengujian Klinis</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{selectedProtocol.procedure}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Kriteria Keberterimaan</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{selectedProtocol.acceptanceCriteria}</p>
                   </div>
                </div>
                <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                   <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-inner">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-teal-500/20">{selectedProtocol.tester.charAt(0)}</div>
                         <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none">{selectedProtocol.tester}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Authorized Analyst</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Timestamp Verifikasi</p>
                         <p className="text-xs font-black text-slate-800 dark:text-white mt-1">{selectedProtocol.date}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex gap-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => setSelectedProtocol(null)} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-all">Tutup Dokumen</button>
                <button 
                  onClick={(e) => { setSelectedProtocol(null); handleOpenEdit(e, selectedProtocol); }}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-all"
                >
                  <Edit size={16} /> Edit Data
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualificationModule;
