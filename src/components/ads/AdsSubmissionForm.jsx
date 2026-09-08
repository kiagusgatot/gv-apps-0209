import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, UploadCloud, X, Check, Loader2, Info, Eye, ExternalLink, 
  AlignLeft, Image, ShoppingBag, Clapperboard, Sparkles, Play, 
  ArrowRight, Megaphone, Star, Tag, CheckCircle2
} from 'lucide-react';
import { useAds } from './AdsContext';

// 5 Kategori Iklan Resmi GV
const AD_CATEGORIES = [
  { 
    id: 'baris', 
    label: 'Iklan Baris', 
    icon: AlignLeft, 
    badge: 'Live Ticker', 
    desc: 'Teks berjalan di bawah player siaran live',
    placeholder: 'Cth: Dijual Sepeda Lipat Polygon, kondisi 95% mulus, pemakaian pribadi...'
  },
  { 
    id: 'banner', 
    label: 'Iklan Banner', 
    icon: Image, 
    badge: 'Display Banner', 
    desc: 'Banner interaktif di halaman konten siaran',
    placeholder: 'Cth: Diskon 30% Paket Pupuk Organik Desa Mandiri untuk Musim Tanam Ini!'
  },
  { 
    id: 'produk', 
    label: 'Iklan Produk', 
    icon: ShoppingBag, 
    badge: 'ESTO Produk', 
    desc: 'Spotlight katalog produk dari marketplace ESTO',
    placeholder: 'Cth: Madu Hutan Murni Asli Desa Sukamaju 500ml - Panen Alami...'
  },
  { 
    id: 'video', 
    label: 'Iklan Video', 
    icon: Clapperboard, 
    badge: 'In-Stream (15s)', 
    desc: 'Tayangan video promosi saat jeda siaran',
    placeholder: 'Cth: Video Profil Wisata Petik Buah Desa Sukamaju & Paket Homestay...'
  },
  { 
    id: 'promo', 
    label: 'Iklan Promo', 
    icon: Sparkles, 
    badge: 'Voucher / Diskon', 
    desc: 'Kupon promo & flash deal penonton siaran',
    placeholder: 'Cth: Voucher Cashback 20% Belanja Sembako Khusus Warga Desa...'
  },
];

