import React from 'react'
import { Star, MapPin, Ticket, ChevronRight, Store } from 'lucide-react'
import { getProductImage } from '@/utils/productImages'

/**
 * StoreCard Molecule (Model Card Toko Pilihan)
 * Sesuai dengan preferensi e-commerce modern.
 * Menampilkan nama toko, rating, lokasi, jarak,
 * serta horizontal scroll thumbnail produk-produk unggulan toko tersebut.
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

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs hover:shadow-md transition-all">
      {/* ── Store Header ── */}
      <div
        onClick={() => handleOpenStore?.(store)}
        className="flex items-start justify-between gap-3 cursor-pointer group select-none"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Store Logo */}
          <div
            className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 text-white font-black text-[15px] shadow-2xs"
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

          {/* Store Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[13.5px] font-extrabold text-gray-900 group-hover:text-emerald-800 transition truncate">
                {store.name}
              </h3>
              <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </div>

            {/* Rating & Lokasi Toko */}
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
              <span className="flex items-center gap-0.5 font-bold text-gray-800 flex-shrink-0">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {store.rating || '4.8'}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-500 truncate min-w-0">
                <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{store.address || store.region || 'Yogyakarta'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Distance on top right (without the 30 mnt badge) */}
        {store.distance && (
          <div className="flex items-center text-[11px] text-gray-400 font-medium flex-shrink-0 pt-0.5">
            <span>{store.distance}</span>
          </div>
        )}
      </div>

      {/* ── Mini Products Horizontal Scroll ── */}
      {store.products && store.products.length > 0 && (
        <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-gray-50 overflow-x-auto no-scrollbar pb-0.5">
          {store.products.slice(0, 4).map((p) => {
            const imgSrc = getProductImage(p)
            return (
              <div
                key={p.id}
                onClick={(e) => {
                  e.stopPropagation()
                  if (handleOpenProduct) handleOpenProduct(p, store)
                  else handleOpenStore?.(store)
                }}
                className="w-22 flex-shrink-0 cursor-pointer group/item select-none"
              >
                {/* Product Thumbnail */}
                <div className="w-22 h-22 rounded-xl bg-gray-50 overflow-hidden relative border border-gray-100 shadow-2xs group-hover/item:scale-[1.02] transition-transform">
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {p.discount && (
                    <span className="absolute top-1 start-1 text-[9px] font-black px-1.5 py-0.5 rounded-sm bg-red-600 text-white shadow-2xs">
                      {p.discount}
                    </span>
                  )}
                </div>

                {/* Mini Price & Voucher Ticket Icon */}
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-gray-900 leading-tight">
                    Rp {p.price ? (p.price / 1000).toFixed(0) + 'rb' : '15rb'}
                  </span>
                  <Ticket size={11} className="text-orange-500 flex-shrink-0" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
