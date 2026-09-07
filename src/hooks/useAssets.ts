import { useState, useEffect } from 'react';
import { Asset, AssetFormData } from '../types';

const STORAGE_KEY = 'cusol_it_assets';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbInstance, setDbInstance] = useState<any>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initFirebase = async () => {
      try {
        const { collection, onSnapshot, doc, setDoc, query, orderBy } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        setDbInstance(db);

        const assetsRef = collection(db, 'assets');
        const q = query(assetsRef, orderBy('updatedAt', 'desc'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const loadedAssets: Asset[] = [];
          snapshot.forEach((docSnapshot) => {
            const { id, ...data } = docSnapshot.data();
            loadedAssets.push({ id: docSnapshot.id, ...data } as Asset);
          });
          
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
      } catch (error) {
        console.error("Failed to initialize Firebase", error);
        setIsLoaded(true);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addAsset = async (data: AssetFormData) => {
    if (!dbInstance) return;
    const { doc, setDoc } = await import('firebase/firestore');
    const newId = crypto.randomUUID();
    const docRef = doc(dbInstance, 'assets', newId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateAsset = async (id: string, data: AssetFormData) => {
    if (!dbInstance) return;
    const { doc, updateDoc } = await import('firebase/firestore');
    const docRef = doc(dbInstance, 'assets', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteAsset = async (id: string) => {
    if (!dbInstance) return;
    const { doc, deleteDoc } = await import('firebase/firestore');
    const docRef = doc(dbInstance, 'assets', id);
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
