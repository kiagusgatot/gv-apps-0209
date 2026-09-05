import React from 'react'
import { Star, MapPin, ChevronRight, Store, ShieldCheck, Zap, Tag } from 'lucide-react'
import { getProductImage } from '../../utils/productImages'

/**
 * StoreCard Molecule
 * Mendukung 3 variasi layout elegan:
 * 1. 'standard': Layout strip rapi dengan logo kotak, detail toko, pill kilat, dan tombol kunjungi.
 * 2. 'showcase': Layout etalase dengan logo kotak, preview 3 produk terlaris, dan strip pengiriman.
 * 3. 'accent': Layout beraksen banner promo di atas, logo kotak, info toko lengkap, dan CTA lebar.
 *
 * Seluruh variasi mempertahankan informasi utama:
 * - Logo toko (container kotak proporsional 56x56px, object-contain, tidak terpotong)
 * - Nama toko & status resmi (ShieldCheck badge)
 * - Rating & jumlah penjualan
 * - Lokasi & jarak
 * - Estimasi pengiriman kilat
 * - Tombol aksi (Kunjungi Toko)
 */
export default function StoreCard({
  store,
  variant,
  onSelectStore,
  onOpenStore,
  onSelectProduct,
  onOpenProduct,
}) {
  if (!store) return null

  const handleOpenStore = onSelectStore || onOpenStore
  const handleOpenProduct = onSelectProduct || onOpenProduct
  const activeVariant = variant || store.cardVariant || 'standard'

  // Common Square Box Logo Container (56px x 56px, aspect-square, object-contain)
  const renderSquareLogo = () => (
    <div className="w-14 h-14 rounded-xl bg-white border border-gray-200/90 shadow-2xs p-1 flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:border-emerald-400/80 transition-colors">
      {store.logo ? (
        <img
          src={store.logo}
          alt={store.name}
          className="w-full h-full object-contain rounded-lg"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            if (e.currentTarget.nextElementSibling) {
              e.currentTarget.nextElementSibling.style.display = 'flex'
            }
          }}
        />
      ) : null}

      {/* Fallback Monogram when image is missing or loading */}
      <div
        className={`w-full h-full rounded-lg flex items-center justify-center text-white font-black text-[14px] tracking-wider shadow-xs relative overflow-hidden ${
          store.logo ? 'hidden' : 'flex'
        }`}
        style={{
          background: store.logoBg || 'linear-gradient(135deg, #1B6B3A 0%, #2E7D32 100%)',
        }}
      >
        <div
          className="absolute -top-2 -end-2 w-6 h-6 rounded-full pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />
        {store.logoText ? (
          <span className="drop-shadow-xs">{store.logoText}</span>
        ) : (
          <Store size={22} className="text-white drop-shadow-xs" />
        )}
      </div>
    </div>
  )

  // ──────────────────────────────────────────────────────────────────────────
  // VARIATION 1: SHOWCASE (Preview 3 Produk Terlaris / Top Seller Preview)
  // ──────────────────────────────────────────────────────────────────────────
  if (activeVariant === 'showcase') {
    const previewProducts = (store.products || []).slice(0, 3)

    return (
      <div
        onClick={() => handleOpenStore?.(store)}
        className="relative bg-white rounded-2xl p-4 border border-gray-200/90 shadow-[0_4px_16px_-2px_rgba(27,107,58,0.07),0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(27,107,58,0.12),0_4px_8px_rgba(0,0,0,0.04)] hover:border-emerald-300/80 active:scale-[0.99] transition-all duration-200 cursor-pointer group select-none flex flex-col gap-3"
      >
        {/* Top Header: Logo + Identity & Metrics + Quick Visit Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {renderSquareLogo()}

            <div className="flex-1 min-w-0">
              {/* Store Name & Official Shield Badge */}
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

              {/* Specialization & Location */}
              <p className="text-[11.5px] text-gray-500 font-medium mt-0.5 truncate">
                {store.category || 'Grosir Sembako & Kebutuhan Pokok'}
              </p>

              {/* Compact Metrics */}
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 flex-wrap">
                <span className="inline-flex items-center gap-0.5 font-extrabold text-gray-800 flex-shrink-0">
                  <Star size={11.5} className="fill-amber-400 text-amber-400" />
                  {store.rating || '4.9'}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-600 font-medium flex-shrink-0">
                  {store.soldCount || '1.2rb+ terjual'}
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1 text-gray-600 font-medium truncate">
                  <MapPin size={10.5} className="text-emerald-700 flex-shrink-0" />
                  <span>{store.distance || '2.1 km'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: 3 Product Previews Grid (Interactive Showcase) */}
        {previewProducts.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            {previewProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenProduct?.(prod)
                }}
                className="bg-gray-50/90 rounded-xl p-1.5 border border-gray-200/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex flex-col gap-1 cursor-pointer group/item shadow-2xs"
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-white border border-gray-100 relative">
                  <img
                    src={getProductImage(prod.name)}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  {prod.discount && (
                    <span className="absolute top-1 start-1 px-1 py-0.2 rounded bg-red-500 text-white text-[8px] font-black leading-tight">
                      {prod.discount}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-gray-800 truncate leading-tight mt-0.5">
                  {prod.name}
                </p>
                <p className="text-[11px] font-black text-emerald-700 leading-none">
                  Rp {prod.price.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Strip: Delivery Perk on Left + Kunjungi Toko on Right */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
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

  // ──────────────────────────────────────────────────────────────────────────
  // VARIATION 2: ACCENT (Promo Ribbon Banner & Highlight)
  // ──────────────────────────────────────────────────────────────────────────
  if (activeVariant === 'accent') {
    return (
      <div
        onClick={() => handleOpenStore?.(store)}
        className="relative bg-white rounded-2xl border border-emerald-200/90 shadow-[0_4px_16px_-2px_rgba(27,107,58,0.07),0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(27,107,58,0.12),0_4px_8px_rgba(0,0,0,0.04)] hover:border-emerald-400 active:scale-[0.99] transition-all duration-200 cursor-pointer group select-none flex flex-col overflow-hidden"
      >
        {/* Top Accent Ribbon: Promo Offer & Fast ETA */}
        <div className="bg-gradient-to-r from-emerald-800 via-[#1B6B3A] to-teal-800 px-4 py-2 text-white flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag size={12} className="text-amber-300 flex-shrink-0" />
            <span className="text-[11px] font-extrabold tracking-wide truncate">
              {store.promoText || 'Voucher Spesial Belanja Hemat'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs flex-shrink-0">
            <Zap size={11} className="text-amber-300 fill-amber-300" />
            <span>{store.eta || '25 mnt'}</span>
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-3">
          {/* Top Row: Square Logo + Identity */}
          <div className="flex items-start gap-3.5">
            {renderSquareLogo()}

            <div className="flex-1 min-w-0">
              {/* Store Name & Official Badge */}
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

              {/* Specialization */}
              <p className="text-[12px] text-gray-500 font-medium mt-0.5 leading-normal">
                {store.category || 'Grosir Bahan Pokok Desa Terpercaya'}
              </p>

              {/* Metrics: Rating, Sales & Location */}
              <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-gray-500 flex-wrap">
                <span className="inline-flex items-center gap-0.5 font-extrabold text-gray-800 flex-shrink-0">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  {store.rating || '4.8'}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-600 font-medium flex-shrink-0">
                  {store.soldCount || '950+ terjual'}
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
                  <span className="truncate">{store.address || store.region}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Indicator on Left + Kunjungi Toko on Right */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Buka · Siap Antar Sekarang</span>
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
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VARIATION 3: STANDARD (Clean Strip Navigation - Default)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => handleOpenStore?.(store)}
      className="relative bg-white rounded-2xl p-4 border border-gray-200/90 shadow-[0_4px_16px_-2px_rgba(27,107,58,0.07),0_2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(27,107,58,0.12),0_4px_8px_rgba(0,0,0,0.04)] hover:border-emerald-300/80 active:scale-[0.99] transition-all duration-200 cursor-pointer group select-none flex flex-col gap-3"
    >
      {/* Top Section: Store Identity & Info with Full Horizontal Width */}
      <div className="flex items-start gap-3.5">
        {renderSquareLogo()}

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
              <span className="truncate">{store.address || store.region}</span>
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
