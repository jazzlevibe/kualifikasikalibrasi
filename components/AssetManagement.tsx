
import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, Plus, X, Edit2, Trash2, ChevronDown, ChevronUp, 
  Fingerprint, Box, Zap, Info, Layers, FileUp, Download, AlertCircle, CheckCircle2,
  Filter, Check, HelpCircle, Calendar, Trash, ShieldAlert, History, User, Activity
} from 'lucide-react';
import { Instrument, AssetStatus, CalibrationType, CalibrationRecord, JobStatus } from '../types';

interface AssetManagementProps {
  instruments: Instrument[];
  setInstruments: React.Dispatch<React.SetStateAction<Instrument[]>>;
  triggerToast: (msg: string) => void;
  onDeleteAsset: (id: string) => void;
}

const DEFAULT_STATE = {
  code: '',
  name: '',
  location: '',
  department: '',
  specs: '',
  status: AssetStatus.OPERATIONAL,
  lastCalibration: new Date().toISOString().split('T')[0],
  nextCalibration: '',
  parameter: 'Suhu',
  brand: '',
  serialNumber: '',
  capacity: '',
  tolerance: '±0.5',
  calibrationType: CalibrationType.INTERNAL
};

// Mock function to simulate fetching last 3 calibration records
const getMockHistory = (instId: string): CalibrationRecord[] => {
  return [
    {
      id: `CAL-${instId}-03`,
      instrumentId: instId,
      date: '2023-10-15',
      engineerId: 'Juan',
      asFound: 10.2,
      asLeft: 10.0,
      deviation: 0.2,
      result: 'PASS',
      status: JobStatus.COMPLETED,
      notes: 'Kondisi alat stabil.'
    },
    {
      id: `CAL-${instId}-02`,
      instrumentId: instId,
      date: '2023-04-10',
      engineerId: 'Naila',
      asFound: 10.5,
      asLeft: 10.1,
      deviation: 0.4,
      result: 'PASS',
      status: JobStatus.COMPLETED,
      notes: 'Dilakukan penyetelan offset.'
    },
    {
      id: `CAL-${instId}-01`,
      instrumentId: instId,
      date: '2022-10-05',
      engineerId: 'Ade',
      asFound: 11.2,
      asLeft: 10.2,
      deviation: 1.0,
      result: 'FAIL',
      status: JobStatus.COMPLETED,
      notes: 'Alat di luar toleransi sebelum adjustment.'
    }
  ];
};

