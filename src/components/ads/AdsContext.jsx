import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addAdsNotification } from '@/utils/adsNotificationStore';

const AdsContext = createContext();

export const STORAGE_KEY_ADS = 'gv_user_ads_list';

const INITIAL_ADS = [
  {
    id: 'ad-1',
    kategori: 'baris',
    subKategori: 'Jual',
    tipe: 'jual',
    judul: 'Sepeda Lipat Polygon Urbano 3 Mulus',
    deskripsi: 'Kondisi 95% istimewa, pemakaian santai akhir pekan, rem hidrolik pakem.',
    materi: 'Sepeda Lipat Polygon Urbano 3 Mulus - 95% pemakaian santai',
    harga: 1850000,
    hargaLabel: 'Rp 1.850.000',
    jangkauan: 'lokal',
    lokasi: 'Desa Sukamaju',
    whatsapp: '081234567890',
    photos: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=300&auto=format&fit=crop'],
    status: 'tayang',
    impressions: 2450,
    clicks: 142,
    schedule: {
      type: 'sprint',
      totalDays: 7,
      dailyRate: 8500,
      totalCost: 59500,
      startDate: '04 Sep 2026',
      endDate: '10 Sep 2026',
      dates: ['2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10'],
    },
    revisionCount: 0,
    periode: '04 Sep - 10 Sep 2026',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ad-8',
    kategori: 'baris',
    subKategori: 'Jasa',
    tipe: 'jual',
    judul: 'Jasa Servis Pompa Air & Pipa Ledeng',
    deskripsi: 'Panggilan cepat area desa & kecamatan, teknisi berpengalaman garansi 1 bulan.',
    materi: 'Jasa Servis Pompa Air & Pipa Ledeng - Teknisi Bergaransi',
    harga: null,
    hargaLabel: 'Nego',
    jangkauan: 'lokal',
    lokasi: 'Kec. Sukamakmur',
    whatsapp: '085712345678',
    photos: [],
    status: 'tayang',
    impressions: 1820,
    clicks: 94,
    schedule: {
      type: 'sprint',
      totalDays: 5,
      dailyRate: 8500,
      totalCost: 42500,
      startDate: '08 Sep 2026',
      endDate: '12 Sep 2026',
      dates: ['2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12'],
    },
    revisionCount: 0,
    periode: '08 Sep - 12 Sep 2026',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ad-9',
    kategori: 'baris',
    subKategori: 'Lowongan',
    tipe: 'jual',
    judul: 'Dibutuhkan Penjaga Toko Sembako Berkah',
    deskripsi: 'Pria/Wanita jujur, disiplin, mengerti kasir sederhana, makan siang disediakan.',
    materi: 'Dibutuhkan Penjaga Toko Sembako Berkah - Gaji Bersaing',
    harga: null,
    hargaLabel: 'Gaji Bersaing',
    jangkauan: 'lokal',
    lokasi: 'Desa Berdaya',
    whatsapp: '081398765432',
    photos: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=300&auto=format&fit=crop'],
    status: 'tayang',
    impressions: 3100,
    clicks: 215,
    schedule: {
      type: 'sprint',
      totalDays: 4,
      dailyRate: 8500,
      totalCost: 34000,
      startDate: '09 Sep 2026',
      endDate: '12 Sep 2026',
      dates: ['2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12'],
    },
    revisionCount: 0,
    periode: '09 Sep - 12 Sep 2026',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ad-10',
    kategori: 'baris',
    subKategori: 'Cari',
    tipe: 'beli',
    judul: 'Dicari Motor Beat / Vario Bekas Siap Pakai',
    deskripsi: 'Surat-surat lengkap BPKB & STNK hidup, mesin halus, budget 8-10 juta.',
    materi: 'Dicari Motor Beat / Vario Bekas Siap Pakai - Budget 8-10 Jt',
    harga: 9000000,
    hargaLabel: 'Budget 9 Jt',
    jangkauan: 'lokal',
    lokasi: 'Desa Sukamaju',
    whatsapp: '081287654321',
    photos: [],
    status: 'tayang',
    impressions: 1450,
    clicks: 88,
    schedule: {
      type: 'sprint',
      totalDays: 3,
      dailyRate: 8500,
      totalCost: 25500,
      startDate: '10 Sep 2026',
      endDate: '12 Sep 2026',
      dates: ['2026-09-10', '2026-09-11', '2026-09-12'],
    },
    revisionCount: 0,
    periode: '10 Sep - 12 Sep 2026',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'ad-2',
    kategori: 'produk',
    tipe: 'jual',
    judul: 'Diskon 30% Paket Pupuk Organik Desa Mandiri',
    deskripsi: 'Paket hemat pupuk kompos organik cair 5L untuk masa tanam subur.',
    materi: 'Diskon 30% Paket Pupuk Organik Desa Mandiri untuk Musim Tanam Ini!',
    harga: 250000,
    hargaLabel: 'Rp 250.000',
    jangkauan: 'lokal',
    lokasi: 'Kabupaten Bogor',
    whatsapp: '081223344556',
    photos: ['https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=300&auto=format&fit=crop'],
    status: 'pembayaran',
    schedule: {
      type: 'sprint',
      totalDays: 3,
      dailyRate: 8500,
      totalCost: 25500,
      startDate: '13 Sep 2026',
      endDate: '15 Sep 2026',
      dates: ['2026-09-13', '2026-09-14', '2026-09-15'],
    },
    tagihan: 25500,
    batasPembayaran: 'Sebelum H-1 (12 Sep) 23:59 WIB',
    revisionCount: 0,
    impressions: 0,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'ad-3',
    kategori: 'produk',
    tipe: 'jual',
    materi: 'Madu Hutan Murni Asli Desa Sukamaju 500ml - Panen Alami Hutan Lindung',
    harga: 85000,
    hargaLabel: 'Rp 85.000',
    jangkauan: 'nasional',
    lokasi: null,
    whatsapp: '081299887766',
    status: 'review',
    schedule: {
      type: 'sprint',
      totalDays: 4,
      dailyRate: 8500,
      totalCost: 34000,
      startDate: '14 Sep 2026',
      endDate: '17 Sep 2026',
      dates: ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'],
    },
    revisionCount: 0,
    impressions: 0,
    reviewNote: 'Iklan sedang diperiksa oleh tim Komite GV. Estimasi proses peninjauan 1×24 jam.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ad-4',
    kategori: 'video',
    tipe: 'jual',
    materi: 'Promo Paket Wisata Petik Buah & Homestay Desa Wisata Nagrak',
    harga: 350000,
    hargaLabel: 'Rp 350.000',
    jangkauan: 'nasional',
    lokasi: null,
    whatsapp: '081211223344',
    status: 'ditolak',
    schedule: {
      type: 'sprint',
      totalDays: 3,
      dailyRate: 8500,
      totalCost: 25500,
      startDate: '15 Sep 2026',
      endDate: '17 Sep 2026',
      dates: ['2026-09-15', '2026-09-16', '2026-09-17'],
    },
    revisionCount: 0, // 0 = bisa revisi 1x
    impressions: 0,
    alasanPenolakan: 'Format nomor kontak pada materi iklan belum memenuhi panduan komunitas penyiaran GV.',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: 'ad-7',
    kategori: 'baris',
    subKategori: 'Jual',
    tipe: 'jual',
    judul: 'Investasi Cepat Untung Melimpah',
    deskripsi: 'Investasi tanpa risiko bunga 50% per bulan langsung cair.',
    materi: 'Investasi Cepat Untung Melimpah Tanpa Risiko - Hubungi Segera!',
    harga: 5000000,
    hargaLabel: 'Rp 5.000.000',
    jangkauan: 'nasional',
    lokasi: null,
    whatsapp: '081299990000',
    photos: [],
    status: 'ditolak',
    schedule: {
      type: 'sprint',
      totalDays: 3,
      dailyRate: 8500,
      totalCost: 25500,
      startDate: '10 Sep 2026',
      endDate: '12 Sep 2026',
      dates: ['2026-09-10', '2026-09-11', '2026-09-12'],
    },
    revisionCount: 1, // 1 = sudah melewati batas revisi 1x (terkunci permanen)
    impressions: 0,
    alasanPenolakan: 'Materi terindikasi melanggar panduan komunitas (janji keuntungan tidak wajar). Batas revisi (1x) telah habis.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ad-5',
    kategori: 'promo',
    tipe: 'jual',
    materi: 'Voucher Potongan Belanja Sembako Rp 20.000 Khusus Warga Desa Berdaya',
    harga: 20000,
    hargaLabel: 'Rp 20.000',
    jangkauan: 'lokal',
    lokasi: 'Desa Cikaret',
    whatsapp: '081277665544',
    status: 'selesai',
    schedule: {
      type: 'sprint',
      totalDays: 7,
      dailyRate: 8500,
      totalCost: 59500,
      startDate: '25 Agu 2026',
      endDate: '01 Sep 2026',
      dates: [],
    },
    revisionCount: 0,
    impressions: 4890,
    clicks: 310,
    periode: '25 Agu - 01 Sep 2026',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];


export function AdsProvider({ children }) {
  const [ads, setAds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map(a => a.kategori === 'banner' ? { ...a, kategori: 'baris' } : a);
          const hasAd8 = sanitized.some(a => a.id === 'ad-8');
          if (!hasAd8) {
            const merged = [...sanitized, ...INITIAL_ADS.filter(ia => !sanitized.some(sa => sa.id === ia.id))];
            try { localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(merged)); } catch (_) {}
            return merged;
          }
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Failed to load ads from localStorage', e);
    }
    return INITIAL_ADS;
  });

  // Persist to localStorage
  const saveAds = useCallback((newAds) => {
    setAds(newAds);
    try {
      localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(newAds));
    } catch (e) {
      console.error('Failed to save ads to localStorage', e);
    }
  }, []);

  // Submit new ad (Step 1-5)
  const submitAd = useCallback(async (adData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAd = {
          id: `ad-${Date.now()}`,
          ...adData,
          status: 'review',
          revisionCount: 0,
          impressions: 0,
          reviewNote: 'Iklan sedang diperiksa oleh tim Komite GV. Estimasi proses peninjauan 1×24 jam.',
          createdAt: new Date().toISOString(),
        };

        saveAds([newAd, ...ads]);

        // Trigger in-app notification (Step 5)
        addAdsNotification({
          title: 'Iklan Sedang Ditinjau',
          sub: `Iklan "${newAd.materi.slice(0, 32)}..." sedang dalam peninjauan tim Komite GV. Estimasi 1×24 jam.`,
          category: 'transaksi',
          type: 'review',
          adId: newAd.id,
        });

        resolve({ success: true, ad: newAd });
      }, 500);
    });
  }, [ads, saveAds]);

  // Pay ad (Step 6)
  const payAd = useCallback(async (adId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let updatedAd = null;
        const nextAds = ads.map((ad) => {
          if (ad.id === adId) {
            updatedAd = {
              ...ad,
              status: 'terjadwal', // Berubah menjadi Terjadwal
            };
            return updatedAd;
          }
          return ad;
        });

        saveAds(nextAds);

        if (updatedAd) {
          addAdsNotification({
            title: 'Pembayaran Iklan Berhasil',
            sub: `Pembayaran berhasil! Iklan terjadwal tayang mulai ${updatedAd.schedule?.startDate || 'besok'} pukul 00:00 WIB.`,
            category: 'transaksi',
            type: 'terjadwal',
            adId: updatedAd.id,
          });
        }

        resolve({ success: true });
      }, 800);
    });
  }, [ads, saveAds]);

  // Edit & Ajukan Ulang (Revisi Iklan)
  const updateAndRetryAd = useCallback(async (adId, updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let revisedAd = null;
        const nextAds = ads.map((ad) => {
          if (ad.id === adId) {
            revisedAd = {
              ...ad,
              ...updatedData,
              status: 'review',
              revisionCount: (ad.revisionCount || 0) + 1,
              alasanPenolakan: null,
              reviewNote: 'Iklan perbaikan sedang diperiksa kembali oleh tim Komite GV.',
              updatedAt: new Date().toISOString(),
            };
            return revisedAd;
          }
          return ad;
        });

        saveAds(nextAds);

        if (revisedAd) {
          addAdsNotification({
            title: 'Iklan Perbaikan Diajukan',
            sub: `Iklan perbaikan "${revisedAd.materi.slice(0, 32)}..." sedang dalam peninjauan ulang tim Komite GV.`,
            category: 'transaksi',
            type: 'review',
            adId: revisedAd.id,
          });
        }

        resolve({ success: true, ad: revisedAd });
      }, 600);
    });
  }, [ads, saveAds]);

  // Demo Simulation: Komite Decision (Approved / Rejected)
  const simulateCommitteeDecision = useCallback((adId, decision = 'approved', customReason = '') => {
    let targetAd = null;
    const nextAds = ads.map((ad) => {
      if (ad.id === adId) {
        if (decision === 'approved') {
          targetAd = {
            ...ad,
            status: 'pembayaran',
            tagihan: ad.schedule?.totalCost || 25500,
            batasPembayaran: `Sebelum H-1 (${ad.schedule?.startDate || 'Besok'}) 23:59 WIB`,
            reviewNote: null,
          };
        } else {
          targetAd = {
            ...ad,
            status: 'ditolak',
            alasanPenolakan: customReason || 'Format materi atau nomor kontak belum sesuai pedoman komunitas GV.',
          };
        }
        return targetAd;
      }
      return ad;
    });

    saveAds(nextAds);

    if (targetAd) {
      if (decision === 'approved') {
        addAdsNotification({
          title: 'Iklan Anda Telah Disetujui!',
          sub: `Iklan "${targetAd.materi.slice(0, 30)}..." telah disetujui! Selesaikan pembayaran untuk mulai tayang.`,
          category: 'transaksi',
          type: 'pembayaran',
          adId: targetAd.id,
        });
      } else {
        addAdsNotification({
          title: 'Iklan Belum Dapat Ditayangkan',
          sub: `Iklan "${targetAd.materi.slice(0, 30)}..." ditolak komite: ${targetAd.alasanPenolakan}`,
          category: 'transaksi',
          type: 'ditolak',
          adId: targetAd.id,
        });
      }
    }
  }, [ads, saveAds]);

  return (
    <AdsContext.Provider
      value={{
        ads,
        submitAd,
        payAd,
        updateAndRetryAd,
        simulateCommitteeDecision,
      }}
    >
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
