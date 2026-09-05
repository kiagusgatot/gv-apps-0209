import React, { useState, useRef } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import SearchBar from '@/components/molecules/SearchBar'
import {
  ChevronRight, Search, Sparkles, Wheat, ShoppingBag, HeartPulse,
  GraduationCap, Users, ArrowLeft, Plus, Heart, MessageCircle, Send,
  ChevronDown, Shield, Flag, X, Pin, Tag, Megaphone, Trash2, PinOff,
  CheckCircle, CheckCircle2, AlertCircle, Image, Store, BadgeCheck, Clock,
  Leaf, Egg, Package, User, Bot, UserCheck, TrendingUp, Calendar, MapPin,
  Share2, Check, ExternalLink, HelpCircle, PhoneCall, RefreshCw, ThumbsUp,
  SlidersHorizontal, Coffee, HelpCircle as QuestionIcon
} from 'lucide-react'
import BottomNav from '../../components/BottomNav'

const PRIMARY = '#1B6B3A'
const ADMIN_COLOR = '#6A1B9A'
const JB_COLOR = '#1565C0'
const S = {
  card: '0 2px 10px rgba(27,107,58,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  cardHover: '0 6px 20px rgba(27,107,58,0.12), 0 2px 6px rgba(0,0,0,0.06)',
  cardHighlight: '0 4px 16px rgba(217,119,6,0.14), 0 1px 3px rgba(0,0,0,0.05)',
}
const GRADIENT = 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 60%, #2E7D32 100%)'

// ── DATA KOMUNITAS DESA SUKAMAJU ─────────────────────────────
const ALL_COMMUNITIES = [
  {
    id: 1,
    name: 'Gapoktan Sumber Makmur',
    alias: 'Pertanian & Irigasi',
    Icon: Wheat,
    category: 'Pertanian',
    bg: '#E8F5E9',
    ic: '#2E7D32',
    g: ['#1B5E20', '#2E7D32'],
    members: '428 warga',
    activeToday: 14,
    desc: 'Pusat rembuk petani Desa Sukamaju: jadwal tanam rendeng, pembagian giliran air irigasi waduk, update harga gabah, dan pupuk subsidi.',
    rules: [
      'Gunakan bahasa santun dan mengedepankan asas musyawarah tani',
      'Informasi harga panen dan pembagian air wajib akurat dan terverifikasi PPL',
      'Dilarang memperjualbelikan pupuk subsidi di luar ketentuan kelompok tani',
    ],
  },
  {
    id: 2,
    name: 'Paguyuban UMKM Desa Sukamaju',
    alias: 'Usaha & Produk Desa',
    Icon: ShoppingBag,
    category: 'UMKM',
    bg: '#FFF3E0',
    ic: '#E65100',
    g: ['#BF360C', '#E65100'],
    members: '315 pelaku usaha',
    activeToday: 9,
    desc: 'Wadah kolaborasi pengrajin, pedagang kelontong, kuliner olahan lokal, dan integrasi pasar online resmi ESTO Sukamaju.',
    rules: [
      'Prioritaskan produk olahan dan kerajinan asli warga desa',
      'Promosi produk toko ESTO diperbolehkan dengan mencantumkan link toko resmi',
      'Dilarang melakukan penipuan harga atau klaim produk palsu',
    ],
  },
  {
    id: 3,
    name: 'Posyandu Melati & Kesehatan Warga',
    alias: 'Kesehatan Ibu & Anak',
    Icon: HeartPulse,
    category: 'Kesehatan',
    bg: '#FFEBEE',
    ic: '#C62828',
    g: ['#880E4F', '#C62828'],
    members: '542 ibu & kader',
    activeToday: 6,
    desc: 'Layanan posyandu balita & lansia, jadwal penimbangan, imunisasi dasar, vitamin A, dan konsultasi kesehatan keluarga bersama Bidan Desa.',
    rules: [
      'Jadwal posyandu resmi dikoordinasikan langsung oleh Bidan Desa dan kader',
      'Informasi gizi dan MPASI harus merujuk pada panduan kesehatan terpercaya',
      'Jaga privasi kondisi kesehatan balita dan warga',
    ],
  },
  {
    id: 4,
    name: 'Karang Taruna Tunas Harapan',
    alias: 'Pemuda & Olahraga',
    Icon: GraduationCap,
    category: 'Pemuda',
    bg: '#E3F2FD',
    ic: '#1565C0',
    g: ['#0D47A1', '#1565C0'],
    members: '286 pemuda',
    activeToday: 18,
    desc: 'Aksi pemuda desa: kepanitiaan hari besar, kerja bakti lingkungan, turnamen voli antar-RW, dan pelatihan wirausaha digital pemuda.',
    rules: [
      'Junjung tinggi sportivitas dan kekompakan pemuda seluruh RW',
      'Dilarang menyebarkan konten provokatif atau perselisihan antar-dusun',
    ],
  },
  {
    id: 5,
    name: 'PKK & Dapur Sehat Warga',
    alias: 'Keluarga & Ketahanan Pangan',
    Icon: Users,
    category: 'Keluarga',
    bg: '#F3E5F5',
    ic: '#6A1B9A',
    g: ['#4A148C', '#6A1B9A'],
    members: '490 warga',
    activeToday: 8,
    desc: 'Gerakan pekarangan pangan lestari (P2L), resep makanan sehat keluarga, pengajian rutin dusun, dan gotong royong kebersihan lingkungan.',
    rules: [
      'Saling menyemangati kegiatan kemasyarakatan ibu-ibu warga desa',
      'Berbagi resep dan tips menanam pekarangan secara positif',
    ],
  },
  {
    id: 6,
    name: 'Kamtibmas & Siskamling Ronda Malam',
    alias: 'Keamanan Lingkungan',
    Icon: Shield,
    category: 'Keamanan',
    bg: '#ECEFF1',
    ic: '#37474F',
    g: ['#263238', '#455A64'],
    members: '368 warga',
    activeToday: 5,
    desc: 'Jadwal ronda malam siskamling, koordinasi pos ronda RT 01-08, informasi tanggap darurat cuaca/bencana, dan ketertiban umum.',
    rules: [
      'Laporan kejadian mencurigakan harus segera divalidasi ketua RT / Babinsa',
      'Utamakan penyelesaian masalah secara damai dan kekeluargaan',
    ],
  },
]