const AssetManagement: React.FC<AssetManagementProps> = ({ instruments, setInstruments, triggerToast, onDeleteAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);
  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<Instrument>>(DEFAULT_STATE);

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.OPERATIONAL: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-transparent';
      case AssetStatus.CALIBRATION_DUE: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-transparent';
      case AssetStatus.MAINTENANCE: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-transparent';
      case AssetStatus.OUT_OF_SERVICE: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-transparent';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const translateStatus = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.OPERATIONAL: return 'Operasional';
      case AssetStatus.CALIBRATION_DUE: return 'Jatuh Tempo';
      case AssetStatus.MAINTENANCE: return 'Pemeliharaan';
      case AssetStatus.OUT_OF_SERVICE: return 'Tidak Aktif';
      default: return status;
    }
  }

  const isDirty = useMemo(() => {
    if (editingInstrument) {
      return Object.keys(DEFAULT_STATE).some(key => (formData as any)[key] !== (editingInstrument as any)[key]);
    } else {
      return Object.keys(DEFAULT_STATE).some(key => (formData as any)[key] !== (DEFAULT_STATE as any)[key]);
    }
  }, [formData, editingInstrument]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.code?.trim()) newErrors.code = 'ID / Kode Alat wajib diisi';
    if (!formData.name?.trim()) newErrors.name = 'Nama instrumen wajib diisi';
    if (!formData.location?.trim()) newErrors.location = 'Lokasi wajib diisi';
    if (!formData.department?.trim()) newErrors.department = 'Departemen wajib diisi';

    if (formData.lastCalibration && formData.nextCalibration) {
      const last = new Date(formData.lastCalibration);
      const next = new Date(formData.nextCalibration);
      if (next <= last) newErrors.nextCalibration = 'Jatuh tempo harus setelah tanggal kalibrasi terakhir';
    } else if (!formData.nextCalibration) {
      newErrors.nextCalibration = 'Tanggal jatuh tempo wajib ditentukan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openModal = (inst: Instrument | null = null) => {
    setErrors({});
    if (inst) {
      setEditingInstrument(inst);
      setFormData({ ...inst });
    } else {
      setEditingInstrument(null);
      setFormData(DEFAULT_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setIsCancelConfirmOpen(true);
    } else {
      forceClose();
    }
  };

  const forceClose = () => {
    setIsModalOpen(false);
    setIsCancelConfirmOpen(false);
    setIsConfirmOpen(false);
  };

  const handleSave = () => {
    if (editingInstrument) {
      setInstruments(instruments.map(i => i.id === editingInstrument.id ? { ...i, ...formData } as Instrument : i));
      triggerToast(`Aset ${formData.code} berhasil diperbarui`);
    } else {
      const newInst: Instrument = {
        ...formData,
        id: `INS-${Math.floor(1000 + Math.random() * 9000)}`,
      } as Instrument;
      setInstruments([newInst, ...instruments]);
      triggerToast(`Aset ${formData.code} berhasil didaftarkan`);
    }
    setIsConfirmOpen(false);
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    onDeleteAsset(id);
    setIsDeleteConfirmOpen(null);
  };

  const filteredInstruments = useMemo(() => {
    return instruments.filter(i => {
      const matchesSearch = i.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            i.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [instruments, searchTerm, statusFilter]);

  const InputError = ({ field }: { field: string }) => (
    errors[field] ? (
      <div className="flex items-center gap-1 mt-1.5 text-rose-500 animate-in fade-in slide-in-from-top-1">
        <AlertCircle size={10} />
        <span className="text-[9px] font-black uppercase">{errors[field]}</span>
      </div>
    ) : null
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-md border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">Master Data Instrumen</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-2 tracking-widest">Gudang Data QA: {instruments.length} Alat Terdaftar</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari ID atau Nama..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 font-bold text-xs border border-transparent"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Aset Baru</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
                <th className="w-10 px-4 py-6"></th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Kode / ID Alat</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Nama & Parameter</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right">Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredInstruments.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className={`group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all duration-300 cursor-pointer ${expandedId === item.id ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}
                  >
                    <td className="px-4 py-6 text-center">
                      {expandedId === item.id ? <ChevronUp size={16} className="text-primary-600" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.code}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</div>
                      <div className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{item.parameter}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span 
                        key={item.status}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider animate-in fade-in zoom-in-95 duration-300 inline-block ${getStatusColor(item.status)}`}
                      >
                        {translateStatus(item.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(item); }}
                          className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 hover:text-primary-600 hover:border-primary-500 transition-all shadow-sm"
                          title="Edit Aset"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setIsDeleteConfirmOpen(item.id); }}
                          className="p-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-500 transition-all shadow-sm"
                          title="Hapus Aset"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === item.id && (
                    <tr className="bg-slate-50 dark:bg-slate-900/20 animate-in slide-in-from-top-2 border-b border-slate-200 dark:border-slate-800">
                      <td colSpan={5} className="px-8 py-10 md:px-12 border-l-4 border-primary-600">
                        <div className="space-y-10">
                          {/* Top Detail Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Serial Number</p>
                              <p className="text-sm font-black text-slate-800 dark:text-white">{item.serialNumber || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Lokasi & Dept</p>
                              <p className="text-sm font-bold text-slate-800 dark:text-white">{item.location} / {item.department}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Jatuh Tempo</p>
                              <p className="text-sm font-black text-rose-600">{item.nextCalibration}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Toleransi QA</p>
                              <p className="text-sm font-black text-emerald-600">{item.tolerance || '-'}</p>
                            </div>
                          </div>

                          {/* Calibration History Table */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-800 dark:text-white">
                               <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                                 <History size={16} />
                               </div>
                               <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Riwayat 3 Kalibrasi Terakhir</h5>
                            </div>
                            
                            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900/40">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Tanggal Kerja</th>
                                    <th className="px-6 py-4">Pelaksana</th>
                                    <th className="px-6 py-4">Status Hasil</th>
                                    <th className="px-6 py-4 text-center">Max Deviasi</th>
                                    <th className="px-6 py-4 text-right">Laporan</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                  {getMockHistory(item.id).map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{record.date}</td>
                                      <td className="px-6 py-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-primary-600 border border-slate-200 dark:border-slate-700 uppercase">
                                          {record.engineerId.charAt(0)}
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white uppercase text-[10px]">{record.engineerId}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${
                                          record.result === 'PASS' 
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400'
                                        }`}>
                                          {record.result}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 text-center font-black text-primary-600 dark:text-primary-400">±{record.deviation.toFixed(2)}</td>
                                      <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                          <Download size={14} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-end">
                               <button className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                                  Lihat Semua Riwayat Audit <ChevronDown size={10} className="-rotate-90" />
                               </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredInstruments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={() => setIsDeleteConfirmOpen(null)}></div>
           <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[3rem] shadow-2xl relative z-10 p-10 text-center space-y-8 animate-in zoom-in-95 border border-rose-100 dark:border-rose-900/30">
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg">
                 <Trash2 size={40} />
              </div>
              <div>
                 <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">Hapus Instrumen?</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 font-bold uppercase tracking-widest leading-relaxed">
                    Aset <span className="font-black text-slate-900 dark:text-white">"{instruments.find(i => i.id === isDeleteConfirmOpen)?.code}"</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                 </p>
              </div>
              <div className="flex flex-col gap-3">
                 <button 
                  onClick={() => confirmDelete(isDeleteConfirmOpen)}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-700 transition-all"
                 >
                   Ya, Hapus Permanen
                 </button>
                 <button 
                  onClick={() => setIsDeleteConfirmOpen(null)}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700"
                 >
                   Batalkan
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* CRUD Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={handleCloseAttempt}></div>
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-white/10 flex flex-col">
            <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase leading-none">
                {editingInstrument ? 'Perbarui Data Aset' : 'Registrasi Instrumen Baru'}
              </h3>
              <button onClick={handleCloseAttempt} className="p-3 bg-white dark:bg-slate-700 rounded-2xl text-slate-400 hover:text-rose-500 transition-all border border-slate-200 dark:border-slate-600 shadow-sm"><X size={20} /></button>
            </div>
            
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Kode / Tag ID *</label>
                  <input 
                    type="text" 
                    className={`w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-slate-800 dark:text-white border ${errors.code ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} focus:border-primary-500 transition-all`} 
                    value={formData.code} 
                    placeholder="Contoh: TEMP-01"
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                  />
                  <InputError field="code" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Parameter Utama</label>
                  <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-primary-500" value={formData.parameter} onChange={(e) => setFormData({...formData, parameter: e.target.value})}>
                     <option value="Suhu">Suhu (°C)</option>
                     <option value="Tekanan">Tekanan (Bar/PSI)</option>
                     <option value="Massa">Massa (Gram/Kg)</option>
                     <option value="Dimensi">Dimensi (mm)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Nama Instrumen Lengkap *</label>
                <input 
                  type="text" 
                  className={`w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-slate-800 dark:text-white border ${errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'} focus:border-primary-500 transition-all`} 
                  value={formData.name} 
                  placeholder="Nama alat sesuai manual book..."
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <InputError field="name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Lokasi Fisik *</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold dark:text-white focus:border-primary-500" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  <InputError field="location" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Departemen *</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none font-bold dark:text-white focus:border-primary-500" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                  <InputError field="department" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex gap-4 border-t border-slate-200 dark:border-slate-800">
              <button onClick={handleCloseAttempt} className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">Batalkan</button>
              <button 
                onClick={() => { if(validate()) setIsConfirmOpen(true); }} 
                className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 border border-transparent"
              >
                <CheckCircle2 size={16} /> Konfirmasi Simpan
              </button>
            </div>

            {/* Save Confirmation Modal */}
            {isConfirmOpen && (
              <div className="absolute inset-0 z-[140] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center space-y-8 animate-in zoom-in-95 border border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-100 dark:border-transparent shadow-sm">
                    <HelpCircle size={40} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Sudah Yakin?</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest leading-relaxed">
                      Pastikan data <span className="text-primary-600 font-black">{formData.code}</span> sudah sesuai dengan dokumen teknis.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={handleSave} className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-primary-700 transition-all">Ya, Simpan Data</button>
                    <button onClick={() => setIsConfirmOpen(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Periksa Kembali</button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel (Discard) Confirmation Modal */}
            {isCancelConfirmOpen && (
              <div className="absolute inset-0 z-[140] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center space-y-8 animate-in zoom-in-95 border border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto border border-rose-100 dark:border-transparent shadow-sm">
                    <ShieldAlert size={40} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Buang Perubahan?</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest leading-relaxed">
                      Terdapat perubahan data yang belum disimpan. Perubahan akan hilang jika Anda keluar.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button onClick={forceClose} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-rose-700 transition-all">Ya, Buang Perubahan</button>
                    <button onClick={() => setIsCancelConfirmOpen(false)} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Lanjut Mengisi</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;
