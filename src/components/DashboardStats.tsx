import { Asset } from '../types';
import { Laptop, Monitor, AlertCircle, CheckCircle2, Box } from 'lucide-react';

interface DashboardStatsProps {
  assets: Asset[];
}

export function DashboardStats({ assets }: DashboardStatsProps) {
  const totalAssets = assets.length;
  const available = assets.filter((a) => a.status === 'Tersedia').length;
  const inUse = assets.filter((a) => a.status === 'Digunakan').length;
  const inRepair = assets.filter((a) => a.status === 'Dalam Perbaikan').length;

  const pocAssets = assets.filter((a) => a.status === 'POC');
  const pocKeluar = pocAssets.filter((a) => !a.returnDate).length;
  const pocTersedia = pocAssets.filter((a) => a.returnDate).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="text-xs font-medium text-slate-500 mb-1">Total Aset IT</div>
        <div className="text-2xl font-bold">{totalAssets}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="text-xs font-medium text-slate-500 mb-1">Aktif Digunakan</div>
        <div className="text-2xl font-bold text-indigo-600">{inUse}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="text-xs font-medium text-slate-500 mb-1">Dalam Perbaikan</div>
        <div className="text-2xl font-bold text-amber-500">{inRepair}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="text-xs font-medium text-slate-500 mb-1">Tersedia/Ready</div>
        <div className="text-2xl font-bold text-emerald-500">{available}</div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="flex justify-between items-start mb-1">
          <div className="text-xs font-medium text-slate-500">Unit POC</div>
          <div className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">
            {pocAssets.length} Total
          </div>
        </div>
        <div className="flex gap-4 mt-1">
          <div>
            <div className="text-lg font-bold text-slate-800">{pocKeluar}</div>
            <div className="text-[10px] text-slate-400 font-medium">Keluar</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-600">{pocTersedia}</div>
            <div className="text-[10px] text-slate-400 font-medium">Tersedia</div>
          </div>
        </div>
      </div>
    </div>
  );
}
