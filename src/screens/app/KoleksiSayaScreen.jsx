import React, { useState } from 'react'
import { ArrowLeft, Heart, Bookmark, ShoppingBag, Film, Clock, Store, ChevronRight } from 'lucide-react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import { useWishlist, useSavedVideos } from '@/utils/collectionStore'
import { ALL_PRODUCTS } from '@/screens/app/Pasar'

export default function KoleksiSayaScreen({ onBack, navigate, initialTab = 'produk' }) {
  const [activeTab, setActiveTab] = useState(initialTab) // 'produk' | 'video'
  const { wishlistIds, count: productCount, remove: removeWishlist } = useWishlist()
  const { savedVideos, count: videoCount, remove: removeVideo } = useSavedVideos()

  // Match wishlist IDs to full product data
  const wishlistedProducts = wishlistIds
    .map((id) => ALL_PRODUCTS.find((p) => p.id === Number(id) || p.id === id))
    .filter(Boolean)

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* ── Top Header ── */}
      <header className="flex-shrink-0 bg-white border-b border-surface-100 shadow-2xs z-10">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center text-surface-700 active:scale-95 transition"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[16px] font-extrabold text-surface-900 leading-tight">
              Koleksi Saya
            </h1>
            <p className="text-[11px] text-surface-400 font-medium truncate">
              Produk favorit &amp; video yang kamu simpan
            </p>
          </div>
        </div>

        {/* ── 2 Tab Navigasi (Underline Style) ── */}
        <div className="flex border-t border-surface-100/80 px-4">
          <button
            type="button"
            onClick={() => setActiveTab('produk')}
            className={`flex-1 py-3 text-[13px] font-bold flex items-center justify-center gap-2 border-b-2 transition-all relative ${
              activeTab === 'produk'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-surface-500 hover:text-surface-700'
            }`}
          >
            <Heart
              size={15}
              className={activeTab === 'produk' ? 'text-emerald-700 fill-emerald-700/20' : 'text-surface-400'}
            />
            <span>Produk</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                activeTab === 'produk'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-surface-100 text-surface-500'
              }`}
            >
              {productCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 text-[13px] font-bold flex items-center justify-center gap-2 border-b-2 transition-all relative ${
              activeTab === 'video'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-surface-500 hover:text-surface-700'
            }`}
          >
            <Bookmark
              size={15}
              className={activeTab === 'video' ? 'text-emerald-700 fill-emerald-700/20' : 'text-surface-400'}
            />
            <span>Video</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                activeTab === 'video'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-surface-100 text-surface-500'
              }`}
            >
              {videoCount}
            </span>
          </button>
        </div>
      </header>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* TAB 1: PRODUK */}
        {activeTab === 'produk' && (
          <div className="p-4">
            {wishlistedProducts.length === 0 ? (
              /* Empty State Produk */
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
                  <Heart size={28} className="fill-rose-100" />
                </div>
                <h3 className="text-[15px] font-extrabold text-surface-900 mb-1">
                  Belum ada produk favorit
                </h3>
                <p className="text-[12px] text-surface-500 max-w-[240px] mb-6 leading-relaxed">
                  Tandai produk yang kamu sukai di ESTO dengan ikon hati agar tersimpan di sini.
                </p>
                <button
                  type="button"
                  onClick={() => navigate?.('pasar')}
                  className="px-6 py-2.5 rounded-xl text-[12.5px] font-extrabold text-white shadow-md active:scale-95 transition"
                  style={{
                    background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                  }}
                >
                  Jelajahi ESTO
                </button>
              </div>
            ) : (
              /* Grid 2 Kolom Produk Wishlist */
              <div className="grid grid-cols-2 gap-3">
                {wishlistedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate?.('pasar')}
                    className="bg-white rounded-2xl p-2.5 border border-surface-100 shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col relative group"
                  >
                    {/* Foto Produk + Tombol Hapus Wishlist */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-surface-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Tombol Hapus dari Wishlist */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeWishlist(product.id)
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center text-red-500 hover:scale-110 active:scale-95 transition"
                        title="Hapus dari wishlist"
                        aria-label="Hapus dari wishlist"
                      >
                        <Heart size={14} className="fill-red-500 text-red-500" />
                      </button>
                    </div>

                    {/* Informasi Produk */}
                    <div className="mt-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[12.5px] font-bold text-surface-900 leading-snug line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-surface-400 flex items-center gap-1 mt-1 truncate">
                          <Store size={11} className="text-surface-400 flex-shrink-0" />
                          <span>{product.seller || 'Penjual Desa'}</span>
                        </p>
                      </div>
                      <div className="mt-2 pt-1 border-t border-surface-50 flex items-center justify-between">
                        <p className="text-[13px] font-black text-[#1B6B3A] tabular-nums">
                          Rp {product.price?.toLocaleString('id')}
                        </p>
                        {product.unit && (
                          <span className="text-[10px] text-surface-400">/{product.unit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIDEO */}
        {activeTab === 'video' && (
          <div className="p-4">
            {savedVideos.length === 0 ? (
              /* Empty State Video */
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                  <Film size={28} />
                </div>
                <h3 className="text-[15px] font-extrabold text-surface-900 mb-1">
                  Belum ada video tersimpan
                </h3>
                <p className="text-[12px] text-surface-500 max-w-[240px] mb-6 leading-relaxed">
                  Simpan video menarik di GV Media untuk kamu tonton kembali kapan saja.
                </p>
                <button
                  type="button"
                  onClick={() => navigate?.('siaran')}
                  className="px-6 py-2.5 rounded-xl text-[12.5px] font-extrabold text-white shadow-md active:scale-95 transition"
                  style={{
                    background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',
                  }}
                >
                  Jelajahi GV Media
                </button>
              </div>
            ) : (
              /* List Card Video Tersimpan */
              <div className="flex flex-col gap-3">
                {savedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => navigate?.('siaran')}
                    className="bg-white rounded-2xl p-2.5 border border-surface-100 shadow-2xs hover:shadow-sm transition cursor-pointer flex gap-3 items-center group relative"
                  >
                    {/* Thumbnail + Durasi */}
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 text-[9.5px] font-black text-white px-1.5 py-0.5 rounded bg-black/75 tabular-nums">
                        {video.dur}
                      </span>
                    </div>

                    {/* Info Video */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="text-[12.5px] font-bold text-surface-900 leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-surface-500 font-medium mt-1 truncate">
                        {video.channel || 'GV Media'}
                      </p>
                      <p className="text-[10.5px] text-surface-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        <span>{video.dur}</span>
                      </p>
                    </div>

                    {/* Tombol Hapus dari Koleksi Video */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeVideo(video.id)
                      }}
                      className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center active:scale-90 transition flex-shrink-0"
                      title="Hapus dari video tersimpan"
                      aria-label="Hapus dari koleksi"
                    >
                      <Bookmark size={15} className="fill-emerald-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ScreenBackground>
  )
}
