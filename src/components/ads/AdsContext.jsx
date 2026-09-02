import React, { createContext, useContext, useState, useCallback } from 'react';

const AdsContext = createContext();

export function AdsProvider({ children }) {
  const [ads, setAds] = useState([
    {
      id: 'ad-1',
      materi: 'Dijual Sepeda Lipat Polygon, kondisi 95% mulus.',
      tipe: 'jual',
      harga: 1500000,
      jangkauan: 'lokal',
      lokasi: 'Desa Sukamaju',
      status: 'tayang',
      impressions: 1250,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'ad-2',
      materi: 'Dicari guru les privat Matematika SD daerah Cikaret.',
      tipe: 'beli', // Note: using beli for seeking service
      harga: null,
      jangkauan: 'nasional',
      lokasi: null,
      status: 'review',
      impressions: 0,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'ad-3',
      materi: 'Jual Tanah Kavling 100m2 Sertifikat SHM.',
      tipe: 'jual',
      harga: 125000000,
      jangkauan: 'nasional',
      lokasi: null,
      status: 'pembayaran',
      impressions: 0,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'notif-1', message: 'Iklan "Dijual Sepeda Lipat..." Anda telah Tayang!', read: false, adId: 'ad-1' }
  ]);

  const submitAd = useCallback(async (adData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAd = {
          id: `ad-${Date.now()}`,
          ...adData,
          status: 'review',
          impressions: 0,
          createdAt: new Date().toISOString()
        };
        setAds(prev => [newAd, ...prev]);
        resolve({ success: true, ad: newAd });
      }, 1000);
    });
  }, []);

  const payAd = useCallback(async (adId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setAds(prev => prev.map(ad => 
          ad.id === adId ? { ...ad, status: 'tayang' } : ad
        ));
        resolve({ success: true });
      }, 800);
    });
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ));
  }, []);

  return (
    <AdsContext.Provider value={{
      ads,
      submitAd,
      payAd,
      notifications,
      markNotificationRead
    }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
}
