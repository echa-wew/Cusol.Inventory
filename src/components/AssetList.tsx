import { Asset, AssetStatus } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit2, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface AssetListProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<AssetStatus, string> = {
  'Tersedia': 'bg-emerald-100 text-emerald-700',
  'Digunakan': 'bg-blue-100 text-blue-700',
  'Dalam Perbaikan': 'bg-amber-100 text-amber-700',
  'Rusak': 'bg-red-100 text-red-700',
  'Pensiun': 'bg-slate-100 text-slate-700',
  'POC': 'bg-fuchsia-100 text-fuchsia-700',
};

export function AssetList({ assets, onEdit, onDelete }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'Semua'>('Semua');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 gap-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide hidden sm:block">Daftar Inventaris Terkini</h2>
        <div className="flex items-center gap-4 flex-1 sm:flex-none justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aset atau SN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-md text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-1.5 bg-slate-100 border-none rounded-md text-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Digunakan">Digunakan</option>
            <option value="Dalam Perbaikan">Dalam Perbaikan</option>
            <option value="Rusak">Rusak</option>
            <option value="Pensiun">Pensiun</option>
            <option value="POC">POC</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Aset & SN</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Kategori</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Lokasi / Pengguna</th>
              <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                  Tidak ada aset yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-slate-900">{asset.name}</div>
                    <div className="font-mono text-indigo-600 text-[10px] mt-0.5">#{asset.serialNumber}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{asset.category}</td>
                  <td className="px-5 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", statusColors[asset.status])}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    <div className="font-medium text-slate-900">{asset.location}</div>
                    {asset.assignedTo && (
                      <div className="text-[10px] mt-0.5">{asset.assignedTo}</div>
                    )}
                    {(asset.checkoutDate || asset.returnDate) && (
                      <div className="text-[10px] mt-1 space-y-0.5">
                        {asset.checkoutDate && <div><span className="font-medium">Keluar:</span> {asset.checkoutDate}</div>}
                        {asset.returnDate && <div><span className="font-medium">Kembali:</span> {asset.returnDate}</div>}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onEdit(asset)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded hover:bg-indigo-50"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Yakin ingin menghapus aset ini?')) {
                          onDelete(asset.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 ml-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <span>Menampilkan {filteredAssets.length} dari {assets.length} perangkat</span>
      </div>
    </div>
  );
}
