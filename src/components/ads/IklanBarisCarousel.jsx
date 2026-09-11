import React from 'react';
import { useAds } from './AdsContext';
import { MessageCircle, Tag, ShoppingBag, Search, Wrench, Briefcase, ChevronRight } from 'lucide-react';

const SUBKATEGORI_CONFIG = {
  jual: {
    label: 'Jual',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    gradient: 'from-emerald-700 to-green-900',
    icon: Tag,
  },
  beli: {
    label: 'Beli',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    gradient: 'from-blue-700 to-indigo-900',
    icon: ShoppingBag,
  },
  cari: {
    label: 'Cari',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    gradient: 'from-amber-600 to-orange-800',
    icon: Search,
  },
  jasa: {
    label: 'Jasa',
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    gradient: 'from-purple-700 to-indigo-950',
    icon: Wrench,
  },
  lowongan: {
    label: 'Lowongan',
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    gradient: 'from-teal-700 to-cyan-950',
    icon: Briefcase,
  },
};

export default function IklanBarisCarousel({ onAdClick }) {
  const { ads } = useAds();

  // Filter only Iklan Baris with status 'tayang'
  const activeAds = ads.filter(
    (ad) => ad.kategori === 'baris' && ad.status === 'tayang'
  );

  if (activeAds.length === 0) return null;

  const handleHubungi = (e, ad) => {
    e.stopPropagation();
    const rawNumber = ad.whatsapp || '081234567890';
    const cleanNumber = rawNumber.replace(/\D/g, '').replace(/^0/, '62');
    const title = ad.judul || ad.materi || 'iklan';
    const text = encodeURIComponent(
      `Halo, saya tertarik dengan iklan baris "${title}" di GV Media. Apakah masih tersedia?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="w-full select-none py-1.5">
      {/* Horizontal Swipeable Container (Tanpa judul section) */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar px-4 snap-x scroll-smooth">
        {activeAds.map((ad) => {
          const subKey = (ad.subKategori || ad.tipe || 'jual').toLowerCase();
          const config = SUBKATEGORI_CONFIG[subKey] || SUBKATEGORI_CONFIG.jual;
          const SubIcon = config.icon;
          const hasPhoto = Array.isArray(ad.photos) && ad.photos.length > 0;
          const displayTitle = ad.judul || ad.materi;
          const displayPrice =
            ad.hargaLabel ||
            (ad.harga ? `Rp ${Number(ad.harga).toLocaleString('id-ID')}` : 'Nego');

          return (
            <div
              key={ad.id}
              onClick={() => onAdClick?.(ad)}
              className="w-[265px] sm:w-[285px] h-[86px] shrink-0 bg-white border border-gray-200/90 rounded-2xl p-2.5 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2.5 snap-start relative overflow-hidden cursor-pointer active:scale-[0.99]"
            >
              {/* Sisi Kiri: Teks & Aksi */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                {/* Baris 1: Kategori badge + Harga */}
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border leading-none ${config.badge}`}
                  >
                    {config.label}
                  </span>
                  <span className="text-[11px] font-black text-emerald-800 truncate leading-none">
                    {displayPrice}
                  </span>
                </div>

                {/* Baris 2: Judul Iklan */}
                <h4 className="text-xs font-extrabold text-gray-900 line-clamp-1 leading-snug tracking-tight">
                  {displayTitle}
                </h4>

                {/* Baris 3: Tombol Hubungi WhatsApp */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleHubungi(e, ad)}
                    className="text-[10px] font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs transition-transform cursor-pointer"
                    title="Hubungi via WhatsApp"
                  >
                    <MessageCircle size={10} className="text-white" />
                    <span>Hubungi</span>
                  </button>
                  {ad.lokasi && (
                    <span className="text-[9.5px] text-gray-400 font-medium truncate max-w-[110px]">
                      {ad.lokasi}
                    </span>
                  )}
                </div>
              </div>

              {/* Sisi Kanan: Foto Thumbnail atau Themed Colored Background */}
              <div className="w-[66px] h-[66px] rounded-xl overflow-hidden shrink-0 border border-black/5 bg-gray-100 flex items-center justify-center relative shadow-inner">
                {hasPhoto ? (
                  <img
                    src={ad.photos[0]}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center text-white relative`}
                  >
                    <SubIcon size={20} className="text-white/85" />
                    <span className="text-[8.5px] font-bold text-white/80 mt-0.5 tracking-wider uppercase">
                      {config.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