// ── DUMMY PRODUK ESTO ─────────────────────────────────────────
const ESTO_PRODUCTS = [
  {
    id: 'ep4',
    name: 'Pupuk Organik Kompos Matang 25kg',
    price: 45000,
    unit: '25 kg',
    stock: 20,
    toko: 'Toko Tani Makmur Bu Sari',
    category: 'Pertanian',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ep1',
    name: 'Beras Pandan Wangi Organik 5kg',
    price: 65000,
    unit: '5 kg',
    stock: 35,
    toko: 'Lumbung Beras Sukamaju',
    category: 'Pangan',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ep2',
    name: 'Sayur Bayam & Kangkung Petik Pagi (Ikat)',
    price: 3500,
    unit: '1 ikat',
    stock: 50,
    toko: 'Kebun Sayur Dasawisma',
    category: 'Sayuran',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'ep6',
    name: 'Keripik Singkong Pedas Gurih 200g',
    price: 15000,
    unit: '200 gr',
    stock: 40,
    toko: 'Dapur Berkah Bu Aminah',
    category: 'Camilan',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600&auto=format&fit=crop',
  },
]

// ── PENGUMUMAN UTAMA DESA (PINNED BULLETIN) ────────────────────
const OFFICIAL_VILLAGE_ANNOUNCEMENT = {
  id: 'ann_official_1',
  type: 'pengumuman',
  category: 'Pengumuman',
  tag: 'PENGUMUMAN RESMI DESA',
  title: 'Penyaluran Beras Cadangan Pangan Pemerintah Triwulan III',
  summary: 'Pemerintah Desa Sukamaju mengumumkan penyaluran bantuan pangan beras 10kg bagi warga penerima manfaat. Pembagian dilakukan bergilir per RW di Balai Desa.',
  eventDate: 'Kamis, 10 September 2026',
  eventTime: '08.30 – 13.00 WIB',
  eventLocation: 'Pendopo Balai Desa Sukamaju',
  author: 'Lurah Hartono',
  role: 'Kepala Desa Sukamaju',
  badge: 'Pemerintah Desa',
  badgeColor: '#1B6B3A',
  badgeBg: '#E8F5E9',
  time: '2 jam lalu',
  likes: 92,
  replies: 16,
  isPinned: true,
  image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
  fullContent: `Kepada seluruh Warga Desa Sukamaju yang terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS):

Penyaluran Bantuan Pangan Beras Cadangan Pemerintah tahap ke-3 tahun 2026 akan dilaksanakan pada hari Kamis, 10 September 2026 di Pendopo Balai Desa Sukamaju.

Jadwal Pengambilan per Wilayah:
• RW 01 & 02: Pukul 08.30 - 10.00 WIB
• RW 03 & 04: Pukul 10.00 - 11.30 WIB
• RW 05 s/d 08: Pukul 11.30 - 13.00 WIB

Persyaratan Wajib:
1. Membawa e-KTP asli penerima manfaat.
2. Membawa Kartu Keluarga (KK) asli atau fotokopi jelas.
3. Jika diwakilkan anggota keluarga satu KK, wajib membawa surat kuasa sederhana dan KTP pengambil.

Mari kita jaga ketertiban bersama demi kelancaran penyaluran.`,
}

