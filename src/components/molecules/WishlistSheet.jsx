import React from 'react'
import { X, Heart, ShoppingCart, Trash2, ChevronRight, Plus } from 'lucide-react'
import { getProductImage } from '@/utils/productImages'

/**
 * WishlistSheet Molecule
 * Drawer/sheet to view products saved with the Love/Favorite button.
 */
export default function WishlistSheet({
  isOpen,
  onClose,
  wishlistIds = [],
  allProducts = [],
  onAddToCart,
  onRemoveFavorite,
  onOpenDetail,
}) {
  if (!isOpen) return null

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id))

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div
        className="relative bg-white rounded-t-3xl flex flex-col shadow-2xl animate-slide-up max-h-[85%]"
        style={{ zIndex: 51 }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Heart size={16} className="fill-red-500 text-red-500" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">
                Wishlist Saya
              </h3>
              <p className="text-[11px] text-gray-400">
                {wishlistProducts.length} produk tersimpan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3">
          {wishlistProducts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-3">
                ❤️
              </div>
              <p className="text-[14px] font-extrabold text-gray-900 mb-1">
                Wishlist Kamu Masih Kosong
              </p>
              <p className="text-[12px] text-gray-400 max-w-xs leading-relaxed mb-4">
                Simpan produk yang kamu suka dengan menekan icon hati pada katalog untuk dibeli nanti.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs active:scale-95 transition shadow-sm"
              >
                Jelajahi Produk Sekarang
              </button>
            </div>
          ) : (
            wishlistProducts.map((item) => {
              const imgSrc = getProductImage(item)
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-xs transition"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      onOpenDetail?.(item)
                      onClose()
                    }}
                    className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer border border-gray-100"
                  >
                    <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div
                    onClick={() => {
                      onOpenDetail?.(item)
                      onClose()
                    }}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <p className="text-[11px] text-gray-400 truncate">{item.seller || 'Mitra Desa'}</p>
                    <p className="text-[12.5px] font-bold text-gray-900 leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="text-[13px] font-extrabold text-emerald-800 mt-0.5">
                      Rp {item.price.toLocaleString('id')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onAddToCart?.(item.id, 1)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition shadow-xs"
                    >
                      <Plus size={12} />
                      <span>Beli</span>
                    </button>
                    <button
                      onClick={() => onRemoveFavorite?.(item.id)}
                      className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 flex items-center justify-center active:scale-95 transition"
                      title="Hapus dari wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
