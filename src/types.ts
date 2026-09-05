export type AssetStatus = 'Tersedia' | 'Digunakan' | 'Dalam Perbaikan' | 'Rusak' | 'Pensiun' | 'POC';

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: AssetStatus;
  purchaseDate: string;
  checkoutDate?: string;
  returnDate?: string;
  assignedTo?: string;
  location: string;
  notes?: string;
  updatedAt: string;
}

export type AssetFormData = Omit<Asset, 'id' | 'updatedAt'>;