// ── THREADS & POST FEED AKTIF DESA ────────────────────────────
const THREADS_INIT = [
  {
    id: 't_gotongroyong',
    type: 'agenda',
    category: 'Gotong Royong',
    communityId: 1,
    title: 'Kerja Bakti Bersihkan Saluran Irigasi Tersier Jelang Musim Tanam Rendeng',
    body: 'Menghadapi musim tanam rendeng minggu depan, mari kita gotong royong membersihkan sedimentasi lumpur dan rumput liar di sepanjang saluran irigasi Blok Sawah Kulon agar air waduk mengalir lancar.',
    eventInfo: {
      day: '13',
      month: 'SEP',
      date: 'Minggu, 13 September 2026',
      time: '07.00 WIB s/d Selesai',
      location: 'Saluran Irigasi Blok Cikaret - Sawah Kulon',
    },
    rsvpCount: 46,
    author: 'Pak RT Slamet',
    role: 'Ketua RT 02 / RW 04',
    badge: 'Pengurus RT',
    badgeColor: '#1565C0',
    badgeBg: '#E3F2FD',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800&auto=format&fit=crop',
    time: '3 jam lalu',
    likes: 74,
    replies: 12,
  },
  {
    id: 't_posyandu',
    type: 'posyandu',
    category: 'Posyandu',
    communityId: 3,
    title: 'Jadwal Penimbangan Balita & Pemberian Vitamin A Posyandu Melati RW 03',
    body: 'Ibu-ibu yang memiliki balita usia 0–5 tahun diharapkan hadir di Pos Ronda RW 03. Agenda: penimbangan BB, pengukuran TB, imunisasi dasar, dan pembagian vitamin A serta biskuit bergizi.',
    eventInfo: {
      day: '12',
      month: 'SEP',
      date: 'Sabtu, 12 September 2026',
      time: '08.00 – 11.30 WIB',
      location: 'Pos Ronda RW 03 (Samping Musholla Al-Ikhlas)',
    },
    author: 'Bidan Siti Rahayu, Amd.Keb',
    role: 'Bidan Desa Sukamaju',
    badge: 'Kader Kesehatan',
    badgeColor: '#C62828',
    badgeBg: '#FFEBEE',
    time: '5 jam lalu',
    likes: 58,
    replies: 9,
  },
  {
    id: 't_panen',
    type: 'info_tani',
    category: 'Pertanian',
    communityId: 1,
    title: 'Update Harga Komoditas Panen & Giliran Aliran Air Irigasi Waduk',
    body: 'Hasil koordinasi Gapoktan Sumber Makmur bersama PPL Pertanian: Pintu air bendung timur dibuka bergilir mulai Selasa malam pukul 21.00 WIB untuk area persawahan dusun Cikaret.',
    commodityPrices: [
      { name: 'Gabah Kering Panen (Ciherang)', price: 'Rp 7.300/kg', trend: 'stabil' },
      { name: 'Gabah Kering Giling (IR64)', price: 'Rp 8.100/kg', trend: 'naik' },
      { name: 'Jagung Pipil Kering', price: 'Rp 5.200/kg', trend: 'stabil' },
      { name: 'Cabai Rawit Merah Lokal', price: 'Rp 36.000/kg', trend: 'turun' },
    ],
    author: 'Pak H. Subur',
    role: 'Ketua Gapoktan',
    badge: 'Gapoktan',
    badgeColor: '#2E7D32',
    badgeBg: '#E8F5E9',
    time: '6 jam lalu',
    likes: 63,
    replies: 15,
  },
  {
    id: 't_kabar_desa',
    type: 'thread',
    category: 'Kabar Desa',
    communityId: 4,
    title: 'Jembatan Bambu Dusun 2 & Dusun 3 Selesai Diperbaiki oleh Karang Taruna',
    body: 'Alhamdulillah! Berkat swadaya batang bambu petung dari warga RW 02 dan kerja keras kawan-kawan pemuda kemarin sore, jembatan penghubung antar-dusun kini sudah kokoh kembali dan dipasangi 2 lampu penerangan tenaga surya. Aman untuk anak-anak berangkat sekolah!',
    author: 'Rian Pratama',
    role: 'Ketua Karang Taruna',
    badge: 'Pemuda Desa',
    badgeColor: '#0D47A1',
    badgeBg: '#E3F2FD',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800&auto=format&fit=crop',
    time: 'Kemarin',
    likes: 124,
    replies: 28,
  },
  {
    id: 't_jualbeli_pupuk',
    type: 'jual_beli',
    category: 'UMKM ESTO',
    communityId: 2,
    product: ESTO_PRODUCTS[0],
    caption: 'Stok pupuk kompos fermentasi matang halus siap tabur untuk olah tanah persiapan tanam padi & cabai. Tanpa bau menyengat, tanah jadi gembur. Warga Sukamaju bisa pesan langsung lewat ESTO, ada diskon ongkir desa!',
    author: 'Bu Sari',
    role: 'Penjual Terverifikasi ESTO',
    badge: 'UMKM Binaan',
    badgeColor: '#E65100',
    badgeBg: '#FFF3E0',
    time: 'Kemarin',
    likes: 41,
    replies: 8,
  },
  {
    id: 't_tanya_ikd',
    type: 'thread',
    category: 'Tanya Warga',
    communityId: 5,
    title: 'Tanya info: Jadwal loket keliling perekaman KTP Digital (IKD) di Balai Desa',
    body: 'Selamat pagi bapak/ibu warga. Ada yang tahu hari apa petugas Disdukcapil buka loket aktivasi Identitas Kependudukan Digital (IKD) di kantor desa? Apakah cukup membawa HP Android dan KTP fisik?',
    author: 'Budi Santoso',
    role: 'Warga Dusun Cikaret',
    badge: 'Warga',
    badgeColor: '#616161',
    badgeBg: '#F5F5F5',
    time: '1 hari lalu',
    likes: 19,
    replies: 11,
  },
  {
    id: 't_ronda_malam',
    type: 'thread',
    category: 'Kabar Desa',
    communityId: 6,
    title: 'Laporan Ronda Malam RW 04: Situasi Aman Terkendali & Imbauan Pintu Kandang',
    body: 'Laporan regu ronda 3 semalam: lingkungan aman terkendali. Mengingat cuaca sering hujan lebat dini hari, warga yang memiliki kandang kambing/sapi di belakang rumah diimbau mengecek kembali kunci pintu kandang.',
    author: 'Pak Joko Sukirno',
    role: 'Koordinator Pos Kamling RW 04',
    badge: 'Kamtibmas',
    badgeColor: '#37474F',
    badgeBg: '#ECEFF1',
    time: '1 hari lalu',
    likes: 37,
    replies: 4,
  },
]

// ── DUMMY KOMENTAR REALISTIS ──────────────────────────────────
const COMMENTS_DATA = {
  ann_official_1: [
    {
      id: 'c_ann1',
      author: 'Pak RT Slamet',
      role: 'Ketua RT 02',
      text: 'Siap Pak Kades. Warga RT 02 sudah kami umumkan lewat grup pengajian dan musholla agar datang sesuai jam pembagian.',
      time: '1 jam lalu',
      likes: 8,
      replies: [
        {
          id: 'c_ann1_r1',
          author: 'Lurah Hartono',
          role: 'Kepala Desa',
          text: 'Terima kasih banyak Pak RT atas koordinasinya yang tanggap 🙏',
          time: '45 mnt lalu',
          likes: 5,
        },
      ],
    },
    {
      id: 'c_ann2',
      author: 'Ibu Aminah',
      role: 'Warga RW 03',
      text: 'Pak Lurah, untuk lansia yang sudah susah jalan apakah bisa diwakilkan anak kandung dengan membawa surat KK asli?',
      time: '1 jam lalu',
      likes: 4,
      replies: [
        {
          id: 'c_ann2_r1',
          author: 'Lurah Hartono',
          role: 'Kepala Desa',
          text: 'Bisa Bu Aminah, cukup bawa KTP asli orang tua dan KK satu keluarga. Petugas balai desa siap bantu.',
          time: '30 mnt lalu',
          likes: 7,
        },
      ],
    },
  ],
  t_gotongroyong: [
    {
      id: 'c_gr1',
      author: 'Agus Petani',
      role: 'Warga Sawah Kulon',
      text: 'InsyaAllah hadir bawa cangkul dan parang. Kebetulan pintu air petak saya yang paling dekat lumpurnya tebal.',
      time: '2 jam lalu',
      likes: 6,
      replies: [],
    },
    {
      id: 'c_gr2',
      author: 'Ibu Aminah',
      role: 'Kader PKK RW 04',
      text: 'Ibu-ibu PKK siap bantu siapkan pisang goreng, tahu susur, dan kopi tubruk hangat untuk bapak-bapak!',
      time: '1 jam lalu',
      likes: 14,
      replies: [],
    },
  ],
  t_tanya_ikd: [
    {
      id: 'c_ikd1',
      author: 'Wawan Setiawan',
      role: 'Staf Pelayanan Desa',
      text: 'Jadwal pelayanan IKD keliling hadir setiap hari Rabu pukul 09.00-12.00 di Ruang Pelayanan Balai Desa. Syarat bawa KTP asli dan smartphone dengan kuota internet aktif ya Pak Budi.',
      time: '3 jam lalu',
      likes: 12,
      replies: [
        {
          id: 'c_ikd1_r1',
          author: 'Budi Santoso',
          role: 'Warga',
          text: 'Alhamdulillah, terima kasih banyak Pak Wawan infonya sangat jelas!',
          time: '2 jam lalu',
          likes: 3,
        },
      ],
    },
  ],
  default: [
    {
      id: 'cd1',
      author: 'Warga Desa Sukamaju',
      role: 'Warga',
      text: 'Informasi yang sangat bermanfaat untuk warga desa. Terima kasih sudah berbagi!',
      time: '2 jam lalu',
      likes: 3,
      replies: [],
    },
  ],
}

