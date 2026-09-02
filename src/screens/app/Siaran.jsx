import React, { useState } from 'react'
import { Search, Play, Clock, Sparkles, Tv2, Radio, ArrowLeft as ArrowLeft2, ChevronRight, Lock, X,
  ExternalLink, Bell, Users, Crown, Headphones, CheckCircle,
  Pause, SkipBack, SkipForward, Calendar, MessageCircle, Send,
  ArrowLeft, Video as VideoIcon, Info, Heart, Share2, Mic, Clapperboard, Home, UserCheck, User, MoreHorizontal } from 'lucide-react'
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
    { id:'uk1', title:'Foto Produk Pakai HP, Hasil Pro',     ep:'Kreator · Tips',       dur:'11:20', g:['#E65100','#F4511E'], isGVPlus:false },
    { id:'uk2', title:'Bincang Eko — Strategi UMKM Desa',    ep:'Bincang Eko · Eps. 1', dur:'18:00', g:['#00695C','#00897B'], isGVPlus:false },
    { id:'uk3', title:'GV Update — Fitur Toko Terbaru',      ep:'GV Update',            dur:'6:30',  g:['#1B6B3A','#2E7D32'], isGVPlus:false },
    { id:'uk4', title:'Bisnis UMKM dari Nol',                ep:'Masterclass GV+',      dur:'38:00', g:['#E65100','#F4511E'], isGVPlus:true  },
  ],
  kreator: [
    { id:'uk5', title:'Cara Upload Konten di GV Media',      ep:'Tutorial Kreator',     dur:'9:15',  g:['#1B5E20','#2E7D32'], isGVPlus:false },
    { id:'uk6', title:'Membangun Audiens Lokal dari Desa',   ep:'Kreator · Tips',       dur:'31:00', g:['#4A148C','#7B1FA2'], isGVPlus:false },
    { id:'uk7', title:'Orkes Madun Mencari Biduan',          ep:'Drama Musik · Eps. 6', dur:'27:00', g:['#BF360C','#E53935'], isGVPlus:false },
    { id:'uk8', title:'Perjalanan GV: 3 Tahun Desa',         ep:'Dokumenter GV+',       dur:'44:10', g:['#4A148C','#7B1FA2'], isGVPlus:true  },
  ],
  warga: [
    { id:'uk9',  title:'Kampung Sukasari si Loba Kahayang',  ep:'Drama Sunda · Eps. 1', dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false },
    { id:'uk10', title:'GV Update',                          ep:'Update Platform',      dur:'8:00',  g:['#1B6B3A','#2E7D32'], isGVPlus:false },
    { id:'uk11', title:'Talk Spot — Bincang Hangat',         ep:'Talk Spot · Eps. 3',   dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false },
    { id:'uk12', title:'Masterclass Pertanian Organik',      ep:'Masterclass GV+',      dur:'45:00', g:['#0D47A1','#1565C0'], isGVPlus:true  },
  ],
}
const TRENDING = [
  { id:'tr1', title:'Bugar Ala Gatot',                       ep:'Bersama Aliong · Eps. 1',dur:'14:50',g:['#E65100','#F4511E'], isGVPlus:false },
  { id:'tr2', title:'Talk Spot — Bincang Hangat',            ep:'Talk Spot · Eps. 3',    dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false },
  { id:'tr3', title:'Kampung Sukasari si Loba Kahayang',     ep:'Drama Sunda · Eps. 1',  dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false },
  { id:'tr4', title:'Gerbang Desa — Season 1',               ep:'Dokudrama · Eps. 5',    dur:'32:00', g:['#1B5E20','#2E7D32'], isGVPlus:false },
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
  { id:'c1', title:'Gerbang Desa — Season 1', ep:'Eps. 5 · Dokudrama', dur:'32:00', pct:45, g:['#1B5E20','#2E7D32'] },
  { id:'c2', title:'Talk Spot — Bincang Hangat', ep:'Eps. 3 · Talk Show', dur:'22:00', pct:20, g:['#0D47A1','#1565C0'] },
]
const ALL_ROWS = [
  { title:'Drama & Hiburan', items:[
    { id:'v1',  title:'Kampung Sukasari si Loba Kahayang', ep:'Drama Sunda · Eps. 1',  dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false },
    { id:'v2',  title:'Orkes Madun Mencari Biduan',        ep:'Drama Musik · Eps. 6',  dur:'27:00', g:['#BF360C','#E53935'], isGVPlus:false },
    { id:'v3',  title:'Sampah',                            ep:'Drama Sosial · Eps. 3', dur:'21:00', g:['#4A148C','#7B1FA2'], isGVPlus:false },
    { id:'v4',  title:'Pertandingan Volley',               ep:'Drama Olahraga · Eps. 4',dur:'19:00',g:['#1B5E20','#2E7D32'], isGVPlus:false },
  ]},
  { title:'Talk Show & Diskusi', items:[
    { id:'v5',  title:'Talk Spot — Bincang Hangat',        ep:'Talk Spot · Eps. 3',   dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false },
    { id:'v6',  title:'Sambung Rasa',                      ep:'Sambung Rasa · Eps. 2', dur:'25:00', g:['#37474F','#546E7A'], isGVPlus:false },
    { id:'v7',  title:'Bincang Eko',                       ep:'Bincang Eko · Eps. 1',  dur:'18:00', g:['#00695C','#00897B'], isGVPlus:false },
  ]},
  { title:'Info & Edukasi', items:[
    { id:'v8',  title:'GV Update',                         ep:'Update Platform',       dur:'8:00',  g:['#1B6B3A','#2E7D32'], isGVPlus:false },
    { id:'v9',  title:'Gerbang Desa — Season 1',           ep:'Dokudrama · Eps. 5',   dur:'32:00', g:['#1B5E20','#2E7D32'], isGVPlus:false },
    { id:'v10', title:'Bugar Ala Gatot',                   ep:'Bersama Aliong · Eps. 1',dur:'14:50',g:['#E65100','#F4511E'], isGVPlus:false },
  ]},
]
const GVPLUS_ROWS = [
  { title:'Eksklusif GV+', items:[
    { id:'p1', title:'Masterclass Pertanian Organik',      ep:'Masterclass',          dur:'45:00', g:['#0D47A1','#1565C0'], isGVPlus:true },
    { id:'p2', title:'Teknik Irigasi Hemat Air',           ep:'Edukasi Premium',      dur:'22:15', g:['#00695C','#00897B'], isGVPlus:true },
    { id:'p3', title:'Bisnis UMKM dari Nol',               ep:'Masterclass',          dur:'38:00', g:['#E65100','#F4511E'], isGVPlus:true },
  ]},
  { title:'Dokumenter Premium', items:[
    { id:'p4', title:'Desa Digital: Kisah Sukamaju',       ep:'Dokumenter',           dur:'52:00', g:['#1B5E20','#2E7D32'], isGVPlus:true },
    { id:'p5', title:'Perjalanan GV: 3 Tahun Desa',        ep:'Dokumenter',           dur:'44:10', g:['#4A148C','#7B1FA2'], isGVPlus:true },
  ]},
]
const FREE_ROWS_BOTTOM = [
  { title:'Dari Kreator GV', items:[
    { id:'v11',title:'Panen Perdana Padi Organik',         ep:'Kreator · Eps. 1',     dur:'12:34', g:['#2E7D32','#388E3C'], isGVPlus:false },
    { id:'v12',title:'Tanda Anak Kekurangan Gizi',         ep:'Kreator · Edukasi',    dur:'7:45',  g:['#C62828','#E53935'], isGVPlus:false },
    { id:'v13',title:'Packaging Produk Anti Bocor',        ep:'Kreator · Tips UMKM',  dur:'9:15',  g:['#BF360C','#E53935'], isGVPlus:false },
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
      { id:'kc1', title:'Panen Perdana Padi Organik',        ep:'Eps. 1', dur:'12:34', views:'4.2rb', g:['#1B5E20','#2E7D32'], isExclusive:false },
      { id:'kc2', title:'Cara Olah Tanah Bebas Kimia',       ep:'Eps. 2', dur:'18:20', views:'3.1rb', g:['#2E7D32','#388E3C'], isExclusive:false },
      { id:'kc3', title:'Pemilihan Bibit Unggul Lokal',      ep:'Eps. 3', dur:'15:40', views:'2.8rb', g:['#1B5E20','#2E7D32'], isExclusive:false },
      { id:'kc4', title:'Teknik Penyiraman Efisien [Member]',ep:'Eks. 1', dur:'22:10', views:'—',     g:['#0D47A1','#1565C0'], isExclusive:true  },
      { id:'kc5', title:'Menghitung Keuntungan Panen [Member]',ep:'Eks. 2',dur:'19:30',views:'—',     g:['#4A148C','#7B1FA2'], isExclusive:true  },
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
      { id:'kc6', title:'Packaging Produk Lokal Anti Bocor', ep:'Eps. 1', dur:'9:15',  views:'3.1rb', g:['#BF360C','#E53935'], isExclusive:false },
      { id:'kc7', title:'Foto Produk Pakai HP, Hasil Pro',   ep:'Eps. 2', dur:'11:20', views:'2.4rb', g:['#E65100','#F4511E'], isExclusive:false },
      { id:'kc8', title:'Strategi Harga untuk Pemula [Member]',ep:'Eks. 1',dur:'22:10',views:'—',     g:['#4A148C','#7B1FA2'], isExclusive:true  },
    ]},
  { id:'k3', name:'Dokter Desa',        handle:'@dokterdesa',   subs:'31.5rb', totalVideos:24, totalViews:'210rb',
    tags:'Kesehatan · Edukasi', avatar:'💚', color:'#C62828', bannerG:['#3B0000','#C62828'],
    bio:'Dokter umum yang berbagi edukasi kesehatan praktis untuk keluarga di desa.',
    joinedDate:'Januari 2024',
    hasLinkedCommunity:false, hasMember:false, memberPrice:null, memberBenefits:[],
    contents:[
      { id:'kc9',  title:'Tanda Anak Kekurangan Gizi',       ep:'Eps. 1', dur:'7:45',  views:'8.9rb', g:['#880E4F','#C2185B'], isExclusive:false },
      { id:'kc10', title:'Cara Rawat Luka Bakar Ringan',      ep:'Eps. 2', dur:'5:30',  views:'6.2rb', g:['#C62828','#E53935'], isExclusive:false },
      { id:'kc11', title:'Jadwal Imunisasi Anak Lengkap',     ep:'Eps. 3', dur:'9:10',  views:'5.1rb', g:['#1B5E20','#2E7D32'], isExclusive:false },
    ]},
]

