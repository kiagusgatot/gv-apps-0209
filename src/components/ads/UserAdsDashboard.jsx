import React, { useState, useMemo } from 'react';
import { 
  Eye, Clock, CheckCircle2, CheckCircle, CreditCard, MapPin, 
  AlertTriangle, CalendarX, RotateCcw, Calendar, AlignLeft, 
  ShoppingBag, Clapperboard, Sparkles, Tag, Check, 
  MousePointerClick, ChevronRight, Info, AlertCircle, Wallet, Ban, MessageCircle
} from 'lucide-react';
import { useAds } from './AdsContext';

// Helper Kategori Iklan (Banner dihapus sesuai POIN 4)
const CATEGORY_MAP = {
  baris: { label: 'Iklan Baris', icon: AlignLeft },
  produk: { label: 'ESTO Produk', icon: ShoppingBag },
  video: { label: 'Iklan Video', icon: Clapperboard },
  promo: { label: 'Iklan Promo', icon: Sparkles },
};

export default function UserAdsDashboard({ onEditAd }) {
  const { ads, payAd, updateAndRetryAd, simulateCommitteeDecision } = useAds();
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sorting Logic: Needs action first, then review, scheduled/tayang, then archived
  const sortedAds = useMemo(() => {
    const priority = {
      'pembayaran': 0,
      'ditolak': 1,
      'review': 2,
      'terjadwal': 3,
      'tayang': 4,
      'selesai': 5,
      'kedaluwarsa': 6,
    };
    
    return [...ads].sort((a, b) => {
      const pA = priority[a.status] ?? 99;
      const pB = priority[b.status] ?? 99;
      if (pA !== pB) return pA - pB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [ads]);

  // Filtering Logic
  const filteredAds = useMemo(() => {
    if (filterStatus === 'all') return sortedAds;
    if (filterStatus === 'tayang') return sortedAds.filter(a => a.status === 'tayang' || a.status === 'terjadwal');
    if (filterStatus === 'tindakan') return sortedAds.filter(a => a.status === 'pembayaran' || a.status === 'ditolak');
    if (filterStatus === 'review') return sortedAds.filter(a => a.status === 'review');
    if (filterStatus === 'selesai') return sortedAds.filter(a => a.status === 'selesai' || a.status === 'kedaluwarsa');
    return sortedAds;
  }, [sortedAds, filterStatus]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: ads.length,
      tayang: ads.filter(a => a.status === 'tayang' || a.status === 'terjadwal').length,
      tindakan: ads.filter(a => a.status === 'pembayaran' || a.status === 'ditolak').length,
      review: ads.filter(a => a.status === 'review').length,
      selesai: ads.filter(a => a.status === 'selesai' || a.status === 'kedaluwarsa').length,
    };
  }, [ads]);

  const handlePay = async (id) => {
    setActionLoading(id);
    try {
      await payAd(id);
      showToast('Pembayaran berhasil! Iklan telah dijadwalkan tayang mulai pukul 00:00 WIB.');
    } catch (err) {
      showToast('Gagal memproses pembayaran', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pembayaran':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <CreditCard size={12} className="text-blue-600" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
      case 'review':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
            <Clock size={12} className="text-amber-600" />
            <span>Dalam Review Komite</span>
          </span>
        );
      case 'terjadwal':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs">
            <Calendar size={12} className="text-teal-600" />
            <span>Terjadwal Tayang</span>
          </span>
        );
      case 'tayang':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Sedang Tayang</span>
          </span>
        );
      case 'ditolak':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 shadow-2xs">
            <AlertTriangle size={12} className="text-rose-600" />
            <span>Ditolak</span>
          </span>
        );
      case 'selesai':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">
            <CheckCircle size={12} className="text-slate-500" />
            <span>Selesai</span>
          </span>
        );
      case 'kedaluwarsa':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200/80 shadow-2xs">
            <CalendarX size={12} className="text-stone-500" />
            <span>Kedaluwarsa</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-3 pb-8">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full shadow-xl text-xs font-bold text-white flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-top-2 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        }`}>
          {toast.type === 'success' && <Check size={14} className="text-green-400" />}
          {toast.msg}
        </div>
      )}

      {/* Dashboard Header Banner */}
      <div className="bg-white rounded-2xl p-4 border border-surface-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-surface-900 tracking-tight">Daftar Iklan Saya</h3>
            <p className="text-[11px] text-surface-500 mt-0.5 leading-tight">
              Pantau siklus iklan, review komite, batas pembayaran, dan jadwal penayangan
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full flex-shrink-0">
            {ads.length} Total
          </span>
        </div>

        {/* Filter Tabs Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-surface-100">
          {[
            { id: 'all', label: 'Semua', count: counts.all },
            { id: 'tindakan', label: 'Perlu Tindakan', count: counts.tindakan },
            { id: 'review', label: 'Review', count: counts.review },
            { id: 'tayang', label: 'Tayang & Jadwal', count: counts.tayang },
            { id: 'selesai', label: 'Selesai', count: counts.selesai },
          ].map(tab => {
            const active = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  active
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-surface-100/90 text-surface-600 hover:bg-surface-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ads List */}
      <div className="space-y-3">
        {filteredAds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-surface-50 flex items-center justify-center mx-auto mb-2 text-surface-400">
              <Eye size={20} />
            </div>
            <p className="text-xs font-bold text-surface-700">Tidak ada iklan pada kategori ini</p>
            <p className="text-[11px] text-surface-400 mt-0.5">
              Iklan yang sesuai dengan filter akan muncul di sini.
            </p>
          </div>
        ) : (
          filteredAds.map(ad => {
            const categoryInfo = CATEGORY_MAP[ad.kategori] || CATEGORY_MAP.baris;
            const CategoryIcon = categoryInfo.icon;
            const revisionExceeded = (ad.revisionCount || 0) >= 1;

            return (
              <div 
                key={ad.id} 
                className="bg-white rounded-2xl border border-surface-200 p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3 relative overflow-hidden"
              >
                {/* ── BARIS 1: KATEGORI, TIPE, & STATUS BADGE ── */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    {/* Kategori Badge */}
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-surface-700 bg-surface-100 px-2 py-0.5 rounded-md">
                      <CategoryIcon size={11} className="text-surface-500" />
                      <span>{categoryInfo.label}</span>
                    </span>

                    {/* Subkategori / Tipe Badge */}
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      (ad.subKategori || ad.tipe) === 'Jual' || ad.tipe === 'jual'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' 
                        : (ad.subKategori || ad.tipe) === 'Beli' || ad.tipe === 'beli'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                        : (ad.subKategori === 'Jasa')
                        ? 'bg-purple-50 text-purple-800 border border-purple-200/60'
                        : (ad.subKategori === 'Lowongan')
                        ? 'bg-teal-50 text-teal-800 border border-teal-200/60'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                    }`}>
                      {ad.subKategori || (ad.tipe === 'jual' ? 'Jual' : 'Beli')}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {getStatusBadge(ad.status)}
                  </div>
                </div>

                {/* ── BARIS 2: JUDUL / MATERI IKLAN + THUMBNAIL ── */}
                <div className="flex items-start gap-3">
                  {Array.isArray(ad.photos) && ad.photos.length > 0 ? (
                    <img 
                      src={ad.photos[0]} 
                      alt={ad.judul || ad.materi} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-surface-200" 
                    />
                  ) : ad.kategori === 'video' ? (
                    <div className="w-12 h-12 rounded-xl bg-surface-900 text-emerald-400 flex flex-col items-center justify-center shrink-0 border border-surface-700 shadow-2xs">
                      <Clapperboard size={18} />
                      <span className="text-[8px] font-black text-white/80 mt-0.5">15s</span>
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-surface-900 leading-snug break-words line-clamp-2">
                      {ad.judul || ad.materi}
                    </h4>
                    {ad.deskripsi && (
                      <p className="text-[11px] text-surface-500 line-clamp-1 mt-0.5">
                        {ad.deskripsi}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── BARIS 3: HARGA, LOKASI & WHATSAPP ── */}
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-surface-500 pt-0.5">
                  {(ad.hargaLabel || ad.harga) && (
                    <span className="text-xs sm:text-[13px] font-extrabold text-emerald-800 tracking-tight">
                      {ad.hargaLabel || `Rp ${Number(ad.harga).toLocaleString('id-ID')}`}
                    </span>
                  )}

                  <span className="flex items-center gap-1 min-w-0 text-[11px] text-surface-500 truncate">
                    <MapPin size={11} className="text-surface-400 flex-shrink-0" />
                    <span className="truncate">{ad.jangkauan === 'lokal' ? (ad.lokasi || 'Lokal') : 'Nasional'}</span>
                  </span>

                  {ad.whatsapp && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                      <MessageCircle size={11} className="text-emerald-600 flex-shrink-0" />
                      <span>{ad.whatsapp}</span>
                    </span>
                  )}

                  {ad.createdAt && (
                    <span className="flex items-center gap-1 text-[11px] text-surface-400 ml-auto flex-shrink-0">
                      <Calendar size={11} />
                      <span>{formatDate(ad.createdAt)}</span>
                    </span>
                  )}
                </div>

                {/* ── JADWAL & BIAYA TAYANG INFO ── */}
                {ad.schedule && (
                  <div className="bg-surface-50 border border-surface-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Calendar size={13} className="text-emerald-700 flex-shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="font-bold text-surface-800 text-[11.5px] block truncate">
                          {ad.schedule.type === 'sprint' ? (
                            `Sprint ${ad.schedule.totalDays} Hari: ${ad.schedule.startDate} - ${ad.schedule.endDate}`
                          ) : (
                            `Kustom ${ad.schedule.totalDays} Hari: ${ad.schedule.dates?.slice(0, 3).join(', ')}${ad.schedule.dates?.length > 3 ? ` +${ad.schedule.dates.length - 3}` : ''}`
                          )}
                        </span>
                        <span className="text-[10px] text-surface-500">
                          Tayang 24 jam / hari (Rp 8.500/hari)
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10.5px] font-extrabold text-emerald-900 bg-emerald-100/70 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                        Rp {(ad.schedule.totalCost || (ad.schedule.totalDays * 8500)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {/* ── BARIS 4: KONTEN / ACTION SESUAI STATUS SPESIFIK ── */}

                {/* STATUS: MENUNGGU PEMBAYARAN (STEP 6) */}
                {ad.status === 'pembayaran' && (
                  <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[12px] font-black text-blue-950 block">
                          Menunggu Pembayaran Biaya Tayang
                        </span>
                        <span className="text-[11px] text-blue-800 mt-0.5 block leading-tight">
                          Batas pembayaran: <strong className="text-rose-700 font-extrabold">{ad.batasPembayaran || 'Sebelum H-1 pukul 23:59 WIB'}</strong>
                        </span>
                        <p className="text-[10.5px] text-blue-700/80 mt-1">
                          Iklan mulai tayang pukul 00:00 WIB setelah transaksi berhasil.
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Tagihan</span>
                        <span className="text-sm font-black text-blue-950">
                          Rp {(ad.schedule?.totalCost || ad.tagihan || 25500).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handlePay(ad.id)}
                      disabled={actionLoading === ad.id}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-50"
                    >
                      <CreditCard size={14} />
                      <span>{actionLoading === ad.id ? 'Memproses GV Pay...' : 'Bayar Sekarang (GV Pay)'}</span>
                    </button>
                  </div>
                )}

                {/* STATUS: DALAM REVIEW (STEP 5) */}
                {ad.status === 'review' && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 space-y-2.5 text-xs text-amber-900">
                    <div className="flex items-start gap-2.5">
                      <Clock size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 leading-relaxed">
                        <p className="font-bold text-amber-950 text-[11.5px]">Sedang Ditinjau oleh Tim Komite GV</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          {ad.reviewNote || 'Iklan sedang diverifikasi secara manual oleh tim kurasi GV Media. Estimasi proses verifikasi 1×24 jam.'}
                        </p>
                        <p className="text-[10px] text-amber-700/80 mt-1">
                          Notifikasi persetujuan atau perbaikan akan dikirim otomatis ke akun Anda.
                        </p>
                      </div>
                    </div>

                    {/* Prototype Demo Controls for Committee Decision */}
                    <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold text-amber-800">
                        Simulasi Komite (Demo):
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            simulateCommitteeDecision(ad.id, 'approved');
                            showToast('Iklan disetujui komite! Menunggu pembayaran.');
                          }}
                          className="px-2.5 py-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 rounded-lg border border-emerald-300 transition cursor-pointer"
                        >
                          Loloskan Komite
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            simulateCommitteeDecision(ad.id, 'rejected');
                            showToast('Iklan ditolak komite.', 'error');
                          }}
                          className="px-2.5 py-1 text-[10.5px] font-bold text-rose-800 bg-rose-100/90 hover:bg-rose-200 rounded-lg border border-rose-300 transition cursor-pointer"
                        >
                          Tolak Komite
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STATUS: TERJADWAL TAYANG */}
                {ad.status === 'terjadwal' && (
                  <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-teal-900">
                    <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1 leading-relaxed">
                      <p className="font-bold text-teal-950 text-[11.5px]">Iklan Siap Ditayangkan</p>
                      <p className="text-[11px] text-teal-800 mt-0.5">
                        Pembayaran telah lunas. Iklan Anda akan otomatis aktif pada tanggal <strong>{ad.schedule?.startDate || 'jadwal'}</strong> tepat pukul 00:00 WIB.
                      </p>
                    </div>
                  </div>
                )}

                {/* STATUS: SEDANG TAYANG */}
                {ad.status === 'tayang' && (
                  <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-medium">Impresi Tayang</span>
                        <span className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                          <Eye size={13} className="text-emerald-600" />
                          {(ad.impressions || 0).toLocaleString('id-ID')} views
                        </span>
                      </div>
                      {ad.clicks && (
                        <div className="border-l border-emerald-200 pl-4">
                          <span className="text-[10px] text-emerald-700 block font-medium">Interaksi</span>
                          <span className="text-sm font-black text-emerald-950 flex items-center gap-1">
                            <MousePointerClick size={12} className="text-emerald-600" />
                            {ad.clicks} klik
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10.5px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1.5 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live di GV Media
                    </span>
                  </div>
                )}

                {/* STATUS: DITOLAK (STEP 4 FAIL / KOMITE REJECT) */}
                {ad.status === 'ditolak' && (
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-start gap-2.5 text-xs text-rose-900">
                      <AlertTriangle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-rose-950 text-[11.5px]">Iklan Belum Memenuhi Pedoman</p>
                          {revisionExceeded ? (
                            <span className="text-[10px] font-black text-white bg-rose-700 px-2 py-0.5 rounded-full">
                              Terkunci Permanen
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-full">
                              Sisa Revisi: 1x
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-rose-800 mt-1 leading-relaxed">
                          {ad.alasanPenolakan || 'Materi atau format iklan belum memenuhi pedoman komunitas penyiaran GV Media.'}
                        </p>
                      </div>
                    </div>

                    {revisionExceeded ? (
                      /* Kunci Permanen: Tidak bisa diajukan kembali */
                      <div className="bg-rose-100/70 border border-rose-200/90 rounded-xl p-2.5 flex items-center gap-2 text-rose-900 text-xs">
                        <Ban size={14} className="text-rose-700 flex-shrink-0" />
                        <span className="font-bold text-[11px]">
                          Iklan tidak dapat diajukan kembali (Batas maksimal 1x revisi telah habis).
                        </span>
                      </div>
                    ) : (
                      /* Sisa 1x revisi: Tombol Edit & Ajukan Ulang */
                      <button
                        type="button"
                        onClick={() => {
                          if (onEditAd) {
                            onEditAd(ad);
                          } else {
                            showToast('Buka tab Buat Iklan untuk merevisi data');
                          }
                        }}
                        className="w-full bg-white border border-rose-300 hover:bg-rose-50 active:bg-rose-100 text-rose-800 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
                      >
                        <RotateCcw size={13} />
                        <span>Edit & Ajukan Ulang (1x Kesempatan)</span>
                      </button>
                    )}
                  </div>
                )}

                {/* STATUS: SELESAI */}
                {ad.status === 'selesai' && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-slate-500 flex-shrink-0" />
                      <span className="text-[11px] text-slate-600">
                        Tayang: <strong className="text-slate-800">{ad.periode || 'Selesai'}</strong>
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 flex-shrink-0">
                      {(ad.impressions || 0).toLocaleString('id-ID')} penonton tercapai
                    </span>
                  </div>
                )}

                {/* STATUS: KEDALUWARSA */}
                {ad.status === 'kedaluwarsa' && (
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <CalendarX size={14} className="text-stone-400 flex-shrink-0" />
                      <span className="text-[11px] text-stone-600">
                        Periode berakhir: <strong className="text-stone-700">{ad.periode || 'Masa aktif habis'}</strong>
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-stone-800 flex-shrink-0">
                      {(ad.impressions || 0).toLocaleString('id-ID')} total views
                    </span>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