// ── BANNER PAPAN PENGUMUMAN DESA ──────────────────────────────
function VillageAnnouncementBanner({ announcement, onOpen }) {
  return (
    <div
      onClick={() => onOpen(announcement)}
      className="bg-gradient-to-br from-[#0C3E1E] via-[#1B6B3A] to-[#145A2C] rounded-3xl p-4 text-white cursor-pointer relative overflow-hidden shadow-md transition-all active:scale-[0.99] border border-emerald-600/30 group"
    >
      {/* Background Decorative Element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="absolute top-2 right-3 text-white/20">
        <Pin size={28} className="rotate-12 group-hover:rotate-0 transition-transform" />
      </div>

      {/* Header Tag */}
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
          <Megaphone size={10} className="fill-amber-950" />
          Papan Pengumuman Desa
        </span>
        <span className="text-[11px] text-emerald-200/90 font-medium">· {announcement.time}</span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-extrabold text-white leading-snug mb-2 relative z-10">
        {announcement.title}
      </h3>

      <p className="text-[12px] text-emerald-100/90 leading-relaxed line-clamp-2 mb-3 relative z-10">
        {announcement.summary}
      </p>

      {/* Info Strip (Tanggal, Lokasi) */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-black/20 backdrop-blur-xs border border-white/10 text-[11.5px] mb-3 relative z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar size={13} className="text-amber-300 flex-shrink-0" />
          <span className="truncate font-semibold">{announcement.eventDate}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin size={13} className="text-emerald-300 flex-shrink-0" />
          <span className="truncate font-medium">{announcement.eventLocation}</span>
        </div>
      </div>

      {/* Footer Author & CTA */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0">
            🏛️
          </div>
          <p className="text-[11px] font-bold text-white truncate">
            {announcement.author} <span className="text-emerald-200 font-normal">({announcement.role})</span>
          </p>
        </div>
        <span className="text-[11.5px] font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
          Baca Lengkap <ChevronRight size={13} />
        </span>
      </div>
    </div>
  )
}

// ── POST CARD: AGENDA / GOTONG ROYONG ──────────────────────────
function AgendaCard({ thread, community, onOpen, onRsvp, isRsvpd }) {
  const [liked, setLiked] = useState(false)
  const currentLikes = thread.likes + (liked ? 1 : 0)

  return (
    <div
      onClick={() => onOpen(thread, community)}
      className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-xs cursor-pointer transition-all active:scale-[0.99] hover:shadow-sm"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            🤝
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12.5px] font-extrabold text-gray-900 truncate">{thread.author}</span>
              <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700">
                {thread.badge}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400">{thread.time} · {community?.name}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80">
          AGENDA WARGA
        </span>
      </div>

      {/* Title */}
      <h4 className="text-[14.5px] font-extrabold text-gray-900 leading-snug mb-2">
        {thread.title}
      </h4>

      {/* Body */}
      <p className="text-[12px] text-gray-600 leading-relaxed mb-3.5 line-clamp-3">
        {thread.body}
      </p>

      {/* Date & Location Event Box */}
      {thread.eventInfo && (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/90 border border-gray-200/70 mb-3.5">
          {/* Calendar Badge */}
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-2xs flex flex-col items-center justify-center flex-shrink-0 text-center">
            <span className="text-[9px] font-extrabold uppercase text-red-600 leading-none">
              {thread.eventInfo.month}
            </span>
            <span className="text-[17px] font-black text-gray-900 leading-none mt-0.5">
              {thread.eventInfo.day}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-extrabold text-gray-900 leading-tight">
              {thread.eventInfo.date}
            </p>
            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
              <Clock size={11} className="text-gray-400" /> {thread.eventInfo.time}
            </p>
            <p className="text-[11px] text-gray-600 flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={11} className="text-emerald-700 flex-shrink-0" /> {thread.eventInfo.location}
            </p>
          </div>
        </div>
      )}

      {/* Interactive RSVP Action */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRsvp(thread.id)
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-[11.5px] font-extrabold flex items-center justify-center gap-1.5 transition active:scale-95 ${
            isRsvpd
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
          }`}
        >
          {isRsvpd ? (
            <>
              <Check size={14} strokeWidth={3} />
              <span>Saya Siap Hadir ({thread.rsvpCount + 1})</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={14} />
              <span>Ikut Hadir ({thread.rsvpCount} Warga Siap)</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3 px-1 text-[12px] text-gray-400">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLiked(!liked)
            }}
            className={`flex items-center gap-1 transition ${liked ? 'text-red-500 font-bold' : 'hover:text-gray-600'}`}
          >
            <Heart size={14} className={liked ? 'fill-red-500' : ''} />
            <span>{currentLikes}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{thread.replies}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── POST CARD: INFO TANI & HARGA PANEN ─────────────────────────
function HarvestPriceCard({ thread, community, onOpen }) {
  const [liked, setLiked] = useState(false)

  return (
    <div
      onClick={() => onOpen(thread, community)}
      className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-xs cursor-pointer transition-all active:scale-[0.99] hover:shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            🌾
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12.5px] font-extrabold text-gray-900 truncate">{thread.author}</span>
              <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800">
                {thread.badge}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400">{thread.time} · {community?.name}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
          INFO TANI
        </span>
      </div>

      <h4 className="text-[14.5px] font-extrabold text-gray-900 leading-snug mb-2">
        {thread.title}
      </h4>

      <p className="text-[12px] text-gray-600 leading-relaxed mb-3 line-clamp-2">
        {thread.body}
      </p>

      {/* Commodity Prices Grid */}
      {thread.commodityPrices && (
        <div className="rounded-2xl bg-emerald-50/40 p-3 border border-emerald-100 mb-3.5">
          <p className="text-[11px] font-black text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-700" />
            Laporan Harga Panen Desa Minggu Ini:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {thread.commodityPrices.map((cp, idx) => (
              <div key={idx} className="bg-white p-2 rounded-xl border border-emerald-100/80 shadow-2xs">
                <p className="text-[10.5px] text-gray-500 truncate leading-tight font-medium">{cp.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[12.5px] font-black text-gray-900 leading-tight">{cp.price}</p>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      cp.trend === 'naik'
                        ? 'bg-red-50 text-red-700'
                        : cp.trend === 'turun'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cp.trend === 'naik' ? '↑ Naik' : cp.trend === 'turun' ? '↓ Turun' : '— Stabil'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[12px] text-gray-500">
        <span className="text-[11px] font-medium text-emerald-800">
          💬 Pintu air timur aktif bergilir
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLiked(!liked)
            }}
            className={`flex items-center gap-1 transition ${liked ? 'text-red-500 font-bold' : ''}`}
          >
            <Heart size={14} className={liked ? 'fill-red-500' : ''} />
            <span>{thread.likes + (liked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{thread.replies}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── POST CARD: JUAL BELI & PRODUK UMKM ESTO ───────────────────
function JualBeliCard({ thread, onOpen, navigate }) {
  const { product, caption, author, time, likes, replies, badge } = thread
  const [liked, setLiked] = useState(false)

  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-xs cursor-pointer transition-all active:scale-[0.99] hover:shadow-sm"
    >
      {/* Author Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            🏪
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12.5px] font-extrabold text-gray-900 truncate">{author}</span>
              <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                {badge || 'ESTO'}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400">{time} · Pasar Warga</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-orange-50 text-orange-800 border border-orange-200">
          PRODUK DESA
        </span>
      </div>

      {/* Caption */}
      {caption && (
        <p className="text-[12px] text-gray-700 leading-relaxed mb-3 line-clamp-2">
          {caption}
        </p>
      )}

      {/* Product Highlight Box */}
      {product && (
        <div className="rounded-2xl border border-gray-200/80 overflow-hidden bg-gray-50/50 mb-3.5">
          <div className="flex items-center gap-3 p-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100 shadow-2xs">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-extrabold text-gray-900 leading-snug truncate">
                {product.name}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">{product.toko}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[13.5px] font-black text-emerald-800">
                  Rp {product.price.toLocaleString('id')}
                </p>
                <span className="text-[10.5px] text-gray-500 font-medium">
                  Stok: {product.stock}
                </span>
              </div>
            </div>
          </div>

          <div className="px-3 py-2 bg-emerald-50/60 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
              <BadgeCheck size={13} className="text-emerald-700" /> Terdaftar di ESTO Sukamaju
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate?.('pasar')
              }}
              className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <Store size={12} /> Beli di ESTO
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[12px] text-gray-400">
        <span className="text-[11px] text-gray-500">Kirim langsung ke rumah via GV Man</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLiked(!liked)
            }}
            className={`flex items-center gap-1 transition ${liked ? 'text-red-500 font-bold' : ''}`}
          >
            <Heart size={14} className={liked ? 'fill-red-500' : ''} />
            <span>{likes + (liked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{replies}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── POST CARD: STANDAR DISKUSI & TANYA WARGA ──────────────────
function StandardPostCard({ thread, community, onOpen }) {
  const [liked, setLiked] = useState(false)
  const isQuestion = thread.category === 'Tanya Warga'

  return (
    <div
      onClick={() => onOpen(thread, community)}
      className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-xs cursor-pointer transition-all active:scale-[0.99] hover:shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
            style={{ background: community?.bg || '#E8F5E9', color: community?.ic || PRIMARY }}
          >
            {isQuestion ? '❓' : '💬'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12.5px] font-extrabold text-gray-900 truncate">{thread.author}</span>
              <span
                className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-md"
                style={{ background: thread.badgeBg || '#F5F5F5', color: thread.badgeColor || '#616161' }}
              >
                {thread.badge || 'Warga'}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400">{thread.time} · {community?.name}</p>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.8 rounded-full text-[10px] font-extrabold tracking-wide border ${
            isQuestion
              ? 'bg-purple-50 text-purple-800 border-purple-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {thread.category || 'Diskusi'}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-[14.5px] font-extrabold text-gray-900 leading-snug mb-2">
        {thread.title}
      </h4>

      {/* Body */}
      <p className="text-[12px] text-gray-600 leading-relaxed mb-3 line-clamp-3">
        {thread.body}
      </p>

      {/* Attached Photo */}
      {thread.image && (
        <div className="w-full h-44 rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-100">
          <img src={thread.image} alt={thread.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[12px] text-gray-400">
        <span className="text-[11px] text-gray-500 flex items-center gap-1">
          <Sparkles size={11} className="text-amber-500" /> Rembuk Warga Desa
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLiked(!liked)
            }}
            className={`flex items-center gap-1 transition ${liked ? 'text-red-500 font-bold' : ''}`}
          >
            <Heart size={14} className={liked ? 'fill-red-500' : ''} />
            <span>{thread.likes + (liked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{thread.replies} balasan</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── DETAIL THREAD & KOMENTAR ──────────────────────────────────
function ThreadDetailModal({ thread, community, onClose, onAddComment, comments = [] }) {
  const [inputMsg, setInputMsg] = useState('')
  const [liked, setLiked] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputMsg.trim()) return
    onAddComment(thread.id, inputMsg.trim())
    setInputMsg('')
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#FAFBF9] animate-fade-in">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div>
            <p className="text-[13px] font-extrabold text-gray-900 leading-tight">Detail Post & Diskusi</p>
            <p className="text-[10.5px] text-gray-400 font-medium truncate max-w-[220px]">
              {community?.name || 'Komunitas Warga Sukamaju'}
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Tautan diskusi berhasil disalin!')}
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 text-gray-600"
        >
          <Share2 size={15} />
        </button>
      </div>

      {/* Content Scroll */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24 flex flex-col gap-3.5">
        {/* Main OP Card */}
        <div className="bg-white rounded-3xl p-4.5 border border-gray-100 shadow-xs">
          {/* Author info */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
              👤
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-extrabold text-gray-900">{thread.author}</span>
                {thread.badge && (
                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800">
                    {thread.badge}
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-gray-400">{thread.time} · {community?.name}</p>
            </div>
          </div>

          <h3 className="text-[16px] font-black text-gray-900 leading-snug mb-2.5">
            {thread.title}
          </h3>

          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line mb-3.5">
            {thread.fullContent || thread.body}
          </p>

          {/* Event/Agenda Info if present */}
          {thread.eventInfo && (
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 mb-3.5 flex flex-col gap-1 text-[12px]">
              <p className="font-extrabold text-gray-900 flex items-center gap-1.5">
                <Calendar size={13} className="text-emerald-700" /> {thread.eventInfo.date}
              </p>
              <p className="text-gray-600 flex items-center gap-1.5">
                <Clock size={13} className="text-gray-400" /> {thread.eventInfo.time}
              </p>
              <p className="text-gray-600 flex items-center gap-1.5">
                <MapPin size={13} className="text-emerald-700" /> {thread.eventInfo.location}
              </p>
            </div>
          )}

          {thread.image && (
            <div className="w-full rounded-2xl overflow-hidden bg-gray-100 mb-3.5 border border-gray-100">
              <img src={thread.image} alt={thread.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[12px] text-gray-500">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 font-bold transition ${liked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
              <span>{thread.likes + (liked ? 1 : 0)} Suka</span>
            </button>
            <span>{comments.length} Komentar Warga</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs">
          <p className="text-[12px] font-black text-gray-500 uppercase tracking-wider mb-3">
            Tanggapan Warga ({comments.length})
          </p>

          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold flex-shrink-0 text-gray-600">
                    {c.author[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-gray-900">{c.author}</span>
                      {c.role && (
                        <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-semibold">
                          {c.role}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 ms-auto">{c.time}</span>
                    </div>
                    <p className="text-[12px] text-gray-700 mt-1 leading-relaxed">{c.text}</p>

                    {/* Nested Replies */}
                    {c.replies?.map((r) => (
                      <div key={r.id} className="mt-2.5 p-2.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {r.author[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11.5px] font-bold text-gray-900">{r.author}</span>
                            {r.role && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                {r.role}
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 ms-auto">{r.time}</span>
                          </div>
                          <p className="text-[11.5px] text-gray-700 mt-0.5 leading-relaxed">{r.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Comment Bar */}
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2 shadow-lg"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Tulis tanggapan / komentar..."
          className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gray-100 text-[12px] text-gray-900 placeholder:text-gray-400 outline-none border border-transparent focus:border-emerald-600 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim()}
          className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 shadow-xs transition"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}

// ── CREATE POST SHEET ─────────────────────────────────────────
function CreatePostModal({ communities, onClose, onPost }) {
  const [selectedCommId, setSelectedCommId] = useState(communities[0]?.id || 1)
  const [category, setCategory] = useState('💬 Diskusi Warga')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const CATEGORIES = [
    '💬 Diskusi Warga',
    '📢 Pengumuman',
    '🤝 Agenda / Gotong Royong',
    '🌾 Info Tani & Panen',
    '❓ Tanya Warga',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const newThread = {
      id: `t_user_${Date.now()}`,
      type: category.includes('Agenda') ? 'agenda' : category.includes('Pengumuman') ? 'pengumuman' : 'thread',
      category: category.replace(/^[^\s]+\s/, ''),
      communityId: Number(selectedCommId),
      title: title.trim(),
      body: body.trim(),
      author: 'Kamu (Warga Sukamaju)',
      role: 'Warga',
      badge: 'Warga',
      badgeColor: '#1B6B3A',
      badgeBg: '#E8F5E9',
      time: 'Baru saja',
      likes: 1,
      replies: 0,
    }

    onPost(newThread)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95">
            <X size={16} className="text-gray-700" />
          </button>
          <p className="text-[14px] font-extrabold text-gray-900">Buat Postingan Baru</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-[12px] disabled:opacity-40 active:scale-95 shadow-xs"
        >
          Kirim
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Pilih Komunitas */}
        <div>
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Kirim ke Komunitas:
          </label>
          <select
            value={selectedCommId}
            onChange={(e) => setSelectedCommId(e.target.value)}
            className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-[12.5px] font-bold text-gray-800 outline-none"
          >
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.alias})
              </option>
            ))}
          </select>
        </div>

        {/* Pilih Jenis Post */}
        <div>
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Kategori Topik:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition ${
                  category === cat
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Input Judul */}
        <div>
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Judul Postingan:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Kerja bakti minggu pagi di RT 03..."
            className="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[13px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        {/* Input Isi */}
        <div className="flex-1 flex flex-col">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 block">
            Isi & Keterangan:
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tuliskan detail info, waktu, lokasi, atau pertanyaan warga..."
            className="w-full flex-1 min-h-[140px] p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[12.5px] text-gray-800 placeholder:text-gray-400 outline-none focus:border-emerald-600 focus:bg-white resize-none"
          />
        </div>
      </div>
    </div>
  )
}

// ── SEARCH MODAL ──────────────────────────────────────────────
function SearchModal({ onClose, onSelectTopic }) {
  const [query, setQuery] = useState('')

  const SUGGESTED_TOPICS = [
    'Penyaluran Beras Cadangan',
    'Jadwal Posyandu Balita',
    'Kerja Bakti Saluran Irigasi',
    'Harga Gabah Kering Panen',
    'Pupuk Kompos Organik',
    'Perekaman KTP Digital (IKD)',
    'Ronda Malam Siskamling',
  ]

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-fade-in">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95">
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-3.5 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kabar, pengumuman, agenda warga..."
            className="w-full bg-transparent text-[12.5px] text-gray-900 placeholder:text-gray-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2.5">
          Topik Hangat di Desa:
        </p>
        <div className="flex flex-col gap-1.5">
          {SUGGESTED_TOPICS.filter((t) => !query || t.toLowerCase().includes(query.toLowerCase())).map((t) => (
            <button
              key={t}
              onClick={() => {
                onSelectTopic(t)
                onClose()
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between text-[12.5px] text-gray-700 font-medium"
            >
              <span>{t}</span>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── KOMPONEN UTAMA SCREEN KOMUNITAS ───────────────────────────
export default function Komunitas({ navigate, userProfile, initialCommunityId }) {
  const [tab, setTab] = useState('post') // 'post' | 'mine' | 'explore'
  const [feedFilter, setFeedFilter] = useState('Semua')
  const [threads, setThreads] = useState(THREADS_INIT)
  const [joinedIds, setJoinedIds] = useState([1, 2, 3, 4])
  const [rsvpdIds, setRsvpdIds] = useState(new Set(['t_gotongroyong']))
  const [activeThreadModal, setActiveThreadModal] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [commentsMap, setCommentsMap] = useState(COMMENTS_DATA)

  // Filter Categories
  const FILTER_PILLS = [
    'Semua',
    '📢 Pengumuman',
    '🌾 Pertanian',
    '🤝 Gotong Royong',
    '🩺 Posyandu',
    '🏪 UMKM ESTO',
    '💬 Tanya Warga',
  ]

  // Handle RSVP
  const handleRsvp = (threadId) => {
    setRsvpdIds((prev) => {
      const next = new Set(prev)
      if (next.has(threadId)) next.delete(threadId)
      else next.add(threadId)
      return next
    })
  }

  // Handle Add Comment
  const handleAddComment = (threadId, text) => {
    const newComment = {
      id: `c_${Date.now()}`,
      author: userProfile?.name || 'Kamu',
      role: 'Warga',
      text,
      time: 'Baru saja',
      likes: 0,
      replies: [],
    }

    setCommentsMap((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newComment],
    }))

    // Increment replies counter on thread
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, replies: t.replies + 1 } : t))
    )
  }

  // Handle Toggle Community Join
  const handleToggleJoin = (commId) => {
    setJoinedIds((prev) =>
      prev.includes(commId) ? prev.filter((id) => id !== commId) : [...prev, commId]
    )
  }

  // Filtered Threads for Feed
  const filteredThreads = threads.filter((t) => {
    if (feedFilter === 'Semua') return true
    if (feedFilter === '📢 Pengumuman') return t.category === 'Pengumuman'
    if (feedFilter === '🌾 Pertanian') return t.category === 'Pertanian'
    if (feedFilter === '🤝 Gotong Royong') return t.category === 'Gotong Royong'
    if (feedFilter === '🩺 Posyandu') return t.category === 'Posyandu'
    if (feedFilter === '🏪 UMKM ESTO') return t.category === 'UMKM ESTO'
    if (feedFilter === '💬 Tanya Warga') return t.category === 'Tanya Warga' || t.category === 'Kabar Desa'
    return true
  })

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* ── Unified ScreenHeader ── */}
      <ScreenHeader
        title="Komunitas Warga"
        actions={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Plus size={13} className="text-white" />
            <span className="text-white font-black text-[11.5px]">Tulis Post</span>
          </button>
        }
      >
        {/* Village Subtitle Badge */}
        <div className="flex items-center gap-1.5 px-0.5 -mt-1 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <p className="text-[11.5px] font-medium text-white/90 truncate">
            Desa Sukamaju · 2.840 Warga Terhubung
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          readOnly
          variant="glass-dark"
          placeholder="Cari kabar, pengumuman, atau agenda warga..."
          onClick={() => setShowSearchModal(true)}
        />

        {/* 3 Main Navigation Tabs */}
        <NavTabs
          variant="underline-dark"
          tabs={[
            { id: 'post', label: 'Kabar Warga' },
            { id: 'mine', label: `Komunitasku (${joinedIds.length})` },
            { id: 'explore', label: 'Jelajahi' },
          ]}
          activeTab={tab}
          onChange={setTab}
        />
      </ScreenHeader>

      {/* ── TAB 1: KABAR WARGA (FEED UTAMA) ── */}
      {tab === 'post' && (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 flex flex-col gap-3.5 pt-3">
          {/* 1. Official Village Bulletin Pinned Banner */}
          <div className="px-4">
            <VillageAnnouncementBanner
              announcement={OFFICIAL_VILLAGE_ANNOUNCEMENT}
              onOpen={(ann) => setActiveThreadModal(ann)}
            />
          </div>

          {/* 2. Quick Category Filter Pills */}
          <div className="px-4 overflow-x-auto no-scrollbar flex items-center gap-1.5 py-0.5">
            {FILTER_PILLS.map((pill) => {
              const isActive = feedFilter === pill
              return (
                <button
                  key={pill}
                  onClick={() => setFeedFilter(pill)}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-extrabold whitespace-nowrap transition-all active:scale-95 shadow-2xs ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
                  }`}
                >
                  {pill}
                </button>
              )
            })}
          </div>

          {/* 3. Feed Cards Stream */}
          <div className="px-4 flex flex-col gap-3">
            {filteredThreads.map((thread) => {
              const comm = ALL_COMMUNITIES.find((c) => c.id === thread.communityId)

              if (thread.type === 'agenda') {
                return (
                  <AgendaCard
                    key={thread.id}
                    thread={thread}
                    community={comm}
                    onOpen={(t, c) => setActiveThreadModal({ ...t, community: c })}
                    onRsvp={handleRsvp}
                    isRsvpd={rsvpdIds.has(thread.id)}
                  />
                )
              }

              if (thread.type === 'info_tani') {
                return (
                  <HarvestPriceCard
                    key={thread.id}
                    thread={thread}
                    community={comm}
                    onOpen={(t, c) => setActiveThreadModal({ ...t, community: c })}
                  />
                )
              }

              if (thread.type === 'jual_beli') {
                return (
                  <JualBeliCard
                    key={thread.id}
                    thread={thread}
                    onOpen={() => setActiveThreadModal({ ...thread, community: comm })}
                    navigate={navigate}
                  />
                )
              }

              return (
                <StandardPostCard
                  key={thread.id}
                  thread={thread}
                  community={comm}
                  onOpen={(t, c) => setActiveThreadModal({ ...t, community: c })}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: KOMUNITASKU ── */}
      {tab === 'mine' && (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-4 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[11.5px] font-black text-gray-500 uppercase tracking-wider">
              Komunitas yang Kamu Ikuti ({joinedIds.length})
            </p>
            <button
              onClick={() => setTab('explore')}
              className="text-[11.5px] font-extrabold text-emerald-800 flex items-center gap-0.5"
            >
              + Cari Komunitas Lain
            </button>
          </div>

          {joinedIds.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-xs">
              <p className="text-4xl mb-3">🌱</p>
              <h4 className="text-[15px] font-extrabold text-gray-900 mb-1">Belum Ada Komunitas yang Diikuti</h4>
              <p className="text-[12px] text-gray-500 mb-4">
                Gabung ke grup tani, UMKM, atau posyandu desa untuk berdiskusi bersama warga.
              </p>
              <button
                onClick={() => setTab('explore')}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 text-white font-bold text-[12px] shadow-sm"
              >
                Jelajahi Komunitas Desa
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ALL_COMMUNITIES.filter((c) => joinedIds.includes(c.id)).map((comm) => (
                <div
                  key={comm.id}
                  className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-xs flex flex-col gap-3 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-2xs"
                      style={{ background: `linear-gradient(135deg, ${comm.g[0]}, ${comm.g[1]})` }}
                    >
                      <comm.Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13.5px] font-extrabold text-gray-900 truncate">
                          {comm.name}
                        </h4>
                        <span className="text-[9.5px] font-black px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800">
                          {comm.alias}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        {comm.desc}
                      </p>
                      <p className="text-[10.5px] text-emerald-700 font-extrabold mt-1">
                        ● {comm.members} · {comm.activeToday} obrolan aktif hari ini
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleToggleJoin(comm.id)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 active:scale-95"
                    >
                      Keluar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedFilter(comm.category === 'Pertanian' ? '🌾 Pertanian' : comm.category === 'UMKM' ? '🏪 UMKM ESTO' : 'Semua')
                        setTab('post')
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-[11.5px] flex items-center gap-1 active:scale-95 border border-emerald-200/80"
                    >
                      Buka Kabar & Diskusi <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: JELAJAHI KOMUNITAS ── */}
      {tab === 'explore' && (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 p-4 flex flex-col gap-3.5">
          <div className="bg-emerald-50/70 rounded-3xl p-3.5 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              🏡
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-emerald-950">Komunitas Warga Sukamaju</p>
              <p className="text-[11px] text-emerald-800/90 leading-snug">
                Silaturahmi, gotong royong, dan sinergi ekonomi warga desa terpadu dalam satu aplikasi.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {ALL_COMMUNITIES.map((comm) => {
              const isJoined = joinedIds.includes(comm.id)
              return (
                <div
                  key={comm.id}
                  className="bg-white rounded-3xl p-4 border border-gray-100/90 shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-2xs"
                      style={{ background: `linear-gradient(135deg, ${comm.g[0]}, ${comm.g[1]})` }}
                    >
                      <comm.Icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13.5px] font-extrabold text-gray-900 truncate">
                          {comm.name}
                        </h4>
                      </div>
                      <p className="text-[11.5px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        {comm.desc}
                      </p>
                      <p className="text-[10.5px] text-gray-400 font-medium mt-1">
                        {comm.members} terdaftar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400 font-medium truncate max-w-[200px]">
                      Aturan: {comm.rules?.[0] || 'Musyawarah & mufakat'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleJoin(comm.id)}
                      className={`px-4 py-1.5 rounded-xl font-extrabold text-[11.5px] transition active:scale-95 shadow-2xs ${
                        isJoined
                          ? 'bg-gray-100 text-gray-700 border border-gray-200'
                          : 'bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isJoined ? '✓ Mengikuti' : '+ Gabung'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MODALS / SUB-SCREENS ── */}
      {activeThreadModal && (
        <ThreadDetailModal
          thread={activeThreadModal}
          community={activeThreadModal.community}
          onClose={() => setActiveThreadModal(null)}
          onAddComment={handleAddComment}
          comments={commentsMap[activeThreadModal.id] || COMMENTS_DATA.default}
        />
      )}

      {showCreateModal && (
        <CreatePostModal
          communities={ALL_COMMUNITIES}
          onClose={() => setShowCreateModal(false)}
          onPost={(newPost) => {
            setThreads((prev) => [newPost, ...prev])
            setFeedFilter('Semua')
            setTab('post')
          }}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectTopic={(topic) => {
            if (topic.includes('Beras') || topic.includes('Pengumuman')) setFeedFilter('📢 Pengumuman')
            else if (topic.includes('Irigasi') || topic.includes('Panen')) setFeedFilter('🌾 Pertanian')
            else if (topic.includes('Posyandu')) setFeedFilter('🩺 Posyandu')
            else if (topic.includes('Pupuk')) setFeedFilter('🏪 UMKM ESTO')
            else setFeedFilter('Semua')
            setTab('post')
          }}
        />
      )}

      {/* Persistent Bottom Nav */}
      <BottomNav active="komunitas" navigate={navigate} />
    </ScreenBackground>
  )
}
