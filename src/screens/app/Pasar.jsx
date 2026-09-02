import React, { useState, useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, ShoppingCart, Heart, Star, ChevronRight,
  Store, ArrowLeft, Minus, Plus, MapPin, CreditCard, Check, Package, Pencil,
  Sparkles, X, Tag, Truck, Clock, ChevronDown, Phone, MessageCircle, Navigation,
  CircleDot, Leaf, Coffee, Droplet, Palette, Wheat, Egg, Landmark, Wallet, Box, Scale, ScanLine
} from 'lucide-react'
import BottomNav from '../../components/BottomNav'

const PRIMARY = '#1B6B3A'

// ── Data ──────────────────────────────────────────────────
const CATS = ['Semua','Sayur','Buah','Pangan','Camilan','Minuman','Kerajinan','Lainnya']

const PRODUCTS = [
  { id:1,  name:'Tempe Mendoan Jumbo',   cat:'Pangan',    seller:'Pak Budi',    price:12000, orig:null,   unit:'5 pcs',    stock:24, rating:4.9, sold:'120+', Icon: CircleDot, g: ['#E65100', '#F57C00'], image: 'https://images.unsplash.com/photo-1626082895617-2c6fd34adcfb?q=80&w=600&auto=format&fit=crop', desc:'Tempe mendoan ukuran jumbo, dibuat segar setiap hari dari kedelai lokal pilihan. Cocok untuk lauk atau camilan.' },
  { id:2,  name:'Bayam Organik Segar',   cat:'Sayur',     seller:'Ibu Sari',    price:8500,  orig:null,   unit:'250 gr',   stock:40, rating:4.8, sold:'200+', Icon: Leaf, g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop', desc:'Bayam organik ditanam tanpa pestisida. Dipanen pagi hari, sampai ke tangan kamu masih segar.' },
  { id:3,  name:'Kopi Robusta Segar',    cat:'Minuman',   seller:'Pak Asep',    price:35000, orig:42000,  unit:'250 gr',   stock:15, rating:4.7, sold:'85+',  Icon: Coffee, g: ['#4E342E', '#6D4C41'], image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop', desc:'Kopi robusta dari perkebunan gunung Bogor, disangrai manual. Aroma kuat dengan rasa pahit yang seimbang.' },
  { id:4,  name:'Madu Hutan Murni',      cat:'Lainnya',   seller:'Pak Joko',    price:65000, orig:null,   unit:'250 ml',   stock:8,  rating:4.9, sold:'50+',  Icon: Droplet, g: ['#F57F17', '#FFCA28'], image: 'https://images.unsplash.com/photo-1587049352847-4d4b124054da?q=80&w=600&auto=format&fit=crop', desc:'Madu hutan asli dari lebah liar Kalimantan. Tanpa campuran, sudah diuji di laboratorium pertanian.' },
  { id:5,  name:'Batik Tulis Lokal',     cat:'Kerajinan', seller:'Bu Erna',     price:85000, orig:null,   unit:'1 lembar', stock:6,  rating:4.6, sold:'30+',  Icon: Palette, g: ['#4A148C', '#AB47BC'], image: 'https://images.unsplash.com/photo-1580661869408-55ab23f2ca6e?q=80&w=600&auto=format&fit=crop', desc:'Batik tulis tangan motif parang khas Jawa Barat. Dikerjakan oleh pengrajin lokal berpengalaman 20 tahun.' },
  { id:6,  name:'Pisang Kepok Matang',   cat:'Buah',      seller:'Pak Anto',    price:18000, orig:null,   unit:'1 sisir',  stock:20, rating:4.5, sold:'160+', Icon: Leaf, g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=600&auto=format&fit=crop', desc:'Pisang kepok matang pohon dari kebun sendiri. Manis dan cocok untuk digoreng atau dikonsumsi langsung.' },
  { id:7,  name:'Keripik Singkong Pedas',cat:'Camilan',   seller:'Bu Dewi',     price:15000, orig:18000,  unit:'200 gr',   stock:30, rating:4.7, sold:'140+', Icon: CircleDot, g: ['#E65100', '#F57C00'], image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600&auto=format&fit=crop', desc:'Keripik singkong renyah dengan bumbu pedas level 3. Produksi UMKM desa, tanpa pengawet.' },
  { id:8,  name:'Beras Pandan Wangi',    cat:'Pangan',    seller:'Ibu Sari',    price:65000, orig:null,   unit:'5 kg',     stock:12, rating:4.9, sold:'75+',  Icon: Wheat, g: ['#827717', '#9E9D24'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop', desc:'Beras pandan wangi premium dari sawah organik desa Sukamakmur. Aroma harum dan pulen saat dimasak.' },
  { id:9,  name:'Telur Ayam Kampung',    cat:'Pangan',    seller:'Pak Rohmat',  price:32000, orig:null,   unit:'12 butir', stock:35, rating:4.8, sold:'220+', Icon: Egg, g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop', desc:'Telur ayam kampung asli, ayam dibesarkan bebas di halaman. Kuning telur lebih kuning dan bergizi tinggi.' },
  { id:10, name:'Jeruk Siam Manis',      cat:'Buah',      seller:'Pak Anto',    price:22000, orig:null,   unit:'1 kg',     stock:0,  rating:4.6, sold:'90+',  Icon: CircleDot, g: ['#EF6C00', '#FF9800'], image: 'https://images.unsplash.com/photo-1550258859-d088c27e49c1?q=80&w=600&auto=format&fit=crop', desc:'Jeruk siam manis dari kebun sendiri di Bogor. Segar, tanpa pestisida, langsung dari pohon.' },
]

const SELLER_PRODUCTS_INIT = [
  { id:101, name:'Beras Pandan Wangi Premium 5kg', price:65000, unit:'5 kg',    stock:48, active:true,  Icon: Wheat, g: ['#827717', '#9E9D24'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop', cat:'Pangan',   desc:'Beras pandan wangi premium organik' },
  { id:102, name:'Sayur Bayam Organik Segar 250g', price:5000,  unit:'250 gr',  stock:120,active:true,  Icon: Leaf, g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600&auto=format&fit=crop', cat:'Sayur',    desc:'Bayam organik segar tanpa pestisida' },
  { id:103, name:'Telur Ayam Kampung (12 butir)',  price:32000, unit:'12 butir',stock:30, active:true,  Icon: Egg, g: ['#F57F17', '#FBC02D'], image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop', cat:'Pangan',   desc:'Telur ayam kampung asli dari peternakan' },
  { id:104, name:'Pupuk Organik Kompos 25kg',      price:45000, unit:'25 kg',   stock:2,  active:true,  Icon: Leaf, g: ['#2E7D32', '#4CAF50'], image: 'https://images.unsplash.com/photo-1627341398565-d0c75cc9e5f5?q=80&w=600&auto=format&fit=crop', cat:'Lainnya',  desc:'Pupuk organik kompos untuk pertanian' },
  { id:105, name:'Bibit Cabai Rawit Lokal',        price:15000, unit:'50 biji', stock:0,  active:false, Icon: Leaf, g: ['#C62828', '#EF5350'], image: 'https://images.unsplash.com/photo-1588147602377-5b6515a452db?q=80&w=600&auto=format&fit=crop', cat:'Lainnya',  desc:'Bibit cabai rawit lokal unggul tahan hama' },
]

const BANNERS_ESTO = [
  { id:1, title:'Gratis ongkir via GV Man',    sub:'Minimum pembelian Rp 50.000',  tag:'Promo', g:['#0C3E1E','#2E7D32'], Icon: Truck },
  { id:2, title:'Cashback 10% produk organik', sub:'Berlaku s/d 31 Agustus 2026',  tag:'Promo', g:['#BF360C','#E53935'], Icon: Leaf },
  { id:3, title:'Produk baru minggu ini',       sub:'Kerajinan & kuliner lokal baru',tag:'Baru',  g:['#0D47A1','#1976D2'], Icon: Sparkles },
]

const SORT_OPTIONS = [
  { id:'terlaris',   label:'Terlaris' },
  { id:'harga_asc',  label:'Harga: Terendah' },
  { id:'harga_desc', label:'Harga: Tertinggi' },
  { id:'rating',     label:'Rating Tertinggi' },
]

// ── Address Management Modals ──────────────────────────────
function AddressListModal({ addresses, selectedId, onSelect, onAdd, onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-t-3xl flex flex-col animate-slide-up bg-white h-[85vh]">
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{background:'#D4D8D0'}} />
        </div>
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{borderBottom:'1px solid #E8EBE5'}}>
          <p className="text-[16px] font-extrabold headline-tight" style={{color:'#0F1A13'}}>Daftar Alamat</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-[0.96] transition-transform" style={{background:'#F3F5F1'}}>
            <X size={14} style={{color:'#6B7269'}}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative pb-24">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <MapPin size={24} className="text-gray-400" />
              </div>
              <p className="text-[14px] font-bold text-gray-700">Belum ada alamat</p>
              <p className="text-[12px] text-gray-500 mt-1 max-w-[200px]">Kamu belum menyimpan alamat pengiriman apapun.</p>
            </div>
          ) : (
            addresses.map(addr => (
              <button key={addr.id} onClick={() => onSelect(addr.id)}
                className="flex gap-3 items-start p-4 rounded-2xl text-left transition"
                style={{
                  border: selectedId === addr.id ? `2px solid #1B6B3A` : '2px solid #F0F0F0',
                  background: selectedId === addr.id ? `#1B6B3A08` : '#FAFAFA'
                }}>
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{borderColor: selectedId === addr.id ? '#1B6B3A' : '#D1D5DB'}}>
                    {selectedId === addr.id && <div className="w-2 h-2 rounded-full" style={{background:'#1B6B3A'}}/>}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                    {addr.label}
                    {selectedId === addr.id && <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-bold">UTAMA</span>}
                  </p>
                  <p className="text-[13px] font-semibold text-gray-800 mt-1">{addr.name}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{addr.address}</p>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                    <Phone size={10}/> {addr.phone}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md" style={{borderTop:'1px solid #E8EBE5'}}>
          <button onClick={onAdd}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white flex items-center justify-center gap-2 active:scale-[0.96] transition-transform"
            style={{background:`linear-gradient(135deg, #1B6B3A, #15803d)`, boxShadow:'0 4px 16px rgba(27,107,58,0.25)'}}>
            <Plus size={16}/> Tambah Alamat Baru
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressFormModal({ draft, setDraft, onBack, onSave, onOpenMap }) {
  const isComplete = draft.label && draft.name && draft.phone && draft.address
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative rounded-t-3xl flex flex-col animate-slide-up bg-white h-[90vh]">
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{borderBottom:'1px solid #E8EBE5'}}>
          <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 active:scale-[0.96] transition-transform">
            <ArrowLeft size={16} className="text-gray-700"/>
          </button>
          <p className="text-[16px] font-extrabold headline-tight" style={{color:'#0F1A13'}}>Tambah Alamat</p>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 pb-24 no-scrollbar">
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Detail Lokasi</p>
            <button onClick={onOpenMap} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-200 active:scale-[0.96] transition-transform bg-gray-50">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <div className="text-left min-w-0 flex-1 pr-2">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{draft.locationLabel || 'Pilih Lokasi di Peta'}</p>
                  {draft.locationLabel && <p className="text-[11px] text-gray-500 mt-0.5">Sudah dipin</p>}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
            </button>
            <textarea placeholder="Alamat lengkap (Nama jalan, RT/RW, Patokan)" value={draft.address||''} onChange={e=>setDraft({...draft, address:e.target.value})}
              className="w-full mt-3 p-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-green-600 bg-white min-h-[80px]" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Info Kontak Penerima</p>
            <input type="text" placeholder="Nama Penerima" value={draft.name||''} onChange={e=>setDraft({...draft, name:e.target.value})}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-green-600 bg-white mb-3" />
            <input type="tel" placeholder="Nomor Telepon" value={draft.phone||''} onChange={e=>setDraft({...draft, phone:e.target.value})}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-green-600 bg-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Label Alamat</p>
            <div className="flex gap-2">
              {['Rumah', 'Kantor', 'Lainnya'].map(lbl => (
                <button key={lbl} onClick={()=>setDraft({...draft, label:lbl})}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-colors ${draft.label===lbl ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-transparent'} border`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-md" style={{borderTop:'1px solid #E8EBE5'}}>
          <button onClick={onSave} disabled={!isComplete}
            className={`w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition-all ${isComplete ? 'active:scale-[0.96] opacity-100' : 'opacity-50'}`}
            style={{background:`linear-gradient(135deg, #1B6B3A, #15803d)`, boxShadow: isComplete ? '0 4px 16px rgba(27,107,58,0.25)' : 'none'}}>
            Simpan Alamat
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressMapModal({ onBack, onConfirm }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-gray-100 animate-slide-up">
      <div className="absolute top-4 left-4 z-10 flex gap-2 w-full pr-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0 active:scale-[0.96] transition-transform">
          <ArrowLeft size={18} className="text-gray-800" />
        </button>
        <div className="flex-1 bg-white shadow-md rounded-2xl px-4 py-2 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Cari alamat..." className="flex-1 text-[13px] outline-none" />
        </div>
      </div>
      
      {/* Map Graphic Mock */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-80" style={{filter:'grayscale(0.3)'}} />
        <div className="absolute inset-0 bg-green-900/10 pointer-events-none" />
        
        {/* Pin */}
        <div className="relative z-10 flex flex-col items-center pb-10">
          <div className="bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg mb-2 shadow-lg whitespace-nowrap">
            Geser peta untuk menyesuaikan
          </div>
          <div className="w-12 h-12 flex items-center justify-center drop-shadow-xl" style={{color:'#1B6B3A'}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="white" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <p className="text-[14px] font-bold text-gray-900 mb-1">Jl. Raya Desa Nagrak RT 03/02</p>
        <p className="text-[12px] text-gray-500 mb-4 line-clamp-1">Kec. Sukamakmur, Bogor, Jawa Barat 16830</p>
        <button onClick={() => onConfirm('Jl. Raya Desa Nagrak RT 03/02, Kec. Sukamakmur, Bogor, Jawa Barat 16830')}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white active:scale-[0.96] transition-transform"
          style={{background:`linear-gradient(135deg, #1B6B3A, #15803d)`}}>
          Konfirmasi Lokasi
        </button>
      </div>
    </div>
  )
}

// ── Checkout Screen ────────────────────────────────────────
function CheckoutScreen({ items, onBack, onConfirm }) {
  const [delivery,   setDelivery]  = useState('gvman')
  const [payment,    setPayment]   = useState('gvpay')
  const subtotal = items.reduce((s,i)=>s+i.price*i.qty, 0)
  const ongkir   = delivery==='gvman' ? 8000 : 0
  const total    = subtotal + ongkir

  // Address state
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  
  // UI states for flow
  const [addressModalView, setAddressModalView] = useState(null) // 'list', 'form', 'map'
  const [newAddressDraft, setNewAddressDraft] = useState({})

  const DELIVERY = [
    { id:'gvman',  label:'GV Man',        sub:'Antar ke rumah · Est. 30-45 mnt', Icon: Truck, g: ['#1B5E20', '#2E7D32'], price:8000 },
    { id:'pickup', label:'Ambil Sendiri', sub:'Langsung ke lokasi penjual',       Icon: Package, g: ['#0D47A1', '#1976D2'], price:0    },
  ]

  const PAYMENT = [
    { id:'gvpay',   label:'GV Pay',          sub:'Saldo GV Pay tersedia',             Icon: CreditCard, g: ['#1B5E20', '#2E7D32'] },
    { id:'qris',    label:'QRIS',             sub:'Scan kode QR saat konfirmasi',      Icon: ScanLine, g: ['#000000', '#424242'] },
    { id:'transfer',label:'Transfer Bank',    sub:'BRI · BCA · Mandiri · BNI',         Icon: Landmark, g: ['#0D47A1', '#1976D2'] },
    { id:'cod',     label:'Bayar di Tempat',  sub:'Bayar tunai saat pesanan tiba',     Icon: Wallet, g: ['#E65100', '#F57C00'] },
  ]

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-bold text-gray-900">Keranjang</p>
        <span className="text-gray-400 text-sm">({items.length} produk)</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          {selectedAddressId ? (() => {
            const addr = addresses.find(a => a.id === selectedAddressId)
            return (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-gray-400">Alamat Pengiriman</p>
                  <button onClick={()=>setAddressModalView('list')} className="text-[11px] font-bold active:scale-95 transition" style={{color:PRIMARY}}>Ubah</button>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-inner" style={{background:`linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)`}}>
                    <MapPin size={18} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 leading-snug">{addr.label} - {addr.name}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{addr.address}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                      <Phone size={12}/> {addr.phone}
                    </p>
                  </div>
                </div>
              </>
            )
          })() : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-gray-400">Alamat Pengiriman</p>
              </div>
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                  <MapPin size={20} className="text-gray-300" />
                </div>
                <p className="text-[13px] font-bold text-gray-900 mb-1">Belum ada alamat</p>
                <p className="text-[11px] text-gray-500 mb-4 max-w-[200px] leading-relaxed">Kamu belum menyimpan alamat pengiriman apapun.</p>
                <button onClick={()=>{ setAddressModalView('form'); setNewAddressDraft({}) }} 
                  className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition active:scale-[0.96]"
                  style={{background:PRIMARY}}>
                  Tambah Alamat Baru
                </button>
              </div>
            </>
          )}
        </div>

        {/* Item list */}
        <div className="bg-white rounded-2xl" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 px-4 pt-3 pb-2">Pesanan</p>
          {items.map((item,i)=>(
            <div key={item.id}
              className="flex items-center gap-3 px-4 py-3"
              style={i<items.length-1?{borderBottom:'1px solid #F9FAFB'}:{}}>
              {/* Product image/icon */}
              <div className="w-12 h-12 rounded-[14px] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-inner relative"
                style={{background:item.image?'transparent':`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`}}>
                {item.image
                  ? <img src={item.image} alt="" className="w-full h-full object-cover border border-black/10"/>
                  : <item.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 leading-snug">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
              </div>
              <p className="text-[13px] font-bold flex-shrink-0" style={{color:PRIMARY}}>
                Rp {(item.price*item.qty).toLocaleString('id')}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Pengiriman</p>
          <div className="flex flex-col gap-2">
            {DELIVERY.map(d=>(
              <button key={d.id} onClick={()=>setDelivery(d.id)}
                className="flex items-center gap-3 p-3 rounded-2xl text-left transition"
                style={delivery===d.id?{border:`2px solid ${PRIMARY}`,background:`${PRIMARY}06`}:{border:'2px solid #F0F0F0',background:'#FAFAFA'}}>
                <div className="w-10 h-10 flex-shrink-0 rounded-[12px] flex items-center justify-center shadow-inner" style={{background:`linear-gradient(135deg, ${d.g[0]} 0%, ${d.g[1]} 100%)`}}>
                  <d.Icon size={18} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900">{d.label}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{d.sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {d.price===0
                    ? <p className="text-[11px] font-bold" style={{color:PRIMARY}}>Gratis</p>
                    : <p className="text-[11px] font-bold text-gray-700">Rp {d.price.toLocaleString('id')}</p>}
                </div>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={delivery===d.id?{borderColor:PRIMARY}:{borderColor:'#D1D5DB'}}>
                  {delivery===d.id && <div className="w-2 h-2 rounded-full" style={{background:PRIMARY}}/>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Pembayaran</p>
          <div className="flex flex-col gap-2">
            {PAYMENT.map(p=>(
              <button key={p.id} onClick={()=>setPayment(p.id)}
                className="flex items-center gap-3 p-3 rounded-2xl text-left transition"
                style={payment===p.id?{border:`2px solid ${PRIMARY}`,background:`${PRIMARY}06`}:{border:'2px solid #F0F0F0',background:'#FAFAFA'}}>
                <div className="w-10 h-10 flex-shrink-0 rounded-[12px] flex items-center justify-center shadow-inner" style={{background:`linear-gradient(135deg, ${p.g[0]} 0%, ${p.g[1]} 100%)`}}>
                  <p.Icon size={18} className="text-white drop-shadow-sm" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900">{p.label}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{p.sub}</p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={payment===p.id?{borderColor:PRIMARY}:{borderColor:'#D1D5DB'}}>
                  {payment===p.id && <div className="w-2 h-2 rounded-full" style={{background:PRIMARY}}/>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Ringkasan Biaya</p>
          {[['Subtotal',`Rp ${subtotal.toLocaleString('id')}`],
            ['Ongkir', ongkir===0?'Gratis':`Rp ${ongkir.toLocaleString('id')}`]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-1.5">
              <span className="text-[12px] text-gray-500">{l}</span>
              <span className="text-[12px] text-gray-700">{v}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2.5 mt-1 border-t border-gray-100">
            <span className="text-[13px] font-bold text-gray-900">Total</span>
            <span className="text-[15px] font-extrabold tabular-nums" style={{color:PRIMARY}}>Rp {total.toLocaleString('id')}</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
        <button onClick={()=>onConfirm(payment)}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
          style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',boxShadow:`0 4px 12px ${PRIMARY}40`}}>
          Konfirmasi Pesanan · Rp {total.toLocaleString('id')}
        </button>
      </div>

      {addressModalView === 'list' && (
        <AddressListModal 
          addresses={addresses} 
          selectedId={selectedAddressId}
          onSelect={(id) => { setSelectedAddressId(id); setAddressModalView(null) }}
          onAdd={() => { setNewAddressDraft({}); setAddressModalView('form') }}
          onClose={() => setAddressModalView(null)}
        />
      )}
      {addressModalView === 'form' && (
        <AddressFormModal 
          draft={newAddressDraft} 
          setDraft={setNewAddressDraft}
          onBack={() => setAddressModalView(addresses.length > 0 ? 'list' : null)}
          onOpenMap={() => setAddressModalView('map')}
          onSave={() => {
            const newAddr = { ...newAddressDraft, id: Date.now() }
            setAddresses([...addresses, newAddr])
            setSelectedAddressId(newAddr.id)
            setAddressModalView(null)
          }}
        />
      )}
      {addressModalView === 'map' && (
        <AddressMapModal 
          onBack={() => setAddressModalView('form')}
          onConfirm={(locationLabel) => {
            setNewAddressDraft({ ...newAddressDraft, locationLabel })
            setAddressModalView('form')
          }}
        />
      )}
    </div>
  )
}

// ── Payment Flow ───────────────────────────────────────────
function PaymentFlow({ method, total, onComplete, onBack }) {
  const [step,      setStep]    = useState('main') // main | processing | done
  const [pin,       setPin]     = useState('')
  const [bank,      setBank]    = useState('bri')
  const [timer,     setTimer]   = useState(900) // 15 min QRIS
  const [verified,  setVerified]= useState(false)

  React.useEffect(()=>{
    if (method==='qris' && step==='main') {
      const t = setInterval(()=>setTimer(s=>s>0?s-1:0),1000)
      return ()=>clearInterval(t)
    }
  },[method,step])

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const process = (delay=1800) => {
    setStep('processing')
    setTimeout(()=>{ setStep('done'); setTimeout(onComplete, 1200) }, delay)
  }

  const BANKS = [
    { id:'bri',     label:'BRI',     va:'0081 2345 6789 001', color:'#1565C0' },
    { id:'bca',     label:'BCA',     va:'8277 1234 5678 902', color:'#1976D2' },
    { id:'mandiri', label:'Mandiri', va:'8900 0012 3456 789', color:'#F57F17' },
    { id:'bni',     label:'BNI',     va:'8800 9900 1122 334', color:'#FF6F00' },
  ]
  const activeBank = BANKS.find(b=>b.id===bank)

  // Processing overlay
  if (step==='processing') return (
    <div className="flex flex-col h-full items-center justify-center bg-white">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 animate-pulse"
        style={{background:'#E8F5E9'}}>
        <span className="text-3xl">⏳</span>
      </div>
      <p className="text-[16px] font-extrabold text-gray-900 mb-1">Memproses pembayaran...</p>
      <p className="text-[12px] text-gray-400">Mohon tunggu sebentar</p>
    </div>
  )

  // Success overlay
  if (step==='done') return (
    <div className="flex flex-col h-full items-center justify-center bg-white">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{background:'#E8F5E9'}}>
        <Check size={36} style={{color:PRIMARY}}/>
      </div>
      <p className="text-[16px] font-extrabold text-gray-900">Pembayaran Berhasil!</p>
    </div>
  )

  // ── GV Pay — PIN ──
  if (method==='gvpay') return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-bold text-gray-900">Masukkan PIN GV Pay</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{background:'#E8F5E9'}}>
          <span className="text-2xl">💳</span>
        </div>
        <p className="text-[13px] text-gray-400 mb-1">Total pembayaran</p>
        <p className="text-[28px] font-extrabold mb-8" style={{color:PRIMARY}}>
          Rp {total.toLocaleString('id')}
        </p>
        {/* PIN dots */}
        <div className="flex gap-4 mb-10">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="w-4 h-4 rounded-full"
              style={{background:i<pin.length?PRIMARY:'#E0E0E0'}}/>
          ))}
        </div>
        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((n,i)=>(
            <button key={i}
              onClick={()=>{
                if (n==='⌫') setPin(p=>p.slice(0,-1))
                else if (n==='' || pin.length>=6) return
                else { const np=pin+n; setPin(np); if(np.length===6) setTimeout(()=>process(),300) }
              }}
              className="h-14 rounded-2xl text-[18px] font-bold text-gray-900 transition active:scale-[0.96]"
              style={{background:n===''?'transparent':'#F5F5F5'}}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ── QRIS ──
  if (method==='qris') return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-bold text-gray-900">Bayar dengan QRIS</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-[13px] text-gray-400 mb-1">Total pembayaran</p>
        <p className="text-[26px] font-extrabold mb-5" style={{color:PRIMARY}}>
          Rp {total.toLocaleString('id')}
        </p>
        {/* QR mockup */}
        <div className="w-48 h-48 rounded-3xl p-4 mb-3"
          style={{background:'#fff',border:`3px solid ${PRIMARY}`,boxShadow:'0 4px 20px rgba(27,107,58,0.15)'}}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Corner squares */}
            {[[0,0],[70,0],[0,70]].map(([x,y],i)=>(
              <g key={i}>
                <rect x={x+2} y={y+2} width={26} height={26} rx={3} fill="none" stroke={PRIMARY} strokeWidth={3}/>
                <rect x={x+8} y={y+8} width={14} height={14} rx={1} fill={PRIMARY}/>
              </g>
            ))}
            {/* Data dots */}
            {Array.from({length:200}).map((_,i)=>{
              const r=Math.random(); const x=30+Math.random()*45; const y=30+Math.random()*45
              return r>0.45?<rect key={i} x={x} y={y} width={3} height={3} rx={0.5} fill={PRIMARY} opacity={0.8}/>:null
            })}
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{background:timer>60?'#4CAF50':'#F44336'}}/>
          <p className="text-[13px] font-bold" style={{color:timer>60?'#2E7D32':'#C62828'}}>
            Berlaku {fmt(timer)}
          </p>
        </div>
        <p className="text-[11px] text-gray-400 text-center mb-6 leading-relaxed">
          Scan QR ini menggunakan aplikasi bank atau e-wallet manapun yang mendukung QRIS
        </p>
        <button onClick={()=>process(1500)}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
          style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
          Simulasi Pembayaran Berhasil
        </button>
      </div>
    </div>
  )

  // ── Transfer Bank ──
  if (method==='transfer') return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-bold text-gray-900">Transfer Bank</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {/* Bank selector */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Pilih Bank</p>
          <div className="grid grid-cols-2 gap-2">
            {BANKS.map(b=>(
              <button key={b.id} onClick={()=>setBank(b.id)}
                className="py-3 rounded-2xl text-[13px] font-bold transition border-2"
                style={bank===b.id?{borderColor:PRIMARY,background:`${PRIMARY}08`,color:PRIMARY}:{borderColor:'#F0F0F0',background:'#FAFAFA',color:'#374151'}}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
        {/* VA details */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Detail Transfer</p>
          <div className="space-y-3">
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Bank Tujuan</p>
              <p className="text-[13px] font-bold" style={{color:activeBank.color}}>{activeBank.label}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Nomor Virtual Account</p>
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-extrabold text-gray-900 tracking-wider">{activeBank.va}</p>
                <button onClick={()=>{ navigator.clipboard?.writeText(activeBank.va); }}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{background:'#E8F5E9',color:PRIMARY}}>
                  Salin
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-100"/>
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-gray-500">Total Transfer</p>
              <p className="text-[15px] font-extrabold" style={{color:PRIMARY}}>Rp {total.toLocaleString('id')}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-gray-500">Batas Pembayaran</p>
              <p className="text-[12px] font-semibold text-orange-600">24 jam dari sekarang</p>
            </div>
          </div>
        </div>
        {/* Instructions */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Cara Transfer</p>
          {['Buka aplikasi m-banking atau ATM','Pilih Transfer → Virtual Account','Masukkan nomor VA di atas','Masukkan nominal sesuai tagihan','Konfirmasi dan simpan bukti transfer'].map((s,i)=>(
            <div key={i} className="flex items-start gap-3 mb-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{background:`${PRIMARY}15`}}>
                <span className="text-[12px] font-bold" style={{color:PRIMARY}}>{i+1}</span>
              </div>
              <p className="text-[12px] text-gray-600 leading-snug">{s}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
        {!verified ? (
          <button onClick={()=>{setVerified(true);process(2000)}}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
            style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
            Saya Sudah Transfer ✓
          </button>
        ) : (
          <button disabled className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
            style={{background:'#9CA3AF'}}>
            Memverifikasi...
          </button>
        )}
      </div>
    </div>
  )

  // ── COD ──
  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-bold text-gray-900">Bayar di Tempat</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{background:'#FFF8E1'}}>
          <span className="text-4xl">💵</span>
        </div>
        <p className="text-[18px] font-extrabold text-gray-900 mb-2 text-center">Bayar Saat Pesanan Tiba</p>
        <p className="text-[13px] text-gray-400 text-center leading-relaxed mb-6">
          Siapkan uang tunai sebesar
          <span className="font-extrabold text-gray-900"> Rp {total.toLocaleString('id')}</span>
          {' '}saat GV Man mengantarkan pesananmu.
        </p>
        <div className="w-full bg-amber-50 rounded-2xl p-4 mb-6 border border-amber-100">
          {[['🏍️','GV Man akan segera menjemput pesananmu'],['⏱️','Estimasi pengiriman 30-45 menit'],['💰','Bayar tunai ke GV Man saat barang diterima'],['🧾','Minta struk tanda terima dari GV Man']].map(([ic,t])=>(
            <div key={t} className="flex items-start gap-3 mb-2.5 last:mb-0">
              <span className="text-base flex-shrink-0">{ic}</span>
              <p className="text-[12px] text-amber-800 leading-snug">{t}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-4 pb-8 pt-3 border-t border-gray-100 bg-white">
        <button onClick={()=>process(800)}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
          style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
          Konfirmasi Pesanan COD
        </button>
      </div>
    </div>
  )
}


// ── Order Data ─────────────────────────────────────────────
const STATUS_CONFIG = {
  waiting:   { label:'Menunggu Konfirmasi', color:'#F57F17', bg:'#FFF8E1' },
  confirmed: { label:'Dikonfirmasi',        color:'#1565C0', bg:'#E3F2FD' },
  preparing: { label:'Sedang Disiapkan',    color:'#E65100', bg:'#FFF3E0' },
  shipped:   { label:'Dalam Perjalanan',    color:'#1B6B3A', bg:'#E8F5E9' },
  done:      { label:'Selesai',             color:'#388E3C', bg:'#F1F8E9' },
  cancelled: { label:'Dibatalkan',          color:'#C62828', bg:'#FFEBEE' },
}
const SELLER_ACTIONS = {
  waiting:   { label:'Konfirmasi Pesanan', next:'confirmed' },
  confirmed: { label:'Mulai Siapkan',      next:'preparing' },
  preparing: { label:'Tandai Dikirim',     next:'shipped'   },
  shipped:   null,
  done:      null,
}

const DUMMY_BUYER_ORDERS = [
  { id:'GV-20260801', date:'1 Agt 2026, 09:15', seller:'Ibu Sari', payment:'GV Pay',
    delivery:'Pengiriman', total:25000, status:'done',
    items:[{name:'Bayam Organik Segar',qty:2,price:8500,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Tempe Mendoan Jumbo',qty:1,price:12000,Icon:CircleDot,g:['#E65100','#F57C00']}],
    timeline:[
      {s:'waiting',   time:'09:15', label:'Pesanan dibuat'},
      {s:'confirmed', time:'09:18', label:'Penjual mengkonfirmasi'},
      {s:'preparing', time:'09:30', label:'Pesanan disiapkan'},
      {s:'shipped',   time:'09:55', label:'Dalam perjalanan'},
      {s:'done',      time:'10:28', label:'Pesanan selesai'},
    ]},
  { id:'GV-20260725', date:'25 Jul 2026, 14:30', seller:'Pak Asep', payment:'Transfer Bank',
    delivery:'Pengiriman', total:100000, status:'done',
    items:[{name:'Kopi Robusta Segar',qty:1,price:35000,Icon:Coffee,g:['#4E342E','#6D4C41']},{name:'Madu Hutan Murni',qty:1,price:65000,Icon:Droplet,g:['#F57F17','#FFCA28']}],
    timeline:[
      {s:'waiting',   time:'14:30', label:'Pesanan dibuat'},
      {s:'confirmed', time:'14:45', label:'Penjual mengkonfirmasi'},
      {s:'preparing', time:'15:10', label:'Pesanan disiapkan'},
      {s:'shipped',   time:'15:55', label:'Dalam perjalanan'},
      {s:'done',      time:'16:40', label:'Pesanan selesai'},
    ]},
]

const DUMMY_SELLER_ORDERS = [
  { id:'GV-S001', date:'Hari ini, 11:23', buyer:'Pak Wahyu', buyerAvatar:'👨', payment:'GV Pay',
    delivery:'Pengiriman', total:130000, status:'waiting',
    address:'Jl. Mawar No. 12, Desa Bojong',
    items:[{name:'Beras Pandan Wangi Premium 5kg',qty:2,price:65000,Icon:Wheat,g:['#827717','#9E9D24']}]},
  { id:'GV-S002', date:'Hari ini, 09:47', buyer:'Bu Rina',   buyerAvatar:'👩', payment:'COD',
    delivery:'Ambil Sendiri', total:50000, status:'confirmed',
    address:'Jl. Anggrek No. 5, Desa Sukamaju',
    items:[{name:'Bayam Organik Segar',qty:4,price:8500,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Telur Ayam Kampung',qty:1,price:32000,Icon:Egg,g:['#F57F17','#FBC02D']}]},
  { id:'GV-S003', date:'Kemarin, 15:10', buyer:'Pak Hendra', buyerAvatar:'👴', payment:'QRIS',
    delivery:'Pengiriman', total:65000, status:'done',
    address:'Jl. Melati No. 3, Desa Ciawi',
    items:[{name:'Pupuk Organik Kompos 25kg',qty:1,price:45000,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Bibit Cabai Rawit Lokal',qty:1,price:15000,Icon:Leaf,g:['#C62828','#EF5350']}]},
]

// ── Order Detail Sheet (Buyer - bottom sheet) ──────────────
function OrderDetailSheet({ order, onClose, onRate, onBuyAgain }) {
  const st = STATUS_CONFIG[order.status]
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white flex flex-col rounded-t-3xl"
        style={{maxHeight:'88%',boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[14px] font-extrabold text-gray-900">Detail Pesanan</p>
            <p className="text-[12px] text-gray-400">{order.id} · {order.date}</p>
          </div>
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{background:st.bg,color:st.color}}>{st.label}</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
          {/* Items */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Produk</p>
            {order.items.map((item,i)=>(
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden relative"
                  style={{background:item.image?'transparent':(item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5')}}>
                  {item.image?<img src={item.image} alt="" className="w-full h-full object-cover border border-black/10"/>:(item.Icon?<item.Icon size={22} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={22} className="text-gray-400"/>)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
                </div>
                <p className="text-[13px] font-bold flex-shrink-0" style={{color:PRIMARY}}>
                  Rp {(item.qty*item.price).toLocaleString('id')}
                </p>
              </div>
            ))}
            <div className="flex justify-between pt-3">
              <span className="text-[12px] font-bold text-gray-900">Total</span>
              <span className="text-[14px] font-extrabold" style={{color:PRIMARY}}>Rp {order.total.toLocaleString('id')}</span>
            </div>
          </div>
          {/* Info */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Info Pesanan</p>
            {[['Penjual',order.seller],['Pembayaran',order.payment],['Pengiriman',order.delivery]].map(([l,v])=>(
              <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-400">{l}</span>
                <span className="text-[12px] font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
          {/* Timeline */}
          {order.timeline && (
            <div>
              <p className="text-[11px] font-bold text-gray-400 mb-3">Timeline</p>
              {order.timeline.map((t,i)=>(
                <div key={i} className="flex gap-3 relative">
                  {i<order.timeline.length-1&&<div className="absolute left-[13px] top-7 w-0.5 h-8" style={{background:`${PRIMARY}30`}}/>}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                    style={{background:`${PRIMARY}20`}}>
                    <Check size={13} style={{color:PRIMARY}}/>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <p className="text-[13px] font-bold text-gray-900">{t.label}</p>
                      <p className="text-[12px] text-gray-400 ms-2">{t.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Existing rating */}
          {order.rating && (
            <div className="p-3 rounded-2xl" style={{background:'#FFF8E1'}}>
              <p className="text-[11px] font-bold text-gray-400 mb-2">Ulasanmu</p>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(s=>(
                  <span key={s} className="text-xl" style={{color:s<=order.rating?'#F9A825':'#E0E0E0'}}>★</span>
                ))}
              </div>
              {order.ratingComment&&<p className="text-[12px] text-gray-600 italic">"{order.ratingComment}"</p>}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100 flex gap-3">
          {order.status==='done' && !order.rating && (
            <button onClick={()=>onRate(order)}
              className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold text-white"
              style={{background:'#F9A825',boxShadow:'0 4px 12px rgba(249,168,37,0.4)'}}>
              ★ Beri Rating
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold border-2"
            style={{borderColor:'#E0E0E0',color:'#6B7280'}}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Rating Sheet ───────────────────────────────────────────
function RatingSheet({ order, onClose, onSubmit }) {
  const [stars,   setStars]   = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const LABELS = ['','Mengecewakan','Kurang baik','Cukup baik','Bagus','Sangat bagus!']

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-10"
        style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5"/>
        <p className="text-[15px] font-extrabold text-gray-900 mb-1">Beri Rating Produk</p>
        <p className="text-[12px] text-gray-400 mb-5">dari {order.seller}</p>

        {/* Product items to rate */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          {order.items.map((item,i)=>(
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden relative"
                style={{background:item.image?'transparent':(item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5')}}>
                {item.image?<img src={item.image} alt="" className="w-full h-full object-cover border border-black/10"/>:(item.Icon?<item.Icon size={28} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={28} className="text-gray-400"/>)}
              </div>
              <p className="text-[11px] text-gray-500 text-center w-14 line-clamp-2">{item.name}</p>
            </div>
          ))}
        </div>

        {/* Star selector */}
        <div className="flex justify-center gap-3 mb-2">
          {[1,2,3,4,5].map(s=>(
            <button key={s}
              onMouseEnter={()=>setHovered(s)}
              onMouseLeave={()=>setHovered(0)}
              onClick={()=>setStars(s)}
              className="text-4xl transition-transform active:scale-110"
              style={{color:(hovered||stars)>=s?'#F9A825':'#E0E0E0',
                transform:(hovered||stars)>=s?'scale(1.15)':'scale(1)',
                transition:'all 0.15s ease'}}>
              ★
            </button>
          ))}
        </div>
        <p className="text-center text-[13px] font-bold mb-4"
          style={{color:stars?'#F9A825':'#9CA3AF',minHeight:20}}>
          {LABELS[hovered||stars]||'Tap bintang untuk memberi rating'}
        </p>

        {/* Comment */}
        <textarea value={comment} onChange={e=>setComment(e.target.value)}
          placeholder="Tulis ulasanmu (opsional)..."
          className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none resize-none mb-4"
          style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA',minHeight:80}}/>

        <button onClick={()=>stars>0&&onSubmit(order.id,stars,comment)}
          className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition"
          style={{background:stars>0?'#F9A825':'#E0E0E0',
            boxShadow:stars>0?'0 4px 12px rgba(249,168,37,0.4)':'none'}}>
          Kirim Ulasan
        </button>
      </div>
    </div>
  )
}

// ── Order History Screen (kept for reference) ───────────────
function OrderHistoryScreen({ orders, onBack }) {
  const [filter, setFilter]     = useState('all')
  const [detail, setDetail]     = useState(null)
  const PRIMARY = '#1B6B3A'

  const filtered = filter==='all' ? orders
    : filter==='active' ? orders.filter(o=>!['done','cancelled'].includes(o.status))
    : orders.filter(o=>o.status==='done')

  if (detail) return <OrderDetailScreen order={detail} onBack={()=>setDetail(null)}/>

  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <p className="font-extrabold text-gray-900 text-[15px]">Pesanan Saya</p>
      </div>
      {/* Filter tabs */}
      <div className="flex bg-white border-b border-gray-100 flex-shrink-0">
        {[['all','Semua'],['active','Berlangsung'],['done','Selesai']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)}
            className="flex-1 py-3 text-[12px] font-bold transition"
            style={filter===id?{color:PRIMARY,borderBottom:`2.5px solid ${PRIMARY}`}:{color:'#9CA3AF',borderBottom:'2.5px solid transparent'}}>
            {lbl}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {filtered.length===0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-[14px] font-bold text-gray-900 mb-1">Belum ada pesanan</p>
            <p className="text-[12px] text-gray-400">Yuk mulai belanja produk lokal!</p>
          </div>
        )}
        {filtered.map(order=>{
          const st = STATUS_CONFIG[order.status]
          return (
            <button key={order.id} onClick={()=>setDetail(order)}
              className="bg-white rounded-2xl p-4 text-left active:scale-98 transition-transform"
              style={{boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] font-bold text-gray-400">{order.id}</p>
                  <p className="text-[12px] text-gray-300 mt-0.5">{order.date}</p>
                </div>
                <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
                  style={{background:st.bg,color:st.color}}>{st.label}</span>
              </div>
              {/* Items */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {order.items.slice(0,3).map((item,i)=>(
                    <div key={i} className="w-10 h-10 rounded-[12px] flex items-center justify-center border-2 border-white shadow-inner relative overflow-hidden"
                      style={{background:item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5',zIndex:order.items.length-i}}>
                      {item.Icon?<item.Icon size={18} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={18} className="text-gray-400"/>}
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 line-clamp-2">
                    {order.items[0].name}{order.items.length>1?` +${order.items.length-1} lainnya`:''}
                  </p>
                  <p className="text-[12px] text-gray-400">dari {order.seller}</p>
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                <p className="text-[11px] text-gray-400">{order.delivery} · {order.payment}</p>
                <p className="text-[14px] font-extrabold" style={{color:PRIMARY}}>
                  Rp {order.total.toLocaleString('id')}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Order Detail Screen (Buyer) ────────────────────────────
function OrderDetailScreen({ order, onBack }) {
  const PRIMARY = '#1B6B3A'
  const st = STATUS_CONFIG[order.status]
  const allDone = order.status === 'done'
  return (
    <div className="flex flex-col h-full" style={{background:'#FAFBF9'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white" style={{borderBottom:'1px solid rgba(27,107,58,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
          <ArrowLeft size={16} className="text-gray-700"/>
        </button>
        <div className="flex-1">
          <p className="font-extrabold text-gray-900 text-[14px]">Detail Pesanan</p>
          <p className="text-[12px] text-gray-400">{order.id}</p>
        </div>
        <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
          style={{background:st.bg,color:st.color}}>{st.label}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {/* Items */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Produk</p>
          {order.items.map((item,i)=>(
            <div key={i} className={`flex items-center gap-3 py-2.5 ${i<order.items.length-1?'border-b border-gray-50':''}`}>
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner relative overflow-hidden"
                style={{background:item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5'}}>
                {item.Icon?<item.Icon size={22} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={22} className="text-gray-400"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
              </div>
              <p className="text-[13px] font-bold flex-shrink-0" style={{color:PRIMARY}}>
                Rp {(item.qty*item.price).toLocaleString('id')}
              </p>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-1 border-t border-gray-100">
            <span className="text-[12px] font-bold text-gray-900">Total</span>
            <span className="text-[14px] font-extrabold" style={{color:PRIMARY}}>Rp {order.total.toLocaleString('id')}</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl p-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">Info Pesanan</p>
          {[['Penjual',order.seller],['Pembayaran',order.payment],['Pengiriman',order.delivery],['Tanggal',order.date]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl px-4 py-4" style={{boxShadow:'0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-4">Timeline</p>
          {order.timeline.map((t,i)=>{
            const isLast = i===order.timeline.length-1
            return (
              <div key={i} className="flex gap-3 relative">
                {!isLast && <div className="absolute left-[13px] top-7 w-0.5 h-8" style={{background:PRIMARY+'40'}}/>}
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{background:isLast&&allDone?PRIMARY:PRIMARY+'20'}}>
                  <Check size={13} style={{color:isLast&&allDone?'#fff':PRIMARY}}/>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <p className="text-[13px] font-bold text-gray-900">{t.label}</p>
                    <p className="text-[12px] text-gray-400 flex-shrink-0 ms-2">{t.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        {order.status==='done' && (
          <button onClick={()=>{onBuyAgain&&onBuyAgain(order);onClose()}}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold border-2"
            style={{borderColor:PRIMARY,color:PRIMARY}}>
            Beli Lagi
          </button>
        )}
      </div>
    </div>
  )
}

// ── Seller Order Management ────────────────────────────────
function SellerOrderSheet({ order, onClose, onUpdateStatus }) {
  const PRIMARY = '#1B6B3A'
  const st      = STATUS_CONFIG[order.status]
  const action  = SELLER_ACTIONS[order.status]
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white flex flex-col rounded-t-3xl"
        style={{maxHeight:'88%',boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[14px] font-extrabold text-gray-900">Detail Pesanan</p>
            <p className="text-[12px] text-gray-400">{order.id} · {order.date}</p>
          </div>
          <span className="text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{background:st.bg,color:st.color}}>{st.label}</span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col gap-4">
          {/* Buyer */}
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={{background:'#F9FAFB'}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{background:'#E8F5E9'}}>{order.buyerAvatar}</div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">{order.buyer}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{order.address}</p>
            </div>
          </div>
          {/* Items */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Produk Dipesan</p>
            {order.items.map((item,i)=>(
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner relative overflow-hidden"
                  style={{background:item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5'}}>
                  {item.Icon?<item.Icon size={22} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={22} className="text-gray-400"/>}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
                </div>
                <p className="text-[13px] font-bold flex-shrink-0" style={{color:PRIMARY}}>
                  Rp {(item.qty*item.price).toLocaleString('id')}
                </p>
              </div>
            ))}
          </div>
          {/* Info */}
          {[['Total',`Rp ${order.total.toLocaleString('id')}`],['Pembayaran',order.payment],['Pengiriman',order.delivery]].map(([l,v])=>(
            <div key={l} className="flex justify-between py-1">
              <span className="text-[12px] text-gray-400">{l}</span>
              <span className="text-[12px] font-bold" style={{color:l==='Total'?PRIMARY:'#374151'}}>{v}</span>
            </div>
          ))}
        </div>
        {/* Action */}
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100">
          {action ? (
            <button onClick={()=>{onUpdateStatus(order.id,action.next);onClose()}}
              className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
              style={{background:PRIMARY,boxShadow:`0 4px 12px ${PRIMARY}40`}}>
              {action.label}
            </button>
          ) : order.status==='done' ? (
            <div className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
              style={{background:'#F1F8E9'}}>
              <Check size={16} style={{color:PRIMARY}}/>
              <span className="text-[13px] font-bold" style={{color:PRIMARY}}>Pesanan Selesai</span>
            </div>
          ) : (
            <div className="w-full py-3.5 rounded-2xl flex items-center justify-center"
              style={{background:'#F5F5F5'}}>
              <span className="text-[13px] font-semibold text-gray-400">Menunggu pengiriman selesai</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ── Order Tracking ─────────────────────────────────────────
const GVMAN = { name:'Agus Santoso', rating:4.9, trips:'234', vehicle:'Honda Beat · B 4521 KDF', avatar:'👨' }
const ORDER_NO = `GV-${Date.now().toString().slice(-8)}`

const TRACK_PHASES = [
  { id:'confirmed', label:'Pesanan dikonfirmasi',         sub:'Penjual menerima pesananmu',          icon:'✅' },
  { id:'preparing', label:'Penjual menyiapkan pesanan',   sub:'Produk sedang dikemas dengan baik',   icon:'📦' },
  { id:'pickup',    label:'GV Man menjemput pesanan',     sub:'GV Man sedang menuju toko penjual',   icon:'🏍️' },
  { id:'onway',     label:'GV Man dalam perjalanan',      sub:'Sedang menuju lokasi pengirimanmu',   icon:'🛣️' },
  { id:'arrived',   label:'Pesanan tiba di lokasimu',     sub:'Terima dan periksa pesananmu',        icon:'📍' },
]
// Auto-advance delays (ms)
const PHASE_DELAYS = [3500, 7000, 12000, 20000]

function OrderTracking({ onDone }) {
  const [phase,     setPhase]  = useState(0)
  const [phaseTimes,setTimes]  = useState(Array(5).fill(''))
  const [eta,       setEta]    = useState(28)
  const [chatOpen,  setChat]   = useState(false)
  const [chatMsg,   setChatMsg]= useState('')
  const [chatLog,   setChatLog]= useState([
    { from:'gvman', text:'Halo kak, pesanan sudah saya ambil. Sedang dalam perjalanan!' }
  ])
  const orderNo = useRef(ORDER_NO)

  useEffect(()=>{
    // Mark phase 0 time immediately
    const now = () => new Date().toLocaleTimeString('id',{hour:'2-digit',minute:'2-digit'})
    setTimes(t=>{ const n=[...t]; n[0]=now(); return n })

    const timers = PHASE_DELAYS.map((delay,i)=>
      setTimeout(()=>{
        setPhase(i+1)
        setTimes(t=>{ const n=[...t]; n[i+1]=now(); return n })
        if (i===2) setEta(10) // pickup → onway: update ETA
        if (i===3) setEta(3)  // onway → arrived
      }, delay)
    )
    const etaT = setInterval(()=>setEta(e=>Math.max(0,e-1)),60000)
    return ()=>{ timers.forEach(clearTimeout); clearInterval(etaT) }
  },[])

  const isArrived = phase >= 4
  // Motorcycle x position: 8% → 88% across phases 0-4
  const motoX = 8 + (phase/4)*80
  // Arc y: peaks at center (follow a sine curve for the route)
  const motoY = 50 - Math.sin((phase/4)*Math.PI)*28

  const sendChat = () => {
    if (!chatMsg.trim()) return
    setChatLog(l=>[...l,{from:'me',text:chatMsg}])
    setChatMsg('')
    setTimeout(()=>setChatLog(l=>[...l,{from:'gvman',text:'Siap kak, sebentar lagi sampai! 🙏'}]),1200)
  }

  return (
    <div className="flex flex-col h-full relative" style={{background:'#FAFBF9'}}>

      {/* Chat overlay */}
      {chatOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <button onClick={()=>setChat(false)}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <ArrowLeft size={16} className="text-gray-700"/>
            </button>
            <div className="w-9 h-9 rounded-2xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">
              {GVMAN.avatar}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-gray-900">{GVMAN.name}</p>
              <p className="text-[12px] text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/>GV Man · Online
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-3">
            {chatLog.map((m,i)=>(
              <div key={i} className={`flex ${m.from==='me'?'justify-end':'justify-start'}`}>
                {m.from==='gvman' && (
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-sm me-2 flex-shrink-0 self-end">
                    {GVMAN.avatar}
                  </div>
                )}
                <div className="max-w-[72%] px-3.5 py-2.5 rounded-2xl"
                  style={m.from==='me'
                    ?{background:PRIMARY,borderBottomRightRadius:4}
                    :{background:'#F0F0F0',borderBottomLeftRadius:4}}>
                  <p className="text-[13px] leading-snug"
                    style={{color:m.from==='me'?'#fff':'#111'}}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-t border-gray-100">
            <div className="flex-1 flex items-center rounded-2xl px-3.5 py-2.5" style={{background:'#F5F5F5'}}>
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&sendChat()}
                placeholder="Ketik pesan..." className="flex-1 text-[13px] outline-none bg-transparent"/>
            </div>
            <button onClick={sendChat}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{background:chatMsg.trim()?PRIMARY:'#E0E0E0'}}>
              <Navigation size={14} className="text-white" style={{marginInlineStart:1}}/>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-[16px] font-extrabold text-gray-900">Pesanan Dalam Perjalanan</p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{background:'#E8F5E9'}}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{background:PRIMARY}}/>
            <span className="text-[12px] font-bold" style={{color:PRIMARY}}>LIVE</span>
          </div>
        </div>
        <p className="text-[12px] text-gray-400 mt-0.5">No. Pesanan: {orderNo.current}</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">

        {/* Route map */}
        <div className="mx-4 mt-4 bg-white rounded-3xl p-4" style={{boxShadow:'0 2px 16px rgba(0,0,0,0.08)'}}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-gray-900">
              {isArrived ? '🎉 Pesanan sudah tiba!' : `Estimasi tiba: ${eta} menit lagi`}
            </p>
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
              style={{background:isArrived?'#E8F5E9':'#FFF3E0',color:isArrived?PRIMARY:'#E65100'}}>
              {isArrived ? 'Sampai' : 'Dalam perjalanan'}
            </span>
          </div>

          {/* Route SVG */}
          <div className="relative h-28 rounded-2xl overflow-hidden"
            style={{background:'linear-gradient(135deg,#E8F5E9,#F1F8E9)'}}>
            <svg viewBox="0 0 300 90" className="absolute inset-0 w-full h-full">
              {/* Road base */}
              <path d="M30 60 Q80 30 150 55 Q220 80 270 55"
                fill="none" stroke="#C8E6C9" strokeWidth="6" strokeLinecap="round"/>
              {/* Progress overlay */}
              <path d="M30 60 Q80 30 150 55 Q220 80 270 55"
                fill="none" stroke={PRIMARY} strokeWidth="4" strokeLinecap="round"
                strokeDasharray="310" strokeDashoffset={310*(1-phase/4)}
                style={{transition:'stroke-dashoffset 1.2s ease'}}/>
              {/* Dashes on road */}
              <path d="M30 60 Q80 30 150 55 Q220 80 270 55"
                fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="8 10" opacity="0.5"/>
              {/* Start pin */}
              <text x="22" y="72" fontSize="18" textAnchor="middle">🏪</text>
              {/* End pin */}
              <text x="278" y="68" fontSize="18" textAnchor="middle">🏠</text>
            </svg>
            {/* Motorcycle (CSS animated) */}
            <div className="absolute transition"
              style={{
                left:`${motoX}%`, top:`${motoY}%`,
                transform:'translate(-50%,-50%)',
                fontSize:22,
                transition:'left 1.2s ease, top 1.2s ease',
                filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}>
              🏍️
            </div>
          </div>

          <div className="flex justify-between mt-3">
            <div>
              <p className="text-[11px] text-gray-400">Dari</p>
              <p className="text-[11px] font-bold text-gray-800">Toko Penjual</p>
              <p className="text-[11px] text-gray-400">Desa Sukamaju</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">Ke</p>
              <p className="text-[11px] font-bold text-gray-800">Lokasi Kamu</p>
              <p className="text-[11px] text-gray-400">2.4 km dari toko</p>
            </div>
          </div>
        </div>

        {/* GV Man card */}
        <div className="mx-4 mt-3 bg-white rounded-3xl p-4" style={{boxShadow:'0 2px 16px rgba(0,0,0,0.08)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-3">GV Man kamu</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{background:'#E8F5E9'}}>
              {GVMAN.avatar}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-extrabold text-gray-900">{GVMAN.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={12} className="fill-yellow-400 text-yellow-400"/>
                <span className="text-[12px] font-bold text-gray-700">{GVMAN.rating}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-400">{GVMAN.trips} perjalanan</span>
              </div>
              <p className="text-[12px] text-gray-400 mt-0.5">{GVMAN.vehicle}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border-2 active:scale-[0.96] transition-transform"
              style={{borderColor:PRIMARY,color:PRIMARY}}>
              <Phone size={15}/>
              <span className="text-[12px] font-bold">Telepon</span>
            </button>
            <button onClick={()=>setChat(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl active:scale-[0.96] transition-transform"
              style={{background:PRIMARY,color:'#fff'}}>
              <MessageCircle size={15}/>
              <span className="text-[12px] font-bold">Chat</span>
            </button>
          </div>
        </div>

        {/* Status timeline */}
        <div className="mx-4 mt-3 bg-white rounded-3xl px-5 py-4" style={{boxShadow:'0 2px 16px rgba(0,0,0,0.08)'}}>
          <p className="text-[11px] font-bold text-gray-400 mb-4">Status Pengiriman</p>
          {TRACK_PHASES.map((p,i)=>{
            const done    = i <  phase
            const current = i === phase
            const pending = i >  phase
            return (
              <div key={p.id} className="flex gap-3 relative">
                {/* Connector */}
                {i < TRACK_PHASES.length-1 && (
                  <div className="absolute left-[13px] top-7 w-0.5"
                    style={{height:36, background:done?PRIMARY:'#E5E7EB',
                      transition:'background 0.6s ease'}}/>
                )}
                {/* Dot */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition"
                  style={done
                    ? {background:PRIMARY}
                    : current
                      ? {background:'#fff',border:`2px solid ${PRIMARY}`}
                      : {background:'#F3F4F6',border:'2px solid #E5E7EB'}}>
                  {done
                    ? <Check size={13} className="text-white"/>
                    : current
                      ? <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{background:PRIMARY}}/>
                      : <div className="w-2 h-2 rounded-full bg-gray-300"/>}
                </div>
                {/* Text */}
                <div className="flex-1 pb-7">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] leading-snug font-bold"
                      style={{color: done?'#111827' : current?PRIMARY : '#9CA3AF'}}>
                      {p.label}
                    </p>
                    <p className="text-[12px] text-gray-400 flex-shrink-0 mt-0.5">{phaseTimes[i]}</p>
                  </div>
                  <p className="text-[11px] mt-0.5"
                    style={{color: done?'#6B7280' : current?`${PRIMARY}CC` : '#D1D5DB'}}>
                    {p.sub}
                  </p>
                  {current && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{background:PRIMARY}}/>
                      <span className="text-[12px] font-semibold" style={{color:PRIMARY}}>Sedang berlangsung</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-100">
        {!isArrived ? (
          <div className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
            style={{background:'#F5F5F5'}}>
            <Clock size={15} className="text-gray-400"/>
            <span className="text-[13px] font-semibold text-gray-400">Menunggu pesanan tiba...</span>
          </div>
        ) : (
          <button onClick={onDone}
            className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white active:scale-[0.96] transition-transform"
            style={{background:PRIMARY,boxShadow:`0 4px 12px ${PRIMARY}40`}}>
            ✓ Konfirmasi Pesanan Diterima
          </button>
        )}
      </div>
    </div>
  )
}

// ── Order Success ──────────────────────────────────────────
function OrderSuccess({ onDone }) {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-white px-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{background:'#E8F5E9'}}>
        <Check size={36} style={{color:PRIMARY}}/>
      </div>
      <p className="text-xl font-extrabold text-gray-900 mb-2">Pesanan Dikonfirmasi!</p>
      <p className="text-sm text-gray-500 text-center leading-relaxed mb-8">
        Pesanan kamu sedang diproses oleh penjual. GV Man akan segera menjemput paketmu.
      </p>
      <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl">🏍️</span>
        <div>
          <p className="text-[12px] font-bold text-gray-900">GV Man sedang dalam perjalanan</p>
          <p className="text-[12px] text-gray-400">Estimasi tiba: 30-45 menit</p>
        </div>
      </div>
      <button onClick={onDone}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
        style={{background:PRIMARY}}>
        Kembali ke Beranda
      </button>
    </div>
  )
}

// ── Add / Edit Product Sheet ───────────────────────────────
function ProductFormSheet({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name:  initial?.name  || '',
    price: initial?.price || '',
    unit:  initial?.unit  || '',
    stock: initial?.stock || '',
    cat:   initial?.cat   || 'Sayur',
    desc:  initial?.desc  || '',
    image: initial?.image || null,
  })
  const fileRef = React.useRef(null)
  const isEdit  = !!initial
  const valid   = form.name.trim() && form.price && form.stock

  const handleImage = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f=>({...f, image: ev.target.result}))
    reader.readAsDataURL(file)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white flex flex-col"
        style={{borderRadius:'20px 20px 0 0',maxHeight:'90%',boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200"/>
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100 flex-shrink-0">
          <p className="text-[15px] font-extrabold text-gray-900">{isEdit?'Edit Produk':'Tambah Produk'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'#F5F5F5'}}>
            <X size={14} className="text-gray-500"/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-4 flex flex-col gap-4">

          {/* Foto Produk */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Foto Produk</p>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{background:'#F5F5F5',border:'1.5px dashed #E0E0E0'}}>
                {form.image
                  ? <img src={form.image} alt="" className="w-full h-full object-cover border border-black/10"/>
                  : <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📷</span>
                      <span className="text-[11px] text-gray-400">Belum ada</span>
                    </div>
                }
              </div>
              {/* Upload button */}
              <div className="flex flex-col gap-2">
                <button onClick={()=>fileRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold text-white"
                  style={{background:PRIMARY}}>
                  {form.image ? 'Ganti Foto' : 'Upload Foto'}
                </button>
                {form.image && (
                  <button onClick={()=>setForm(f=>({...f,image:null}))}
                    className="px-4 py-2 rounded-xl text-[12px] font-semibold"
                    style={{background:'#FEF2F2',color:'#EF4444'}}>
                    Hapus Foto
                  </button>
                )}
                <p className="text-[11px] text-gray-400">JPG, PNG · Maks. 5 MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage}/>
            </div>
          </div>

          {/* Nama */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Nama Produk *</p>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              placeholder="cth. Beras Pandan Wangi 5kg"
              className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
              style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
          </div>
          {/* Kategori */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {CATS.filter(c=>c!=='Semua').map(c=>(
                <button key={c} onClick={()=>setForm(f=>({...f,cat:c}))}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition"
                  style={form.cat===c?{background:PRIMARY,color:'#fff',borderColor:PRIMARY}:{background:'transparent',color:'#6B7280',borderColor:'#E0E0E0'}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Harga + Satuan */}
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-400 mb-2">Harga (Rp) *</p>
              <input value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}
                type="number" placeholder="0"
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
                style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-400 mb-2">Satuan</p>
              <input value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}
                placeholder="cth. kg, pcs"
                className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
                style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
            </div>
          </div>
          {/* Stok */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Stok *</p>
            <input value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))}
              type="number" placeholder="0"
              className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none"
              style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA'}}/>
          </div>
          {/* Deskripsi */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2">Deskripsi</p>
            <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}
              placeholder="Ceritakan produkmu kepada pembeli..."
              className="w-full rounded-2xl px-4 py-3 text-[13px] outline-none resize-none"
              style={{border:'1.5px solid #E0E0E0',background:'#FAFAFA',minHeight:72}}/>
          </div>
        </div>
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-gray-100">
          <button onClick={()=>valid&&onSave({...form,price:Number(form.price),stock:Number(form.stock)})}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition"
            style={{background:valid?PRIMARY:'#E0E0E0'}}>
            {isEdit?'Simpan Perubahan':'Tambah Produk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Filter Sheet ─────────────────────────────────────────────
function FilterSheet({ currentSort, onSort, currentCats, onCats, onClose }) {
  const toggleCat = (c) => {
    if (c === 'Semua') {
      onCats([])
      return
    }
    const newCats = currentCats.includes(c) ? currentCats.filter(x=>x!==c) : [...currentCats, c]
    onCats(newCats)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-10 flex flex-col"
        style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.15)', maxHeight:'85%'}}>
        <div className="flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4"/>
          <p className="text-[16px] font-extrabold text-gray-900 mb-1">Filter & Urutkan</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {/* Urutkan */}
          <div className="mb-6 mt-3">
            <p className="text-[13px] font-bold text-gray-900 mb-2">Urutkan</p>
            <div className="flex flex-col gap-1">
              {SORT_OPTIONS.map(s=>(
                <label key={s.id} className="flex items-center justify-between py-2.5 cursor-pointer">
                  <span className="text-[13px] text-gray-700">{s.label}</span>
                  <input type="radio" name="sort" checked={currentSort===s.id} onChange={()=>onSort(s.id)}
                    className="w-4 h-4 accent-[#1B6B3A]"/>
                </label>
              ))}
            </div>
          </div>
          {/* Kategori */}
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-2">Kategori</p>
            <div className="flex flex-col gap-1">
              {CATS.map(c=>(
                <label key={c} className="flex items-center gap-3 py-2.5 cursor-pointer">
                  <input type="checkbox"
                    checked={c==='Semua' ? currentCats.length===0 : currentCats.includes(c)}
                    onChange={()=>toggleCat(c)}
                    className="w-4 h-4 accent-[#1B6B3A] rounded-sm"/>
                  <span className="text-[13px] text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 pt-4 border-t border-gray-100 mt-2">
          <button onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white transition"
            style={{background: '#1B6B3A'}}>
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Screen ────────────────────────────────────────────
export default function Pasar({ navigate, userProfile, initialTab }) {
  const [showEmptyCart,setEmptyCart]  = useState(false)
  const [paymentMethod,setPayMethod]  = useState('gvpay')
  const [buyerOrders,  setBuyerOrders]= useState(DUMMY_BUYER_ORDERS)
  const [orderDetailSheet,setOrderDetail] = useState(null)
  const [orderToRate,  setOrderToRate]= useState(null)
  const [orderFilter,  setOrderFilter]= useState('all')
  const [selectedCats, setSelectedCats]= useState([])
  const [searchQ,      setSearchQ]     = useState('')
  const [sortBy,       setSortBy]      = useState('terlaris')
  const [showSort,     setShowSort]    = useState(false)
  const [cart,         setCart]        = useState({})
  const [liked,        setLiked]       = useState(new Set())
  const [detail,       setDetail]      = useState(null)
  const [detailQty,    setDQty]        = useState(1)
  const [screen,       setScreen]      = useState('list')
  const [activeTab,    setActiveTab]   = useState(initialTab || 'belanja')
  const [bannerIdx,    setBannerIdx]   = useState(0)

  const isSeller = userProfile?.capabilities?.includes('Penjual')

  // Filter + search + sort
  const filtered = PRODUCTS
    .filter(p => selectedCats.length === 0 || selectedCats.includes(p.cat))
    .filter(p => !searchQ || p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.seller.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a,b) => {
      if (sortBy === 'harga_asc')  return a.price - b.price
      if (sortBy === 'harga_desc') return b.price - a.price
      if (sortBy === 'rating')     return b.rating - a.rating
      return parseInt(b.sold) - parseInt(a.sold) // terlaris
    })

  const totalCart  = Object.values(cart).reduce((a,b)=>a+b,0)
  const totalPrice = Object.entries(cart).reduce((s,[id,q])=>{
    const p = PRODUCTS.find(x=>x.id===parseInt(id)); return s+(p?.price||0)*q
  },0)

  const addToCart     = (id,qty=1) => setCart(p=>({...p,[id]:(p[id]||0)+qty}))
  const removeFromCart= (id)       => setCart(p=>{const n={...p};if(n[id]>1)n[id]--;else delete n[id];return n})
  const toggleLike    = (id)       => setLiked(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n})
  const openDetail    = (p)        => { setDetail(p); setDQty(1) }

  const checkoutItems = Object.entries(cart)
    .map(([id,qty])=>{ const p = PRODUCTS.find(x=>x.id===Number(id)); return p?{...p,qty}:null })
    .filter(Boolean)

  if (screen==='checkout') return <CheckoutScreen items={checkoutItems} onBack={()=>setScreen('list')} onConfirm={(method)=>{setPayMethod(method);setScreen('payment')}}/>
  if (screen==='payment')  return <PaymentFlow method={paymentMethod} total={checkoutItems.reduce((s,i)=>s+i.price*i.qty,0)+(paymentMethod==='pickup'?0:8000)} onComplete={()=>{
    // Save order to buyer history
    const newOrder = {
      id:`GV-${Date.now().toString().slice(-8)}`,
      date:`Hari ini, ${new Date().toLocaleTimeString('id',{hour:'2-digit',minute:'2-digit'})}`,
      seller: checkoutItems[0]?.seller || 'Penjual',
      payment: {gvpay:'GV Pay',qris:'QRIS',transfer:'Transfer Bank',cod:'Bayar di Tempat'}[paymentMethod],
      delivery: paymentMethod==='pickup'?'Ambil Sendiri':'Pengiriman',
      total: checkoutItems.reduce((s,i)=>s+i.price*i.qty,0)+(paymentMethod==='pickup'?0:8000),
      status:'waiting',
      items: checkoutItems,
      timeline:[{s:'waiting',time:new Date().toLocaleTimeString('id',{hour:'2-digit',minute:'2-digit'}),label:'Pesanan dibuat'}],
    }
    setBuyerOrders(p=>[newOrder,...p])
    setCart({})
    setScreen('tracking')
  }} onBack={()=>setScreen('checkout')}/>
  if (screen==='tracking') return <OrderTracking onDone={()=>{setScreen('list');setActiveTab('pesanan')}}/>
  if (screen==='success')  return <OrderSuccess onDone={()=>{setScreen('list');navigate('beranda')}}/>

  return (
    <div className="flex flex-col h-full relative" style={{background:'#FAFBF9'}}>

      {/* Sort sheet */}
      {showSort && <FilterSheet currentSort={sortBy} onSort={setSortBy} currentCats={selectedCats} onCats={setSelectedCats} onClose={()=>setShowSort(false)}/>}

      {/* Empty cart sheet */}
      {showEmptyCart && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setEmptyCart(false)}/>
          <div className="relative bg-white rounded-t-3xl px-6 pt-5 pb-10"
            style={{boxShadow:'0 -4px 32px rgba(0,0,0,0.15)'}}>
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6"/>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{background:'#F5F5F5'}}>
                <ShoppingCart size={32} className="text-gray-300"/>
              </div>
              <p className="text-[16px] font-extrabold text-gray-900 mb-2">Keranjang kosong</p>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
                Belum ada produk yang ditambahkan. Yuk, temukan produk lokal favoritmu!
              </p>
              <button onClick={()=>setEmptyCart(false)}
                className="w-full py-3.5 rounded-2xl text-[13px] font-bold text-white"
                style={{background:PRIMARY}}>
                Mulai Belanja
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Header */}
      <div className="flex-shrink-0" style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-[20px] font-extrabold text-white tracking-tight">ESTO</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-[0.96]"
                style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.06)'}}
                onClick={()=>totalCart>0?setScreen('checkout'):setEmptyCart(true)}>
                <ShoppingCart size={16} className="text-white/70"/>
                {totalCart > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full text-white text-[11px] font-bold flex items-center justify-center tabular-nums"
                    style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)',boxShadow:'0 0 0 2px #0C3E1E'}}>{totalCart}</span>
                )}
              </button>
            </div>
          </div>
          {/* Main toggle */}
          <div className="flex rounded-xl p-1 mb-2" style={{background:'rgba(255,255,255,0.1)'}}>
            {[['belanja','Belanja'],['pesanan','Pesanan']].map(([id,lbl])=>(
              <button key={id} onClick={()=>setActiveTab(id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${activeTab===id?'bg-white shadow-sm':'text-white/70'}`}
                style={activeTab===id?{color:PRIMARY}:{}}>
                {lbl}
              </button>
            ))}
          </div>

        </div>
        {/* Categories removed, moved to filter sheet */}
        {/* Seller filter chips removed per request */}
      </div>

      {/* ── PESANAN TAB (inline, no separate screen) ── */}
      {activeTab==='pesanan' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Order detail sheet */}
          {orderDetailSheet && (
            <OrderDetailSheet
              order={orderDetailSheet}
              onClose={()=>setOrderDetail(null)}
              onRate={(order)=>{setOrderToRate(order);setOrderDetail(null)}}
              onBuyAgain={(order)=>{
                order.items.forEach(item=>{ if(item.id) addToCart(item.id) })
                setOrderDetail(null); setActiveTab('belanja')
              }}/>
          )}
          {/* Rating sheet */}
          {orderToRate && (
            <RatingSheet
              order={orderToRate}
              onClose={()=>setOrderToRate(null)}
              onSubmit={(orderId,rating,comment)=>{
                setBuyerOrders(p=>p.map(o=>o.id===orderId?{...o,rating,ratingComment:comment}:o))
                setOrderToRate(null)
              }}/>
          )}
          {/* Filter tabs */}
          <div className="flex border-b border-gray-100 bg-white flex-shrink-0">
            {[['all','Semua'],['active','Berlangsung'],['done','Selesai']].map(([id,lbl])=>(
              <button key={id} onClick={()=>setOrderFilter(id)}
                className="flex-1 py-3 text-[12px] font-bold transition"
                style={orderFilter===id?{color:PRIMARY,borderBottom:`2.5px solid ${PRIMARY}`}:{color:'#9CA3AF',borderBottom:'2.5px solid transparent'}}>
                {lbl}
              </button>
            ))}
          </div>
          {/* Order list */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
            {(() => {
              const filtered = orderFilter==='all' ? buyerOrders
                : orderFilter==='active' ? buyerOrders.filter(o=>!['done','cancelled'].includes(o.status))
                : buyerOrders.filter(o=>o.status==='done')
              if (filtered.length===0) return (
                <div className="flex flex-col items-center justify-center py-20">
                  <p className="text-4xl mb-3">🛍️</p>
                  <p className="text-[14px] font-bold text-gray-900 mb-1">Belum ada pesanan</p>
                  <p className="text-[12px] text-gray-400 text-center">Yuk mulai belanja produk lokal desa!</p>
                </div>
              )
              return filtered.map(order=>{
                const st = STATUS_CONFIG[order.status]
                return (
                  <button key={order.id} onClick={()=>setOrderDetail(order)}
                    className="bg-white rounded-2xl p-4 text-left w-full active:scale-[0.96] transition-transform"
                    style={{boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400">{order.id}</p>
                        <p className="text-[12px] text-gray-300 mt-0.5">{order.date}</p>
                      </div>
                      <span className="text-[12px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ms-2"
                        style={{background:st.bg,color:st.color}}>{st.label}</span>
                    </div>
                    {/* Items */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="flex -space-x-2">
                        {order.items.slice(0,3).map((item,i)=>(
                          <div key={i} className="w-10 h-10 rounded-[12px] flex items-center justify-center border-2 border-white shadow-inner relative overflow-hidden"
                            style={{background:item.g?`linear-gradient(135deg, ${item.g[0]} 0%, ${item.g[1]} 100%)`:'#F5F5F5',zIndex:order.items.length-i}}>
                            {item.image?<img src={item.image} alt="" className="w-full h-full object-cover border border-black/10"/>:(item.Icon?<item.Icon size={18} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={18} className="text-gray-400"/>)}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 line-clamp-2">
                          {order.items[0].name}{order.items.length>1?` +${order.items.length-1} lainnya`:''}
                        </p>
                        <p className="text-[12px] text-gray-400">dari {order.seller}</p>
                      </div>
                    </div>
                    {/* Rating (if done + rated) */}
                    {order.rating && (
                      <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-xl"
                        style={{background:'#FFF8E1'}}>
                        {[1,2,3,4,5].map(s=>(
                          <span key={s} className="text-sm" style={{color:s<=order.rating?'#F9A825':'#E0E0E0'}}>★</span>
                        ))}
                        <span className="text-[12px] text-gray-500 ms-1">
                          {order.ratingComment ? `"${order.ratingComment.slice(0,30)}${order.ratingComment.length>30?'…':''}"` : 'Sudah diberi rating'}
                        </span>
                      </div>
                    )}
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                      <p className="text-[11px] text-gray-400">{order.delivery} · {order.payment}</p>
                      <p className="text-[14px] font-extrabold" style={{color:PRIMARY}}>
                        Rp {order.total.toLocaleString('id')}
                      </p>
                    </div>
                    {/* Rate CTA */}
                    {order.status==='done' && !order.rating && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-50">
                        <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
                          style={{background:`${PRIMARY}12`,color:PRIMARY}}>
                          ★ Beri rating produk
                        </span>
                      </div>
                    )}
                  </button>
                )
              })
            })()}
          </div>
        </div>
      )}
      {activeTab==='belanja' && (
        <div className="flex-1 overflow-y-auto no-scrollbar" style={{paddingBottom:totalCart>0?72:16}}>
          {/* Search and Filter */}
          <div className="px-3 pt-3">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2.5 transition bg-gray-100 border border-gray-200">
                <Search size={15} className="text-gray-400 flex-shrink-0"/>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                  placeholder="Cari produk desa..."
                  className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"/>
                {searchQ && (
                  <button onClick={()=>setSearchQ('')}>
                    <X size={13} className="text-gray-400"/>
                  </button>
                )}
              </div>
              <button onClick={()=>setShowSort(true)}
                className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0 transition relative bg-gray-100 border border-gray-200">
                <SlidersHorizontal size={16} className="text-gray-600"/>
                {selectedCats.length > 0 && (
                  <span className="absolute -top-1 -end-1 w-3.5 h-3.5 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                    style={{background:'#EF4444',boxShadow:'0 0 0 2px #FFF'}}>{selectedCats.length}</span>
                )}
              </button>
            </div>
          </div>

          {/* Promo banners */}
          <div className="px-3 pt-3 pb-2">
            <div className="rounded-2xl overflow-hidden h-24 relative cursor-pointer"
              style={{background:`linear-gradient(135deg,${BANNERS_ESTO[bannerIdx].g[0]},${BANNERS_ESTO[bannerIdx].g[1]})`,
                boxShadow:'0 4px 16px rgba(0,0,0,0.12)'}}>
              <div className="absolute inset-0 flex items-center px-4 gap-3">
                <div className="flex-shrink-0 relative z-10">
                   {React.createElement(BANNERS_ESTO[bannerIdx].Icon, {size: 36, className: "text-white drop-shadow-md", strokeWidth: 1.5})}
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                    style={{background:'rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.9)'}}>
                    {BANNERS_ESTO[bannerIdx].tag}
                  </span>
                  <p className="text-white font-extrabold text-[14px] leading-snug mt-1">{BANNERS_ESTO[bannerIdx].title}</p>
                  <p className="text-white/60 text-[12px] mt-0.5">{BANNERS_ESTO[bannerIdx].sub}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-2">
              {BANNERS_ESTO.map((_,i)=>(
                <button key={i} onClick={()=>setBannerIdx(i)}
                  className="h-1.5 rounded-full transition"
                  style={{width:i===bannerIdx?20:5,background:i===bannerIdx?PRIMARY:'#C8D8C8'}}/>
              ))}
            </div>
          </div>

          {/* Sort indicator + result count */}
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-[12px] font-bold text-gray-700 truncate mr-2">
              {searchQ ? `"${searchQ}" — ${filtered.length} produk` : `${selectedCats.length===0?'Semua Produk':selectedCats.join(', ')} (${filtered.length})`}
            </p>
            <button onClick={()=>setShowSort(true)}
              className="flex items-center gap-1 text-[11px] font-semibold flex-shrink-0"
              style={{color:'#1B6B3A'}}>
              {SORT_OPTIONS.find(s=>s.id===sortBy)?.label} <ChevronDown size={12}/>
            </button>
          </div>

          {/* Empty state */}
          {filtered.length===0 && (
            <div className="py-16 text-center px-8">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-[14px] font-bold text-gray-900 mb-1">Produk tidak ditemukan</p>
              <p className="text-[12px] text-gray-400">Coba kata kunci lain atau ubah filter kategori</p>
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-2 gap-3 px-3 pb-3">
            {filtered.map(p=>(
              <div key={p.id} className="spotlight-border bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div onClick={()=>p.stock>0&&openDetail(p)} className="w-full text-left cursor-pointer">
                  <div className="h-32 relative flex items-center justify-center shadow-inner" style={{background:p.image?'transparent':(p.g?`linear-gradient(135deg, ${p.g[0]} 0%, ${p.g[1]} 100%)`:'#F5F5F5')}}>
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover border border-black/10"/> : (p.Icon?<p.Icon size={48} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>:<Package size={48} className="text-gray-400"/>)}
                    <button onClick={e=>{e.stopPropagation();toggleLike(p.id)}}
                      className="absolute top-2.5 end-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                      <Heart size={14} className={liked.has(p.id)?'fill-red-500 text-red-500':'text-gray-300'}/>
                    </button>
                    {p.orig && <div className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-lg text-white text-[11px] font-bold" style={{background:'#E53935'}}>DISKON</div>}
                    {p.stock===0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-lg">Stok Habis</span></div>}
                  </div>
                  <div className="p-3 pb-2">
                    <p className="text-[12px] text-gray-400 mb-0.5">{p.cat} · {p.seller}</p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">{p.name}</p>
                    <p className="text-[12px] text-gray-400 mb-2">{p.unit}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={10} className="fill-yellow-400 text-yellow-400"/>
                      <span className="text-[12px] text-gray-500">{p.rating} · {p.sold} terjual</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold tabular-nums" style={{color:PRIMARY}}>Rp {p.price.toLocaleString('id')}</p>
                    {p.orig && <p className="text-[12px] text-gray-400 line-through">Rp {p.orig.toLocaleString('id')}</p>}
                  </div>
                  {p.stock===0 ? (
                    <span className="text-[12px] text-gray-400">Habis</span>
                  ) : cart[p.id] ? (
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>removeFromCart(p.id)} className="w-7 h-7 rounded-full border-2 flex items-center justify-center" style={{borderColor:PRIMARY}}><Minus size={12} style={{color:PRIMARY}}/></button>
                      <span className="text-sm font-bold text-gray-900 w-4 text-center">{cart[p.id]}</span>
                      <button onClick={()=>addToCart(p.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{background:PRIMARY}}><Plus size={12}/></button>
                    </div>
                  ) : (
                    <button onClick={()=>addToCart(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm" style={{background:PRIMARY}}><Plus size={14}/></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* Checkout bar */}
      {totalCart>0 && activeTab==='belanja' && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
          <button onClick={()=>setScreen('checkout')}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
            style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
            <ShoppingCart size={16}/>
            Keranjang ({totalCart}) · <span className="tabular-nums">Rp {totalPrice.toLocaleString('id')}</span>
          </button>
        </div>
      )}

      {/* Product Detail Bottom Sheet */}
      {detail && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end" style={{background:'rgba(0,0,0,.45)'}}>
          {/* Backdrop tap to close */}
          <div className="flex-1" onClick={()=>setDetail(null)}/>
          <div className="bg-white flex flex-col" style={{borderRadius:'20px 20px 0 0',maxHeight:'82%',boxShadow:'0 -4px 32px rgba(0,0,0,0.18)'}}>
            <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
              <div className="w-8 h-1 rounded-full bg-gray-300"/>
            </div>
            <div className="overflow-y-auto no-scrollbar px-5 pb-5">
              <div className="rounded-2xl h-40 flex items-center justify-center shadow-inner mb-4 relative overflow-hidden" style={{background:detail.image?'transparent':(detail.g?`linear-gradient(135deg, ${detail.g[0]} 0%, ${detail.g[1]} 100%)`:'#F5F5F5')}}>
                {detail.image ? <img src={detail.image} alt="" className="w-full h-full object-cover border border-black/10"/> : (detail.Icon?<detail.Icon size={64} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5}/>:<Package size={64} className="text-gray-400"/>)}
                <span className="absolute top-3 end-3 text-xs font-semibold px-2.5 py-1 rounded-xl"
                  style={{background:'rgba(255,255,255,.9)',color:detail.stock<=2?'#E53935':PRIMARY}}>
                  Stok: {detail.stock} {detail.unit}
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900 mb-3">{detail.name}</p>
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'#E8F5E9'}}>
                  <span className="text-xs font-bold" style={{color:PRIMARY}}>{detail.seller[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">{detail.seller}</p>
                  <p className="text-[12px] text-gray-400">Desa Sukamaju</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={11} className="fill-yellow-400 text-yellow-400"/>
                  <span className="text-xs font-medium text-gray-600">{detail.rating} ({detail.sold})</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{detail.desc}</p>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xl font-bold tabular-nums" style={{color:PRIMARY}}>Rp {detail.price.toLocaleString('id')}</p>
                  <p className="text-xs text-gray-400">per {detail.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={()=>setDQty(q=>Math.max(1,q-1))}
                    className="w-9 h-9 rounded-xl border-2 flex items-center justify-center" style={{borderColor:PRIMARY}}>
                    <Minus size={16} style={{color:PRIMARY}}/>
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-6 text-center">{detailQty}</span>
                  <button onClick={()=>setDQty(q=>q+1)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{background:PRIMARY}}>
                    <Plus size={16}/>
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{addToCart(detail.id,detailQty);setDetail(null)}}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border-2"
                  style={{borderColor:PRIMARY,color:PRIMARY}}>
                  + Keranjang
                </button>
                <button onClick={()=>{addToCart(detail.id,detailQty);setDetail(null);setScreen('checkout')}}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white"
                  style={{background:'linear-gradient(135deg, #0C3E1E, #1B6B3A, #15803d)'}}>
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav active="pasar" navigate={navigate}/>
    </div>
  )
}