// ── Shared: GV+ Paywall ────────────────────────────────────
function GVPlusPage({ content, onClose }) {
  const [period, setPeriod] = useState('monthly')

  const PLANS = {
    monthly:   { label:'Bulanan',  price:'Rp 19.000', per:'/bulan',   orig:'Rp 35.000', badge:null,           saving:null },
    quarterly: { label:'3 Bulan', price:'Rp 49.000', per:'/3 bulan', orig:'Rp 105.000', badge:'Paling Hemat', saving:'Hemat 53%' },
    yearly:    { label:'Tahunan', price:'Rp 179.000', per:'/tahun',   orig:'Rp 420.000', badge:null,           saving:'Hemat 57%' },
  }

  const BENEFITS = [
    'Akses semua konten GV TV & VOD premium',
    'Nonton & dengarkan tanpa iklan',
    'Download untuk ditonton offline',
    'Podcast eksklusif GV+',
    'Akses awal konten & episode baru',
    'Tersedia di semua perangkat',
  ]

  const plan = PLANS[period]

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
      <div className="relative rounded-t-3xl px-5 pt-5 pb-8 overflow-y-auto no-scrollbar"
        style={{background:'#0C1E0C', maxHeight:'90%', boxShadow:'0 -8px 32px rgba(0,0,0,0.4)'}}>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{background:'rgba(255,255,255,0.1)'}}>
          <X size={16} className="text-white"/>
        </button>

        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="px-3 py-1 rounded-lg" style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
            <span className="text-white font-extrabold text-[15px] tracking-wide">GV+</span>
          </div>
          <span className="text-white/60 text-[13px]">Premium</span>
        </div>

        {/* Triggered from content */}
        {content?.title && (
          <>
            <p className="text-white/50 text-[11px] mb-1">Konten yang ingin kamu tonton:</p>
            <p className="text-white font-bold text-[14px] mb-4 leading-snug">{content.title}</p>
          </>
        )}

        <div className="h-px mb-4" style={{background:'rgba(255,255,255,0.08)'}}/>

        {/* Benefits */}
        {BENEFITS.map(b=>(
          <div key={b} className="flex items-center gap-2.5 mb-2">
            <CheckCircle size={14} style={{color:'#69F0AE', flexShrink:0}}/>
            <span className="text-white/80 text-[12px]">{b}</span>
          </div>
        ))}

        <div className="h-px my-4" style={{background:'rgba(255,255,255,0.08)'}}/>

        {/* Pricing plans */}
        <p className="text-white/50 text-[11px] font-semibold mb-3">Pilih Paket</p>
        <div className="flex flex-col gap-2 mb-4">
          {Object.entries(PLANS).map(([id, p])=>{
            const active = period === id
            return (
              <button key={id} onClick={()=>setPeriod(id)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-left transition w-full"
                style={active
                  ? {background:'rgba(249,168,37,0.15)', border:'1.5px solid #F9A825'}
                  : {background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)'}}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={active ? {borderColor:'#F9A825'} : {borderColor:'rgba(255,255,255,0.3)'}}>
                    {active && <div className="w-2 h-2 rounded-full" style={{background:'#F9A825'}}/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-white">{p.label}</span>
                      {p.badge && (
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{background:'#F9A825', color:'#000'}}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    {p.saving && <p className="text-[12px] font-semibold" style={{color:'#69F0AE'}}>{p.saving}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ms-3">
                  <p className="text-[15px] font-extrabold text-white">{p.price}</p>
                  <p className="text-[11px] text-white/30 line-through">{p.orig}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button className="w-full py-3.5 rounded-2xl text-[14px] font-extrabold text-white flex items-center justify-center gap-2 mb-2"
          style={{background:'linear-gradient(90deg,#F57F17,#F9A825)', boxShadow:'0 4px 16px rgba(249,168,37,0.4)'}}>
          Berlangganan {plan.label} · {plan.price}
        </button>
        <p className="text-center text-[12px] text-white/30 mt-1">Batalkan kapan saja · Tanpa komitmen jangka panjang</p>
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
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative rounded-t-3xl bg-white flex flex-col"
        style={{boxShadow:'0 -8px 32px rgba(0,0,0,0.15)',maxHeight:'90%'}}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-2 pb-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{background:`${creator.color}15`}}>{creator.avatar}</div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">{creator.name}</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Channel Membership</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{background:'#F5F5F5'}}>
            <X size={15} className="text-gray-500"/>
          </button>
        </div>

        <div className="flex-shrink-0 h-px mx-5" style={{background:'#F0F0F0'}}/>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 px-5 pb-8 pt-4">
          {/* Tier selector */}
          <p className="text-[11px] font-bold text-gray-400 mb-3">Pilih Tier</p>
          <div className="flex flex-col gap-2.5 mb-4">
            {tiers.map(t=>{
              const active = selected === t.id
              return (
                <button key={t.id} onClick={()=>setSelected(t.id)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left w-full transition"
                  style={active
                    ? {border:`2px solid ${creator.color}`,background:`${creator.color}06`}
                    : {border:'2px solid #F0F0F0',background:'#FAFAFA'}}>
                  {/* Radio */}
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={active?{borderColor:creator.color}:{borderColor:'#D1D5DB'}}>
                    {active && <div className="w-2 h-2 rounded-full" style={{background:creator.color}}/>}
                  </div>
                  {/* Badge + name */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-base flex-shrink-0">{t.badge}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-[13px] font-bold" style={{color:active?creator.color:'#374151'}}>{t.name}</p>
                        {t.recommended && (
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{background:creator.color}}>Populer</span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-400 mt-0.5">{t.benefits.length} keuntungan</p>
                    </div>
                  </div>
                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-[15px] font-extrabold" style={{color:active?creator.color:'#111827'}}>
                      Rp {t.price.toLocaleString('id')}
                    </p>
                    <p className="text-[11px] text-gray-400">/bulan</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Benefits of selected tier */}
          <p className="text-[11px] font-bold text-gray-400 mb-3">
            Keuntungan {activeTier.name}
          </p>
          {activeTier.benefits.map(b=>(
            <div key={b} className="flex items-start gap-2.5 mb-2.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{background:`${creator.color}15`}}>
                <CheckCircle size={10} style={{color:creator.color}}/>
              </div>
              <span className="text-[12px] text-gray-700 leading-snug">{b}</span>
            </div>
          ))}

          {/* Price summary */}
          <div className="mt-4 mb-3 rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{background:`${creator.color}08`,border:`1.5px solid ${creator.color}20`}}>
            <div>
              <p className="text-[11px] text-gray-500">{activeTier.name} · per bulan</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Batalkan kapan saja</p>
            </div>
            <p className="text-[20px] font-extrabold" style={{color:creator.color}}>
              Rp {activeTier.price.toLocaleString('id')}
            </p>
          </div>

          <p className="text-[12px] text-gray-400 text-center mb-3">
            Pembayaran dilakukan melalui website GV.<br/>Kamu akan diarahkan ke browser.
          </p>
          <button
            onClick={()=>{ onJoined(); onClose() }}
            className="w-full py-3.5 rounded-2xl text-[14px] font-extrabold text-white flex items-center justify-center gap-2"
            style={{background:creator.color,boxShadow:`0 4px 16px ${creator.color}40`}}>
            Gabung Tier {activeTier.name} <ExternalLink size={14}/>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Podcast: Full Player ───────────────────────────────────
function PodcastFullPlayer({ episode, onClose }) {
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  React.useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setProgress(p => Math.min(100, p + 0.5)), 300)
    return () => clearInterval(t)
  }, [playing])
  const show = SHOWS.find(s => s.id === episode.showId) || SHOWS[0]
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative rounded-t-3xl px-5 pt-5 pb-8" style={{background:'#fff',boxShadow:S.sheet}}>
        <button onClick={onClose} className="absolute top-4 end-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{background:'#F5F5F5'}}><X size={16} className="text-gray-500"/></button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
            style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}>
            <show.Icon size={26} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5}/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-extrabold text-gray-900 leading-tight">{episode.title}</p>
            <p className="text-[12px] text-gray-400 mt-0.5">{episode.ep} · {episode.dur}</p>
          </div>
        </div>
        <div className="mb-1.5 h-1.5 rounded-full overflow-hidden" style={{background:'#E8F5E9'}}>
          <div className="h-full rounded-full transition" style={{width:`${progress}%`,background:'#1B6B3A'}}/>
        </div>
        <div className="flex justify-between mb-5">
          <span className="text-[11px] text-gray-400">0:00</span>
          <span className="text-[11px] text-gray-400">{episode.dur}</span>
        </div>
        <div className="flex items-center justify-center gap-8">
          <button onClick={()=>setProgress(p=>Math.max(0,p-5))}
            className="w-10 h-10 flex items-center justify-center rounded-full" style={{background:'#FAFBF9'}}>
            <SkipBack size={18} style={{color:'#1B6B3A'}}/>
          </button>
          <button onClick={()=>setPlaying(!playing)}
            className="w-14 h-14 flex items-center justify-center rounded-full active:scale-[0.96] transition-transform"
            style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',boxShadow:'0 4px 16px rgba(27,107,58,0.35)'}}>
            {playing?<Pause size={22} className="text-white" fill="white"/>:<Play size={22} className="text-white" fill="white"/>}
          </button>
          <button onClick={()=>setProgress(p=>Math.min(100,p+5))}
            className="w-10 h-10 flex items-center justify-center rounded-full" style={{background:'#FAFBF9'}}>
            <SkipForward size={18} style={{color:'#1B6B3A'}}/>
          </button>
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
                      <div className="flex-shrink-0 rounded-xl overflow-hidden"
                        style={{width:64,height:40,background:`linear-gradient(135deg,${v.g[0]},${v.g[1]})`}}/>
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
    <div className="flex-shrink-0 relative bg-cover bg-center" style={{backgroundImage: bgImage, height:160}}>
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
        <div className="flex items-center justify-between">
          <LiveBadge/>
          <span className="text-white/50 text-[12px]">{data.viewers} {isRadio?'pendengar':'penonton'}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={onPlay}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{background:'rgba(255,255,255,0.18)',backdropFilter:'blur(8px)'}}>
            {isRadio&&radioPlaying?<Pause size={20} className="text-white" fill="white"/>:<Play size={20} className="text-white" fill="white"/>}
          </button>
        </div>
        <div>
          <p className="text-white/50 text-[12px] font-medium mb-0.5">{data.ch} · {data.sub}</p>
          <p className="text-white font-extrabold text-[16px] leading-tight">{data.prog}</p>
        </div>
      </div>
      {isRadio&&radioPlaying&&(
        <div className="absolute bottom-4 end-4 flex gap-0.5 items-end h-4">
          {[3,5,7,4,6,3,5,7,4,6].map((h,i)=>(
            <div key={i} className="w-1 rounded-full animate-pulse"
              style={{height:`${h*2}px`,background:'rgba(255,255,255,0.6)',animationDelay:`${i*0.1}s`}}/>
          ))}
        </div>
      )}
    </div>
  )
}
function TabLive({ navigate }) {
  const [sub,setSub]                   = useState('tv')
  const [innerTab,setInnerTab]         = useState('jadwal')
  const [radioPlaying,setRadioPlaying] = useState(false)
  const isTV = sub==='tv'
  const data   = isTV?GV_TV:GV_RADIO
  const jadwal = isTV?JADWAL_TV:JADWAL_RADIO
  const obrolan= isTV?OBROLAN_TV:OBROLAN_RADIO
  const accent = isTV?'#1B6B3A':'#6A1B9A'
  const INNER  = [{id:'jadwal',label:'Jadwal',Icon:Calendar},{id:'obrolan',label:'Obrolan',Icon:MessageCircle},{id:'salam',label:'Kirim Salam',Icon:Send}]
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 flex gap-2 px-4 pt-3 pb-2" style={{background:'#fff',boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        {[['tv','📺  GV TV'],['radio','📻  GV Radio']].map(([id,label])=>(
          <button key={id} onClick={()=>{setSub(id);setInnerTab('jadwal')}}
            className="flex-1 py-2 rounded-xl text-[12px] font-bold transition active:scale-[0.96]"
            style={sub===id?{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',color:'#fff',boxShadow:'0 2px 6px rgba(27,107,58,0.3)'}:{background:'#FAFBF9',color:'#9CA3AF',border:'1px solid #E8F5E9'}}>
            {label}
          </button>
        ))}
      </div>
      <LiveHero data={data} onPlay={()=>setRadioPlaying(!radioPlaying)} radioPlaying={radioPlaying}/>
      
      <PlayerAdsBanner navigate={navigate} />

      <div className="flex-shrink-0 flex" style={{background:'#fff',boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        {INNER.map(t=>(
          <button key={t.id} onClick={()=>setInnerTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold transition ${innerTab===t.id?'':'hover:bg-gray-50'}`}
            style={innerTab===t.id
              ?{color:accent,borderBottom:'2.5px solid transparent',borderImage:`linear-gradient(90deg,${isTV?'#0C3E1E,#1B6B3A':'#4A148C,#6A1B9A'}) 1`}
              :{color:'#9CA3AF',borderBottom:'2.5px solid transparent'}}>
            <t.Icon size={12}/>{t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col" style={{background:'#FAFBF9'}}>
        {innerTab==='jadwal'&&(
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 pb-20">
            <p className="text-[12px] font-semibold text-gray-400 mb-3">Senin, 23 Agustus 2026</p>
            <div className="rounded-2xl overflow-hidden" style={{background:'#fff',boxShadow:S.card}}>
              {jadwal.map((j,i)=>(
                <div key={j.time} className={`flex items-center gap-3 px-4 py-3 ${i<jadwal.length-1?'border-b border-gray-50':''}`}
                  style={j.live?{background:isTV?'#F0FBF0':'#F5F0FF'}:{}}>
                  <span className="text-[12px] font-bold w-10 flex-shrink-0" style={{color:j.live?accent:'#9CA3AF'}}>{j.time}</span>
                  <p className="text-[12px] font-semibold flex-1" style={{color:j.live?accent:'#374151'}}>{j.prog}</p>
                  {j.live&&<LiveBadge/>}
                </div>
              ))}
            </div>
          </div>
        )}
        {innerTab==='obrolan'&&(
          <div className="flex-1 overflow-hidden flex flex-col px-4 pt-4 pb-20">
            <div className="flex-1 overflow-hidden flex flex-col rounded-2xl" style={{background:'#fff',boxShadow:S.card}}>
              <ObrolanPenonton initialMessages={obrolan}/>
            </div>
          </div>
        )}
        {innerTab==='salam'&&(
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-20">
            <div className="rounded-2xl overflow-hidden" style={{background:'#fff',boxShadow:S.card}}>
              <KirimSalam channel={data.ch}/>
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

  if (selectedCreator) {
    const creator = KREATOR.find(k=>k.id===selectedCreator)
    return <CreatorProfile creator={creator} onBack={()=>setSelected(null)}
      onGVPlus={onGVPlus} navigate={navigate} showToast={showToast}/>
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
      <p className="text-[11px] text-gray-400 px-4 pt-3 pb-3 leading-relaxed">
        Ikuti kreator desa GV — atau gabung sebagai member untuk konten & komunitas eksklusif.
      </p>

      {/* Simple creator list */}
      <div className="flex flex-col">
        {KREATOR.map((k, i) => (
          <div key={k.id}>
            <div className="flex items-center gap-3 px-4 py-3.5"
              onClick={()=>setSelected(k.id)}>
              {/* Avatar circle */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0 cursor-pointer"
                style={{background:`linear-gradient(135deg,${k.bannerG[0]},${k.bannerG[1]})`}}>
                {k.avatar}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0 cursor-pointer">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{k.name}</p>
                  {k.hasMember && <Crown size={11} style={{color:'#F9A825'}} className="flex-shrink-0"/>}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{k.subs} pengikut</p>
                <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{k.bio}</p>
              </div>
              {/* Follow button */}
              <button
                className="flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold border transition"
                style={followed[k.id]
                  ? {borderColor:'#D1D5DB',color:'#6B7280',background:'#F9FAFB'}
                  : {borderColor:k.color,color:k.color,background:'transparent'}}
                onClick={e=>{
                  e.stopPropagation()
                  setFollowed(p=>({...p,[k.id]:!p[k.id]}))
                }}>
                {followed[k.id] ? 'Diikuti' : 'Ikuti'}
              </button>
            </div>
            {i < KREATOR.length-1 && <div className="mx-4" style={{height:1,background:'#F0F0F0'}}/>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Video — simplified grid + detail ─────────────────
const ALL_FREE_VIDEOS = [
{ id:'v1',  title:'Kampung Sukasari si Loba Kahayang', ep:'Drama Sunda · Eps. 1',    dur:'24:00', g:['#880E4F','#C2185B'], isGVPlus:false },
  { id:'v2',  title:'Orkes Madun Mencari Biduan',        ep:'Drama Musik · Eps. 6',    dur:'27:00', g:['#BF360C','#E53935'], isGVPlus:false },
  { id:'v3',  title:'Sampah',                            ep:'Drama Sosial · Eps. 3',   dur:'21:00', g:['#4A148C','#7B1FA2'], isGVPlus:false },
  { id:'v4',  title:'Pertandingan Volley',               ep:'Drama Olahraga · Eps. 4', dur:'19:00', g:['#1B5E20','#2E7D32'], isGVPlus:false },
  { id:'v5',  title:'Talk Spot — Bincang Hangat',        ep:'Talk Spot · Eps. 3',      dur:'22:00', g:['#0D47A1','#1565C0'], isGVPlus:false },
  { id:'v6',  title:'Sambung Rasa',                      ep:'Sambung Rasa · Eps. 2',   dur:'25:00', g:['#37474F','#546E7A'], isGVPlus:false },
  { id:'v7',  title:'Bincang Eko',                       ep:'Bincang Eko · Eps. 1',    dur:'18:00', g:['#00695C','#00897B'], isGVPlus:false },
  { id:'v8',  title:'GV Update',                         ep:'Update Platform',         dur:'8:00',  g:['#1B6B3A','#2E7D32'], isGVPlus:false },
  { id:'v9',  title:'Gerbang Desa — Season 1',           ep:'Dokudrama · Eps. 5',      dur:'32:00', g:['#1B5E20','#2E7D32'], isGVPlus:false },
  { id:'v10', title:'Bugar Ala Gatot',                   ep:'Bersama Aliong · Eps. 1', dur:'14:50', g:['#E65100','#F4511E'], isGVPlus:false },
  { id:'v11', title:'Panen Perdana Padi Organik',        ep:'Kreator · Eps. 1',        dur:'12:34', g:['#2E7D32','#388E3C'], isGVPlus:false },
  { id:'v12', title:'Tanda Anak Kekurangan Gizi',        ep:'Kreator · Edukasi',       dur:'7:45',  g:['#C62828','#E53935'], isGVPlus:false }
]
const ALL_GVP_VIDEOS = [
{ id:'p1', title:'Masterclass Pertanian Organik',      ep:'Masterclass GV+',         dur:'45:00', g:['#0D47A1','#1565C0'], isGVPlus:true },
  { id:'p2', title:'Teknik Irigasi Hemat Air',           ep:'Edukasi Premium',         dur:'22:15', g:['#00695C','#00897B'], isGVPlus:true },
  { id:'p3', title:'Bisnis UMKM dari Nol',               ep:'Masterclass GV+',         dur:'38:00', g:['#E65100','#F4511E'], isGVPlus:true },
  { id:'p4', title:'Desa Digital: Kisah Sukamaju',       ep:'Dokumenter GV+',          dur:'52:00', g:['#1B5E20','#2E7D32'], isGVPlus:true },
  { id:'p5', title:'Perjalanan GV: 3 Tahun Desa',        ep:'Dokumenter GV+',          dur:'44:10', g:['#4A148C','#7B1FA2'], isGVPlus:true },
  { id:'p6', title:'Strategi Harga untuk Pemula',        ep:'UMKM Premium',            dur:'29:00', g:['#BF360C','#E53935'], isGVPlus:true }
]

function VideoGridCard({ item, onTap, onGVPlus }) {
  return (
    <div onClick={()=>item.isGVPlus?onGVPlus(item):onTap(item)}
      className="cursor-pointer active:scale-[0.96] transition-transform">
      <div className="rounded-2xl overflow-hidden relative w-full"
        style={{height:110, background:`linear-gradient(135deg,${item.g[0]},${item.g[1]})`, boxShadow:S.card}}>
        {item.isGVPlus && (
          <div className="absolute inset-0" style={{background:'rgba(0,0,0,0.3)'}}/>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {item.isGVPlus
            ? <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{background:'rgba(249,168,37,0.25)',border:'1.5px solid rgba(249,168,37,0.6)'}}>
                <Lock size={14} style={{color:'#F9A825'}}/>
              </div>
            : <Play size={20} className="text-white/60" fill="rgba(255,255,255,0.4)"/>}
        </div>
        {item.isGVPlus && <div className="absolute top-2 start-2"><GVPlusBadge sm/></div>}
        <span className="absolute bottom-2 end-2 text-[11px] font-semibold text-white px-1.5 py-0.5 rounded"
          style={{background:'rgba(0,0,0,0.6)'}}>{item.dur}</span>
      </div>
      <div className="mt-2">
        <p className="text-[11px] font-bold leading-snug line-clamp-2"
          style={{color:item.isGVPlus?'#9CA3AF':'#111827'}}>{item.title}</p>
        <p className="text-[9.5px] mt-0.5" style={{color:'#9CA3AF'}}>{item.ep}</p>
      </div>
    </div>
  )
}

function VideoDetail({ video, onBack, onGVPlus }) {
  const isLocked = video.isGVPlus
  const related  = ALL_FREE_VIDEOS.filter(v=>v.id!==video.id).slice(0,4)
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white"
        style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F2ED'}}>
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="text-[13px] font-bold text-gray-900 line-clamp-2 flex-1">{video.title}</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {/* Player */}
        <div className="relative w-full flex items-center justify-center"
          style={{aspectRatio:'16/9', background:`linear-gradient(155deg,${video.g[0]},${video.g[1]})`}}>
          {isLocked ? (
            <>
              <div className="absolute inset-0" style={{background:'rgba(0,0,0,0.55)'}}/>
              <div className="relative flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                  <Lock size={22} className="text-white"/>
                </div>
                <p className="text-white font-bold text-[14px] mb-1">Konten Eksklusif GV+</p>
                <p className="text-white/50 text-[12px] mb-4">Langganan untuk menonton konten ini</p>
                <button onClick={()=>onGVPlus(video)}
                  className="px-6 py-2.5 rounded-xl text-[12px] font-extrabold text-white"
                  style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                  Mulai Berlangganan GV+
                </button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{background:'rgba(255,255,255,0.2)',backdropFilter:'blur(8px)'}}>
                <Play size={26} className="text-white" fill="white"/>
              </div>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-[16px] font-extrabold text-gray-900 leading-tight mb-1">{video.title}</p>
          <p className="text-[12px] text-gray-400">{video.ep} · {video.dur}</p>
          <div className="h-px my-3" style={{background:'#F0F0F0'}}/>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Konten ini merupakan bagian dari koleksi GV yang diproduksi langsung dari desa-desa afiliasi Global Village. Ditayangkan untuk memberikan informasi dan hiburan berkualitas bagi masyarakat desa.
          </p>
        </div>
        {/* Related */}
        {!isLocked && (
          <div className="px-4 pt-2 pb-4">
            <p className="text-[13px] font-extrabold text-gray-900 mb-3">Video Terkait</p>
            <div className="grid grid-cols-2 gap-3">
              {related.map(v=>(
                <VideoGridCard key={v.id} item={v} onTap={()=>{}} onGVPlus={onGVPlus}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TabVideo({ onGVPlus, userProfile }) {
  const [mode,setMode]                 = React.useState('semua')
  const [selectedVideo,setSelectedVideo] = React.useState(null)
  const showContinue = userProfile?.hasWatchHistory

  if (selectedVideo) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col">
        <VideoDetail video={selectedVideo} onBack={()=>setSelectedVideo(null)} onGVPlus={onGVPlus}/>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
      {/* Tabs: Semua | GV+ */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex p-1 rounded-2xl" style={{background:'#F0F4F0'}}>
          {[['semua','Semua'],['gvplus','GV+']].map(([id,label])=>(
            <button key={id} onClick={()=>setMode(id)}
              className="flex-1 py-2 rounded-xl text-[12px] font-bold transition flex items-center justify-center gap-1.5"
              style={mode===id
                ? id==='gvplus'
                  ? {background:'linear-gradient(90deg,#F57F17,#F9A825)',color:'#fff',boxShadow:'0 2px 8px rgba(249,168,37,0.35)'}
                  : {background:'#fff',color:'#1B6B3A',boxShadow:S.card}
                : {color:'#9CA3AF'}}>
              {id==='gvplus'&&<Crown size={11} style={{color:mode==='gvplus'?'#fff':'#F9A825'}}/>}
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode==='semua' ? (
        <>
          {/* Lanjutkan menonton */}
          {showContinue && (
            <div className="mb-4">
              <p className="text-[13px] font-extrabold text-gray-900 px-4 mb-2.5">Lanjutkan Menonton</p>
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
                      </div>
                      <div className="mt-2 px-0.5">
                        <p className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-snug">{v.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{v.ep}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Grid 2 kolom — semua video gratis */}
          <div className="px-4 mb-2">
            <p className="text-[13px] font-extrabold text-gray-900 mb-3">Semua Tayangan</p>
            <div className="grid grid-cols-2 gap-3">
              {ALL_FREE_VIDEOS.map(v=>(
                <VideoGridCard key={v.id} item={v} onTap={setSelectedVideo} onGVPlus={onGVPlus}/>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* GV+ tab — langsung tampil konten, tanpa banner */
        <div className="pb-4 pt-4">
          <div className="px-4">
            <p className="text-[13px] font-extrabold text-gray-900 mb-3">Konten Eksklusif GV+</p>
            <div className="grid grid-cols-2 gap-3">
              {ALL_GVP_VIDEOS.map(v=>(
                <VideoGridCard key={v.id} item={v} onTap={()=>onGVPlus(v)} onGVPlus={onGVPlus}/>
              ))}
            </div>
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
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 relative pb-5 bg-cover bg-center"
        style={{backgroundImage: `url(https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=800&q=80)`}}>
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10">
          <div className="flex items-center px-4 pt-4 pb-3">
            <button onClick={onBack}
              className="w-8 h-8 rounded-full flex items-center justify-center me-3 flex-shrink-0"
              style={{background:'rgba(255,255,255,0.15)'}}>
              <ArrowLeft size={16} className="text-white"/>
            </button>
            <p className="text-[13px] font-bold text-white line-clamp-2">Detail Acara</p>
          </div>
          <div className="flex items-center gap-4 px-4 mb-4">
            <div className="w-20 h-20 rounded-[18px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
              style={{background:'rgba(255,255,255,0.2)',backdropFilter:'blur(12px)',boxShadow:'0 4px 16px rgba(0,0,0,0.1) inset'}}>
              <show.Icon size={36} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[18px] font-extrabold text-white leading-tight">{show.name}</p>
              <p className="text-[12px] text-white/60 mt-1">Global Village · {show.eps} Episode</p>
              <p className="text-[11px] text-white/80 mt-1 leading-snug">{show.desc}</p>
            </div>
          </div>
          <div className="px-4">
            <button onClick={()=>onPlayEpisode(eps[0]||EPISODES[0])}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-extrabold"
              style={{background:'rgba(255,255,255,0.95)',color:show.g[0]}}>
              <Play size={13} fill={show.g[0]} style={{color:show.g[0]}}/> Mulai Mendengarkan
            </button>
          </div>
        </div>
      </div>

      {/* Episode list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20" style={{background:'#FAFBF9'}}>
        <div className="px-4 pt-4 mb-2">
          <p className="text-[13px] font-extrabold text-gray-900">
            Semua Episode <span className="text-gray-400 font-normal text-[11px]">({eps.length} episode)</span>
          </p>
        </div>
        {eps.length > 0 ? eps.map((ep,i) => (
          <div key={ep.id}
            className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-gray-50 ${i < eps.length-1 ? 'border-b border-gray-50':''}`}
            onClick={()=>onPlayEpisode(ep)}>
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
              style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}>
              {ep.hasArt ? <show.Icon size={22} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/> : <Headphones size={22} className="text-white/80 drop-shadow-sm relative z-10" strokeWidth={1.5}/>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{ep.title}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{ep.ep} · {ep.dur}</p>
            </div>
            <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{background:'#1B6B3A',boxShadow:'0 2px 6px rgba(27,107,58,0.3)'}}>
              <Play size={13} className="text-white" fill="white"/>
            </button>
          </div>
        )) : (
          <div className="px-4 py-8 text-center">
            <p className="text-[13px] text-gray-400">Belum ada episode tersedia.</p>
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

// ── Tab: Podcast — simplified with GV+ tab ───────────────
const GVPLUS_PODCASTS = [
  { id:'gp1', title:'Masterclass Bertani: Q&A Eksklusif', show:'Bersama Aliong',   ep:'Premium · 45:00', showId:'aliong',   isGVPlus:true },
  { id:'gp2', title:'Behind The Scene: Kampung Sukasari', show:'Kampung Sukasari', ep:'Premium · 32:00', showId:'sukasari', isGVPlus:true },
  { id:'gp3', title:'Wawancara Eksklusif Kepala Desa',    show:'Cerita Kabayan',   ep:'Premium · 28:00', showId:'kabayan',  isGVPlus:true },
]

function TabPodcast({ onPlayEpisode, onGVPlus }) {
  const [mode,setMode]               = React.useState('semua')
  const [selectedShow,setSelectedShow] = React.useState(null)

  if (selectedShow) {
    const show = SHOWS.find(s=>s.id===selectedShow)
    return <PodcastShowDetail show={show} onBack={()=>setSelectedShow(null)} onPlayEpisode={onPlayEpisode}/>
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
      {/* Tabs: Semua | GV+ */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex p-1 rounded-2xl" style={{background:'#F0F4F0'}}>
          {[['semua','Semua'],['gvplus','GV+']].map(([id,label])=>(
            <button key={id} onClick={()=>setMode(id)}
              className="flex-1 py-2 rounded-xl text-[12px] font-bold transition flex items-center justify-center gap-1.5"
              style={mode===id
                ? id==='gvplus'
                  ? {background:'linear-gradient(90deg,#F57F17,#F9A825)',color:'#fff',boxShadow:'0 2px 8px rgba(249,168,37,0.35)'}
                  : {background:'#fff',color:'#1B6B3A',boxShadow:S.card}
                : {color:'#9CA3AF'}}>
              {id==='gvplus'&&<Crown size={11} style={{color:mode==='gvplus'?'#fff':'#F9A825'}}/>}
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode==='semua' ? (
        <>
          {/* Acara Unggulan */}
          <div className="mx-4 mb-4 rounded-2xl overflow-hidden cursor-pointer active:scale-[0.96] transition-transform spotlight-border"
            style={{background:`linear-gradient(155deg,${SHOWS[0].g[0]},${SHOWS[0].g[1]})`,boxShadow:S.cardMd}}
            onClick={()=>onPlayEpisode(EPISODES.find(e=>e.showId===SHOWS[0].id)||EPISODES[0])}>
            <div className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 rounded-[16px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                style={{background:'rgba(255,255,255,0.2)',backdropFilter:'blur(8px)',boxShadow:'0 4px 12px rgba(0,0,0,0.1) inset'}}>
                {React.createElement(SHOWS[0].Icon, {size: 30, className: "text-white drop-shadow-md relative z-10", strokeWidth: 1.5})}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-[11px] font-bold mb-1">Acara Unggulan</p>
                <p className="text-white font-extrabold text-[16px] leading-tight">{SHOWS[0].name}</p>
                <p className="text-white/60 text-[12px] mt-0.5">Global Village · {SHOWS[0].eps} Episode</p>
                <button className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold"
                  style={{background:'rgba(255,255,255,0.95)',color:SHOWS[0].g[0]}}>
                  <Play size={11} fill={SHOWS[0].g[0]} style={{color:SHOWS[0].g[0]}}/> Dengarkan
                </button>
              </div>
            </div>
          </div>

          {/* Telusuri Acara */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-4 mb-3">
              <p className="text-[14px] font-extrabold text-gray-900">Telusuri Acara</p>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                style={{background:'#1B6B3A'}}>{SHOWS.length}</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-1">
              {SHOWS.map(show=>(
                <div key={show.id} onClick={()=>setSelectedShow(show.id)}
                  className="flex-shrink-0 cursor-pointer active:scale-[0.96] transition-transform">
                  <div className="w-28 h-28 rounded-[20px] flex items-center justify-center mb-2 relative spotlight-border shadow-inner overflow-hidden"
                    style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`,boxShadow:S.cardMd}}>
                    <show.Icon size={46} className="text-white drop-shadow-lg relative z-10" strokeWidth={1.5}/>
                    <div className="absolute bottom-2 end-2 w-6 h-6 rounded-full flex items-center justify-center z-20"
                      style={{background:'rgba(255,255,255,0.9)'}}>
                      <Play size={10} fill={show.g[0]} style={{color:show.g[0]}}/>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-gray-900 w-28 line-clamp-2">{show.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{show.eps} Episode</p>
                </div>
              ))}
            </div>
          </div>

          {/* Episode Terbaru */}
          <div className="pb-4">
            <div className="flex items-center gap-2 px-4 mb-3">
              <p className="text-[14px] font-extrabold text-gray-900">Episode Terbaru</p>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                style={{background:'#1B6B3A'}}>{EPISODES.length}</span>
            </div>
            <div className="flex flex-col">
              {EPISODES.map((ep,i)=>{
                const show = SHOWS.find(s=>s.id===ep.showId)||SHOWS[0]
                return (
                  <div key={ep.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors ${i<EPISODES.length-1?'border-b border-gray-50':''}`}
                    onClick={()=>onPlayEpisode(ep)}>
                    {ep.hasArt
                      ?<div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                          style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}>
                          <show.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
                        </div>
                      :<div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden" style={{background:'#E8F5E9'}}>
                          <Headphones size={22} style={{color:'#1B6B3A'}} className="relative z-10" strokeWidth={1.5}/>
                        </div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{ep.title}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{ep.ep} · {ep.dur}</p>
                    </div>
                    <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:'#1B6B3A',boxShadow:'0 2px 6px rgba(27,107,58,0.3)'}}>
                      <Play size={13} className="text-white" fill="white"/>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        /* GV+ tab — langsung tampil konten, tanpa banner */
        <div className="pb-4 pt-4">
          <p className="text-[13px] font-extrabold text-gray-900 px-4 mb-3">Podcast Eksklusif GV+</p>
          <div className="flex flex-col gap-2.5 px-4">
            {GVPLUS_PODCASTS.map(ep=>{
              const show = SHOWS.find(s=>s.id===ep.showId)||SHOWS[0]
              return (
                <div key={ep.id} onClick={()=>onGVPlus(ep)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5 cursor-pointer active:scale-[0.96] transition-transform"
                  style={{background:'#fff',boxShadow:S.card}}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                    style={{background:`linear-gradient(135deg,${show.g[0]},${show.g[1]})`}}>
                    <Headphones size={20} className="text-white/50"/>
                    <div className="absolute -top-1 -end-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                      <Lock size={9} className="text-white"/>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{ep.title}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{ep.show} · {ep.ep}</p>
                  </div>
                  <GVPlusBadge sm/>
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
    <div className="flex flex-col h-full relative" style={{background:'#FAFBF9'}}>
      {/* Search overlay — at root to cover full screen including header */}
      {showSearch && <SearchScreen onClose={()=>setShowSearch(false)} onGVPlus={c=>{setPaywall(c);setShowSearch(false)}} navigate={navigate}/>}
      {/* Header */}
      <div className="flex-shrink-0 relative"
        style={{background:'linear-gradient(155deg,#061A0D 0%,#0C3E1E 55%,#1B6B3A 100%)'}}>
        <div className="absolute -top-8 -end-8 w-36 h-36 rounded-full pointer-events-none"
          style={{background:'rgba(255,255,255,0.04)',zIndex:0}}/>
        <div className="flex items-center justify-between px-4 pt-5 pb-3 relative z-10">
          <div>
            <p className="text-[20px] font-extrabold text-white tracking-tight">GV Media</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={()=>setPaywall({title:null})}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition active:scale-[0.96]"
              style={{background:'linear-gradient(90deg,#F57F17,#F9A825)',boxShadow:'0 2px 8px rgba(249,168,37,0.4)'}}>
              <Crown size={12} className="text-white"/>
              <span className="text-white font-extrabold text-[11px]">GV+</span>
            </button>
          </div>
        </div>
        <div className="px-4 mb-3 mt-1 relative z-10">
          <button onClick={()=>setShowSearch(true)} className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl" style={{background:'rgba(255,255,255,0.15)'}}>
            <Search size={15} className="text-white/70"/>
            <span className="text-[13px] text-white/70">Cari siaran, video, kreator...</span>
          </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-4 gap-1 pb-0 relative z-10">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className="flex-shrink-0 px-4 py-2.5 text-[12px] font-bold transition"
              style={tab===t.id?{color:'white',borderBottom:'2.5px solid white'}:{color:'rgba(255,255,255,0.4)',borderBottom:'2.5px solid transparent'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {tab==='live'    && <TabLive navigate={navigate}/>}
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
    </div>
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

// ── Thread Detail — Twitter thread style ───────────────────
function ThreadDetail({ post, creator, isMember, onBack }) {
  const init = POST_COMMENTS_DATA[post.id] || POST_COMMENTS_DATA.default
  const [comments, setComments] = React.useState([...init])
  const [newMsg, setNewMsg]     = React.useState('')
  const [liked, setLiked]       = React.useState(false)

  const send = () => {
    if (!newMsg.trim() || !isMember) return
    setComments(p=>[{id:Date.now(),user:'Kamu',avIcon:User,text:newMsg,likes:0,time:'Baru saja'},...p])
    setNewMsg('')
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F2ED'}}>
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="text-[14px] font-bold text-gray-900">Postingan</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Original post */}
        <div className="px-4 pt-4 pb-4" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{background:`linear-gradient(135deg,${creator.bannerG[0]},${creator.bannerG[1]})`}}>
              {creator.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] font-bold text-gray-900">{creator.name}</p>
                {post.isExclusive && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                    style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                    <Crown size={8} className="text-white"/>
                    <span className="text-[11px] font-bold text-white">Member</span>
                  </div>
                )}
                <span className="text-[12px] text-gray-400 ms-auto">{post.timestamp}</span>
              </div>
              <p className="text-[14px] text-gray-800 leading-relaxed mt-1">{post.text}</p>
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-50">
                <button onClick={()=>setLiked(!liked)}
                  className="flex items-center gap-1.5 text-[12px] transition-colors"
                  style={{color:liked?'#E53935':'#9CA3AF'}}>
                  <Heart size={15} fill={liked?'#E53935':'none'} style={{color:liked?'#E53935':'#9CA3AF'}}/>
                  {post.likes+(liked?1:0)} Suka
                </button>
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  <MessageCircle size={15}/>{comments.length} Balasan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="pb-24">
          {comments.map((c,i)=>(
            <div key={c.id}
              className={`flex gap-3 px-4 py-3 ${i<comments.length-1?'border-b border-gray-50':''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner flex-shrink-0"
                style={{background:'#E8F5E9'}}>
                {c.avIcon ? <c.avIcon size={16} className="text-gray-600"/> : <User size={16} className="text-gray-600"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-bold text-gray-900">{c.user}</p>
                  <span className="text-[12px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-[12.5px] text-gray-700 mt-0.5 leading-snug">{c.text}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <button className="flex items-center gap-1 text-[12px] text-gray-400">
                    <Heart size={11}/>{c.likes}
                  </button>
                  <button className="text-[12px] font-semibold" style={{color:creator.color}}>Balas</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-white" style={{boxShadow:'0 -1px 0 rgba(27,107,58,0.06)'}}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{background:`${creator.color}15`}}>😊</div>
        {isMember ? (
          <>
            <div className="flex-1 flex items-center rounded-full px-3.5 py-2"
              style={{background:'#F5F5F5'}}>
              <input value={newMsg} onChange={e=>setNewMsg(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder="Tulis balasan…"
                className="flex-1 text-[12px] outline-none bg-transparent text-gray-700"/>
            </div>
            <button onClick={send}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition"
              style={{background:newMsg.trim()?creator.color:'#E0E0E0'}}>
              <Send size={13} className="text-white" style={{marginInlineStart:1}}/>
            </button>
          </>
        ) : (
          <button onClick={()=>{}} className="flex-1 text-center text-[11px] py-2 rounded-full font-semibold"
            style={{background:`${creator.color}15`,color:creator.color}}>
            Gabung member untuk ikut berkomentar
          </button>
        )}
      </div>
    </div>
  )
}

// ── Video Player View — YouTube mobile style ───────────────
function VideoPlayerView({ content, creator, isMember, isFollowed, onBack, onMemberRequire }) {
  const locked = content.isExclusive && !isMember
  const initComments = VIDEO_COMMENTS_DATA[content.id] || VIDEO_COMMENTS_DATA.default
  const [comments, setComments]   = React.useState([...initComments])
  const [newMsg, setNewMsg]       = React.useState('')
  const [liked, setLiked]         = React.useState(false)
  const [playing, setPlaying]     = React.useState(false)
  const [followed, setFollowed]   = React.useState(isFollowed)
  const [showComments, setShowC]  = React.useState(false)

  const send = () => {
    if (!newMsg.trim()) return
    setComments(p=>[{id:Date.now(),user:'Kamu',avIcon:User,text:newMsg,likes:0,time:'Baru saja'},...p])
    setNewMsg('')
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      {/* Back header */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F2ED'}}>
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* 16:9 Player */}
        <div className="relative w-full bg-cover bg-center flex items-center justify-center"
          style={{aspectRatio:'16/9',backgroundImage:`url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80)`}}>
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />
          {locked ? (
            <>
              <div className="absolute inset-0" style={{background:'rgba(0,0,0,0.65)'}}/>
              <div className="relative flex flex-col items-center text-center px-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                  style={{background:'linear-gradient(135deg,#F57F17,#F9A825)'}}>
                  <Crown size={20} className="text-white"/>
                </div>
                <p className="text-white font-bold text-[14px] mb-1">Konten Members Only</p>
                <p className="text-white/60 text-[12px] mb-3">Gabung member {creator.name} untuk menonton</p>
                <button onClick={onMemberRequire}
                  className="px-5 py-2 rounded-full text-[11px] font-bold text-white"
                  style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                  Gabung Member · Rp {creator.memberPrice?.toLocaleString('id')}/bln
                </button>
              </div>
            </>
          ) : (
            <button onClick={()=>setPlaying(!playing)} className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{background:'rgba(0,0,0,0.4)',backdropFilter:'blur(4px)'}}>
                {playing
                  ? <Pause size={22} className="text-white" fill="white"/>
                  : <Play size={22} className="text-white" fill="white"/>}
              </div>
            </button>
          )}
          {!locked && (
            <span className="absolute bottom-2 end-2 text-[11px] text-white px-1.5 py-0.5 rounded"
              style={{background:'rgba(0,0,0,0.6)'}}>{content.dur}</span>
          )}
        </div>

        {/* Video info */}
        <div className="px-4 pt-3 pb-2">
          {content.isExclusive && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md mb-1.5"
              style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
              <Crown size={9} className="text-white"/>
              <span className="text-[11px] font-bold text-white">Members only</span>
            </div>
          )}
          <p className="text-[16px] font-bold text-gray-900 leading-tight">{content.title}</p>
          <p className="text-[11px] text-gray-400 mt-1">
            {content.ep} · {content.dur}
            {content.views !== '—' && ` · ${content.views} ditonton`}
          </p>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-1 px-4 pb-3 overflow-x-auto no-scrollbar">
          {[
            { label: liked ? 'Disukai' : 'Suka', Icon: Heart, active: liked, action: ()=>setLiked(!liked) },
            { label: `${comments.length} Komentar`, Icon: MessageCircle, active: false, action: ()=>setShowC(!showComments) },
            { label: 'Bagikan', Icon: Share2, active: false, action: ()=>showToast('Link konten berhasil disalin!') },
          ].map(({label,Icon,active,action})=>(
            <button key={label} onClick={action||undefined}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold"
              style={{
                background: active ? `${creator.color}15` : '#F5F5F5',
                color: active ? creator.color : '#6B7280'
              }}>
              <Icon size={13} fill={active&&label!=='Bagikan'?creator.color:'none'}
                style={{color:active?creator.color:'#6B7280'}}/>
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{height:8,background:'#F5F5F5'}}/>

        {/* Creator row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{background:`linear-gradient(135deg,${creator.bannerG[0]},${creator.bannerG[1]})`}}>
            {creator.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900">{creator.name}</p>
            <p className="text-[12px] text-gray-400">{creator.subs} pengikut</p>
          </div>
          <button onClick={()=>setFollowed(!followed)}
            className="px-4 py-2 rounded-full text-[11px] font-bold border transition"
            style={followed
              ? {borderColor:'#D1D5DB',color:'#6B7280',background:'#F9FAFB'}
              : {borderColor:creator.color,color:creator.color,background:'transparent'}}>
            {followed ? 'Diikuti' : 'Ikuti'}
          </button>
        </div>

        {/* Divider */}
        <div style={{height:8,background:'#F5F5F5'}}/>

        {/* Comments section */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p className="text-[14px] font-bold text-gray-900">Komentar</p>
          <button onClick={()=>setShowC(!showComments)}
            className="text-[11px] font-semibold" style={{color:creator.color}}>
            {showComments ? 'Sembunyikan' : `Lihat semua ${comments.length}`}
          </button>
        </div>

        {/* Comment preview or full list */}
        {!showComments ? (
          comments.slice(0,2).map(c=>(
            <div key={c.id} className="flex gap-2.5 px-4 pb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner flex-shrink-0"
                style={{background:'#E8F5E9'}}>
                {c.avIcon ? <c.avIcon size={14} className="text-gray-600"/> : <User size={14} className="text-gray-600"/>}
              </div>
              <div className="flex-1 min-w-0 rounded-2xl px-3 py-2" style={{background:'#F5F5F5'}}>
                <p className="text-[11px] font-bold text-gray-900">{c.user}</p>
                <p className="text-[11.5px] text-gray-700 mt-0.5 leading-snug">{c.text}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            {comments.map((c,i)=>(
              <div key={c.id} className={`flex gap-2.5 px-4 pb-3 ${i===0?'pt-1':''}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner flex-shrink-0"
                  style={{background:'#E8F5E9'}}>
                  {c.avIcon ? <c.avIcon size={14} className="text-gray-600"/> : <User size={14} className="text-gray-600"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="rounded-2xl px-3 py-2" style={{background:'#F5F5F5'}}>
                    <p className="text-[11px] font-bold text-gray-900">{c.user}</p>
                    <p className="text-[11.5px] text-gray-700 mt-0.5 leading-snug">{c.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <span className="text-[11px] text-gray-400">{c.time}</span>
                    <button className="flex items-center gap-0.5 text-[12px] text-gray-400">
                      <Heart size={10}/>{c.likes}
                    </button>
                    <button className="text-[12px] font-semibold" style={{color:creator.color}}>Balas</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2.5 px-4 py-3" style={{boxShadow:'0 -1px 0 rgba(27,107,58,0.06)'}}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{background:`${creator.color}15`}}>😊</div>
          <div className="flex-1 flex items-center rounded-full px-3.5 py-2"
            style={{background:'#F5F5F5'}}>
            <input value={newMsg} onChange={e=>setNewMsg(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&send()}
              placeholder="Tambahkan komentar…"
              className="flex-1 text-[12px] outline-none bg-transparent text-gray-700"/>
          </div>
          <button onClick={send}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition"
            style={{background:newMsg.trim()?creator.color:'#E0E0E0'}}>
            <Send size={13} className="text-white" style={{marginInlineStart:1}}/>
          </button>
        </div>

        <div className="pb-20"/>
      </div>
    </div>
  )
}

// ── Creator Profile — YouTube channel style ────────────────
function CreatorProfile({ creator, onBack, onGVPlus, navigate, showToast }) {
  const [innerTab, setInnerTab]       = React.useState('video')
  const [followed, setFollowed]       = React.useState(false)
  const [isMember, setIsMember]       = React.useState(false)
  const [showMembership, setMember]   = React.useState(false)
  const [selectedContent, setContent] = React.useState(null)
  const [selectedPost, setPost]       = React.useState(null)
  const [contentFilter, setFilter]    = React.useState('all')
  const [bioExpanded, setBioExpanded] = React.useState(false)

  const posts  = CREATOR_POSTS[creator.id] || []

  // Video player
  if (selectedContent) return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <VideoPlayerView
        content={selectedContent} creator={creator}
        isMember={isMember} isFollowed={followed}
        onBack={()=>setContent(null)}
        onMemberRequire={()=>setMember(true)}/>
      {showMembership && (
        <MembershipSheet creator={creator} onClose={()=>setMember(false)} onJoined={()=>setIsMember(true)}/>
      )}
    </div>
  )

  // Thread detail
  if (selectedPost) return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <ThreadDetail post={selectedPost} creator={creator} isMember={isMember}
        onBack={()=>setPost(null)}/>
      {showMembership && (
        <MembershipSheet creator={creator} onClose={()=>setMember(false)} onJoined={()=>setIsMember(true)}/>
      )}
    </div>
  )

  // Filter konten
  const filteredContents = creator.contents.filter(c=>
    contentFilter==='all' ? true :
    contentFilter==='member' ? c.isExclusive :
    !c.isExclusive
  )

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 animate-fade-in">
      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Profile Info Section */}
        <div className="px-4 pt-3 pb-4 bg-white">
          {/* Back Button */}
          <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-[13px] text-gray-500 font-bold active:opacity-70 transition">
            <ArrowLeft size={16}/> Kembali
          </button>

          {/* Avatar & Name Group */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{background:`linear-gradient(135deg,${creator.bannerG[0]},${creator.bannerG[1]})`}}>
              {creator.avatar}
            </div>

            {/* Name & Badge */}
            <div>
              <div className="flex items-center gap-1">
                <p className="text-[16px] font-extrabold text-gray-900 leading-tight">{creator.name}</p>
                {/* Verified Badge */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#111827" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Bio */}
          {creator.bio && (
            <div className="mt-3">
              <p className={`text-[13px] text-gray-700 leading-relaxed ${!bioExpanded ? 'line-clamp-2' : ''}`}>
                {creator.bio}
              </p>
              {creator.bio.length > 70 && !bioExpanded && (
                <button onClick={() => setBioExpanded(true)} className="text-[12px] font-bold mt-1.5 flex items-center gap-1" style={{color:'#1B6B3A'}}>
                  Lihat selengkapnya <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={()=>{
                setFollowed(!followed)
                if(!followed && showToast) showToast(`Mengikuti ${creator.name}`)
              }}
              className="px-4 py-1.5 rounded-lg text-[13px] font-bold border transition-transform active:scale-[0.98]"
              style={followed
                ? {borderColor:'#E5E7EB',color:'#4B5563',background:'#F9FAFB'}
                : {borderColor:'#D1D5DB',color:'#374151',background:'white'}}>
              {followed ? 'Diikuti' : 'Ikuti'}
            </button>
            {creator.hasMember && (
              <button
                onClick={()=>isMember ? showToast?.('Kamu sudah menjadi member') : setMember(true)}
                className="px-4 py-1.5 rounded-lg text-[13px] font-bold text-white transition-transform active:scale-[0.98]"
                style={isMember
                  ? {background:'#F5F5F5',color:'#666'}
                  : {background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                <Crown size={12} className="inline me-1.5 -mt-0.5"/>
                {isMember ? 'Member' : 'Gabung'}
              </button>
            )}
          </div>
        </div>

        {/* Thick Divider */}
        <div className="h-1.5 w-full bg-gray-100/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]" />

        {/* Tab bar */}
        <div className="px-4 mt-2 mb-2">
          <div className="flex rounded-xl p-1 bg-gray-100/80">
            {[['video','Video'],['post','Post']].map(([id,label])=>(
              <button key={id}
                onClick={()=>{ setInnerTab(id); setContent(null); setPost(null) }}
                className="flex-1 py-2 text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                style={innerTab===id
                  ? {background:'white', color:'#1B6B3A', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}
                  : {color:'#6B7280'}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="pt-2">

        {/* ── Tab: Video ── */}
        {innerTab==='video' && (
          <div className="flex flex-col">
            {filteredContents.map((c,i)=>{
              const locked = c.isExclusive && !isMember
              return (
                <div key={c.id}
                  onClick={()=>locked ? setMember(true) : setContent(c)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer active:bg-gray-100 transition-colors
                    ${i < filteredContents.length-1 ? 'border-b border-black/5' : ''}`}>
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 rounded-xl overflow-hidden"
                    style={{width:120,height:68,background:`linear-gradient(135deg,${c.g[0]},${c.g[1]})`}}>
                    {locked
                      ? <div className="absolute inset-0 flex items-center justify-center" style={{background:'rgba(0,0,0,0.4)'}}>
                          <Crown size={18} style={{color:'#F9A825'}}/>
                        </div>
                      : <div className="absolute inset-0 flex items-center justify-center">
                          <Play size={18} className="text-white/70" fill="rgba(255,255,255,0.5)"/>
                        </div>
                    }
                    <span className="absolute bottom-1 end-1 text-[11px] text-white px-1 py-0.5 rounded"
                      style={{background:'rgba(0,0,0,0.65)'}}>{c.dur}</span>
                    {c.isExclusive && (
                      <div className="absolute top-1 start-1 px-1 py-0.5 rounded"
                        style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
                        <Crown size={7} className="text-white"/>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-[12.5px] font-semibold leading-snug line-clamp-2"
                      style={{color:locked?'#9CA3AF':'#111827'}}>{c.title}</p>
                    <div className="flex flex-wrap items-center gap-x-1.5 mt-1.5">
                      <span className="text-[12px] text-gray-400">{c.ep}</span>
                      {c.views !== '—' && <>
                        <span className="text-gray-200">·</span>
                        <span className="text-[12px] text-gray-400">{c.views} ditonton</span>
                      </>}
                      {c.isExclusive && (
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{background:'#FFF8E1',color:'#F57F17'}}>Members only</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Tab: Post ── */}
        {innerTab==='post' && (
          <div className="flex flex-col pb-6">
            {posts.map((p,i) => {
              const locked = p.isExclusive && !isMember
              return (
                <div key={p.id} className="px-4 py-2.5">
                  <div className="bg-white rounded-2xl p-4 cursor-pointer transition-transform active:scale-[0.96] w-full box-border" 
                    onClick={() => { locked ? setMember(true) : setPost(p) }}
                    style={{boxShadow: '0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                        style={{background:creator.color || 'linear-gradient(135deg,#1B5E20,#2E7D32)'}}>🌾</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-[12px] font-bold text-gray-900">{creator.name}</p>
                          {p.isExclusive && (
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                              style={{background:'linear-gradient(90deg,#F57F17,#F9A825)',boxShadow:'0 2px 8px rgba(249,168,37,0.3)'}}>
                              <Crown size={8} className="text-white"/>
                              <span className="text-[11px] font-bold text-white">Members only</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 leading-snug">
                          {p.timestamp}
                        </p>
                      </div>
                      <div className="relative">
                        <button className="w-7 h-7 rounded-full flex items-center justify-center transition active:scale-[0.96]"
                          style={{background:'#F5F5F5'}}>
                          <MoreHorizontal size={13} className="text-gray-500"/>
                        </button>
                      </div>
                    </div>

                    <p className="text-[13px] text-gray-800 leading-relaxed mb-3 whitespace-pre-wrap line-clamp-3">
                      {p.text}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
                        <Heart size={14} strokeWidth={2}/> <span className="tabular-nums">{p.likes}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
                        <MessageCircle size={14} strokeWidth={2}/> <span className="tabular-nums">{p.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </div>
      </div>

      {showMembership && (
        <MembershipSheet creator={creator} onClose={()=>setMember(false)} onJoined={()=>setIsMember(true)}/>
      )}
    </div>
  )
}