export default function AdsSubmissionForm({ onSuccess }) {
  const { submitAd } = useAds();
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [portalNode, setPortalNode] = useState(null);

  const [formData, setFormData] = useState({
    kategori: 'baris', // 'baris' | 'banner' | 'produk' | 'video' | 'promo'
    materi: '',
    tipe: 'jual', // 'jual' or 'beli'
    harga: '',
    jangkauan: 'lokal', // 'lokal' or 'nasional'
    lokasi: '',
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationFailed, setLocationFailed] = useState(false);
  const [toast, setToast] = useState(null);

  const activeCategory = AD_CATEGORIES.find(c => c.id === formData.kategori) || AD_CATEGORIES[0];

  // Set portal target node (bounded to phone container or body)
  useEffect(() => {
    setPortalNode(document.getElementById('app-phone-container') || document.body);
  }, []);

  // Close modal on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPreviewModal) {
        setShowPreviewModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPreviewModal]);

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

  const handleOpenPreview = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.materi.trim()) {
      showToast('Isi materi iklan terlebih dahulu untuk melihat preview', 'error');
      return;
    }
    setShowPreviewModal(true);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.materi.trim()) {
      showToast('Materi iklan wajib diisi', 'error');
      return;
    }
    if (formData.tipe === 'jual' && !formData.harga) {
      showToast('Harga wajib diisi untuk iklan jual', 'error');
      return;
    }
    if (formData.jangkauan === 'lokal' && !formData.lokasi.trim()) {
      showToast('Target lokasi wajib diisi', 'error');
      return;
    }
    
    setLoading(true);
    
    const adToSubmit = {
      ...formData,
      harga: formData.tipe === 'jual' && formData.harga ? Number(formData.harga) : null
    };
    
    try {
      await submitAd(adToSubmit);
      showToast('Iklan berhasil disubmit!');
      
      // Reset form
      setFormData({
        kategori: 'baris',
        materi: '',
        tipe: 'jual',
        harga: '',
        jangkauan: 'lokal',
        lokasi: '',
      });
      
      setShowPreviewModal(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast('Terjadi kesalahan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative space-y-3 pb-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-xl text-xs font-bold text-white flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        }`}>
          {toast.type === 'success' && <Check size={14} className="text-green-400" />}
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* ── SEKSI 1: FORMAT & TIPE IKLAN ── */}
        <div className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-surface-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <h4 className="text-xs font-extrabold text-surface-900">Format & Kategori Iklan</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              {activeCategory.badge}
            </span>
          </div>

          {/* Grid Kategori */}
          <div>
            <label className="block text-[11px] font-semibold text-surface-600 mb-2">
              Pilih Kategori Tayangan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AD_CATEGORIES.map(cat => {
                const active = formData.kategori === cat.id;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, kategori: cat.id }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      active
                        ? 'bg-emerald-50/90 border-emerald-600 ring-1 ring-emerald-600 text-emerald-950 shadow-2xs'
                        : 'bg-surface-50 hover:bg-surface-100 border-surface-200 text-surface-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-surface-500 border border-surface-200'}`}>
                        <CatIcon size={14} />
                      </div>
                      {active && <Check size={13} className="text-emerald-700" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{cat.label}</p>
                      <p className="text-[9.5px] text-surface-400 line-clamp-1 mt-0.5">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipe Iklan - Segmented Pills (Sederhana: Jual vs Beli) */}
          <div className="pt-2 border-t border-surface-100">
            <label className="block text-[11px] font-semibold text-surface-600 mb-1.5">
              Tujuan Iklan
            </label>
            <div className="grid grid-cols-2 gap-2 bg-surface-100/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipe: 'jual' }))}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formData.tipe === 'jual'
                    ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-600/20'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <Tag size={13} className={formData.tipe === 'jual' ? 'text-emerald-700' : 'text-surface-400'} />
                <span>Jual</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tipe: 'beli' }))}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formData.tipe === 'beli'
                    ? 'bg-white text-blue-800 shadow-xs ring-1 ring-blue-600/20'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ShoppingBag size={13} className={formData.tipe === 'beli' ? 'text-blue-700' : 'text-surface-400'} />
                <span>Beli</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── SEKSI 2: KONTEN & PENAWARAN ── */}
        <div className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2 border-b border-surface-100 pb-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs font-extrabold text-surface-900">Materi & Harga</h4>
          </div>

          {/* Materi Iklan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-surface-700">
                Materi / Pesan Iklan <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-surface-400 font-medium">{formData.materi.length}/120</span>
            </div>
            <div className="relative">
              <textarea
                className="w-full bg-surface-50 border border-surface-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none placeholder:text-surface-400 leading-relaxed"
                rows={3}
                maxLength={120}
                placeholder={activeCategory.placeholder}
                value={formData.materi}
                onChange={e => setFormData({...formData, materi: e.target.value})}
              />
            </div>
            <p className="text-[10px] text-surface-400 mt-1">
              {activeCategory.desc}
            </p>
          </div>

          {/* Harga Penawaran (Conditional jika jual) */}
          {formData.tipe === 'jual' && (
            <div className="pt-2 border-t border-surface-100">
              <label className="block text-xs font-semibold text-surface-700 mb-1.5">
                Harga / Nominal (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-surface-500 pointer-events-none">Rp</span>
                <input
                  type="number"
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="Contoh: 150000"
                  value={formData.harga}
                  onChange={e => setFormData({...formData, harga: e.target.value})}
                />
              </div>
              {formData.harga && !isNaN(formData.harga) && (
                <p className="text-[10.5px] text-emerald-700 font-semibold mt-1">
                  Terbaca: Rp {Number(formData.harga).toLocaleString('id-ID')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── SEKSI 3: JANGKAUAN & LOKASI ── */}
        <div className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex items-center gap-2 border-b border-surface-100 pb-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-extrabold text-surface-900">Jangkauan & Lokasi Tayang</h4>
          </div>

          {/* Segmented Jangkauan */}
          <div className="grid grid-cols-2 gap-2 bg-surface-100/70 p-1 rounded-xl">
            <button
              type="button"
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.jangkauan === 'lokal' ? 'bg-white shadow-xs text-brand ring-1 ring-emerald-600/20' : 'text-surface-500 hover:text-surface-800'
              }`}
              onClick={() => setFormData({...formData, jangkauan: 'lokal'})}
            >
              <MapPin size={13} className={formData.jangkauan === 'lokal' ? 'text-brand' : 'text-surface-400'} />
              <span>Lokal (Desa/Kota)</span>
            </button>
            <button
              type="button"
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                formData.jangkauan === 'nasional' ? 'bg-white shadow-xs text-brand ring-1 ring-emerald-600/20' : 'text-surface-500 hover:text-surface-800'
              }`}
              onClick={() => setFormData({...formData, jangkauan: 'nasional'})}
            >
              <Sparkles size={13} className={formData.jangkauan === 'nasional' ? 'text-brand' : 'text-surface-400'} />
              <span>Nasional</span>
            </button>
          </div>

          {/* Target Lokasi jika Lokal */}
          {formData.jangkauan === 'lokal' && (
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-blue-900 font-semibold flex items-center gap-1.5">
                  <MapPin size={13} className="text-blue-600" />
                  Target Wilayah Penonton <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama desa, kecamatan, atau kota..."
                  className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 min-w-0"
                  value={formData.lokasi}
                  onChange={e => setFormData({...formData, lokasi: e.target.value})}
                />
                <button 
                  type="button" 
                  onClick={handleLocationRequest}
                  disabled={locationLoading}
                  className="flex items-center gap-1.5 bg-white border border-blue-200 hover:bg-blue-50 active:bg-blue-100 text-blue-700 text-[11px] font-bold px-3 py-2 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {locationLoading ? (
                    <><Loader2 size={12} className="animate-spin" /> Mencari...</>
                  ) : (
                    <>📍 Deteksi GPS</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── SEKSI 4: AKSI SUBMIT & LIVE PREVIEW ── */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="flex-1 py-3 px-3 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-900 font-bold text-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye size={15} className="text-emerald-700 flex-shrink-0" />
              <span className="truncate">Live Preview</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[1.8] py-3 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-brand-sm hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1B6B3A, #217A44)' }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              <span className="truncate">{loading ? 'Memproses...' : 'Pasang Iklan Sekarang'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-surface-400 py-1">
            <Info size={12} className="text-surface-400 flex-shrink-0" />
            <span>Iklan ditinjau 1×24 jam oleh tim GV Media sebelum tayang</span>
          </div>
        </div>
      </form>

      {/* ── BOTTOM SHEET LIVE PREVIEW (PORTAL KE PHONE FRAME) ── */}
      {showPreviewModal && portalNode && createPortal(
        <div 
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreviewModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-sheet-title"
        >
          {/* Bottom Sheet Container (Terkunci dalam Phone Frame & Viewport) */}
          <div 
            className="w-full bg-white rounded-t-[28px] shadow-2xl border-t border-surface-200 flex flex-col max-h-[85%] md:max-h-[88%] animate-in slide-in-from-bottom duration-300 overflow-hidden"
          >
            {/* Drag Handle Indicator */}
            <div className="pt-2.5 pb-1 flex justify-center flex-shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-surface-300" />
            </div>

            {/* Sheet Header: Sesuai instruksi, badge kategori dihapus dari baris title */}
            <div className="px-4 py-2.5 border-b border-surface-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center gap-2 min-w-0">
                <h3 id="preview-sheet-title" className="text-sm font-extrabold text-surface-900 tracking-tight">
                  Preview Iklan
                </h3>
                <span className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Live Preview
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 active:bg-surface-300 text-surface-600 flex items-center justify-center transition cursor-pointer flex-shrink-0"
                aria-label="Tutup preview"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sheet Scrollable Content (Internal scroll agar tidak keluar viewport) */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5 max-w-full">
              
              {/* Konteks Kategori Iklan (Diposisikan di atas simulasi) */}
              <div className="flex items-center justify-between gap-2 pb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-semibold text-surface-500 flex-shrink-0">Kategori:</span>
                  <span className="text-[10.5px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md truncate">
                    {activeCategory.label} • {activeCategory.badge}
                  </span>
                </div>
                <span className="text-[10px] text-surface-400 font-medium flex-shrink-0">Simulasi GV Media</span>
              </div>

              {/* ── SIMULASI PREVIEW SESUAI KATEGORI ── */}

              {/* 1. KATEGORI: IKLAN BARIS (Live Ticker) */}
              {formData.kategori === 'baris' && (
                <div className="w-full bg-[#111827] text-white rounded-xl overflow-hidden shadow-sm border border-slate-800">
                  <div className="px-3 py-2 flex items-center gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold text-white tracking-widest px-1.5 py-0.5 rounded-sm ${formData.tipe === 'jual' ? 'bg-[#1B6B3A]' : 'bg-blue-600'} uppercase`}>
                        {formData.tipe === 'jual' ? 'Jual' : 'Cari'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0 overflow-hidden relative flex items-center h-5 marquee-container cursor-default">
                      <p className="text-[11px] font-medium text-white/90 whitespace-nowrap inline-block marquee-text w-max">
                        {formData.materi || 'Materi iklan baris Anda'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      {formData.tipe === 'jual' && formData.harga && (
                        <span className="text-[11px] font-extrabold text-white whitespace-nowrap">
                          Rp{(Number(formData.harga) / 1000).toLocaleString('id-ID')}k
                        </span>
                      )}
                      <button 
                        type="button"
                        onClick={() => showToast('Simulasi: Penonton diarahkan ke kontak iklan Anda')}
                        className="flex-shrink-0 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Hubungi GV</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>

                  <div className="h-[2px] bg-white/10 w-full relative">
                    <div className="h-full bg-emerald-500" style={{ width: '100%', animation: 'progress 8s linear infinite', transformOrigin: 'left' }} />
                  </div>
                </div>
              )}

              {/* 2. KATEGORI: IKLAN BANNER (Display Banner Card) */}
              {formData.kategori === 'banner' && (
                <div 
                  className="w-full text-white rounded-2xl p-4 shadow-md border border-emerald-700/60 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
                        <Megaphone size={20} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9.5px] font-extrabold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60 inline-block mb-1">
                          BANNER GV MEDIA • {formData.jangkauan === 'lokal' ? (formData.lokasi || 'Lokal') : 'Nasional'}
                        </span>
                        <p className="text-[13px] font-bold text-white leading-snug line-clamp-2">
                          {formData.materi || 'Headline banner promosi Anda'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                    {formData.tipe === 'jual' && formData.harga ? (
                      <div>
                        <span className="text-[10px] text-white/70 block">Mulai dari</span>
                        <span className="text-sm font-extrabold text-amber-300">
                          Rp {Number(formData.harga).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-white/80 font-medium">Tersedia untuk semua pemirsa</span>
                    )}

                    <button 
                      type="button"
                      onClick={() => showToast('Simulasi: Penonton membuka tautan banner promosi')}
                      className="bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <span>Lihat Promo</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. KATEGORI: IKLAN PRODUK (ESTO Spotlight Card) */}
              {formData.kategori === 'produk' && (
                <div className="w-full bg-white rounded-2xl p-3.5 border border-surface-200 shadow-sm flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
                    <ShoppingBag size={24} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9.5px] font-bold text-orange-700 bg-orange-100/80 px-1.5 py-0.5 rounded">
                        ESTO SPOTLIGHT
                      </span>
                      <span className="text-[10px] text-surface-400 truncate">
                        {formData.jangkauan === 'lokal' ? (formData.lokasi || 'Lokal') : 'Nasional'}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-surface-900 line-clamp-1 leading-snug">
                      {formData.materi || 'Nama Produk Unggulan Desa'}
                    </h5>

                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-xs font-black text-brand">
                        {formData.harga ? `Rp ${Number(formData.harga).toLocaleString('id-ID')}` : 'Rp -'}
                      </span>
                      <button
                        type="button"
                        onClick={() => showToast('Simulasi: Pembeli dialihkan ke checkout ESTO')}
                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-[10.5px] px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        <span>Beli di ESTO</span>
                        <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. KATEGORI: IKLAN VIDEO (In-Stream Video Ad Frame) */}
              {formData.kategori === 'video' && (
                <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-3.5 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-md">
                  {/* Top Bar Video Ad */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-extrabold bg-red-600/90 text-white px-2 py-0.5 rounded flex items-center gap-1">
                      <Clapperboard size={10} />
                      IKLAN VIDEO • 0:15
                    </span>
                    <span className="text-[10px] font-medium bg-black/60 backdrop-blur-xs text-white/80 px-2 py-0.5 rounded border border-white/10">
                      Lewati dalam 5 dtk
                    </span>
                  </div>

                  {/* Center Play Graphic */}
                  <div className="flex flex-col items-center justify-center text-center my-auto z-10">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white mb-2 shadow-lg">
                      <Play size={18} className="fill-white translate-x-0.5" />
                    </div>
                    <p className="text-xs font-bold text-white line-clamp-1 px-4 drop-shadow">
                      {formData.materi || 'Judul Video Promosi Siaran'}
                    </p>
                  </div>

                  {/* Bottom Video Banner */}
                  <div className="bg-black/75 backdrop-blur-md -mx-3.5 -mb-3.5 p-2.5 border-t border-white/10 flex items-center justify-between z-10">
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="text-[10px] text-white/70 block truncate">Kunjungi kanal pengiklan</span>
                      <span className="text-[11px] font-bold text-white truncate block">
                        {formData.jangkauan === 'lokal' ? (formData.lokasi || 'Desa Mitra') : 'Mitra GV Nasional'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Simulasi: Pemirsa membuka channel video iklan Anda')}
                      className="bg-brand text-white hover:opacity-90 active:scale-95 text-[10.5px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer flex-shrink-0"
                    >
                      <span>Tonton Info</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              )}

              {/* 5. KATEGORI: IKLAN PROMO (Voucher Deal Card) */}
              {formData.kategori === 'promo' && (
                <div className="w-full bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-200" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-100">
                        PROMO SPESIAL GV MEDIA
                      </span>
                    </div>
                    <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/25">
                      KUOTA TERBATAS
                    </span>
                  </div>

                  <h4 className="text-sm font-black leading-snug line-clamp-2 text-white">
                    {formData.materi || 'Klaim diskon khusus belanja sembako dan produk desa!'}
                  </h4>

                  <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-white/80 block">Nominal Promo</span>
                      <span className="text-sm font-black text-amber-200">
                        {formData.harga ? `Hemat Rp ${Number(formData.harga).toLocaleString('id-ID')}` : 'Cashback Spesial'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Simulasi: Kode voucher berhasil disalin oleh penonton')}
                      className="bg-white text-orange-700 hover:bg-orange-50 active:scale-95 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <Tag size={12} />
                      <span>Klaim Promo</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── RINCIAN DATA IKLAN (Anti-Overflow & Responsive) ── */}
              <div className="bg-surface-50 rounded-2xl p-3.5 border border-surface-200/80 space-y-2.5 text-xs overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-surface-200/60">
                  <span className="text-xs font-bold text-surface-900">Rincian Data Iklan</span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {activeCategory.label}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-3 min-w-0 pb-2 border-b border-surface-200/50">
                    <span className="text-surface-500 flex-shrink-0 font-medium">Materi:</span>
                    <p className="font-semibold text-surface-800 text-right text-xs leading-snug break-words overflow-hidden min-w-0 flex-1 line-clamp-3">
                      {formData.materi || '-'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <span className="text-surface-500 font-medium">Tipe Iklan:</span>
                    <span className={`font-bold uppercase tracking-wider text-[11px] ${formData.tipe === 'jual' ? 'text-[#1B6B3A]' : 'text-blue-600'}`}>
                      {formData.tipe === 'jual' ? 'Jual' : 'Beli'}
                    </span>
                  </div>

                  {formData.tipe === 'jual' && formData.harga && (
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      <span className="text-surface-500 font-medium">Harga / Nominal:</span>
                      <span className="font-extrabold text-surface-900">
                        Rp {Number(formData.harga).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <span className="text-surface-500 font-medium">Jangkauan & Lokasi:</span>
                    <span className="font-medium text-surface-700 flex items-center gap-1 min-w-0 truncate">
                      <MapPin size={11} className="text-surface-400 flex-shrink-0" />
                      <span className="truncate">{formData.jangkauan === 'lokal' ? (formData.lokasi || 'Lokal') : 'Nasional'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Card Peninjauan */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
                <Info size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11.5px] text-amber-900 leading-relaxed">
                  Iklan kategori <strong>{activeCategory.label}</strong> akan ditinjau tim GV (1×24 jam) sebelum aktif tayang di <strong>GV Media</strong>.
                </p>
              </div>

            </div>

            {/* Sticky Bottom Sheet Footer (Selalu Terlihat & Mudah Diklik) */}
            <div className="p-3 border-t border-surface-100 bg-surface-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-surface-200 hover:bg-surface-300 active:bg-surface-400 text-surface-800 font-bold text-xs sm:text-sm transition cursor-pointer text-center"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>,
        portalNode
      )}
    </div>
  );
}
