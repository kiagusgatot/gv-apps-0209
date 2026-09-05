import React from 'react'
import { Star, MapPin, ChevronRight, Store, ShieldCheck, Zap } from 'lucide-react'

/**
 * StoreCard Molecule (Model Card Toko Pilihan Redesign)
 * Tampilan baru yang lebih luas, elegan, berdimensi, dan fokus pada kenyamanan membaca informasi.
 * Tombol "Kunjungi Toko" diposisikan di bagian bawah sehingga seluruh nama, kategori,
 * rating, dan lokasi toko dapat tampil lengkap tanpa terpotong.
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

  return (
    <div
      onClick={() => handleOpenStore?.(store)}
      className="relative bg-white rounded-2xl p-4 border border-gray-200/90 shadow-[0_4px_16px_-2px_rgba(27,107,58,0.07),0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(27,107,58,0.12),0_4px_8px_rgba(0,0,0,0.04)] hover:border-emerald-300/80 active:scale-[0.99] transition-all duration-200 cursor-pointer group select-none flex flex-col gap-3"
    >
      {/* Top Section: Store Identity & Info with Full Horizontal Width */}
      <div className="flex items-start gap-3.5">
        {/* Store Logo Monogram Squircle with Depth & Inner Glow */}
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-[15px] tracking-wide shadow-md group-hover:scale-105 transition-transform duration-200 relative overflow-hidden mt-0.5"
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
            <Store size={24} className="text-white drop-shadow-xs" />
          )}
        </div>

        {/* Store Information */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Store Name & Official Shield Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-[15px] font-extrabold text-gray-900 group-hover:text-[#1B6B3A] transition leading-snug">
              {store.name}
            </h4>
            {store.type && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 flex-shrink-0">
                <ShieldCheck size={11} className="text-emerald-700" />
                <span>{store.type}</span>
              </span>
            )}
          </div>

          {/* Row 2: Store Category / Specialization */}
          <p className="text-[12px] text-gray-500 font-medium mt-0.5 leading-normal">
            {store.category || 'Kios Bahan Pokok & Sembako Desa'}
          </p>

          {/* Row 3: Rating, Sales, Distance & Location */}
          <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-gray-500 flex-wrap">
            <span className="inline-flex items-center gap-0.5 font-extrabold text-gray-800 flex-shrink-0">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {store.rating || '4.8'}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600 font-medium flex-shrink-0">
              {store.soldCount || `${store.products?.length || 0} produk`}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-gray-600 font-medium">
              <MapPin size={11} className="text-emerald-700 flex-shrink-0" />
              {store.distance && (
                <span className="font-semibold text-gray-800">
                  {store.distance}
                </span>
              )}
              {store.distance && (store.address || store.region) && <span className="text-gray-300">·</span>}
              <span>{store.address || store.region}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Delivery Perk on Left + Kunjungi Toko Action Button on Right */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
          <Zap size={11.5} className="text-amber-500 fill-amber-400 flex-shrink-0" />
          <span>Siap antar kilat {store.eta || '30 mnt'}</span>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white group-hover:bg-[#1B6B3A] text-[12px] font-extrabold flex items-center gap-1.5 shadow-xs transition-all duration-150 active:scale-95 flex-shrink-0"
          style={{
            boxShadow: '0 2px 6px rgba(27, 107, 58, 0.22)',
          }}
        >
          <span>Kunjungi Toko</span>
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

