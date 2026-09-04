import React, { useState, useRef } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import SearchBar from '@/components/molecules/SearchBar'
import { ChevronRight, Search, Sparkles, Wheat, ShoppingBag, HeartPulse,
  GraduationCap, Users, Palette, ArrowLeft,
  Plus, Heart, MessageCircle, Send, ChevronDown,
  Shield, Flag, X, Pin, Tag,
  Megaphone, Trash2, PinOff, CheckCircle, AlertCircle,
  Image, Store, BadgeCheck, Clock,
  Leaf, Egg, Utensils, Coffee, Package, User, Bot, UserCheck, EyeOff, TrendingUp } from 'lucide-react'
import BottomNav from '../../components/BottomNav'

const PRIMARY    = '#1B6B3A'
const ADMIN_COLOR = '#6A1B9A'
const JB_COLOR   = '#1565C0'
const S = { card:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)', cardMd:'0 6px 20px rgba(27,107,58,0.10), 0 2px 6px rgba(0,0,0,0.05)' }
const GRADIENT = 'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'

// ── Data ───────────────────────────────────────────────────
const ALL_COMMUNITIES = [
  { id:1, name:'Komunitas Tani',       Icon:Wheat,         bg:'#E8F5E9', ic:'#2E7D32', g:['#1B5E20','#2E7D32'],
    members:'12.4rb', desc:'Diskusi harga komoditas, tips bertani, musim tanam, dan inovasi pertanian desa.',
    rules:['Hormati sesama anggota dan hindari debat tidak sehat','Bagikan informasi yang akurat dan bisa diverifikasi','Dilarang spam, promosi, dan iklan tanpa izin moderator','Topik harus relevan dengan pertanian dan kehidupan desa','Laporkan konten yang melanggar aturan ke moderator'] },
  { id:2, name:'Komunitas UMKM',       Icon:ShoppingBag,   bg:'#FFF3E0', ic:'#E65100', g:['#BF360C','#E65100'],
    members:'8.1rb',  desc:'Tips jualan, branding kemasan produk, ekspansi pasar, dan networking pelaku UMKM desa.',
    rules:['Saling mendukung dan berbagi pengalaman bisnis','Tidak boleh menyebarkan informasi menyesatkan tentang produk'] },
  { id:3, name:'Komunitas Sehat Desa', Icon:HeartPulse,    bg:'#FFEBEE', ic:'#C62828', g:['#880E4F','#C62828'],
    members:'5.7rb',  desc:'Posyandu, gizi keluarga, kesehatan ibu & anak, dan akses layanan kesehatan desa.',
    rules:['Informasi kesehatan harus dari sumber terpercaya','Bukan untuk konsultasi medis','Jaga privasi anggota yang berbagi kondisi kesehatan','Dilarang mempromosikan obat tanpa izin BPOM'] },
  { id:4, name:'Komunitas Pemuda',     Icon:GraduationCap, bg:'#E3F2FD', ic:'#1565C0', g:['#0D47A1','#1565C0'],
    members:'3.9rb',  desc:'Beasiswa, keterampilan digital, peluang kerja, dan pengembangan diri pemuda desa.',
    rules:['Saling mendukung semangat belajar anggota','Bagikan lowongan dan beasiswa yang sudah diverifikasi','Tidak boleh menyebarkan hoaks pendidikan'] },
  { id:5, name:'Komunitas Ibu Desa',   Icon:Users,         bg:'#F3E5F5', ic:'#6A1B9A', g:['#4A148C','#6A1B9A'],
    members:'6.2rb',  desc:'Parenting, resep masakan, kegiatan rumah tangga, dan kebersamaan ibu-ibu desa.',
    rules:['Lingkungan yang aman dan saling mendukung untuk semua ibu','Berbagi pengalaman parenting dengan positif dan tidak menghakimi','Informasi kesehatan anak harus dari sumber terpercaya'] },
  { id:6, name:'Komunitas Budaya',     Icon:Palette,       bg:'#FFF8E1', ic:'#F57F17', g:['#E65100','#F57F17'],
    members:'2.8rb',  desc:'Tradisi lokal, kesenian daerah, adat istiadat, dan pelestarian budaya Nusantara.',
    rules:['Hormati keberagaman budaya dan adat istiadat daerah lain','Dokumentasi budaya lokal sangat didorong','Tidak boleh merendahkan tradisi atau kepercayaan kelompok lain'] },
  { id:7, name:'Jual Beli GV',         Icon:Store,         bg:'#E3F2FD', ic:JB_COLOR,  g:['#0D47A1',JB_COLOR],
    members:'4.2rb',  desc:'Marketplace komunitas GV — jual & beli produk terverifikasi langsung dari toko ESTO anggota.',
    rules:['Hanya produk terdaftar di ESTO yang boleh diposting','Informasi produk harus sesuai dengan listing ESTO','Dilarang menipu atau memalsukan kondisi/harga produk','Transaksi dilakukan melalui halaman produk ESTO','Laporkan penjual mencurigakan ke moderator'] },
]

