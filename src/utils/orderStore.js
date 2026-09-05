import { useState, useEffect } from 'react'
import { Leaf, CircleDot, Wheat, Coffee, Droplet, Egg } from 'lucide-react'

export const STATUS_CONFIG = {
  waiting:   { label: 'Menunggu Konfirmasi', color: '#F57F17', bg: '#FFF8E1' },
  confirmed: { label: 'Dikonfirmasi',        color: '#1565C0', bg: '#E3F2FD' },
  preparing: { label: 'Sedang Disiapkan',    color: '#E65100', bg: '#FFF3E0' },
  shipped:   { label: 'Dalam Perjalanan',    color: '#1B6B3A', bg: '#E8F5E9' },
  done:      { label: 'Selesai',             color: '#388E3C', bg: '#F1F8E9' },
  cancelled: { label: 'Dibatalkan',          color: '#C62828', bg: '#FFEBEE' },
}

export const INITIAL_BUYER_ORDERS = [
  {
    id: 'GV-20260902',
    date: 'Hari ini, 10:15',
    seller: 'Ibu Sari',
    payment: 'GV Pay',
    delivery: 'Pengiriman (Kilat Desa)',
    total: 37000,
    status: 'shipped',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    courier: { name: 'Agus Santoso', rating: 4.9, trips: '240+', vehicle: 'Honda Beat · B 4521 KDF', avatar: '👨' },
    items: [
      {
        id: 2,
        name: 'Bayam Organik Segar',
        qty: 2,
        price: 8500,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
        Icon: Leaf,
        g: ['#2E7D32', '#4CAF50'],
      },
      {
        id: 1,
        name: 'Tempe Mendoan Jumbo',
        qty: 1,
        price: 12000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
        Icon: CircleDot,
        g: ['#E65100', '#F57C00'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '10:15', label: 'Pesanan Dibuat', sub: 'Menunggu konfirmasi dari penjual' },
      { s: 'confirmed', time: '10:18', label: 'Penjual Mengonfirmasi', sub: 'Penjual menerima dan memverifikasi pesanan' },
      { s: 'preparing', time: '10:30', label: 'Pesanan Sedang Disiapkan', sub: 'Penjual menyiapkan paket dan mengemas produk' },
      { s: 'shipped', time: '10:45', label: 'Dalam Perjalanan ke Lokasimu', sub: 'GV Man sedang mengantar paket ke rumahmu' },
    ],
  },
  {
    id: 'GV-20260901',
    date: 'Hari ini, 08:30',
    seller: 'Pak Wahyu',
    payment: 'GV Pay',
    delivery: 'Pengiriman (Reguler)',
    total: 73000,
    status: 'waiting',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    items: [
      {
        id: 8,
        name: 'Beras Pandan Wangi Premium 5kg',
        qty: 1,
        price: 65000,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
        Icon: Wheat,
        g: ['#827717', '#9E9D24'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '08:30', label: 'Menunggu Konfirmasi Penjual', sub: 'Pesanan telah diteruskan ke mitra petani' },
    ],
  },
  {
    id: 'GV-20260815',
    date: '15 Agt 2026, 14:20',
    seller: 'Pak Asep',
    payment: 'Transfer Bank',
    delivery: 'Pengiriman (Reguler)',
    total: 108000,
    status: 'done',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    items: [
      {
        id: 3,
        name: 'Kopi Robusta Segar',
        qty: 1,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',
        Icon: Coffee,
        g: ['#4E342E', '#6D4C41'],
      },
      {
        id: 4,
        name: 'Madu Hutan Murni',
        qty: 1,
        price: 65000,
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=600&auto=format&fit=crop',
        Icon: Droplet,
        g: ['#F57F17', '#FFCA28'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '14:20', label: 'Pesanan Dibuat', sub: 'Menunggu konfirmasi penjual' },
      { s: 'confirmed', time: '14:25', label: 'Pesanan Dikonfirmasi', sub: 'Penjual memverifikasi ketersediaan stok' },
      { s: 'preparing', time: '14:40', label: 'Pesanan Disiapkan', sub: 'Paket dikemas rapi' },
      { s: 'shipped', time: '15:05', label: 'Dalam Pengiriman', sub: 'GV Man mengantar paket' },
      { s: 'done', time: '15:45', label: 'Pesanan Selesai Diterima', sub: 'Paket telah diterima di alamat pemesan' },
    ],
  },
  {
    id: 'GV-20260718',
    date: '18 Jul 2026, 11:10',
    seller: 'Ibu Rina',
    payment: 'GV Pay',
    delivery: 'Pengiriman',
    total: 40000,
    status: 'cancelled',
    cancelReason: 'Ingin mengubah pesanan / alamat pengiriman',
    refundNotice: 'Dana Rp 40.000 telah dikembalikan 100% ke saldo GV Pay.',
    address: 'Jl. Melati No. 4, RT 02/01, Desa Sukamaju',
    items: [
      {
        id: 9,
        name: 'Telur Ayam Kampung (10 butir)',
        qty: 1,
        price: 32000,
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop',
        Icon: Egg,
        g: ['#F57F17', '#FBC02D'],
      },
    ],
    timeline: [
      { s: 'waiting', time: '11:10', label: 'Pesanan Dibuat', sub: 'Menunggu konfirmasi penjual' },
      { s: 'cancelled', time: '11:18', label: 'Pesanan Dibatalkan Pembeli', sub: 'Refund 100% saldo GV Pay berhasil' },
    ],
  },
]

let inMemoryOrders = null

function loadOrdersFromStorage() {
  try {
    const raw = localStorage.getItem('gv_buyer_orders')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to load orders from localStorage:', e)
  }
  return [...INITIAL_BUYER_ORDERS]
}

export function getBuyerOrders() {
  if (!inMemoryOrders) {
    inMemoryOrders = loadOrdersFromStorage()
  }
  return inMemoryOrders
}

function notifyOrdersChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gv_orders_changed'))
  }
}

export function saveBuyerOrders(orders) {
  inMemoryOrders = orders
  try {
    localStorage.setItem('gv_buyer_orders', JSON.stringify(orders))
  } catch (e) {
    console.warn('Failed to save orders to localStorage:', e)
  }
  notifyOrdersChanged()
}

export function addBuyerOrder(newOrder) {
  const current = getBuyerOrders()
  const next = [newOrder, ...current]
  saveBuyerOrders(next)
  return next
}

export function updateBuyerOrder(orderId, patch) {
  const current = getBuyerOrders()
  const next = current.map((o) => (o.id === orderId ? { ...o, ...patch } : o))
  saveBuyerOrders(next)
  return next
}

export function cancelBuyerOrder(orderId, reason) {
  const current = getBuyerOrders()
  const nowStr = new Date().toLocaleTimeString('id', { hour: '2-digit', minute: '2-digit' })
  const next = current.map((o) => {
    if (o.id !== orderId) return o
    return {
      ...o,
      status: 'cancelled',
      cancelReason: reason,
      refundNotice: `Dana Rp ${o.total.toLocaleString('id')} telah dikembalikan 100% ke saldo GV Pay.`,
      timeline: [
        ...(o.timeline || []),
        {
          s: 'cancelled',
          time: nowStr,
          label: `Pesanan dibatalkan (${reason}) · Refund Selesai`,
        },
      ],
    }
  })
  saveBuyerOrders(next)
  return next
}

export function rateBuyerOrder(orderId, rating, comment) {
  const current = getBuyerOrders()
  const next = current.map((o) => (o.id === orderId ? { ...o, rating, ratingComment: comment } : o))
  saveBuyerOrders(next)
  return next
}

export function useBuyerOrders() {
  const [orders, setOrders] = useState(() => getBuyerOrders())

  useEffect(() => {
    const handler = () => {
      setOrders([...getBuyerOrders()])
    }
    window.addEventListener('gv_orders_changed', handler)
    return () => window.removeEventListener('gv_orders_changed', handler)
  }, [])

  return {
    orders,
    addOrder: addBuyerOrder,
    updateOrder: updateBuyerOrder,
    cancelOrder: cancelBuyerOrder,
    rateOrder: rateBuyerOrder,
  }
}
