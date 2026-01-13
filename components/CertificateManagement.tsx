
import React, { useState, useMemo } from 'react';
import { 
  Search, FileCheck, Download, X, Printer, QrCode, 
  ShieldCheck, ChevronRight, Award, Filter, 
  Thermometer, Scale, Gauge, Zap, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Instrument } from '../types';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

interface CertificateManagementProps {
  instruments: Instrument[];
}

const CertificateManagement: React.FC<CertificateManagementProps> = ({ instruments }) => {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeParameter, setActiveParameter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState<Instrument | null>(null);

  const filteredCertificates = useMemo(() => {
    return instruments.filter(inst => {
      const matchesMonth = new Date(inst.lastCalibration).getMonth() === activeMonth;
      const matchesParameter = activeParameter === 'ALL' || inst.parameter === activeParameter;
      const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            inst.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMonth && matchesParameter && matchesSearch;
    });
  }, [instruments, activeMonth, activeParameter, searchTerm]);

  const stats = useMemo(() => {
    const monthCerts = instruments.filter(i => new Date(i.lastCalibration).getMonth() === activeMonth);
    return {
      total: monthCerts.length,
      passed: monthCerts.filter(i => i.status !== 'OUT_OF_SERVICE').length,
      pending: Math.floor(monthCerts.length * 0.1) // Mock pending approval
    };
  }, [instruments, activeMonth]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex items-center gap-6 shadow-sm">
           <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <FileCheck size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Arsip Sertifikat</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Repository Kepatuhan Digital QA</p>
           </div>
        </div>
        
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800/50 flex flex-col justify-center">
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Terbit Bulan Ini</span>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{stats.total}</span>
              <span className="text-xs font-bold text-emerald-600/60 pb-1">Dokumen</span>
           </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2.5rem] border border-amber-100 dark:border-amber-800/50 flex flex-col justify-center">
           <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Menunggu Review</span>
           <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-amber-700 dark:text-amber-400">{stats.pending}</span>
              <span className="text-xs font-bold text-amber-600/60 pb-1">Antrean</span>
           </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col xl:flex-row items-center gap-4">
        <div className="flex overflow-x-auto gap-2 p-1 custom-scrollbar no-scrollbar w-full xl:w-auto">
          {MONTHS.map((month, idx) => (
            <button
              key={month}
              onClick={() => setActiveMonth(idx)}
              className={`whitespace-nowrap py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeMonth === idx 
                  ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-xl' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {month.substring(0, 3)}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-slate-100 dark:bg-slate-700 hidden xl:block"></div>

        <div className="flex gap-2 w-full xl:w-auto">
          {[
            { id: 'ALL', label: 'Semua', icon: Filter },
            { id: 'Suhu', label: 'Suhu', icon: Thermometer },
            { id: 'Massa', label: 'Massa', icon: Scale },
            { id: 'Tekanan', label: 'Tekan', icon: Gauge },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setActiveParameter(p.id)}
              className={`flex-1 xl:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                activeParameter === p.id 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                  : 'border-transparent text-slate-400 hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              <p.icon size={14} />
              <span className="hidden md:inline">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full xl:w-64 xl:ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="ID Sertifikat / Alat..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-xs dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCertificates.map((cert) => (
          <div
            key={cert.id}
            className="group bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:border-emerald-400 transition-all relative overflow-hidden flex flex-col"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-all rotate-12 group-hover:rotate-0 group-hover:scale-110">
              <QrCode size={120} />
            </div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${
                cert.parameter === 'Suhu' ? 'bg-blue-50 text-blue-600' : 
                cert.parameter === 'Massa' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
              }`}>
                {cert.parameter === 'Suhu' ? <Thermometer size={24} /> : 
                 cert.parameter === 'Massa' ? <Scale size={24} /> : <Zap size={24} />}
              </div>
              <div className="flex flex-col items-end">
                 <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">VALID</span>
                 <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">QA APPROVED</span>
              </div>
            </div>

            <div className="space-y-1 mb-6 relative z-10">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">#{cert.code}</h4>
              <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">{cert.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold">{cert.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 dark:border-slate-700 mb-6 relative z-10">
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Tgl Kalibrasi</p>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{cert.lastCalibration}</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Sertifikat No</p>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">CAL-{cert.id.split('-').pop()}</p>
               </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 mt-auto">
               <button 
                onClick={() => setSelectedCert(cert)}
                className="flex-1 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
               >
                 <FileText size={14} /> Lihat Detail
               </button>
               <button className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-emerald-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700">
                 <Download size={14} />
               </button>
            </div>
          </div>
        ))}

        {filteredCertificates.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                <FileCheck size={48} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Arsip Tidak Ditemukan</h3>
                <p className="text-slate-400 font-medium">Belum ada sertifikat terbit untuk filter dan bulan ini.</p>
             </div>
             <button 
              onClick={() => { setActiveParameter('ALL'); setSearchTerm(''); }}
              className="px-8 py-3 bg-primary-50 text-primary-600 rounded-xl font-black text-xs uppercase tracking-widest"
             >
              Reset Filter
             </button>
          </div>
        )}
      </div>

      {/* Enhanced Certificate Viewer */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedCert(null)}></div>
          
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[95vh] rounded-[3rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Award size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">E-Certificate Viewer</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Document Integrity Verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  <Printer size={18} /> Cetak Salinan
                </button>
                <button className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 transition-all">
                  <Download size={20} /> Unduh PDF
                </button>
                <button onClick={() => setSelectedCert(null)} className="p-4 text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-slate-100 dark:bg-slate-950/50 custom-scrollbar">
              <div className="bg-white w-full max-w-[850px] mx-auto shadow-2xl p-16 border-[16px] border-double border-slate-50 relative overflow-hidden">
                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none rotate-[-45deg] select-none">
                   <h1 className="text-[120px] font-black tracking-tighter">VERIFIED</h1>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-16">
                     <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-3xl font-black">QA</div>
                     <div className="text-right">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">CERTIFICATE</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">OF CALIBRATION</p>
                        <div className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100 inline-block">
                           VALID UNTIL: {new Date(new Date(selectedCert.nextCalibration).getTime()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-16">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Informasi Instrumen</h4>
                        <div className="space-y-4">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Nama Alat Ukur</p>
                              <p className="text-base font-black text-slate-800">{selectedCert.name}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">ID / Tag Number</p>
                                 <p className="text-sm font-black text-slate-800">{selectedCert.code}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">Parameter</p>
                                 <p className="text-sm font-black text-emerald-600">{selectedCert.parameter}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Metadata Dokumen</h4>
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">Tgl Kalibrasi</p>
                                 <p className="text-sm font-black text-slate-800">{selectedCert.lastCalibration}</p>
                              </div>
                              <div>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">Lokasi Pengujian</p>
                                 <p className="text-sm font-black text-slate-800">{selectedCert.location}</p>
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Standard Acuan</p>
                              <p className="text-sm font-black text-slate-800">ISO/IEC 17025 Compliant Standard</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mb-16">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Ringkasan Hasil Teknis
                     </h4>
                     <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs">
                           <thead className="bg-slate-50">
                              <tr>
                                 <th className="px-6 py-4 font-black text-slate-400 uppercase">Test Point</th>
                                 <th className="px-6 py-4 font-black text-slate-400 uppercase">Instrument Reading</th>
                                 <th className="px-6 py-4 font-black text-slate-400 uppercase">Reference Standar</th>
                                 <th className="px-6 py-4 font-black text-slate-400 uppercase text-center">Deviation</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                              {[1, 2, 3].map(i => (
                                 <tr key={i}>
                                    <td className="px-6 py-4">Point {i}</td>
                                    <td className="px-6 py-4">{(i * 10).toFixed(2)}</td>
                                    <td className="px-6 py-4">{(i * 10.01).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center text-emerald-600">0.01</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2rem] border-l-8 border-emerald-500 mb-16 relative">
                     <AlertCircle className="absolute top-4 right-4 text-emerald-200" size={40} />
                     <p className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-2">Pernyataan Kesesuaian:</p>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                        Instrumen ini telah diuji dan dikalibrasi sesuai dengan prosedur standar operasional QA-SK-01. Hasil menunjukkan instrumen berada dalam batas toleransi <b>{selectedCert.tolerance}</b> dan dinyatakan <b>LAIK UNTUK DIGUNAKAN</b> pada proses produksi/laboratorium.
                     </p>
                  </div>

                  <div className="flex justify-between items-end border-t-2 border-slate-100 pt-12">
                     <div className="flex flex-col items-center">
                        <QrCode size={100} className="text-slate-800 mb-2" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verifikasi Digital</span>
                     </div>
                     <div className="text-center">
                        <div className="w-56 h-px bg-slate-900 mb-4 mx-auto"></div>
                        <p className="text-sm font-black text-slate-900 uppercase">SAMSUL</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quality Assurance Manager</p>
                        <p className="text-[9px] text-emerald-600 font-bold mt-2">Verified E-Signature: {selectedCert.lastCalibration}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;
