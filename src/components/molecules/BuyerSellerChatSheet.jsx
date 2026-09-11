import React, { useState, useEffect, useRef } from 'react'
import {
  X, Send, Store, ShieldCheck, Clock, Check, CheckCheck,
  AlertTriangle, Sparkles, MessageCircle, ShoppingBag, Info,
  ArrowLeft, Search, Package, ChevronRight
} from 'lucide-react'
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '@/utils/productImages'
import { getStoredSchedule, calculateStoreStatus } from '@/utils/storeSchedule'

const PRIMARY = '#1B6B3A'

/**
 * Helper to calculate total unread messages for buyer across all store chat threads
 */
export function getBuyerTotalUnreadCount() {
  const saved = localStorage.getItem('gv_store_chats')
  if (!saved) return 0
  try {
    const chats = JSON.parse(saved)
    return chats.reduce((acc, c) => acc + (c.buyerUnreadCount || 0), 0)
  } catch (e) {
    return 0
  }
}

export default function BuyerSellerChatSheet({
  isOpen,
  onClose,
  initialView = null, // 'inbox' | 'thread' | null (auto-detect)
  targetSeller = null,
  targetProduct = null,
  targetOrder = null,
  userProfile = null,
}) {
  const buyerName = userProfile?.name || 'Pak Wahyu'
  const buyerPhone = userProfile?.phone || '0812-3344-5566'

  // View state: 'inbox' (all store conversations) or 'thread' (single store chat)
  const [view, setView] = useState('inbox')
  const [activeSeller, setActiveSeller] = useState(targetSeller || 'Toko Berkah Tani Bojong')
  const [activeProduct, setActiveProduct] = useState(targetProduct)
  const [activeOrder, setActiveOrder] = useState(targetOrder)
  const [inboxSearchQ, setInboxSearchQ] = useState('')

  const [inputText, setInputText] = useState('')
  const [isTypingAutoReply, setIsTypingAutoReply] = useState(false)
  const chatBottomRef = useRef(null)

  // Store operational status
  const schedule = getStoredSchedule()
  const storeStatus = calculateStoreStatus(schedule)

  // Load threads from localStorage
  const [threads, setThreads] = useState(() => {
    const saved = localStorage.getItem('gv_store_chats')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return []
  })

  // Sync threads on external updates
  useEffect(() => {
    const syncFromStorage = () => {
      const saved = localStorage.getItem('gv_store_chats')
      if (saved) {
        try { setThreads(JSON.parse(saved)) } catch (e) {}
      }
    }
    window.addEventListener('storage', syncFromStorage)
    window.addEventListener('gv_chats_updated', syncFromStorage)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener('gv_chats_updated', syncFromStorage)
    }
  }, [])

  // Determine initial view and selected seller when sheet opens
  useEffect(() => {
    if (!isOpen) return

    if (initialView === 'inbox' && !targetSeller && !targetOrder && !targetProduct) {
      setView('inbox')
    } else if (targetSeller || targetOrder || targetProduct) {
      const sName = targetSeller || targetOrder?.seller || 'Toko Berkah Tani Bojong'
      setActiveSeller(sName)
      setActiveProduct(targetProduct)
      setActiveOrder(targetOrder)
      setView('thread')
    } else {
      setView('inbox')
    }
  }, [isOpen, initialView, targetSeller, targetOrder, targetProduct])

  // Resolve current thread when in 'thread' view
  const [currentThreadId, setCurrentThreadId] = useState(null)

  useEffect(() => {
    if (!isOpen || view !== 'thread') return

    const sellerNameClean = (activeSeller || 'Toko Berkah Tani Bojong').trim()
    const isMainSellerStore =
      sellerNameClean.toLowerCase() === 'pak budi' ||
      sellerNameClean.toLowerCase() === 'pak budi santoso' ||
      sellerNameClean.toLowerCase() === 'toko berkah tani bojong'

    let currentChats = [...threads]
    if (currentChats.length === 0) {
      const saved = localStorage.getItem('gv_store_chats')
      if (saved) {
        try { currentChats = JSON.parse(saved) } catch (e) {}
      }
    }

    // Look for existing thread
    let thread = null
    if (isMainSellerStore) {
      thread = currentChats.find((c) => c.id === 'chat_001' || c.buyerName === buyerName)
    } else {
      thread = currentChats.find(
        (c) => (c.sellerName === sellerNameClean || c.storeName === sellerNameClean) && c.buyerName === buyerName
      )
    }

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    // If not found, create new thread
    if (!thread) {
      thread = {
        id: isMainSellerStore ? 'chat_001' : `chat_${Date.now()}`,
        buyerName: buyerName,
        buyerPhone: buyerPhone,
        sellerName: sellerNameClean,
        storeName: sellerNameClean,
        orderRef: activeOrder ? activeOrder.id : activeProduct ? `PROD-${activeProduct.id}` : null,
        lastTime: nowStr,
        unreadCount: 0,
        buyerUnreadCount: 0,
        lastMessage: `Halo! Selamat datang di ${sellerNameClean}.`,
        messages: [
          {
            id: 1,
            from: 'seller',
            text: `Halo ${buyerName}! Selamat datang di ${sellerNameClean}. Ada yang bisa kami bantu seputar pesanan atau produk segar desa?`,
            time: nowStr,
          },
        ],
      }
      currentChats.unshift(thread)
    } else {
      // Clear buyer unread count when opening thread
      currentChats = currentChats.map((c) =>
        c.id === thread.id
          ? {
              ...c,
              buyerUnreadCount: 0,
              orderRef: activeOrder ? activeOrder.id : c.orderRef,
            }
          : c
      )
    }

    setThreads(currentChats)
    setCurrentThreadId(thread.id)
    localStorage.setItem('gv_store_chats', JSON.stringify(currentChats))
    window.dispatchEvent(new Event('gv_chats_updated'))
  }, [isOpen, view, activeSeller, activeOrder, activeProduct, buyerName])

  // Active thread data
  const activeThread = threads.find((t) => t.id === currentThreadId) || null
  const messages = activeThread?.messages || []

  // Check if current seller is the store with hybrid schedule
  const isTargetMainStore =
    (activeSeller || '').toLowerCase() === 'pak budi' ||
    (activeSeller || '').toLowerCase() === 'pak budi santoso' ||
    (activeSeller || '').toLowerCase() === 'toko berkah tani bojong'
  const isSellerStoreClosed = isTargetMainStore ? !storeStatus.isOpen : false

  // Auto-scroll chat stream
  useEffect(() => {
    if (isOpen && view === 'thread') {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    }
  }, [isOpen, view, messages.length, isTypingAutoReply])

  if (!isOpen) return null

  // Send message from buyer
  const handleSendMessage = (textToSend) => {
    const clean = (textToSend || inputText).trim()
    if (!clean || !currentThreadId) return

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const buyerMsg = {
      id: Date.now(),
      from: 'buyer',
      text: clean,
      time: nowStr,
      orderRef: activeOrder ? activeOrder.id : null,
      productRef: activeProduct
        ? {
            id: activeProduct.id,
            name: activeProduct.name,
            price: activeProduct.price,
            unit: activeProduct.unit,
            image: getProductImage(activeProduct),
          }
        : null,
    }

    const updatedChats = threads.map((th) => {
      if (th.id === currentThreadId) {
        return {
          ...th,
          lastMessage: clean,
          lastTime: nowStr,
          unreadCount: (th.unreadCount || 0) + 1, // Seller gets +1 unread
          buyerUnreadCount: 0,
          orderRef: activeOrder ? activeOrder.id : th.orderRef,
          messages: [...(th.messages || []), buyerMsg],
        }
      }
      return th
    })

    setThreads(updatedChats)
    localStorage.setItem('gv_store_chats', JSON.stringify(updatedChats))
    window.dispatchEvent(new Event('gv_chats_updated'))
    setInputText('')

    // Auto-reply if closed
    if (isSellerStoreClosed && schedule.autoReplyClosed) {
      setIsTypingAutoReply(true)
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        const autoReplyMsg = {
          id: Date.now() + 1,
          from: 'seller',
          isAutoReply: true,
          text:
            schedule.autoReplyText ||
            'Halo! Toko kami saat ini sedang tutup. Pesanan dan pertanyaan Anda akan segera kami respon saat toko buka kembali. Terima kasih atas pengertiannya! 🙏',
          time: replyTime,
        }

        setThreads((prev) => {
          const withReply = prev.map((th) => {
            if (th.id === currentThreadId) {
              return {
                ...th,
                lastMessage: autoReplyMsg.text,
                lastTime: replyTime,
                messages: [...(th.messages || []), autoReplyMsg],
              }
            }
            return th
          })
          localStorage.setItem('gv_store_chats', JSON.stringify(withReply))
          window.dispatchEvent(new Event('gv_chats_updated'))
          return withReply
        })
        setIsTypingAutoReply(false)
      }, 700)
    }
  }

  // Quick Chips for buyer
  const BUYER_QUICK_CHIPS = activeOrder
    ? [
        `Kapan pesanan #${activeOrder.id} dikirim?`,
        'Tolong pilihkan barang yang baru ya',
        'Pesanan tolong dititipkan di teras rumah',
        'Terima kasih banyak Pak!',
      ]
    : activeProduct
    ? [
        `Apakah stok ${activeProduct.name.split(' ')[0]} ready?`,
        'Bisa dikirim hari ini?',
        'Pilihkan yang paling segar ya',
        'Bisa pesan dalam jumlah banyak?',
      ]
    : [
        'Apakah toko buka hari ini?',
        'Bisa kirim ke Dusun Sukamaju?',
        'Bisa pesan grosir untuk warga?',
        'Terima kasih infonya Pak!',
      ]

  // Filtered threads for Inbox view
  const filteredInbox = threads.filter((th) => {
    if (!inboxSearchQ) return true
    const q = inboxSearchQ.toLowerCase()
    return (
      (th.sellerName || '').toLowerCase().includes(q) ||
      (th.storeName || '').toLowerCase().includes(q) ||
      (th.lastMessage || '').toLowerCase().includes(q)
    )
  })

  const totalBuyerUnread = threads.reduce((acc, c) => acc + (c.buyerUnreadCount || 0), 0)

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
      />
      <div
        className="relative bg-white w-full rounded-t-3xl flex flex-col max-h-[90%] h-[86%] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250 z-10"
        style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.25)' }}
      >
        {/* Drag Handle Bar */}
        <div
          className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-2.5 mb-1 flex-shrink-0 cursor-pointer"
          onClick={onClose}
        />

        {/* ══════════════════════════════════════════════════════════
            VIEW 1: INBOX LIST (Semua Percakapan Toko Pembeli)
            ══════════════════════════════════════════════════════════ */}
        {view === 'inbox' && (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Inbox Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-extrabold text-gray-900">
                    Pesan & Obrolan Toko
                  </h3>
                  {totalBuyerUnread > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black tabular-nums">
                      {totalBuyerUnread} baru
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Riwayat obrolan langsung dengan penjual mitra desa
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition active:scale-95"
                aria-label="Tutup Obrolan"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar in Inbox */}
            <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 flex-shrink-0">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  value={inboxSearchQ}
                  onChange={(e) => setInboxSearchQ(e.target.value)}
                  placeholder="Cari nama toko atau riwayat obrolan..."
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 bg-[#FAFBF9]">
              {filteredInbox.length === 0 ? (
                <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 shadow-2xs">
                    <MessageCircle size={28} />
                  </div>
                  <h4 className="text-[14.5px] font-extrabold text-gray-900 mb-1">
                    Belum Ada Obrolan Toko
                  </h4>
                  <p className="text-[11.5px] text-gray-500 max-w-xs leading-relaxed mb-4">
                    Tanyakan stok produk segar, diskon, atau pengiriman langsung dengan penjual melalui tombol Chat di halaman toko atau produk.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-[#1B6B3A] text-white text-[11.5px] font-bold active:scale-95 transition shadow-xs flex items-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>Jelajahi Produk Pasar</span>
                  </button>
                </div>
              ) : (
                filteredInbox.map((th) => {
                  const sName = th.sellerName || th.storeName || 'Toko Berkah Tani Bojong'
                  const isMainStore =
                    sName.toLowerCase().includes('budi') || sName.toLowerCase().includes('berkah tani')
                  const isClosed = isMainStore ? !storeStatus.isOpen : false
                  const hasUnread = (th.buyerUnreadCount || 0) > 0

                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        setActiveSeller(sName)
                        setActiveOrder(null)
                        setActiveProduct(null)
                        setView('thread')
                      }}
                      className="p-3 bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition active:scale-[0.99] cursor-pointer flex items-center gap-3"
                    >
                      {/* Store Avatar with status indicator dot */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-extrabold text-base shadow-xs">
                          {sName[0] || 'T'}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            isClosed ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          title={isClosed ? 'Toko Tutup' : 'Toko Buka'}
                        />
                      </div>

                      {/* Info & Last Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <div className="flex items-center gap-1 min-w-0">
                            <h4 className="text-[13px] font-extrabold text-gray-900 truncate">
                              {sName}
                            </h4>
                            <ShieldCheck size={13} className="text-emerald-700 flex-shrink-0" />
                          </div>
                          <span className="text-[10.5px] text-gray-400 font-medium flex-shrink-0">
                            {th.lastTime || '11:25'}
                          </span>
                        </div>

                        {/* Order tag chip if order related */}
                        {th.orderRef && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 text-[9.5px] font-bold border border-emerald-200/70 mb-1">
                            <Package size={9} />
                            <span>Pesanan #{th.orderRef}</span>
                          </span>
                        )}

                        <p className={`text-[11.5px] truncate leading-tight ${hasUnread ? 'font-extrabold text-gray-900' : 'text-gray-500'}`}>
                          {th.lastMessage || 'Ketuk untuk membuka percakapan'}
                        </p>
                      </div>

                      {/* Right side: unread badge or arrow */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {hasUnread ? (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center tabular-nums shadow-xs">
                            {th.buyerUnreadCount}
                          </span>
                        ) : (
                          <ChevronRight size={16} className="text-gray-300" />
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            VIEW 2: CHAT THREAD (Obrolan dengan Toko Tertentu)
            ══════════════════════════════════════════════════════════ */}
        {view === 'thread' && (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Thread Header */}
            <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Back button to return to Inbox */}
                <button
                  type="button"
                  onClick={() => setView('inbox')}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition active:scale-95 flex-shrink-0"
                  aria-label="Kembali ke Inbox"
                  title="Kembali ke Daftar Obrolan"
                >
                  <ArrowLeft size={16} />
                </button>

                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    <Store size={16} />
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      isSellerStoreClosed ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[13.5px] font-extrabold text-gray-900 truncate">
                      {activeSeller || 'Toko Berkah Tani Bojong'}
                    </h3>
                    <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-[10.5px]">
                    {isSellerStoreClosed ? (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Toko Tutup · {storeStatus.nextOpenInfo || 'Buka besok 07.00'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Buka Sekarang · Aktif
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition active:scale-95 flex-shrink-0"
                aria-label="Tutup Obrolan"
              >
                <X size={17} />
              </button>
            </div>

            {/* Order Context Banner (if opened from an order card or order detail) */}
            {activeOrder && (
              <div className="mx-3.5 mt-2 mb-1 p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 flex-shrink-0 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#1B6B3A] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Package size={17} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11.5px] font-black text-gray-900 font-mono">
                        {activeOrder.id}
                      </span>
                      <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                        {activeOrder.status === 'shipped'
                          ? 'Sedang Dikirim'
                          : activeOrder.status === 'preparing'
                          ? 'Dikemas'
                          : activeOrder.status === 'waiting'
                          ? 'Menunggu'
                          : activeOrder.status === 'done'
                          ? 'Selesai'
                          : 'Pesanan Aktif'}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-gray-500 truncate mt-0.5">
                      Total Rp {(activeOrder.total || 0).toLocaleString('id')} · {activeOrder.items?.length || 1} barang
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      `Halo ${activeSeller}, saya ingin bertanya perihal status pengiriman pesanan #${activeOrder.id}. Terima kasih!`
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-[#1B6B3A] text-white text-[10.5px] font-bold flex-shrink-0 active:scale-95 transition shadow-2xs hover:bg-[#145a2c]"
                >
                  Tanya Pesanan
                </button>
              </div>
            )}

            {/* Target Product Context Card (if opened from product detail) */}
            {activeProduct && !activeOrder && (
              <div className="mx-3.5 mt-2 mb-1 p-2 bg-gray-50 border border-gray-200/90 rounded-2xl flex items-center justify-between gap-2.5 flex-shrink-0 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={getProductImage(activeProduct)}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-gray-900 truncate leading-snug">
                      {activeProduct.name}
                    </p>
                    <p className="text-[11.5px] font-extrabold text-[#1B6B3A] mt-0.5">
                      Rp {activeProduct.price?.toLocaleString('id')}
                      <span className="text-[9.5px] font-normal text-gray-400">/{activeProduct.unit}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      `Halo, apakah produk "${activeProduct.name}" ini masih tersedia stoknya?`
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-[#1B6B3A] text-white text-[10.5px] font-bold flex-shrink-0 active:scale-95 transition shadow-2xs hover:bg-[#145a2c]"
                >
                  Tanya Stok
                </button>
              </div>
            )}

            {/* Store Closed Notice Banner */}
            {isSellerStoreClosed && (
              <div className="px-3.5 py-2 bg-red-50/90 border-b border-red-100 flex items-center gap-2 flex-shrink-0">
                <Clock size={14} className="text-red-600 flex-shrink-0" />
                <p className="text-[11px] text-red-800 font-semibold leading-tight">
                  Toko tutup saat ini. Pesan Anda akan dibalas otomatis dan direspon saat buka ({storeStatus.nextOpenInfo || 'besok 07.00'}).
                </p>
              </div>
            )}

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-[#F8FAFC]">
              {/* Trust Badge */}
              <div className="text-center my-1">
                <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200/70 text-[10px] text-gray-500 shadow-2xs">
                  <ShieldCheck size={11} className="text-emerald-700" />
                  <span>Obrolan resmi terlindungi sistem Global Village</span>
                </div>
              </div>

              {messages.map((m, idx) => {
                const isBuyer = m.from === 'buyer'
                return (
                  <div
                    key={m.id || idx}
                    className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
                  >
                    {/* Attached product card if sent with message */}
                    {m.productRef && (
                      <div className="mb-1 p-1.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 max-w-[80%] shadow-2xs">
                        {m.productRef.image && (
                          <img
                            src={m.productRef.image}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 text-left">
                          <p className="text-[10px] font-bold text-gray-800 truncate">
                            {m.productRef.name}
                          </p>
                          <p className="text-[9.5px] font-extrabold text-emerald-800">
                            Rp {m.productRef.price?.toLocaleString('id')}
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed relative shadow-2xs ${
                        isBuyer
                          ? 'bg-[#1B6B3A] text-white rounded-tr-xs'
                          : 'bg-white text-gray-800 border border-gray-200/90 rounded-tl-xs'
                      }`}
                    >
                      {m.isAutoReply && (
                        <div className="flex items-center gap-1 text-[9.5px] font-extrabold text-amber-800 mb-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 inline-flex">
                          <Sparkles size={10} className="text-amber-600" />
                          <span>Balasan Otomatis Toko Tutup</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{m.text}</p>

                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                          isBuyer ? 'text-emerald-100' : 'text-gray-400'
                        }`}
                      >
                        <span>{m.time}</span>
                        {isBuyer && <CheckCheck size={11} className="text-white" />}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Typing indicator */}
              {isTypingAutoReply && (
                <div className="flex items-center gap-1.5 text-[10.5px] text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl w-fit shadow-2xs animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[10.5px] font-medium text-gray-500">
                    Penjual sedang membalas...
                  </span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Reply Chips */}
            <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {BUYER_QUICK_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 rounded-xl bg-gray-100 text-gray-700 text-[10.5px] font-bold whitespace-nowrap hover:bg-emerald-50 hover:text-emerald-800 transition active:scale-95 flex-shrink-0 border border-gray-200/60"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage()
                }}
                placeholder="Ketik pesan untuk penjual..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 text-[12.5px] text-gray-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition active:scale-95 shadow-sm ${
                  inputText.trim()
                    ? 'bg-[#1B6B3A] text-white hover:bg-[#145a2c]'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
