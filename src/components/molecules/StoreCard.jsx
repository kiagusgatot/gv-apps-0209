import React from 'react'
import { Star, MapPin, ChevronRight, Store, ShieldCheck, Zap } from 'lucide-react'
import { getProductImage } from '../../utils/productImages'

/**
 * StoreCard Molecule (Unified Reference Design)
 * Satu pola struktur konsisten untuk seluruh toko pilihan:
 * 1. Header: Logo kotak proporsional (56x56px) + Nama Toko + Badge Status + Kategori + Rating & Jarak
 * 2. Etalase Mini: Grid horizontal 3 produk unggulan dengan foto asli, badge diskon, nama produk, dan harga hijau tebal
 * 3. Footer: Pill pengiriman kilat di kiri & Tombol solid "Kunjungi Toko" di kanan
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
  const handleOpenProduct = onSelectProduct || onOpenProduct
  const previewProducts = (store.products || []).slice(0, 3)

  return (
    <div
      onClick={() => handleOpenStore?.(store)}
      className="w-full relative bg-white rounded-3xl p-4 border border-gray-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_26px_-4px_rgba(27,107,58,0.12)] hover:border-emerald-300/80 active:scale-[0.995] transition-all duration-200 cursor-pointer group select-none flex flex-col gap-3.5"
    >
      {/* ── 1. Top Section: Store Identity & Metadata ── */}
      <div className="flex items-start gap-3.5">
        {/* Consistent Square Logo Container (56px x 56px, aspect-square) */}
        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white border border-gray-100 shadow-2xs group-hover:border-emerald-300 transition-colors">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex'
                }
              }}
            />
          ) : null}

          {/* Fallback Monogram Box */}
          <div
            className={`w-full h-full rounded-2xl flex items-center justify-center text-white font-black text-[15px] tracking-wider shadow-xs relative overflow-hidden ${
              store.logo ? 'hidden' : 'flex'
            }`}
            style={{
              background: store.logoBg || 'linear-gradient(135deg, #1B6B3A 0%, #2E7D32 100%)',
            }}
          >
            {store.logoText ? (
              <span className="drop-shadow-xs">{store.logoText}</span>
            ) : (
              <Store size={22} className="text-white drop-shadow-xs" />
            )}
          </div>
        </div>

        {/* Store Information */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Store Name & Official Shield Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[15px] font-extrabold text-gray-900 group-hover:text-[#1B6B3A] transition leading-snug">
              {store.name}
            </h4>
            {store.type && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200/80 flex-shrink-0">
                <ShieldCheck size={11.5} className="text-emerald-700" />
                <span>{store.type}</span>
              </span>
            )}
          </div>

          {/* Row 2: Store Category / Specialization */}
          <p className="text-[12px] text-gray-500 font-medium mt-0.5 truncate leading-normal">
            {store.category || 'Grosir Sembako & Bahan Pokok'}
          </p>

          {/* Row 3: Rating, Sales & Location Distance */}
          <div className="flex items-center gap-2 mt-1 text-[11.5px] text-gray-500 flex-wrap">
            <span className="inline-flex items-center gap-0.5 font-extrabold text-gray-800 flex-shrink-0">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {store.rating || '4.9'}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600 font-medium flex-shrink-0">
              {store.soldCount || '1.2rb+ terjual'}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-gray-600 font-medium truncate">
              <MapPin size={11} className="text-emerald-700 flex-shrink-0" />
              <span>{store.distance || '2.1 km'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Middle Section: Horizontal 3-Product Preview Grid ── */}
      {previewProducts.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {previewProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenProduct?.(prod)
              }}
              className="flex flex-col gap-1 cursor-pointer group/item"
            >
              {/* Product Photo Box with Discount Badge */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 relative border border-gray-100/90 shadow-2xs group-hover/item:border-emerald-300 transition-all">
                <img
                  src={getProductImage(prod.name)}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
                {prod.discount && (
                  <span className="absolute top-1.5 start-1.5 px-1.5 py-0.5 rounded-md bg-[#E53935] text-white text-[9.5px] font-black leading-tight shadow-xs">
                    {prod.discount}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <p className="text-[11px] font-bold text-gray-800 truncate leading-tight mt-0.5 group-hover/item:text-[#1B6B3A] transition">
                {prod.name}
              </p>

              {/* Product Price */}
              <p className="text-[12px] font-extrabold text-[#1B6B3A] leading-tight">
                Rp {prod.price.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. Bottom Section: Delivery Perk & Visit Button ── */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-900 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-200/70">
          <Zap size={12} className="text-amber-500 fill-amber-400 flex-shrink-0" />
          <span>Siap antar kilat {store.eta || '30 mnt'}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleOpenStore?.(store)
          }}
          className="px-4 py-2 rounded-xl bg-[#1B6B3A] hover:bg-[#155d31] text-white text-[12px] font-extrabold flex items-center gap-1.5 shadow-xs transition-all duration-150 active:scale-95 flex-shrink-0"
          style={{
            boxShadow: '0 2px 6px rgba(27, 107, 58, 0.24)',
          }}
        >
          <span>Kunjungi Toko</span>
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
