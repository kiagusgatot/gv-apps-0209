import React, { useState } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import SearchBar from '@/components/molecules/SearchBar'
import GlassCard from '@/components/atoms/GlassCard'
import AppButton from '@/components/atoms/AppButton'
import Badge from '@/components/atoms/Badge'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import SectionHeader from '@/components/molecules/SectionHeader'
import { Search, Play, Clock, Sparkles, Tv2, Radio, ArrowLeft as ArrowLeft2, ChevronRight, Lock, X,
  ExternalLink, Bell, Users, Crown, Headphones, CheckCircle,
  Pause, SkipBack, SkipForward, Calendar, MessageCircle, Send,
  ArrowLeft, Video as VideoIcon, Info, Heart, Share2, Mic, Clapperboard, Home, UserCheck, User, MoreHorizontal,
  Flame, Check, Volume2, Eye, UserPlus, Bookmark, ChevronDown, ChevronUp, Download, ShieldCheck, Maximize2, Zap, RotateCcw, RotateCw } from 'lucide-react'
import BottomNav from '../../components/BottomNav'
import PlayerAdsBanner from '../../components/ads/PlayerAdsBanner'

const PRIMARY = '#1B6B3A'

const S = {
  card:   '0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  cardMd: '0 4px 16px rgba(27,107,58,0.08), 0 2px 4px rgba(0,0,0,0.04)',
  cardLg: '0 8px 24px rgba(27,107,58,0.12), 0 3px 8px rgba(0,0,0,0.06)',
  sheet:  '0 -4px 32px rgba(0,0,0,0.18)',
}
const noBorder = { style: 'none' }

// ── Micro ──────────────────────────────────────────────────
const GVPlusBadge = ({ sm }) => (
  <span className={`font-extrabold tracking-wide rounded-md ${sm?'text-[11px] px-1.5 py-0.5':'text-[11px] px-2 py-0.5'}`}
    style={{background:'linear-gradient(90deg,#F57F17,#F9A825)',color:'#fff'}}>GV+</span>
)
const LiveBadge = () => (
  <span className="flex items-center gap-1 text-[11px] font-extrabold text-white px-1.5 py-0.5 rounded-md"
    style={{background:'#E53935'}}>
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block"/>LIVE
  </span>
)
function Toast({ message, onDone }) {
  React.useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t) }, [])
  return (
    <div className="absolute bottom-24 start-1/2 z-50 pointer-events-none" style={{transform:'translateX(-50%)'}}>
      <div className="bg-gray-900 text-white text-[11px] font-semibold px-4 py-2 rounded-full shadow-xl whitespace-nowrap">
        {message}
      </div>
    </div>
  )
}


