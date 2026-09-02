import React, { useMemo } from 'react';
import { Eye, Clock, CheckCircle, CreditCard, MapPin } from 'lucide-react';
import { useAds } from './AdsContext';

export default function UserAdsDashboard() {
  const { ads, payAd } = useAds();

  // Task 2: Dashboard Sorting Logic (Revenue Priority)
  // Task 4: Metrics Performance Optimization - Views are static mock data, no polling here.
  const sortedAds = useMemo(() => {
    const priority = {
      'pembayaran': 0,
      'review': 1,
      'tayang': 2,
      'selesai': 3
    };
    
    return [...ads].sort((a, b) => {
      const pA = priority[a.status] ?? 99;
      const pB = priority[b.status] ?? 99;
      if (pA !== pB) return pA - pB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [ads]);

  const handlePay = async (id) => {
    await payAd(id);
    // In a real app, this would redirect to payment gateway
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'review':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-orange-100 text-orange-700">
            <Clock size={10} /> Dalam Review
          </span>
        );
      case 'pembayaran':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
            <CreditCard size={10} /> Menunggu Pembayaran
          </span>
        );
      case 'tayang':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-green-100 text-green-700">
            <CheckCircle size={10} /> Sedang Tayang
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-surface-100">
        <h3 className="text-sm font-bold text-surface-900 leading-tight">Daftar Iklan Saya</h3>
        <p className="text-[10px] text-surface-500 mt-0.5">Kelola iklan baris Anda</p>
      </div>

      {/* Ads List */}
      <div className="p-3 flex flex-col gap-3">
        {sortedAds.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-50 flex items-center justify-center mx-auto mb-2">
              <Eye size={20} className="text-surface-300" />
            </div>
            <p className="text-xs font-semibold text-surface-600">Belum ada iklan</p>
            <p className="text-[10px] text-surface-400">Iklan yang Anda buat akan muncul di sini</p>
          </div>
        ) : (
          sortedAds.map(ad => (
            <div 
              key={ad.id} 
              className={`border rounded-xl p-3 relative ${
                ad.status === 'review' ? 'border-surface-200 bg-surface-50/50 grayscale-[20%]' 
                : ad.status === 'pembayaran' ? 'border-blue-200 bg-blue-50/20'
                : 'border-green-200 bg-green-50/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${ad.tipe === 'jual' ? 'text-brand' : 'text-blue-600'}`}>
                  {ad.tipe === 'jual' ? 'Jual' : 'Cari'}
                </span>
                {getStatusBadge(ad.status)}
              </div>
              
              <p className="text-xs font-semibold text-surface-800 leading-snug line-clamp-2 mb-2">
                {ad.materi}
              </p>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto">
                {ad.harga && (
                  <span className="text-xs font-bold text-surface-900">
                    Rp {ad.harga.toLocaleString('id-ID')}
                  </span>
                )}
                
                <span className="text-[10px] text-surface-500 flex items-center gap-1">
                  <MapPin size={10} />
                  {ad.jangkauan === 'lokal' ? ad.lokasi : 'Nasional'}
                </span>

                {ad.status === 'tayang' && (
                  <span className="text-[10px] text-green-700 font-semibold flex items-center gap-1 ml-auto bg-green-100 px-1.5 py-0.5 rounded">
                    <Eye size={10} /> {ad.impressions.toLocaleString()} views
                  </span>
                )}
              </div>

              {ad.status === 'pembayaran' && (
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <button 
                    onClick={() => handlePay(ad.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <CreditCard size={14} />
                    Bayar Sekarang
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
