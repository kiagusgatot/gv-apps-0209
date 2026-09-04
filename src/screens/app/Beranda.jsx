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
  Wheat, HeartPulse, GraduationCap, Star, Check, AlertCircle,
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
  { id: 1, Icon: Zap, title: 'Tagihan Listrik hampir jatuh tempo', sub: 'Bayar sebelum 20 Agustus', time: '1 jam', unread: true, g: ['#F57F17', '#FBC02D'] },
  { id: 2, Icon: MessageCircle, title: 'Diskusi baru di Komunitas Tani', sub: '24 anggota berdiskusi soal gabah', time: '5 mnt', unread: true, g: ['#0D47A1', '#1976D2'] },
]
const NOTIF_PENJUAL = [
  { id: 1, Icon: Package, title: 'Pesanan baru dari Bu Rina', sub: 'Bayam organik 4 pcs · konfirmasi segera', time: '5 mnt', unread: true, g: ['#E65100', '#F57C00'] },
  { id: 2, Icon: AlertTriangle, title: 'Stok hampir habis', sub: 'Bayam organik tersisa 3 unit', time: '30 mnt', unread: true, g: ['#C62828', '#E53935'] },
]
const NOTIF_KREATOR = [
  { id: 1, Icon: Clapperboard, title: 'Video ditonton 500 kali hari ini', sub: 'Panen Perdana Padi Organik', time: '10 mnt', unread: true, g: ['#4A148C', '#7B1FA2'] },
  { id: 2, Icon: Users, title: '45 subscriber baru hari ini', sub: 'Channel Pak Tani Bogor berkembang', time: '1 jam', unread: true, g: ['#0D47A1', '#1976D2'] },
]
const NOTIF_ADMIN = [
  { id: 1, Icon: AlertTriangle, title: '3 laporan menunggu tindakanmu', sub: 'Komunitas Tani · 2, Komunitas Pemuda · 1', time: '15 mnt', unread: true, g: ['#C62828', '#E53935'] },
  { id: 2, Icon: Users, title: 'Komunitas Tani capai 12.400 anggota', sub: 'Milestone komunitas tercapai!', time: '2 jam', unread: false, g: ['#1B5E20', '#2E7D32'] },
]

// ── Notifikasi Screen ────────────────────────────────────────
function NotifScreen({ notifs, onClose, navigate }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-fade-in">
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)' }}>
        <div className="flex items-center justify-between px-4 pt-5 pb-4 relative z-10">
          <div className="flex items-center">
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ArrowLeft size={16} className="text-white/70" />
            </button>
            <p className="font-extrabold text-white text-[20px] tracking-tight leading-tight">Notifikasi</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-20 bg-white">
        {notifs.map(n => (
          <div key={n.id} className="flex items-start gap-3 px-5 py-4"
            style={{ background: n.unread ? 'rgba(240,253,244,0.5)' : 'transparent', borderBottom: '1px solid #F3F5F1' }}>
            <SkeuoIcon icon={n.Icon} gradient={n.g} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold leading-snug" style={{ color: '#0F1A13' }}>{n.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#6B7269' }}>{n.sub}</p>
              <p className="text-[12px] mt-1" style={{ color: '#9CA39A' }}>{n.time} lalu</p>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: PRIMARY }} />}
          </div>
        ))}
      </div>
      <BottomNav active="beranda" navigate={navigate} />
    </div>
  )
}

// ── Search Screen ────────────────────────────────────────────
function SearchScreen({ onClose, navigate }) {
  const [q, setQ] = useState('')
  const RECENTS = ['Beras Pandan Wangi', 'Komunitas UMKM', 'Top Up GV Pay']
  const POPULAR = ['GV TV Live', 'Komunitas Tani', 'Bayar Tagihan', 'Produk ESTO']
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-fade-in">
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
        <div className="flex items-center justify-between px-4 pt-5 pb-4 relative z-10">
          <div className="flex items-center w-full">
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]"
              style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.08)'}}>
              <ArrowLeft size={16} className="text-white/70"/>
            </button>
            <div className="flex-1 flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={{background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <Search size={15} className="text-white/70 flex-shrink-0"/>
              <input value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="Cari di G-Village..."
                className="flex-1 text-[13px] outline-none bg-transparent text-white placeholder-white/50"/>
              {q && <button onClick={()=>setQ('')} className="active:scale-[0.96] transition-transform"><X size={13} className="text-white/70"/></button>}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-5 pb-6">
          {!q ? (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{color:'#9CA39A'}}>Pencarian terakhir</p>
              {RECENTS.map(r=>(
                <button key={r} onClick={()=>setQ(r)} className="flex items-center gap-3 w-full py-2.5 hover:bg-surface-50 rounded-xl transition-colors" style={{borderBottom:'1px solid #F3F5F1'}}>
                  <Clock size={14} style={{color:'#D4D8D0'}} className="flex-shrink-0"/>
                  <span className="text-[13px]" style={{color:'#3A4038'}}>{r}</span>
                </button>
              ))}
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3 mt-4" style={{color:'#9CA39A'}}>Populer</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(s=>(
                  <button key={s} onClick={()=>setQ(s)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-semibold active:scale-[0.96] transition-transform"
                    style={{background:'#F0F4F0',color:PRIMARY}}>{s}</button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              {[['GV Media',navigate,'siaran'],['ESTO',navigate,'pasar'],['Komunitas',navigate,'komunitas']].map(([lbl,nav,to])=>(
                <button key={lbl} onClick={()=>{onClose();nav(to)}}
                  className="flex items-center gap-3 py-3 hover:bg-surface-50 rounded-xl transition-colors" style={{borderBottom:'1px solid #F3F5F1'}}>
                  <Search size={14} style={{color:'#9CA39A'}} className="flex-shrink-0"/>
                  <span className="text-[13px]" style={{color:'#3A4038'}}>Cari "{q}" di {lbl}</span>
                </button>
              ))}
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

