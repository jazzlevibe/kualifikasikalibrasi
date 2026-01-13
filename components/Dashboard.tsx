
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Box,
  FileText,
  Microscope,
  ChevronRight,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { getCalibrationInsights } from '../services/geminiService';
import { Instrument, AssetStatus } from '../types';

const chartData = [
  { name: 'Jan', selesai: 40, rencana: 24 },
  { name: 'Feb', selesai: 30, rencana: 13 },
  { name: 'Mar', selesai: 45, rencana: 50 },
  { name: 'Apr', selesai: 27, rencana: 39 },
  { name: 'Mei', selesai: 35, rencana: 48 },
  { name: 'Jun', selesai: 23, rencana: 38 },
];

interface DashboardProps {
  instruments: Instrument[];
  onNavigate: (tab: string, instId?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ instruments, onNavigate }) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(true);

  const stats = useMemo(() => ({
    total: instruments.length,
    due: instruments.filter(i => i.status === AssetStatus.CALIBRATION_DUE).length,
    process: Math.floor(instruments.length * 0.15), // Mock process data
    compliance: "98.2%"
  }), [instruments]);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingAi(true);
      const insight = await getCalibrationInsights(instruments);
      setAiInsight(insight?.split('.')[0] || "Sistem klinis berjalan sesuai parameter GMP.");
      setLoadingAi(false);
    };
    fetchInsights();
  }, [instruments]);

  const kpis = [
    { label: 'Total Inventaris', value: stats.total, icon: Box, color: 'text-teal-600', bg: 'bg-teal-50', trend: '+12', target: 'assets_schedule' },
    { label: 'Jatuh Tempo', value: stats.due, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Kritis', target: 'assets_schedule' },
    { label: 'Dalam Proses', value: stats.process, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Sesuai', target: 'jobs' },
    { label: 'Kepatuhan GMP', value: stats.compliance, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0.5%', target: 'certificates' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Smart AI Alert Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
              <Microscope size={16} />
            </div>
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:inline">Analisis Klinis:</span>
              {loadingAi ? (
                <div className="h-4 w-48 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300 truncate">
                  {aiInsight}. <span className="text-teal-500 font-medium tracking-tight">Cek integritas data di Area Produksi Steril.</span>
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('jobs')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all border border-teal-100 dark:border-transparent"
          >
            Review <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* KPI Section - Now Interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(kpi.target)}
            className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col gap-4 group hover:border-teal-500 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className={`${kpi.bg} p-3 rounded-2xl transition-transform group-hover:scale-110 border border-transparent group-hover:border-white/20`}>
                <kpi.icon className={kpi.color} size={20} />
              </div>
              <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-200 dark:border-slate-700">
                <ArrowUpRight size={14} className="text-teal-600" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{kpi.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Added min-w-0 here to solve the ResponsiveContainer calculation issue */}
        <div className="lg:col-span-2 min-w-0 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase">Statistik Validasi</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-2">Pencapaian vs Target GXP</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-teal-600"></div> Selesai
               </div>
               <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div> Rencana
               </div>
            </div>
          </div>
          {/* Added w-full and min-w-0 here to ensure container has stable calculated width */}
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}}
                />
                <Area type="monotone" dataKey="selesai" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col">
           <h3 className="text-base font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3 leading-none uppercase">
             <div className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800"><Activity size={18} /></div>
             Integritas Sektor
           </h3>
           <div className="space-y-5 flex-1">
              {[
                { label: 'Sterile Environment', value: 85, color: 'bg-teal-600' },
                { label: 'Formulation Lab', value: 65, color: 'bg-emerald-500' },
                { label: 'Utility & HVAC', value: 40, color: 'bg-amber-500' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>{stat.label}</span>
                    <span className="text-slate-900 dark:text-white">{stat.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.value}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => onNavigate('jobs')}
                className="w-full py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg border border-transparent hover:border-teal-400"
              >
                Input Kerja Baru
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
