import React from 'react'
import { Star, MapPin, ChevronRight, Store, ShieldCheck } from 'lucide-react'

/**
 * StoreCard Molecule (Model Card Toko Pilihan Redesign)
 * Tampilan baru yang lebih elegan, berdimensi (tidak flat), dan fokus pada informasi toko.
 * Menampilkan nama toko, squircle logo embossed, badge resmi, spesialisasi, rating,
 * jumlah terjual, jarak & lokasi terstruktur, dan tombol "Kunjungi" yang konsisten.
 */
export default function StoreCard({
  store,
  onSelectStore,
  onOpenStore,
  onSelectProduct,
  onOpenProduct,
}) {
  if (!store) return null

  const handleOpenStore = onSelectStore || onOpenStore

  // Format compact location label so it never wraps awkwardly
  const locationLabel = store.region && store.address
    ? (store.address.includes(',') ? store.address.split(',')[1].trim() : store.address)
    : (store.address || store.region || 'Toko Mitra')

  return (
    <div
      onClick={() => handleOpenStore?.(store)}
      className="relative bg-white rounded-2xl p-3.5 border border-gray-200/90 shadow-[0_4px_16px_-2px_rgba(27,107,58,0.07),0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(27,107,58,0.12),0_4px_8px_rgba(0,0,0,0.04)] hover:border-emerald-300/80 active:scale-[0.99] transition-all duration-200 cursor-pointer group select-none"
    >
      <div className="flex items-center gap-3">
        {/* Store Logo Monogram Squircle with Depth & Inner Glow */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-[14.5px] tracking-wide shadow-md group-hover:scale-105 transition-transform duration-200 relative overflow-hidden"
          style={{
            background: store.logoBg || 'linear-gradient(135deg, #1B6B3A 0%, #2E7D32 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
          }}
        >
          {/* Ambient logo shine */}
          <div
            className="absolute -top-3 -end-3 w-8 h-8 rounded-full pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
          />
          {store.logoText ? (
            <span className="drop-shadow-xs">{store.logoText}</span>
          ) : (
            <Store size={22} className="text-white drop-shadow-xs" />
          )}
        </div>

        {/* Store Information */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Store Name & Official Shield Badge */}
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-[14px] font-extrabold text-gray-900 group-hover:text-[#1B6B3A] transition truncate leading-tight">
              {store.name}
            </h4>
            {store.type && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 flex-shrink-0">
                <ShieldCheck size={10.5} className="text-emerald-700" />
                <span>{store.type}</span>
              </span>
            )}
          </div>

          {/* Row 2: Store Category / Specialization */}
          <p className="text-[11.5px] text-gray-500 font-medium truncate mt-0.5">
            {store.category || 'Kios Bahan Pokok & Sembako Desa'}
          </p>

          {/* Row 3: Rating, Sales, Distance & Location */}
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500 min-w-0">
            <span className="inline-flex items-center gap-0.5 font-bold text-gray-800 flex-shrink-0">
              <Star size={11.5} className="fill-amber-400 text-amber-400" />
              {store.rating || '4.8'}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 font-medium flex-shrink-0">
              {store.soldCount || `${store.products?.length || 0} produk`}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-gray-500 min-w-0 truncate">
              <MapPin size={10.5} className="text-emerald-700 flex-shrink-0" />
              {store.distance && (
                <span className="font-semibold text-gray-700 flex-shrink-0">
                  {store.distance}
                </span>
              )}
              {store.distance && locationLabel && <span className="text-gray-300">·</span>}
              <span className="truncate">{locationLabel}</span>
            </span>
          </div>
        </div>

        {/* Action: "Kunjungi" button with solid high-contrast emerald styling */}
        <div className="flex items-center flex-shrink-0 pl-0.5">
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white group-hover:bg-[#1B6B3A] text-[11.5px] font-extrabold flex items-center gap-1 shadow-xs transition-all duration-150 active:scale-95"
            style={{
              boxShadow: '0 2px 6px rgba(27, 107, 58, 0.22)',
            }}
          >
            <span>Kunjungi</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

