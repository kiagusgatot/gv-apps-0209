import React, { createContext, useContext, useState, useCallback } from 'react';

const AdsContext = createContext();

export function AdsProvider({ children }) {
  const [ads, setAds] = useState([
    {
      id: 'ad-1',
      kategori: 'baris',
      tipe: 'jual',
      materi: 'Dijual Sepeda Lipat Polygon Urbano 3, mulus 95% pemakaian santai.',
      harga: 1850000,
      jangkauan: 'lokal',
      lokasi: 'Desa Sukamaju',
      status: 'tayang',
      impressions: 2450,
      clicks: 142,
      periode: '04 Sep - 11 Sep 2026',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'ad-2',
      kategori: 'banner',
      tipe: 'jual',
      materi: 'Diskon 30% Paket Pupuk Organik Desa Mandiri untuk Musim Tanam Ini!',
      harga: 250000,
      jangkauan: 'lokal',
      lokasi: 'Kabupaten Bogor',
      status: 'pembayaran',
      tagihan: 25000,
      batasPembayaran: 'Hari ini, 23:59 WIB',
      impressions: 0,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'ad-3',
      kategori: 'produk',
      tipe: 'jual',
      materi: 'Madu Hutan Murni Asli Desa Sukamaju 500ml - Panen Alami Hutan Lindung',
      harga: 85000,
      jangkauan: 'nasional',
      lokasi: null,
      status: 'review',
      impressions: 0,
      reviewNote: 'Iklan sedang diperiksa oleh tim kurasi GV Media. Estimasi verifikasi 1×24 jam.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'ad-4',
      kategori: 'video',
      tipe: 'jual',
      materi: 'Promo Paket Wisata Petik Buah & Homestay Desa Wisata Nagrak',
      harga: 350000,
      jangkauan: 'nasional',
      lokasi: null,
      status: 'ditolak',
      impressions: 0,
      alasanPenolakan: 'Format nomor kontak pada video belum memenuhi panduan komunitas penyiaran GV Media.',
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    },
    {
      id: 'ad-5',
      kategori: 'promo',
      tipe: 'jual',
      materi: 'Voucher Potongan Belanja Sembako Rp 20.000 Khusus Warga Desa Berdaya',
      harga: 20000,
      jangkauan: 'lokal',
      lokasi: 'Desa Cikaret',
      status: 'selesai',
      impressions: 4890,
      clicks: 310,
      periode: '25 Agu - 01 Sep 2026',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: 'ad-6',
      kategori: 'baris',
      tipe: 'beli',
      materi: 'Dicari mesin perontok padi bekas kondisi siap pakai untuk kelompok tani.',
      harga: null,
      jangkauan: 'lokal',
      lokasi: 'Kecamatan Dramaga',
      status: 'kedaluwarsa',
      impressions: 1120,
      clicks: 45,
      periode: '10 Agu - 17 Agu 2026',
      createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    },
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

  const retryAd = useCallback(async (adId) => {
    // Re-submit rejected ad for review
    return new Promise((resolve) => {
      setTimeout(() => {
        setAds(prev => prev.map(ad => 
          ad.id === adId ? { 
            ...ad, 
            status: 'review', 
            reviewNote: 'Iklan perbaikan sedang diperiksa kembali oleh tim kurasi GV Media.',
            alasanPenolakan: null 
          } : ad
        ));
        resolve({ success: true });
      }, 600);
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
      retryAd,
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
