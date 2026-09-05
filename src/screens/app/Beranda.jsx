import React, { useState } from 'react'
import TanyaGV from '../../components/TanyaGV'
import AppScreenLayout from '@/components/templates/AppScreenLayout'
import AppHeader from '@/components/organisms/AppHeader'
import SearchBar from '@/components/molecules/SearchBar'
import BerandaBentoGrid from '@/components/organisms/BerandaBentoGrid'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import {
  Search, Bell, ChevronRight, CreditCard, Zap, ArrowRightLeft,
  Tv2, QrCode, Grid3x3, Package, Play, Mic, Receipt, BarChart2, Upload,
  Video as VideoIcon, Clock, Radio, X, ShoppingCart, Users, ShoppingBag, Droplets,
  Wheat, HeartPulse, GraduationCap, Star, Check, CheckCheck, Flame, AlertCircle,
  Sparkles, ToggleRight, MapPin, ArrowLeft,
  Store, Clapperboard, MessageCircle, FileText, Plus, ScanLine, MonitorPlay, Leaf, Battery, Coffee, Palette, Droplet, Box, Scale, Lightbulb, Camera, Mic2, Tv, Home, AlertTriangle, Egg, Bot
} from 'lucide-react'
import BottomNav from '../../components/BottomNav'

const S = {
  card: '0 2px 8px rgba(27,107,58,0.08), 0 1px 3px rgba(27,107,58,0.05)',
  cardMd: '0 4px 16px rgba(27,107,58,0.10), 0 2px 4px rgba(27,107,58,0.06)',
}
const PRIMARY = '#1B6B3A'

const SC_SUPER_ADMIN = [
  { label: 'Toko', Icon: Store, to: 'pasar-toko', g: ['#E65100', '#F57C00'] },
  { label: 'Studio', Icon: Clapperboard, to: 'studio', g: ['#4A148C', '#7B1FA2'] },
  { label: 'Komunitas', Icon: MessageCircle, to: 'komunitas', g: ['#0D47A1', '#1976D2'] },
  { label: 'Layanan', Icon: Grid3x3, to: 'more', g: ['#37474F', '#546E7A'] },
]

