import React, { useState } from 'react'
import TanyaGV from '../../components/TanyaGV'
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
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${n.g[0]}, ${n.g[1]})` }}>
              <n.Icon size={20} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5} />
            </div>
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
                      <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 relative overflow-hidden" 
                        style={{ 
                          background: `linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`,
                          boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.25), inset 0 -2px 5px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.06)'
                        }}>
                        <item.Icon size={24} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                      </div>
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

      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg,#061A0D 0%,#0C3E1E 30%,#1B6B3A 100%)' }}>
          {/* Ambient glow */}
          <div className="absolute -top-20 -end-20 w-52 h-52 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />

          <div className="relative px-5 pt-5 pb-5">
            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[11px] text-white/40 tracking-wide font-medium">{greeting},</p>
                <p className="text-[18px] font-extrabold text-white leading-tight headline-tight mt-0.5">{p.name}</p>
                {(isSeller || isCreator || isAdmin) && (
                  <div className="flex gap-1.5 mt-1.5">
                    {isSeller && <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>Penjual</span>}
                    {isCreator && <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>Kreator</span>}
                    {isAdmin && <span className="text-[11px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>Admin</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setTanyaOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition active:scale-[0.96]"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Bot size={13} className="text-white/70" />
                  <span className="text-white/80 font-semibold text-[11px]">Tanya GV</span>
                </button>
                <button onClick={() => setNotif(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center relative active:scale-[0.96] transition-transform"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Bell size={16} className="text-white/70" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -end-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: '#EF4444', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}>
                      <span className="text-white text-[11px] font-bold">{unread}</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <button onClick={() => setSearch(true)} className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Search size={15} className="text-white/70" />
              <span className="text-[13px] text-white/70">Cari di G-Village...</span>
            </button>

            {/* GV Pay card */}
            <div className="rounded-2xl px-4 py-4 mb-5"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-white/40 mb-1 font-medium">Saldo GV Pay</p>
                  <p className="text-[26px] font-extrabold text-white leading-none tabular-nums headline-display">
                    {p.balance > 0 ? `Rp ${p.balance.toLocaleString('id')}` : 'Rp 0'}
                  </p>
                  {p.points > 0 && (
                    <p className="text-[12px] text-white/35 mt-1.5 flex items-center gap-1.5 font-medium">
                      <Star size={10} className="text-yellow-400/70" fill="currentColor" />
                      {p.points.toLocaleString('id')} GV Poin
                    </p>
                  )}
                </div>
                <button onClick={() => navigate('bayar')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-[0.96] transition-transform"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ChevronRight size={18} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Shortcuts — 4 icon */}
            <div className="grid grid-cols-4 gap-3">
              {shortcuts.map(sc => (
                <button key={sc.label} onClick={() => handleShortcut(sc)}
                  className="flex flex-col items-center gap-2 active:scale-[0.96] transition-transform">
                  <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${sc.g[0]} 0%, ${sc.g[1]} 100%)`,
                      boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.25), inset 0 -2px 5px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.06)'
                    }}>
                    <sc.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5} />
                  </div>
                  <span className="text-white/60 text-[12px] font-semibold">{sc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ BODY — per persona ══════════════════════════ */}
        <div className="px-4 pt-5 pb-6 flex flex-col gap-5">

          {/* ── WARGA BARU — Onboarding ── */}
          {isNewUser && (
            <div>
              <SectionHead title="Mulai perjalananmu" sub="3 langkah untuk memulai" navigate={navigate} />
              <div className="flex flex-col gap-2.5">
                {[
                  { step: 1, done: false, title: 'Top Up GV Pay', sub: 'Isi saldo untuk mulai bertransaksi', Icon: Plus, g: ['#1B5E20', '#2E7D32'], to: 'bayar' },
                  { step: 2, done: false, title: 'Bergabung komunitas', sub: 'Temukan warga desa di sekitarmu', Icon: MessageCircle, g: ['#0D47A1', '#1976D2'], to: 'komunitas' },
                  { step: 3, done: false, title: 'Jelajahi produk ESTO', sub: 'Belanja dari penjual lokal desa', Icon: ShoppingCart, g: ['#E65100', '#F57C00'], to: 'pasar' },
                ].map(s => (
                  <button key={s.step} onClick={() => navigate(s.to)}
                    className="flex items-center gap-3 p-4 rounded-2xl text-left active:scale-[0.96] transition spotlight-border"
                    style={{ background: '#fff', boxShadow: S.card }}>
                    {s.done ? (
                      <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0" style={{ background: '#E8F5E9' }}>
                        <Check size={24} style={{ color: '#2E7D32' }} strokeWidth={1.5} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 relative overflow-hidden" 
                        style={{ 
                          background: `linear-gradient(135deg, ${s.g[0]} 0%, ${s.g[1]} 100%)`,
                          boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.25), inset 0 -2px 5px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.06)'
                        }}>
                        <s.Icon size={24} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[13px] font-bold" style={{ color: '#0F1A13' }}>{s.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#9CA39A' }}>{s.sub}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: '#D4D8D0' }} className="flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── URGENCY CARD ── */}
          {(() => {
            if (isSuperAdmin) return (
              <div className="flex flex-col gap-2">
                {p.adminStats?.pendingReports > 0 && (
                  <button onClick={() => navigate('komunitas')}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left w-full active:scale-[0.96] transition-transform"
                    style={{ background: 'linear-gradient(135deg,#6A1B9A,#8E24AA)', boxShadow: '0 4px 16px rgba(106,27,154,0.25)' }}>
                    <AlertCircle size={18} className="text-white flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-white">{p.adminStats.pendingReports} laporan menunggu moderasi</p>
                      <p className="text-[12px] text-white/70 mt-0.5">Komunitas · perlu ditindaklanjuti</p>
                    </div>
                    <ChevronRight size={16} className="text-white/60" />
                  </button>
                )}
                {p.urgentOrders > 0 && (
                  <button onClick={() => navigate('pasar-toko')}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left w-full active:scale-[0.96] transition-transform"
                    style={{ background: 'linear-gradient(135deg,#F57F17,#F9A825)', boxShadow: '0 4px 16px rgba(245,127,23,0.25)' }}>
                    <Package size={18} className="text-white flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-white">{p.urgentOrders} pesanan menunggu konfirmasi</p>
                      <p className="text-[12px] text-white/70 mt-0.5">ESTO · konfirmasi sebelum jam 12.00</p>
                    </div>
                    <ChevronRight size={16} className="text-white/60" />
                  </button>
                )}
                {p.studioStats?.pendingContent > 0 && (
                  <button onClick={() => navigate('studio')}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left w-full active:scale-[0.96] transition-transform"
                    style={{ background: 'linear-gradient(135deg,#E65100,#F4511E)', boxShadow: '0 4px 16px rgba(230,81,0,0.25)' }}>
                    <Clock size={18} className="text-white flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-white">{p.studioStats.pendingContent} video sedang direview</p>
                      <p className="text-[12px] text-white/70 mt-0.5">Studio · estimasi tayang 2 jam</p>
                    </div>
                    <ChevronRight size={16} className="text-white/60" />
                  </button>
                )}
              </div>
            )
            if (isAdmin && p.adminStats?.pendingReports > 0) return (
              <button onClick={() => navigate('komunitas')}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left active:scale-[0.96] transition-transform w-full"
                style={{ background: 'linear-gradient(135deg,#6A1B9A,#8E24AA)', boxShadow: '0 4px 16px rgba(106,27,154,0.25)' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white">{p.adminStats.pendingReports} laporan menunggu tindakanmu</p>
                  <p className="text-[12px] text-white/70 mt-0.5">Tinjau dan moderasi komunitas</p>
                </div>
                <ChevronRight size={18} className="text-white/60" />
              </button>
            )
            if (p.urgentOrders > 0) return (
              <button onClick={() => navigate('pasar-toko')}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left active:scale-[0.96] transition-transform w-full"
                style={{ background: 'linear-gradient(135deg,#F57F17,#F9A825)', boxShadow: '0 4px 16px rgba(245,127,23,0.25)' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Package size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white">{p.urgentOrders} pesanan menunggu konfirmasi</p>
                  <p className="text-[12px] text-white/70 mt-0.5">Konfirmasi sebelum jam 12.00</p>
                </div>
                <ChevronRight size={18} className="text-white/60" />
              </button>
            )
            if (p.hasActiveOrder) return (
              <button onClick={() => navigate('pasar-pesanan')}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left active:scale-[0.96] transition-transform w-full"
                style={{ background: 'linear-gradient(135deg,#1565C0,#1976D2)', boxShadow: '0 4px 16px rgba(21,101,192,0.25)' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Package size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white">Pesanan dalam perjalanan</p>
                  <p className="text-[12px] text-white/70 mt-0.5">Estimasi tiba hari ini</p>
                </div>
                <ChevronRight size={18} className="text-white/60" />
              </button>
            )
            if (p.studioStats?.pendingContent > 0) return (
              <button onClick={() => navigate('studio')}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-left active:scale-[0.96] transition-transform w-full"
                style={{ background: 'linear-gradient(135deg,#E65100,#F4511E)', boxShadow: '0 4px 16px rgba(230,81,0,0.25)' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Clock size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white">{p.studioStats.pendingContent} video sedang direview</p>
                  <p className="text-[12px] text-white/70 mt-0.5">Estimasi tayang dalam 2 jam</p>
                </div>
                <ChevronRight size={18} className="text-white/60" />
              </button>
            )
            return null
          })()}

          {/* ── SUPER ADMIN WIDGET ── */}
          {isSuperAdmin && (
            <div>
              <p className="text-[11px] font-bold text-[#9CA39A] uppercase tracking-wider mb-3">Dashboard</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Pesanan Toko', val: String(p.urgentOrders || 0), sub: 'Menunggu konfirmasi', g: ['#F57F17', '#F9A825'], to: 'pasar-toko' },
                  { label: 'Laporan', val: String(p.adminStats?.pendingReports || 0), sub: 'Perlu moderasi', g: ['#6A1B9A', '#8E24AA'], to: 'komunitas' },
                  { label: 'Video Review', val: String(p.studioStats?.pendingContent || 0), sub: 'Sedang diproses', g: ['#E65100', '#F4511E'], to: 'studio' },
                  { label: 'Total Anggota', val: p.adminStats?.totalMembers || '0', sub: 'Di semua komunitas', g: ['#1B6B3A', '#2E7D32'], to: 'komunitas' },
                ].map(w => (
                  <button key={w.label} onClick={() => navigate(w.to)}
                    className="rounded-2xl p-4 text-left active:scale-[0.96] transition-transform"
                    style={{
                      background: `linear-gradient(145deg,${w.g[0]},${w.g[1]})`,
                      boxShadow: `0 4px 16px ${w.g[0]}30`
                    }}>
                    <p className="text-white text-[24px] font-extrabold leading-none mb-1 tabular-nums headline-display">{w.val}</p>
                    <p className="text-white font-bold text-[11px]">{w.label}</p>
                    <p className="text-white/50 text-[11px] mt-0.5">{w.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CAPABILITY WIDGET ── */}
          {isSeller && !isSuperAdmin && p.tokoStats && (
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: S.cardMd }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F3F5F1' }}>
                <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: PRIMARY }}>
                  <Package size={14} /> Toko hari ini
                </span>
                <button onClick={() => navigate('pasar-toko')}
                  className="text-[12px] font-bold px-2.5 py-1 rounded-lg active:scale-[0.96] transition-transform"
                  style={{ background: '#E8F5E9', color: '#1B5E20' }}>Buka Toko →</button>
              </div>
              <div className="flex divide-x divide-surface-100">
                {[['Pesanan baru', p.tokoStats.orders], ['Omzet', `Rp ${Math.round(p.tokoStats.revenue / 1000)}rb`], ['Produk', p.tokoStats.products]].map(([l, v]) => (
                  <div key={l} className="flex-1 text-center py-4">
                    <p className="text-[17px] font-extrabold text-[#0F1A13] tabular-nums">{v}</p>
                    <p className="text-[11px] text-[#9CA39A] mt-0.5 font-medium">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isCreator && !isSuperAdmin && p.studioStats && (
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: S.cardMd }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F3F5F1' }}>
                <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: '#BF360C' }}>
                  <VideoIcon size={14} /> Studio saya
                </span>
                <button onClick={() => navigate('studio')}
                  className="text-[12px] font-bold px-2.5 py-1 rounded-lg active:scale-[0.96] transition-transform"
                  style={{ background: '#FFEBEE', color: '#BF360C' }}>Buka Studio →</button>
              </div>
              <div className="flex divide-x divide-surface-100">
                {[['Ditonton', p.studioStats.views?.toLocaleString('id')], ['Poin', p.studioStats.points], ['Konten', p.studioStats.content]].map(([l, v]) => (
                  <div key={l} className="flex-1 text-center py-4">
                    <p className="text-[17px] font-extrabold text-[#0F1A13] tabular-nums">{v}</p>
                    <p className="text-[11px] text-[#9CA39A] mt-0.5 font-medium">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isAdmin && !isSuperAdmin && p.adminStats && (
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: S.cardMd }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F3F5F1' }}>
                <span className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: '#6A1B9A' }}>
                  <Users size={14} /> Admin Komunitas
                </span>
                <button onClick={() => navigate('komunitas')}
                  className="text-[12px] font-bold px-2.5 py-1 rounded-lg active:scale-[0.96] transition-transform"
                  style={{ background: '#F3E5F5', color: '#6A1B9A' }}>Kelola →</button>
              </div>
              <div className="flex divide-x divide-surface-100">
                {[['Komunitas', p.adminStats.communities], ['Anggota', p.adminStats.totalMembers], ['Thread', p.adminStats.threads]].map(([l, v]) => (
                  <div key={l} className="flex-1 text-center py-4">
                    <p className="text-[17px] font-extrabold text-[#0F1A13] tabular-nums">{v}</p>
                    <p className="text-[11px] text-[#9CA39A] mt-0.5 font-medium">{l}</p>
                  </div>
                ))}
              </div>
              {p.adminStats.pendingReports > 0 && (
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: '#FAF5FF', borderTop: '1px solid #F3E5F5' }}>
                  <span className="text-[11px] font-semibold" style={{ color: '#6A1B9A' }}>⚠️ {p.adminStats.pendingReports} laporan perlu ditinjau</span>
                  <button onClick={() => navigate('komunitas')}
                    className="text-[12px] font-bold px-2.5 py-1 rounded-lg text-white active:scale-[0.96] transition-transform" style={{ background: '#6A1B9A' }}>Tinjau</button>
                </div>
              )}
            </div>
          )}

          {/* ── TAGIHAN AKTIF — hanya Warga Aktif & Penjual ── */}
          {p.hasActiveBills && !isCreator && !isAdmin && (
            <div>
              <SectionHead title="Tagihan aktif" to="bayar" navigate={navigate} />
              <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: S.card }}>
                {[
                  { name: 'Listrik PLN', due: '20 Agt', amount: 145000, urgent: true, Icon: Zap, bg: '#FFF3E0', ic: '#E65100', to: 'bayar' },
                  { name: 'PDAM Air', due: '25 Agt', amount: 78000, urgent: false, Icon: Droplets, bg: '#E3F2FD', ic: '#1565C0', to: 'bayar' },
                ].map((t, i) => (
                  <div key={t.name} className={`flex items-center gap-3 px-4 py-3.5 ${i === 0 ? 'border-b border-surface-100' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>
                      <t.Icon size={16} style={{ color: t.ic }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#0F1A13]">{t.name}</p>
                      <p className={`text-[12px] mt-0.5 ${t.urgent ? 'text-red-500 font-medium' : 'text-[#9CA39A]'}`}>
                        {t.urgent ? '⚠️ ' : ''}{t.urgent ? 'Jatuh tempo ' : ''}{t.due} · Rp {t.amount.toLocaleString('id')}
                      </p>
                    </div>
                    <button onClick={() => navigate('bayar')}
                      className="px-3.5 py-2 rounded-xl text-[11px] font-bold text-white flex-shrink-0 active:scale-[0.96] transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${PRIMARY}, #15803d)`,
                        boxShadow: '0 2px 8px rgba(27,107,58,0.2)'
                      }}>Bayar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── KOMUNITAS — thread aktif ── */}
          {!isNewUser && (
            <div>
              <SectionHead
                title={isAdmin ? 'Komunitas dikelola' : 'Di komunitasmu'}
                sub={isAdmin ? 'Pantau aktivitas & moderasi' : 'Diskusi terbaru'}
                to="komunitas" navigate={navigate} />
              {isAdmin ? (
                <div className="flex flex-col gap-2.5">
                  {[
                    { name: 'Komunitas Tani', members: '12.4rb', Icon: Wheat, bg: '#E8F5E9', ic: '#2E7D32', reports: 2 },
                    { name: 'Komunitas Pemuda', members: '4.2rb', Icon: GraduationCap, bg: '#E3F2FD', ic: '#1565C0', reports: 1 },
                  ].map(k => (
                    <button key={k.name} onClick={() => navigate('komunitas')}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left active:scale-[0.96] transition-transform spotlight-border"
                      style={{ background: '#fff', boxShadow: S.card, borderInlineStart: `3px solid ${k.ic}` }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
                        <k.Icon size={18} style={{ color: k.ic }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#0F1A13]">{k.name}</p>
                        <p className="text-[12px] text-[#9CA39A]">{k.members} anggota</p>
                      </div>
                      {k.reports > 0 && (
                        <span className="text-[11px] font-bold px-2 py-1 rounded-full text-white flex-shrink-0"
                          style={{ background: '#C62828' }}>{k.reports} laporan</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {threads.map(t => (
                    <button key={t.id} onClick={() => navigate('komunitas')}
                      className="rounded-2xl px-4 py-3.5 text-left active:scale-[0.96] transition-transform spotlight-border"
                      style={{ background: '#fff', boxShadow: S.card, borderInlineStart: `3px solid ${t.ic}` }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>
                          <t.Icon size={9} style={{ color: t.ic }} />
                        </div>
                        <span className="text-[9.5px] font-bold" style={{ color: t.ic }}>{t.community}</span>
                        <span className="text-[#D4D8D0]">·</span>
                        <span className="text-[11px] text-[#9CA39A]">{t.time} lalu</span>
                      </div>
                      <p className="text-[12.5px] font-semibold text-[#0F1A13] leading-snug mb-2">{t.text}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[9.5px] text-[#9CA39A]">💬 {t.replies}</span>
                        <span className="text-[9.5px] text-[#9CA39A]">❤️ {t.likes}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PRODUK ESTO ── */}
          {!isNewUser && (
            <div>
              <SectionHead
                title="Produk dari desamu"
                sub={isSuperAdmin || isSeller ? 'Kebutuhan usaha & UMKM' : isCreator ? 'Perlengkapan kreator lokal' : 'Langsung dari petani & penjual desa'}
                to="pasar" navigate={navigate} />
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
                {(isSuperAdmin || isSeller ? ESTO_PRODUCTS.penjual : isCreator ? ESTO_PRODUCTS.kreator : ESTO_PRODUCTS.default).map(prod => (
                  <button key={prod.id} onClick={() => navigate('pasar')}
                    className="flex-shrink-0 w-36 bg-white rounded-2xl overflow-hidden text-left active:scale-[0.96] transition-transform spotlight-border"
                    style={{ boxShadow: S.card }}>
                    <div className="h-24 flex items-center justify-center relative bg-surface-100">
                      {prod.image ? (
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner" style={{ background: `linear-gradient(135deg, ${prod.g[0]} 0%, ${prod.g[1]} 100%)` }}>
                          <prod.Icon size={24} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="px-2.5 pt-2 pb-3">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md mb-1 inline-block"
                        style={{ background: `${prod.g[0]}22`, color: prod.g[1] }}>{prod.cat}</span>
                      <p className="text-[11px] font-bold text-[#0F1A13] leading-snug line-clamp-2 mb-1">{prod.name}</p>
                      <p className="text-[12px] text-[#9CA39A] mb-1.5">{prod.seller}</p>
                      <p className="text-[13px] font-extrabold tabular-nums" style={{ color: PRIMARY }}>Rp {prod.price.toLocaleString('id')}</p>
                    </div>
                  </button>
                ))}
                {/* Lihat semua card */}
                <button onClick={() => navigate('pasar')}
                  className="flex-shrink-0 w-24 bg-white rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-[0.96] transition-transform"
                  style={{ boxShadow: S.card }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${PRIMARY}12` }}>
                    <ChevronRight size={18} style={{ color: PRIMARY }} />
                  </div>
                  <p className="text-[12px] font-bold text-center leading-tight" style={{ color: PRIMARY }}>Lihat Semua</p>
                </button>
              </div>
            </div>
          )}

          {/* ── REKOMENDASI KONTEN — per persona ── */}
          {(isCreator || isSeller || !isNewUser) && (
            <div>
              <SectionHead
                title="Rekomendasi untukmu"
                sub={isSeller ? 'Konten untuk penjual' : isCreator ? 'Inspirasi kreator' : 'Konten pilihan minggu ini'}
                to="siaran" navigate={navigate} />
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
                {(isCreator ? REKOM_CREATOR : isSeller ? REKOM_SELLER : REKOM_DEFAULT).map((r, i) => (
                  <button key={i} onClick={() => navigate('siaran')}
                    className="flex-shrink-0 w-36 rounded-2xl overflow-hidden text-left active:scale-[0.96] transition-transform bg-white spotlight-border"
                    style={{ boxShadow: S.card }}>
                    <div className="h-20 flex items-center justify-center relative bg-surface-100">
                      {r.image ? (
                        <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0" style={{ background: `linear-gradient(145deg,${r.g[0]},${r.g[1]})` }} />
                      )}
                      
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10 p-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                        {r.type === 'VOD'
                          ? <Play size={18} className="text-white" style={{ fill: 'rgba(255,255,255,0.8)' }} />
                          : <Mic size={18} className="text-white" />}
                      </div>

                      <span className="absolute top-2 start-2 text-[11px] font-bold text-white px-1.5 py-0.5 rounded-md z-10"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>{r.type}</span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[12px] font-bold text-[#0F1A13] leading-snug line-clamp-2 mb-1">{r.title}</p>
                      <p className="text-[11px] text-[#9CA39A] tabular-nums">{r.dur}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SEDANG TAYANG — selaras data Siaran ── */}
          <div>
            <SectionHead title="Sedang tayang" sub="Live sekarang di GV Media" to="siaran" navigate={navigate} />
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {LIVE_CHANNELS.map(ch => (
                <button key={ch.id} onClick={() => navigate('siaran')}
                  className="flex-shrink-0 w-40 rounded-2xl overflow-hidden text-left active:scale-[0.96] transition-transform bg-white spotlight-border"
                  style={{ boxShadow: S.cardMd }}>
                  <div className="flex items-center justify-center relative bg-surface-100" style={{ height: 72 }}>
                    {ch.image ? (
                      <img src={ch.image} alt={ch.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0" style={{ background: `linear-gradient(145deg,${ch.g[0]},${ch.g[1]})` }} />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <ch.Icon size={24} className="text-white/70 relative z-10" />
                    <span className="absolute top-2 start-2 flex items-center gap-1 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-md z-10"
                      style={{ background: 'rgba(229,57,53,0.9)', boxShadow: '0 2px 6px rgba(229,57,53,0.3)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />LIVE
                    </span>
                    <span className="absolute top-2 end-2 text-[11px] text-white font-semibold px-1.5 py-0.5 rounded-md z-10"
                      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>{ch.type}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] font-bold text-[#0F1A13] line-clamp-2">{ch.name}</p>
                    <p className="text-[9.5px] text-[#6B7269] line-clamp-2 mt-0.5">{ch.prog}</p>
                    <p className="text-[11px] text-[#9CA39A] mt-1 tabular-nums">{ch.viewers} penonton</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <BottomNav active="beranda" navigate={navigate} />
    </div>
  )
}
