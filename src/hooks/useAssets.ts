import { useState, useEffect } from 'react';
import { Asset, AssetFormData } from '../types';

const STORAGE_KEY = 'cusol_it_assets';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAssets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse assets from local storage');
      }
    } else {
      // Seed with some initial data
      const initialAssets: Asset[] = [
        {
          id: '1',
          name: 'MacBook Pro M2 14"',
          category: 'Laptop',
          serialNumber: 'C02F123456',
          status: 'Digunakan',
          purchaseDate: '2023-01-15',
          assignedTo: 'Budi Santoso',
          location: 'Kantor Pusat - Lt 3',
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Dell UltraSharp 27" Monitor',
          category: 'Monitor',
          serialNumber: 'CN-0ABCDE-12345-678-90AB',
          status: 'Tersedia',
          purchaseDate: '2023-02-20',
          location: 'Gudang IT',
          updatedAt: new Date().toISOString(),
        }
      ];
      setAssets(initialAssets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAssets));
    }
    setIsLoaded(true);
  }, []);

  const saveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssets));
  };

  const addAsset = (data: AssetFormData) => {
    const newAsset: Asset = {
      ...data,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    saveAssets([newAsset, ...assets]);
  };

  const updateAsset = (id: string, data: AssetFormData) => {
    saveAssets(
      assets.map((asset) =>
        asset.id === id
          ? { ...asset, ...data, updatedAt: new Date().toISOString() }
          : asset
      )
    );
  };

  const deleteAsset = (id: string) => {
    saveAssets(assets.filter((asset) => asset.id !== id));
  };

  return {
    assets,
    isLoaded,
    addAsset,
    updateAsset,
    deleteAsset,
  };
}
