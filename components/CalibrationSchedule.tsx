
import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, 
  CalendarDays, 
  PlayCircle, 
  FileDown, 
  Loader2, 
  ListPlus, 
  X, 
  CheckCircle2, 
  // Added Check to fix line 479 error
  Check,
  ArrowRight,
  FileUp,
  TableProperties,
  Info,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  MapPin,
  Building2,
  Settings2,
  ShieldCheck,
  Calendar as CalendarIcon,
  ChevronLeft
} from 'lucide-react';
import { Instrument, CalibrationType } from '../types';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Menghasilkan rentang tahun untuk riwayat dan masa depan (2020 - 2030)
const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

interface CalibrationScheduleProps {
  instruments: Instrument[];
  setInstruments: React.Dispatch<React.SetStateAction<Instrument[]>>;
  triggerToast: (msg: string) => void;
  onSelectForCalibration: (instId: string) => void;
}

interface ImportPreview {
  code: string;
  name: string;
  date: string;
  isValid: boolean;
  error?: string;
}

const CalibrationSchedule: React.FC<CalibrationScheduleProps> = ({ 
  instruments, 
  setInstruments, 
  triggerToast,
  onSelectForCalibration 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  // Bulk Scheduling States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkSearch, setBulkSearch] = useState('');

  // Import States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [importPreview, setImportPreview] = useState<ImportPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter data berdasarkan Bulan DAN Tahun
  const filteredData = useMemo(() => {
    return instruments.filter(inst => {
      const nextDate = new Date(inst.nextCalibration);
      const matchesMonth = nextDate.getMonth() === activeMonth;
      const matchesYear = nextDate.getFullYear() === activeYear;
      const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inst.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMonth && matchesYear && matchesSearch;
    });
  }, [instruments, activeMonth, activeYear, searchTerm]);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 800);
  };

  const toggleBulkSelection = (id: string) => {
    setSelectedForBulk(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkSubmit = () => {
    if (selectedForBulk.length === 0) return;
    setInstruments(prev => prev.map(inst => {
      if (selectedForBulk.includes(inst.id)) {
        return { ...inst, nextCalibration: bulkDate };
      }
      return inst;
    }));
    triggerToast(`${selectedForBulk.length} Jadwal alat berhasil diperbarui secara massal!`);
    setIsBulkModalOpen(false);
    setSelectedForBulk([]);
    setBulkStep(1);
    
    const newDate = new Date(bulkDate);
    setActiveMonth(newDate.getMonth());
    setActiveYear(newDate.getFullYear());
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSVData(text);
    };
    reader.readAsText(file);
  };

  const parseCSVData = (text: string) => {
    const lines = text.split('\n');
    const preview: ImportPreview[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const [code, date] = lines[i].split(',').map(s => s.trim());
      const instrument = instruments.find(inst => inst.code === code);
      if (instrument) {
        preview.push({ code, name: instrument.name, date: date || '2024-01-01', isValid: true });
      } else {
        preview.push({ code, name: 'Alat Tidak Ditemukan', date: date || '2024-01-01', isValid: false, error: 'Kode alat tidak terdaftar' });
      }
    }
    setImportPreview(preview);
    setImportStep(2);
  };

  const handleImportSubmit = () => {
    const validImports = importPreview.filter(p => p.isValid);
    if (validImports.length === 0) return;
    setInstruments(prev => prev.map(inst => {
      const match = validImports.find(v => v.code === inst.code);
      if (match) return { ...inst, nextCalibration: match.date };
      return inst;
    }));
    triggerToast(`${validImports.length} Jadwal berhasil diimport!`);
    setIsImportModalOpen(false);
    setImportStep(1);
    setImportPreview([]);
  };

  const downloadTemplate = () => {
    const content = "Kode_Alat,Tanggal_Next_Kalibrasi\nTEMP-01,2024-12-25\nPRES-05,2024-11-20";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_jadwal_qa.csv';
    a.click();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 no-print">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-teal-600 text-white rounded-[2rem] shadow-xl shadow-teal-500/20">
            <CalendarDays size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">Timeline Kalibrasi</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Audit-Ready Compliance Schedule</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Year Picker Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10"
            >
              <CalendarIcon size={18} className="text-teal-400" />
              Tahun {activeYear}
              <ChevronDown size={16} className={`transition-transform duration-300 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isYearDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-40 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-50 p-2 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {YEARS.map(year => (
                    <button
                      key={year}
                      onClick={() => { setActiveYear(year); setIsYearDropdownOpen(false); }}
                      className={`w-full text-left p-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeYear === year 
                          ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30' 
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-black text-[10px] uppercase tracking-widest">
            <FileUp size={18} /> Import Data
          </button>
          <button onClick={() => setIsBulkModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-500/20 font-black text-[10px] uppercase tracking-widest">
            <ListPlus size={18} /> Bulk Update
          </button>
          <button onClick={handleExportPDF} disabled={isExporting || filteredData.length === 0} className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 font-black text-[10px] uppercase tracking-widest disabled:opacity-50">
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />} Print PDF
          </button>
        </div>
      </div>

      {/* Modern Month Selector */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm no-print overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {MONTHS.map((month, idx) => (
            <button
              key={month}
              onClick={() => setActiveMonth(idx)}
              className={`py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeMonth === idx 
                  ? 'bg-teal-600 text-white shadow-xl scale-105 z-10' 
                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 no-print">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
              <div>
                <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">Pekerjaan {MONTHS[activeMonth]} {activeYear}</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Filter aktif: {filteredData.length} UNIT ditemukan</p>
              </div>
           </div>
           <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari ID atau nama alat..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none dark:text-white focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredData.map((item) => (
            <div 
              key={item.id} 
              className={`group bg-white dark:bg-slate-800 rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${
                expandedId === item.id 
                ? 'border-teal-500 shadow-2xl scale-[1.01]' 
                : 'border-slate-100 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-800 shadow-sm'
              }`}
            >
              <div 
                className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    expandedId === item.id ? 'bg-teal-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                  }`}>
                    <Settings2 size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{item.code}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.parameter}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{item.name}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="hidden lg:flex items-center gap-10">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lokasi</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <MapPin size={12} className="text-teal-600" /> {item.location}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dept</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Building2 size={12} className="text-teal-600" /> {item.department}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectForCalibration(item.id); }}
                      className="px-6 py-3.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 flex items-center gap-2"
                    >
                      <PlayCircle size={16} /> Mulai Kerja
                    </button>
                    <div className="p-3 text-slate-300 group-hover:text-teal-500 transition-colors">
                      {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial Number</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{item.serialNumber || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasitas</p>
                      <p className="text-sm font-black text-slate-800 dark:text-white">{item.capacity || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipe Kalibrasi</p>
                      <div className="flex items-center gap-2 text-sm font-black text-teal-600">
                        <ShieldCheck size={16} /> {item.calibrationType}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toleransi QA</p>
                      <p className="text-sm font-black text-emerald-600">{item.tolerance || '±0.1'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="py-24 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-200">
                <CalendarDays size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Tidak Ada Jadwal</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                  Bulan {MONTHS[activeMonth]} {activeYear} bersih dari tugas kalibrasi terencana.
                </p>
              </div>
              <button 
                onClick={() => setActiveYear(new Date().getFullYear())}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-50 transition-all"
              >
                <ChevronLeft size={14} /> Kembali ke Tahun Ini
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsImportModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/10">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
               <h3 className="text-xl font-black dark:text-white uppercase tracking-tight leading-none">Import Penjadwalan Massal</h3>
               <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><X className="text-slate-400" /></button>
            </div>
            <div className="p-10 space-y-8">
               {importStep === 1 ? (
                 <div className="text-center space-y-6">
                    <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[3rem] p-16 hover:border-teal-500 cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/50 group">
                       <FileUp size={64} className="mx-auto text-teal-600 mb-6 group-hover:scale-110 transition-transform" />
                       <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Klik untuk Pilih File CSV</p>
                       <p className="text-[10px] text-slate-400 mt-3 tracking-widest uppercase font-black leading-relaxed">Wajib Format: <br/><span className="text-teal-500 font-bold">Kode_Alat, Tanggal_Next_Kalibrasi (YYYY-MM-DD)</span></p>
                       <p className="text-[10px] text-slate-400 mt-3 tracking-widest uppercase font-black leading-relaxed">Wajib Format: <br/><span className="text-teal-500 font-bold">Kode_Alat, Tanggal_Next_Kalibrasi (YYYY-MM-DD)</span></p>
                       <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                    </div>
                    <button onClick={downloadTemplate} className="text-[10px] font-black text-teal-600 hover:underline uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto">
                       <FileText size={14} /> Unduh Template CSV
                    </button>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar border border-slate-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-inner">
                       <table className="w-full text-[10px]">
                          <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0">
                             <tr className="text-left font-black text-slate-400 uppercase tracking-widest">
                                <th className="p-4">Kode Alat</th>
                                <th className="p-4">Status Validasi</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                             {importPreview.map((p, i) => (
                               <tr key={i} className={p.isValid ? "bg-white dark:bg-slate-800" : "bg-rose-50 dark:bg-rose-900/10"}>
                                  <td className="p-4 font-black uppercase tracking-tight text-slate-800 dark:text-slate-200">{p.code}</td>
                                  <td className={`p-4 font-black uppercase tracking-widest text-[9px] ${p.isValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                                     {p.isValid ? '✓ Berhasil' : `✕ ${p.error}`}
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setImportStep(1)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Ulangi</button>
                       <button onClick={handleImportSubmit} className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-teal-500/30 hover:bg-teal-700 transition-all">Proses Import Data</button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsBulkModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/10">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
               <h3 className="text-xl font-black dark:text-white uppercase tracking-tight leading-none">Bulk Schedule Wizard</h3>
               <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><X className="text-slate-400" /></button>
            </div>
            <div className="p-10 space-y-8">
               {bulkStep === 1 && (
                 <div className="space-y-6">
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         type="text" 
                         placeholder="Cari alat untuk dijadwalkan..."
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold outline-none border border-slate-100 dark:border-slate-700 dark:text-white focus:border-teal-500 transition-all"
                         value={bulkSearch}
                         onChange={(e) => setBulkSearch(e.target.value)}
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar p-2">
                       {instruments.filter(inst => 
                         inst.name.toLowerCase().includes(bulkSearch.toLowerCase()) || 
                         inst.code.toLowerCase().includes(bulkSearch.toLowerCase())
                       ).map(inst => (
                         <button 
                           key={inst.id}
                           onClick={() => toggleBulkSelection(inst.id)}
                           className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                             selectedForBulk.includes(inst.id) 
                               ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-900/20 shadow-md shadow-teal-500/5' 
                               : 'border-slate-100 dark:border-slate-800 hover:border-teal-200'
                           }`}
                         >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              selectedForBulk.includes(inst.id) ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                            }`}>
                               {selectedForBulk.includes(inst.id) && <Check size={14} strokeWidth={4} />}
                            </div>
                            <div className="min-w-0">
                               <p className={`text-[10px] font-black uppercase tracking-tight ${selectedForBulk.includes(inst.id) ? 'text-teal-700 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>{inst.code}</p>
                               <p className="text-[9px] font-bold text-slate-400 truncate uppercase tracking-widest mt-1">{inst.name}</p>
                            </div>
                         </button>
                       ))}
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedForBulk.length} Alat Terpilih</span>
                       <button onClick={() => setBulkStep(2)} disabled={selectedForBulk.length === 0} className="px-10 py-4 bg-teal-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50 hover:bg-teal-700 transition-all">Lanjutkan</button>
                    </div>
                 </div>
               )}
               {bulkStep === 2 && (
                 <div className="space-y-10 text-center animate-in zoom-in-95">
                    <div className="space-y-3">
                       <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                          <CalendarIcon size={36} />
                       </div>
                       <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedForBulk.length} Alat Akan Diupdate</h4>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pilih Tanggal Kalibrasi Terencana Berikutnya</p>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <input 
                        type="date" 
                        className="w-full p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-4 border-teal-600 font-black text-3xl text-center outline-none focus:shadow-2xl transition-all dark:text-white" 
                        value={bulkDate} 
                        onChange={(e) => setBulkDate(e.target.value)} 
                      />
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setBulkStep(1)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Kembali</button>
                       <button onClick={handleBulkSubmit} className="flex-[2] py-5 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-teal-500/30 hover:bg-teal-700 transition-all">Konfirmasi & Simpan Jadwal</button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalibrationSchedule;