// ── Dummy produk ESTO per persona ──────────────────────────
const ESTO_PRODUCTS = {
  penjual_aktif: [
    { id:'ep1', name:'Beras Pandan Wangi Premium 5kg', price:65000, Icon:Wheat, g:['#827717','#9E9D24'], category:'Pangan',     stock:48, toko:'Toko Bu Sari', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop' },
    { id:'ep2', name:'Sayur Bayam Organik Segar 250g', price:5000,  Icon:Leaf, g:['#2E7D32','#4CAF50'], category:'Sayuran',    stock:120,toko:'Toko Bu Sari', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop' },
    { id:'ep3', name:'Telur Ayam Kampung (12 butir)',  price:32000, Icon:Egg, g:['#F57F17','#FBC02D'], category:'Pangan',     stock:30, toko:'Toko Bu Sari', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop' },
    { id:'ep4', name:'Pupuk Organik Kompos 25kg',      price:45000, Icon:Leaf, g:['#2E7D32','#4CAF50'], category:'Pertanian',  stock:20, toko:'Toko Bu Sari', image: 'https://images.unsplash.com/photo-1627341398565-d0c75cc9e5f5?q=80&w=600&auto=format&fit=crop' },
    { id:'ep5', name:'Bibit Cabai Rawit Lokal (50 biji)',price:15000,Icon:Leaf, g:['#C62828','#EF5350'],category:'Pertanian',  stock:60, toko:'Toko Bu Sari', image: 'https://images.unsplash.com/photo-1588147602377-5b6515a452db?q=80&w=600&auto=format&fit=crop' },
  ],
  warga_aktif: [
    { id:'ep6', name:'Keripik Singkong Pedas 200g',    price:15000, Icon:Package, g:['#E65100','#F57C00'], category:'Camilan',    stock:80, toko:'Warung Pak Hendra', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600&auto=format&fit=crop' },
    { id:'ep7', name:'Kopi Robusta Bubuk 250g',        price:35000, Icon:Coffee, g:['#4E342E','#6D4C41'], category:'Minuman',    stock:25, toko:'Warung Pak Hendra', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop' },
  ],
}

const JOINED_IDS_INIT = [1, 2]

const THREADS_INIT = {
  // Komunitas Tani — case: petani jual pupuk & bibit
  1: [
    { id:'t1', type:'pengumuman', title:'Jadwal Penyuluhan Pertanian Organik Agustus 2026', body:'Dinas Pertanian Kabupaten akan mengadakan penyuluhan teknik pertanian organik pada Sabtu, 30 Agustus 2026 pukul 08.00 WIB di Balai Desa Sukamakmur. Harap hadir tepat waktu.', image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop', author:'Wawan Setiawan', authorId:'admin_komunitas', avIcon:UserCheck, time:'1 jam', replies:5, likes:47, isPinned:true },
    { id:'t2', type:'jual_beli', product:{ id:'ep4', name:'Pupuk Organik Kompos 25kg', price:45000, Icon:Leaf, g:['#2E7D32','#4CAF50'], category:'Pertanian', stock:20, toko:'Toko Bu Sari' }, caption:'Stok pupuk organik baru masuk! Cocok untuk musim tanam padi organik. Sudah dipakai 2 musim, hasilnya terbukti.', author:'Bu Sari', authorId:'penjual_aktif', avIcon:User, time:'3 jam', replies:6, likes:34, isPinned:false },
    { id:'t3', type:'jual_beli', product:{ id:'ep5', name:'Bibit Cabai Rawit Lokal (50 biji)', price:15000, Icon:Leaf, g:['#C62828','#EF5350'], category:'Pertanian', stock:60, toko:'Toko Bu Sari' }, caption:'Bibit cabai rawit unggul lokal tahan hama. Siap tanam langsung.', author:'Bu Sari', authorId:'penjual_aktif', avIcon:User, time:'1 hari', replies:3, likes:19, isPinned:false },
    { id:'t4', type:'thread', title:'Cara mencegah serangan wereng di awal musim', body:'Pengalaman saya 3 musim terakhir, wereng selalu menyerang di minggu ke-3 setelah tanam. Apa metode pencegahan alami yang paling efektif?', author:'Agus Petani', authorId:'warga_aktif', avIcon:User, time:'5 jam', replies:11, likes:62, isPinned:false },
    { id:'t5', type:'thread', title:'Pengalaman menggunakan pupuk organik cair buatan sendiri', body:'Sudah 2 musim saya coba pupuk organik cair dari limbah dapur dan kotoran ternak. Hasilnya mengejutkan — biaya input turun 40% dan tanah makin gembur.', author:'Pak Slamet', authorId:'warga_aktif', avIcon:User, time:'1 hari', replies:18, likes:134, isPinned:false },
  ],
  2: [
    { id:'t6', type:'thread', title:'Tips foto produk profesional pakai HP Android', body:'Saya sudah coba berbagai teknik dan yang paling berhasil adalah: cahaya alami dari jendela, background polos dari karton, dan mode portrait kamera belakang.', image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop', author:'Rina UMKM', authorId:'warga_aktif', avIcon:User, time:'12 mnt', replies:3, likes:62, isPinned:true },
    { id:'t7', type:'thread', title:'Ada yang sudah jualan ke luar desa lewat GV Pasar?', body:'Saya baru daftar toko di GV Pasar 2 minggu lalu. Sudah dapat 3 pesanan dari luar desa, tapi pengirimannya masih jadi tantangan.', author:'Bu Dewi', authorId:'warga_aktif', avIcon:User, time:'3 jam', replies:9, likes:34, isPinned:false },
  ],
  3: [
    { id:'t8', type:'pengumuman', title:'Jadwal Posyandu Agustus 2026', body:'Untuk semua ibu yang punya balita, jadwal posyandu bulan Agustus sudah diupdate. Cek di papan pengumuman desa atau tanya ke kader posyandu RT masing-masing.', author:'Wawan Setiawan', authorId:'admin_komunitas', avIcon:UserCheck, time:'1 jam', replies:5, likes:28, isPinned:true },
    { id:'t9', type:'thread', title:'Ada yang tahu posyandu terdekat di desa Cikaret?', body:'Saya baru pindah ke desa Cikaret dan belum tahu lokasi posyandu terdekat. Mohon infonya.', author:'Bu Mila', authorId:'warga_baru', avIcon:User, time:'3 jam', replies:4, likes:12, isPinned:false },
  ],
  4: [{ id:'t10', type:'thread', title:'Beasiswa Kemendikbud untuk pemuda desa — deadline bulan ini', body:'Ada info beasiswa dari Kemendikbud khusus untuk anak muda dari desa. Batas pendaftaran 31 Agustus.', author:'Dedi Muda', authorId:'warga_aktif', avIcon:User, time:'3 jam', replies:15, likes:76, isPinned:true }],
  5: [{ id:'t11', type:'thread', title:'Resep mpasi 6 bulan yang mudah dan bergizi', body:'Berbagi resep MPASI yang sudah saya coba untuk anak 6 bulan: bubur beras merah + wortel + ASI perah.', author:'Bunda Lia', authorId:'warga_aktif', avIcon:User, time:'30 mnt', replies:7, likes:45, isPinned:false }],
  6: [{ id:'t12', type:'thread', title:'Dokumentasi tari tradisional desa Sukamakmur', body:'Kemarin berhasil merekam pertunjukan tari topeng dari desa Sukamakmur yang sudah sangat jarang dipentaskan.', author:'Pak Budiman', authorId:'warga_aktif', avIcon:User, time:'4 jam', replies:8, likes:93, isPinned:false },
  ],
  // Komunitas Jual Beli GV
  7: [
    { id:'jb1', type:'jual_beli', product:{ id:'ep1', name:'Beras Pandan Wangi Premium 5kg', price:65000, Icon:Wheat, g:['#827717','#9E9D24'], category:'Pangan', stock:48, toko:'Toko Bu Sari' }, caption:'Beras pandan wangi dari sawah organik desa Sukamakmur. Tanpa pestisida, langsung dari petani.', author:'Bu Sari', authorId:'penjual_aktif', avIcon:User, time:'30 mnt', replies:8, likes:52, isPinned:true },
    { id:'jb2', type:'jual_beli', product:{ id:'ep6', name:'Keripik Singkong Pedas 200g', price:15000, Icon:Package, g:['#E65100','#F57C00'], category:'Camilan', stock:80, toko:'Warung Pak Hendra' }, caption:'Keripik singkong pedas level 3, produksi UMKM desa. Cocok untuk oleh-oleh.', author:'Pak Hendra', authorId:'warga_aktif', avIcon:User, time:'2 jam', replies:4, likes:28, isPinned:false },
    { id:'jb3', type:'jual_beli', product:{ id:'ep2', name:'Sayur Bayam Organik Segar 250g', price:5000, Icon:Leaf, g:['#2E7D32','#4CAF50'], category:'Sayuran', stock:120, toko:'Toko Bu Sari' }, caption:'Bayam organik dipanen pagi ini, segar langsung dari kebun. Stok terbatas per hari.', author:'Bu Sari', authorId:'penjual_aktif', avIcon:User, time:'3 jam', replies:2, likes:15, isPinned:false },
    { id:'jb4', type:'jual_beli', product:{ id:'ep7', name:'Kopi Robusta Bubuk 250g', price:35000, Icon:Coffee, g:['#4E342E','#6D4C41'], category:'Minuman', stock:25, toko:'Warung Pak Hendra' }, caption:'Kopi robusta dari perkebunan gunung, disangrai manual. Aroma kuat, rasa pahit yang pas.', author:'Pak Hendra', authorId:'warga_aktif', avIcon:User, time:'5 jam', replies:11, likes:67, isPinned:false },
    { id:'jb5', type:'jual_beli', product:{ id:'ep3', name:'Telur Ayam Kampung (12 butir)', price:32000, Icon:Egg, g:['#F57F17','#FBC02D'], category:'Pangan', stock:30, toko:'Toko Bu Sari' }, caption:'Telur ayam kampung asli, ayam dibesarkan bebas di halaman. Kuning telur lebih kuning dan bergizi.', author:'Bu Sari', authorId:'penjual_aktif', avIcon:User, time:'1 hari', replies:5, likes:39, isPinned:false },
  ],
}

const COMMENTS_DATA = {
  t1: [
    { id:'c1', author:'Bu Sari', avIcon:User, text:'Terima kasih infonya Pak Admin! Sudah dicatat di kalender.', time:'30 mnt', likes:5, replies:[{ id:'c1r1', author:'Wawan Setiawan', avIcon:UserCheck, text:'Sama-sama Bu, jangan lupa hadir ya 🙏', time:'25 mnt', likes:3 }]},
    { id:'c2', author:'Agus Petani', avIcon:User, text:'Apakah ada sertifikat kehadiran Pak?', time:'20 mnt', likes:2, replies:[] },
  ],
  t2: [
    { id:'c3', author:'Bu Sari', avIcon:User, text:'Iya Pak, di desa kami juga naik. Semoga bertahan sampai habis panen ya.', time:'3 mnt', likes:5, replies:[{ id:'c3r1', author:'Pak Rohmat', avIcon:User, text:'Aamiin Bu. Tapi hati-hati kalau harga naik tiba-tiba biasanya turun lagi cepat.', time:'2 mnt', likes:3 }]},
    { id:'c4', author:'Agus Petani', avIcon:User, text:'Di desa sebelah malah naik Rp 250/kg. Kayaknya stok nasional lagi berkurang.', time:'4 mnt', likes:8, replies:[] },
  ],
  default: [
    { id:'dc1', author:'Anggota GV', avIcon:User, text:'Informasi yang sangat bermanfaat, terima kasih sudah berbagi!', time:'1 jam', likes:4, replies:[] },
  ],
}

// ── Post Card (Standard discussion/announcement) ──────────────
function PostCard({ thread, community, isAdmin, onTap, onTogglePin, onDelete }) {
  const isAnnouncement = thread.type === 'pengumuman'
  const isPinned = thread.isPinned

  return (
    <div className="bg-white rounded-2xl p-4 cursor-pointer transition-transform active:scale-[0.96] w-full box-border" 
      onClick={() => onTap(thread, community)}
      style={{boxShadow: S.card}}>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: community?.ic || '#2E7D32'}} />
          <span className="text-[12px] font-bold text-gray-900 leading-none mt-0.5">{community?.name || 'Komunitas'}</span>
          <span className="text-gray-300 text-[12px] leading-none mx-0.5 mt-0.5">•</span>
          <span className="text-[11px] font-semibold leading-none text-gray-400 mt-0.5">{thread.time} lalu</span>
        </div>
        {isAnnouncement && (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider" style={{background: '#FFF3E0', color: '#E65100'}}>
            PENGUMUMAN
          </span>
        )}
      </div>

      {/* Post Title */}
      <h3 className="text-base font-bold text-gray-900 leading-snug text-balance mb-3">{thread.title}</h3>
      
      {/* Optional Image */}
      {thread.image && (
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-3 bg-gray-50">
          <img src={thread.image} alt="Thread attachment" className="w-full h-full object-cover border border-black/10" />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
          <TrendingUp size={14} strokeWidth={2}/> <span className="tabular-nums">{thread.likes}</span>
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
          <MessageCircle size={14} strokeWidth={2}/> <span className="tabular-nums">{thread.replies}</span> balasan
        </span>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex items-center gap-2 mt-4 pt-3 justify-end border-t border-gray-50">
          <button onClick={(e)=>{e.stopPropagation(); onTogglePin?.(thread.id)}}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={isPinned ? {background:`${ADMIN_COLOR}15`,color:ADMIN_COLOR} : {background:'#F5F5F5',color:'#9CA3AF'}}>
            {isPinned ? <><PinOff size={10}/> Lepas</> : <><Pin size={10}/> Sematkan</>}
          </button>
          <button onClick={(e)=>{e.stopPropagation(); onDelete?.(thread.id)}}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={{background:'#FEF2F2',color:'#EF4444'}}>
            <Trash2 size={10}/> Hapus
          </button>
        </div>
      )}
    </div>
  )
}

// ── Jual Beli Card (in-feed product card) ─────────────────
function JualBeliCard({ thread, onTap, navigate }) {
  const { product, caption, author, avIcon: AvIcon = User, time, likes, replies } = thread
  const [liked, setLiked] = useState(false)
  return (
    <div className="px-4 py-3.5 bg-white cursor-pointer" onClick={onTap}>
      {/* Author row */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-inner flex-shrink-0"
          style={{background:'#E8F5E9'}}>
          <AvIcon size={12} className="text-gray-600"/>
        </div>
        <span className="text-[11px] font-bold text-gray-900">{author}</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md flex-shrink-0"
          style={{background:'#E8F5E9',boxShadow:`0 0 0 1px ${PRIMARY}15`}}>
          <BadgeCheck size={9} style={{color:PRIMARY}}/>
          <span className="text-[11px] font-bold" style={{color:PRIMARY}}>Terverifikasi ESTO</span>
        </div>
        <span className="text-[12px] text-gray-400 ms-auto">{time} lalu</span>
      </div>

      {/* Product card */}
      <div className="spotlight-border rounded-2xl overflow-hidden border border-gray-100 mb-2.5"
        style={{boxShadow:`0 2px 10px ${JB_COLOR}12, 0 1px 2px rgba(0,0,0,0.04)`}}>
        {/* Product header */}
        <div className="flex items-center gap-3 px-3 py-3"
          style={{background:'linear-gradient(135deg,#EBF5FF,#F0F4FF)'}}>
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
            style={{background:`linear-gradient(135deg,${product.g[0]},${product.g[1]})`}}>
            <product.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-gray-900 leading-snug">{product.name}</p>
            <p className="text-[12px] text-gray-400 mt-0.5">{product.toko} · {product.category}</p>
          </div>
        </div>
        {/* Price + stock + CTA */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white border-t border-gray-50">
          <div className="flex-1">
            <p className="text-[15px] font-extrabold tabular-nums" style={{color:PRIMARY}}>
              Rp {product.price.toLocaleString('id')}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Stok: <span className="tabular-nums">{product.stock}</span> tersedia</p>
          </div>
          <button onClick={e=>{e.stopPropagation();navigate&&navigate('pasar')}}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white flex-shrink-0 active:scale-[0.96] transition-transform"
            style={{background:GRADIENT,boxShadow:`0 2px 6px ${PRIMARY}30`}}>
            <Store size={11}/> Lihat di ESTO
          </button>
        </div>
      </div>

      {/* Caption */}
      {caption && <p className="text-[12.5px] text-gray-700 leading-relaxed mb-2.5 line-clamp-2">{caption}</p>}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={e=>{e.stopPropagation();setLiked(!liked)}}
          className="flex items-center gap-1 text-[11px] transition-colors"
          style={{color:liked?'#E53935':'#9CA3AF'}}>
          <Heart size={12} fill={liked?'#E53935':'none'} style={{color:liked?'#E53935':'#9CA3AF'}}/>{likes+(liked?1:0)}
        </button>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <MessageCircle size={12}/>{replies} komentar
        </span>
      </div>
    </div>
  )
}

// ── Product Selector (untuk Create Post Jual Beli) ─────────
function ProductSelector({ products, onSelect, onBack }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F2ED'}}>
          <ArrowLeft size={15} className="text-gray-600"/>
        </button>
        <p className="text-[14px] font-bold text-gray-900">Pilih Produk ESTO</p>
      </div>
      <p className="text-[11px] text-gray-400 px-4 py-3">
        Produk yang dipilih akan ditampilkan sebagai post jual beli di komunitas.
      </p>
      <div className="flex-1 overflow-y-auto">
        {products.map(p=>(
          <button key={p.id} onClick={()=>onSelect(p)}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-left active:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
              style={{background:`linear-gradient(135deg,${p.g[0]},${p.g[1]})`}}>
              <p.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 leading-snug">{p.name}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{p.toko} · Stok: <span className="tabular-nums">{p.stock}</span></p>
            </div>
            <p className="text-[13px] font-extrabold flex-shrink-0 tabular-nums" style={{color:PRIMARY}}>
              Rp {p.price.toLocaleString('id')}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Buat Komunitas ─────────────────────────────────────────
function CreateCommunityPage({ onClose, onCreated }) {
  const [step, setStep]       = useState(1) // 1: info, 2: rules, 3: preview
  const [name, setName]       = useState('')
  const [desc, setDesc]       = useState('')
  const [kategori, setKat]    = useState('')
  const [rules, setRules]     = useState(['','',''])
  const [color, setColor]     = useState('#2E7D32')

  const KATEGORI = ['Pertanian','UMKM & Bisnis','Kesehatan','Pendidikan','Sosial & Budaya','Pemuda','Lingkungan','Lainnya']
  const COLORS   = ['#2E7D32','#1565C0','#C62828','#6A1B9A','#E65100','#F57F17','#00695C','#1B6B3A']

  const validInfo  = name.trim() && desc.trim() && kategori
  const validRules = rules.some(r=>r.trim())

  const submit = () => {
    const newComm = {
      id: Date.now(),
      name, desc, kategori,
      Icon: ShoppingBag,
      bg: `${color}20`, ic: color, g:[color, color+'CC'],
      members:'0', arena:`Arena ${name.split(' ')[0]}`, tabloid:`Tabloid ${name.split(' ')[0]}`,
      rules: rules.filter(r=>r.trim()),
    }
    onCreated(newComm)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slide-up">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-5 pb-3" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={()=>step>1?setStep(step-1):onClose()}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F2ED'}}>
          <ArrowLeft size={15} className="text-gray-600"/>
        </button>
        <div className="flex-1">
          <p className="text-[14px] font-bold text-gray-900">Buat Komunitas</p>
          <p className="text-[12px] text-gray-400">Langkah {step} dari 3</p>
        </div>
        {step===3 && (
          <button onClick={submit}
            className="px-4 py-2 rounded-full text-[12px] font-bold text-white active:scale-[0.96] transition-transform"
            style={{background:GRADIENT}}>
            Buat
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 flex gap-1 px-4 py-2">
        {[1,2,3].map(s=>(
          <div key={s} className="flex-1 h-1 rounded-full transition"
            style={{background:s<=step?PRIMARY:'#E0E0E0'}}/>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Step 1 — Info Dasar */}
        {step===1 && (
          <div className="pt-4 flex flex-col gap-4">
            <div>
              <p className="text-[12px] font-semibold text-gray-400 mb-2">Nama Komunitas</p>
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder="cth. Komunitas Petani Muda"
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
                style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-400 mb-2">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {KATEGORI.map(k=>(
                  <button key={k} onClick={()=>setKat(k)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition"
                    style={kategori===k?{background:PRIMARY,color:'#fff',borderColor:PRIMARY}:{background:'transparent',color:'#6B7280',borderColor:'#E0E0E0'}}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-400 mb-2">Deskripsi</p>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)}
                placeholder="Ceritakan tujuan dan topik utama komunitas ini..."
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none resize-none"
                style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA',minHeight:80}}/>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-400 mb-2">Warna Komunitas</p>
              <div className="flex gap-2">
                {COLORS.map(c=>(
                  <button key={c} onClick={()=>setColor(c)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-[0.96]"
                    style={{background:c,boxShadow:color===c?`0 0 0 3px white, 0 0 0 5px ${c}`:'none'}}>
                    {color===c&&<CheckCircle size={14} className="text-white"/>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Rules */}
        {step===2 && (
          <div className="pt-4">
            <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
              Buat aturan komunitas yang jelas agar diskusi tetap sehat dan kondusif. Minimal 1 aturan.
            </p>
            <div className="flex flex-col gap-3">
              {rules.map((r,i)=>(
                <div key={i} className="flex items-start gap-2.5 stagger-in" style={{animationDelay:`${i*40}ms`}}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-2"
                    style={{background:`${color}15`}}>
                    <span className="text-[12px] font-extrabold" style={{color}}>{i+1}</span>
                  </div>
                  <input value={r} onChange={e=>{const nr=[...rules];nr[i]=e.target.value;setRules(nr)}}
                    placeholder={`Aturan ${i+1} (opsional)`}
                    className="flex-1 rounded-2xl px-4 py-2.5 text-[12px] outline-none"
                    style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
                </div>
              ))}
              {rules.length < 7 && (
                <button onClick={()=>setRules([...rules,''])}
                  className="flex items-center gap-2 text-[12px] font-semibold py-2"
                  style={{color:PRIMARY}}>
                  <Plus size={14}/> Tambah Aturan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Preview */}
        {step===3 && (
          <div className="pt-4">
            <p className="text-[12px] font-semibold text-gray-400 mb-3">Preview Komunitas</p>
            <div className="spotlight-border rounded-2xl overflow-hidden mb-4" style={{boxShadow:`0 6px 20px ${color}20, 0 2px 6px rgba(0,0,0,0.05)`}}>
              <div className="p-5 text-center"
                style={{background:`linear-gradient(155deg,${color}CC,${color})`}}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{background:'rgba(255,255,255,0.2)'}}>
                  <Users size={28} className="text-white"/>
                </div>
                <p className="text-[17px] font-extrabold text-white">{name||'Nama Komunitas'}</p>
                <p className="text-[11px] text-white/60 mt-1">{kategori||'Kategori'} · 0 anggota</p>
              </div>
              <div className="bg-white p-4">
                <p className="text-[12px] text-gray-600 leading-relaxed mb-3">{desc||'Deskripsi komunitas'}</p>
                {rules.filter(r=>r.trim()).length > 0 && (
                  <>
                    <p className="text-[12px] font-semibold text-gray-400 mb-2">Rules</p>
                    {rules.filter(r=>r.trim()).map((r,i)=>(
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <span className="text-[12px] font-extrabold w-4 flex-shrink-0 mt-0.5" style={{color}}>{i+1}.</span>
                        <span className="text-[11px] text-gray-600">{r}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="px-3 py-2.5 rounded-xl flex items-start gap-2"
              style={{background:'#FFF8E1',border:'1px solid #F9A82540'}}>
              <AlertCircle size={13} style={{color:'#F57F17'}} className="flex-shrink-0 mt-0.5"/>
              <p className="text-[12px] text-amber-700 leading-snug">
                Komunitas akan ditinjau tim GV sebelum aktif. Proses biasanya memakan waktu 1–2 hari kerja.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      {step < 3 && (
        <div className="flex-shrink-0 px-4 pb-8 pt-3" style={{boxShadow:'0 -1px 0 rgba(27,107,58,0.06)'}}>
          <button onClick={()=>setStep(step+1)}
            disabled={step===1&&!validInfo}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition active:scale-[0.96]"
            style={{background:(step===1&&!validInfo)?'#E0E0E0':GRADIENT}}>
            {step===1?'Lanjut — Buat Rules':'Lanjut — Preview'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Buat Post / Pengumuman / Jual Beli ─────────────────────
function CreatePostSheet({ community, isAdmin, isPenjual, estoProducts, onClose, onPosted }) {
  const defaultType = isAdmin ? 'pengumuman' : 'thread'
  const [type, setType]          = useState(defaultType)
  const [title, setTitle]        = useState('')
  const [body,  setBody]         = useState('')
  const [photo, setPhoto]        = useState(null)
  const [selectedProduct, setProd] = useState(null)
  const [caption, setCaption]    = useState('')
  const [showPicker, setPickerV] = useState(false)
  const fileRef                  = useRef(null)

  const handlePhoto = e => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const canPost = type==='jual_beli' ? !!selectedProduct : !!title.trim()

  const submit = () => {
    if (!canPost) return
    if (type==='jual_beli') {
      onPosted({ type:'jual_beli', product:selectedProduct, caption, author:'Kamu', authorId:'penjual_aktif', avIcon:UserCheck, time:'Baru saja', replies:0, likes:0, isPinned:false })
    } else {
      onPosted({ type, title, body, photo, author:'Kamu', authorId:isAdmin?'admin_komunitas':'current', avIcon:User, time:'Baru saja', replies:0, likes:0, isPinned:type==='pengumuman' })
    }
    onClose()
  }

  // Show product picker
  if (showPicker) return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slide-up">
      <ProductSelector
        products={estoProducts}
        onSelect={p=>{ setProd(p); setPickerV(false) }}
        onBack={()=>setPickerV(false)}/>
    </div>
  )

  // Type tabs
  const TYPES = [
    ...(isAdmin ? [['pengumuman','📢 Pengumuman']] : []),
    ['thread','💬 Thread'],
    ...(isPenjual ? [['jual_beli','🏪 Jual Beli']] : []),
  ]

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slide-up">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-5 pb-3" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{background:'#F0F2ED'}}>
          <X size={15} className="text-gray-600"/>
        </button>
        <p className="flex-1 text-[14px] font-bold text-gray-900">Buat Post</p>
        <button onClick={submit}
          className="px-4 py-2 rounded-full text-[12px] font-bold text-white transition active:scale-[0.96]"
          style={{background:canPost
            ? type==='pengumuman'?ADMIN_COLOR:type==='jual_beli'?JB_COLOR:GRADIENT
            :'#E0E0E0'}}>
          Posting
        </button>
      </div>

      {/* Type selector */}
      {TYPES.length > 1 && (
        <div className="flex-shrink-0 flex gap-2 px-4 py-3 border-b border-gray-50 overflow-x-auto no-scrollbar">
          {TYPES.map(([id,label])=>{
            const activeColor = id==='pengumuman'?ADMIN_COLOR:id==='jual_beli'?JB_COLOR:PRIMARY
            return (
              <button key={id} onClick={()=>setType(id)}
                className="flex-shrink-0 px-3 py-2 rounded-full text-[11px] font-bold border transition"
                style={type===id
                  ? {background:activeColor,color:'#fff',borderColor:activeColor}
                  : {background:'transparent',color:'#9CA3AF',borderColor:'#E0E0E0'}}>
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Pengumuman info */}
      {type==='pengumuman' && (
        <div className="mx-4 mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2 flex-shrink-0"
          style={{background:`${ADMIN_COLOR}10`,border:`1px solid ${ADMIN_COLOR}30`}}>
          <Megaphone size={12} style={{color:ADMIN_COLOR}} className="flex-shrink-0"/>
          <p className="text-[12px] leading-snug" style={{color:ADMIN_COLOR}}>
            Pengumuman akan otomatis disematkan di atas feed.
          </p>
        </div>
      )}

      {/* Context */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 flex-shrink-0"
        style={{background:'#F9FAFB'}}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{background:community.bg}}>
          <community.Icon size={13} style={{color:community.ic}}/>
        </div>
        <span className="text-[11px] font-semibold" style={{color:community.ic}}>{community.name}</span>
      </div>

      {/* ── Form: Thread / Pengumuman ── */}
      {type !== 'jual_beli' && (
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          <input value={title} onChange={e=>setTitle(e.target.value)}
            placeholder="Judul (wajib)"
            className="w-full text-[16px] font-bold text-gray-900 outline-none mb-4 placeholder:font-normal placeholder:text-gray-300"
            style={{borderBottom:'1.5px solid rgba(27,107,58,0.12)',paddingBottom:12}}/>
          <textarea value={body} onChange={e=>setBody(e.target.value)}
            placeholder="Tulis isi post di sini... (opsional)"
            className="w-full text-[14px] text-gray-700 leading-relaxed outline-none resize-none rounded-2xl px-3 py-2.5"
            style={{minHeight:140,background:'rgba(27,107,58,0.02)',border:'1px solid rgba(27,107,58,0.08)'}}/>
          {photo && (
            <div className="relative mt-3 rounded-2xl overflow-hidden" style={{height:160,background:'#F0F0F0'}}>
              <img src={photo} alt="" className="w-full h-full object-cover border border-black/10"/>
              <button onClick={()=>setPhoto(null)}
                className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{background:'rgba(0,0,0,0.55)'}}>
                <X size={13} className="text-white"/>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Form: Jual Beli ── */}
      {type === 'jual_beli' && (
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          {/* Pilih produk */}
          <p className="text-[12px] font-semibold text-gray-400 mb-2">Produk ESTO</p>
          {selectedProduct ? (
            <div className="spotlight-border rounded-2xl overflow-hidden border border-gray-100 mb-4"
              style={{boxShadow:`0 2px 10px ${JB_COLOR}12, 0 1px 2px rgba(0,0,0,0.04)`}}>
              <div className="flex items-center gap-3 px-3 py-3"
                style={{background:'linear-gradient(135deg,#EBF5FF,#F0F4FF)'}}>
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                  style={{background:`linear-gradient(135deg,${selectedProduct.g[0]},${selectedProduct.g[1]})`}}>
                  <selectedProduct.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900">{selectedProduct.name}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{selectedProduct.toko}</p>
                  <p className="text-[12px] font-extrabold mt-0.5 tabular-nums" style={{color:PRIMARY}}>
                    Rp {selectedProduct.price.toLocaleString('id')}
                  </p>
                </div>
                <button onClick={()=>setProd(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{background:'#F0F2ED'}}>
                  <X size={12} className="text-gray-400"/>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={()=>setPickerV(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-dashed mb-4 transition"
              style={{borderColor:`${JB_COLOR}40`,background:`${JB_COLOR}04`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{background:`${JB_COLOR}12`}}>
                <Store size={18} style={{color:JB_COLOR}}/>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[12px] font-bold" style={{color:JB_COLOR}}>Pilih Produk dari Toko ESTO</p>
                <p className="text-[12px] text-gray-400 mt-0.5">Tap untuk memilih produk yang ingin dijual</p>
              </div>
              <ChevronRight size={14} style={{color:JB_COLOR}} className="flex-shrink-0"/>
            </button>
          )}

          {/* Caption */}
          <p className="text-[12px] font-semibold text-gray-400 mb-2">
            Caption <span className="text-gray-300 font-normal">(opsional)</span>
          </p>
          <textarea value={caption} onChange={e=>setCaption(e.target.value)}
            placeholder="Ceritakan lebih lanjut tentang produkmu kepada komunitas..."
            className="w-full rounded-2xl px-4 py-3 text-[13px] text-gray-700 outline-none resize-none glass"
            style={{border:'1.5px solid rgba(27,107,58,0.10)',minHeight:90}}/>

          <div className="mt-3 px-3 py-2.5 rounded-xl flex items-start gap-2"
            style={{background:`${JB_COLOR}08`,border:`1px solid ${JB_COLOR}20`}}>
            <BadgeCheck size={12} style={{color:JB_COLOR}} className="flex-shrink-0 mt-0.5"/>
            <p className="text-[12px] leading-snug" style={{color:JB_COLOR}}>
              Transaksi dilakukan melalui halaman produk ESTO. Anggota komunitas yang tertarik akan diarahkan ke tokomu.
            </p>
          </div>
        </div>
      )}

      {/* Footer — attach photo (hanya untuk thread/pengumuman) */}
      {type !== 'jual_beli' && (
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3" style={{boxShadow:'0 -1px 0 rgba(27,107,58,0.06)'}}>
          <button onClick={()=>fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition"
            style={{background:photo?`${PRIMARY}12`:'#F0F0F0',color:photo?PRIMARY:'#9CA3AF'}}>
            <Image size={14}/> {photo ? 'Ganti Foto' : 'Tambah Foto'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
          <p className="text-[12px] text-gray-400 ms-auto">{title.length} karakter</p>
        </div>
      )}
    </div>
  )
}

// ── Thread Detail ──────────────────────────────────────────
function ThreadDetail({ thread, community, onBack, isAdmin, isPenjual, estoProducts = [], currentUserId }) {
  const initComments = (() => {
    const base = COMMENTS_DATA[thread.id] || COMMENTS_DATA.default
    // Untuk jual_beli, tambahkan dummy comment dari user lain yang juga jual produk
    if (thread.type === 'jual_beli') {
      return [
        ...base,
        { id:'jb_c1', author:'Pak Slamet', avIcon:User, text:'Wah stoknya masih banyak Bu, saya pesan 2 sak ya. Bisa diantar ke desa Bojong tidak?', time:'1 jam', likes:3, replies:[] },
        { id:'jb_c2', author:'Bu Dewi', avIcon:User, text:'Kualitasnya sudah saya coba musim lalu, hasilnya memang beda dari pupuk kimia. Recommended!', time:'2 jam', likes:7, replies:[] },
      ]
    }
    return base
  })()
  const [comments, setComments] = useState(initComments.map(c=>({...c,replies:[...(c.replies||[])]})))
  const [newMsg, setNewMsg]     = useState('')
  const [liked, setLiked]       = useState(false)
  const [replyTo, setReplyTo]   = useState(null)
  const [replyText, setReplyText] = useState('')
  const [expanded, setExpanded]   = useState({})
  const [attachedProduct, setAttached] = useState(null)
  const [showProdPicker, setProdPicker] = useState(false)

  const sendTop = () => {
    if (!newMsg.trim() && !attachedProduct) return
    setComments(p=>[...p,{
      id:Date.now(), author:'Kamu', avIcon:User,
      text:newMsg, time:'Baru saja', likes:0, replies:[],
      product: attachedProduct || null,
    }])
    setNewMsg(''); setAttached(null)
  }
  const sendReply = (commentId) => {
    if (!replyText.trim()) return
    setComments(p=>p.map(c=>c.id===commentId
      ? {...c,replies:[...c.replies,{id:Date.now(),author:'Kamu',avIcon:User,text:replyText,time:'Baru saja',likes:0}]}
      : c
    ))
    setReplyText(''); setReplyTo(null)
    setExpanded(e=>({...e,[commentId]:true}))
  }

  const isAnnouncement = thread.type === 'pengumuman'
  const isAdminPost    = thread.authorId === 'admin_komunitas'
  const isJualBeli     = thread.type === 'jual_beli'

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'#F0F2ED'}}>
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:community.bg}}>
            <community.Icon size={12} style={{color:community.ic}}/>
          </div>
          <p className="text-[12px] font-bold line-clamp-2" style={{color:community.ic}}>{community.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* ── OP — Jual Beli ── */}
        {isJualBeli && (
          <div className="px-4 pt-4 pb-4 bg-white" style={{boxShadow:'0 1px 0 rgba(27,107,58,0.06)'}}>
            {/* Author */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{background:'#E8F5E9'}}>
                {thread.avIcon ? <thread.avIcon size={14} className="text-gray-600"/> : <User size={14} className="text-gray-600"/>}
              </div>
              <span className="text-[11px] font-bold text-gray-900">{thread.author}</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{background:'#E8F5E9',boxShadow:`0 0 0 1px ${PRIMARY}15`}}>
                <BadgeCheck size={9} style={{color:PRIMARY}}/>
                <span className="text-[11px] font-bold" style={{color:PRIMARY}}>Terverifikasi ESTO</span>
              </div>
              <span className="text-[12px] text-gray-400 ms-auto">{thread.time} lalu</span>
            </div>
            {/* Product card */}
            <div className="spotlight-border rounded-2xl overflow-hidden border border-gray-100 mb-3" style={{boxShadow:`0 2px 10px ${JB_COLOR}12, 0 1px 2px rgba(0,0,0,0.04)`}}>
              <div className="flex items-center gap-3 px-3 py-3" style={{background:'linear-gradient(135deg,#EBF5FF,#F0F4FF)'}}>
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                  style={{background:`linear-gradient(135deg,${thread.product?.g?.[0]},${thread.product?.g?.[1]})`}}>
                  {thread.product?.Icon && <thread.product.Icon size={28} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{thread.product?.name}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{thread.product?.toko} · {thread.product?.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-white border-t border-gray-50">
                <div className="flex-1">
                  <p className="text-[16px] font-extrabold tabular-nums" style={{color:PRIMARY}}>
                    Rp {thread.product?.price?.toLocaleString('id')}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5">Stok: <span className="tabular-nums">{thread.product?.stock}</span> tersedia</p>
                </div>
                <button onClick={()=>navigate('pasar')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white flex-shrink-0 active:scale-[0.96] transition-transform"
                  style={{background:GRADIENT,boxShadow:`0 2px 8px ${PRIMARY}30`}}>
                  <Store size={13}/> Lihat di ESTO
                </button>
              </div>
            </div>
            {/* Caption */}
            {thread.caption && <p className="text-[13px] text-gray-700 leading-relaxed mb-4">{thread.caption}</p>}
            {/* Actions */}
            <div className="flex items-center gap-5 pt-3 border-t border-gray-50">
              <button onClick={()=>setLiked(!liked)} className="flex items-center gap-1.5 text-[12px] transition-colors"
                style={{color:liked?'#E53935':'#9CA3AF'}}>
                <Heart size={15} fill={liked?'#E53935':'none'} style={{color:liked?'#E53935':'#9CA3AF'}}/>{thread.likes+(liked?1:0)} Suka
              </button>
              <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                <MessageCircle size={15}/>{comments.length} Komentar
              </span>
            </div>
          </div>
        )}

        {/* ── OP — Thread/Pengumuman ── */}
        {!isJualBeli && (
          <div className="px-4 pt-4 pb-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {isAnnouncement && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{background:`${ADMIN_COLOR}12`}}>
                  <Megaphone size={9} style={{color:ADMIN_COLOR}}/><span className="text-[11px] font-bold" style={{color:ADMIN_COLOR}}>Pengumuman Admin</span>
                </div>
              )}
              {thread.isPinned && !isAnnouncement && (
                <div className="flex items-center gap-1"><Pin size={9} className="text-gray-400"/><span className="text-[11px] text-gray-400 font-semibold">Disematkan</span></div>
              )}
            </div>
            <p className="text-[17px] font-extrabold text-gray-900 leading-snug mb-3">{thread.title}</p>
            {thread.body && <p className="text-[13.5px] text-gray-700 leading-relaxed mb-4">{thread.body}</p>}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{background:'#E8F5E9'}}>
                {thread.avIcon ? <thread.avIcon size={14} className="text-gray-600"/> : <User size={14} className="text-gray-600"/>}
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{thread.author}</span>
              {isAdminPost && <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md" style={{background:`${ADMIN_COLOR}15`,color:ADMIN_COLOR}}>Admin</span>}
              <span className="text-gray-300">·</span>
              <span className="text-[12px] text-gray-400">{thread.time} lalu</span>
            </div>
            <div className="flex items-center gap-5 pt-3 border-t border-gray-50">
              <button onClick={()=>setLiked(!liked)} className="flex items-center gap-1.5 text-[12px] transition-colors"
                style={{color:liked?'#E53935':'#9CA3AF'}}>
                <Heart size={15} fill={liked?'#E53935':'none'} style={{color:liked?'#E53935':'#9CA3AF'}}/>{thread.likes+(liked?1:0)} Suka
              </button>
              <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                <MessageCircle size={15}/>{comments.length} Balasan
              </span>
            </div>
          </div>
        )}

        {/* ── Comments ── */}
        <div className="pb-32">
          {comments.length===0 && (
            <div className="py-10 text-center"><p className="text-[13px] text-gray-400">Belum ada balasan. Jadi yang pertama!</p></div>
          )}
          {comments.map((c,i)=>(
            <div key={c.id} className={`px-4 py-3.5 bg-white ${i<comments.length-1?'border-b border-gray-50':''}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{background:'#E8F5E9'}}>
                  {c.avIcon ? <c.avIcon size={14} className="text-gray-600"/> : <User size={14} className="text-gray-600"/>}
                </div>
                <span className="text-[11px] font-bold text-gray-900">{c.author}</span>
                <span className="text-[12px] text-gray-400">{c.time}</span>
              </div>
              <p className="text-[13px] text-gray-800 leading-relaxed mb-2 ms-9">{c.text}</p>
              {/* Mini product card in comment */}
              {c.product && (
                <div className="ms-9 mb-2 rounded-xl overflow-hidden border border-gray-100"
                  style={{boxShadow:S.card}}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5"
                    style={{background:'linear-gradient(135deg,#EBF5FF,#F0F4FF)'}}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                      style={{background:`linear-gradient(135deg,${c.product.g[0]},${c.product.g[1]})`}}>
                      <c.product.Icon size={16} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-900 line-clamp-2">{c.product.name}</p>
                      <p className="text-[11px] font-extrabold mt-0.5" style={{color:PRIMARY}}>
                        Rp {c.product.price.toLocaleString('id')}
                      </p>
                    </div>
                    <button onClick={()=>navigate('pasar')}
                      className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-white"
                      style={{background:GRADIENT}}>
                      Lihat di ESTO
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 ms-9">
                <button className="flex items-center gap-1 text-[12px] text-gray-400"><Heart size={11}/>{c.likes}</button>
                <button onClick={()=>{setReplyTo(replyTo===c.id?null:c.id);setReplyText('')}}
                  className="text-[12px] font-semibold" style={{color:PRIMARY}}>Balas</button>
                {c.replies?.length>0 && (
                  <button onClick={()=>setExpanded(e=>({...e,[c.id]:!e[c.id]}))}
                    className="flex items-center gap-1 text-[12px] font-semibold text-gray-400">
                    <ChevronDown size={11} className={`transition-transform ${expanded[c.id]?'rotate-180':''}`}/>
                    {c.replies.length} balasan
                  </button>
                )}
              </div>
              {replyTo===c.id && (
                <div className="flex items-center gap-2 mt-2.5 ms-9">
                  <div className="flex-1 flex items-center rounded-full px-3 py-2" style={{background:'#F5F5F5'}}>
                    <input value={replyText} onChange={e=>setReplyText(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&sendReply(c.id)}
                      placeholder={`Balas ke ${c.author}…`} autoFocus
                      className="flex-1 text-[12px] outline-none bg-transparent text-gray-700"/>
                  </div>
                  <button onClick={()=>sendReply(c.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{background:replyText.trim()?PRIMARY:'#E0E0E0'}}>
                    <Send size={12} className="text-white" style={{marginInlineStart:1}}/>
                  </button>
                </div>
              )}
              {expanded[c.id] && c.replies?.length>0 && (
                <div className="ms-9 mt-2.5 ps-3 border-s-2 border-gray-100 flex flex-col gap-3">
                  {c.replies.map(r=>(
                    <div key={r.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{background:'#E8F5E9'}}>
                          {r.avIcon ? <r.avIcon size={12} className="text-gray-600"/> : <User size={12} className="text-gray-600"/>}
                        </div>
                        <span className="text-[11px] font-bold text-gray-900">{r.author}</span>
                        <span className="text-[12px] text-gray-400">{r.time}</span>
                      </div>
                      <p className="text-[12.5px] text-gray-700 leading-relaxed ms-8">{r.text}</p>
                      <div className="flex items-center gap-3 mt-1 ms-8">
                        <button className="flex items-center gap-1 text-[12px] text-gray-400"><Heart size={10}/>{r.likes}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product picker overlay */}
      {showProdPicker && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white animate-slide-up">
          <ProductSelector
            products={estoProducts}
            onSelect={p=>{ setAttached(p); setProdPicker(false) }}
            onBack={()=>setProdPicker(false)}/>
        </div>
      )}

      {/* Attached product preview */}
      {attachedProduct && (
        <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 bg-white border-t border-gray-100">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{background:'linear-gradient(135deg,#EBF5FF,#F0F4FF)',border:`1px solid ${JB_COLOR}20`}}>
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
              style={{background:`linear-gradient(135deg,${attachedProduct.g[0]},${attachedProduct.g[1]})`}}>
              <attachedProduct.Icon size={16} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-900 line-clamp-2">{attachedProduct.name}</p>
              <p className="text-[12px] font-semibold" style={{color:PRIMARY}}>Rp {attachedProduct.price.toLocaleString('id')}</p>
            </div>
            <button onClick={()=>setAttached(null)}
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{background:'rgba(0,0,0,0.1)'}}>
              <X size={10} className="text-gray-600"/>
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-100">
        {/* Input */}
        <div className="flex-1 flex items-center rounded-full px-3.5 py-2.5"
          style={{background:'#F5F5F5'}}>
          <input value={newMsg} onChange={e=>setNewMsg(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&sendTop()}
            placeholder={isJualBeli ? 'Tulis komentar atau pertanyaan…' : 'Tulis balasan…'}
            className="flex-1 text-[12px] outline-none bg-transparent text-gray-700"/>
        </div>
        {/* Attach product button — only for Penjual */}
        {isPenjual && (
          <button onClick={()=>setProdPicker(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-[0.96]"
            style={{background:attachedProduct?`${JB_COLOR}15`:'#F0F0F0'}}>
            <Store size={15} style={{color:attachedProduct?JB_COLOR:'#9CA3AF'}}/>
          </button>
        )}
        {/* Send */}
        <button onClick={sendTop}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition"
          style={{background:(newMsg.trim()||attachedProduct)?PRIMARY:'#E0E0E0'}}>
          <Send size={14} className="text-white" style={{marginInlineStart:1}}/>
        </button>
      </div>
    </div>
  )
}
// ── Editable Rules ─────────────────────────────────────────
function EditableRules({ community, isAdmin }) {
  const [editing, setEditing] = useState(false)
  const [rules, setRules]     = useState([...community.rules])
  const [draft, setDraft]     = useState([...community.rules])

  const startEdit = () => { setDraft([...rules]); setEditing(true) }
  const cancel    = () => { setDraft([...rules]); setEditing(false) }
  const save      = () => { setRules([...draft.filter(r=>r.trim())]); setEditing(false) }
  const updateRule= (i,v) => { const d=[...draft]; d[i]=v; setDraft(d) }
  const removeRule= (i)   => setDraft(d=>d.filter((_,idx)=>idx!==i))
  const addRule   = ()    => setDraft(d=>[...d,''])

  return (
    <div className="px-4 pt-4">
      <div className="bg-white rounded-2xl p-4 mb-3 spotlight-border" style={{boxShadow:S.card}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background:`${community.ic}15`}}>
              <Shield size={15} style={{color:community.ic}}/>
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">Aturan Komunitas</p>
              <p className="text-[12px] text-gray-400">Berlaku untuk semua anggota</p>
            </div>
          </div>
          {isAdmin && !editing && (
            <button onClick={startEdit}
              className="text-[12px] font-bold px-2.5 py-1.5 rounded-lg"
              style={{background:`${ADMIN_COLOR}12`,color:ADMIN_COLOR}}>
              Edit Rules
            </button>
          )}
          {isAdmin && editing && (
            <div className="flex gap-1.5">
              <button onClick={cancel}
                className="text-[12px] font-semibold px-2.5 py-1.5 rounded-lg"
                style={{background:'#F5F5F5',color:'#9CA3AF'}}>
                Batal
              </button>
              <button onClick={save}
                className="text-[12px] font-bold px-2.5 py-1.5 rounded-lg text-white"
                style={{background:GRADIENT}}>
                Simpan
              </button>
            </div>
          )}
        </div>

        {/* View mode */}
        {!editing && rules.map((rule,i)=>(
          <div key={i} className={`flex items-start gap-3 py-3 ${i<rules.length-1?'border-b border-gray-50':''}`}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{background:`${community.ic}15`}}>
              <span className="text-[12px] font-extrabold" style={{color:community.ic}}>{i+1}</span>
            </div>
            <p className="text-[12.5px] text-gray-700 leading-snug">{rule}</p>
          </div>
        ))}

        {/* Edit mode */}
        {editing && (
          <div className="flex flex-col gap-2.5">
            {draft.map((rule,i)=>(
              <div key={i} className="flex items-start gap-2.5">
                {/* Drag handle / number */}
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-2.5"
                  style={{background:`${ADMIN_COLOR}15`}}>
                  <span className="text-[12px] font-extrabold" style={{color:ADMIN_COLOR}}>{i+1}</span>
                </div>
                {/* Input */}
                <div className="flex-1 flex items-center rounded-2xl px-3 py-2.5 gap-2"
                  style={{border:`1.5px solid ${ADMIN_COLOR}30`,background:`${ADMIN_COLOR}04`}}>
                  <textarea
                    value={rule}
                    onChange={e=>updateRule(i,e.target.value)}
                    placeholder={`Aturan ${i+1}...`}
                    className="flex-1 text-[12px] text-gray-800 outline-none resize-none leading-snug bg-transparent"
                    style={{minHeight:36}}/>
                </div>
                {/* Delete */}
                <button onClick={()=>removeRule(i)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1.5"
                  style={{background:'#FEF2F2'}}>
                  <Trash2 size={12} className="text-red-400"/>
                </button>
              </div>
            ))}

            {/* Add rule */}
            {draft.length < 10 && (
              <button onClick={addRule}
                className="flex items-center gap-2 py-2.5 px-3 rounded-2xl text-[12px] font-semibold mt-1 transition"
                style={{border:`1.5px dashed ${ADMIN_COLOR}40`,color:ADMIN_COLOR,background:`${ADMIN_COLOR}05`}}>
                <Plus size={14}/> Tambah Aturan
              </button>
            )}

            <div className="mt-1 px-1">
              <p className="text-[12px] text-gray-400">
                {draft.filter(r=>r.trim()).length} dari maks. 10 aturan · Aturan kosong akan dihapus otomatis saat disimpan.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lapor */}
      <div className="bg-white rounded-2xl p-4" style={{boxShadow:S.card}}>
        <div className="flex items-center gap-2">
          <Flag size={14} className="text-red-400 flex-shrink-0"/>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            Temukan konten yang melanggar? <span className="font-semibold" style={{color:'#E53935'}}>Laporkan ke moderator</span> — kami akan tinjau dalam 24 jam.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Community Page ─────────────────────────────────────────
function CommunityPage({ community, isJoined: initJoined, isAdmin, isPenjual, estoProducts, onBack, onToggleJoin, navigate }) {
  const [innerTab, setInnerTab] = useState('thread')
  const [joined, setJoined]     = useState(initJoined)
  const [threads, setThreads]   = useState(THREADS_INIT[community.id]||[])
  const [selectedThread, setThread] = useState(null)
  const [showCreate, setCreate]     = useState(false)
  const [menuOpen, setMenu]         = useState(null)

  const handleJoin  = () => { setJoined(!joined); onToggleJoin(community.id,!joined) }
  const handlePosted = t => { setThreads(p=>[{...t,id:`t_new_${Date.now()}`},...p]) }

  const togglePin = (id) => setThreads(p=>p.map(t=>t.id===id?{...t,isPinned:!t.isPinned}:t))
  const deleteThread = (id) => { setThreads(p=>p.filter(t=>t.id!==id)); setMenu(null) }

  const sorted = [...threads].sort((a,b)=>{ if(a.isPinned&&!b.isPinned)return -1; if(!a.isPinned&&b.isPinned)return 1; return 0 })

  if (selectedThread) return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <ThreadDetail thread={selectedThread} community={community} onBack={()=>setThread(null)} isAdmin={isAdmin} isPenjual={isPenjual} estoProducts={estoProducts} currentUserId="current"/>
    </div>
  )
  if (showCreate) return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <CreatePostSheet community={community} isAdmin={isAdmin} isPenjual={isPenjual}
        estoProducts={estoProducts} onClose={()=>setCreate(false)}
        onPosted={t=>{handlePosted(t);setCreate(false)}}/>
    </div>
  )

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Banner */}
      <div className="flex-shrink-0" style={{background:`linear-gradient(155deg,${community.g[0]},${community.g[1]})`}}>
        <div className="flex items-center px-4 pt-4 pb-3">
          <button onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center me-3 flex-shrink-0"
            style={{background:'rgba(255,255,255,0.15)'}}>
            <ArrowLeft size={16} className="text-white"/>
          </button>
          <p className="text-[14px] font-bold text-white line-clamp-2 flex-1">{community.name}</p>
          {isAdmin && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0"
              style={{background:'rgba(255,255,255,0.15)'}}>
              <Shield size={10} className="text-white"/>
              <span className="text-[11px] font-bold text-white">Admin</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 px-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)'}}>
            <community.Icon size={26} className="text-white"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-extrabold text-white leading-tight">{community.name}</p>
            <p className="text-[11px] text-white/60 mt-0.5">{community.members} anggota</p>
            <p className="text-[11px] text-white/70 mt-1.5 leading-snug line-clamp-2">{community.desc}</p>
          </div>
        </div>
        <div className="flex gap-2 px-4 mb-4">
          {isAdmin ? (
            <button onClick={()=>setCreate(true)}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5"
              style={{background:'rgba(255,255,255,0.9)',color:community.g[1]}}>
              <Plus size={13}/> Buat Post / Pengumuman
            </button>
          ) : (
            <button onClick={handleJoin}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition"
              style={joined
                ?{background:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.7)'}
                :{background:'#fff',color:community.g[1]}}>
              {joined?'✓ Bergabung':'Gabung'}
            </button>
          )}
        </div>
        <div className="flex border-t" style={{borderColor:'rgba(255,255,255,0.15)'}}>
          {[['thread','Thread'],['tentang','Tentang'],['rules','Rules']].map(([id,label])=>(
            <button key={id} onClick={()=>setInnerTab(id)}
              className="flex-1 py-2.5 text-[11px] font-bold transition"
              style={innerTab===id?{color:'white',borderBottom:'2.5px solid white'}:{color:'rgba(255,255,255,0.4)',borderBottom:'2.5px solid transparent'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20" style={{background:'#FAFBF9'}}>
        {/* Thread tab */}
        {innerTab==='thread' && (
          <>
            {!isAdmin && joined && (
              <div className="px-4 pt-4 pb-2">
                <button onClick={()=>setCreate(true)}
                  className="w-full py-3 rounded-2xl text-[12px] font-bold text-white flex items-center justify-center gap-2"
                  style={{background:`linear-gradient(135deg,${community.g[0]},${community.g[1]})`,boxShadow:`0 4px 12px ${community.g[1]}40`}}>
                  <Plus size={15}/> Buat Thread Baru
                </button>
              </div>
            )}
            <div className="flex flex-col pt-2 px-4 gap-3">
              {sorted.map((t,i)=>{
                if (t.type==='jual_beli') return (
                  <div key={t.id} className="bg-white rounded-[20px] overflow-hidden" style={{boxShadow: S.card}}>
                    <JualBeliCard thread={t} onTap={()=>setThread(t)} navigate={navigate}/>
                  </div>
                )
                return (
                  <PostCard 
                    key={t.id} 
                    thread={t} 
                    community={community} 
                    isAdmin={isAdmin} 
                    onTap={setThread} 
                    onTogglePin={togglePin} 
                    onDelete={deleteThread} 
                  />
                )
              })}
            </div>
          </>
        )}

        {/* Tentang */}
        {innerTab==='tentang' && (
          <div className="px-4 pt-4">
            {/* Deskripsi */}
            <div className="bg-white rounded-2xl p-4 mb-3 spotlight-border" style={{boxShadow:S.card}}>
              <p className="text-[13px] font-bold text-gray-900 mb-2">Tentang Komunitas</p>
              <p className="text-[12.5px] text-gray-600 leading-relaxed">{community.desc}</p>
            </div>

            {/* Statistik */}
            <div className="bg-white rounded-2xl p-4 mb-3 spotlight-border" style={{boxShadow:S.card}}>
              <p className="text-[13px] font-bold text-gray-900 mb-3">Statistik</p>
              {[['Anggota',community.members],['Thread',`${threads.length} thread`]].map(([l,v])=>(
                <div key={l} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-[12px] text-gray-400">{l}</span>
                  <span className="text-[12px] font-semibold text-gray-700">{v}</span>
                </div>
              ))}
            </div>

            {/* Anggota & Role */}
            <div className="bg-white rounded-2xl p-4 mb-4" style={{boxShadow:S.card}}>
              <p className="text-[13px] font-bold text-gray-900 mb-3">Anggota & Role</p>
              {[
                { role:'Owner',       avIcon:UserCheck,   name:'Wawan Setiawan',   badge:'Owner',       badgeBg:'#EDE7F6', badgeColor:'#6A1B9A', desc:'Pemilik & pengelola komunitas' },
                { role:'Admin',       avIcon:UserCheck,   name:'Wawan Setiawan',   badge:'Admin',       badgeBg:`${ADMIN_COLOR}12`, badgeColor:ADMIN_COLOR, desc:'Moderasi thread & pengumuman' },
                { role:'Observer AI', avIcon:Bot,  name:'GV Observer',      badge:'AI',          badgeBg:'#E3F2FD', badgeColor:'#1565C0', desc:'Pemantau otomatis konten komunitas' },
                { role:'Member',      avIcon:Users,  name:community.members,  badge:'Member',      badgeBg:'#E8F5E9', badgeColor:PRIMARY,    desc:'Anggota aktif komunitas' },
              ].map((r,i)=>(
<div key={r.role} className={`flex items-center gap-3 py-3 ${i<3?'border-b border-gray-50':''}`}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-inner flex-shrink-0"
                    style={{background:'#E8F5E9'}}>
                    <r.avIcon size={16} className="text-gray-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-bold text-gray-900">{r.name}</p>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{background:r.badgeBg,color:r.badgeColor}}>{r.badge}</span>
                    </div>
                    <p className="text-[12px] text-gray-400 mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rules */}
        {innerTab==='rules' && (
          <EditableRules community={community} isAdmin={isAdmin}/>
        )}
      </div>
    </div>
  )
}

// ── Post Tab ───────────────────────────────────────────────
function PostTab({ joined, onOpenCommunity }) {
  const joinedComms = ALL_COMMUNITIES.filter(c => joined.includes(c.id))
  const recentThreads = joinedComms.flatMap(c =>
    (THREADS_INIT[c.id] || []).map(t => ({...t, community: c}))
  ).slice(0, 15)

  if (recentThreads.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center pb-20 px-8 text-center">
      <p className="text-4xl mb-4">🌱</p>
      <p className="text-[15px] font-bold text-gray-900 mb-2">Belum ada post</p>
      <p className="text-[12px] text-gray-400 leading-relaxed">Jelajahi komunitas dan bergabung untuk mulai berdiskusi.</p>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20" style={{background:'#FAFBF9'}}>
      <div className="px-4 pt-4 pb-4 flex flex-col gap-2.5">
        {recentThreads.map(t => (
          <PostCard 
            key={t.id}
            thread={t} 
            community={t.community} 
            isAdmin={false} 
            onTap={(thread, comm) => onOpenCommunity(comm, thread)} 
          />
        ))}
      </div>
    </div>
  )
}

// ── Komunitasku Tab ────────────────────────────────────────
function KomunitaskuTab({ joined, managedIds, onOpenCommunity, onToggleJoin }) {
  const joinedComms = ALL_COMMUNITIES.filter(c => joined.includes(c.id))

  if (joinedComms.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center pb-20 px-8 text-center">
      <p className="text-4xl mb-4">🌱</p>
      <p className="text-[15px] font-bold text-gray-900 mb-2">Belum ikut komunitas</p>
      <p className="text-[12px] text-gray-400 leading-relaxed">Jelajahi komunitas dan bergabung untuk mulai berdiskusi.</p>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20" style={{background:'#FAFBF9'}}>
      <div className="px-4 pt-4 pb-4 flex flex-col gap-2.5">
        {/* Admin komunitas section */}
        {managedIds.length > 0 && (
          <>
            <p className="text-[11px] font-bold mb-0.5 mt-1" style={{color:ADMIN_COLOR}}>Komunitas yang Kamu Kelola</p>
            {ALL_COMMUNITIES.filter(c => managedIds.includes(c.id)).map(k => (
              <button key={k.id} onClick={() => onOpenCommunity(k)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left spotlight-border active:scale-[0.96] transition-transform"
                style={{background:`${ADMIN_COLOR}08`, border:`1.5px solid ${ADMIN_COLOR}20`, boxShadow:S.card}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{background:`linear-gradient(135deg,${k.g[0]},${k.g[1]})`}}>
                  <k.Icon size={20} className="text-white"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-gray-900 mb-0.5">{k.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{background:`${ADMIN_COLOR}15`, color:ADMIN_COLOR}}>Admin</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug line-clamp-1"><span className="tabular-nums">{k.members}</span> anggota</p>
                </div>
                <ChevronRight size={14} className="text-gray-300 flex-shrink-0"/>
              </button>
            ))}
          </>
        )}

        {/* Komunitas yang diikuti (vertical list) */}
        {joinedComms.filter(c => !managedIds.includes(c.id)).length > 0 && (
          <>
            <p className="text-[11px] font-bold text-gray-400 mb-0.5 mt-2">Komunitas Diikuti</p>
            {joinedComms.filter(c => !managedIds.includes(c.id)).map(k => (
              <div key={k.id} className="bg-white rounded-2xl overflow-hidden spotlight-border" style={{boxShadow:S.card}}>
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={() => onOpenCommunity(k)}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{background:`linear-gradient(135deg,${k.g[0]},${k.g[1]})`}}>
                    <k.Icon size={20} className="text-white"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 mb-0.5">{k.name}</p>
                    <p className="text-[12px] text-gray-500 leading-snug line-clamp-1">{k.desc}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5"><span className="tabular-nums">{k.members}</span> anggota</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); onToggleJoin(k.id, false) }}
                    className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex-shrink-0 transition active:scale-[0.96]"
                    style={{background:'#FEF2F2', color:'#EF4444'}}>
                    Keluar
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ── Jelajahi Tab ───────────────────────────────────────────
function JelajahiTab({ joined, onOpenCommunity, onToggleJoin }) {
  const [search, setSearch] = useState('')

  // Filter out joined communities so Jelajahi only shows communities they have not yet joined
  const available = ALL_COMMUNITIES.filter(c => !joined.includes(c.id))
  const filtered = available.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-20" style={{background:'#FAFBF9'}}>
      <div className="flex flex-col px-4 gap-2.5 pt-4 pb-4">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[13px] text-gray-400">Semua komunitas sudah kamu ikuti!</p>
          </div>
        ) : (
          filtered.map(k => (
            <div key={k.id} className="bg-white rounded-2xl overflow-hidden spotlight-border" style={{boxShadow:S.card}}>
              <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={() => onOpenCommunity(k)}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{background:`linear-gradient(135deg,${k.g[0]},${k.g[1]})`}}>
                  <k.Icon size={20} className="text-white"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-gray-900 mb-0.5">{k.name}</p>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-snug line-clamp-1">{k.desc}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5"><span className="tabular-nums">{k.members}</span> anggota</p>
                </div>
                <button onClick={e => { e.stopPropagation(); onToggleJoin(k.id, true) }}
                  className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex-shrink-0 transition active:scale-[0.96]"
                  style={{background:PRIMARY, color:'#fff', boxShadow:`0 2px 6px ${PRIMARY}30`}}>
                  Gabung
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Search Screen ───────────────────────────────────────────
function SearchScreen({ onClose, navigate }) {
  const [q, setQ] = useState('')
  const RECENTS = ['Komunitas Tani', 'Diskusi Warga', 'Laporan Keamanan']
  const POPULAR = ['Pasar Desa', 'Bantuan Sosial', 'Tips Bertani']
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
              <input value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="Cari komunitas atau diskusi..."
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
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3 mt-5" style={{color:'#9CA39A'}}>Populer</p>
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
            <div className="flex flex-col items-center justify-center pt-16 px-8">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-[14px] font-bold text-gray-900 mb-1">Hasil untuk "{q}"</p>
              <p className="text-[11px] text-gray-400 text-center">Fitur pencarian penuh sedang dalam pengembangan.</p>
            </div>
          </div>
        )}
      </div>
      <BottomNav active="komunitas" navigate={navigate}/>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────
export default function Komunitas({ navigate, userProfile, initialCommunityId }) {
  const isAdminPersona  = userProfile?.capabilities?.includes('Admin Komunitas') ?? false
  const isPenjual       = userProfile?.capabilities?.includes('Penjual') ?? false
  const estoProducts    = ESTO_PRODUCTS[userProfile?.id] || []
  const managedIds      = userProfile?.managedCommunityIds ?? []

  const [tab, setTab]           = useState('post')
  const [joined, setJoined]     = useState(
    isAdminPersona ? [...new Set([...JOINED_IDS_INIT,...managedIds])] :
    isPenjual      ? [...new Set([...JOINED_IDS_INIT, 7])] :
    JOINED_IDS_INIT
  )
  const [allCommunities, setAllCommunities] = useState(ALL_COMMUNITIES)
  const [selectedCommunity, setCommunity]   = useState(initialCommunityId ? (ALL_COMMUNITIES.find(c=>c.id===initialCommunityId)||null) : null)
  const [openThread, setOpenThread]         = useState(null)
  const [showCreateComm, setCreateComm]     = useState(false)
  const [showSearch, setShowSearch]         = useState(false)

  const handleOpenCommunity = (community, thread=null) => { setCommunity(community); setOpenThread(thread) }
  const handleToggleJoin    = (id, joining) => setJoined(p=>joining?[...p,id]:p.filter(x=>x!==id))
  const handleNewCommunity  = (newComm) => {
    setAllCommunities(p=>[...p,newComm])
    setJoined(p=>[...p,newComm.id])
  }

  if (showCreateComm) return (
    <div className="flex flex-col h-full relative">
      <CreateCommunityPage onClose={()=>setCreateComm(false)} onCreated={handleNewCommunity}/>
      <BottomNav active="komunitas" navigate={navigate}/>
    </div>
  )

  if (selectedCommunity) {
    const isAdminOfThis = managedIds.includes(selectedCommunity.id)
    return (
      <div className="flex flex-col h-full">
        <CommunityPage
          community={selectedCommunity}
          isJoined={joined.includes(selectedCommunity.id)}
          isAdmin={managedIds.includes(selectedCommunity.id)}
          isPenjual={isPenjual}
          estoProducts={estoProducts}
          navigate={navigate}
          onBack={()=>{ setCommunity(null); setOpenThread(null) }}
          onToggleJoin={handleToggleJoin}/>
        <BottomNav active="komunitas" navigate={navigate}/>
      </div>
    )
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* Unified ScreenHeader */}
      <ScreenHeader
        title="Komunitas"
        actions={
          <button
            type="button"
            onClick={() => setCreateComm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95 shadow-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Plus size={13} className="text-white/90" />
            <span className="text-white font-bold text-[11.5px]">Buat Komunitas</span>
          </button>
        }
      >
        <SearchBar
          readOnly
          variant="glass-dark"
          placeholder="Cari komunitas atau diskusi..."
          onClick={() => setShowSearch(true)}
        />
        <NavTabs
          variant="underline-dark"
          tabs={[
            { id: 'post', label: 'Post' },
            { id: 'mine', label: 'Komunitasku' },
            { id: 'explore', label: 'Jelajahi' },
          ]}
          activeTab={tab}
          onChange={setTab}
        />
      </ScreenHeader>

      {tab==='post' && <PostTab joined={joined} onOpenCommunity={handleOpenCommunity}/>}
      {tab==='mine' && <KomunitaskuTab joined={joined} managedIds={managedIds} onOpenCommunity={handleOpenCommunity} onToggleJoin={handleToggleJoin}/>}
      {tab==='explore' && <JelajahiTab joined={joined} onOpenCommunity={handleOpenCommunity} onToggleJoin={handleToggleJoin}/>}
      {showSearch && <SearchScreen onClose={()=>setShowSearch(false)} navigate={navigate}/>}
      <BottomNav active="komunitas" navigate={navigate}/>
    </ScreenBackground>
  )
}

