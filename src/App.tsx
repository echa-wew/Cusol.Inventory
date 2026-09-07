/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAssets } from './hooks/useAssets';
import { DashboardStats } from './components/DashboardStats';
import { AssetList } from './components/AssetList';
import { AssetForm } from './components/AssetForm';
import { Asset, AssetFormData } from './types';
import { Server, Plus, FileDown, Loader2 } from 'lucide-react';

export default function App() {
  const { assets, isLoaded, addAsset, updateAsset, deleteAsset } = useAssets();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: AssetFormData) => {
    try {
      if (editingAsset) {
        await updateAsset(editingAsset.id, data);
      } else {
        await addAsset(data);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan aset:", error);
      alert("Gagal menyimpan data ke server. Mohon periksa koneksi internet Anda atau coba lagi beberapa saat.");
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const { generateMonthlyReport } = await import('./lib/pdfExport');
      generateMonthlyReport(assets);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-900">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-none text-slate-900">CUSOL INVENTORY</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 hidden sm:flex">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-[11px] font-medium text-green-700 uppercase tracking-wider">GitHub CI/CD: Active</span>
          </div>
          <button
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-md hover:bg-slate-50 transition-colors hidden sm:flex disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            UNDUH LAPORAN PDF
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-bold rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            TAMBAH ASET
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        <DashboardStats assets={assets} />
        
        <AssetList 
          assets={assets} 
          onEdit={handleOpenEdit}
          onDelete={deleteAsset}
        />
      </main>

      {isFormOpen && (
        <AssetForm
          asset={editingAsset}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
