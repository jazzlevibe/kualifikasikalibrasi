
import React, { useState } from 'react';
import { Database, CalendarRange, Search } from 'lucide-react';
import AssetManagement from './AssetManagement';
import CalibrationSchedule from './CalibrationSchedule';
import { Instrument } from '../types';

interface AssetAndScheduleProps {
  instruments: Instrument[];
  setInstruments: React.Dispatch<React.SetStateAction<Instrument[]>>;
  triggerToast: (msg: string, type?: 'success' | 'danger') => void;
  onSelectForCalibration: (instId: string) => void;
  onDeleteAsset: (id: string) => void;
}

const AssetAndSchedule: React.FC<AssetAndScheduleProps> = ({ 
  instruments, 
  setInstruments, 
  triggerToast, 
  onSelectForCalibration,
  onDeleteAsset
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'MASTER' | 'JADWAL'>('MASTER');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 w-fit">
        <button
          onClick={() => setActiveSubTab('MASTER')}
          className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all ${
            activeSubTab === 'MASTER' 
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Database size={20} />
          MASTER DATA ALAT
        </button>
        <button
          onClick={() => setActiveSubTab('JADWAL')}
          className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all ${
            activeSubTab === 'JADWAL' 
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <CalendarRange size={20} />
          JADWAL TAHUNAN
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        {activeSubTab === 'MASTER' ? (
          <AssetManagement 
            instruments={instruments} 
            setInstruments={setInstruments} 
            triggerToast={(msg) => triggerToast(msg, 'success')} 
            onDeleteAsset={onDeleteAsset}
          />
        ) : (
          <CalibrationSchedule 
            instruments={instruments} 
            setInstruments={setInstruments}
            triggerToast={(msg) => triggerToast(msg, 'success')}
            onSelectForCalibration={onSelectForCalibration} 
          />
        )}
      </div>
    </div>
  );
};

export default AssetAndSchedule;
