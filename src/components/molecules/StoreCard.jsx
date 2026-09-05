import React from 'react'
import { Star, MapPin, ChevronRight, Store, ShieldCheck } from 'lucide-react'

/**
 * StoreCard Molecule (Model Card Toko Pilihan Redesign)
 * Tampilan baru yang lebih sederhana, rapi, dan fokus pada informasi toko.
 * Menampilkan nama toko, logo, badge resmi, kategori produk, rating,
 * jumlah produk/terjual, lokasi, jarak, dan tombol "Kunjungi".
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
      className="bg-white rounded-2xl p-3.5 border border-gray-100/90 shadow-2xs hover:shadow-md active:scale-[0.99] transition-all cursor-pointer group select-none"
    >
      <div className="flex items-center gap-3">
        {/* Store Logo Monogram Squircle */}
        <div
          className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 text-white font-black text-[15px] shadow-2xs group-hover:scale-105 transition-transform"
          style={{
            background: store.logoBg || 'linear-gradient(135deg, #1B6B3A, #2E7D32)',
          }}
        >
          {store.logoText ? (
            <span>{store.logoText}</span>
          ) : (
            <Store size={22} className="text-white drop-shadow-xs" />
          )}
        </div>

        {/* Store Information */}
        <div className="flex-1 min-w-0">
          {/* Store Name + Official Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-[14px] font-extrabold text-gray-900 group-hover:text-[#1B6B3A] transition truncate leading-tight">
              {store.name}
            </h3>
            {store.type && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/60">
                <ShieldCheck size={10} className="text-emerald-700" />
                <span>{store.type}</span>
              </span>
            )}
          </div>

          {/* Store Category / Specialization */}
          <p className="text-[11.5px] text-gray-500 font-medium truncate mt-0.5">
            {store.category || 'Kios Bahan Pokok & Sembako Desa'}
          </p>

          {/* Rating, Sales/Products, & Location */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 flex-wrap">
            <span className="flex items-center gap-0.5 font-bold text-gray-800 flex-shrink-0">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {store.rating || '4.8'}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500 font-medium flex-shrink-0">
              {store.soldCount || `${store.products?.length || 0} produk`}
            </span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-0.5 text-gray-500 truncate min-w-0">
              <MapPin size={10} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{store.address || store.region}</span>
            </span>
            {store.distance && (
              <>
                <span className="text-gray-300">·</span>
                <span className="font-semibold text-gray-600 flex-shrink-0">
                  {store.distance}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action: "Kunjungi" button */}
        <div className="flex items-center flex-shrink-0 pl-1">
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 group-hover:bg-[#1B6B3A] group-hover:text-white text-[11.5px] font-extrabold border border-emerald-200/80 group-hover:border-[#1B6B3A] flex items-center gap-1 transition-all shadow-2xs"
          >
            <span>Kunjungi</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

