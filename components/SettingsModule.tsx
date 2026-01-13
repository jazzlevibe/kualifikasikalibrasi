
import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  Database, 
  Lock, 
  Globe, 
  Save, 
  Info, 
  AlertTriangle,
  FileCheck,
  Smartphone,
  Server,
  CloudUpload,
  Check,
  // Fix: Added missing Sliders import
  Sliders
} from 'lucide-react';

const SettingsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'COMPLIANCE' | 'NOTIFS' | 'SECURITY'>('GENERAL');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'GENERAL', label: 'Profil Institusi', icon: Building2 },
    { id: 'COMPLIANCE', label: 'Standar GXP', icon: ShieldCheck },
    { id: 'NOTIFS', label: 'Notifikasi', icon: Bell },
    { id: 'SECURITY', label: 'Keamanan & Data', icon: Database },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-teal-600 text-white rounded-2xl shadow-lg">
            <Sliders className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Pengaturan Sistem</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Konfigurasi Pusat Kepatuhan QA</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : showSuccess ? (
            <Check size={18} strokeWidth={3} />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? 'Menyimpan...' : showSuccess ? 'Tersimpan' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all border-2 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 border-teal-600 text-teal-600 shadow-xl scale-[1.02]' 
                  : 'bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-teal-600' : 'text-slate-400'} />
              <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-md p-10 min-h-[500px]">
          
          {activeTab === 'GENERAL' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identitas Institusi</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">Data ini akan muncul di header sertifikat dan dokumen resmi.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Laboratorium / Instansi</label>
                  <input type="text" defaultValue="Laboratorium QA Pharma Central" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-bold text-sm text-slate-800 dark:text-white focus:border-teal-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Registrasi KAN/ISO</label>
                  <input type="text" defaultValue="ISO-17025-2024-QC" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-bold text-sm text-slate-800 dark:text-white focus:border-teal-500" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Operasional Utama</label>
                  <textarea rows={3} defaultValue="Kawasan Industri Jababeka, Jl. Pharma Jaya No. 12, Bekasi, Indonesia" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none font-medium text-sm text-slate-800 dark:text-white focus:border-teal-500 resize-none" />
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Globe className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">Situs Web Sertifikasi</p>
                    <p className="text-[10px] text-slate-400 font-bold">https://qa.pharma-central.id</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Ubah Link</button>
              </div>
            </div>
          )}

          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Standar Operasional GXP</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">Konfigurasi nilai default untuk kepatuhan industri farmasi.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Interval Kalibrasi Default</p>
                    <p className="text-xs text-slate-400 font-medium">Periode standar antara dua pengujian alat.</p>
                  </div>
                  <select className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase outline-none">
                    <option>6 Bulan</option>
                    <option>12 Bulan</option>
                    <option>24 Bulan</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Toleransi Batas QA (±)</p>
                    <p className="text-xs text-slate-400 font-medium">Batas deviasi yang diperbolehkan sebelum status OOS.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="text" defaultValue="0.5" className="w-16 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-xs font-black outline-none" />
                    <span className="text-[10px] font-black text-slate-400 uppercase uppercase">% UNIT</span>
                  </div>
                </div>

                <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-4">
                  <AlertTriangle className="text-rose-500 mt-1 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-black text-rose-800 dark:text-rose-400 uppercase tracking-tight">Protokol Out-Of-Specification (OOS)</p>
                    <p className="text-xs text-rose-600/70 dark:text-rose-400/60 font-medium mt-1 leading-relaxed">
                      Perubahan pada standar kepatuhan ini akan dicatat dalam Log Audit secara otomatis sesuai pedoman 21 CFR Part 11.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NOTIFS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pusat Lansiran & Notifikasi</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">Atur kapan dan bagaimana tim Anda mendapatkan peringatan.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Lansiran Jatuh Tempo', desc: 'Ingatkan 30 hari sebelum masa kalibrasi habis.', icon: Bell, checked: true },
                  { label: 'E-mail Sertifikat Otomatis', desc: 'Kirim PDF ke manager departemen setelah divalidasi.', icon: FileCheck, checked: true },
                  { label: 'Notifikasi Aplikasi Mobile', desc: 'Push notifikasi untuk teknisi saat ada Work Order baru.', icon: Smartphone, checked: false },
                  { label: 'Laporan Mingguan GMP', desc: 'Ringkasan kepatuhan mingguan ke QA Admin.', icon: Server, checked: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${n.checked ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                        <n.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{n.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{n.desc}</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${n.checked ? 'bg-teal-600' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${n.checked ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Keamanan Data & Backup</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium">Pastikan integritas dan ketersediaan data audit Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <CloudUpload size={80} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-teal-400 mb-2">Cloud Backup</h4>
                  <p className="text-2xl font-black mb-4">98.2 GB</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mb-6">
                    <div className="bg-teal-500 h-full w-3/4 rounded-full"></div>
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Pencadangan Sekarang</button>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Retensi Log Audit</h4>
                    <p className="text-sm font-black text-slate-800 dark:text-white mb-2 leading-tight uppercase">Simpan data selama 5 Tahun</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase leading-relaxed">Wajib sesuai standar industri farmasi lokal.</p>
                  </div>
                  <button className="mt-6 flex items-center justify-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                    Lihat Kebijakan Data <Lock size={12} />
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-800 flex items-center gap-4">
                 <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-amber-600 shadow-sm">
                   <Lock size={20} />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Otentikasi Dua Faktor (2FA)</p>
                   <p className="text-[10px] text-slate-400 font-medium mt-1">Gunakan kode verifikasi untuk setiap persetujuan sertifikat.</p>
                 </div>
                 <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-md transition-all">Aktifkan</button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
