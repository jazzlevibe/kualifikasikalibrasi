
import React, { useState } from 'react';
import { 
  User, 
  History, 
  Download, 
  Plus, 
  X, 
  Save, 
  AlertCircle, 
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  isManual?: boolean;
}

const INITIAL_LOGS: AuditEntry[] = [
  { id: '1', timestamp: '20-03-2024 09:15:00', user: 'Juan', action: 'BUAT_REKAMAN', details: 'Menambahkan rekaman kalibrasi untuk TEMP-01' },
  { id: '2', timestamp: '20-03-2024 10:30:22', user: 'Samsul', action: 'SETUJUI_KERJA', details: 'Menyetujui pekerjaan kalibrasi #CAL-104' },
  { id: '3', timestamp: '20-03-2024 14:12:05', user: 'Naila', action: 'UPDATE_ALAT', details: 'Mengubah status PRES-05 menjadi OPERASIONAL' },
  { id: '4', timestamp: '19-03-2024 16:45:00', user: 'Ade', action: 'JADWAL_KALIBRASI', details: 'Menetapkan jadwal re-kalibrasi untuk VLV-02' },
];

const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditEntry[]>(INITIAL_LOGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    action: 'CATATAN_MANUAL',
    details: '',
    user: 'System Admin' // This would typically come from current user context
  });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: AuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString('id-ID'),
      user: formData.user,
      action: formData.action,
      details: formData.details,
      isManual: true
    };
    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    setFormData({ ...formData, details: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Jejak Audit Sistem</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Rekaman Aktivitas Kepatuhan (Compliance Log)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 border border-transparent"
          >
            <Plus size={18} /> Tambah Log Manual
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm">
            <Download size={18} /> Ekspor (CSV)
          </button>
        </div>
      </div>

      {/* Log List */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
          {logs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 flex flex-col md:flex-row md:items-center gap-6 transition-all group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors border ${
                log.isManual ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
              }`}>
                {log.isManual ? <ClipboardList size={22} /> : <History size={22} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs font-black uppercase tracking-wider ${log.isManual ? 'text-amber-700' : 'text-slate-900 dark:text-white'}`}>
                    {log.action}
                  </span>
                  {log.isManual && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[8px] font-black uppercase tracking-tighter border border-amber-200">
                      Anotasi Manual
                    </span>
                  )}
                  <span className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md font-bold uppercase border border-slate-200 dark:border-slate-800">ID: {log.id}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{log.details}</p>
              </div>

              <div className="flex items-center gap-6 text-[10px] font-black shrink-0 md:border-l md:pl-6 border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-slate-500 uppercase tracking-widest">Dilakukan Oleh</span>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <User size={14} className="text-slate-500" />
                    <span className="font-black">{log.user}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="text-slate-500 uppercase tracking-widest text-right w-full">Timestamp</span>
                   <span className="text-slate-600 font-bold">{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          
          {logs.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <History size={64} className="mx-auto text-slate-200" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada rekaman audit</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 border border-slate-300 dark:border-white/10">
            <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl border border-amber-200 shadow-sm">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Tambah Log Manual</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Anotasi Kejadian Khusus / Perbaikan</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white dark:bg-slate-700 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Jenis Aktivitas</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-sm text-slate-800 dark:text-white focus:border-indigo-500"
                  value={formData.action}
                  onChange={(e) => setFormData({...formData, action: e.target.value})}
                >
                  <option value="CATATAN_MANUAL">Catatan Manual</option>
                  <option value="PERBAIKAN_DATA">Perbaikan Data</option>
                  <option value="INVESTIGASI_QA">Investigasi QA</option>
                  <option value="MAINTENANCE_DARURAT">Maintenance Darurat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Detail Keterangan Audit</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Jelaskan secara detail kejadian atau perubahan yang dilakukan..."
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-medium text-sm text-slate-700 dark:text-white resize-none focus:border-indigo-500"
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-3 shadow-sm">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 leading-relaxed uppercase tracking-tight">
                  Log manual ini akan disimpan permanen dengan label "Anotasi Manual" untuk keperluan audit GMP/ISO. Data tidak dapat dihapus setelah disimpan.
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batalkan
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 border border-transparent"
                >
                  <Save size={16} /> Simpan Log Permanen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTrail;