// ── Tab Semua — konten personalisasi per persona ───────────
const UNTUK_KAMU = {
  penjual: [
    { id:'uk1', title:'Foto Produk Pakai HP, Hasil Pro',     ep:'Kreator · Tips',       dur:'11:20', g:['#E65100','#F4511E'], isGVPlus:false, image:'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop' },
    { id:'uk2', title:'Bincang Eko — Strategi UMKM Desa',    ep:'Bincang Eko · Eps. 1', dur:'18:00', g:['#00695C','#00897B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop' },
    { id:'uk3', title:'GV Update — Fitur Toko Terbaru',      ep:'GV Update',            dur:'6:30',  g:['#1B6B3A','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' },
    { id:'uk4', title:'Bisnis UMKM dari Nol',                ep:'Masterclass GV+',      dur:'38:00', g:['#E65100','#F4511E'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop' },
  ],
  kreator: [
    { id:'uk5', title:'Cara Upload Konten di GV Media',      ep:'Tutorial Kreator',     dur:'9:15',  g:['#1B5E20','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop' },
    { id:'uk6', title:'Membangun Audiens Lokal dari Desa',   ep:'Kreator · Tips',       dur:'31:00', g:['#4A148C','#7B1FA2'], isGVPlus:false, image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
    { id:'uk7', title:'Orkes Madun Mencari Biduan',          ep:'Drama Musik · Eps. 6', dur:'27:00', g:['#BF360C','#E53935'], isGVPlus:false, image:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
    { id:'uk8', title:'Perjalanan GV: 3 Tahun Desa',         ep:'Dokumenter GV+',       dur:'44:10', g:['#4A148C','#7B1FA2'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
  ],
  warga: [
    { id:'uk9',  title:'Kampung Sukasari si Loba Kahayang',  ep:'Drama Sunda · Eps. 1', dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600&auto=format&fit=crop' },
    { id:'uk10', title:'GV Update',                          ep:'Update Platform',      dur:'8:00',  g:['#1B6B3A','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' },
    { id:'uk11', title:'Talk Spot — Bincang Hangat',         ep:'Talk Spot · Eps. 3',   dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false, image:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop' },
    { id:'uk12', title:'Masterclass Pertanian Organik',      ep:'Masterclass GV+',      dur:'45:00', g:['#0D47A1','#1565C0'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop' },
  ],
}
const TRENDING = [
  { id:'tr1', title:'Bugar Ala Gatot',                       ep:'Bersama Aliong · Eps. 1',dur:'14:50',g:['#E65100','#F4511E'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  { id:'tr2', title:'Talk Spot — Bincang Hangat',            ep:'Talk Spot · Eps. 3',    dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false, image:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop' },
  { id:'tr3', title:'Kampung Sukasari si Loba Kahayang',     ep:'Drama Sunda · Eps. 1',  dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600&auto=format&fit=crop' },
  { id:'tr4', title:'Gerbang Desa — Season 1',               ep:'Dokudrama · Eps. 5',    dur:'32:00', g:['#1B5E20','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop' },
]

// ── Live data ──────────────────────────────────────────────
const GV_TV    = { id:'tv1', ch:'GV TV',    prog:'Berita Desa Pagi',  viewers:'1.2rb', sub:'09:00 – 10:00 WIB', g:['#061A0D','#1B6B3A'] }
const GV_RADIO = { id:'r1',  ch:'GV Radio', prog:'Campursari Sore',   viewers:'320',   sub:'15:00 – 18:00 WIB', g:['#1A0533','#4A148C'] }
const JADWAL_TV = [
  { time:'06:00', prog:'Selamat Pagi Desa' },
  { time:'08:00', prog:'Dokumenter Pertanian' },
  { time:'09:00', prog:'Berita Desa Pagi', live:true },
  { time:'10:00', prog:'Dialog Warga' },
  { time:'12:00', prog:'Berita Siang' },
  { time:'15:00', prog:'Dialog Desa' },
  { time:'17:00', prog:'Film Indonesia' },
  { time:'19:00', prog:'Berita Malam' },
]
const JADWAL_RADIO = [
  { time:'05:30', prog:'Subuh Bersama' },
  { time:'07:00', prog:'Kabar Desa Pagi' },
  { time:'09:00', prog:'Musik Pagi Nusantara' },
  { time:'12:00', prog:'Obrolan Siang' },
  { time:'15:00', prog:'Campursari Sore', live:true },
  { time:'18:00', prog:'Kajian Maghrib' },
  { time:'20:00', prog:'Malam Bersama GV Radio' },
]
const OBROLAN_TV = [
  { id:1, user:'adhika',            msg:'Selamat malam',                           bold:false },
  { id:2, user:'Risqi Japana',      msg:'salam sehat',                             bold:false },
  { id:3, user:'adhika',            msg:'halo mas risqi',                          bold:false },
  { id:4, user:'Oktavian Widianto', msg:'Selamat Hari Rabu',                       bold:true  },
  { id:5, user:'Oktavian Widianto', msg:'Selamat Hari Kamis',                      bold:true  },
  { id:6, user:'Andreas Budi P.',   msg:'Halo Mas Okta.. garang asem enak. Hehe', bold:true  },
  { id:7, user:'Adhika achmad',     msg:'Halo',                                    bold:false },
]
const OBROLAN_RADIO = [
  { id:1, user:'Budi Santoso', msg:'Lagunya enak banget 🎵',      bold:false },
  { id:2, user:'Ibu Sari',     msg:'Suka sama lagu ini',          bold:false },
  { id:3, user:'Pak Ahmad',    msg:'Request Kangen Band dong 🙏',  bold:true  },
  { id:4, user:'dewi_cantik',  msg:'Mantap GV Radio!',            bold:false },
  { id:5, user:'Budi Santoso', msg:'Setuju pak ahmad 😄',          bold:false },
]

// ── Video data — konten real dari aplikasi ─────────────────
const CONTINUE_WATCHING = [
  { id:'c1', title:'Gerbang Desa — Season 1', ep:'Eps. 5 · Dokudrama', dur:'32:00', pct:45, g:['#1B5E20','#2E7D32'], image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop' },
  { id:'c2', title:'Talk Spot — Bincang Hangat', ep:'Eps. 3 · Talk Show', dur:'22:00', pct:20, g:['#0D47A1','#1565C0'], image:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop' },
]
const ALL_ROWS = [
  { title:'Drama & Hiburan', items:[
    { id:'v1',  title:'Kampung Sukasari si Loba Kahayang', ep:'Drama Sunda · Eps. 1',  dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600&auto=format&fit=crop' },
    { id:'v2',  title:'Orkes Madun Mencari Biduan',        ep:'Drama Musik · Eps. 6',  dur:'27:00', g:['#BF360C','#E53935'], isGVPlus:false, image:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
    { id:'v3',  title:'Sampah',                            ep:'Drama Sosial · Eps. 3', dur:'21:00', g:['#4A148C','#7B1FA2'], isGVPlus:false, image:'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop' },
    { id:'v4',  title:'Pertandingan Volley',               ep:'Drama Olahraga · Eps. 4',dur:'19:00',g:['#1B5E20','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop' },
  ]},
  { title:'Talk Show & Diskusi', items:[
    { id:'v5',  title:'Talk Spot — Bincang Hangat',        ep:'Talk Spot · Eps. 3',   dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false, image:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop' },
    { id:'v6',  title:'Sambung Rasa',                      ep:'Sambung Rasa · Eps. 2', dur:'25:00', g:['#37474F','#546E7A'], isGVPlus:false, image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
    { id:'v7',  title:'Bincang Eko',                       ep:'Bincang Eko · Eps. 1',  dur:'18:00', g:['#00695C','#00897B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop' },
  ]},
  { title:'Info & Edukasi', items:[
    { id:'v8',  title:'GV Update',                         ep:'Update Platform',       dur:'8:00',  g:['#1B6B3A','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' },
    { id:'v9',  title:'Gerbang Desa — Season 1',           ep:'Dokudrama · Eps. 5',   dur:'32:00', g:['#1B5E20','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop' },
    { id:'v10', title:'Bugar Ala Gatot',                   ep:'Bersama Aliong · Eps. 1',dur:'14:50',g:['#E65100','#F4511E'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  ]},
]
const GVPLUS_ROWS = [
  { title:'Eksklusif GV+', items:[
    { id:'p1', title:'Masterclass Pertanian Organik',      ep:'Masterclass',          dur:'45:00', g:['#0D47A1','#1565C0'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop' },
    { id:'p2', title:'Teknik Irigasi Hemat Air',           ep:'Edukasi Premium',      dur:'22:15', g:['#00695C','#00897B'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop' },
    { id:'p3', title:'Bisnis UMKM dari Nol',               ep:'Masterclass',          dur:'38:00', g:['#E65100','#F4511E'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop' },
  ]},
  { title:'Dokumenter Premium', items:[
    { id:'p4', title:'Desa Digital: Kisah Sukamaju',       ep:'Dokumenter',           dur:'52:00', g:['#1B5E20','#2E7D32'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' },
    { id:'p5', title:'Perjalanan GV: 3 Tahun Desa',        ep:'Dokumenter',           dur:'44:10', g:['#4A148C','#7B1FA2'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
  ]},
]
const FREE_ROWS_BOTTOM = [
  { title:'Dari Kreator GV', items:[
    { id:'v11',title:'Panen Perdana Padi Organik',         ep:'Kreator · Eps. 1',     dur:'12:34', g:['#2E7D32','#388E3C'], isGVPlus:false, image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop' },
    { id:'v12',title:'Tanda Anak Kekurangan Gizi',         ep:'Kreator · Edukasi',    dur:'7:45',  g:['#C62828','#E53935'], isGVPlus:false, image:'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop' },
    { id:'v13',title:'Packaging Produk Anti Bocor',        ep:'Kreator · Tips UMKM',  dur:'9:15',  g:['#BF360C','#E53935'], isGVPlus:false, image:'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop' },
  ]},
]

// ── Podcast data — data real dari aplikasi ─────────────────
const SHOWS = [
  { id:'aliong',   name:'Bersama Aliong',   eps:2, desc:'Komedi & obrolan ala desa',  g:['#1B5E20','#2E7D32'], Icon: Mic },
  { id:'kabayan',  name:'Cerita Kabayan',   eps:3, desc:'Drama komedi Sunda',          g:['#0D47A1','#1565C0'], Icon: Clapperboard },
  { id:'sukasari', name:'Kampung Sukasari', eps:5, desc:'Dokudrama kehidupan desa',   g:['#4A148C','#7B1FA2'], Icon: Home },
]
const EPISODES = [
  { id:'e1',  title:'Kampung Sukasari si Loba Kahayang', show:'Kampung Sukasari', ep:'Drama Sunda · Eps. 1', dur:'24:00', showId:'sukasari', hasArt:true  },
  { id:'e2',  title:'Covid',                             show:'Bersama Aliong',   ep:'Bersama Aliong',       dur:'15:42', showId:'aliong',   hasArt:false },
  { id:'e3',  title:'Inspeksi',                          show:'Kampung Sukasari', ep:'Kampung Sukasari',     dur:'21:58', showId:'sukasari', hasArt:false },
  { id:'e4',  title:'Kabayan Promo',                     show:'Cerita Kabayan',   ep:'Cerita Kabayan',       dur:'1:28',  showId:'kabayan',  hasArt:false },
  { id:'e5',  title:'Bugar Ala Gatot',                   show:'Bersama Aliong',   ep:'Bersama Aliong · Eps. 1',dur:'14:50',showId:'aliong',  hasArt:true  },
  { id:'e6',  title:'Sampah',                            show:'Drama Sosial',     ep:'Drama Sosial · Eps. 3',dur:'21:00', showId:'sukasari', hasArt:true  },
  { id:'e7',  title:'Pertandingan Volley',               show:'Drama Olahraga',   ep:'Drama Olahraga · Eps. 4',dur:'19:00',showId:'kabayan', hasArt:true  },
  { id:'e8',  title:'Gerbang Desa — Season 1',           show:'Dokudrama',        ep:'Dokudrama · Eps. 5',   dur:'32:00', showId:'sukasari', hasArt:true  },
  { id:'e9',  title:'Orkes Madun Mencari Biduan',        show:'Drama Musik',      ep:'Drama Musik · Eps. 6', dur:'27:00', showId:'aliong',   hasArt:true  },
  { id:'e10', title:'Kebo Pundung',                      show:'Cerita Kabayan',   ep:'Cerita Kabayan · Eps. 1',dur:'9:03',showId:'kabayan',  hasArt:true  },
  { id:'e11', title:'Sekjur',                            show:'Cerita Kabayan',   ep:'Cerita Kabayan · Eps. 2',dur:'9:40',showId:'kabayan',  hasArt:true  },
]


// ── Creator community posts & video comments ───────────────
const CREATOR_POSTS = {
  k1: [
    { id:'cp1', text:'Musim hujan sudah tiba! Ini 3 tips dari saya untuk mempersiapkan lahan padi agar hasil panen tetap optimal. Drainase yang baik adalah kuncinya 👇', timestamp:'2 jam lalu', likes:142, comments:24, isExclusive:false },
    { id:'cp2', text:'[EKSKLUSIF] Rincian lengkap perhitungan ROI tanam padi organik vs konvensional selama 2 musim. Margin organik lebih tinggi 34% setelah biaya pupuk dihitung ulang. Spreadsheet-nya ada di lampiran...', timestamp:'1 hari lalu', likes:89, comments:31, isExclusive:true },
    { id:'cp3', text:'Terima kasih sudah mencapai 24 ribu pengikut! Milestone yang tidak pernah saya bayangkan ketika pertama kali upload video tentang padi organik tahun lalu 🌾 Semua karena dukungan kalian!', timestamp:'3 hari lalu', likes:334, comments:67, isExclusive:false },
    { id:'cp4', text:'[EKSKLUSIF] Q&A bulanan: Semua pertanyaan member tentang teknik irigasi dan manajemen air di musim kemarau sudah dijawab. Ada 23 pertanyaan yang masuk bulan ini...', timestamp:'5 hari lalu', likes:156, comments:89, isExclusive:true },
  ],
  k2: [
    { id:'cp5', text:'Update: kemasan baru produk UMKM binaan kami sudah jadi! Perbandingan sebelum-sesudah — perbedaannya signifikan untuk persepsi konsumen di pasar.', timestamp:'5 jam lalu', likes:98, comments:19, isExclusive:false },
    { id:'cp6', text:'[EKSKLUSIF] Template Canva kemasan yang saya pakai untuk klien UMKM. 12 variasi warna + format untuk berbagai ukuran. Bisa langsung edit nama produk kalian...', timestamp:'2 hari lalu', likes:67, comments:44, isExclusive:true },
    { id:'cp7', text:'Minggu ini kami mendampingi 3 UMKM di Bogor untuk foto produk pakai HP. Hasilnya di luar ekspektasi! Pencahayaan alami + background sederhana = foto yang layak jual.', timestamp:'4 hari lalu', likes:215, comments:38, isExclusive:false },
  ],
  k3: [
    { id:'cp8', text:'Mitos vs Fakta: "Anak susah makan = kurang nafsu makan". Faktanya ada 5 penyebab berbeda dan penanganan yang berbeda pula. Thread singkat 🧵', timestamp:'3 jam lalu', likes:567, comments:123, isExclusive:false },
    { id:'cp9', text:'Reminder: tidak semua demam anak butuh antibiotik. Panduan kapan harus ke dokter vs bisa dirawat di rumah — untuk orang tua desa yang akses klinik terbatas.', timestamp:'2 hari lalu', likes:892, comments:201, isExclusive:false },
  ],
}
const POST_COMMENTS_DATA = {
  cp1: [
    { id:'cc1', user:'Budi Santoso', avIcon:UserCheck, text:'Makasih tipsnya Pak! Lahan saya sudah siap pakai cara ini', likes:5, time:'1 jam lalu' },
    { id:'cc2', user:'Ibu Wati',     avIcon:User,    text:'Pak, kalau airnya tergenang lebih dari 3 hari bagaimana penanganannya?', likes:2, time:'45 mnt lalu' },
    { id:'cc3', user:'Agus Petani',  avIcon:User,    text:'Sudah saya coba tahun lalu, hasilnya beda kalau drainase diperhatikan dari awal', likes:8, time:'30 mnt lalu' },
    { id:'cc4', user:'Pak Rohmat',   avIcon:User,    text:'Terima kasih kontennya selalu berkualitas!', likes:3, time:'15 mnt lalu' },
  ],
  cp3: [
    { id:'cc5', user:'Sri Mulyani', avIcon:UserCheck, text:'Selamat Pak! Kontennya selalu bermanfaat dan mudah dipahami', likes:12, time:'2 hari lalu' },
    { id:'cc6', user:'Dedi Kusuma', avIcon:UserCheck, text:'Semoga terus berkarya dan menginspirasi petani muda!', likes:7, time:'2 hari lalu' },
  ],
  cp5: [
    { id:'cc7', user:'Rina UMKM',  avIcon:UserCheck, text:'Wow bagus banget perubahannya! Lebih profesional', likes:9, time:'4 jam lalu' },
    { id:'cc8', user:'Pak Hendra', avIcon:UserCheck, text:'Bisakah dibuatkan juga untuk packaging produk makanan basah?', likes:4, time:'3 jam lalu' },
  ],
  cp7: [
    { id:'cc9',  user:'Dewi UMKM',   avIcon:User, text:'Hasilnya keren! Bisa share preset lightroom-nya Kak?', likes:6, time:'3 hari lalu' },
    { id:'cc10', user:'Pak Surya',   avIcon:User, text:'Luar biasa, dulu saya pikir butuh kamera mahal untuk foto produk', likes:11, time:'2 hari lalu' },
  ],
  cp8: [
    { id:'cc11', user:'Bunda Aisyah',avIcon:User, text:'Sangat membantu sekali dok! Anak saya sering susah makan', likes:15, time:'2 jam lalu' },
    { id:'cc12', user:'Pak Dono',    avIcon:User, text:'Boleh minta konten tentang vitamin anak yang aman?', likes:8, time:'1 jam lalu' },
  ],
  default: [
    { id:'dcc1', user:'Pengguna GV', avIcon:User, text:'Terima kasih kontennya sangat bermanfaat!', likes:4, time:'1 jam lalu' },
  ],
}
const VIDEO_COMMENTS_DATA = {
  kc1: [
    { id:'vc1', user:'Pak Rahmat',   avIcon:UserCheck, text:'Sangat bermanfaat! Saya baru mulai coba padi organik musim ini', likes:8, time:'3 hari lalu' },
    { id:'vc2', user:'Dewi Pertani', avIcon:UserCheck, text:'Hasilnya memang beda Pak, sudah saya rasakan sendiri musim lalu', likes:5, time:'2 hari lalu' },
    { id:'vc3', user:'Gunawan',      avIcon:User,    text:'Pak boleh request konten tentang pupuk organik cair?', likes:3, time:'1 hari lalu' },
    { id:'vc4', user:'Ibu Surti',    avIcon:User,    text:'Kontennya selalu mudah dipahami oleh orang awam seperti saya', likes:11, time:'6 jam lalu' },
  ],
  kc6: [
    { id:'vc5', user:'Rina UMKM',   avIcon:UserCheck, text:'Akhirnya ada yang bahas packaging dengan benar!', likes:7, time:'2 hari lalu' },
    { id:'vc6', user:'Pak Budi',    avIcon:UserCheck, text:'Sudah saya coba dan orderan naik signifikan', likes:14, time:'1 hari lalu' },
  ],
  kc9: [
    { id:'vc7', user:'Bunda Lia',   avIcon:User, text:'Konten ini sangat membantu Dok, langsung dipraktikkan', likes:22, time:'4 hari lalu' },
    { id:'vc8', user:'Pak Anton',   avIcon:User, text:'Terima kasih Dok, akhirnya ada penjelasan yang mudah dipahami', likes:9, time:'3 hari lalu' },
  ],
  default: [
    { id:'dvc1', user:'Penonton GV', avIcon:User, text:'Konten yang sangat informatif, terima kasih!', likes:4, time:'1 hari lalu' },
    { id:'dvc2', user:'Warga Desa',  avIcon:User, text:'Lanjutkan terus konten seperti ini ya Pak!', likes:6, time:'12 jam lalu' },
  ],
}

// ── Kreator data ───────────────────────────────────────────
const KREATOR = [
  { id:'k1', name:'Pak Tani Bogor',    handle:'@paktanibogor', subs:'24.8rb', totalVideos:18, totalViews:'124rb',
    tags:'Pertanian · Panen', avatar:'🌾', color:'#2E7D32', bannerG:['#0C3E1E','#2E7D32'],
    bio:'Petani organik dari Bogor yang berbagi tips bertani modern dan sustainable farming untuk desa.',
    joinedDate:'Maret 2024',
    hasLinkedCommunity:true, hasMember:true, memberPrice:10000,
    memberBenefits:['Konten eksklusif cara olah lahan','Q&A langsung setiap Jumat','Badge member di komunitas','Grup diskusi privat'],
    memberTiers:[
      { id:'supporter', name:'Supporter', price:9000,
        benefits:['Akses konten eksklusif member','Badge supporter di komunitas'],
        badge:'🌱', badgeColor:'#66BB6A' },
      { id:'member', name:'Member', price:15000,
        benefits:['Semua keuntungan Supporter','Q&A langsung setiap Jumat','Grup diskusi privat'],
        badge:'🌾', badgeColor:'#2E7D32', recommended:true },
      { id:'premium', name:'Premium', price:29000,
        benefits:['Semua keuntungan Member','Konsultasi 1-on-1 bulanan','Early access semua konten','Sebut nama di video'],
        badge:'⭐', badgeColor:'#F57F17' },
    ],
    contents:[
      { id:'kc1', title:'Panen Perdana Padi Organik',        ep:'Eps. 1', dur:'12:34', views:'4.2rb', g:['#1B5E20','#2E7D32'], isExclusive:false, image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop' },
      { id:'kc2', title:'Cara Olah Tanah Bebas Kimia',       ep:'Eps. 2', dur:'18:20', views:'3.1rb', g:['#2E7D32','#388E3C'], isExclusive:false, image:'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=600&auto=format&fit=crop' },
      { id:'kc3', title:'Pemilihan Bibit Unggul Lokal',      ep:'Eps. 3', dur:'15:40', views:'2.8rb', g:['#1B5E20','#2E7D32'], isExclusive:false, image:'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=600&auto=format&fit=crop' },
      { id:'kc4', title:'Teknik Penyiraman Efisien [Member]',ep:'Eks. 1', dur:'22:10', views:'—',     g:['#0D47A1','#1565C0'], isExclusive:true,  image:'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop' },
      { id:'kc5', title:'Menghitung Keuntungan Panen [Member]',ep:'Eks. 2',dur:'19:30',views:'—',     g:['#4A148C','#7B1FA2'], isExclusive:true,  image:'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop' },
    ]},
  { id:'k2', name:'UMKM Kreatif Desa', handle:'@umkmdesa',     subs:'18.1rb', totalVideos:12, totalViews:'89rb',
    tags:'Bisnis · UMKM', avatar:'🏪', color:'#E65100', bannerG:['#3E1F00','#E65100'],
    bio:'Mendampingi UMKM desa naik kelas — dari kemasan hingga pemasaran digital.',
    joinedDate:'Juni 2024',
    hasLinkedCommunity:false, hasMember:true, memberPrice:15000,
    memberBenefits:['Template desain kemasan gratis','Konsultasi bisnis via chat','Badge member','Diskon produk ESTO 5%'],
    memberTiers:[
      { id:'starter', name:'Starter', price:10000,
        benefits:['Akses konten eksklusif member','Newsletter bisnis bulanan'],
        badge:'💡', badgeColor:'#F57F17' },
      { id:'member', name:'Member', price:20000,
        benefits:['Semua keuntungan Starter','Template desain kemasan gratis','Badge member khusus'],
        badge:'🏪', badgeColor:'#E65100', recommended:true },
      { id:'partner', name:'Partner', price:40000,
        benefits:['Semua keuntungan Member','Konsultasi bisnis via chat 2x/bulan','Diskon produk ESTO 10%','Fitur di konten bulanan'],
        badge:'🤝', badgeColor:'#BF360C' },
    ],
    contents:[
      { id:'kc6', title:'Packaging Produk Lokal Anti Bocor', ep:'Eps. 1', dur:'9:15',  views:'3.1rb', g:['#BF360C','#E53935'], isExclusive:false, image:'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop' },
      { id:'kc7', title:'Foto Produk Pakai HP, Hasil Pro',   ep:'Eps. 2', dur:'11:20', views:'2.4rb', g:['#E65100','#F4511E'], isExclusive:false, image:'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop' },
      { id:'kc8', title:'Strategi Harga untuk Pemula [Member]',ep:'Eks. 1',dur:'22:10',views:'—',     g:['#4A148C','#7B1FA2'], isExclusive:true,  image:'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop' },
    ]},
  { id:'k3', name:'Dokter Desa',        handle:'@dokterdesa',   subs:'31.5rb', totalVideos:24, totalViews:'210rb',
    tags:'Kesehatan · Edukasi', avatar:'💚', color:'#C62828', bannerG:['#3B0000','#C62828'],
    bio:'Dokter umum yang berbagi edukasi kesehatan praktis untuk keluarga di desa.',
    joinedDate:'Januari 2024',
    hasLinkedCommunity:false, hasMember:false, memberPrice:null, memberBenefits:[],
    contents:[
      { id:'kc9',  title:'Tanda Anak Kekurangan Gizi',       ep:'Eps. 1', dur:'7:45',  views:'8.9rb', g:['#880E4F','#C2185B'], isExclusive:false, image:'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop' },
      { id:'kc10', title:'Cara Rawat Luka Bakar Ringan',      ep:'Eps. 2', dur:'5:30',  views:'6.2rb', g:['#C62828','#E53935'], isExclusive:false, image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop' },
      { id:'kc11', title:'Jadwal Imunisasi Anak Lengkap',     ep:'Eps. 3', dur:'9:10',  views:'5.1rb', g:['#1B5E20','#2E7D32'], isExclusive:false, image:'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop' },
    ]},
]

// ── Shared: GV+ Paywall ────────────────────────────────────
// ── Shared: GV+ Paywall ────────────────────────────────────
function GVPlusPage({ content, onClose }) {
  const [period, setPeriod] = useState('quarterly')

  const PLANS = {
    monthly:   { label:'Bulanan',  price:'Rp 19.000', per:'/bulan',   orig:'Rp 35.000', badge:null,           saving:null, rate:'Rp 19.000/bln' },
    quarterly: { label:'3 Bulan', price:'Rp 49.000', per:'/3 bulan', orig:'Rp 105.000', badge:'Paling Populer', saving:'Hemat 53%', rate:'Rp 16.333/bln' },
    yearly:    { label:'Tahunan', price:'Rp 179.000', per:'/tahun',   orig:'Rp 420.000', badge:'Nilai Terbaik', saving:'Hemat 57%', rate:'Rp 14.916/bln' },
  }

  const BENEFITS = [
    { title: 'Nonton Tanpa Iklan', desc: 'Bebas jeda iklan di semua tayangan', icon: '🚫' },
    { title: 'Konten Eksklusif GV+', desc: 'Akses penuh serial & film dokumenter', icon: '👑' },
    { title: 'Unduh & Putar Offline', desc: 'Hemat kuota, tonton di mana saja', icon: '📥' },
    { title: 'Podcast Audio HQ', desc: 'Kualitas suara jernih sandiwara desa', icon: '🎧' },
    { title: 'Akses Episode Awal', desc: 'Tonton rilis baru sebelum publik', icon: '⚡' },
    { title: 'Semua Perangkat', desc: 'Tersedia di HP, tablet, dan Smart TV', icon: '📱' },
  ]

  const plan = PLANS[period]

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity" onClick={onClose}/>
      <div className="relative rounded-t-[32px] overflow-hidden flex flex-col z-10 max-h-[92%] shadow-2xl border-t border-emerald-500/30"
        style={{ background: 'linear-gradient(180deg, #092614 0%, #061A0E 40%, #041009 100%)' }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-white/20"/>
        </div>

        {/* Header Bar */}
        <div className="flex items-start justify-between px-5 pt-2 pb-3 flex-shrink-0 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-md shadow-amber-500/20"
                style={{ background: 'linear-gradient(90deg, #F57F17, #F9A825)' }}>
                <Crown size={13} className="text-white fill-white" />
                <span className="text-white font-black text-[13px] tracking-wide">GV+ VIP</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Akses Penuh
              </span>
            </div>
            <h2 className="text-[16px] font-extrabold text-white leading-snug">
              Nikmati GV Media Tanpa Batas
            </h2>
            <p className="text-[11.5px] text-white/70 mt-0.5">
              Tonton serial desa, siaran TV bebas iklan, dan audio eksklusif.
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 hover:bg-white/20 active:scale-95 transition text-white/80">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-8">

          {/* Triggered from content preview card */}
          {content?.title && (
            <div className="rounded-2xl p-3 mb-3 bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Konten Terkunci</p>
                <p className="text-[12.5px] font-bold text-white truncate">{content.title}</p>
                <p className="text-[10.5px] text-white/60">Gabung GV+ untuk langsung membuka tayangan ini</p>
              </div>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="mb-4">
            <p className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider mb-2.5">
              Keuntungan Langganan GV+
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2">
                  <span className="text-base flex-shrink-0 mt-0.5">{b.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-white leading-tight">{b.title}</p>
                    <p className="text-[10px] text-white/60 leading-tight mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
                Pilih Periode Paket
              </p>
              <span className="text-[10.5px] text-white/50">Dapat dibatalkan kapan saja</span>
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(PLANS).map(([id, p]) => {
                const active = period === id
                return (
                  <button
                    key={id}
                    onClick={() => setPeriod(id)}
                    className={`relative flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all active:scale-[0.99] ${
                      active
                        ? 'border-2 border-amber-400 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-emerald-500/10 shadow-lg shadow-amber-500/10'
                        : 'border border-white/15 bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                  >
                    {/* Left details */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Radio indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? 'border-amber-400 bg-amber-400' : 'border-white/40 bg-transparent'
                      }`}>
                        {active && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[13px] font-bold ${active ? 'text-white' : 'text-white/90'}`}>{p.label}</span>
                          {p.badge && (
                            <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                              {p.badge}
                            </span>
                          )}
                          {p.saving && (
                            <span className="text-[10px] font-bold text-emerald-300">
                              {p.saving}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 mt-0.5">
                          Setara <span className="text-white/80 font-semibold">{p.rate}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right Price */}
                    <div className="text-right flex-shrink-0 ms-2">
                      <p className={`text-[15px] font-black ${active ? 'text-amber-300' : 'text-white'}`}>{p.price}</p>
                      <p className="text-[10.5px] text-white/40 line-through">{p.orig}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Guarantee / Security */}
          <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-emerald-300/80 mb-3.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Garansi akses instan · Batalkan kapan saja tanpa komitmen</span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-[14px] font-extrabold text-white flex items-center justify-center gap-2 shadow-xl shadow-orange-950/40 active:scale-[0.98] transition-all bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
          >
            <Crown size={16} className="text-white fill-white" />
            <span>Mulai Langganan {plan.label} · {plan.price}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Shared: Membership sheet ───────────────────────────────
function MembershipSheet({ creator, onClose, onJoined }) {
  const tiers = creator.memberTiers || [
    { id:'member', name:'Member', price: creator.memberPrice || 15000,
      benefits: creator.memberBenefits || [], badge:'⭐', badgeColor: creator.color },
  ]
  const defaultTier = tiers.find(t=>t.recommended) || tiers[1] || tiers[0]
  const [selected, setSelected] = useState(defaultTier.id)
  const activeTier = tiers.find(t=>t.id===selected) || tiers[0]

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={onClose}/>
      <div className="relative rounded-t-[32px] bg-white flex flex-col z-10 max-h-[92%] overflow-hidden shadow-2xl border-t border-white/20">

        {/* Drag handle */}
        <div className="flex justify-center pt-3.5 pb-2 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-gray-200"/>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3.5 px-5 pt-1 pb-4 flex-shrink-0 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-black/5"
            style={{background:`linear-gradient(135deg, ${creator.bannerG ? creator.bannerG[0] : '#1B6B3A'}, ${creator.bannerG ? creator.bannerG[1] : '#2E7D32'})`}}>
            {creator.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[16px] font-extrabold text-gray-900 leading-tight truncate">{creator.name}</p>
              <CheckCircle size={14} className="text-emerald-600 fill-emerald-100 flex-shrink-0"/>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                <Crown size={10} className="fill-amber-500 text-amber-500"/> Channel Membership
              </span>
              <span className="text-[11px] text-gray-400">· {creator.subs}</span>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 hover:bg-gray-200 active:scale-95 transition">
            <X size={16} className="text-gray-500"/>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 px-5 pb-8 pt-4">
          {/* Tier selector */}
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[12px] font-extrabold text-gray-800 uppercase tracking-wider">Pilih Level Langganan</p>
            <span className="text-[11px] text-gray-400">Batalkan kapan saja</span>
          </div>
          <div className="flex flex-col gap-2.5 mb-5">
            {tiers.map(t=>{
              const active = selected === t.id
              return (
                <button key={t.id} onClick={()=>setSelected(t.id)}
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left w-full transition-all active:scale-[0.99] ${
                    active
                      ? 'border-2 border-emerald-600 bg-emerald-50/40 shadow-sm'
                      : 'border border-gray-200/80 bg-gray-50/50 hover:bg-gray-50'
                  }`}>
                  {/* Radio */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    active ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 bg-white'
                  }`}>
                    {active && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                  {/* Badge + name */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-white shadow-xs border border-black/5">
                      {t.badge}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className={`text-[13.5px] font-bold ${active ? 'text-emerald-950' : 'text-gray-800'}`}>{t.name}</p>
                        {t.recommended && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs">
                            Paling Populer
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-gray-400 mt-0.5">{t.benefits.length} keuntungan eksklusif</p>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-[15px] font-extrabold ${active ? 'text-emerald-700' : 'text-gray-900'}`}>
                      Rp {t.price.toLocaleString('id')}
                    </p>
                    <p className="text-[11px] text-gray-400">/bulan</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Benefits of selected tier */}
          <div className="bg-gray-50/90 rounded-2xl p-4 border border-gray-100 mb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={14} className="text-amber-500"/>
              <p className="text-[12px] font-extrabold text-gray-800">
                Keuntungan Tier {activeTier.name}
              </p>
            </div>
            <div className="space-y-2.5">
              {activeTier.benefits.map(b=>(
                <div key={b} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-emerald-100 text-emerald-700">
                    <Check size={11} strokeWidth={3}/>
                  </div>
                  <span className="text-[12.5px] text-gray-700 leading-snug">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price summary */}
          <div className="rounded-2xl p-4 flex items-center justify-between mb-4 bg-gradient-to-r from-amber-50/60 to-emerald-50/50 border border-amber-200/60">
            <div>
              <p className="text-[12px] font-bold text-gray-800">Total Langganan Bulanan</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Dapat dibatalkan sewaktu-waktu</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-black text-emerald-800">
                Rp {activeTier.price.toLocaleString('id')}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">per bulan</p>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 text-center mb-3.5 leading-relaxed">
            Aktivasi instan dan akses penuh ke video eksklusif, live chat kreator, & lencana member.
          </p>

          <button
            onClick={()=>{ onJoined(); onClose() }}
            className="w-full py-3.5 rounded-2xl text-[14px] font-extrabold text-white flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 shadow-emerald-900/20">
            <Crown size={16} className="text-amber-300 fill-amber-300"/> Gabung Tier {activeTier.name} · Rp {activeTier.price.toLocaleString('id')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Podcast: Full Player ───────────────────────────────────
function PodcastFullPlayer({ episode, onClose }) {
  const [playing, setPlaying]       = useState(true)
  const [progress, setProgress]     = useState(25)
  const [speed, setSpeed]           = useState('1.0x')
  const [liked, setLiked]           = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  React.useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setProgress(p => Math.min(100, p + 0.3)), 500)
    return () => clearInterval(t)
  }, [playing])

  const show = SHOWS.find(s => s.id === episode.showId) || SHOWS[0]

  const nextSpeed = () => {
    const SPEEDS = ['1.0x', '1.25x', '1.5x', '2.0x']
    const idx = SPEEDS.indexOf(speed)
    setSpeed(SPEEDS[(idx + 1) % SPEEDS.length])
  }

  // Calculate simulated time
  const totalSeconds = 942 // ~15:42
  const currentSec = Math.floor((progress / 100) * totalSeconds)
  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={onClose}/>
      <div className="relative rounded-t-[36px] bg-white flex flex-col z-10 max-h-[92%] overflow-hidden shadow-2xl border-t border-white/20">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-gray-200"/>
        </div>

        {/* Top Navbar */}
        <div className="flex items-center justify-between px-5 pt-1 pb-3 flex-shrink-0 border-b border-gray-100">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95 transition"
          >
            <ChevronDown size={18} />
          </button>
          <div className="text-center">
            <p className="text-[12px] font-black text-gray-900 leading-tight">Pemutar Podcast Desa</p>
            <p className="text-[10.5px] text-gray-400 font-medium">Global Village Audio</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLiked(!liked)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
                liked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={15} fill={liked ? '#DC2626' : 'none'} />
            </button>
          </div>
        </div>

        {/* Scrollable Center Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-8 flex flex-col items-center text-center">
          {/* Artwork 3D Squircle */}
          <div className="relative my-2">
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden border-4 border-white"
              style={{
                background: `linear-gradient(145deg, ${show.g[0]}, ${show.g[1]})`,
                boxShadow: `0 16px 32px ${show.g[0]}40`,
              }}
            >
              <show.Icon size={48} className="text-white drop-shadow-lg relative z-10" strokeWidth={1.5}/>
              <div className="absolute inset-0 bg-white/10" />
            </div>

            {/* Audio Wave Visualizer when playing */}
            {playing && (
              <div className="absolute -bottom-3 inset-x-0 flex items-center justify-center gap-1">
                {[8, 16, 24, 14, 20, 10, 18, 12].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-emerald-600 rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Episode & Show Title */}
          <div className="mt-5 mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10.5px] font-bold mb-1.5">
              <Headphones size={11} className="text-emerald-700" />
              <span>Audio Jernih · 320 kbps</span>
            </div>
            <h1 className="text-[18px] font-black text-gray-900 leading-snug max-w-[280px]">
              {episode.title}
            </h1>
            <p className="text-[13px] font-extrabold text-emerald-800 mt-1">
              {episode.show || show.name}
            </p>
            <p className="text-[11.5px] text-gray-400 mt-0.5">
              {episode.ep}
            </p>
          </div>

          {/* Interactive Scrubber Slider */}
          <div className="w-full mb-6">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const newPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100))
                setProgress(newPct)
              }}
              className="relative h-2 bg-gray-100 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-emerald-600 rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute end-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 shadow-md group-hover:scale-125 transition-transform" />
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-400 font-semibold mt-1.5 px-0.5">
              <span>{formatTime(currentSec)}</span>
              <span>{episode.dur}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-6 w-full mb-6">
            {/* Speed toggle */}
            <button
              onClick={nextSpeed}
              className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95 transition"
              title="Kecepatan pemutaran"
            >
              {speed}
            </button>

            {/* Rewind 10s */}
            <button
              onClick={() => setProgress(p => Math.max(0, p - 6))}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 active:scale-95 transition"
              title="Mundur 10 detik"
            >
              <RotateCcw size={20} />
            </button>

            {/* Play/Pause Main Button */}
            <button
              onClick={() => setPlaying(!playing)}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform bg-gradient-to-tr from-emerald-800 via-emerald-700 to-green-600 text-white shadow-emerald-900/30"
              style={{
                boxShadow: '0 8px 24px rgba(27,107,58,0.35)',
              }}
            >
              {playing ? (
                <Pause size={26} className="fill-white" />
              ) : (
                <Play size={26} className="fill-white translate-x-0.5" />
              )}
            </button>

            {/* Forward 10s */}
            <button
              onClick={() => setProgress(p => Math.min(100, p + 6))}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 active:scale-95 transition"
              title="Maju 10 detik"
            >
              <RotateCw size={20} />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
                bookmarked ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
              title="Simpan episode"
            >
              <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Episode Notes / Synopsis Card */}
          <div className="w-full bg-gray-50/80 rounded-2xl p-3.5 border border-gray-100 text-left">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Tentang Episode Ini
            </p>
            <p className="text-[12px] text-gray-700 leading-relaxed">
              Episode pilihan dari serial <span className="font-bold text-gray-900">{show.name}</span>. Menyajikan dialog hangat, cerita kearifan lokal, serta hiburan khas warga desa afiliasi Global Village.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Podcast: Persistent Mini Player ───────────────────────
function MiniPlayer({ episode, onExpand, onStop }) {
  const [playing, setPlaying] = useState(true)
  const show = SHOWS.find(s => s.id === episode.showId) || SHOWS[0]
  return (
    <div className="flex-shrink-0 relative" style={{background:'#fff',borderTop:'1px solid #F0F0F0',boxShadow:'0 -2px 8px rgba(0,0,0,0.08)'}}>
      {/* Progress bar */}
      <div className="absolute top-0 start-0 end-0 h-0.5" style={{background:'#E8F5E9'}}>
        <div className="h-full rounded-full" style={{width:'35%',background:'#1B6B3A'}}/>
      </div>
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shadow-inner relative flex-shrink-0 cursor-pointer overflow-hidden"
          style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}
          onClick={onExpand}>
          <show.Icon size={18} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5}/>
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onExpand}>
          <p className="text-[12px] font-bold text-gray-900 line-clamp-2">{episode.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{episode.ep}</p>
        </div>
        <button onClick={()=>setPlaying(!playing)}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 active:scale-[0.96] transition-transform"
          style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
          {playing?<Pause size={14} className="text-white" fill="white"/>:<Play size={14} className="text-white" fill="white"/>}
        </button>
        <button onClick={onStop} className="w-7 h-7 flex items-center justify-center flex-shrink-0">
          <X size={16} className="text-gray-400"/>
        </button>
      </div>
    </div>
  )
}

// ── Kirim Salam ────────────────────────────────────────────
function KirimSalam({ channel }) {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const handleSend = () => {
    if (!text.trim()) return
    setSent(true); setText('')
    setTimeout(()=>setSent(false),3000)
  }
  return (
    <div className="px-4 pt-4 pb-4">
      <p className="text-[12px] text-gray-400 mb-1">Salam pilihan ditampilkan di siaran {channel}</p>
      <p className="text-[12px] font-semibold mb-3" style={{color:'#1B6B3A'}}>Dikirim sebagai Member Global Village</p>
      {sent?(
        <div className="rounded-2xl px-4 py-3 flex items-center gap-2.5" style={{background:'#E8F5E9',border:'1.5px solid #A5D6A7'}}>
          <CheckCircle size={16} style={{color:'#1B6B3A'}}/>
          <span className="text-[12px] font-semibold" style={{color:'#1B5E20'}}>Salam berhasil dikirim!</span>
        </div>
      ):(
        <>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={3}
            placeholder="Tulis salam untuk keluarga & sahabat..."
            className="w-full rounded-2xl px-4 py-3 text-[12px] text-gray-700 resize-none outline-none"
            style={{border:'1.5px solid #E0E0E0',minHeight:80,background:'#FAFAFA'}}/>
          <button onClick={handleSend} disabled={!text.trim()}
            className="w-full mt-2.5 py-3 rounded-2xl text-[13px] font-bold transition active:scale-[0.96]"
            style={text.trim()?{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',color:'#fff',boxShadow:'0 2px 8px rgba(27,107,58,0.3)'}:{background:'#F0F0F0',color:'#BDBDBD'}}>
            Kirim
          </button>
        </>
      )}
    </div>
  )
}

// ── Obrolan Penonton ───────────────────────────────────────
const CHAT_COLORS = ['#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA','#00ACC1','#F4511E','#3949AB']
const getChatColor = (name) => CHAT_COLORS[name.split('').reduce((a,c)=>a+c.charCodeAt(0),0)%CHAT_COLORS.length]

function ObrolanPenonton({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMsg, setNewMsg] = useState('')
  const handleSend = () => {
    if (!newMsg.trim()) return
    setMessages(prev=>[...prev,{id:Date.now(),user:'Kamu',msg:newMsg,isMe:true}])
    setNewMsg('')
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{background:'#E53935'}}/>
        <span className="text-[12px] font-bold text-gray-900">Obrolan Penonton</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1" style={{background:'#FAFAFA'}}>
        {messages.map(m=>(
          <div key={m.id} className="leading-relaxed">
            <span className="text-[11px] font-extrabold me-1.5" style={{color:m.isMe?'#1B6B3A':getChatColor(m.user)}}>{m.user}</span>
            <span className={`text-[12px] ${m.isMe?'font-semibold':'text-gray-700'}`} style={m.isMe?{color:'#1B5E20'}:{}}>{m.msg}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 mt-1 opacity-40">
          <div className="flex gap-0.5">
            {[0,1,2].map(i=>(
              <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{background:'#9CA3AF',animationDelay:`${i*0.15}s`}}/>
            ))}
          </div>
          <span className="text-[12px] text-gray-400">beberapa orang sedang mengetik…</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0" style={{background:'#fff',borderTop:'1px solid #F0F0F0'}}>
        <div className="flex-1 flex items-center rounded-2xl px-3 py-2" style={{background:'#F5F5F5'}}>
          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') handleSend() }}
            placeholder="Tulis pesan live..." className="flex-1 text-[12px] outline-none text-gray-700 bg-transparent"/>
        </div>
        <button onClick={handleSend}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition"
          style={{background:newMsg.trim()?'#1B6B3A':'#E0E0E0',boxShadow:newMsg.trim()?'0 2px 6px rgba(27,107,58,0.3)':'none'}}>
          <Send size={14} className="text-white" style={{marginInlineStart:1}}/>
        </button>
      </div>
    </div>
  )
}

// ── Video card ─────────────────────────────────────────────
function VideoCard({ item, onGVPlus }) {
  return (
    <div onClick={()=>item.isGVPlus?onGVPlus(item):null}
      className="cursor-pointer active:scale-[0.96] transition-transform flex-shrink-0"
      style={{width:160,minWidth:160}}>
      <div className="rounded-2xl overflow-hidden relative spotlight-border" style={{height:90,background:`linear-gradient(135deg,${item.g[0]},${item.g[1]})`,boxShadow:S.card}}>
        {item.isGVPlus&&<div className="absolute inset-0 rounded-2xl" style={{background:'rgba(0,0,0,0.35)'}}/>}
        <div className="absolute inset-0 flex items-center justify-center">
          {item.isGVPlus
            ?<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'rgba(249,168,37,0.25)',border:'1.5px solid rgba(249,168,37,0.5)'}}><Lock size={14} style={{color:'#F9A825'}}/></div>
            :<Play size={18} className="text-white/60" fill="rgba(255,255,255,0.45)"/>}
        </div>
        {item.isGVPlus&&<div className="absolute top-2 start-2"><GVPlusBadge sm/></div>}
        <span className="absolute bottom-2 end-2 text-[11px] font-semibold text-white px-1.5 py-0.5 rounded" style={{background:'rgba(0,0,0,0.6)'}}>{item.dur}</span>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-[11px] font-bold leading-snug line-clamp-2" style={{color:item.isGVPlus?'#9CA3AF':'#111827'}}>{item.title}</p>
        <p className="text-[9.5px] mt-0.5" style={{color:item.isGVPlus?'#D1D5DB':'#9CA3AF'}}>{item.ep}</p>
      </div>
    </div>
  )
}
function VideoRow({ title, items, onGVPlus }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between px-4 mb-2.5">
        <p className="text-[14px] font-extrabold text-gray-900">{title}</p>
        <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{color:'#1B6B3A'}}>Semua <ChevronRight size={11}/></button>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-1" style={{paddingInlineStart:16,paddingInlineEnd:16}}>
          {items.map(v=><VideoCard key={v.id} item={v} onGVPlus={onGVPlus}/>)}
        </div>
      </div>
    </div>
  )
}

// ── Creator Profile Page ───────────────────────────────────
// ── Search Screen ─────────────────────────────────────────
function SearchScreen({ onClose, onGVPlus, navigate }) {
  const [query, setQuery] = React.useState('')

  const ALL_VIDEOS = [
    ...ALL_ROWS.flatMap(r=>r.items),
    ...GVPLUS_ROWS.flatMap(r=>r.items),
    ...FREE_ROWS_BOTTOM.flatMap(r=>r.items),
  ]

  const results = query.trim() ? {
    videos:   ALL_VIDEOS.filter(v => v.title.toLowerCase().includes(query.toLowerCase()) || v.ep.toLowerCase().includes(query.toLowerCase())),
    podcasts: EPISODES.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.show.toLowerCase().includes(query.toLowerCase())),
    creators: KREATOR.filter(k => k.name.toLowerCase().includes(query.toLowerCase()) || k.handle.toLowerCase().includes(query.toLowerCase())),
  } : null

  const hasResults = results && (results.videos.length + results.podcasts.length + results.creators.length) > 0
  const POPULAR  = ['Talk Spot','Kampung Sukasari','Bersama Aliong','Pertanian Organik','GV Update']
  const RECENTS  = ['Pak Tani Bogor','Cara Panen Padi Organik','Podcast Desa Ep.3']

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-fade-in">
      {/* Header */}
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
              <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Cari video, podcast, kreator..."
                className="flex-1 text-[13px] outline-none bg-transparent text-white placeholder-white/50"/>
              {query && <button onClick={()=>setQuery('')}><X size={13} className="text-white/70"/></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-5 pb-6">
          {!query ? (
            <>
              <p className="text-[11px] font-bold text-gray-400 mb-3">Pencarian Terakhir</p>
              {RECENTS.map(r=>(
                <button key={r} onClick={()=>setQuery(r)}
                  className="flex items-center gap-3 w-full py-2.5 border-b border-gray-50">
                  <Clock size={14} className="text-gray-300 flex-shrink-0"/>
                  <span className="text-[13px] text-gray-700">{r}</span>
                </button>
              ))}
              <p className="text-[11px] font-bold text-gray-400 mb-3 mt-4">Pencarian Populer</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map(s=>(
                  <button key={s} onClick={()=>setQuery(s)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
                    style={{background:'#F0F4F0',color:PRIMARY}}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          ) : hasResults ? (
            <>
              {results.videos.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold text-gray-400 mb-2">
                    Video ({results.videos.length})
                  </p>
                  {results.videos.slice(0,4).map(v=>(
                    <div key={v.id} onClick={()=>v.isGVPlus?onGVPlus(v):null}
                      className="flex items-center gap-3 py-2.5 cursor-pointer border-b border-gray-50">
                      <div className="flex-shrink-0 rounded-xl overflow-hidden relative"
                        style={{width:64,height:40,background:`linear-gradient(135deg,${v.g[0]},${v.g[1]})`}}>
                        {v.image && (
                          <img src={v.image} alt={v.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-gray-900 line-clamp-2">{v.title}</p>
                        <p className="text-[12px] text-gray-400">{v.ep} · {v.dur}</p>
                      </div>
                      {v.isGVPlus && <GVPlusBadge sm/>}
                    </div>
                  ))}
                </div>
              )}
              {results.podcasts.length > 0 && (
                <div className="pt-3">
                  <p className="text-[11px] font-bold text-gray-400 mb-2">
                    Podcast ({results.podcasts.length})
                  </p>
                  {results.podcasts.slice(0,3).map(ep=>{
                    const show = SHOWS.find(s=>s.id===ep.showId)||SHOWS[0]
                    return (
                      <div key={ep.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                          style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}>
                          <show.Icon size={18} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-gray-900 line-clamp-2">{ep.title}</p>
                          <p className="text-[12px] text-gray-400">{ep.ep} · {ep.dur}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
            {results.creators.length > 0 && (
              <div className="px-4 pt-4">
                <p className="text-[11px] font-semibold text-gray-400 mb-2">
                  Kreator ({results.creators.length})
                </p>
                {results.creators.map(k=>(
                  <div key={k.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{background:`${k.color}15`}}>{k.avatar}</div>
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-gray-900">{k.name}</p>
                      <p className="text-[12px] text-gray-400">{k.handle} · {k.subs} pengikut</p>
                    </div>
                    <Crown size={11} style={{color:k.hasMember?'#F9A825':'transparent'}}/>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-16 px-8">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[14px] font-bold text-gray-900 mb-1">Tidak ditemukan</p>
            <p className="text-[11px] text-gray-400 text-center">Coba kata kunci yang berbeda atau periksa ejaan</p>
          </div>
        )}
      </div>
      {navigate && <BottomNav active="siaran" navigate={navigate}/>}
    </div>
  )
}

// ── Tab: Semua — simplified 4 sections ────────────────────
function TabSemua({ onGVPlus, navigate, showToast, userProfile }) {
  const isSeller  = userProfile?.capabilities?.includes('Penjual')
  const isCreator = userProfile?.capabilities?.includes('Kreator')
  const hasHistory = userProfile?.hasWatchHistory
  const untukKamu = isSeller ? UNTUK_KAMU.penjual : isCreator ? UNTUK_KAMU.kreator : UNTUK_KAMU.warga

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20">

      {/* 1. Live Sekarang */}
      <div className="flex gap-3 px-4 mt-4">
        {[
          { data:GV_TV,    iconEl:<Play size={16} className="text-white" fill="white"/>,  label:'penonton' },
          { data:GV_RADIO, iconEl:<Radio size={15} className="text-white"/>,               label:'pendengar' },
        ].map(({ data, iconEl, label })=>(
          <div key={data.id} onClick={()=>navigate('siaran')}
            className="flex-1 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.96] transition-transform"
            style={{background:`linear-gradient(155deg,${data.g[0]},${data.g[1]})`,minHeight:140,boxShadow:S.cardMd}}>
            <div className="h-full flex flex-col justify-between p-3">
              <div className="flex items-center justify-between">
                <LiveBadge/>
                <span className="text-white/50 text-[11px] font-medium">{data.viewers} {label}</span>
              </div>
              <div className="flex items-center justify-center flex-1 py-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)'}}>{iconEl}</div>
              </div>
              <div>
                <p className="text-white/50 text-[11px] font-medium mb-0.5">{data.ch}</p>
                <p className="text-white font-extrabold text-[13px] leading-tight">{data.prog}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. GV+ Banner — tepat setelah live */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden cursor-pointer"
        style={{background:'linear-gradient(135deg,#1A0A00,#3E1F00)',boxShadow:S.cardMd}}
        onClick={()=>onGVPlus({title:null})}>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
              <Crown size={18} className="text-white"/>
            </div>
            <div>
              <p className="text-white font-extrabold text-[13px] leading-tight">Akses Konten Premium</p>
              <p className="text-white/50 text-[12px] mt-0.5">Rp 25.000/bulan · Coba gratis 7 hari</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl flex-shrink-0"
            style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
            <span className="text-white font-bold text-[11px]">GV+</span>
          </div>
        </div>
      </div>

      {/* 3. Lanjutkan Menonton — conditional */}
      {hasHistory && (
        <div className="mt-4">
          <div className="flex items-end justify-between px-4 mb-3">
            <p className="text-[15px] font-extrabold text-gray-900">Lanjutkan Menonton</p>
            <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{color:'#1B6B3A'}}>
              Semua <ChevronRight size={12}/>
            </button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-3 pb-1" style={{paddingInlineStart:16,paddingInlineEnd:16}}>
              {CONTINUE_WATCHING.map(v=>(
                <div key={v.id} className="flex-shrink-0 cursor-pointer active:scale-[0.96] transition-transform" style={{width:160,minWidth:160}}>
                  <div className="rounded-2xl overflow-hidden relative"
                    style={{height:90,background:`linear-gradient(135deg,${v.g[0]},${v.g[1]})`,boxShadow:S.card}}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={18} className="text-white/60" fill="rgba(255,255,255,0.45)"/>
                    </div>
                    <div className="absolute bottom-0 start-0 end-0 h-1" style={{background:'rgba(255,255,255,0.2)'}}>
                      <div className="h-full rounded-full" style={{width:`${v.pct}%`,background:'white'}}/>
                    </div>
                    <span className="absolute top-2 end-2 text-[11px] font-bold text-white px-1.5 py-0.5 rounded"
                      style={{background:'rgba(0,0,0,0.5)'}}>{v.pct}%</span>
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-snug">{v.title}</p>
                    <p className="text-[9.5px] text-gray-400 mt-0.5">{v.ep}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Untuk Kamu — mixed: VOD + Podcast + Kreator */}
      <div className="mt-4 pb-6">
        <div className="flex items-end justify-between px-4 mb-3">
          <div>
            <p className="text-[15px] font-extrabold text-gray-900">
              {hasHistory ? 'Untuk Kamu' : 'Mulai Eksplorasi'}
            </p>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {isSeller?'Konten pilihan untuk penjual':isCreator?'Inspirasi untuk kreator':'Video, podcast & kreator pilihan'}
            </p>
          </div>
          <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{color:'#1B6B3A'}}>
            Semua <ChevronRight size={12}/>
          </button>
        </div>
        <div className="flex flex-col gap-2.5 px-4">
          {/* 2 Video items */}
          {untukKamu.slice(0,2).map(v=>(
            <div key={v.id} onClick={()=>v.isGVPlus?onGVPlus(v):null}
              className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 cursor-pointer active:scale-[0.96] transition-transform"
              style={{boxShadow:S.card}}>
              <div className="rounded-xl flex items-center justify-center relative flex-shrink-0"
                style={{width:80,height:52,background:`linear-gradient(135deg,${v.g[0]},${v.g[1]})`}}>
                {v.isGVPlus?<Lock size={14} className="text-white/70"/>:<Play size={14} className="text-white/80" fill="rgba(255,255,255,0.6)"/>}
                {v.isGVPlus&&<div className="absolute top-1.5 start-1.5"><GVPlusBadge sm/></div>}
                <span className="absolute bottom-1 end-1 text-[7px] font-semibold text-white px-1 py-0.5 rounded"
                  style={{background:'rgba(0,0,0,0.5)'}}>{v.dur}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2">{v.title}</p>
                <p className="text-[9.5px] text-gray-400 mt-0.5">{v.ep}</p>
              </div>
              <span className="text-[11px] text-white px-2 py-1 rounded-lg flex-shrink-0"
                style={{background:'rgba(27,107,58,0.12)',color:'#1B6B3A'}}>VOD</span>
            </div>
          ))}
          {/* 1 Podcast item */}
          {(() => {
            const ep = EPISODES[0]
            const show = SHOWS.find(s=>s.id===ep.showId)||SHOWS[0]
            return (
              <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 cursor-pointer active:scale-[0.96] transition-transform"
                style={{boxShadow:S.card}}>
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                  style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}>
                  <show.Icon size={24} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 leading-snug line-clamp-2">{ep.title}</p>
                  <p className="text-[9.5px] text-gray-400 mt-0.5">{ep.ep} · {ep.dur}</p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-lg flex-shrink-0"
                  style={{background:'rgba(74,20,140,0.1)',color:'#6A1B9A'}}>Podcast</span>
              </div>
            )
          })()}
          {/* 1 Kreator item */}
          {(() => {
            const k = KREATOR[0]
            return (
              <div className="flex items-center gap-3 bg-white rounded-2xl px-3 py-3 cursor-pointer active:scale-[0.96] transition-transform"
                style={{boxShadow:S.card}}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{background:`${k.color}15`}}>{k.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900">{k.name}</p>
                  <p className="text-[9.5px] text-gray-400 mt-0.5">{k.subs} pengikut · {k.tags}</p>
                  {k.hasMember&&<div className="flex items-center gap-1 mt-1"><Crown size={9} style={{color:'#F9A825'}}/><span className="text-[8.5px] font-bold" style={{color:'#F9A825'}}>Ada Membership</span></div>}
                </div>
                <span className="text-[11px] px-2 py-1 rounded-lg flex-shrink-0"
                  style={{background:`${k.color}12`,color:k.color}}>Kreator</span>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}


function LiveHero({ data, onPlay, radioPlaying }) {
  const isRadio = data.id === 'r1'
  const bgImage = isRadio 
    ? 'url(https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=800&q=80)' 
    : 'url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80)'
  
  return (
    <div className="px-4 pb-2">
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg border border-white/20 select-none"
        style={{ height: 185 }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: bgImage }}
        />

        {/* Multi-layered cinematic gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
        
        {/* Top Control Strip */}
        <div className="absolute top-0 inset-x-0 p-3.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Badge variant="live" size="sm" />
            <span className="text-white/80 font-bold text-[11px] px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              {isRadio ? 'Audio Stereo HD' : '1080p Full HD'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90">
            <Users size={12} className="text-emerald-400" />
            <span className="text-[11px] font-bold">{data.viewers} {isRadio ? 'pendengar' : 'penonton'}</span>
          </div>
        </div>

        {/* Center Tactile Play / Pause Action */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            type="button"
            onClick={onPlay}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 shadow-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            {isRadio && radioPlaying ? (
              <Pause size={24} className="text-white fill-white" />
            ) : (
              <Play size={24} className="text-white fill-white translate-x-0.5" />
            )}
          </button>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-end justify-between z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{data.ch}</span>
              <span className="text-white/40 text-[10px]">•</span>
              <span className="text-white/70 text-[11px] font-medium truncate">{data.sub}</span>
            </div>
            <p className="text-white font-extrabold text-[16px] leading-tight drop-shadow-md truncate">
              {data.prog}
            </p>
          </div>

          {/* Equalizer animation when radio is playing */}
          {isRadio && radioPlaying && (
            <div className="flex gap-1 items-end h-5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex-shrink-0 ms-2">
              {[4, 8, 12, 6, 10, 5, 9].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-emerald-400 animate-pulse"
                  style={{
                    height: `${h}px`,
                    animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TabLive({ navigate, showToast }) {
  const [sub, setSub]                   = useState('tv')
  const [innerTab, setInnerTab]         = useState('jadwal')
  const [radioPlaying, setRadioPlaying] = useState(false)
  const [reminderSet, setReminderSet]   = useState({})
  const isTV = sub === 'tv'
  const data   = isTV ? GV_TV : GV_RADIO
  const jadwal = isTV ? JADWAL_TV : JADWAL_RADIO
  const obrolan= isTV ? OBROLAN_TV : OBROLAN_RADIO
  const accent = isTV ? '#1B6B3A' : '#6A1B9A'
  const INNER  = [
    { id: 'jadwal', label: 'Jadwal Siaran', Icon: Calendar },
    { id: 'obrolan', label: 'Obrolan Live', Icon: MessageCircle },
    { id: 'salam', label: 'Kirim Salam', Icon: Send }
  ]

  const toggleReminder = (time, prog) => {
    setReminderSet(prev => {
      const next = !prev[time]
      if (showToast) {
        showToast(next ? `🔔 Pengingat disetel: ${prog}` : `Pengingat dibatalkan`)
      }
      return { ...prev, [time]: next }
    })
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Sub-channel Switcher: GV TV vs GV Radio */}
      <div className="px-4 pt-3 pb-2.5 flex gap-2.5 w-full">
        {[
          ['tv', 'GV TV', Tv2, '1.2rb Penonton', ['#0C3E1E', '#1B6B3A']],
          ['radio', 'GV Radio', Radio, '320 Pendengar', ['#3B0D5B', '#6A1B9A']]
        ].map(([id, label, Icon, subLabel, grad]) => {
          const active = sub === id
          return (
            <button
              key={id}
              onClick={() => { setSub(id); setInnerTab('jadwal') }}
              className={`flex-1 min-w-0 py-2.5 px-3 rounded-2xl transition-all duration-200 flex items-center gap-2.5 active:scale-[0.97] text-left ${
                active ? 'shadow-md ring-1 ring-white/20' : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
              }`}
              style={active ? { background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`, color: '#fff' } : {}}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                  active ? 'bg-white/20 text-white shadow-inner' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className={`text-[13px] font-extrabold leading-tight truncate ${active ? 'text-white' : 'text-gray-900'}`}>
                    {label}
                  </p>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse flex-shrink-0" />}
                </div>
                <p className={`text-[10.5px] font-medium leading-tight truncate mt-0.5 ${active ? 'text-white/80' : 'text-gray-400'}`}>
                  {subLabel}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Hero Broadcast Player */}
      <LiveHero data={data} onPlay={() => setRadioPlaying(!radioPlaying)} radioPlaying={radioPlaying} />
      
      {/* Player Ads Banner */}
      <div className="px-4 mb-2">
        <PlayerAdsBanner navigate={navigate} />
      </div>

      {/* Sub-tabs Slider */}
      <div className="px-4 pb-2">
        <div className="flex p-1 rounded-2xl bg-gray-100/90 border border-gray-200/50 shadow-inner">
          {INNER.map(t => {
            const active = innerTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setInnerTab(t.id)}
                className={`flex-1 py-2 rounded-xl text-[11.5px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  active
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <t.Icon size={13} className={active ? (isTV ? 'text-brand' : 'text-purple-700') : 'text-gray-400'} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#FAFBF9]">
        {innerTab === 'jadwal' && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-1 pb-20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700">
                <Calendar size={13} className="text-brand" />
                <span>Senin, 23 Agustus 2026</span>
              </div>
              <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                Jadwal Hari Ini
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {jadwal.map((j) => {
                if (j.live) {
                  return (
                    <div
                      key={j.time}
                      className="rounded-2xl p-3.5 border transition-all shadow-sm relative overflow-hidden"
                      style={{
                        background: isTV ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' : 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                        borderColor: isTV ? 'rgba(34, 197, 94, 0.35)' : 'rgba(168, 85, 247, 0.35)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="live" size="sm" />
                          <span className="text-[11px] font-bold text-gray-600">Sedang Tayang</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] font-extrabold" style={{ color: accent }}>{j.time} WIB</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-extrabold text-gray-900 leading-tight truncate">
                            {j.prog}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {isTV ? 'Siaran langsung TV Desa' : 'Siaran audio interaktif'}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                          style={{ background: accent }}>
                          <Volume2 size={15} className="animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )
                }

                const isReminded = reminderSet[j.time]
                return (
                  <div
                    key={j.time}
                    className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-3 hover:border-gray-200 transition-colors"
                  >
                    <div className="w-12 text-center flex-shrink-0">
                      <span className="text-[11.5px] font-extrabold text-gray-700 block">{j.time}</span>
                      <span className="text-[9.5px] text-gray-400 font-medium">WIB</span>
                    </div>
                    <div className="h-6 w-px bg-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-bold text-gray-800 leading-tight truncate">{j.prog}</p>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">Program Terjadwal</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleReminder(j.time, j.prog)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0 ${
                        isReminded
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-400 border border-gray-100'
                      }`}
                      title="Ingatkan Saya"
                    >
                      <Bell size={14} className={isReminded ? 'fill-amber-500 text-amber-500' : ''} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {innerTab === 'obrolan' && (
          <div className="flex-1 overflow-hidden flex flex-col px-4 pt-2 pb-20">
            <div className="flex-1 overflow-hidden flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm">
              <ObrolanPenonton initialMessages={obrolan} />
            </div>
          </div>
        )}

        {innerTab === 'salam' && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-20">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <KirimSalam channel={data.ch} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab: Kreator ───────────────────────────────────────────
function TabKreator({ onGVPlus, navigate, showToast, userProfile }) {
  const [selectedCreator, setSelected] = useState(null)
  const [followed, setFollowed]        = useState({k1:false,k2:false,k3:false})
  const [category, setCategory]        = useState('semua')

  if (selectedCreator) {
    const creator = KREATOR.find(k=>k.id===selectedCreator)
    return <CreatorProfile creator={creator} onBack={()=>setSelected(null)}
      onGVPlus={onGVPlus} navigate={navigate} showToast={showToast}/>
  }

  const CATEGORIES = [
    { id: 'semua', label: 'Semua' },
    { id: 'pertanian', label: '🌾 Pertanian', match: 'Pertanian' },
    { id: 'umkm', label: '🏪 UMKM Desa', match: 'UMKM' },
    { id: 'kesehatan', label: '🩺 Kesehatan', match: 'Kesehatan' },
  ]

  const filteredCreators = KREATOR.filter(k => {
    if (category === 'semua') return true
    const current = CATEGORIES.find(c => c.id === category)
    return current ? k.tags.includes(current.match) : true
  })

  const spotlightCreator = KREATOR[0]

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FAFBF9]">
      {/* Category Filter Chips */}
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(c => {
            const active = category === c.id
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  active
                    ? 'bg-brand text-white shadow-sm ring-1 ring-brand/30'
                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Spotlight Hero: Kreator Pilihan Minggu Ini */}
      {category === 'semua' && spotlightCreator && (
        <div className="px-4 mb-4">
          <div
            className="rounded-3xl overflow-hidden relative shadow-md border border-white/40 cursor-pointer active:scale-[0.98] transition-all"
            style={{
              background: `linear-gradient(145deg, ${spotlightCreator.bannerG[0]} 0%, ${spotlightCreator.bannerG[1]} 100%)`,
            }}
            onClick={() => setSelected(spotlightCreator.id)}
          >
            {/* Ambient pattern */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="relative p-4 z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-300/20">
                  <Flame size={12} className="fill-amber-300 text-amber-300" />
                  Kreator Pilihan Minggu Ini
                </span>
                {spotlightCreator.hasMember && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-black shadow-sm">
                    <Crown size={10} />
                    <span>GV+ Member</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3.5 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg border-2 border-white/50"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                >
                  {spotlightCreator.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-extrabold text-white leading-tight truncate">
                      {spotlightCreator.name}
                    </h3>
                    <CheckCircle size={14} className="text-emerald-300 fill-emerald-300/30 flex-shrink-0" />
                  </div>
                  <p className="text-white/70 text-[11px] mt-0.5 truncate">{spotlightCreator.handle} • {spotlightCreator.tags}</p>
                  <p className="text-white/80 text-[11.5px] mt-1 line-clamp-1 leading-snug">
                    {spotlightCreator.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-white/15">
                <div className="flex items-center gap-4 text-white/85 text-[11.5px] font-semibold">
                  <span>👥 {spotlightCreator.subs} pengikut</span>
                  <span>📹 {spotlightCreator.totalVideos} karya</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFollowed(p => {
                      const next = !p[spotlightCreator.id]
                      if (showToast) showToast(next ? `Mengikuti ${spotlightCreator.name}` : `Batal mengikuti`)
                      return { ...p, [spotlightCreator.id]: next }
                    })
                  }}
                  className={`px-4 py-1.5 rounded-full text-[11.5px] font-extrabold transition active:scale-95 shadow-md ${
                    followed[spotlightCreator.id]
                      ? 'bg-white/20 text-white backdrop-blur-md border border-white/30'
                      : 'bg-white text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  {followed[spotlightCreator.id] ? 'Diikuti' : 'Ikuti'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Directory */}
      <div className="px-4 mb-2.5 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-extrabold text-gray-900 leading-tight">
            Kreator Desa ({filteredCreators.length})
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Dukung talenta lokal dan nikmati komunitas eksklusif
          </p>
        </div>
      </div>

      {/* Tactile Creator Cards */}
      <div className="px-4 flex flex-col gap-3.5">
        {filteredCreators.map((k) => (
          <div
            key={k.id}
            onClick={() => setSelected(k.id)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
          >
            {/* Mini Cover Banner */}
            <div
              className="h-16 relative w-full px-3 py-2.5 flex items-start justify-end gap-1.5 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${k.bannerG[0]} 0%, ${k.bannerG[1]} 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none" />
              <span className="relative z-10 text-[10px] font-bold text-white/95 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
                {k.tags}
              </span>
              {k.hasMember && (
                <span className="relative z-10 flex items-center gap-1 text-[10px] font-extrabold text-amber-300 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-300/30 shadow-sm">
                  <Crown size={10} className="fill-amber-300 text-amber-300" />
                  Membership
                </span>
              )}
            </div>

            {/* Card Content */}
            <div className="px-3.5 pb-3.5 pt-0 relative">
              {/* Avatar Squircle & Action Button */}
              <div className="flex items-end justify-between -mt-7 mb-2.5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white flex-shrink-0 relative z-10"
                  style={{
                    background: `linear-gradient(145deg, ${k.bannerG[0]}, ${k.bannerG[1]})`,
                  }}
                >
                  {k.avatar}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFollowed(p => {
                      const next = !p[k.id]
                      if (showToast) showToast(next ? `Mengikuti ${k.name}` : `Batal mengikuti`)
                      return { ...p, [k.id]: next }
                    })
                  }}
                  className={`px-4 py-1.5 rounded-full text-[11.5px] font-extrabold border transition active:scale-95 shadow-sm ${
                    followed[k.id]
                      ? 'border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100'
                      : 'border-brand text-white bg-brand shadow-sm hover:brightness-105'
                  }`}
                >
                  {followed[k.id] ? 'Diikuti' : 'Ikuti'}
                </button>
              </div>

              {/* Creator Info */}
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-extrabold text-gray-900 leading-tight truncate">{k.name}</p>
                  <CheckCircle size={13} className="text-brand fill-brand/20 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{k.handle}</p>
                <p className="text-[11.5px] text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {k.bio}
                </p>
              </div>

              {/* Stats Bar & CTA */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <span>👥 <strong className="text-gray-800">{k.subs}</strong></span>
                  <span>📹 <strong className="text-gray-800">{k.totalVideos}</strong> video</span>
                  <span>👁️ <strong className="text-gray-800">{k.totalViews}</strong></span>
                </div>
                <span className="text-brand font-bold flex items-center gap-0.5 hover:translate-x-0.5 transition-transform">
                  Profil <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Video — simplified grid + detail ─────────────────
const ALL_FREE_VIDEOS = [
  { id:'v1',  title:'Kampung Sukasari si Loba Kahayang', ep:'Drama Sunda · Eps. 1',    dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600&auto=format&fit=crop' },
  { id:'v2',  title:'Orkes Madun Mencari Biduan',        ep:'Drama Musik · Eps. 6',    dur:'27:00', g:['#BF360C','#E53935'], isGVPlus:false, image:'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
  { id:'v3',  title:'Sampah',                            ep:'Drama Sosial · Eps. 3',   dur:'21:00', g:['#4A148C','#7B1FA2'], isGVPlus:false, image:'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop' },
  { id:'v4',  title:'Pertandingan Volley',               ep:'Drama Olahraga · Eps. 4', dur:'19:00', g:['#1B5E20','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop' },
  { id:'v5',  title:'Talk Spot — Bincang Hangat',        ep:'Talk Spot · Eps. 3',      dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false, image:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop' },
  { id:'v6',  title:'Sambung Rasa',                      ep:'Sambung Rasa · Eps. 2',   dur:'25:00', g:['#37474F','#546E7A'], isGVPlus:false, image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
  { id:'v7',  title:'Bincang Eko',                       ep:'Bincang Eko · Eps. 1',    dur:'18:00', g:['#00695C','#00897B'], isGVPlus:false, image:'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop' },
  { id:'v8',  title:'GV Update',                         ep:'Update Platform',         dur:'8:00',  g:['#1B6B3A','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' },
  { id:'v9',  title:'Gerbang Desa — Season 1',           ep:'Dokudrama · Eps. 5',      dur:'32:00', g:['#1B5E20','#2E7D32'], isGVPlus:false, image:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop' },
  { id:'v10', title:'Bugar Ala Gatot',                   ep:'Bersama Aliong · Eps. 1', dur:'14:50', g:['#E65100','#F4511E'], isGVPlus:false, image:'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  { id:'v11', title:'Panen Perdana Padi Organik',        ep:'Kreator · Eps. 1',        dur:'12:34', g:['#2E7D32','#388E3C'], isGVPlus:false, image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop' },
  { id:'v12', title:'Tanda Anak Kekurangan Gizi',        ep:'Kreator · Edukasi',       dur:'7:45',  g:['#C62828','#E53935'], isGVPlus:false, image:'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop' }
]
const ALL_GVP_VIDEOS = [
  { id:'p1', title:'Masterclass Pertanian Organik',      ep:'Masterclass GV+',         dur:'45:00', g:['#0D47A1','#1565C0'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop' },
  { id:'p2', title:'Teknik Irigasi Hemat Air',           ep:'Edukasi Premium',         dur:'22:15', g:['#00695C','#00897B'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=600&auto=format&fit=crop' },
  { id:'p3', title:'Bisnis UMKM dari Nol',               ep:'Masterclass GV+',         dur:'38:00', g:['#E65100','#F4511E'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop' },
  { id:'p4', title:'Desa Digital: Kisah Sukamaju',       ep:'Dokumenter GV+',          dur:'52:00', g:['#1B5E20','#2E7D32'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' },
  { id:'p5', title:'Perjalanan GV: 3 Tahun Desa',        ep:'Dokumenter GV+',          dur:'44:10', g:['#4A148C','#7B1FA2'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop' },
  { id:'p6', title:'Strategi Harga untuk Pemula',        ep:'UMKM Premium',            dur:'29:00', g:['#BF360C','#E53935'], isGVPlus:true,  image:'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop' }
]

function VideoGridCard({ item, onTap, onGVPlus }) {
  return (
    <div
      onClick={() => item.isGVPlus ? onGVPlus(item) : onTap(item)}
      className="group cursor-pointer active:scale-[0.96] transition-all flex flex-col"
    >
      <div
        className="rounded-2xl overflow-hidden relative w-full shadow-sm border border-white/40 group-hover:shadow-md transition-shadow"
        style={{
          aspectRatio: '16/9',
          background: `linear-gradient(145deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`,
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20" />

        {/* Center Tactile Play / Lock Glyph */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {item.isGVPlus ? (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'rgba(249, 168, 37, 0.4)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(249, 168, 37, 0.8)',
              }}
            >
              <Lock size={15} className="text-amber-300 drop-shadow" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              <Play size={16} className="text-white fill-white translate-x-0.5 drop-shadow" />
            </div>
          )}
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5">
          {item.isGVPlus ? (
            <GVPlusBadge sm />
          ) : (
            <span className="text-[9.5px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/15">
              HD
            </span>
          )}
        </div>

        {/* Bottom Duration Pill */}
        <div className="absolute bottom-2 end-2 z-10">
          <span className="flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-sm">
            <Clock size={10} className="text-white/70" />
            {item.dur}
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5 flex-1 flex flex-col justify-between">
        <h4 className="text-[12px] font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {item.title}
        </h4>
        <p className="text-[10.5px] text-gray-400 mt-1 truncate">
          {item.ep}
        </p>
      </div>
    </div>
  )
}

function VideoDetail({ video, onBack, onGVPlus }) {
  const [currVideo, setCurrVideo]   = React.useState(video)
  const [playing, setPlaying]       = React.useState(false)
  const [liked, setLiked]           = React.useState(false)
  const [likesCount, setLikesCount] = React.useState(128)
  const [bookmarked, setBookmarked] = React.useState(false)
  const [followed, setFollowed]     = React.useState(false)
  const [toastMsg, setToastMsg]     = React.useState('')
  const [descExpanded, setDescExpanded] = React.useState(false)

  React.useEffect(() => {
    setCurrVideo(video)
    setPlaying(false)
  }, [video])

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2200)
  }

  const isLocked = currVideo.isGVPlus
  const related  = ALL_FREE_VIDEOS.filter(v => v.id !== currVideo.id).slice(0, 4)

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#FAFBF9] animate-fade-in relative">
      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-16 start-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-gray-900/90 backdrop-blur-md text-white text-[12px] font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
            <Check size={14} className="text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 z-10 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95 transition"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-gray-900 truncate">{currVideo.title}</p>
            <p className="text-[10.5px] text-gray-400 font-medium truncate">{currVideo.ep || 'GV Media Studio'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ms-2">
          <button
            onClick={() => {
              setBookmarked(!bookmarked)
              triggerToast(bookmarked ? 'Dihapus dari koleksi' : 'Video disimpan ke koleksi!')
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
              bookmarked ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => triggerToast('Tautan video berhasil disalin!')}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 active:scale-95 transition"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* 16:9 Player Canvas */}
        <div
          className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center shadow-md"
          style={{ background: `linear-gradient(155deg, ${currVideo.g[0]}, ${currVideo.g[1]})` }}
        >
          {currVideo.image && (
            <img
              src={currVideo.image}
              alt={currVideo.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
          {/* Ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

          {isLocked ? (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-2.5 shadow-xl bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse">
                <Crown size={24} className="text-white fill-white" />
              </div>
              <p className="text-white font-black text-[15px] mb-1">Konten Eksklusif GV+</p>
              <p className="text-gray-300 text-[11.5px] max-w-[260px] mb-3.5 leading-relaxed">
                Langganan GV+ untuk menonton tayangan ini tanpa batas & bebas jeda iklan.
              </p>
              <button
                onClick={() => onGVPlus(currVideo)}
                className="px-6 py-2.5 rounded-full text-[12px] font-extrabold text-white shadow-lg active:scale-95 transition bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 flex items-center gap-1.5"
              >
                <Crown size={14} className="fill-white" />
                <span>Buka dengan GV+ · Rp 19.000/bln</span>
              </button>
            </div>
          ) : (
            <>
              {/* Top player badge */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white bg-black/50 backdrop-blur-xs border border-white/20">
                  HD 1080p
                </span>
                <span className="text-[10px] font-bold text-white/90 bg-emerald-950/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Global Village TV
                </span>
              </div>

              {/* Centered tactile play button */}
              <button
                onClick={() => setPlaying(!playing)}
                className="w-14 h-14 rounded-full bg-black/50 hover:bg-black/60 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform z-10"
              >
                {playing ? (
                  <Pause size={24} className="fill-white" />
                ) : (
                  <Play size={24} className="fill-white translate-x-0.5" />
                )}
              </button>

              {/* Scrubber bar at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-1 z-10">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all ${playing ? 'w-1/3 animate-pulse' : 'w-1/12'}`} />
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-white/80 font-medium px-0.5">
                  <span>{playing ? '03:12' : '00:00'}</span>
                  <span>{currVideo.dur}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Video Information & Metrics */}
        <div className="px-4 pt-3.5 pb-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {currVideo.ep}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
              <Clock size={11} className="text-gray-400" /> {currVideo.dur}
            </span>
            {currVideo.isGVPlus && (
              <span className="text-[10.5px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-1">
                <Crown size={10} className="fill-amber-500 text-amber-500" /> GV+ Eksklusif
              </span>
            )}
          </div>

          <h1 className="text-[17.5px] font-black text-gray-900 leading-snug mb-3">
            {currVideo.title}
          </h1>

          {/* Action Row */}
          <div className="flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setLiked(!liked)
                setLikesCount(prev => liked ? prev - 1 : prev + 1)
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11.5px] font-bold active:scale-95 transition ${
                liked
                  ? 'bg-red-50 text-red-600 border border-red-200/60'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart size={14} fill={liked ? '#DC2626' : 'none'} />
              <span>{likesCount} Suka</span>
            </button>

            <button
              onClick={() => {
                setBookmarked(!bookmarked)
                triggerToast(bookmarked ? 'Dihapus dari simpanan' : 'Video disimpan ke koleksi!')
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11.5px] font-bold active:scale-95 transition ${
                bookmarked
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
              <span>{bookmarked ? 'Tersimpan' : 'Simpan'}</span>
            </button>

            <button
              onClick={() => triggerToast('Tautan video berhasil disalin!')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11.5px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
            >
              <Share2 size={14} />
              <span>Bagikan</span>
            </button>

            <button
              onClick={() => triggerToast('Mengunduh video untuk ditonton offline...')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11.5px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
            >
              <Download size={14} />
              <span>Unduh</span>
            </button>
          </div>
        </div>

        {/* Channel Attribution Card */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm bg-gradient-to-br from-emerald-800 to-green-700 flex-shrink-0">
                GV
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-[13px] font-extrabold text-gray-900 truncate">Studio Global Village</p>
                  <CheckCircle size={13} className="text-emerald-600 fill-emerald-100 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Kanal Resmi · 42.1rb Pengikut</p>
              </div>
            </div>

            <button
              onClick={() => {
                setFollowed(!followed)
                triggerToast(followed ? 'Berhenti mengikuti kanal' : 'Mengikuti Studio Global Village')
              }}
              className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-bold transition-all active:scale-95 flex items-center gap-1 ${
                followed
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {followed ? (
                <><UserCheck size={13} /> Diikuti</>
              ) : (
                <><UserPlus size={13} /> Ikuti</>
              )}
            </button>
          </div>

          {/* Description & Tags */}
          <div className="mt-2.5 pt-2.5 border-t border-gray-100">
            <p className={`text-[12px] text-gray-600 leading-relaxed ${!descExpanded ? 'line-clamp-2' : ''}`}>
              Konten ini merupakan bagian dari program dokumentasi budaya, pertanian, dan hiburan warga binaan Global Village. Seluruh produksi melibatkan tenaga lokal pedesaan secara mandiri.
            </p>
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              className="text-[11px] font-bold text-emerald-700 mt-1 hover:underline"
            >
              {descExpanded ? 'Tutup sinopsis' : 'Baca selengkapnya...'}
            </button>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] text-emerald-800 font-medium">
              <span className="bg-emerald-50 px-2 py-0.5 rounded-md">#Pedesaan</span>
              <span className="bg-emerald-50 px-2 py-0.5 rounded-md">#BudayaDesa</span>
              <span className="bg-emerald-50 px-2 py-0.5 rounded-md">#GlobalVillage</span>
            </div>
          </div>
        </div>

        {/* Related Videos Section */}
        <div className="px-4 pt-4 pb-4">
          <SectionHeader
            title="Video Terkait"
            subtitle="Tayangan pilihan lainnya yang mungkin kamu sukai"
            className="mb-3"
          />
          <div className="grid grid-cols-2 gap-3">
            {related.map(v => (
              <VideoGridCard
                key={v.id}
                item={v}
                onTap={(item) => {
                  setCurrVideo(item)
                }}
                onGVPlus={onGVPlus}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabVideo({ onGVPlus, userProfile }) {
  const [mode, setMode]                   = React.useState('semua')
  const [selectedVideo, setSelectedVideo] = React.useState(null)
  const [genreFilter, setGenreFilter]     = React.useState('semua')
  const showContinue = true

  if (selectedVideo) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col">
        <VideoDetail video={selectedVideo} onBack={()=>setSelectedVideo(null)} onGVPlus={onGVPlus}/>
      </div>
    )
  }

  const GENRES = [
    { id: 'semua', label: 'Semua' },
    { id: 'drama', label: '🎬 Drama Desa', match: 'Drama' },
    { id: 'talk', label: '🎙️ Talk Show', match: 'Talk' },
    { id: 'edukasi', label: '🌾 Edukasi Desa', match: 'Kreator' },
    { id: 'olahraga', label: '⚽ Olahraga', match: 'Olahraga' },
  ]

  const featuredVideo = ALL_FREE_VIDEOS.find(v => v.id === 'v9') || ALL_FREE_VIDEOS[0]

  const filteredVideos = ALL_FREE_VIDEOS.filter(v => {
    if (genreFilter === 'semua') return true
    const current = GENRES.find(g => g.id === genreFilter)
    return current ? (v.ep.includes(current.match) || v.title.includes(current.match)) : true
  })

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FAFBF9]">
      {/* Mode Switcher: Semua | GV+ Eksklusif */}
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex p-1 rounded-2xl bg-gray-100/90 border border-gray-200/50 shadow-inner">
          {[
            ['semua', 'Semua Tayangan'],
            ['gvplus', 'GV+ Eksklusif']
          ].map(([id, label]) => {
            const active = mode === id
            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  active
                    ? id === 'gvplus'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                      : 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {id === 'gvplus' && (
                  <Crown size={12} className={active ? 'text-white' : 'text-amber-500'} />
                )}
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {mode === 'semua' ? (
        <>
          {/* Genre Filter Chips */}
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {GENRES.map(g => {
                const active = genreFilter === g.id
                return (
                  <button
                    key={g.id}
                    onClick={() => setGenreFilter(g.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11.5px] font-bold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      active
                        ? 'bg-brand text-white shadow-sm ring-1 ring-brand/30'
                        : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Featured Spotlight Video Hero (Pilihan Editor) */}
          {genreFilter === 'semua' && featuredVideo && (
            <div className="px-4 mb-4">
              <div
                onClick={() => setSelectedVideo(featuredVideo)}
                className="rounded-3xl overflow-hidden relative shadow-lg cursor-pointer border border-white/20 active:scale-[0.98] transition-all group"
                style={{
                  aspectRatio: '16/9',
                  background: `linear-gradient(135deg, ${featuredVideo.g[0]} 0%, ${featuredVideo.g[1]} 100%)`,
                }}
              >
                {featuredVideo.image && (
                  <img
                    src={featuredVideo.image}
                    alt={featuredVideo.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {/* Cinematic overlay scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25" />

                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-amber-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-300/20">
                      <Sparkles size={11} className="fill-amber-300 text-amber-300" />
                      Pilihan Minggu Ini
                    </span>
                    <span className="text-white/80 font-bold text-[10.5px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                      {featuredVideo.dur}
                    </span>
                  </div>

                  <div>
                    <span className="text-emerald-300 font-extrabold text-[10.5px] uppercase tracking-wider block mb-1">
                      {featuredVideo.ep}
                    </span>
                    <h3 className="text-white font-extrabold text-[17px] leading-tight drop-shadow-md mb-2">
                      {featuredVideo.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11.5px] font-extrabold text-gray-900 bg-white shadow-md group-hover:bg-emerald-50 transition-colors"
                      >
                        <Play size={13} className="fill-gray-900 text-gray-900" />
                        <span>Tonton Sekarang</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lanjutkan Menonton (Continue Watching) */}
          {showContinue && (
            <div className="mb-4">
              <div className="px-4 mb-2.5">
                <SectionHeader
                  title="Lanjutkan Menonton"
                  subtitle="Lanjutkan episode terakhir yang kamu tonton"
                  className="mb-0"
                />
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-3 px-4 pb-1">
                  {CONTINUE_WATCHING.map(v => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVideo(v)}
                      className="flex-shrink-0 cursor-pointer active:scale-[0.96] transition-transform"
                      style={{ width: 175 }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden relative shadow-sm border border-white/40"
                        style={{
                          height: 98,
                          background: `linear-gradient(135deg, ${v.g[0]} 0%, ${v.g[1]} 100%)`,
                        }}
                      >
                        {v.image && (
                          <img
                            src={v.image}
                            alt={v.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-md">
                            <Play size={16} className="text-white fill-white translate-x-0.5" />
                          </div>
                        </div>
                        {/* Progress Bar with neon glow */}
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${v.pct}%` }}
                          />
                        </div>
                        <span className="absolute bottom-2.5 end-2 text-[9.5px] font-bold text-white px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                          Sisa {100 - v.pct}%
                        </span>
                      </div>
                      <div className="mt-2 px-0.5">
                        <h4 className="text-[12px] font-extrabold text-gray-900 leading-snug line-clamp-1">
                          {v.title}
                        </h4>
                        <p className="text-[10.5px] text-gray-400 mt-0.5 truncate">{v.ep}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grid 2 Kolom Semua Video */}
          <div className="px-4 mb-2">
            <SectionHeader
              title={`Semua Tayangan (${filteredVideos.length})`}
              subtitle="Koleksi video dan cerita masyarakat desa"
              className="mb-3"
            />
            <div className="grid grid-cols-2 gap-3.5">
              {filteredVideos.map(v => (
                <VideoGridCard key={v.id} item={v} onTap={setSelectedVideo} onGVPlus={onGVPlus} />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Mode GV+ Eksklusif */
        <div className="px-4 pt-1 pb-4">
          <div className="mb-4 p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-sm">
                <Crown size={16} />
              </div>
              <div>
                <h3 className="text-[13.5px] font-extrabold text-gray-900 leading-tight">
                  Koleksi Eksklusif GV+
                </h3>
                <p className="text-[11px] text-gray-500">
                  Masterclass keahlian desa dan dokumenter sinematik
                </p>
              </div>
            </div>
          </div>

          <SectionHeader
            title={`Konten Premium (${ALL_GVP_VIDEOS.length})`}
            subtitle="Langganan untuk membuka akses penuh tanpa iklan"
            className="mb-3"
          />
          <div className="grid grid-cols-2 gap-3.5">
            {ALL_GVP_VIDEOS.map(v => (
              <VideoGridCard key={v.id} item={v} onTap={() => onGVPlus(v)} onGVPlus={onGVPlus} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Podcast: Show Detail Page ─────────────────────────────
function PodcastShowDetail({ show, onBack, onPlayEpisode }) {
  const eps = EPISODES.filter(e => e.showId === show.id)
  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#FAFBF9] animate-fade-in">
      {/* Cinematic Cover Header */}
      <div
        className="flex-shrink-0 relative pb-6 overflow-hidden shadow-md"
        style={{
          background: `linear-gradient(145deg, ${show.g[0]} 0%, ${show.g[1]} 100%)`,
        }}
      >
        {/* Ambient lighting & mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_70%)]" />

        <div className="relative z-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/50 backdrop-blur-md text-white text-[12px] font-bold border border-white/20 active:scale-95 transition shadow-sm"
            >
              <ArrowLeft size={14} strokeWidth={2.5} /> Kembali
            </button>
            <span className="text-[11px] font-bold text-white/95 bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
              🎙️ Podcast Desa
            </span>
          </div>

          {/* Show Identity Info */}
          <div className="flex items-center gap-3.5 px-4 mb-3.5 mt-1">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl relative flex-shrink-0 overflow-hidden ring-4 ring-white/30 border border-white/40"
              style={{ background: `linear-gradient(135deg, ${show.g[0]}, ${show.g[1]})` }}
            >
              <show.Icon size={38} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-white/10" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10.5px] font-extrabold text-emerald-200 uppercase tracking-wider block mb-0.5">
                Serial Podcast Pilihan
              </span>
              <h1 className="text-[19px] font-black text-white leading-tight truncate">{show.name}</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-white/80 mt-0.5 font-medium">
                <span>{eps.length} Episode</span>
                <span>•</span>
                <span>Audio HQ 320kbps</span>
              </div>
              <p className="text-[11.5px] text-white/90 mt-1 leading-snug line-clamp-2">{show.desc}</p>
            </div>
          </div>

          {/* Quick Play CTA */}
          <div className="px-4">
            <button
              onClick={() => onPlayEpisode(eps[0] || EPISODES[0])}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-black text-emerald-950 bg-white shadow-xl active:scale-95 transition-transform"
            >
              <Play size={16} className="fill-emerald-950 text-emerald-950" />
              <span>Putar Episode Terbaru (Eps. 1)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Episode list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-4">
        <SectionHeader
          title={`Daftar Episode (${eps.length})`}
          subtitle="Urut berdasarkan rilis terbaru"
          className="mb-3"
        />
        {eps.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {eps.map((ep, i) => (
              <div
                key={ep.id}
                onClick={() => onPlayEpisode(ep)}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-emerald-200 transition-all active:scale-[0.98]"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs border border-white/50 text-white"
                  style={{ background: `linear-gradient(135deg, ${show.g[0]}, ${show.g[1]})` }}
                >
                  {ep.hasArt ? <show.Icon size={22} strokeWidth={1.75} /> : <Headphones size={22} strokeWidth={1.75} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-black text-gray-900 leading-snug line-clamp-1">
                    {ep.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                    <span>{ep.ep}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Clock size={10} /> {ep.dur}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white transition-colors"
                >
                  <Play size={14} className="fill-current translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400 text-[13px]">
            Belum ada episode tersedia.
          </div>
        )}
      </div>
    </div>
  )
}

// ── GV+ Subscription Banner ───────────────────────────────
function GVPlusSubscribeBanner({ onSubscribe, context = 'video' }) {
  const benefits = context === 'podcast'
    ? ['Podcast eksklusif & behind the scene','Wawancara khusus narasumber desa','Konten audio premium tanpa iklan','Akses semua arsip episode lama']
    : ['Semua konten GV+ tanpa batas','Video tanpa iklan & resolusi HD','Masterclass & dokumenter premium','Akses awal konten baru sebelum publik']
  return (
    <div className="mx-4 mb-5 rounded-2xl overflow-hidden" style={{boxShadow:S.cardLg}}>
      <div className="px-4 pt-4 pb-3"
        style={{background:'linear-gradient(135deg,#1A0A00,#3E1F00)'}}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{background:'linear-gradient(135deg,#F57F17,#F9A825)'}}>
            <Crown size={18} className="text-white"/>
          </div>
          <div>
            <p className="text-white font-extrabold text-[14px] leading-tight">GV+ Premium</p>
            <p className="text-white/50 text-[12px]">Akses semua konten eksklusif</p>
          </div>
          <div className="ms-auto text-right">
            <p className="text-[18px] font-extrabold" style={{color:'#F9A825'}}>Rp 25rb</p>
            <p className="text-white/40 text-[11px]">/bulan</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4">
          {benefits.map((b,i) => (
            <div key={i} className="flex items-start gap-1.5">
              <CheckCircle size={11} className="flex-shrink-0 mt-0.5" style={{color:'#F9A825'}}/>
              <span className="text-[12px] text-white/70 leading-snug">{b}</span>
            </div>
          ))}
        </div>
        <button onClick={onSubscribe}
          className="w-full py-3 rounded-xl text-[12px] font-extrabold text-white flex items-center justify-center gap-2"
          style={{background:'linear-gradient(90deg,#F57F17,#F9A825)',boxShadow:'0 3px 10px rgba(249,168,37,0.45)'}}>
          <Crown size={13}/> Mulai Berlangganan GV+
        </button>
      </div>
      <div className="px-4 py-2.5 flex items-center justify-center gap-1"
        style={{background:'#2A1400'}}>
        <span className="text-[11px] text-white/30">Pembayaran di luar aplikasi · </span>
        <span className="text-[11px] font-semibold" style={{color:'#F9A825'}}>Batalkan kapan saja</span>
      </div>
    </div>
  )
}

// ── Tab: Podcast ───────────────────────────────────────────
const GVPLUS_PODCASTS = [
  { id:'gp1', title:'Masterclass Bertani: Q&A Eksklusif', show:'Bersama Aliong',   ep:'Premium · 45:00', showId:'aliong',   isGVPlus:true },
  { id:'gp2', title:'Behind The Scene: Kampung Sukasari', show:'Kampung Sukasari', ep:'Premium · 32:00', showId:'sukasari', isGVPlus:true },
  { id:'gp3', title:'Wawancara Eksklusif Kepala Desa',    show:'Cerita Kabayan',   ep:'Premium · 28:00', showId:'kabayan',  isGVPlus:true },
]

function TabPodcast({ onPlayEpisode, onGVPlus }) {
  const [mode, setMode]               = React.useState('semua')
  const [selectedShow, setSelectedShow] = React.useState(null)

  if (selectedShow) {
    const show = SHOWS.find(s => s.id === selectedShow)
    return <PodcastShowDetail show={show} onBack={() => setSelectedShow(null)} onPlayEpisode={onPlayEpisode} />
  }

  const featuredShow = SHOWS[0]

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FAFBF9]">
      {/* Mode Switcher: Semua | GV+ Eksklusif */}
      <div className="px-4 pt-3 pb-2.5">
        <div className="flex p-1 rounded-2xl bg-gray-100/90 border border-gray-200/50 shadow-inner">
          {[
            ['semua', 'Semua Podcast'],
            ['gvplus', 'GV+ Audio Eksklusif']
          ].map(([id, label]) => {
            const active = mode === id
            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  active
                    ? id === 'gvplus'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                      : 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {id === 'gvplus' && (
                  <Crown size={12} className={active ? 'text-white' : 'text-amber-500'} />
                )}
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {mode === 'semua' ? (
        <>
          {/* Acara Unggulan Hero */}
          <div className="px-4 mb-4">
            <div
              onClick={() => onPlayEpisode(EPISODES.find(e => e.showId === featuredShow.id) || EPISODES[0])}
              className="rounded-3xl overflow-hidden relative shadow-md border border-white/40 cursor-pointer active:scale-[0.98] transition-all p-4 text-white"
              style={{
                background: `linear-gradient(145deg, ${featuredShow.g[0]} 0%, ${featuredShow.g[1]} 100%)`,
              }}
            >
              {/* Subtle acoustic pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-emerald-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-300/20">
                    <Mic size={11} className="text-emerald-300" />
                    Acara Unggulan Desa
                  </span>
                  <div className="flex items-center gap-1">
                    {[4, 8, 12, 7, 11, 6, 9].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full bg-emerald-300/80 animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mb-3.5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/40 flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                  >
                    {React.createElement(featuredShow.Icon, {
                      size: 32,
                      className: 'text-white drop-shadow-md',
                      strokeWidth: 1.5,
                    })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] font-extrabold text-white leading-tight truncate">
                      {featuredShow.name}
                    </h3>
                    <p className="text-[11.5px] text-white/70 mt-0.5">
                      Global Village • {featuredShow.eps} Episode
                    </p>
                    <p className="text-[11px] text-white/80 mt-1 line-clamp-1 leading-snug">
                      {featuredShow.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/15">
                  <span className="text-[11px] text-white/75 font-medium">
                    Episode 1: {EPISODES[0]?.title}
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11.5px] font-extrabold text-emerald-950 bg-white shadow-md hover:bg-emerald-50 active:scale-95 transition-all"
                  >
                    <Play size={12} className="fill-emerald-950 text-emerald-950" />
                    <span>Dengarkan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Telusuri Acara (Show Collection Rail) */}
          <div className="mb-4">
            <div className="px-4 mb-2.5">
              <SectionHeader
                title={`Telusuri Acara (${SHOWS.length})`}
                subtitle="Dengarkan berbagai obrolan & sandiwara desa"
                className="mb-0"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
              {SHOWS.map(show => (
                <div
                  key={show.id}
                  onClick={() => setSelectedShow(show.id)}
                  className="flex-shrink-0 cursor-pointer active:scale-[0.96] transition-transform group"
                  style={{ width: 125 }}
                >
                  <div
                    className="w-full rounded-2xl flex items-center justify-center relative shadow-sm border border-white/40 overflow-hidden group-hover:shadow-md transition-shadow"
                    style={{
                      height: 120,
                      background: `linear-gradient(145deg, ${show.g[0]} 0%, ${show.g[1]} 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <show.Icon size={48} className="text-white/90 drop-shadow-md relative z-10 group-hover:scale-105 transition-transform" strokeWidth={1.5} />
                    <div className="absolute bottom-2 end-2 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center z-20 text-emerald-900">
                      <Play size={11} className="fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <h4 className="text-[12px] font-extrabold text-gray-900 mt-2 line-clamp-1 leading-snug group-hover:text-brand transition-colors">
                    {show.name}
                  </h4>
                  <p className="text-[10.5px] text-gray-400 mt-0.5">{show.eps} Episode</p>
                </div>
              ))}
            </div>
          </div>

          {/* Episode Terbaru (Audio Playlist) */}
          <div className="px-4 pb-2">
            <SectionHeader
              title={`Episode Terbaru (${EPISODES.length})`}
              subtitle="Rilis episode audio mingguan"
              className="mb-3"
            />
            <div className="flex flex-col gap-2">
              {EPISODES.map((ep) => {
                const show = SHOWS.find(s => s.id === ep.showId) || SHOWS[0]
                return (
                  <div
                    key={ep.id}
                    onClick={() => onPlayEpisode(ep)}
                    className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-gray-200 transition-all active:scale-[0.98]"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/50 text-white"
                      style={{ background: `linear-gradient(135deg, ${show.g[0]}, ${show.g[1]})` }}
                    >
                      {ep.hasArt ? <show.Icon size={20} strokeWidth={1.75} /> : <Headphones size={20} strokeWidth={1.75} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12.5px] font-bold text-gray-900 leading-tight line-clamp-1">
                        {ep.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        {ep.ep} • {ep.dur}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors"
                    >
                      <Play size={13} className="fill-current translate-x-0.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        /* Mode GV+ Audio Eksklusif */
        <div className="px-4 pt-1 pb-4">
          <div className="mb-4 p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-sm">
                <Crown size={16} />
              </div>
              <div>
                <h3 className="text-[13.5px] font-extrabold text-gray-900 leading-tight">
                  Podcast Eksklusif GV+
                </h3>
                <p className="text-[11px] text-gray-500">
                  Wawancara khusus narasumber dan behind the scene
                </p>
              </div>
            </div>
          </div>

          <SectionHeader
            title={`Audio Premium (${GVPLUS_PODCASTS.length})`}
            subtitle="Audio kualitas tinggi tanpa batas"
            className="mb-3"
          />
          <div className="flex flex-col gap-2.5">
            {GVPLUS_PODCASTS.map(ep => {
              const show = SHOWS.find(s => s.id === ep.showId) || SHOWS[0]
              return (
                <div
                  key={ep.id}
                  onClick={() => onGVPlus(ep)}
                  className="bg-white rounded-2xl p-3.5 border border-amber-500/20 shadow-sm flex items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${show.g[0]}, ${show.g[1]})` }}
                  >
                    <Headphones size={20} className="text-white/60" />
                    <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm text-white">
                      <Lock size={9} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <GVPlusBadge sm />
                      <span className="text-[10.5px] text-amber-600 font-bold">{ep.show}</span>
                    </div>
                    <h4 className="text-[12.5px] font-bold text-gray-900 leading-tight truncate">
                      {ep.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{ep.ep}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
const TABS = [
  {id:'live',label:'Live'},
  {id:'kreator',label:'Kreator'},{id:'video',label:'Video'},{id:'podcast',label:'Podcast'},
]

export default function Siaran({ navigate, userProfile, initialTab, showGVPlus }) {
  const [tab,setTab]           = useState(initialTab || 'live')
  const [paywall,setPaywall]   = useState(showGVPlus ? {title:null} : null)
  const [toast,setToast]       = useState(null)
  const [showSearch,setShowSearch]   = useState(false)  // search overlay
  const [playingEp,setPlayingEp]     = useState(null)   // persistent mini player
  const [playerExpanded,setExpanded] = useState(false)  // full player open

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2200) }

  const handlePlayEpisode = ep => { setPlayingEp(ep); setExpanded(true) }
  const handleCloseFullPlayer = () => setExpanded(false)  // mini player stays
  const handleStopEpisode = () => { setPlayingEp(null); setExpanded(false) }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* Search overlay — at root to cover full screen including header */}
      {showSearch && <SearchScreen onClose={()=>setShowSearch(false)} onGVPlus={c=>{setPaywall(c);setShowSearch(false)}} navigate={navigate}/>}
      {/* Unified ScreenHeader */}
      <ScreenHeader
        title="GV Media"
        actions={
          <button
            type="button"
            onClick={() => setPaywall({ title: null })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95 shadow-sm"
            style={{
              background: 'linear-gradient(90deg, #F57F17, #F9A825)',
              boxShadow: '0 2px 8px rgba(249, 168, 37, 0.3)',
            }}
          >
            <Crown size={12} className="text-white" />
            <span className="text-white font-extrabold text-[11px]">GV+</span>
          </button>
        }
      >
        <SearchBar
          readOnly
          variant="glass-dark"
          placeholder="Cari siaran, video, kreator..."
          onClick={() => setShowSearch(true)}
        />
        <NavTabs
          variant="underline-dark"
          tabs={TABS}
          activeTab={tab}
          onChange={setTab}
        />
      </ScreenHeader>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {tab==='live'    && <TabLive navigate={navigate} showToast={showToast}/>}
        {tab==='kreator' && <TabKreator onGVPlus={setPaywall} navigate={navigate} showToast={showToast} userProfile={userProfile}/>}
        {tab==='video'   && <TabVideo   onGVPlus={setPaywall} userProfile={userProfile}/>}
        {tab==='podcast' && <TabPodcast onPlayEpisode={handlePlayEpisode} onGVPlus={setPaywall}/>}
        {paywall && <GVPlusPage content={paywall} onClose={()=>setPaywall(null)}/>}
        {toast   && <Toast message={toast} onDone={()=>setToast(null)}/>}
        {playerExpanded && playingEp && <PodcastFullPlayer episode={playingEp} onClose={handleCloseFullPlayer}/>}
      </div>

      {/* Persistent mini player — above bottom nav */}
      {playingEp && !playerExpanded && (
        <MiniPlayer episode={playingEp} onExpand={()=>setExpanded(true)} onStop={handleStopEpisode}/>
      )}

      <BottomNav active="siaran" navigate={navigate}/>
    </ScreenBackground>
  )
}

// ── Post Card — flat Twitter/YouTube Posts style ──────────
function PostCard({ post, creator, isMember, onTap, onMemberRequire }) {
  const locked = post.isExclusive && !isMember
  const [liked, setLiked] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const isLong = post.text.length > 160

  return (
    <div
      className="px-4 py-4 cursor-pointer"
      style={post.isExclusive ? {background:'#FFFBEB'} : {background:'#fff'}}
      onClick={()=>!locked && onTap(post)}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
          style={{background:`linear-gradient(135deg,${creator.bannerG[0]},${creator.bannerG[1]})`}}>
          {creator.avatar}
        </div>
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-[13px] font-bold text-gray-900">{creator.name}</p>
            {post.isExclusive && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md flex-shrink-0"
                style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                <Crown size={8} className="text-white"/>
                <span className="text-[11px] font-bold text-white">Member</span>
              </div>
            )}
            <span className="text-[12px] text-gray-400 ms-auto flex-shrink-0">{post.timestamp}</span>
          </div>

          {/* Post text */}
          {locked ? (
            <div className="relative">
              <p className="text-[13px] text-gray-700 leading-relaxed line-clamp-2"
                style={{filter:'blur(3.5px)',userSelect:'none'}}>{post.text}</p>
              <button onClick={e=>{e.stopPropagation();onMemberRequire()}}
                className="mt-2 flex items-center gap-1.5 text-[11px] font-bold"
                style={{color:creator.color}}>
                <Crown size={11}/> Gabung Member untuk membaca
              </button>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-gray-800 leading-relaxed"
                style={!expanded && isLong ? {display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'} : {}}>
                {post.text}
              </p>
              {isLong && (
                <button onClick={e=>{e.stopPropagation();setExpanded(!expanded)}}
                  className="text-[11px] font-semibold mt-0.5" style={{color:creator.color}}>
                  {expanded ? 'Lebih sedikit' : 'Baca selengkapnya'}
                </button>
              )}
            </>
          )}

          {/* Action row */}
          {!locked && (
            <div className="flex items-center gap-5 mt-2.5">
              <button onClick={e=>{e.stopPropagation();setLiked(!liked)}}
                className="flex items-center gap-1 text-[11px] transition-colors"
                style={{color:liked?'#E53935':'#9CA3AF'}}>
                <Heart size={13} fill={liked?'#E53935':'none'} style={{color:liked?'#E53935':'#9CA3AF'}}/>
                {post.likes+(liked?1:0)}
              </button>
              <button onClick={()=>onTap(post)}
                className="flex items-center gap-1 text-[11px] text-gray-400">
                <MessageCircle size={13}/>{post.comments}
              </button>
              <button className="flex items-center gap-1 text-[11px] text-gray-400 ms-auto">
                <Share2 size={13}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Thread Detail — Twitter / Community style ───────────────────
function ThreadDetail({ post, creator, isMember, onBack, onMemberRequire }) {
  const init = POST_COMMENTS_DATA[post.id] || POST_COMMENTS_DATA.default
  const [comments, setComments] = React.useState([...init])
  const [newMsg, setNewMsg]     = React.useState('')
  const [liked, setLiked]       = React.useState(false)

  const send = () => {
    if (!newMsg.trim()) return
    if (post.isExclusive && !isMember) {
      if (onMemberRequire) onMemberRequire()
      return
    }
    setComments(p=>[{id:Date.now(),user:'Kamu',avIcon:User,text:newMsg,likes:0,time:'Baru saja'},...p])
    setNewMsg('')
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 animate-fade-in">
      {/* Top App Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-gray-700">
            <ArrowLeft size={16} strokeWidth={2.5}/>
          </button>
          <div>
            <p className="text-[14px] font-extrabold text-gray-900 leading-tight">Postingan Komunitas</p>
            <p className="text-[11px] text-gray-400 font-medium">{creator.name}</p>
          </div>
        </div>
        {post.isExclusive && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-amber-700 bg-amber-50 border border-amber-200/80">
            <Crown size={10} className="fill-amber-500 text-amber-500"/> Eksklusif
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Original Post Card */}
        <div className="p-4 bg-white border-b border-gray-100 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm border border-black/5"
              style={{background:`linear-gradient(135deg, ${creator.bannerG ? creator.bannerG[0] : '#1B6B3A'}, ${creator.bannerG ? creator.bannerG[1] : '#2E7D32'})`}}>
              {creator.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[14px] font-extrabold text-gray-900">{creator.name}</p>
                  <CheckCircle size={13} className="text-emerald-600 fill-emerald-100"/>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">{post.timestamp}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Kreator Terverifikasi</p>
            </div>
          </div>

          <div className="mt-3.5 pl-0.5">
            <p className="text-[14px] text-gray-800 leading-relaxed whitespace-pre-wrap">{post.text}</p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button onClick={()=>setLiked(!liked)}
                className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                  liked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                <Heart size={14} fill={liked?'#DC2626':'none'} strokeWidth={2}/>
                <span>{post.likes + (liked ? 1 : 0)}</span>
              </button>
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <MessageCircle size={14} strokeWidth={2}/>
                <span>{comments.length} Balasan</span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition">
              <Share2 size={14}/>
            </button>
          </div>
        </div>

        {/* Comments Section Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <p className="text-[12px] font-extrabold text-gray-700 uppercase tracking-wider">
            Diskusi Komunitas ({comments.length})
          </p>
        </div>

        {/* Comments List */}
        <div className="px-4 pb-24 space-y-2.5">
          {comments.map((c)=>(
            <div key={c.id} className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-emerald-100 shadow-xs">
                {c.user === 'Kamu' ? '👤' : (c.user ? c.user.charAt(0) : 'U')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-bold text-gray-900">{c.user}</p>
                  <span className="text-[10.5px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-[12.5px] text-gray-700 mt-1 leading-relaxed">{c.text}</p>
                <div className="flex items-center gap-3.5 mt-2">
                  <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-red-500 transition">
                    <Heart size={11}/> <span>{c.likes}</span>
                  </button>
                  <button className="text-[11px] font-bold text-emerald-700 hover:underline">Balas</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Input */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 z-10 shadow-sm">
        {post.isExclusive && !isMember ? (
          <button
            onClick={() => onMemberRequire && onMemberRequire()}
            className="w-full py-2.5 px-4 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm active:scale-[0.99] transition">
            <Crown size={14} className="fill-white"/> Gabung Member untuk Ikut Berkomentar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100/60 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
              😊
            </div>
            <div className="flex-1 flex items-center bg-gray-100/80 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-600 transition">
              <input
                value={newMsg}
                onChange={e=>setNewMsg(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder="Tulis tanggapan atau pertanyaan..."
                className="flex-1 text-[12.5px] outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              onClick={send}
              disabled={!newMsg.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                newMsg.trim() ? 'bg-emerald-700 text-white shadow-sm active:scale-95' : 'bg-gray-100 text-gray-400'
              }`}>
              <Send size={14} className={newMsg.trim() ? 'translate-x-0.5' : ''}/>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Video Player View — Modern Streaming style ───────────────
function VideoPlayerView({ content, creator, isMember, isFollowed, onBack, onMemberRequire, showToast }) {
  const locked = content.isExclusive && !isMember
  const initComments = VIDEO_COMMENTS_DATA[content.id] || VIDEO_COMMENTS_DATA.default
  const [comments, setComments]   = React.useState([...initComments])
  const [newMsg, setNewMsg]       = React.useState('')
  const [liked, setLiked]         = React.useState(false)
  const [playing, setPlaying]     = React.useState(false)
  const [followed, setFollowed]   = React.useState(isFollowed)
  const [showComments, setShowC]  = React.useState(true)
  const [bookmarked, setBookmarked] = React.useState(false)

  const send = () => {
    if (!newMsg.trim()) return
    setComments(p=>[{id:Date.now(),user:'Kamu',avIcon:User,text:newMsg,likes:0,time:'Baru saja'},...p])
    setNewMsg('')
  }

  const posterImage = content.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=800&q=80'

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white animate-fade-in">
      {/* Top Navbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-95 transition text-gray-700">
            <ArrowLeft size={16} strokeWidth={2.5}/>
          </button>
          <div className="min-w-0">
            <p className="text-[13px] font-extrabold text-gray-900 truncate max-w-[210px]">{content.title}</p>
            <p className="text-[11px] text-gray-400 font-medium truncate">{creator.name}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setBookmarked(!bookmarked)
            if (showToast) showToast(bookmarked ? 'Dihapus dari simpanan' : 'Video disimpan ke koleksi!')
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95 ${
            bookmarked ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
          }`}>
          <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 16:9 Player Container */}
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
          <img
            src={posterImage}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />

          {locked ? (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3 animate-pulse">
                <Crown size={28} className="text-white fill-white"/>
              </div>
              <p className="text-white font-extrabold text-[15px] mb-1">Konten Eksklusif Member</p>
              <p className="text-gray-300 text-[12px] max-w-[260px] mb-4 leading-relaxed">
                Gabung keanggotaan {creator.name} untuk membuka tayangan lengkap ini dan benefit lainnya.
              </p>
              <button
                onClick={onMemberRequire}
                className="px-6 py-2.5 rounded-full text-[12px] font-extrabold text-white shadow-lg active:scale-95 transition bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-orange-900/30 flex items-center gap-2">
                <Crown size={14} className="fill-white"/> Gabung Member · Rp {creator.memberPrice?.toLocaleString('id')}/bln
              </button>
            </div>
          ) : (
            <>
              {/* Top Floating Player Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                {content.isExclusive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm">
                    <Crown size={10} className="fill-white"/> Eksklusif
                  </span>
                ) : <span/>}
                <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                  HD 1080p
                </span>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={() => setPlaying(!playing)}
                className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform z-10">
                {playing ? (
                  <Pause size={24} className="fill-white"/>
                ) : (
                  <Play size={24} className="fill-white translate-x-0.5"/>
                )}
              </button>

              {/* Bottom Video Progress bar & Duration */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-1.5 z-10">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all ${playing ? 'w-2/5 animate-pulse' : 'w-1/6'}`}/>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/80 font-medium px-0.5">
                  <span>{playing ? '02:15' : '00:00'}</span>
                  <span>{content.dur}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Video Info Card */}
        <div className="px-4 pt-3.5 pb-2">
          {content.isExclusive && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full mb-2 bg-amber-50 border border-amber-200/80">
              <Crown size={11} className="text-amber-600 fill-amber-600"/>
              <span className="text-[11px] font-extrabold text-amber-700">Members Only</span>
            </div>
          )}
          <h1 className="text-[17px] font-extrabold text-gray-900 leading-snug">{content.title}</h1>
          <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-gray-400 font-medium">
            <span>{content.ep}</span>
            <span>·</span>
            <span>{content.dur}</span>
            {content.views !== '—' && (
              <>
                <span>·</span>
                <span className="text-gray-500 font-semibold">{content.views} tayangan</span>
              </>
            )}
          </div>
        </div>

        {/* Interactive Action Bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-gray-100">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold active:scale-95 transition ${
              liked ? 'bg-red-50 text-red-600 border border-red-200/60' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            <Heart size={14} fill={liked ? '#DC2626' : 'none'}/>
            <span>{liked ? 'Disukai' : 'Suka'}</span>
          </button>

          <button
            onClick={() => setShowC(!showComments)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition">
            <MessageCircle size={14}/>
            <span>{comments.length} Komentar</span>
          </button>

          <button
            onClick={() => {
              if (showToast) showToast('Tautan video berhasil disalin!')
            }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition">
            <Share2 size={14}/>
            <span>Bagikan</span>
          </button>
        </div>

        {/* Creator Identity Ribbon */}
        <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm border border-black/5"
              style={{background:`linear-gradient(135deg, ${creator.bannerG ? creator.bannerG[0] : '#1B6B3A'}, ${creator.bannerG ? creator.bannerG[1] : '#2E7D32'})`}}>
              {creator.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13.5px] font-extrabold text-gray-900 truncate">{creator.name}</p>
                <CheckCircle size={13} className="text-emerald-600 fill-emerald-100 flex-shrink-0"/>
              </div>
              <p className="text-[11.5px] text-gray-400 font-medium">{creator.subs} pengikut</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFollowed(!followed)
              if (!followed && showToast) showToast(`Mengikuti ${creator.name}`)
            }}
            className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
              followed
                ? 'bg-gray-200/80 text-gray-700'
                : 'bg-emerald-700 text-white shadow-xs'
            }`}>
            {followed ? (
              <>
                <UserCheck size={14}/> Diikuti
              </>
            ) : (
              <>
                <UserPlus size={14}/> Ikuti
              </>
            )}
          </button>
        </div>

        {/* Comments Section */}
        <div className="px-4 pt-4 pb-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-[13.5px] font-extrabold text-gray-900">Komentar</p>
              <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </div>
            <button
              onClick={() => setShowC(!showComments)}
              className="text-[11.5px] font-bold text-emerald-700">
              {showComments ? 'Sembunyikan' : 'Lihat Semua'}
            </button>
          </div>

          {showComments && (
            <div className="space-y-2.5 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                    {c.user === 'Kamu' ? '👤' : (c.user ? c.user.charAt(0) : 'U')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[11.5px] font-bold text-gray-900">{c.user}</p>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-[12px] text-gray-700 mt-0.5 leading-snug">{c.text}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition">
                        <Heart size={10}/> <span>{c.likes}</span>
                      </button>
                      <button className="text-[11px] font-bold text-emerald-700">Balas</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Comment Bar at bottom */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-xs flex-shrink-0 font-bold">
            😊
          </div>
          <div className="flex-1 flex items-center bg-gray-100/90 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-600 transition">
            <input
              value={newMsg}
              onChange={e=>setNewMsg(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Tambahkan komentar publik..."
              className="flex-1 text-[12px] outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            onClick={send}
            disabled={!newMsg.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              newMsg.trim() ? 'bg-emerald-700 text-white shadow-sm active:scale-95' : 'bg-gray-100 text-gray-400'
            }`}>
            <Send size={14} className={newMsg.trim() ? 'translate-x-0.5' : ''}/>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Creator Profile — Modern Channel Style ────────────────
function CreatorProfile({ creator, onBack, onGVPlus, navigate, showToast }) {
  const [innerTab, setInnerTab]       = React.useState('video')
  const [followed, setFollowed]       = React.useState(false)
  const [isMember, setIsMember]       = React.useState(false)
  const [showMembership, setMember]   = React.useState(false)
  const [selectedContent, setContent] = React.useState(null)
  const [selectedPost, setPost]       = React.useState(null)
  const [contentFilter, setFilter]    = React.useState('all')
  const [bioExpanded, setBioExpanded] = React.useState(false)

  const posts = CREATOR_POSTS[creator.id] || []

  // Video player view
  if (selectedContent) return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <VideoPlayerView
        content={selectedContent}
        creator={creator}
        isMember={isMember}
        isFollowed={followed}
        onBack={()=>setContent(null)}
        onMemberRequire={()=>setMember(true)}
        showToast={showToast}
      />
      {showMembership && (
        <MembershipSheet creator={creator} onClose={()=>setMember(false)} onJoined={()=>setIsMember(true)}/>
      )}
    </div>
  )

  // Thread detail view
  if (selectedPost) return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <ThreadDetail
        post={selectedPost}
        creator={creator}
        isMember={isMember}
        onBack={()=>setPost(null)}
        onMemberRequire={()=>setMember(true)}
      />
      {showMembership && (
        <MembershipSheet creator={creator} onClose={()=>setMember(false)} onJoined={()=>setIsMember(true)}/>
      )}
    </div>
  )

  // Content Filtering
  const filteredContents = (creator.contents || []).filter(c =>
    contentFilter === 'all' ? true :
    contentFilter === 'member' ? c.isExclusive :
    !c.isExclusive
  )

  const totalVideos = creator.contents ? creator.contents.length : 0
  const totalViews = creator.totalViews || '124rb'

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 animate-fade-in">
      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-16">

        {/* 1. Cinematic Profile Header Banner */}
        <div className="relative h-36 w-full overflow-hidden flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${creator.bannerG ? creator.bannerG[0] : '#1B6B3A'}, ${creator.bannerG ? creator.bannerG[1] : '#2E7D32'})`
          }}>
          {/* Ambient Lighting & Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />

          {/* Floating Navigation & Badges */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-3.5">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/50 backdrop-blur-md text-white text-[12px] font-bold border border-white/20 active:scale-95 transition shadow-sm">
              <ArrowLeft size={14} strokeWidth={2.5}/> Kembali
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-white/95 bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                {creator.cat || '🌾 Pertanian'}
              </span>
              {creator.hasMember && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-200 bg-amber-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 shadow-xs">
                  <Crown size={11} className="fill-amber-300 text-amber-300"/> Member
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Avatar & Action Bar Row */}
        <div className="relative px-4 bg-white pb-3 pt-0 border-b border-gray-100 shadow-xs">
          <div className="flex items-end justify-between -mt-11 mb-3">
            {/* Squircle Avatar */}
            <div className="w-20 h-20 rounded-3xl ring-4 ring-white shadow-xl flex items-center justify-center text-3xl flex-shrink-0 border border-black/5 z-10"
              style={{
                background: `linear-gradient(135deg, ${creator.bannerG ? creator.bannerG[0] : '#1B6B3A'}, ${creator.bannerG ? creator.bannerG[1] : '#2E7D32'})`
              }}>
              {creator.avatar}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 mb-1 z-10">
              <button
                onClick={() => {
                  setFollowed(!followed)
                  if (!followed && showToast) showToast(`Mengikuti ${creator.name}`)
                }}
                className={`px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs ${
                  followed
                    ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}>
                {followed ? (
                  <>
                    <UserCheck size={14} className="text-emerald-700"/> Diikuti
                  </>
                ) : (
                  <>
                    <UserPlus size={14}/> Ikuti
                  </>
                )}
              </button>

              {creator.hasMember && (
                <button
                  onClick={() => isMember ? showToast?.('Kamu sudah menjadi member aktif') : setMember(true)}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-extrabold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs ${
                    isMember
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-orange-900/20'
                  }`}>
                  {isMember ? (
                    <>
                      <CheckCircle size={14} className="text-emerald-600 fill-emerald-100"/> Member Aktif
                    </>
                  ) : (
                    <>
                      <Crown size={14} className="text-amber-200 fill-amber-200"/> Gabung
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Creator Identity & Metadata */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[18px] font-black text-gray-900 leading-tight">{creator.name}</h1>
              <CheckCircle size={15} className="text-emerald-600 fill-emerald-100 flex-shrink-0"/>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-gray-400 font-medium">
              <span>@{creator.id}</span>
              <span>·</span>
              <span>Kreator Terverifikasi GV</span>
            </div>
          </div>

          {/* Bio with Expand/Collapse */}
          {creator.bio && (
            <div className="mb-3 bg-gray-50/70 rounded-xl p-2.5 border border-gray-100/80">
              <p className={`text-[12.5px] text-gray-700 leading-relaxed ${!bioExpanded ? 'line-clamp-2' : ''}`}>
                {creator.bio}
              </p>
              {creator.bio.length > 80 && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="text-[11.5px] font-bold text-emerald-700 mt-1 flex items-center gap-0.5 hover:underline">
                  {bioExpanded ? (
                    <>Sembunyikan <ChevronUp size={12}/></>
                  ) : (
                    <>Lihat selengkapnya <ChevronDown size={12}/></>
                  )}
                </button>
              )}
            </div>
          )}

          {/* 3. 3-Column Stats Ribbon */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-2xl bg-gray-50/90 border border-gray-100 py-2.5 px-1 text-center">
            <div>
              <p className="text-[14px] font-black text-gray-900 leading-tight">{creator.subs}</p>
              <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">Pengikut</p>
            </div>
            <div>
              <p className="text-[14px] font-black text-gray-900 leading-tight">{totalVideos}</p>
              <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">Karya Video</p>
            </div>
            <div>
              <p className="text-[14px] font-black text-gray-900 leading-tight">{totalViews}</p>
              <p className="text-[10.5px] font-medium text-gray-400 mt-0.5">Tayangan</p>
            </div>
          </div>
        </div>

        {/* 4. Tab Bar (Video / Post) */}
        <div className="px-4 pt-3 pb-1">
          <div className="flex rounded-2xl p-1 bg-gray-200/60 border border-gray-200/50">
            {[
              { id: 'video', label: 'Video', count: (creator.contents || []).length, icon: VideoIcon },
              { id: 'post',  label: 'Postingan', count: posts.length, icon: MessageCircle },
            ].map(tab => {
              const active = innerTab === tab.id
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => { setInnerTab(tab.id); setContent(null); setPost(null) }}
                  className={`flex-1 py-2 text-[12.5px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                    active
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <TabIcon size={14} className={active ? 'text-emerald-700' : 'text-gray-400'}/>
                  <span>{tab.label}</span>
                  <span className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200/80 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Tab Content: Video */}
        {innerTab === 'video' && (
          <div className="pt-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 px-4 pb-2.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Semua Video' },
                { id: 'free', label: 'Gratis' },
                { id: 'member', label: '⭐ Khusus Member' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-[11.5px] font-bold transition-all active:scale-95 ${
                    contentFilter === f.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Video List Cards */}
            <div className="px-4 space-y-2.5">
              {filteredContents.map(c => {
                const locked = c.isExclusive && !isMember
                return (
                  <div
                    key={c.id}
                    onClick={() => locked ? setMember(true) : setContent(c)}
                    className="bg-white rounded-2xl p-2.5 border border-gray-100 shadow-xs hover:border-emerald-200 transition-all flex gap-3 cursor-pointer active:scale-[0.99]">
                    {/* Thumbnail */}
                    <div
                      className="relative flex-shrink-0 rounded-xl overflow-hidden w-32 h-20 bg-gray-900"
                      style={{
                        background: `linear-gradient(135deg, ${c.g ? c.g[0] : '#1B6B3A'}, ${c.g ? c.g[1] : '#2E7D32'})`
                      }}>
                      {c.image && (
                        <img
                          src={c.image}
                          alt={c.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/25" />

                      {locked ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                          <div className="w-8 h-8 rounded-full bg-amber-500/90 flex items-center justify-center shadow-md">
                            <Crown size={15} className="text-white fill-white"/>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white/90">
                            <Play size={13} className="fill-white translate-x-0.5"/>
                          </div>
                        </div>
                      )}

                      {/* Duration Tag */}
                      <span className="absolute bottom-1 end-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs">
                        {c.dur}
                      </span>

                      {/* Exclusive ribbon badge */}
                      {c.isExclusive && (
                        <div className="absolute top-1 start-1 px-1.5 py-0.5 rounded text-[9.5px] font-extrabold text-white flex items-center gap-0.5 bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs">
                          <Crown size={8} className="fill-white"/> Member
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <p className={`text-[13px] font-bold leading-snug line-clamp-2 ${locked ? 'text-gray-600' : 'text-gray-900'}`}>
                          {c.title}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-gray-400">
                        <span>{c.ep}</span>
                        {c.views !== '—' && (
                          <>
                            <span>·</span>
                            <span>{c.views} ditonton</span>
                          </>
                        )}
                        {c.isExclusive && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
                            Eksklusif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {filteredContents.length === 0 && (
                <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-2xl mb-1.5">📹</p>
                  <p className="text-[13px] font-bold text-gray-700">Belum ada konten pada filter ini</p>
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-2 text-[12px] font-bold text-emerald-700 underline">
                    Tampilkan Semua Video
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. Tab Content: Community Post */}
        {innerTab === 'post' && (
          <div className="px-4 pt-2 space-y-3 pb-6">
            {posts.map(p => {
              const locked = p.isExclusive && !isMember
              return (
                <div
                  key={p.id}
                  onClick={() => locked ? setMember(true) : setPost(p)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-emerald-200 transition-all cursor-pointer active:scale-[0.99]">
                  {/* Author Row */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-xs border border-black/5"
                      style={{
                        background: `linear-gradient(135deg, ${creator.bannerG ? creator.bannerG[0] : '#1B6B3A'}, ${creator.bannerG ? creator.bannerG[1] : '#2E7D32'})`
                      }}>
                      {creator.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-[13px] font-extrabold text-gray-900 leading-tight">{creator.name}</p>
                        <CheckCircle size={12} className="text-emerald-600 fill-emerald-100"/>
                        {p.isExclusive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs">
                            <Crown size={8} className="fill-white"/> Member
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {p.timestamp}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (showToast) showToast('Opsi postingan'); }}
                      className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400">
                      <MoreHorizontal size={14}/>
                    </button>
                  </div>

                  {/* Post Text */}
                  <p className="text-[13.5px] text-gray-800 leading-relaxed mb-3 line-clamp-3">
                    {p.text}
                  </p>

                  {/* Post Metrics Footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-50 text-[12px] font-semibold text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 hover:text-red-500 transition">
                        <Heart size={14}/> <span className="tabular-nums">{p.likes}</span> Suka
                      </span>
                      <span className="flex items-center gap-1 hover:text-emerald-700 transition">
                        <MessageCircle size={14}/> <span className="tabular-nums">{p.comments}</span> Balasan
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 hover:underline">
                      {locked ? 'Gabung untuk Baca' : 'Buka Diskusi →'}
                    </span>
                  </div>
                </div>
              )
            })}

            {posts.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-2xl mb-1.5">💬</p>
                <p className="text-[13px] font-bold text-gray-700">Belum ada postingan komunitas</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Channel Membership Sheet Modal */}
      {showMembership && (
        <MembershipSheet
          creator={creator}
          onClose={()=>setMember(false)}
          onJoined={()=>{
            setIsMember(true)
            if (showToast) showToast(`Selamat! Kamu kini member resmi ${creator.name}`)
          }}
        />
      )}
    </div>
  )
}
