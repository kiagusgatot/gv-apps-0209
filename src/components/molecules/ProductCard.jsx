import React from 'react'
import { Heart, Star, Plus, Minus, Package } from 'lucide-react'

/**
 * ProductCard Molecule
 * Standardized e-commerce product card for ESTO (Global Village Market).
 * Features structured image container, compact rating & unit pill,
 * smooth cart actions, and responsive price formatting.
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
  const discountPct = product.orig
    ? Math.round(((product.orig - product.price) / product.orig) * 100)
    : 0

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border border-gray-100/90 shadow-xs hover:shadow-md hover:border-emerald-200/70 transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* ── Top Image Container ── */}
      <div
        onClick={() => onOpenDetail?.(product)}
        className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center cursor-pointer select-none"
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : product.Icon ? (
          <product.Icon
            size={42}
            className="text-white drop-shadow-sm group-hover:scale-110 transition-transform"
            strokeWidth={1.5}
          />
        ) : (
          <Package size={36} className="text-gray-300" />
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleLike?.(product.id)
          }}
          aria-label="Sukai Produk"
          className="absolute top-2 end-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition-transform z-10"
        >
          <Heart
            size={13}
            className={
              isLiked
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 hover:text-gray-600'
            }
          />
        </button>

        {/* Discount Badge */}
        {product.orig && !isOutOfStock && (
          <div className="absolute top-2 start-2 px-2 py-0.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9.5px] font-black shadow-xs tracking-tight z-10">
            HEMAT {discountPct > 0 ? `${discountPct}%` : 'PROMO'}
          </div>
        )}

        {/* Low Stock Warning Badge */}
        {isLowStock && (
          <div className="absolute bottom-2 start-2 px-1.5 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-xs text-white text-[9px] font-extrabold shadow-xs z-10 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white animate-ping" />
            <span>Sisa {product.stock}</span>
          </div>
        )}

        {/* Out of Stock Dark Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center z-10">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              Stok Habis
            </span>
            <span className="text-[9.5px] text-white/80 mt-0.5">Segera restok</span>
          </div>
        )}
      </div>

      {/* ── Product Info Body ── */}
      <div
        onClick={() => onOpenDetail?.(product)}
        className="p-3 flex-1 flex flex-col justify-between cursor-pointer"
      >
        <div>
          {/* Category & Seller Tag */}
          <div className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-800/80 mb-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
            <span className="truncate">
              {product.seller} · {product.cat}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-[13px] font-extrabold text-gray-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating & Unit Row */}
        <div className="flex items-center justify-between gap-1.5 mt-auto pt-1">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-bold text-gray-700">
              {product.rating}
            </span>
            <span className="text-[10px] text-gray-400 truncate">
              · {product.sold}
            </span>
          </div>
          <span className="text-[9.5px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
            {product.unit}
          </span>
        </div>
      </div>

      {/* ── Price & Action Footer ── */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[14px] font-black tabular-nums leading-tight text-[#1B6B3A]">
            Rp {product.price.toLocaleString('id')}
          </p>
          {product.orig && (
            <p className="text-[10px] text-gray-400 line-through leading-none mt-0.5">
              Rp {product.orig.toLocaleString('id')}
            </p>
          )}
        </div>

        {/* Action Button */}
        {isOutOfStock ? (
          <span className="text-[10.5px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-xl border border-gray-200/80">
            Habis
          </span>
        ) : inCartQty > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 bg-emerald-50 rounded-xl p-0.5 border border-emerald-200/90 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => onUpdateQty?.(product.id, inCartQty - 1)}
              className="w-6 h-6 rounded-lg bg-white border border-emerald-600 text-emerald-800 flex items-center justify-center active:scale-90 shadow-2xs transition"
            >
              <Minus size={11} />
            </button>
            <span className="text-[11px] font-black text-emerald-950 w-4 text-center tabular-nums">
              {inCartQty}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart?.(product.id, 1)}
              disabled={inCartQty >= product.stock}
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-2xs active:scale-90 transition ${
                inCartQty >= product.stock
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#1B6B3A]'
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
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs active:scale-90 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)',
            }}
          >
            <Plus size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
