import React from 'react'
import { Heart, Star, Plus, Minus, Package } from 'lucide-react'

const PRIMARY = '#1B6B3A'

/**
 * ProductCard Molecule
 * Standardized e-commerce product card for ESTO (Global Village Market).
 * Features structured image container, clear category & seller text,
 * accurate unit and rating display, and tactile cart actions.
 */
export default function ProductCard({
  product,
  inCartQty = 0,
  isLiked = false,
  onToggleLike,
  onOpenDetail,
  onAddToCart,
  onUpdateQty,
  className = '',
}) {
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 3

  return (
    <div
      className={`spotlight-border bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between transition-all duration-150 hover:shadow-md ${className}`}
    >
      <div onClick={() => onOpenDetail?.(product)} className="w-full text-left cursor-pointer select-none">
        {/* ── Top Image Container ── */}
        <div
          className="h-32 relative flex items-center justify-center shadow-inner overflow-hidden"
          style={{
            background: product.image
              ? 'transparent'
              : product.g
              ? `linear-gradient(135deg, ${product.g[0]} 0%, ${product.g[1]} 100%)`
              : '#F5F5F5',
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover border border-black/10"
              loading="lazy"
            />
          ) : product.Icon ? (
            <product.Icon
              size={48}
              className="text-white drop-shadow-sm relative z-10"
              strokeWidth={1.5}
            />
          ) : (
            <Package size={48} className="text-gray-400" />
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleLike?.(product.id)
            }}
            aria-label="Sukai Produk"
            className="absolute top-2.5 end-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm active:scale-90 transition-transform z-10"
          >
            <Heart
              size={14}
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300'}
            />
          </button>

          {/* Discount Badge */}
          {product.orig && !isOutOfStock && (
            <div
              className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-lg text-white text-[10px] font-bold z-10 shadow-xs"
              style={{ background: '#E53935' }}
            >
              DISKON
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && (
            <div className="absolute bottom-2 start-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs z-10">
              Sisa {product.stock}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-2 z-10">
              <span className="text-white text-xs font-black bg-red-600/90 px-2.5 py-1 rounded-lg shadow-sm">
                Stok Habis
              </span>
              <span className="text-[10px] text-white/80 mt-1">Segera restok</span>
            </div>
          )}
        </div>

        {/* ── Product Info Body ── */}
        <div className="p-3 pb-2">
          <p className="text-[11px] text-gray-400 mb-0.5 truncate">
            {product.cat} · {product.seller}
          </p>
          <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
            {product.name}
          </p>
          <p className="text-[11px] text-gray-400 mb-2">{product.unit}</p>
          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-600 font-semibold">
              {product.rating} · {product.sold} terjual
            </span>
          </div>
        </div>
      </div>

      {/* ── Price & Action Footer ── */}
      <div className="px-3 pb-3 flex items-center justify-between pt-1">
        <div>
          <p className="text-sm font-extrabold tabular-nums" style={{ color: PRIMARY }}>
            Rp {product.price.toLocaleString('id')}
          </p>
          {product.orig && (
            <p className="text-[11px] text-gray-400 line-through">
              Rp {product.orig.toLocaleString('id')}
            </p>
          )}
        </div>

        {/* Action Button */}
        {isOutOfStock ? (
          <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-200">
            Habis
          </span>
        ) : inCartQty > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-emerald-50 rounded-full p-0.5 border border-emerald-200"
          >
            <button
              type="button"
              onClick={() => onUpdateQty?.(product.id, inCartQty - 1)}
              className="w-6 h-6 rounded-full bg-white border border-emerald-600 flex items-center justify-center shadow-xs active:scale-90"
            >
              <Minus size={11} style={{ color: PRIMARY }} />
            </button>
            <span className="text-xs font-bold text-emerald-950 w-4 text-center tabular-nums">
              {inCartQty}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart?.(product.id, 1)}
              disabled={inCartQty >= product.stock}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs active:scale-90 ${
                inCartQty >= product.stock ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-700'
              }`}
            >
              <Plus size={11} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart?.(product.id, 1)
            }}
            aria-label="Tambah ke Keranjang"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm active:scale-90 transition"
            style={{ background: PRIMARY }}
          >
            <Plus size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
