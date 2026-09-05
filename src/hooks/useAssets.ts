import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Asset, AssetFormData } from '../types';

const STORAGE_KEY = 'cusol_it_assets';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const assetsRef = collection(db, 'assets');
    const q = query(assetsRef, orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedAssets: Asset[] = [];
      snapshot.forEach((docSnapshot) => {
        // Exclude id from data since we get it from docSnapshot.id
        const { id, ...data } = docSnapshot.data();
        loadedAssets.push({ id: docSnapshot.id, ...data } as Asset);
      });
      
      // Automatic Migration from localStorage (runs if Firestore is empty)
      if (loadedAssets.length === 0) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const localAssets = JSON.parse(stored) as Asset[];
            if (localAssets.length > 0) {
              localAssets.forEach(async (asset) => {
                const { id, ...data } = asset;
                const docRef = doc(db, 'assets', id);
                await setDoc(docRef, data);
              });
              // Clear local storage after migration
              localStorage.removeItem(STORAGE_KEY);
            }
          } catch (e) {
            console.error('Failed to parse local storage for migration');
          }
        }
      }
      
      setAssets(loadedAssets);
      setIsLoaded(true);
    }, (error) => {
      console.error("Error fetching assets:", error);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const addAsset = async (data: AssetFormData) => {
    const newId = crypto.randomUUID();
    const docRef = doc(db, 'assets', newId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateAsset = async (id: string, data: AssetFormData) => {
    const docRef = doc(db, 'assets', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteAsset = async (id: string) => {
    const docRef = doc(db, 'assets', id);
    await deleteDoc(docRef);
  };

  return {
    assets,
    isLoaded,
    addAsset,
    updateAsset,
    deleteAsset,
  };
}
