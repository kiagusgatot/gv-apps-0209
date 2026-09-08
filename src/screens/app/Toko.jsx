import React, { useState } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Check,
  Wheat,
  Leaf,
  Egg,
  User,
  Package,
  Store,
  Wallet,
  Clock,
  AlertTriangle,
  Settings,
  CreditCard,
  MapPin,
  X,
  TrendingUp,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Truck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Phone,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react'
import TanyaGV from '../../components/TanyaGV'
import BottomNav from '../../components/BottomNav'

const PRIMARY = '#1B6B3A'

const STATUS_CONFIG = {
  waiting:   { label:'Menunggu Konfirmasi', color:'#D97706', bg:'#FEF3C7', border:'#FDE68A' },
  confirmed: { label:'Dikonfirmasi',        color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE' },
  preparing: { label:'Sedang Disiapkan',    color:'#EA580C', bg:'#FFF7ED', border:'#FFEDD5' },
  shipped:   { label:'Dalam Perjalanan',    color:'#059669', bg:'#ECFDF5', border:'#A7F3D0' },
  done:      { label:'Selesai',             color:'#166534', bg:'#F0FDF4', border:'#BBF7D0' },
  cancelled: { label:'Dibatalkan',          color:'#DC2626', bg:'#FEF2F2', border:'#FECACA' },
}

const SELLER_ACTIONS = {
  waiting:   { label:'Konfirmasi Pesanan', next:'confirmed', btnBg:'linear-gradient(135deg, #1B6B3A, #2E7D32)' },
  confirmed: { label:'Mulai Siapkan',      next:'preparing', btnBg:'linear-gradient(135deg, #2563EB, #1D4ED8)' },
  preparing: { label:'Tandai Dikirim',     next:'shipped',   btnBg:'linear-gradient(135deg, #EA580C, #C2410C)' },
  shipped:   null,
  done:      null,
}

const SELLER_PRODUCTS_INIT = [
  { id:101, name:'Beras Pandan Wangi Premium 5kg', price:65000, unit:'5 kg',    stock:48, active:true,  Icon:Wheat, g:['#827717','#9E9D24'], cat:'Pangan',   desc:'Beras pandan wangi premium organik hasil tani desa' },
  { id:102, name:'Sayur Bayam Organik Segar 250g', price:5000,  unit:'250 gr',  stock:120,active:true,  Icon:Leaf, g:['#2E7D32','#4CAF50'], cat:'Sayur',    desc:'Bayam organik segar dipetik langsung pagi hari' },
  { id:103, name:'Telur Ayam Kampung (12 butir)',  price:32000, unit:'12 butir',stock:30, active:true,  Icon:Egg, g:['#D97706','#F59E0B'], cat:'Pangan',   desc:'Telur ayam kampung asli dari peternakan warga' },
  { id:104, name:'Pupuk Organik Kompos 25kg',      price:45000, unit:'25 kg',   stock:2,  active:true,  Icon:Leaf, g:['#2E7D32','#4CAF50'], cat:'Lainnya',  desc:'Pupuk organik kompos siap pakai untuk tanaman kebun' },
  { id:105, name:'Bibit Cabai Rawit Unggul',        price:15000, unit:'50 biji', stock:0,  active:false, Icon:Leaf, g:['#DC2626','#EF4444'], cat:'Lainnya',  desc:'Bibit cabai rawit lokal unggul tahan hama dan penyakit' },
]

const DUMMY_SELLER_ORDERS = [
  {
    id:'GV-S001', date:'Hari ini, 11:23', buyer:'Pak Wahyu', buyerAvIcon:User, payment:'GV Pay',
    delivery:'⚡ Antar Kilat (GV Man)', total:130000, status:'waiting',
    address:'Jl. Mawar No. 12, Desa Bojong, RT 02/RW 04', note:'Mohon antarkan sebelum dzuhur',
    items:[{name:'Beras Pandan Wangi Premium 5kg',qty:2,price:65000,Icon:Wheat,g:['#827717','#9E9D24']}]
  },
  {
    id:'GV-S002', date:'Hari ini, 09:47', buyer:'Bu Rina',   buyerAvIcon:User, payment:'COD (Bayar di Tempat)',
    delivery:'🏪 Ambil Sendiri di Toko', total:50000, status:'confirmed',
    address:'Jl. Anggrek No. 5, Desa Sukamaju', note:'Nanti sore saya mampir ambil',
    items:[
      {name:'Sayur Bayam Organik Segar',qty:2,price:5000,Icon:Leaf,g:['#2E7D32','#4CAF50']},
      {name:'Telur Ayam Kampung (12 butir)',qty:1,price:32000,Icon:Egg,g:['#D97706','#F59E0B']},
      {name:'Sayur Bayam Organik Segar',qty:2,price:5000,Icon:Leaf,g:['#2E7D32','#4CAF50']}
    ]
  },
  {
    id:'GV-S003', date:'Kemarin, 15:10', buyer:'Pak Hendra', buyerAvIcon:User, payment:'QRIS Desa',
    delivery:'🚚 Kurir Reguler Desa', total:60000, status:'done',
    address:'Jl. Melati No. 3, Desa Ciawi, RT 01/RW 02', note:'Titip di teras jika tidak ada orang',
    items:[
      {name:'Pupuk Organik Kompos 25kg',qty:1,price:45000,Icon:Leaf,g:['#2E7D32','#4CAF50']},
      {name:'Bibit Cabai Rawit Unggul',qty:1,price:15000,Icon:Leaf,g:['#DC2626','#EF4444']}
    ]
  },
]

// ── Detail Pesanan Bottom Sheet ─────────────────────────────
function SellerOrderSheet({ order, onClose, onUpdateStatus }) {
  const st     = STATUS_CONFIG[order.status]
  const action = SELLER_ACTIONS[order.status]

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose}/>
      <div className="relative bg-white flex flex-col rounded-t-3xl max-h-[88%] shadow-2xl overflow-hidden">
        {/* Pull Handle */}
        <div className="flex justify-center pt-3 pb-1.5 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-surface-200"/>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3.5 border-b border-surface-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black text-surface-900 tracking-tight">{order.id}</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                style={{background:st.bg, color:st.color, borderColor:st.border}}>
                {st.label}
              </span>
            </div>
            <p className="text-[11.5px] text-surface-400 font-medium mt-0.5">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100 transition">
            <X size={18}/>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
          {/* Buyer Info Card */}
          <div className="bg-surface-50 p-3.5 rounded-2xl border border-surface-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-100/80 text-emerald-800">
              <User size={18} strokeWidth={2.2}/>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-surface-900">{order.buyer}</p>
              <p className="text-[11.5px] text-surface-500 mt-0.5 leading-snug flex items-center gap-1">
                <MapPin size={11} className="text-surface-400 flex-shrink-0"/>
                <span className="truncate">{order.address}</span>
              </p>
              {order.note && (
                <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800 font-medium leading-relaxed">
                  💬 <span className="font-semibold">Catatan:</span> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Items Dipesan */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2.5">
              PRODUK YANG DIPESAN ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item, i)=>(
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-surface-100 shadow-2xs">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                    style={{background:`linear-gradient(135deg,${item.g[0]},${item.g[1]})`}}>
                    <item.Icon size={20} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.7}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-surface-900 truncate">{item.name}</p>
                    <p className="text-[11.5px] text-surface-400 mt-0.5">{item.qty} × Rp {item.price.toLocaleString('id')}</p>
                  </div>
                  <p className="text-[13px] font-black text-emerald-700 flex-shrink-0">
                    Rp {(item.qty*item.price).toLocaleString('id')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian Transaksi */}
          <div className="bg-surface-50 p-3.5 rounded-2xl border border-surface-100 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-surface-500">Metode Pembayaran</span>
              <span className="font-bold text-surface-900">{order.payment}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-surface-500">Pilihan Pengiriman</span>
              <span className="font-bold text-surface-900">{order.delivery}</span>
            </div>
            <div className="h-px bg-surface-200/80 my-1"/>
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-extrabold text-surface-900">Total Pembayaran</span>
              <span className="font-black text-[16px] text-emerald-700">Rp {order.total.toLocaleString('id')}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-surface-100 bg-white">
          {action ? (
            <button onClick={()=>{onUpdateStatus(order.id, action.next); onClose()}}
              className="w-full h-12 rounded-2xl text-[13.5px] font-bold text-white shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{background: action.btnBg}}>
              <span>{action.label}</span>
              <ChevronRight size={16}/>
            </button>
          ) : order.status==='done' ? (
            <div className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[13px]">
              <CheckCircle2 size={18} className="text-emerald-600"/>
              <span>Pesanan Telah Selesai & Diterima Pembeli</span>
            </div>
          ) : (
            <div className="w-full h-12 rounded-2xl flex items-center justify-center bg-surface-100 text-surface-500 font-semibold text-[13px]">
              Menunggu Kurir Menyelesaikan Pengiriman
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Modal Tambah / Edit Produk ──────────────────────────────
function ProductFormModal({ product, onClose, onSave }) {
  const [name, setName]   = useState(product?.name || '')
  const [price, setPrice] = useState(product?.price || '')
  const [unit, setUnit]   = useState(product?.unit || 'kg')
  const [stock, setStock] = useState(product?.stock !== undefined ? product.stock : 10)
  const [cat, setCat]     = useState(product?.cat || 'Pangan')
  const [desc, setDesc]   = useState(product?.desc || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !price) return
    onSave({
      id: product?.id || Date.now(),
      name,
      price: Number(price),
      unit,
      stock: Number(stock),
      cat,
      active: Number(stock) > 0,
      Icon: cat === 'Sayur' ? Leaf : cat === 'Telur' ? Egg : Wheat,
      g: cat === 'Sayur' ? ['#2E7D32','#4CAF50'] : cat === 'Lainnya' ? ['#C62828','#EF5350'] : ['#827717','#9E9D24'],
      desc: desc || 'Produk berkualitas dari toko desa'
    })
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white flex flex-col rounded-t-3xl max-h-[85%] shadow-2xl p-5 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3.5 border-b border-surface-100">
          <div>
            <h3 className="font-black text-[16px] text-surface-900">
              {product ? 'Edit Produk Toko' : 'Tambah Produk Baru'}
            </h3>
            <p className="text-[11.5px] text-surface-400 mt-0.5">
              Lengkapi informasi produk agar siap tampil di Pasar ESTO
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Nama Produk</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Beras Pandan Wangi Premium 5kg"
              className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-surface-900 outline-none focus:border-emerald-600 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Harga Jual (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="cth. 65000"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-emerald-800 outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Satuan</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg, ikat, bungkus"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-800 outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Jumlah Stok Awal</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-surface-900 outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Kategori</label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2.5 text-[13px] font-medium text-surface-800 outline-none focus:border-emerald-600 focus:bg-white transition"
              >
                <option value="Pangan">Pangan Pokok</option>
                <option value="Sayur">Sayur & Buah</option>
                <option value="Olahan">Olahan Desa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Jelaskan kualitas dan keunggulan produk Anda..."
              className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[12.5px] text-surface-800 outline-none focus:border-emerald-600 focus:bg-white transition resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-2xl text-white font-bold text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
            >
              <Check size={16} />
              <span>Simpan Produk Toko</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal Tarik Saldo Penjualan ──────────────────────────────
function WithdrawModal({ balance, bankName, accountNumber, onClose, onSuccess }) {
  const [amount, setAmount] = useState(balance)
  const [submitting, setSubmitting] = useState(false)

  const handleWithdraw = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSuccess(amount)
      onClose()
    }, 800)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose}/>
      <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-surface-100">
          <div>
            <h3 className="text-[16px] font-black text-surface-900">Pencairan Saldo Penjualan</h3>
            <p className="text-[11.5px] text-surface-400 mt-0.5">Tarik dana hasil jualan langsung ke rekening terdaftar</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100">
            <X size={18}/>
          </button>
        </div>

        {/* Info Rekening Tujuan */}
        <div className="p-3.5 rounded-2xl bg-surface-50 border border-surface-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <Wallet size={18}/>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-surface-400 font-bold uppercase tracking-wider">Rekening Tujuan</p>
            <p className="text-[13px] font-extrabold text-surface-900 truncate">{bankName}</p>
            <p className="text-[11.5px] text-surface-500 font-mono mt-0.5">{accountNumber}</p>
          </div>
        </div>

        <div>
          <label className="block text-[11.5px] font-bold text-surface-600 mb-1">Nominal Pencairan</label>
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-[14px] font-bold text-surface-400">Rp</span>
            <input
              type="number"
              max={balance}
              value={amount}
              onChange={(e)=>setAmount(Number(e.target.value))}
              className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-10 pr-3.5 py-2.5 text-[15px] font-black text-surface-900 outline-none focus:border-emerald-600"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {[100000, 500000, balance].map((val)=>(
              <button key={val} type="button" onClick={()=>setAmount(val)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${amount===val?'bg-emerald-50 text-emerald-800 border-emerald-300':'bg-surface-50 text-surface-600 border-surface-200'}`}>
                {val===balance ? 'Tarik Semua' : `Rp ${(val/1000).toFixed(0)}rb`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={submitting || amount <= 0 || amount > balance}
          className="w-full h-12 rounded-2xl text-white font-bold text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
        >
          {submitting ? (
            <RefreshCw size={16} className="animate-spin text-white"/>
          ) : (
            <>
              <ArrowUpRight size={16}/>
              <span>Konfirmasi Tarik Dana</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD PENJUAL TOKO SAYA ────────────────────────
export default function Toko({ navigate, userData, userProfile }) {
  const [sellerOrders, setSelOrders]  = useState(DUMMY_SELLER_ORDERS)
  const [selOrderSheet,setSelSheet]   = useState(null)
  const [activeTab,    setActiveTab]  = useState('orders') // 'orders' | 'products' | 'settings'
  const [selProdsData, setSelProds]   = useState(SELLER_PRODUCTS_INIT)
  const [showAddProd,  setAddProd]    = useState(false)
  const [editProd,     setEditProd]   = useState(null)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [balance, setBalance]         = useState(1485000)
  const [toastMsg, setToastMsg]       = useState(null)
  const [tanyaOpen,    setTanyaOpen]  = useState(false)
  
  // Status Operasional Toko
  const [isStoreOpen, setIsStoreOpen] = useState(true)

  // Toko profile settings
  const [storeSettings, setStoreSettings] = useState({
    name: 'Toko Berkah Tani Bojong',
    category: 'Sayur, Buah & Pangan Pokok',
    address: userData?.desa ? `RT 02 / RW 04, ${userData.desa}` : 'RT 03/RW 01, Dusun Karanganyar',
    phone: userData?.phone || '0812-3456-7890',
    bankName: 'GV Pay (Dompet Digital Desa)',
    accountNumber: userData?.phone || '0812-3456-7890',
    accountHolder: userData?.name || userProfile?.name || 'Pak Budi Santoso',
  })

  // Perhitungan stok menipis
  const lowStockProducts = selProdsData.filter((p) => p.stock <= 2)

  // Order filters
  const [orderFilter, setOrderFilter] = useState('all') // 'all' | 'waiting' | 'process' | 'done'
  const filteredOrders = sellerOrders.filter(o => {
    if (orderFilter === 'waiting') return o.status === 'waiting'
    if (orderFilter === 'process') return ['confirmed', 'preparing', 'shipped'].includes(o.status)
    if (orderFilter === 'done') return o.status === 'done'
    return true
  })

  // Product filters
  const [prodFilter, setProdFilter] = useState('all') // 'all' | 'active' | 'low' | 'empty'
  const filteredProducts = selProdsData.filter((p) => {
    if (prodFilter === 'active') return p.stock > 2
    if (prodFilter === 'low') return p.stock > 0 && p.stock <= 2
    if (prodFilter === 'empty') return p.stock === 0
    return true
  })

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* ── HEADER SCREEN ── */}
      <ScreenHeader
        title="Toko Saya"
        subtitle="Dashboard Penjual Pasar ESTO"
        onBack={() => navigate('profile')}
        actions={
          <div
            onClick={() => {
              setIsStoreOpen(!isStoreOpen)
              triggerToast(isStoreOpen ? 'Toko disetel Tutup / Libur sementara' : 'Toko berhasil Dibuka kembali!')
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border cursor-pointer select-none transition ${
              isStoreOpen
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                : 'bg-red-500/20 text-red-200 border-red-400/40 hover:bg-red-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`}/>
            <span className="text-[11px] font-black">{isStoreOpen ? 'Buka' : 'Libur'}</span>
          </div>
        }
      />

      {/* Floating Feedback Toast */}
      {toastMsg && (
        <div className="absolute top-16 left-4 right-4 z-40 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between text-[12px] font-bold animate-fade-in">
          <span>{toastMsg}</span>
          <button onClick={()=>setToastMsg(null)} className="text-white/60 hover:text-white"><X size={14}/></button>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Modal Sheet Detail Pesanan */}
        {selOrderSheet && (
          <SellerOrderSheet
            order={selOrderSheet}
            onClose={() => setSelSheet(null)}
            onUpdateStatus={(id, next) => {
              setSelOrders((p) => p.map((o) => (o.id === id ? { ...o, status: next } : o)))
              triggerToast(`Status pesanan ${id} berhasil diperbarui`)
            }}
          />
        )}

        {/* Modal Tambah / Edit Produk */}
        {(showAddProd || editProd) && (
          <ProductFormModal
            product={editProd}
            onClose={() => {
              setAddProd(false)
              setEditProd(null)
            }}
            onSave={(saved) => {
              if (editProd) {
                setSelProds((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
                triggerToast(`Produk "${saved.name}" berhasil diperbarui`)
              } else {
                setSelProds((prev) => [saved, ...prev])
                triggerToast(`Produk baru "${saved.name}" berhasil ditambahkan`)
              }
            }}
          />
        )}

        {/* Modal Tarik Saldo */}
        {showWithdraw && (
          <WithdrawModal
            balance={balance}
            bankName={storeSettings.bankName}
            accountNumber={storeSettings.accountNumber}
            onClose={()=>setShowWithdraw(false)}
            onSuccess={(wAmount)=>{
              setBalance(b => b - wAmount)
              triggerToast(`Pencairan dana Rp ${wAmount.toLocaleString('id')} sedang diproses ke ${storeSettings.bankName}!`)
            }}
          />
        )}

        {/* ── 1. HERO STORE & FINANCIAL CARD ── */}
        <div className="px-4 pt-3 flex-shrink-0">
          <div
            className="rounded-3xl p-4 bg-white border border-surface-100 shadow-sm relative overflow-hidden"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            {/* Store Profile Top Row */}
            <div className="flex items-center gap-3 pb-3 border-b border-surface-100">
              {/* Emblem Toko */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-[15px] flex-shrink-0 shadow-md relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 60%, #1B6B3A 100%)' }}
              >
                <span>TBT</span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <ShieldCheck size={10} className="text-white"/>
                </span>
              </div>

              {/* Title & Badge */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-[14.5px] font-black text-surface-900 truncate leading-snug">
                    {storeSettings.name}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-0.5">
                    <ShieldCheck size={10} className="text-emerald-600"/> Terverifikasi ESTO
                  </span>
                  <span className="text-[10.5px] text-surface-400">
                    ⭐ 4.9 · 1.2rb+ terjual
                  </span>
                </div>
              </div>

              {/* Status Operasional Mini Badge */}
              <button
                type="button"
                onClick={() => setIsStoreOpen(!isStoreOpen)}
                className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition active:scale-95 ${
                  isStoreOpen ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-surface-100 text-surface-500 border border-surface-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-500' : 'bg-surface-400'}`}/>
                <span>{isStoreOpen ? 'Buka' : 'Tutup'}</span>
              </button>
            </div>

            {/* Financial Box */}
            <div className="mt-3 p-3.5 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-surface-400 uppercase tracking-wider">
                  <Wallet size={12} className="text-emerald-700"/>
                  <span>Saldo Siap Tarik</span>
                </div>
                <p className="text-[18px] font-black text-surface-900 leading-tight mt-0.5 tracking-tight">
                  Rp {balance.toLocaleString('id')}
                </p>
                <p className="text-[11px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <TrendingUp size={11}/>
                  <span>+ Rp 890.000 omzet hari ini</span>
                </p>
              </div>

              <button
                onClick={() => setShowWithdraw(true)}
                className="flex-shrink-0 px-3.5 py-2 rounded-xl text-white font-extrabold text-[12px] shadow-sm active:scale-95 transition flex items-center gap-1"
                style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E7D32)' }}
              >
                <span>Tarik Saldo</span>
                <ArrowUpRight size={13}/>
              </button>
            </div>

            {/* 3 Metric Stats Pill */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-surface-100 text-center">
              <div className="px-1">
                <p className="text-[15px] font-black text-amber-700">
                  {sellerOrders.filter((o) => o.status === 'waiting').length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mt-0.5">Pesanan Baru</p>
              </div>
              <div className="px-1 border-x border-surface-100">
                <p className="text-[15px] font-black text-surface-900">
                  {selProdsData.filter((p) => p.stock > 0).length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mt-0.5">Produk Aktif</p>
              </div>
              <div className="px-1">
                <p className="text-[15px] font-black text-emerald-700">99.2%</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mt-0.5">Tepat Waktu</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. SMART ALERT: STOK MENIPIS ── */}
        {lowStockProducts.length > 0 && activeTab !== 'settings' && (
          <div className="px-4 pt-2.5 flex-shrink-0">
            <div
              onClick={() => {
                setActiveTab('products')
                setProdFilter('low')
              }}
              className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-200/60 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={14} />
                </div>
                <p className="text-[12px] text-amber-900 font-bold truncate">
                  {lowStockProducts.length} produk stok menipis / habis
                </p>
              </div>
              <span className="text-[11.5px] font-extrabold text-amber-800 flex-shrink-0 flex items-center gap-0.5">
                Atur Stok <ChevronRight size={13} />
              </span>
            </div>
          </div>
        )}

        {/* ── 3. NAV TABS SEGMENTED ── */}
        <div className="px-4 pt-3 flex-shrink-0">
          <div className="bg-surface-100 p-1 rounded-2xl flex gap-1 border border-surface-200/60">
            {[
              { id: 'orders', label: 'Pesanan Masuk', count: sellerOrders.filter(o => o.status === 'waiting').length },
              { id: 'products', label: 'Produk & Stok', count: selProdsData.length },
              { id: 'settings', label: 'Pengaturan Toko' }
            ].map(tab => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition flex items-center justify-center gap-1.5 relative ${
                    active ? 'bg-white text-surface-900 shadow-xs' : 'text-surface-500 hover:text-surface-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-full ${
                      active && tab.id === 'orders' ? 'bg-amber-500 text-white' : 'bg-surface-200 text-surface-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════ */}
        {/* ── TAB 1: PESANAN MASUK ──────────────────────────────── */}
        {/* ═════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Status Filter Chips */}
            <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar flex-shrink-0">
              {[
                { id: 'all', label: `Semua (${sellerOrders.length})` },
                { id: 'waiting', label: `Perlu Diproses (${sellerOrders.filter(o=>o.status==='waiting').length})` },
                { id: 'process', label: `Disiapkan / Jalan (${sellerOrders.filter(o=>['confirmed','preparing','shipped'].includes(o.status)).length})` },
                { id: 'done', label: `Selesai (${sellerOrders.filter(o=>o.status==='done').length})` },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
                    orderFilter === f.id
                      ? 'bg-surface-900 text-white border-surface-900 shadow-2xs'
                      : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List Order Cards */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-3 pb-24">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-surface-100 shadow-sm mt-2">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-surface-100 text-surface-400 mb-3">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-[14.5px] font-bold text-surface-900">Tidak ada pesanan</h4>
                  <p className="text-[12px] text-surface-400 mt-1 max-w-[240px] mx-auto">
                    Pesanan baru pembeli akan langsung terdata dan dapat dikonfirmasi di sini
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const st = STATUS_CONFIG[order.status]
                  const action = SELLER_ACTIONS[order.status]

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm transition hover:shadow-brand-sm flex flex-col gap-3"
                    >
                      {/* Card Header: Order ID + Status Pill */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-surface-100">
                        <div>
                          <p className="text-[12.5px] font-black text-surface-900 tracking-tight">{order.id}</p>
                          <p className="text-[11px] text-surface-400 mt-0.5">{order.date}</p>
                        </div>
                        <span
                          className="text-[10.5px] font-extrabold px-2.5 py-1 rounded-full border"
                          style={{ background: st.bg, color: st.color, borderColor: st.border }}
                        >
                          {st.label}
                        </span>
                      </div>

                      {/* Buyer & Delivery Info */}
                      <div className="flex items-center justify-between text-[12px]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                            {order.buyer.charAt(0)}
                          </div>
                          <span className="font-extrabold text-surface-900 truncate">{order.buyer}</span>
                        </div>
                        <span className="text-[11px] font-bold text-surface-500 bg-surface-100 px-2 py-0.5 rounded-md flex-shrink-0">
                          {order.delivery}
                        </span>
                      </div>

                      {/* Item Preview Strip */}
                      <div className="bg-surface-50 p-2.5 rounded-2xl border border-surface-100 flex items-center gap-2.5">
                        <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-white shadow-xs"
                              style={{ background: `linear-gradient(135deg, ${item.g[0]}, ${item.g[1]})` }}
                            >
                              <item.Icon size={14} className="text-white" />
                            </div>
                          ))}
                        </div>
                        <p className="text-[12px] text-surface-700 truncate font-medium flex-1">
                          {order.items.map((i) => `${i.name} (${i.qty}x)`).join(', ')}
                        </p>
                      </div>

                      {/* Total & Action Footer */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-[10.5px] font-bold uppercase tracking-wider text-surface-400">Total Tagihan</p>
                          <p className="text-[15px] font-black text-emerald-700 tracking-tight">
                            Rp {order.total.toLocaleString('id')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelSheet(order)}
                            className="px-3 py-2 rounded-xl text-[12px] font-bold text-surface-700 bg-surface-100 hover:bg-surface-200 transition active:scale-95"
                          >
                            Detail
                          </button>
                          {action && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelOrders((p) => p.map((o) => (o.id === order.id ? { ...o, status: action.next } : o)))
                                triggerToast(`Pesanan ${order.id} berhasil diupdate ke: ${action.label}`)
                              }}
                              className="px-3.5 py-2 rounded-xl text-[12px] font-bold text-white shadow-sm transition active:scale-95 flex items-center gap-1"
                              style={{ background: action.btnBg }}
                            >
                              <span>{action.label}</span>
                              <ChevronRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════ */}
        {/* ── TAB 2: PRODUK & STOK ──────────────────────────────── */}
        {/* ═════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Header Toolbar: Filter Chips & Action */}
            <div className="flex items-center justify-between px-4 py-2.5 gap-2 flex-shrink-0">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
                {[
                  ['all', `Semua (${selProdsData.length})`],
                  ['active', `Stok Aman (${selProdsData.filter((p) => p.stock > 2).length})`],
                  ['low', `Menipis (${selProdsData.filter((p) => p.stock > 0 && p.stock <= 2).length})`],
                  ['empty', `Habis (${selProdsData.filter((p) => p.stock === 0).length})`],
                ].map(([id, lbl]) => (
                  <button
                    key={id}
                    onClick={() => setProdFilter(id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
                      prodFilter === id
                        ? 'bg-surface-900 text-white border-surface-900 shadow-2xs'
                        : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setAddProd(true)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-bold text-white shadow-sm active:scale-95 transition flex items-center gap-1"
                style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
              >
                <Plus size={13} />
                <span>Tambah</span>
              </button>
            </div>

            {/* List Produk Cards */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-3 pb-24">
              {filteredProducts.map((p) => {
                const isLow = p.stock > 0 && p.stock <= 2
                const isEmpty = p.stock === 0

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm flex items-start gap-3.5 transition hover:shadow-brand-sm"
                  >
                    {/* Thumbnail Product */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden relative"
                      style={{ background: `linear-gradient(135deg,${p.g[0]},${p.g[1]})` }}
                    >
                      <p.Icon
                        size={26}
                        className="text-white drop-shadow-sm relative z-10"
                        strokeWidth={1.6}
                      />
                      <span className="absolute top-1 left-1 text-[9px] font-bold px-1 rounded bg-black/30 text-white">
                        {p.cat}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-bold text-surface-900 line-clamp-1 leading-snug">
                        {p.name}
                      </p>
                      <p className="text-[13px] font-black text-emerald-700 mt-0.5">
                        Rp {p.price.toLocaleString('id')}{' '}
                        <span className="text-[11px] text-surface-400 font-normal">/ {p.unit}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {/* Stock Badge */}
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            isEmpty
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isEmpty
                            ? '✕ Stok Habis'
                            : isLow
                            ? `⚠️ Sisa ${p.stock} unit`
                            : `✓ Tersedia: ${p.stock} unit`}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditProd(p)}
                        className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-600 transition active:scale-95"
                        title="Edit Produk"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newStock = prompt(`Ubah jumlah stok untuk ${p.name}:`, p.stock)
                          if (newStock !== null && !isNaN(Number(newStock))) {
                            const val = Math.max(0, Number(newStock))
                            setSelProds(prev => prev.map(item => item.id === p.id ? { ...item, stock: val, active: val > 0 } : item))
                            triggerToast(`Stok ${p.name} diubah menjadi ${val}`)
                          }
                        }}
                        className="px-2 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10.5px] font-black active:scale-95 transition text-center"
                        title="Ubah Stok Cepat"
                      >
                        ± Stok
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════ */}
        {/* ── TAB 3: PENGATURAN TOKO & REKENING ─────────────────── */}
        {/* ═════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-4 pb-28">
            {/* Card 1: Status Operasional */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[13.5px] font-black text-surface-900">
                  Status Operasional Toko
                </p>
                <p className="text-[11.5px] text-surface-500 mt-0.5">
                  {isStoreOpen
                    ? 'Toko aktif & dapat menerima pesanan warga'
                    : 'Toko tutup sementara (tidak menerima pesanan baru)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsStoreOpen(!isStoreOpen)
                  triggerToast(isStoreOpen ? 'Toko disetel Tutup' : 'Toko disetel Buka')
                }}
                className="transition-transform active:scale-95"
              >
                {isStoreOpen ? (
                  <ToggleRight size={38} className="text-emerald-700" />
                ) : (
                  <ToggleLeft size={38} className="text-surface-300" />
                )}
              </button>
            </div>

            {/* Card 2: Informasi Toko */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-surface-400">
                  INFORMASI & ALAMAT PENJEMPUTAN
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Mitra ESTO Desa
                </span>
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Nama Toko
                </label>
                <input
                  type="text"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, name: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-extrabold text-surface-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Kategori Utama Toko
                </label>
                <input
                  type="text"
                  value={storeSettings.category}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, category: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-800 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Alamat Penjemputan Kurir GV Man
                </label>
                <input
                  type="text"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, address: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-800 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Nomor WhatsApp Toko
                </label>
                <input
                  type="text"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-800 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Card 3: Rekening Pencairan Hasil Jual */}
            <div className="bg-white rounded-3xl p-4 border border-surface-100 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-surface-400">
                  REKENING PENCAIRAN HASIL JUAL
                </span>
                <Wallet size={16} className="text-emerald-700" />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Metode / Bank Tujuan
                </label>
                <input
                  type="text"
                  value={storeSettings.bankName}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, bankName: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-surface-800 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Nomor Rekening / No GV Pay
                </label>
                <input
                  type="text"
                  value={storeSettings.accountNumber}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, accountNumber: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-mono font-black text-surface-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  value={storeSettings.accountHolder}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, accountHolder: e.target.value }))}
                  className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-surface-800 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <button
              type="button"
              onClick={() => triggerToast('Pengaturan toko dan rekening berhasil disimpan!')}
              className="w-full h-12 rounded-2xl text-white font-bold text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
            >
              <Check size={16} />
              <span>Simpan Perubahan Pengaturan</span>
            </button>
          </div>
        )}
      </div>

      <TanyaGV
        currentScreen="toko"
        navigate={navigate}
        openFromParent={tanyaOpen}
        onCloseParent={() => setTanyaOpen(false)}
      />
      <BottomNav active="profile" navigate={navigate} />
    </ScreenBackground>
  )
}
