import React, { useState } from 'react';
import { Camera, MapPin, UploadCloud, X, Check, Loader2 } from 'lucide-react';
import { useAds } from './AdsContext';

export default function AdsSubmissionForm({ onSuccess }) {
  const { submitAd } = useAds();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    materi: '',
    tipe: 'jual', // 'jual' or 'beli'
    harga: '',
    jangkauan: 'lokal', // 'lokal' or 'nasional'
    lokasi: '',
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationFailed, setLocationFailed] = useState(false);
  const [toast, setToast] = useState(null);

  const handleLocationRequest = () => {
    if (formData.jangkauan !== 'lokal') return;
    
    setLocationLoading(true);
    setLocationFailed(false);
    
    if ('geolocation' in navigator) {
      let timeoutId;
      
      const successCb = (position) => {
        clearTimeout(timeoutId);
        // Mock reverse geocoding for simplicity
        setTimeout(() => {
          setFormData(prev => ({ ...prev, lokasi: 'Jakarta' }));
          setLocationLoading(false);
        }, 800);
      };

      const errorCb = (error) => {
        clearTimeout(timeoutId);
        console.error("Error getting location", error);
        setLocationLoading(false);
        setLocationFailed(true);
      };

      // Strict 3s timeout
      timeoutId = setTimeout(() => {
        setLocationLoading(false);
        setLocationFailed(true);
      }, 3000);

      navigator.geolocation.getCurrentPosition(successCb, errorCb, { timeout: 3000 });
    } else {
      setLocationLoading(false);
      setLocationFailed(true);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.materi.trim()) {
      showToast('Materi iklan wajib diisi', 'error');
      return;
    }
    
    setLoading(true);
    
    const adToSubmit = {
      ...formData,
      harga: formData.tipe === 'jual' ? Number(formData.harga) : null
    };
    
    try {
      await submitAd(adToSubmit);
      showToast('Iklan berhasil disubmit!');
      
      // Reset form
      setFormData({
        materi: '',
        tipe: 'jual',
        harga: '',
        jangkauan: 'lokal',
        lokasi: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-4 mb-4 relative">
      <h3 className="text-sm font-bold text-surface-900 mb-4">Pasang Iklan Baris</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Materi Iklan */}
        <div>
          <label className="block text-xs font-semibold text-surface-700 mb-1.5">Materi Iklan <span className="text-red-500">*</span></label>
          <div className="relative">
            <textarea
              className="w-full bg-surface-50 border border-surface-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
              rows={3}
              maxLength={100}
              placeholder="Cth: Dijual Motor Beat 2020, kondisi mulus..."
              value={formData.materi}
              onChange={e => setFormData({...formData, materi: e.target.value})}
            />
            <div className="absolute bottom-2 right-2 flex items-center">
              <span className="text-[10px] text-surface-400">{formData.materi.length}/100</span>
            </div>
          </div>
        </div>

        {/* Tipe Iklan */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-surface-700 cursor-pointer">
            <input 
              type="radio" 
              name="tipe" 
              className="w-4 h-4 text-brand focus:ring-brand"
              checked={formData.tipe === 'jual'}
              onChange={() => setFormData({...formData, tipe: 'jual'})}
            />
            Jual
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-surface-700 cursor-pointer">
            <input 
              type="radio" 
              name="tipe" 
              className="w-4 h-4 text-brand focus:ring-brand"
              checked={formData.tipe === 'beli'}
              onChange={() => setFormData({...formData, tipe: 'beli'})}
            />
            Beli / Cari
          </label>
        </div>

        {/* Harga - Conditional */}
        {formData.tipe === 'jual' && (
          <div>
            <label className="block text-xs font-semibold text-surface-700 mb-1.5">Harga (Rp) <span className="text-red-500">*</span></label>
            <input
              type="number"
              className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              placeholder="Contoh: 1500000"
              required
              value={formData.harga}
              onChange={e => setFormData({...formData, harga: e.target.value})}
            />
          </div>
        )}

        {/* Jangkauan */}
        <div>
          <label className="block text-xs font-semibold text-surface-700 mb-1.5">Jangkauan Iklan</label>
          <div className="flex bg-surface-50 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.jangkauan === 'lokal' ? 'bg-white shadow-sm text-brand' : 'text-surface-500'
              }`}
              onClick={() => {
                setFormData({...formData, jangkauan: 'lokal'});
              }}
            >
              Lokal (Desa/Kota)
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formData.jangkauan === 'nasional' ? 'bg-white shadow-sm text-brand' : 'text-surface-500'
              }`}
              onClick={() => setFormData({...formData, jangkauan: 'nasional'})}
            >
              Nasional
            </button>
          </div>
        </div>

        {/* Lokasi - Fallback UI */}
        {formData.jangkauan === 'lokal' && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-800 font-medium flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                Target Lokasi
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan nama kota..."
                className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400 min-w-0"
                value={formData.lokasi}
                onChange={e => setFormData({...formData, lokasi: e.target.value})}
                required
              />
              <button 
                type="button" 
                onClick={handleLocationRequest}
                disabled={locationLoading}
                className="flex items-center gap-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {locationLoading ? (
                  <><Loader2 size={12} className="animate-spin" /> Mendeteksi...</>
                ) : (
                  <>📍 Deteksi Otomatis</>
                )}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white font-bold text-sm py-2.5 rounded-xl shadow-brand-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #1B6B3A, #217A44)' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {loading ? 'Memproses...' : 'Pasang Iklan Sekarang'}
        </button>
      </form>

      {/* Toast Notification */}
      {toast && (
        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full shadow-lg text-xs font-bold text-white flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        }`}>
          {toast.type === 'success' && <Check size={14} className="text-green-400" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