// ── Sedang Tayang — data selaras dengan Siaran ─────────────
const LIVE_CHANNELS = [
  { id: 'tv', name: 'GV TV', prog: 'Berita Desa Pagi', viewers: '1.2rb', Icon: Tv2, g: ['#0C3E1E', '#2E7D32'], type: 'TV', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=600&auto=format&fit=crop' },
  { id: 'radio', name: 'GV Radio', prog: 'Campursari Sore', viewers: '320', Icon: Radio, g: ['#880E4F', '#C2185B'], type: 'Radio', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
]

// ── Shortcuts per persona — 4 icon, no redundancy ──────────
const SC_WARGA_BARU = [
  { label: 'Top Up', Icon: Plus, to: 'bayar', g: ['#1B5E20', '#2E7D32'] },
  { label: 'Scan QRIS', Icon: ScanLine, to: 'bayar', g: ['#0C3E1E', '#1B6B3A'] },
  { label: 'ESTO', Icon: ShoppingCart, to: 'pasar', g: ['#E65100', '#F57C00'] },
  { label: 'Layanan', Icon: Grid3x3, to: 'more', g: ['#37474F', '#546E7A'] },
]
const SC_WARGA_AKTIF = [
  { label: 'Bayar', Icon: CreditCard, to: 'bayar', g: ['#1B5E20', '#2E7D32'] },
  { label: 'Transfer', Icon: ArrowRightLeft, to: 'bayar', g: ['#0D47A1', '#1976D2'] },
  { label: 'Pesanan', Icon: Package, to: 'pasar-pesanan', g: ['#E65100', '#F57C00'] },
  { label: 'Layanan', Icon: Grid3x3, to: 'more', g: ['#37474F', '#546E7A'] },
]
const SC_PENJUAL = [
  { label: 'Pesanan', Icon: Package, to: 'pasar-toko', g: ['#E65100', '#F57C00'] },
  { label: 'Toko', Icon: Store, to: 'pasar-toko', g: ['#0D47A1', '#1976D2'] },
  { label: 'GV Pay', Icon: CreditCard, to: 'bayar', g: ['#1B5E20', '#2E7D32'] },
  { label: 'Layanan', Icon: Grid3x3, to: 'more', g: ['#37474F', '#546E7A'] },
]
const SC_KREATOR = [
  { label: 'Studio', Icon: Clapperboard, to: 'studio', g: ['#4A148C', '#7B1FA2'] },
  { label: 'Upload', Icon: Upload, to: 'studio-upload', g: ['#0D47A1', '#1976D2'] },
  { label: 'GV Pay', Icon: CreditCard, to: 'bayar', g: ['#1B5E20', '#2E7D32'] },
  { label: 'Layanan', Icon: Grid3x3, to: 'more', g: ['#37474F', '#546E7A'] },
]
const SC_ADMIN = [
  { label: 'Komunitas', Icon: MessageCircle, to: 'komunitas', g: ['#0D47A1', '#1976D2'] },
  { label: 'GV Pay', Icon: CreditCard, to: 'bayar', g: ['#1B5E20', '#2E7D32'] },
  { label: 'Pesanan', Icon: Package, to: 'pasar-pesanan', g: ['#E65100', '#F57C00'] },
  { label: 'Layanan', Icon: Grid3x3, to: 'more', g: ['#37474F', '#546E7A'] },
]

// ── Thread data per persona ─────────────────────────────────
const T_WARGA_AKTIF = [
  { id: 'w1', Icon: Wheat, bg: '#E8F5E9', ic: '#2E7D32', community: 'Komunitas Tani', text: 'Harga gabah naik Rp 200/kg minggu ini — ada yang ngerasain?', replies: 24, likes: 87, time: '5 mnt' },
  { id: 'w2', Icon: ShoppingBag, bg: '#FFF3E0', ic: '#E65100', community: 'Komunitas UMKM', text: 'Tips foto produk pakai HP dengan hasil yang terlihat profesional', replies: 18, likes: 62, time: '12 mnt' },
  { id: 'w3', Icon: HeartPulse, bg: '#FFEBEE', ic: '#C62828', community: 'Komunitas Sehat', text: 'Jadwal Posyandu Agustus sudah diunggah di komunitas', replies: 7, likes: 31, time: '1 jam' },
]
const T_PENJUAL = [
  { id: 'p1', Icon: ShoppingBag, bg: '#FFF3E0', ic: '#E65100', community: 'Komunitas UMKM', text: 'Ada yang tahu harga cabai di pasar Bogor minggu ini? Mau nambah stok', replies: 14, likes: 39, time: '8 mnt' },
  { id: 'p2', Icon: ShoppingBag, bg: '#FFF3E0', ic: '#E65100', community: 'Komunitas UMKM', text: 'Cara bikin label produk yang menarik dan lolos SNI', replies: 21, likes: 55, time: '25 mnt' },
]
const T_KREATOR = [
  { id: 'k1', Icon: GraduationCap, bg: '#E3F2FD', ic: '#1565C0', community: 'Komunitas Pemuda', text: 'Konten tentang panen perdana tembus 10rb views — sharing strategi', replies: 33, likes: 124, time: '3 mnt' },
  { id: 'k2', Icon: ShoppingBag, bg: '#FFF3E0', ic: '#E65100', community: 'Komunitas UMKM', text: 'Cari kreator kolaborasi review produk lokal Bogor — DM terbuka', replies: 12, likes: 47, time: '18 mnt' },
]

// ── Notif data per persona ──────────────────────────────────
const NOTIF_WARGA = [
  {
    id: 'nw1',
    Icon: Zap,
    title: 'Tagihan Listrik PLN Hampir Jatuh Tempo',
    sub: 'Periode berjalan sebesar Rp 142.500. Bayar sebelum tanggal 20 untuk hindari denda pemutusan.',
    time: '45 mnt',
    group: 'Hari Ini',
    category: 'transaksi',
    unread: true,
    g: ['#F57F17', '#FBC02D'],
    actionLabel: 'Bayar Sekarang',
    actionTarget: 'bayar',
  },
  {
    id: 'nw2',
    Icon: MessageCircle,
    title: 'Diskusi Baru di Komunitas Tani',
    sub: 'Pak Tani Bogor: "Harga gabah naik Rp 200/kg minggu ini — ada yang ngerasain dampak panen?"',
    time: '2 jam',
    group: 'Hari Ini',
    category: 'komunitas',
    unread: true,
    g: ['#0D47A1', '#1976D2'],
    actionLabel: 'Buka Diskusi',
    actionTarget: 'komunitas',
  },
  {
    id: 'nw3',
    Icon: FileText,
    title: 'Penyaluran Bantuan Desa (Bansos) Tahap 3',
    sub: 'Pemerintah Desa mengumumkan jadwal penyaluran BLT Dana Desa hari Sabtu di Balai Desa.',
    time: '5 jam',
    group: 'Hari Ini',
    category: 'desa',
    unread: false,
    g: ['#1B5E20', '#2E7D32'],
    actionLabel: 'Lihat Pengumuman',
    actionTarget: 'beranda',
  },
  {
    id: 'nw4',
    Icon: ShoppingBag,
    title: 'Pesanan Telur Ayam Kampung Telah Tiba',
    sub: 'Pesanan dari Peternakan Pak Rohmat telah diterima di alamat Anda. Bantu ulas produk ini.',
    time: 'Kemarin',
    group: 'Kemarin',
    category: 'transaksi',
    unread: false,
    g: ['#E65100', '#F57C00'],
    actionLabel: 'Beri Ulasan',
    actionTarget: 'pasar',
  },
  {
    id: 'nw5',
    Icon: HeartPulse,
    title: 'Jadwal Posyandu & Imunisasi Balita',
    sub: 'Posyandu Melati Dusun 2 buka besok pagi pkl 08.30 WIB di Rumah Kader Posyandu.',
    time: 'Kemarin',
    group: 'Kemarin',
    category: 'desa',
    unread: false,
    g: ['#C62828', '#E53935'],
    actionLabel: 'Cek Jadwal',
    actionTarget: 'komunitas',
  },
  {
    id: 'nw6',
    Icon: CreditCard,
    title: 'Top Up Saldo GV Pay Berhasil',
    sub: 'Pengisian saldo sebesar Rp 100.000 via Transfer Bank BCA telah sukses masuk ke dompet Anda.',
    time: '3 hari',
    group: 'Minggu Ini',
    category: 'transaksi',
    unread: false,
    g: ['#1B5E20', '#2E7D32'],
    actionLabel: 'Cek Saldo',
    actionTarget: 'bayar',
  },
]

const NOTIF_PENJUAL = [
  {
    id: 'np1',
    Icon: Package,
    title: 'Pesanan Baru Masuk dari Bu Rina',
    sub: 'Bayam Organik Segar 4 ikat (Rp 34.000). Harap konfirmasi pesanan dan siapkan pengiriman.',
    time: '15 mnt',
    group: 'Hari Ini',
    category: 'transaksi',
    unread: true,
    g: ['#E65100', '#F57C00'],
    actionLabel: 'Proses Pesanan',
    actionTarget: 'pasar',
  },
  {
    id: 'np2',
    Icon: AlertTriangle,
    title: 'Peringatan: Stok Bayam Organik Menipis',
    sub: 'Sisa stok produk Bayam Organik tersisa 3 ikat di etalase tokomu. Segera perbarui inventaris.',
    time: '1 jam',
    group: 'Hari Ini',
    category: 'transaksi',
    unread: true,
    g: ['#C62828', '#E53935'],
    actionLabel: 'Update Stok',
    actionTarget: 'pasar',
  },
  {
    id: 'np3',
    Icon: Star,
    title: 'Ulasan Bintang 5 dari Pembeli',
    sub: 'Pak Asep memberikan ulasan puas: "Sayur sangat segar dan pengiriman cepat sampai tujuan!"',
    time: 'Kemarin',
    group: 'Kemarin',
    category: 'komunitas',
    unread: false,
    g: ['#F57F17', '#FBC02D'],
    actionLabel: 'Lihat Ulasan',
    actionTarget: 'pasar',
  },
  {
    id: 'np4',
    Icon: CreditCard,
    title: 'Dana Penjualan Masuk ke GV Pay',
    sub: 'Hasil penjualan minggu ini sebesar Rp 285.000 telah dicairkan ke saldo GV Pay Anda.',
    time: 'Kemarin',
    group: 'Kemarin',
    category: 'transaksi',
    unread: false,
    g: ['#1B5E20', '#2E7D32'],
    actionLabel: 'Cek Dompet',
    actionTarget: 'bayar',
  },
]

const NOTIF_KREATOR = [
  {
    id: 'nk1',
    Icon: Clapperboard,
    title: 'Video Anda Tembus 1.500 Penayangan!',
    sub: 'Video "Panen Perdana Padi Organik Musim Ini" sedang trending di tab Siaran Desa.',
    time: '25 mnt',
    group: 'Hari Ini',
    category: 'komunitas',
    unread: true,
    g: ['#4A148C', '#7B1FA2'],
    actionLabel: 'Lihat Statistik',
    actionTarget: 'siaran',
  },
  {
    id: 'nk2',
    Icon: Users,
    title: '68 Pengikut Baru Bergabung Hari Ini',
    sub: 'Saluran channel pertanian Anda berkembang pesat. Buat video baru untuk menjaga audiens.',
    time: '2 jam',
    group: 'Hari Ini',
    category: 'komunitas',
    unread: true,
    g: ['#0D47A1', '#1976D2'],
    actionLabel: 'Buka Studio',
    actionTarget: 'siaran',
  },
  {
    id: 'nk3',
    Icon: MessageCircle,
    title: '14 Komentar Baru pada Video Terakhir',
    sub: 'Warga desa antusias bertanya mengenai takaran kompos dan jenis bibit yang digunakan.',
    time: 'Kemarin',
    group: 'Kemarin',
    category: 'komunitas',
    unread: false,
    g: ['#1B5E20', '#2E7D32'],
    actionLabel: 'Balas Komentar',
    actionTarget: 'siaran',
  },
]

const NOTIF_ADMIN = [
  {
    id: 'na1',
    Icon: AlertTriangle,
    title: '3 Laporan Warga Memerlukan Penanganan',
    sub: 'Laporan saluran irigasi tersumbat di Komunitas Tani · 2, fasilitas umum · 1.',
    time: '15 mnt',
    group: 'Hari Ini',
    category: 'desa',
    unread: true,
    g: ['#C62828', '#E53935'],
    actionLabel: 'Tindak Lanjuti',
    actionTarget: 'komunitas',
  },
  {
    id: 'na2',
    Icon: Users,
    title: 'Milestone: Komunitas Tani Tembus 12.400 Warga',
    sub: 'Partisipasi warga desa terus meningkat secara aktif minggu ini.',
    time: '3 jam',
    group: 'Hari Ini',
    category: 'komunitas',
    unread: false,
    g: ['#1B5E20', '#2E7D32'],
    actionLabel: 'Lihat Grup',
    actionTarget: 'komunitas',
  },
]

// ── Searchable Data Repository ──────────────────────────────
const SEARCHABLE_PRODUCTS = [
  { id: 'p1', name: 'Beras Pandan Wangi 5kg', price: 68000, seller: 'Toko Tani Makmur', cat: 'Pangan', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300&auto=format&fit=crop' },
  { id: 'p2', name: 'Bayam Organik Segar 250g', price: 8500, seller: 'Ibu Sari', cat: 'Sayuran', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=300&auto=format&fit=crop' },
  { id: 'p3', name: 'Telur Ayam Kampung 10 btr', price: 32000, seller: 'Pak Rohmat', cat: 'Pangan', img: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=300&auto=format&fit=crop' },
  { id: 'p4', name: 'Kopi Robusta Segar 100g', price: 35000, seller: 'Pak Asep', cat: 'Minuman', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=300&auto=format&fit=crop' },
  { id: 'p5', name: 'Madu Hutan Murni 250ml', price: 65000, seller: 'Bu Dewi', cat: 'Kesehatan', img: 'https://images.unsplash.com/photo-1587049352847-4d4b124054da?q=80&w=300&auto=format&fit=crop' },
  { id: 'p6', name: 'Pupuk Kompos Organik 25kg', price: 45000, seller: 'UD Agro Desa', cat: 'Pertanian', img: 'https://images.unsplash.com/photo-1627341398565-d0c75cc9e5f5?q=80&w=300&auto=format&fit=crop' },
  { id: 'p7', name: 'Bibit Cabai Rawit Lokal', price: 15000, seller: 'Nursery GV', cat: 'Bibit', img: 'https://images.unsplash.com/photo-1588147602377-5b6515a452db?q=80&w=300&auto=format&fit=crop' },
]

const SEARCHABLE_MEDIA = [
  { id: 'm1', title: 'GV TV: Berita Desa & Panen Raya', sub: 'Siaran Langsung · 1.2rb penonton', type: 'Live TV', dur: 'LIVE', img: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=300&auto=format&fit=crop' },
  { id: 'm2', title: 'Panen Perdana Padi Organik Musim Ini', sub: 'Pak Tani Bogor · 15.4rb tayangan', type: 'VOD', dur: '18:24', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=300&auto=format&fit=crop' },
  { id: 'm3', title: 'Tips Pupuk Alami & Kendali Hama Wereng', sub: 'Kreator Tani · 8.9rb tayangan', type: 'VOD', dur: '12:40', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=300&auto=format&fit=crop' },
  { id: 'm4', title: 'Podcast Suara Desa: Petani Muda Sukses', sub: 'Eps. 12 · Host Kang Didin', type: 'Podcast', dur: '35:10', img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=300&auto=format&fit=crop' },
]

const SEARCHABLE_COMMUNITIES = [
  { id: 'c1', name: 'Komunitas Tani Maju', members: '12.400 anggota', desc: 'Wadah petani berbagi tips bibit, pupuk, dan harga gabah' },
  { id: 'c2', name: 'Komunitas UMKM Desa', members: '8.900 anggota', desc: 'Sinergi pengrajin dan pelaku usaha lokal Bogor' },
  { id: 'c3', name: 'Komunitas Pemuda Kreatif', members: '4.300 anggota', desc: 'Pemuda penggerak digitalisasi & konten kreatif desa' },
  { id: 'c4', name: 'Komunitas Sehat & Posyandu', members: '2.100 anggota', desc: 'Edukasi gizi, sanitasi, dan kesehatan keluarga desa' },
]

const SEARCHABLE_SERVICES = [
  { id: 's1', name: 'Bayar Tagihan Listrik PLN', desc: 'Beli token listrik prabayar atau bayar pascabayar', icon: Zap, target: 'bayar' },
  { id: 's2', name: 'Top Up Saldo GV Pay', desc: 'Isi ulang saldo via transfer bank atau agen terdekat', icon: CreditCard, target: 'bayar' },
  { id: 's3', name: 'Transfer Antar Warga', desc: 'Kirim uang ke sesama nomor GV Pay tanpa biaya admin', icon: ArrowRightLeft, target: 'bayar' },
  { id: 's4', name: 'Scan Bayar QRIS', desc: 'Pindai barcode QRIS di toko dan warung warga', icon: QrCode, target: 'bayar' },
]

// ── Notifikasi Screen ────────────────────────────────────────
function NotifScreen({ notifs, onClose, navigate }) {
  const [items, setItems] = useState(notifs)
  const [activeTab, setActiveTab] = useState('semua')

  const unreadCount = items.filter(n => n.unread).length

  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleAction = (n) => {
    setItems(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item))
    if (n.actionTarget) {
      onClose()
      setTimeout(() => navigate(n.actionTarget), 200)
    }
  }

  const TABS = [
    { id: 'semua', label: 'Semua', count: unreadCount },
    { id: 'transaksi', label: 'Transaksi' },
    { id: 'komunitas', label: 'Komunitas' },
    { id: 'desa', label: 'Info Desa' },
  ]

  const filtered = items.filter(n => {
    if (activeTab === 'semua') return true
    return n.category === activeTab
  })

  // Group by time group
  const groups = ['Hari Ini', 'Kemarin', 'Minggu Ini']
  const groupedItems = groups.map(grp => ({
    group: grp,
    list: filtered.filter(n => (n.group || 'Hari Ini') === grp)
  })).filter(g => g.list.length > 0)

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#FAFBF9] animate-fade-in">
      {/* Top Header */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)' }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/10">
              <ArrowLeft size={17} />
            </button>
            <div>
              <p className="font-extrabold text-white text-[19px] tracking-tight leading-tight">Notifikasi</p>
              <p className="text-[11px] text-emerald-100/70 font-medium">
                {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white bg-white/15 hover:bg-white/25 active:scale-95 transition-all border border-white/15"
            >
              <CheckCheck size={14} className="text-emerald-300" />
              <span>Tandai Dibaca</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar relative z-10">
          {TABS.map(tab => {
            const isSel = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSel ? 'bg-emerald-700 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notifications Body */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 no-scrollbar">
        {groupedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
              <Bell size={28} />
            </div>
            <p className="font-extrabold text-[15px] text-gray-900">Belum Ada Notifikasi</p>
            <p className="text-[12px] text-gray-500 mt-1 max-w-[260px] leading-relaxed">
              Tidak ada pemberitahuan baru di kategori ini. Semua pembaruan penting akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groupedItems.map((grp) => (
              <div key={grp.group} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-gray-400">
                    {grp.group}
                  </span>
                  <div className="flex-1 h-px bg-gray-200/70" />
                </div>

                <div className="flex flex-col gap-2.5">
                  {grp.list.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleAction(n)}
                      className={`relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.99] ${
                        n.unread
                          ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-500/10'
                          : 'bg-white/80 hover:bg-white border-gray-200/80 shadow-xs'
                      }`}
                    >
                      {/* Icon */}
                      <SkeuoIcon icon={n.Icon} gradient={n.g} size="sm" />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[13px] leading-snug ${n.unread ? 'font-extrabold text-gray-950' : 'font-bold text-gray-800'}`}>
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-1 ring-2 ring-emerald-100" />
                          )}
                        </div>

                        <p className="text-[11.5px] text-gray-600 mt-1 leading-relaxed">
                          {n.sub}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-gray-100">
                          <span className="text-[11px] font-medium text-gray-400">
                            {n.time} lalu
                          </span>

                          {n.actionLabel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAction(n)
                              }}
                              className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 group-hover:translate-x-0.5 transition-all"
                            >
                              <span>{n.actionLabel}</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="beranda" navigate={navigate} />
    </div>
  )
}

// ── Search Screen ────────────────────────────────────────────
function SearchScreen({ onClose, navigate }) {
  const [q, setQ] = useState('')
  const [activeTab, setActiveTab] = useState('semua')
  const [recents, setRecents] = useState(['Beras Pandan Wangi', 'Komunitas Tani', 'Top Up GV Pay', 'Pupuk Kompos'])

  const POPULAR = [
    { label: 'Beras Organik', hot: true },
    { label: 'GV TV Live', hot: true },
    { label: 'Pupuk NPK Cair', hot: true },
    { label: 'Bayar Listrik PLN', hot: true },
    { label: 'Komunitas Tani', hot: false },
    { label: 'Kopi Robusta Segar', hot: false },
  ]

  const removeRecent = (idx, e) => {
    e.stopPropagation()
    setRecents(prev => prev.filter((_, i) => i !== idx))
  }

  const clearAllRecents = () => {
    setRecents([])
  }

  const handleSelectQuery = (text) => {
    setQ(text)
    if (!recents.includes(text)) {
      setRecents(prev => [text, ...prev.slice(0, 5)])
    }
  }

  // Search filtering logic
  const queryLower = q.toLowerCase().trim()

  const filteredProducts = SEARCHABLE_PRODUCTS.filter(p =>
    !queryLower || p.name.toLowerCase().includes(queryLower) || p.seller.toLowerCase().includes(queryLower) || p.cat.toLowerCase().includes(queryLower)
  )

  const filteredMedia = SEARCHABLE_MEDIA.filter(m =>
    !queryLower || m.title.toLowerCase().includes(queryLower) || m.sub.toLowerCase().includes(queryLower) || m.type.toLowerCase().includes(queryLower)
  )

  const filteredCommunities = SEARCHABLE_COMMUNITIES.filter(c =>
    !queryLower || c.name.toLowerCase().includes(queryLower) || c.desc.toLowerCase().includes(queryLower)
  )

  const filteredServices = SEARCHABLE_SERVICES.filter(s =>
    !queryLower || s.name.toLowerCase().includes(queryLower) || s.desc.toLowerCase().includes(queryLower)
  )

  const totalResults = filteredProducts.length + filteredMedia.length + filteredCommunities.length + filteredServices.length

  const RESULT_TABS = [
    { id: 'semua', label: `Semua (${totalResults})` },
    { id: 'pasar', label: `Produk (${filteredProducts.length})` },
    { id: 'siaran', label: `Video (${filteredMedia.length})` },
    { id: 'komunitas', label: `Komunitas (${filteredCommunities.length})` },
    { id: 'layanan', label: `Layanan (${filteredServices.length})` },
  ]

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#FAFBF9] animate-fade-in">
      {/* Search Header */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)' }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-3.5 relative z-10">
          <div className="flex items-center w-full gap-2.5">
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/10">
              <ArrowLeft size={17} />
            </button>

            <div className="flex-1 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 bg-white/15 border border-white/20 focus-within:bg-white focus-within:text-gray-900 group transition-all">
              <Search size={16} className="text-emerald-200 group-focus-within:text-emerald-800 flex-shrink-0" />
              <input
                value={q}
                onChange={e => {
                  setQ(e.target.value)
                  if (!e.target.value) setActiveTab('semua')
                }}
                onKeyDown={e => e.key === 'Enter' && q.trim() && handleSelectQuery(q.trim())}
                autoFocus
                placeholder="Cari produk, video, komunitas, atau layanan..."
                className="flex-1 text-[13px] outline-none bg-transparent text-white group-focus-within:text-gray-900 placeholder-emerald-100/60 group-focus-within:placeholder-gray-400"
              />
              {q && (
                <button onClick={() => setQ('')} className="p-0.5 text-white/70 group-focus-within:text-gray-400 hover:text-white active:scale-90 transition-transform">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter tabs saat sedang mencari */}
        {q.trim() && (
          <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar relative z-10">
            {RESULT_TABS.map(tab => {
              const isSel = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold whitespace-nowrap transition-all ${
                    isSel
                      ? 'bg-white text-emerald-900 shadow-sm'
                      : 'bg-white/10 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
        {!q.trim() ? (
          /* Idle State: Recents, Popular, and Bento Discovery */
          <div className="flex flex-col gap-5">
            {/* Pencarian Terakhir */}
            {recents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    Pencarian Terakhir
                  </p>
                  <button
                    onClick={clearAllRecents}
                    className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div className="flex flex-col bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
                  {recents.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectQuery(r)}
                      className="flex items-center justify-between px-3.5 py-3 hover:bg-emerald-50/50 cursor-pointer border-b last:border-b-0 border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-[13px] font-medium text-gray-800 truncate">{r}</span>
                      </div>
                      <button
                        onClick={(e) => removeRecent(idx, e)}
                        className="p-1 text-gray-300 hover:text-gray-600 rounded-lg transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending & Populer */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5 px-1">
                <Flame size={14} className="text-amber-500" />
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                  Sedang Populer di Desa
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuery(item.label)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold bg-white hover:bg-emerald-50 border border-gray-200/80 text-gray-800 shadow-xs transition-all active:scale-95"
                  >
                    {item.hot ? (
                      <span className="text-[11px] font-bold text-amber-600">🔥 {idx + 1}.</span>
                    ) : (
                      <span className="text-[11px] font-bold text-gray-400">{idx + 1}.</span>
                    )}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jelajahi Kategori Cepat (Bento Discovery) */}
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2.5 px-1">
                Jelajahi Kategori
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => { onClose(); navigate('pasar') }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-orange-200/60 text-left hover:shadow-sm transition-all active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Store size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900 leading-tight">Pasar ESTO</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">Beras, sayur & pupuk</p>
                  </div>
                </button>

                <button
                  onClick={() => { onClose(); navigate('siaran') }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-200/60 text-left hover:shadow-sm transition-all active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Tv2 size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900 leading-tight">GV Media</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">TV live, VOD & podcast</p>
                  </div>
                </button>

                <button
                  onClick={() => { onClose(); navigate('komunitas') }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/60 text-left hover:shadow-sm transition-all active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900 leading-tight">Komunitas</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">Diskusi kelompok tani</p>
                  </div>
                </button>

                <button
                  onClick={() => { onClose(); navigate('bayar') }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-200/60 text-left hover:shadow-sm transition-all active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900 leading-tight">Layanan Cepat</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5">PLN, top up & QRIS</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Active Results State */
          <div className="flex flex-col gap-4">
            {totalResults === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <Search size={26} />
                </div>
                <p className="font-extrabold text-[15px] text-gray-900">
                  Tidak Ditemukan Hasil
                </p>
                <p className="text-[12px] text-gray-500 mt-1 max-w-[260px] leading-relaxed">
                  Tidak ada hasil yang cocok dengan kata kunci "{q}". Coba kata kunci lain di bawah:
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                  {['Beras', 'Tani', 'Listrik', 'Pupuk', 'Madu'].map((suggest) => (
                    <button
                      key={suggest}
                      onClick={() => handleSelectQuery(suggest)}
                      className="px-3 py-1.5 rounded-full text-[11.5px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                    >
                      {suggest}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Section Produk */}
                {(activeTab === 'semua' || activeTab === 'pasar') && filteredProducts.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                        Produk Pasar ESTO ({filteredProducts.length})
                      </p>
                      {activeTab === 'semua' && (
                        <button onClick={() => setActiveTab('pasar')} className="text-[11px] font-bold text-emerald-700">
                          Lihat Semua →
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => { onClose(); navigate('pasar') }}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 shadow-xs cursor-pointer group active:scale-[0.99] transition-all"
                        >
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {p.cat}
                              </span>
                              <span className="text-[11px] text-gray-400 truncate">{p.seller}</span>
                            </div>
                            <p className="text-[13px] font-bold text-gray-900 truncate leading-snug group-hover:text-emerald-800 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-[12.5px] font-extrabold text-emerald-800 mt-0.5">
                              Rp {p.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); onClose(); navigate('pasar') }}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs active:scale-95 transition-all"
                          >
                            Beli
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Video & Siaran */}
                {(activeTab === 'semua' || activeTab === 'siaran') && filteredMedia.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                        Video & Siaran GV Media ({filteredMedia.length})
                      </p>
                      {activeTab === 'semua' && (
                        <button onClick={() => setActiveTab('siaran')} className="text-[11px] font-bold text-emerald-700">
                          Lihat Semua →
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {filteredMedia.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => { onClose(); navigate('siaran') }}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 shadow-xs cursor-pointer group active:scale-[0.99] transition-all"
                        >
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900">
                            <img src={m.img} alt={m.title} className="w-full h-full object-cover opacity-90" />
                            <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/70 text-white font-bold text-[9px]">
                              {m.dur}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12.5px] font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                              {m.title}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{m.sub}</p>
                            <span className="inline-block mt-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {m.type}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); onClose(); navigate('siaran') }}
                            className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center text-gray-600 group-hover:text-emerald-800 transition-colors"
                          >
                            <Play size={13} fill="currentColor" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Komunitas */}
                {(activeTab === 'semua' || activeTab === 'komunitas') && filteredCommunities.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                        Komunitas Warga ({filteredCommunities.length})
                      </p>
                      {activeTab === 'semua' && (
                        <button onClick={() => setActiveTab('komunitas')} className="text-[11px] font-bold text-emerald-700">
                          Lihat Semua →
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {filteredCommunities.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => { onClose(); navigate('komunitas') }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 shadow-xs cursor-pointer group active:scale-[0.99] transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-[14px]">
                            {c.name.charAt(10) || 'K'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-bold text-gray-900 truncate leading-snug group-hover:text-emerald-800 transition-colors">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{c.desc}</p>
                            <span className="text-[10px] font-semibold text-emerald-700 mt-1 inline-block">
                              👥 {c.members}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); onClose(); navigate('komunitas') }}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            Buka
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Layanan Cepat */}
                {(activeTab === 'semua' || activeTab === 'layanan') && filteredServices.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-1">
                      Layanan & Fitur ({filteredServices.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {filteredServices.map((s) => {
                        const IconComponent = s.icon
                        return (
                          <div
                            key={s.id}
                            onClick={() => { onClose(); navigate(s.target) }}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 shadow-xs cursor-pointer group active:scale-[0.99] transition-all"
                          >
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                              <IconComponent size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-bold text-gray-900 truncate leading-snug group-hover:text-emerald-800 transition-colors">
                                {s.name}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5 truncate">{s.desc}</p>
                            </div>
                            <ChevronRight size={15} className="text-gray-400 group-hover:text-emerald-700 transition-colors" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <BottomNav active="beranda" navigate={navigate}/>
    </div>
  )
}

// ── QRIS Modal ──────────────────────────────────────────────
function QrisModal({ onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-t-3xl px-5 pt-4 pb-10 animate-slide-up"
        style={{
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          boxShadow: '0 -8px 40px rgba(15,26,19,0.15)'
        }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: '#D4D8D0' }} />
        <p className="text-[15px] font-extrabold text-center mb-1 headline-tight" style={{ color: '#0F1A13' }}>Scan QRIS</p>
        <p className="text-[12px] text-center mb-5" style={{ color: '#9CA39A' }}>Arahkan kamera ke kode QR untuk membayar</p>
        <div className="w-44 h-44 rounded-3xl mx-auto flex items-center justify-center mb-5"
          style={{ background: '#F5FBF5', border: `3px solid ${PRIMARY}` }}>
          <div className="grid grid-cols-3 gap-1.5 p-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-lg"
                style={{ background: [0, 2, 6, 8].includes(i) ? PRIMARY : '#E8F5E9' }} />
            ))}
          </div>
        </div>
        <button onClick={onClose} className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform"
          style={{
            background: `linear-gradient(135deg, #0C3E1E 0%, ${PRIMARY} 50%, #15803d 100%)`,
            boxShadow: '0 4px 16px rgba(27,107,58,0.25)'
          }}>Tutup</button>
      </div>
    </div>
  )
}

// ── More Modal ──────────────────────────────────────────────
function MoreModal({ onClose, navigate, userProfile }) {
  const isSeller = userProfile?.capabilities?.includes('Penjual')
  const isCreator = userProfile?.capabilities?.includes('Kreator')
  const isActive = userProfile?.hasWatchHistory || userProfile?.hasTransactions || isSeller || isCreator

  const ALL_GROUPS = [
    {
      label: 'Tagihan & Pembayaran', show: true, items: [
        { Icon: Zap, label: 'Listrik PLN', to: 'bayar-listrik', show: true, g: ['#F57F17', '#FBC02D'] },
        { Icon: MonitorPlay, label: 'Pulsa & Data', to: 'bayar-pulsa', show: true, g: ['#1565C0', '#1E88E5'] },
        { Icon: Droplets, label: 'PDAM Air', to: 'bayar-air', show: true, g: ['#0277BD', '#039BE5'] },
        { Icon: HeartPulse, label: 'BPJS', to: 'bayar-bpjs', show: true, g: ['#2E7D32', '#43A047'] },
        { Icon: Tv, label: 'TV Kabel', to: 'bayar-tv', show: true, g: ['#6A1B9A', '#8E24AA'] },
        { Icon: ScanLine, label: 'Internet', to: 'bayar-internet', show: true, g: ['#C62828', '#E53935'] },
        { Icon: Battery, label: 'Gas/PGN', to: 'bayar-gas', show: true, g: ['#EF6C00', '#F57C00'] },
        { Icon: GraduationCap, label: 'Pendidikan', to: 'bayar-pendidikan', show: true, g: ['#4527A0', '#5E35B1'] },
      ]
    },
    {
      label: 'GV Pay & Keuangan', show: true, items: [
        { Icon: CreditCard, label: 'GV Pay', to: 'bayar', show: true, g: ['#1B5E20', '#2E7D32'] },
        { Icon: Plus, label: 'Top Up', to: 'bayar-topup', show: true, g: ['#0D47A1', '#1976D2'] },
        { Icon: ArrowRightLeft, label: 'Transfer', to: 'bayar-transfer', show: true, g: ['#E65100', '#F57C00'] },
        { Icon: ScanLine, label: 'Scan QRIS', to: 'bayar-qris', show: true, g: ['#000000', '#424242'] },
        { Icon: Star, label: 'GV Poin', to: 'profile-poin', show: true, g: ['#F57F17', '#FBC02D'] },
        { Icon: FileText, label: 'Riwayat', to: 'bayar-riwayat', show: true, g: ['#37474F', '#546E7A'] },
      ]
    },
    {
      label: 'GV Media', show: true, items: [
        { Icon: Tv2, label: 'GV TV', to: 'siaran-live', show: true, g: ['#0C3E1E', '#2E7D32'] },
        { Icon: Radio, label: 'GV Radio', to: 'siaran-live', show: true, g: ['#880E4F', '#C2185B'] },
        { Icon: Mic, label: 'Podcast', to: 'siaran-podcast', show: true, g: ['#4A148C', '#7B1FA2'] },
        { Icon: Play, label: 'Video', to: 'siaran-video', show: true, g: ['#BF360C', '#E53935'] },
        { Icon: FileText, label: 'Berita', to: 'berita', show: true, g: ['#37474F', '#546E7A'] },
        { Icon: Star, label: 'GV+', to: 'siaran-gvplus', show: isActive, g: ['#D4AF37', '#F1C40F'] },
      ]
    },
    {
      label: 'ESTO & Belanja', show: true, items: [
        { Icon: ShoppingCart, label: 'Belanja', to: 'pasar', show: true, g: ['#E65100', '#F57C00'] },
        { Icon: Package, label: 'Pesanan', to: 'pasar-pesanan', show: isActive, g: ['#0D47A1', '#1976D2'] },
        { Icon: Store, label: 'Toko Saya', to: 'pasar-toko', show: isSeller, g: ['#1B5E20', '#2E7D32'] },
        { Icon: Star, label: 'Beri Rating', to: 'pasar-pesanan', show: isActive, g: ['#F57F17', '#FBC02D'] },
      ]
    },
    {
      label: 'Komunitas & Desa', show: true, items: [
        { Icon: MessageCircle, label: 'Forum', to: 'komunitas', show: true, g: ['#0D47A1', '#1976D2'] },
        { Icon: Home, label: 'Desa GV', to: 'komunitas', show: true, g: ['#2E7D32', '#4CAF50'] },
        { Icon: Clapperboard, label: 'Kreator Lokal', to: 'siaran-kreator', show: isActive, g: ['#4A148C', '#7B1FA2'] },
      ]
    },
    {
      label: 'Kreator & Studio', show: isCreator, items: [
        { Icon: Clapperboard, label: 'Studio', to: 'studio', show: true, g: ['#4A148C', '#7B1FA2'] },
        { Icon: Upload, label: 'Upload', to: 'studio-upload', show: true, g: ['#0D47A1', '#1976D2'] },
        { Icon: BarChart2, label: 'Analitik', to: 'studio-analitik', show: true, g: ['#37474F', '#546E7A'] },
        { Icon: Star, label: 'Membership', to: 'siaran-kreator', show: true, g: ['#F57F17', '#FBC02D'] },
      ]
    },
  ]
  const GROUPS = ALL_GROUPS.filter(g => g.show).map(g => ({ ...g, items: g.items.filter(i => i.show !== false) })).filter(g => g.items.length > 0)

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-t-3xl flex flex-col animate-slide-up"
        style={{
          maxHeight: '88%', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          boxShadow: '0 -8px 40px rgba(15,26,19,0.15)'
        }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-10 h-1 rounded-full" style={{ background: '#D4D8D0' }} /></div>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #E8EBE5' }}>
          <p className="text-[16px] font-extrabold headline-tight" style={{ color: '#0F1A13' }}>Semua Layanan</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-[0.96] transition-transform" style={{ background: '#F3F5F1' }}><X size={14} style={{ color: '#6B7269' }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-3">
          {GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA39A' }}>{group.label}</p>
              <div className="grid grid-cols-4 gap-2.5">
                {group.items.map(item => (
                  <button key={item.label} onClick={() => { onClose(); navigate(item.to) }}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl active:scale-[0.96] transition spotlight-border"
                    style={{ background: '#FAFBF9', border: '1px solid #E8EBE5' }}>
                    <SkeuoIcon icon={item.Icon} gradient={item.g} size="md" />
                    <span className="text-[9.5px] font-semibold text-center leading-tight px-1" style={{ color: '#3A4038' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ── Rekomendasi konten per persona ─────────────────────────
const REKOM_DEFAULT = [
  { title: 'Profil Desa Nagrak Bogor', type: 'VOD', dur: '12:30', g: ['#1B5E20', '#2E7D32'], image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=600&auto=format&fit=crop' },
  { title: 'Cara Top Up GV Pay', type: 'VOD', dur: '4:15', g: ['#0D47A1', '#1976D2'], image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop' },
  { title: 'Ngobrol UMKM Desa Ep.12', type: 'Pod', dur: '28:44', g: ['#4A148C', '#7B1FA2'], image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop' },
  { title: 'Pasar Tradisional Bogor', type: 'VOD', dur: '22:05', g: ['#37474F', '#546E7A'], image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=600&auto=format&fit=crop' },
]
const REKOM_SELLER = [
  { title: 'Cara Foto Produk yang Menarik', type: 'VOD', dur: '15:22', g: ['#1B5E20', '#2E7D32'], image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop' },
  { title: 'Strategi Pemasaran UMKM Desa', type: 'Pod', dur: '28:44', g: ['#4A148C', '#7B1FA2'], image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop' },
  { title: 'Kemasan Produk Lokal Berdaya', type: 'VOD', dur: '18:05', g: ['#BF360C', '#E53935'], image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop' },
  { title: 'Harga Jual yang Tepat', type: 'Pod', dur: '22:10', g: ['#37474F', '#546E7A'], image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop' },
]
const REKOM_CREATOR = [
  { title: 'Cara Edit Video di HP', type: 'VOD', dur: '12:30', g: ['#BF360C', '#E53935'], image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop' },
  { title: 'Tips Upload Konten GV TV', type: 'VOD', dur: '9:15', g: ['#1B5E20', '#2E7D32'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' },
  { title: 'Membangun Audiens Lokal', type: 'Pod', dur: '31:00', g: ['#4A148C', '#7B1FA2'], image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
  { title: 'Monetisasi Konten Desa', type: 'Pod', dur: '25:40', g: ['#0D47A1', '#1976D2'], image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop' },
]


// ── Produk ESTO per persona ─────────────────────────────────
const ESTO_PRODUCTS = {
  default: [
    { id: 'e1', name: 'Bayam Organik Segar 250g', price: 8500, Icon: Leaf, seller: 'Ibu Sari', cat: 'Sayur', g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop' },
    { id: 'e2', name: 'Telur Ayam Kampung 10 btr', price: 32000, Icon: Egg, seller: 'Pak Rohmat', cat: 'Pangan', g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop' },
    { id: 'e3', name: 'Kopi Robusta Segar 100g', price: 35000, Icon: Coffee, seller: 'Pak Asep', cat: 'Minuman', g: ['#4E342E', '#6D4C41'], image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop' },
    { id: 'e4', name: 'Madu Hutan Murni 250ml', price: 65000, Icon: Droplet, seller: 'Bu Dewi', cat: 'Kesehatan', g: ['#F57F17', '#FFCA28'], image: 'https://images.unsplash.com/photo-1587049352847-4d4b124054da?q=80&w=600&auto=format&fit=crop' },
  ],
  penjual: [
    { id: 'p1', name: 'Pupuk Organik Kompos 25kg', price: 45000, Icon: Leaf, seller: 'UD Agro', cat: 'Pertanian', g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1627341398565-d0c75cc9e5f5?q=80&w=600&auto=format&fit=crop' },
    { id: 'p2', name: 'Bibit Cabai Rawit Lokal', price: 15000, Icon: Leaf, seller: 'Nursery GV', cat: 'Bibit', g: ['#C62828', '#EF5350'], image: 'https://images.unsplash.com/photo-1588147602377-5b6515a452db?q=80&w=600&auto=format&fit=crop' },
    { id: 'p3', name: 'Kantong Kemasan Food Grade', price: 25000, Icon: Box, seller: 'Toko Pak RT', cat: 'Kemasan', g: ['#0277BD', '#29B6F6'], image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop' },
    { id: 'p4', name: 'Timbangan Digital 5kg', price: 185000, Icon: Scale, seller: 'Elektronik', cat: 'Alat', g: ['#4A148C', '#AB47BC'], image: 'https://images.unsplash.com/photo-1584442628467-336e4db67f70?q=80&w=600&auto=format&fit=crop' },
  ],
  kreator: [
    { id: 'k1', name: 'Ring Light LED 10 inch', price: 145000, Icon: Lightbulb, seller: 'Studio GV', cat: 'Studio', g: ['#F57F17', '#FFCA28'], image: 'https://images.unsplash.com/photo-1628116999252-4467bdab779c?q=80&w=600&auto=format&fit=crop' },
    { id: 'k2', name: 'Tripod Kamera Portable', price: 89000, Icon: Camera, seller: 'Foto Desa', cat: 'Aksesoris', g: ['#37474F', '#78909C'], image: 'https://images.unsplash.com/photo-1601002927237-7707e9d72c1c?q=80&w=600&auto=format&fit=crop' },
    { id: 'k3', name: 'Mikrofon Clip-On USB', price: 75000, Icon: Mic2, seller: 'Pak Budi', cat: 'Audio', g: ['#C62828', '#EF5350'], image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop' },
    { id: 'k4', name: 'Green Screen 1.5×2m', price: 120000, Icon: Clapperboard, seller: 'Studio GV', cat: 'Studio', g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1621644723932-a393c8d19769?q=80&w=600&auto=format&fit=crop' },
  ],
}

// ── Section Header ──────────────────────────────────────────
function SectionHead({ title, sub, to, navigate }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <p className="text-[15px] font-extrabold leading-tight headline-tight" style={{ color: '#0F1A13' }}>{title}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: '#9CA39A' }}>{sub}</p>}
      </div>
      {to && (
        <button onClick={() => navigate(to)} className="flex items-center gap-0.5 text-[11px] font-semibold pb-0.5 active:scale-[0.96] transition-transform" style={{ color: PRIMARY }}>
          Lihat semua <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────
export default function Beranda({ navigate, userData, userProfile }) {
  const [showNotif, setNotif] = useState(false)
  const [showSearch, setSearch] = useState(false)
  const [showQris, setQris] = useState(false)
  const [showMore, setMore] = useState(false)
  const [tanyaOpen, setTanyaOpen] = useState(false)

  const p = userProfile || { name: 'Pengguna', capabilities: [], balance: 0, points: 0, hasWatchHistory: false, urgentOrders: 0, hasActiveOrder: false, hasActiveBills: false, hasJoinedCommunity: false, hasTransactions: false }

  const isSeller = p.capabilities?.includes('Penjual')
  const isCreator = p.capabilities?.includes('Kreator')
  const isAdmin = p.capabilities?.includes('Admin Komunitas')
  const isSuperAdmin = p.capabilities?.includes('Super Admin')
  const isNewUser = !p.hasJoinedCommunity && !p.hasTransactions && !p.hasWatchHistory

  // Shortcuts & notifs per persona
  const shortcuts = isSuperAdmin ? SC_SUPER_ADMIN : isAdmin ? SC_ADMIN : isCreator ? SC_KREATOR : isSeller ? SC_PENJUAL : p.hasTransactions ? SC_WARGA_AKTIF : SC_WARGA_BARU
  const notifs = isAdmin ? NOTIF_ADMIN : isCreator ? NOTIF_KREATOR : isSeller ? NOTIF_PENJUAL : NOTIF_WARGA
  const threads = isCreator ? T_KREATOR : isSeller ? T_PENJUAL : T_WARGA_AKTIF
  const unread = notifs.filter(n => n.unread).length

  const hr = new Date().getHours()
  const greeting = hr < 11 ? 'Selamat pagi' : hr < 15 ? 'Selamat siang' : hr < 18 ? 'Selamat sore' : 'Selamat malam'

  const handleShortcut = (sc) => {
    if (sc.to === 'qris') return setQris(true)
    if (sc.to === 'more') return setMore(true)
    navigate(sc.to)
  }

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#FAFBF9' }}>
      {/* Overlays */}
      {showNotif && <NotifScreen notifs={notifs} onClose={() => setNotif(false)} navigate={navigate} />}
      {showSearch && <SearchScreen onClose={() => setSearch(false)} navigate={navigate} />}
      {showQris && <QrisModal onClose={() => setQris(false)} />}
      {showMore && <MoreModal onClose={() => setMore(false)} navigate={navigate} userProfile={userProfile} />}
      <TanyaGV currentScreen="beranda" navigate={navigate}
        openFromParent={tanyaOpen} onCloseParent={() => setTanyaOpen(false)} />

      <AppScreenLayout
        bgVariant="main"
        bgOverlay="dark-scrim"
        activeTab="beranda"
        navigate={navigate}
        showBottomNav={true}
        header={
          <div className="pt-1 pb-1">
            <AppHeader
              userName={p.name}
              userRole={userProfile?.label || (isSeller ? 'Penjual' : isCreator ? 'Kreator' : isAdmin ? 'Admin' : null)}
              userColor={userProfile?.color}
              unreadCount={unread}
              greeting={greeting}
              onOpenTanyaGV={() => setTanyaOpen(true)}
              onOpenNotif={() => setNotif(true)}
            />
            <div className="px-4 pb-2">
              <SearchBar
                readOnly
                variant="glass-dark"
                placeholder="Cari berita, produk ESTO, atau warga..."
                onClick={() => setSearch(true)}
              />
            </div>
          </div>
        }
      >
        <BerandaBentoGrid
          userProfile={userProfile}
          userData={userData}
          navigate={navigate}
          onOpenQris={() => setQris(true)}
          onOpenMore={() => setMore(true)}
          onOpenTanyaGV={() => setTanyaOpen(true)}
          liveChannels={LIVE_CHANNELS}
          estoProducts={isSuperAdmin || isSeller ? ESTO_PRODUCTS.penjual : isCreator ? ESTO_PRODUCTS.kreator : ESTO_PRODUCTS.default}
          threads={threads}
          rekomendasi={isCreator ? REKOM_CREATOR : isSeller ? REKOM_SELLER : REKOM_DEFAULT}
        />
      </AppScreenLayout>
    </div>
  )
}

