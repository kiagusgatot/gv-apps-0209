import React from 'react'
import { Navigation, Star, Package, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'

const STATUS_MAP = {
  waiting: {
    label: 'Menunggu Konfirmasi',
    bg: '#FFF8E1',
    color: '#F57F17',
    border: '#FFE082',
  },
  confirmed: {
    label: 'Dikonfirmasi',
    bg: '#E8F5E9',
    color: '#2E7D32',
    border: '#C8E6C9',
  },
  preparing: {
    label: 'Sedang Disiapkan',
    bg: '#E3F2FD',
    color: '#1565C0',
    border: '#BBDEFB',
  },
  shipped: {
    label: 'Dalam Pengiriman',
    bg: '#E8F5E9',
    color: '#1B5E20',
    border: '#A5D6A7',
    pulse: true,
  },
  done: {
    label: 'Selesai',
    bg: '#F1F8E9',
    color: '#33691E',
    border: '#DCEDC8',
  },
  cancelled: {
    label: 'Dibatalkan',
    bg: '#FFEBEE',
    color: '#C62828',
    border: '#FFCDD2',
  },
}

/**
 * OrderCard Molecule
 * Standardized order status card for ESTO (Global Village Market).
 * Displays order code, date, item thumbnails, transparent pricing,
 * and contextual action buttons (Live Tracking, Rating, Cancel).
 */
export default function OrderCard({
  order,
  onClick,
  onTrack,
  onRate,
  onCancelPrompt,
  onBuyAgain,
  className = '',
}) {
  const st = STATUS_MAP[order.status] || STATUS_MAP.waiting
  const isTrackable = ['confirmed', 'preparing', 'shipped'].includes(order.status)
  const isCancellable = ['waiting', 'confirmed'].includes(order.status)
  const primaryItem = order.items?.[0] || { name: 'Produk Desa', qty: 1, price: order.total }
  const totalItemCount = order.items?.reduce((sum, it) => sum + (it.qty || 1), 0) || 1

  return (
    <div
      onClick={() => onClick?.(order)}
      className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200/70 transition-all duration-200 cursor-pointer active:scale-[0.99] flex flex-col gap-3 ${className}`}
    >
      {/* ── Header: Order ID, Date & Status Badge ── */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono text-[11.5px] font-extrabold text-gray-700 tracking-tight">
            {order.id}
          </span>
          <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
        </div>

        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5 shadow-2xs border"
          style={{
            backgroundColor: st.bg,
            color: st.color,
            borderColor: st.border,
          }}
        >
          {st.pulse && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          )}
          <span>{st.label}</span>
        </span>
      </div>

      {/* ── Product Item Preview ── */}
      <div className="flex items-center gap-3 py-1">
        {/* Thumbnail preview */}
        <div className="relative w-13 h-13 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
          {primaryItem.image ? (
            <img
              src={primaryItem.image}
              alt={primaryItem.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : primaryItem.Icon ? (
            <primaryItem.Icon size={22} className="text-emerald-700" />
          ) : (
            <Package size={22} className="text-gray-400" />
          )}

          {order.items?.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 bg-black/65 backdrop-blur-2xs text-[9px] font-extrabold text-white text-center py-0.5">
              +{order.items.length - 1} item
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-extrabold text-gray-900 leading-snug line-clamp-1">
            {primaryItem.name}
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
            {primaryItem.qty} × Rp {primaryItem.price?.toLocaleString('id')} · Penjual:{' '}
            <span className="font-semibold text-emerald-800">{order.seller}</span>
          </p>
        </div>
      </div>

      {/* ── Cancellation Notice (if cancelled) ── */}
      {order.status === 'cancelled' && (
        <div className="p-2.5 rounded-xl bg-red-50/80 border border-red-200/80 text-[11px] text-red-700 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle size={13} className="text-red-600 flex-shrink-0" />
            <span>Alasan Pembatalan: {order.cancelReason || 'Permintaan pembeli'}</span>
          </div>
          <p className="text-emerald-700 font-semibold ms-4 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Dana dikembalikan 100% ke saldo GV Pay</span>
          </p>
        </div>
      )}

      {/* ── Rating Preview (if rated) ── */}
      {order.rating && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px]">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= order.rating ? 'text-amber-500' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-700 font-medium ms-1 truncate">
            {order.ratingComment ? `"${order.ratingComment}"` : 'Ulasan selesai'}
          </span>
        </div>
      )}

      {/* ── Delivery & Total Tagihan Footer ── */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
        <div className="min-w-0">
          <p className="text-[10.5px] text-gray-400 font-medium truncate">
            {order.delivery} · {order.payment}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ms-2">
          <span className="text-[10.5px] text-gray-400 font-medium">Total: </span>
          <span className="text-[14px] font-black text-[#1B6B3A] tabular-nums">
            Rp {order.total?.toLocaleString('id')}
          </span>
        </div>
      </div>

      {/* ── Contextual Actions Bar ── */}
      {(isTrackable || (order.status === 'done' && !order.rating) || isCancellable) && (
        <div
          className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {isTrackable ? (
            <>
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>GV Man Sedang Mengantar</span>
              </span>
              <button
                type="button"
                onClick={() => onTrack?.(order)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0C3E1E] to-[#1B6B3A] text-white text-[11.5px] font-bold active:scale-95 transition shadow-xs flex items-center gap-1.5"
              >
                <Navigation size={12} />
                <span>Lacak Live</span>
              </button>
            </>
          ) : order.status === 'done' && !order.rating ? (
            <>
              <span className="text-[11px] text-gray-500">
                Pesanan sudah kamu terima
              </span>
              <button
                type="button"
                onClick={() => onRate?.(order)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-[11.5px] font-bold active:scale-95 transition flex items-center gap-1 shadow-2xs hover:bg-amber-100"
              >
                <Star size={12} className="fill-amber-500 text-amber-500" />
                <span>Beri Rating</span>
              </button>
            </>
          ) : isCancellable ? (
            <>
              <span className="text-[11px] text-gray-400">
                Ingin mengubah rincian pesanan?
              </span>
              <button
                type="button"
                onClick={() => onCancelPrompt?.(order)}
                className="px-3 py-1.5 rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 text-[11px] font-bold active:scale-95 transition"
              >
                Batalkan
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
