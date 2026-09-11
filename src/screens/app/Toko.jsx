import React, { useState, useEffect } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
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
  ArrowUpRight,
  MessageCircle,
  Send,
  Calendar,
  RotateCcw,
  Search,
  CheckCheck
} from 'lucide-react'
import TanyaGV from '../../components/TanyaGV'
import BottomNav from '../../components/BottomNav'
import LocationPickerMap from '@/components/maps/LocationPickerMap'
import {
  DEFAULT_STORE_SCHEDULE,
  DAY_OPTIONS,
  getStoredSchedule,
  calculateStoreStatus,
  saveStoredSchedule
} from '@/utils/storeSchedule'
import {
  useStock,
  restoreStock,
} from '@/utils/stockStore'

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
        <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-surface-100 bg-white space-y-2">
          {action ? (
            <>
              <button onClick={()=>{onUpdateStatus(order.id, action.next); onClose()}}
                className="w-full h-12 rounded-2xl text-[13.5px] font-bold text-white shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
                style={{background: action.btnBg}}>
                <span>{action.label}</span>
                <ChevronRight size={16}/>
              </button>
              {['waiting', 'confirmed'].includes(order.status) && (
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(order.id, 'cancelled')
                    onClose()
                  }}
                  className="w-full h-10 rounded-xl text-[12px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                >
                  <X size={14} />
                  <span>Tolak / Batalkan Pesanan (Kembalikan Stok)</span>
                </button>
              )}
            </>
          ) : order.status==='done' ? (
            <div className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[13px]">
              <CheckCircle2 size={18} className="text-emerald-600"/>
              <span>Pesanan Telah Selesai & Diterima Pembeli</span>
            </div>
          ) : order.status==='cancelled' ? (
            <div className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-800 font-bold text-[13px]">
              <AlertTriangle size={18} className="text-red-600"/>
              <span>Pesanan Dibatalkan (Stok Telah Dikembalikan)</span>
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
      iconName: cat === 'Sayur' ? 'Leaf' : cat === 'Telur' ? 'Egg' : 'Wheat',
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

// ── Dummy Chat Pelanggan Awal ────────────────────────────────
const DUMMY_STORE_CHATS_INIT = [
  {
    id: 'chat_001',
    buyerName: 'Pak Wahyu',
    buyerPhone: '0812-3344-5566',
    sellerName: 'Pak Budi',
    storeName: 'Toko Berkah Tani Bojong',
    orderRef: 'GV-S001',
    lastTime: '11:25',
    unreadCount: 1,
    buyerUnreadCount: 0,
    lastMessage: 'Pak, tolong beras pandan wanginya pilih yang baru panen ya',
    messages: [
      { id: 1, from: 'buyer', text: 'Halo Pak Budi, beras pandan wangi 5kg ready?', time: '11:20' },
      { id: 2, from: 'seller', text: 'Ready Pak Wahyu, baru digiling kemarin sore kualitas super.', time: '11:22' },
      { id: 3, from: 'buyer', text: 'Pak, tolong beras pandan wanginya pilih yang baru panen ya', time: '11:25' },
    ]
  },
  {
    id: 'chat_002',
    buyerName: 'Bu Rina',
    buyerPhone: '0813-8899-0011',
    sellerName: 'Pak Budi',
    storeName: 'Toko Berkah Tani Bojong',
    orderRef: 'GV-S002',
    lastTime: '10:02',
    unreadCount: 0,
    buyerUnreadCount: 0,
    lastMessage: 'Baik Bu Rina, sayur bayam dan telurnya sudah disiapkan di toko.',
    messages: [
      { id: 1, from: 'buyer', text: 'Permisi Pak, sayur bayamnya masih ada 2 ikat?', time: '09:55' },
      { id: 2, from: 'seller', text: 'Baik Bu Rina, sayur bayam dan telurnya sudah disiapkan di toko.', time: '10:02' },
    ]
  },
  {
    id: 'chat_003',
    buyerName: 'Pak Hendra',
    buyerPhone: '0857-1122-3344',
    sellerName: 'Pak Budi',
    storeName: 'Toko Berkah Tani Bojong',
    orderRef: 'GV-S003',
    lastTime: 'Kemarin',
    unreadCount: 0,
    buyerUnreadCount: 0,
    lastMessage: 'Terima kasih banyak bibit cabai rawitnya sudah sampai.',
    messages: [
      { id: 1, from: 'buyer', text: 'Terima kasih banyak bibit cabai rawitnya sudah sampai.', time: 'Kemarin 16:15' },
      { id: 2, from: 'seller', text: 'Sama-sama Pak Hendra, semoga tanamannya tumbuh subur!', time: 'Kemarin 16:20' }
    ]
  }
]

// ── Sheet Percakapan Chat Pelanggan ─────────────────────────
function SellerChatSheet({ chat, onClose, onSendMessage, relatedOrder, onOpenOrder }) {
  const [inputText, setInputText] = useState('')
  const [activeChipCategory, setActiveChipCategory] = useState('all') // 'all' | 'stock' | 'shipping' | 'general'
  const messagesEndRef = React.useRef(null)

  const QUICK_REPLY_CATEGORIES = [
    {
      id: 'stock',
      label: 'Stok',
      replies: [
        'Halo, barang ready kualitas super siap dipesan ya!',
        'Stok ready baru dipetik/panen pagi ini.',
        'Maaf untuk produk ini stoknya sedang habis.',
      ]
    },
    {
      id: 'shipping',
      label: 'Kirim',
      replies: [
        'Pesanan sedang kami siapkan, segera diantar kurir!',
        'Barang sudah siap dibungkus, bisa langsung ambil di toko.',
        'Bisa diantar kurir kilat GV Man hari ini juga ya.',
      ]
    },
    {
      id: 'general',
      label: 'Pelayanan',
      replies: [
        'Siap Pak/Bu, kami pilihkan yang paling bagus.',
        'Terima kasih banyak sudah belanja di toko kami! 🙏',
        'Toko kami buka setiap hari jam 07.00 - 17.00 WIB.',
      ]
    },
  ]

  const allQuickReplies = [
    'Halo, barang ready kualitas super siap dipesan ya!',
    'Pesanan sedang disiapkan, segera diantar kurir!',
    'Barang sudah siap dibungkus, bisa langsung ambil di toko.',
    'Siap Pak/Bu, kami pilihkan yang paling bagus.',
    'Terima kasih banyak sudah belanja di toko kami! 🙏',
  ]

  const displayedReplies = activeChipCategory === 'all'
    ? allQuickReplies
    : QUICK_REPLY_CATEGORIES.find(c => c.id === activeChipCategory)?.replies || allQuickReplies

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages])

  const handleSend = (textToSend) => {
    const txt = (textToSend || inputText).trim()
    if (!txt) return
    onSendMessage(chat.id, txt)
    setInputText('')
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white flex flex-col rounded-t-3xl max-h-[92%] h-[85%] shadow-2xl overflow-hidden">
        {/* Pull Handle */}
        <div className="flex justify-center pt-3 pb-1.5 flex-shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-surface-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3.5 border-b border-surface-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 flex items-center justify-center font-black text-[14px] flex-shrink-0 shadow-2xs">
              {chat.buyerName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[14.5px] text-surface-900 tracking-tight truncate">
                  {chat.buyerName}
                </h3>
                {chat.orderRef && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
                    {chat.orderRef}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-surface-400 font-medium truncate">
                {chat.buyerPhone || 'Pelanggan Toko'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {chat.buyerPhone && (
              <a
                href={`tel:${chat.buyerPhone}`}
                className="p-2 rounded-xl text-surface-500 hover:bg-emerald-50 hover:text-emerald-700 transition active:scale-95"
                title="Hubungi Pembeli"
              >
                <Phone size={17} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-surface-400 hover:bg-surface-100 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAF9]">
          {/* Related Order Context Banner */}
          {relatedOrder && (
            <div
              onClick={() => onOpenOrder && onOpenOrder(relatedOrder)}
              className="bg-white rounded-2xl p-3 border border-amber-200/90 shadow-2xs flex items-center justify-between cursor-pointer hover:bg-amber-50/40 transition mb-2 active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <Package size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-black text-surface-900 tracking-tight flex items-center gap-1.5 truncate">
                    <span>Pesanan {relatedOrder.id}</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      {STATUS_CONFIG[relatedOrder.status]?.label || relatedOrder.status}
                    </span>
                  </p>
                  <p className="text-[11px] text-surface-500 truncate mt-0.5">
                    Total: <span className="font-extrabold text-emerald-800">Rp {relatedOrder.total.toLocaleString('id')}</span> ({relatedOrder.items?.length || 1} produk)
                  </p>
                </div>
              </div>
              <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex-shrink-0 flex items-center gap-0.5">
                Lihat <ChevronRight size={12} />
              </span>
            </div>
          )}

          {chat.messages.map((m, idx) => {
            const isSeller = m.from === 'seller'
            return (
              <div
                key={m.id || idx}
                className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[12.5px] shadow-2xs leading-relaxed ${
                    isSeller
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-white text-surface-900 border border-surface-200/80 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-surface-400 font-medium mt-1 px-1">
                  <span>{m.time}</span>
                  {isSeller && <span className="text-emerald-600 font-bold">✓✓</span>}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Header & Categorized Chips */}
        <div className="flex-shrink-0 px-4 pt-2.5 pb-1 border-t border-surface-100 bg-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-surface-400 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" />
              Balas Cepat (Quick Reply)
            </span>
            <div className="flex gap-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'stock', label: 'Stok' },
                { id: 'shipping', label: 'Kirim' },
                { id: 'general', label: 'Umum' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveChipCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold transition ${
                    activeChipCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-surface-100 text-surface-500 hover:text-surface-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Reply Chips Horizontal Scroll */}
          <div className="overflow-x-auto no-scrollbar flex gap-1.5 pb-2">
            {displayedReplies.map((qr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qr)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/70 text-[11px] font-semibold transition active:scale-95 text-left"
              >
                💬 {qr}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex-shrink-0 p-3.5 pb-6 border-t border-surface-100 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Tulis balasan untuk pembeli..."
            className="flex-1 bg-surface-50 border border-surface-200 rounded-2xl px-4 py-2.5 text-[12.5px] text-surface-900 outline-none focus:border-emerald-600 focus:bg-white transition"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition active:scale-95 flex-shrink-0 ${
              inputText.trim()
                ? 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800'
                : 'bg-surface-100 text-surface-400 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── SUB-SCREEN: PENGATURAN TOKO MANDIRI ─────────────────────
function StoreSettingsScreen({
  storeSettings,
  setStoreSettings,
  storeSchedule,
  setStoreSchedule,
  triggerToast,
  balance = 0,
  onWithdrawClick,
  onBack,
}) {
  const [draftSchedule, setDraftSchedule] = useState(() => ({ ...storeSchedule }))
  const [settingsTab, setSettingsTab] = useState('operasional') // 'operasional' | 'info' | 'keuangan'
  const [showMapPicker, setShowMapPicker] = useState(false)
  const currentStatus = calculateStoreStatus(draftSchedule)

  const handleToggleDay = (dayId) => {
    setDraftSchedule((prev) => {
      const days = prev.openDays || []
      const nextDays = days.includes(dayId)
        ? days.filter((d) => d !== dayId)
        : [...days, dayId]
      return { ...prev, openDays: nextDays }
    })
  }

  const handleSetPreset = (preset) => {
    if (preset === 'mon-sat') {
      setDraftSchedule((prev) => ({
        ...prev,
        openDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
      }))
    } else if (preset === 'all') {
      setDraftSchedule((prev) => ({
        ...prev,
        openDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
      }))
    }
  }

  const handleSetMode = (mode) => {
    setDraftSchedule((prev) => ({ ...prev, mode }))
  }

  const handleSave = () => {
    saveStoredSchedule(draftSchedule)
    setStoreSchedule(draftSchedule)
    localStorage.setItem('mockSellerStoreInfo', JSON.stringify(storeSettings))
    triggerToast('Pengaturan toko & operasional berhasil disimpan!')
    onBack()
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* Overlay LocationPickerMap jika user memilih 'Pilih di Peta' */}
      {showMapPicker && (
        <LocationPickerMap
          initialLocation={storeSettings.address}
          initialCoords={storeSettings.coords || null}
          onBack={() => setShowMapPicker(false)}
          onConfirm={({ locationLabel, lat, lng }) => {
            setStoreSettings((s) => ({
              ...s,
              address: locationLabel,
              coords: { lat, lng },
            }))
            setShowMapPicker(false)
          }}
        />
      )}

      {/* ── 1. HEADER HALAMAN PENGATURAN TOKO ── */}
      <ScreenHeader
        title="Pengaturan Toko"
        onBack={onBack}
      />

      {/* ── 2. TAB SELECTOR (3 Tab: Operasional, Info Toko, Keuangan) ── */}
      <div className="px-4 pt-2.5 pb-2 border-b border-surface-200/80 flex-shrink-0 bg-white shadow-2xs">
        <div className="flex p-1 bg-surface-100 rounded-2xl gap-1">
          {[
            { id: 'operasional', label: 'Operasional', icon: Clock },
            { id: 'info', label: 'Info Toko', icon: Store },
            { id: 'keuangan', label: 'Keuangan', icon: Wallet },
          ].map((t) => {
            const active = settingsTab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSettingsTab(t.id)}
                className={`flex-1 py-2 rounded-xl text-[12px] font-extrabold transition flex items-center justify-center gap-1.5 active:scale-95 ${
                  active
                    ? 'bg-white text-emerald-950 shadow-xs border border-surface-200/60'
                    : 'text-surface-500 hover:text-surface-800'
                }`}
              >
                <t.icon size={13} className={active ? 'text-emerald-700' : 'text-surface-400'} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 3. SCROLLABLE FORM CONTENT ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
        {/* ═════════════════════════════════════════════════════════ */}
        {/* TAB 1: OPERASIONAL                                      */}
        {/* ═════════════════════════════════════════════════════════ */}
        {settingsTab === 'operasional' && (
          <div className="bg-white rounded-3xl p-4 border border-surface-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-surface-200/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-surface-500 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-700" />
                STATUS & JAM OPERASIONAL (HYBRID)
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                Sistem Otomatis + Override
              </span>
            </div>

            {/* Real-time Status Banner */}
            <div
              className={`p-3.5 rounded-2xl border transition ${
                currentStatus.isOpen
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : 'bg-red-50/90 border-red-200 text-red-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                      currentStatus.isOpen ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-[13px] font-black">
                    {currentStatus.isOpen ? 'Toko Buka Sekarang' : 'Toko Tutup Sekarang'}
                  </span>
                </div>
                <span
                  className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                    currentStatus.mode === 'auto'
                      ? 'bg-white/80 text-surface-700 border-surface-200'
                      : currentStatus.mode === 'force_open'
                      ? 'bg-emerald-200/80 text-emerald-900 border-emerald-300'
                      : 'bg-red-200/80 text-red-900 border-red-300'
                  }`}
                >
                  {currentStatus.mode === 'auto'
                    ? '⏰ Jadwal Otomatis'
                    : currentStatus.mode === 'force_open'
                    ? '⚡ Override: Buka'
                    : '⛔ Override: Tutup'}
                </span>
              </div>
              <p className="text-[11.5px] font-medium mt-1.5 opacity-90 leading-snug">
                {currentStatus.subText}
              </p>
            </div>

            {/* Mode Operasional Selector (3 Pills) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-500 mb-1.5">
                Pilih Mode Operasional
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-100 rounded-2xl">
                {[
                  { id: 'auto', label: 'Jadwal Otomatis', desc: 'Senin–Sabtu' },
                  { id: 'force_closed', label: 'Tutup Hari Ini', desc: 'Override' },
                  { id: 'force_open', label: 'Buka Sekarang', desc: 'Luar Jadwal' },
                ].map((m) => {
                  const active = draftSchedule.mode === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSetMode(m.id)}
                      className={`py-2 px-1 rounded-xl text-center transition ${
                        active
                          ? 'bg-white text-surface-900 shadow-xs font-black border border-surface-200/60'
                          : 'text-surface-600 hover:text-surface-900 font-bold'
                      }`}
                    >
                      <p className="text-[11.5px] leading-tight truncate">{m.label}</p>
                      <p className="text-[9.5px] opacity-70 font-normal leading-none mt-0.5">{m.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Action One-Tap Override */}
            {draftSchedule.mode === 'auto' ? (
              <div className="pt-1">
                {currentStatus.isOpen ? (
                  <button
                    type="button"
                    onClick={() => handleSetMode('force_closed')}
                    className="w-full py-2.5 px-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200/80 text-[12px] font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>⛔ Tutup Sementara Hari Ini (Libur Khusus / Panen)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetMode('force_open')}
                    className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[12px] font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>⚡ Buka Sekarang di Luar Jadwal (Menerima Pesanan)</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold text-amber-900">
                  Override aktif ({currentStatus.badge})
                </p>
                <button
                  type="button"
                  onClick={() => handleSetMode('auto')}
                  className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 text-[10.5px] font-extrabold shadow-2xs hover:bg-amber-100/50 transition active:scale-95 flex items-center gap-1"
                >
                  <RotateCcw size={11} />
                  <span>Jadwal Otomatis</span>
                </button>
              </div>
            )}

            {/* Jadwal Buka Rutin Mingguan */}
            <div className="pt-2 border-t border-surface-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11.5px] font-bold text-surface-700">
                  Hari Buka Rutin
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetPreset('mon-sat')}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-200/60"
                  >
                    Sen–Sab
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPreset('all')}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-200/60"
                  >
                    Semua
                  </button>
                </div>
              </div>

              {/* Day Chips */}
              <div className="grid grid-cols-7 gap-1.5">
                {DAY_OPTIONS.map((day) => {
                  const isSelected = (draftSchedule.openDays || []).includes(day.id)
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => handleToggleDay(day.id)}
                      className={`h-9 rounded-xl text-[11.5px] font-extrabold transition flex items-center justify-center select-none active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-surface-50 border border-surface-200 text-surface-400 hover:bg-surface-100'
                      }`}
                      title={`${day.full}: ${isSelected ? 'Buka' : 'Libur'}`}
                    >
                      {day.label}
                    </button>
                  )
                })}
              </div>

              {/* Jam Operasional */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 mb-1">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={draftSchedule.openTime || '07:00'}
                    onChange={(e) =>
                      setDraftSchedule((prev) => ({ ...prev, openTime: e.target.value }))
                    }
                    className="w-full bg-white border border-surface-200 rounded-xl px-3 py-2 text-[13px] font-bold text-surface-900 outline-none focus:border-emerald-600 text-center shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-surface-600 mb-1">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={draftSchedule.closeTime || '17:00'}
                    onChange={(e) =>
                      setDraftSchedule((prev) => ({ ...prev, closeTime: e.target.value }))
                    }
                    className="w-full bg-white border border-surface-200 rounded-xl px-3 py-2 text-[13px] font-bold text-surface-900 outline-none focus:border-emerald-600 text-center shadow-2xs"
                  />
                </div>
              </div>
              <p className="text-[10.5px] text-surface-400 font-medium leading-relaxed">
                ℹ️ Di luar jam ini, pembeli di Pasar ESTO akan melihat status "Toko Tutup · Buka besok {draftSchedule.openTime || '07.00'}".
              </p>

              {/* Auto-Reply Chat Saat Toko Tutup */}
              <div className="pt-2 border-t border-surface-200/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-surface-700">
                    Balasan Chat Otomatis Saat Toko Tutup
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraftSchedule((prev) => ({
                        ...prev,
                        autoReplyClosed: !prev.autoReplyClosed,
                      }))
                    }
                    className="transition active:scale-95 cursor-pointer flex-shrink-0"
                  >
                    {draftSchedule.autoReplyClosed ? (
                      <ToggleRight size={30} className="text-emerald-700" />
                    ) : (
                      <ToggleLeft size={30} className="text-surface-300" />
                    )}
                  </button>
                </div>
                {draftSchedule.autoReplyClosed && (
                  <textarea
                    rows={2}
                    value={draftSchedule.autoReplyText}
                    onChange={(e) =>
                      setDraftSchedule((prev) => ({ ...prev, autoReplyText: e.target.value }))
                    }
                    placeholder="Tulis pesan otomatis untuk pembeli..."
                    className="w-full bg-white border border-surface-200 rounded-xl p-2.5 text-[12px] text-surface-800 outline-none focus:border-emerald-600 resize-none shadow-2xs"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════ */}
        {/* TAB 2: INFORMASI TOKO                                   */}
        {/* ═════════════════════════════════════════════════════════ */}
        {settingsTab === 'info' && (
          <div className="bg-white rounded-3xl p-4 border border-surface-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-surface-200/60">
              <span className="text-[11px] font-black uppercase tracking-wider text-surface-500">
                INFORMASI & ALAMAT PENJEMPUTAN
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
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
                className="w-full bg-white border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-extrabold text-surface-900 outline-none focus:border-emerald-600 shadow-2xs"
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
                className="w-full bg-white border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-800 outline-none focus:border-emerald-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                Alamat Penjemputan Kurir GV Man
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-surface-400 pointer-events-none" />
                <input
                  type="text"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, address: e.target.value }))}
                  placeholder="cth. RT 03/RW 01, Dusun Karanganyar, Desa Bojong"
                  className="w-full bg-white border border-surface-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-surface-900 outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              {/* Tombol Pilih di Peta & Status Koordinat di bawah input field */}
              <div className="flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="py-2 px-3.5 rounded-xl border border-emerald-200/90 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11.5px] font-bold flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                >
                  <MapPin size={14} className="text-emerald-700" />
                  <span>Pilih di Peta</span>
                </button>

                {storeSettings.coords && (
                  <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
                    <span>Titik GPS: {Number(storeSettings.coords.lat).toFixed(4)}, {Number(storeSettings.coords.lng).toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                Nomor WhatsApp Toko
              </label>
              <input
                type="text"
                value={storeSettings.phone}
                onChange={(e) => setStoreSettings((s) => ({ ...s, phone: e.target.value }))}
                className="w-full bg-white border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] text-surface-800 outline-none focus:border-emerald-600 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════ */}
        {/* TAB 3: KEUANGAN (SALDO & REKENING PENCAIRAN)             */}
        {/* ═════════════════════════════════════════════════════════ */}
        {settingsTab === 'keuangan' && (
          <div className="space-y-4">
            {/* Card Saldo Penjual & Tarik Dana */}
            <div className="bg-gradient-to-br from-[#061A0D] via-[#0C3E1E] to-[#1B6B3A] text-white rounded-3xl p-4 shadow-sm border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Wallet size={14} className="text-emerald-400" />
                  SALDO HASIL PENJUALAN
                </span>
                <span className="text-[10px] font-extrabold text-emerald-200 bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  Siap Ditarik
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <p className="text-[22px] font-black text-white tracking-tight leading-none">
                    Rp {balance.toLocaleString('id')}
                  </p>
                  <p className="text-[11px] text-emerald-200/90 font-medium mt-1.5">
                    Tujuan: {storeSettings.bankName} ({storeSettings.accountNumber})
                  </p>
                </div>
                {onWithdrawClick && (
                  <button
                    type="button"
                    onClick={onWithdrawClick}
                    className="px-3.5 py-2 rounded-xl bg-white text-emerald-950 text-[11.5px] font-black active:scale-95 transition shadow-sm hover:bg-emerald-50 flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Tarik Saldo</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Card Rekening Pencairan */}
            <div className="bg-white rounded-3xl p-4 border border-surface-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-surface-200/60">
                <span className="text-[11px] font-black uppercase tracking-wider text-surface-500">
                  REKENING PENCAIRAN HASIL JUAL
                </span>
                <CreditCard size={16} className="text-emerald-700" />
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-surface-600 mb-1">
                  Metode / Bank Tujuan
                </label>
                <input
                  type="text"
                  value={storeSettings.bankName}
                  onChange={(e) => setStoreSettings((s) => ({ ...s, bankName: e.target.value }))}
                  className="w-full bg-white border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-bold text-surface-800 outline-none focus:border-emerald-600 shadow-2xs"
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
                  className="w-full bg-white border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-mono font-black text-surface-900 outline-none focus:border-emerald-600 shadow-2xs"
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
                  className="w-full bg-white border border-surface-200 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-surface-800 outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. FIXED BOTTOM ACTION (SIMPAN PERUBAHAN) ── */}
      <div className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-md border-t border-surface-200/80 shadow-md">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 rounded-2xl text-white font-black text-[13.5px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
        >
          <Check size={16} />
          <span>Simpan Perubahan Pengaturan</span>
        </button>
      </div>
    </ScreenBackground>
  )
}

// ── SUB-SCREEN: CHAT PELANGGAN MANDIRI ──────────────────────
function SellerChatInboxScreen({
  storeChats,
  unreadChatCount,
  filteredChats,
  chatSearch,
  setChatSearch,
  chatFilter,
  setChatFilter,
  handleOpenChat,
  sellerOrders,
  onBack,
}) {
  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      <ScreenHeader
        title="Chat Pelanggan"
        subtitle={`${storeChats.length} percakapan · ${unreadChatCount} belum dibalas`}
        onBack={onBack}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-3">
        {/* Search Input Bar */}
        <div className="px-4">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-surface-400 pointer-events-none" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Cari pembeli, pesanan, atau isi pesan..."
              className="w-full bg-white border border-surface-200/80 rounded-2xl pl-9 pr-8 py-2.5 text-[12.5px] text-surface-900 placeholder:text-surface-400 outline-none focus:border-emerald-600 shadow-2xs transition"
            />
            {chatSearch && (
              <button
                type="button"
                onClick={() => setChatSearch('')}
                className="absolute right-2.5 p-1 rounded-full text-surface-400 hover:text-surface-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Status Filter Chips */}
        <div className="flex gap-1.5 px-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `Semua (${storeChats.length})` },
            { id: 'unread', label: `Perlu Dibalas (${unreadChatCount})` },
            { id: 'order', label: `Ada Pesanan (${storeChats.filter((c) => c.orderRef).length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setChatFilter(f.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
                chatFilter === f.id
                  ? 'bg-surface-900 text-white border-surface-900 shadow-2xs'
                  : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List Chat Threads */}
        <div className="px-4 space-y-2.5 pb-20">
          {filteredChats.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-surface-100 shadow-sm mt-4">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-surface-100 text-surface-400 mb-3">
                <MessageCircle size={28} strokeWidth={1.5} />
              </div>
              <h4 className="text-[14.5px] font-bold text-surface-900">
                {chatSearch
                  ? 'Tidak ada hasil percakapan'
                  : chatFilter === 'unread'
                  ? 'Semua chat sudah dibalas!'
                  : chatFilter === 'order'
                  ? 'Belum ada chat terkait pesanan'
                  : 'Belum ada percakapan'}
              </h4>
              <p className="text-[12px] text-surface-400 mt-1 max-w-[250px] mx-auto">
                {chatSearch
                  ? `Tidak ditemukan percakapan dengan kata kunci "${chatSearch}".`
                  : chatFilter === 'unread'
                  ? 'Pelayanan Anda sangat prima dan responsif untuk warga desa ⭐'
                  : 'Pesan dan pertanyaan dari calon pembeli akan langsung tampil di sini'}
              </p>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const matchingOrder = sellerOrders.find((o) => o.id === chat.orderRef)
              return (
                <div
                  key={chat.id}
                  onClick={() => handleOpenChat(chat)}
                  className={`bg-white rounded-3xl p-3.5 border transition cursor-pointer active:scale-[0.99] flex items-center gap-3 ${
                    chat.unreadCount > 0
                      ? 'border-emerald-300 shadow-brand-sm bg-emerald-50/15'
                      : 'border-surface-100 shadow-xs hover:shadow-brand-sm'
                  }`}
                >
                  {/* Buyer Avatar with online dot */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-900 flex items-center justify-center font-black text-[15px] flex-shrink-0 relative shadow-2xs">
                    {chat.buyerName.charAt(0)}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  {/* Chat Content Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4
                          className={`text-[13.5px] truncate ${
                            chat.unreadCount > 0
                              ? 'font-black text-surface-900'
                              : 'font-bold text-surface-800'
                          }`}
                        >
                          {chat.buyerName}
                        </h4>
                        {chat.orderRef && (
                          <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200/80 flex-shrink-0">
                            {chat.orderRef}
                            {matchingOrder ? ` · ${STATUS_CONFIG[matchingOrder.status]?.label}` : ''}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10.5px] flex-shrink-0 ${
                          chat.unreadCount > 0
                            ? 'font-black text-emerald-700'
                            : 'font-medium text-surface-400'
                        }`}
                      >
                        {chat.lastTime}
                      </span>
                    </div>

                    <p
                      className={`text-[12px] line-clamp-1 leading-snug ${
                        chat.unreadCount > 0
                          ? 'font-bold text-surface-900'
                          : 'font-normal text-surface-500'
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* Unread Counter Pill or Chevron */}
                  {chat.unreadCount > 0 ? (
                    <div className="w-5.5 h-5.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-xs">
                      {chat.unreadCount}
                    </div>
                  ) : (
                    <ChevronRight size={15} className="text-surface-300 flex-shrink-0" />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </ScreenBackground>
  )
}

// ── MAIN DASHBOARD PENJUAL TOKO SAYA ────────────────────────
export default function Toko({ navigate, userData, userProfile, initialView = 'main' }) {
  const [currentView,   setCurrentView] = useState(initialView)
  const [sellerOrders, setSelOrders]  = useState(DUMMY_SELLER_ORDERS)
  const [selOrderSheet,setSelSheet]   = useState(null)
  const [activeTab,    setActiveTab]  = useState('orders') // 'orders' | 'products'
  const { sellerProducts: selProdsData, saveSellerProduct, restoreStock: restoreStockSeller } = useStock()
  const [showAddProd,  setAddProd]    = useState(false)
  const [editProd,     setEditProd]   = useState(null)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [balance, setBalance]         = useState(1485000)
  const [toastMsg, setToastMsg]       = useState(null)
  const [tanyaOpen,    setTanyaOpen]  = useState(false)

  // Chat Pelanggan State
  const [storeChats, setStoreChats]   = useState(() => {
    const saved = localStorage.getItem('gv_store_chats')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) {}
    }
    return DUMMY_STORE_CHATS_INIT
  })
  const [selectedChat, setSelectedChat] = useState(null)
  const unreadChatCount = storeChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0)
  
  // Status Operasional Toko (Hybrid System: Jadwal Otomatis + Manual Override)
  const [storeSchedule, setStoreSchedule] = useState(getStoredSchedule)
  const storeStatus = calculateStoreStatus(storeSchedule)
  const isStoreOpen = storeStatus.isOpen

  // Toko profile settings (Sync dengan saved store info / draft onboarding)
  const [storeSettings, setStoreSettings] = useState(() => {
    const savedStore = localStorage.getItem('mockSellerStoreInfo')
    if (savedStore) {
      try {
        const parsed = JSON.parse(savedStore)
        return {
          coords: { lat: -6.6042, lng: 107.0395 },
          ...parsed,
        }
      } catch (e) {}
    }
    const savedDraft = localStorage.getItem('mockSellerDraft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed?.form?.namaToko) {
          return {
            name: parsed.form.namaToko,
            category: parsed.form.kategoriToko || 'Sayur, Buah & Pangan Pokok',
            address: parsed.form.alamatToko || (userData?.desa ? `RT 02 / RW 04, ${userData.desa}` : 'RT 03/RW 01, Dusun Karanganyar'),
            coords: parsed.form.coords || { lat: -6.6042, lng: 107.0395 },
            phone: userData?.phone || '0812-3456-7890',
            bankName: parsed.form.metodePencairan === 'gv_pay' ? 'GV Pay (Dompet Digital Desa)' : 'Transfer Bank',
            accountNumber: parsed.form.nomorRekening || userData?.phone || '0812-3456-7890',
            accountHolder: parsed.form.namaPemilik || userData?.name || userProfile?.name || 'Pak Budi Santoso',
          }
        }
      } catch (e) {}
    }
    return {
      name: 'Toko Berkah Tani Bojong',
      category: 'Sayur, Buah & Pangan Pokok',
      address: userData?.desa ? `RT 02 / RW 04, ${userData.desa}` : 'RT 03/RW 01, Dusun Karanganyar',
      coords: { lat: -6.6042, lng: 107.0395 },
      phone: userData?.phone || '0812-3456-7890',
      bankName: 'GV Pay (Dompet Digital Desa)',
      accountNumber: userData?.phone || '0812-3456-7890',
      accountHolder: userData?.name || userProfile?.name || 'Pak Budi Santoso',
    }
  })

  // Sync store chats on external updates (e.g. from buyer sending messages)
  useEffect(() => {
    const syncFromStorage = () => {
      const saved = localStorage.getItem('gv_store_chats')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setStoreChats(parsed)
          if (selectedChat) {
            const found = parsed.find((c) => c.id === selectedChat.id)
            if (found) setSelectedChat(found)
          }
        } catch (e) {}
      }
    }
    window.addEventListener('storage', syncFromStorage)
    window.addEventListener('gv_chats_updated', syncFromStorage)
    return () => {
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener('gv_chats_updated', syncFromStorage)
    }
  }, [selectedChat?.id])

  const handleToggleStoreOpen = () => {
    const nextMode = isStoreOpen ? 'force_closed' : 'force_open'
    const updated = { ...storeSchedule, mode: nextMode }
    setStoreSchedule(updated)
    const newStatus = saveStoredSchedule(updated)
    triggerToast(newStatus.isOpen ? 'Toko dibuka (Manual Override)' : 'Toko disetel Tutup Sementara')
  }

  const handleSendChatMessage = (chatId, text) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const updated = storeChats.map((c) => {
      if (c.id === chatId) {
        const newMsg = {
          id: Date.now(),
          from: 'seller',
          text,
          time: timeNow,
        }
        return {
          ...c,
          lastMessage: text,
          lastTime: timeNow,
          unreadCount: 0,
          buyerUnreadCount: (c.buyerUnreadCount || 0) + 1,
          messages: [...c.messages, newMsg],
        }
      }
      return c
    })
    setStoreChats(updated)
    localStorage.setItem('gv_store_chats', JSON.stringify(updated))
    window.dispatchEvent(new Event('gv_chats_updated'))
    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat(updated.find((c) => c.id === chatId))
    }
  }

  const handleOpenChat = (chat) => {
    const updated = storeChats.map((c) =>
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    )
    setStoreChats(updated)
    localStorage.setItem('gv_store_chats', JSON.stringify(updated))
    window.dispatchEvent(new Event('gv_chats_updated'))
    setSelectedChat({ ...chat, unreadCount: 0 })
  }

  // Metrik Produk & Stok
  const emptyStockCount = selProdsData.filter((p) => p.stock === 0).length
  const activeProductCount = selProdsData.filter((p) => p.stock > 0).length
  const newOrdersCount = sellerOrders.filter((o) => o.status === 'waiting').length

  // Orders list: tampilkan semua pesanan langsung tanpa filter
  const filteredOrders = sellerOrders

  // Product filters: hanya 'all' dan 'empty'
  const [prodFilter, setProdFilter] = useState('all') // 'all' | 'empty'
  const filteredProducts = selProdsData.filter((p) => {
    if (prodFilter === 'empty') return p.stock === 0
    return true
  })

  // Chat filters & search
  const [chatFilter, setChatFilter] = useState('all') // 'all' | 'unread' | 'order'
  const [chatSearch, setChatSearch] = useState('')
  const filteredChats = storeChats.filter((c) => {
    if (chatFilter === 'unread' && (c.unreadCount || 0) === 0) return false
    if (chatFilter === 'order' && !c.orderRef) return false
    if (chatSearch.trim()) {
      const q = chatSearch.toLowerCase()
      const matchName = c.buyerName?.toLowerCase().includes(q)
      const matchMsg = c.lastMessage?.toLowerCase().includes(q)
      const matchOrder = c.orderRef?.toLowerCase().includes(q)
      return matchName || matchMsg || matchOrder
    }
    return true
  })

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // ── SUB-SCREEN CHAT PELANGGAN MANDIRI ───────────────────
  if (currentView === 'chat') {
    return (
      <div className="h-full flex flex-col relative">
        <SellerChatInboxScreen
          storeChats={storeChats}
          unreadChatCount={unreadChatCount}
          filteredChats={filteredChats}
          chatSearch={chatSearch}
          setChatSearch={setChatSearch}
          chatFilter={chatFilter}
          setChatFilter={setChatFilter}
          handleOpenChat={handleOpenChat}
          sellerOrders={sellerOrders}
          onBack={() => setCurrentView('main')}
        />

        {/* Modal Sheet Detail Chat Pelanggan */}
        {selectedChat && (
          <SellerChatSheet
            chat={selectedChat}
            onClose={() => setSelectedChat(null)}
            onSendMessage={handleSendChatMessage}
            relatedOrder={sellerOrders.find((o) => o.id === selectedChat.orderRef)}
            onOpenOrder={(order) => {
              setSelectedChat(null)
              setSelSheet(order)
            }}
          />
        )}

        {/* Modal Sheet Detail Pesanan jika dibuka dari chat */}
        {selOrderSheet && (
          <SellerOrderSheet
            order={selOrderSheet}
            onClose={() => setSelSheet(null)}
            onUpdateStatus={(id, next) => {
              if (next === 'cancelled' && selOrderSheet?.items) {
                restoreStockSeller(selOrderSheet.items)
              }
              setSelOrders((p) => p.map((o) => (o.id === id ? { ...o, status: next } : o)))
              triggerToast(next === 'cancelled' ? `Pesanan ${id} dibatalkan & stok dikembalikan` : `Status pesanan ${id} berhasil diperbarui`)
            }}
          />
        )}
      </div>
    )
  }

  // ── SUB-SCREEN PENGATURAN TOKO MANDIRI ───────────────────
  if (currentView === 'settings') {
    return (
      <div className="h-full flex flex-col relative">
        <StoreSettingsScreen
          storeSettings={storeSettings}
          setStoreSettings={setStoreSettings}
          storeSchedule={storeSchedule}
          setStoreSchedule={setStoreSchedule}
          triggerToast={triggerToast}
          balance={balance}
          onWithdrawClick={() => setShowWithdraw(true)}
          onBack={() => setCurrentView('main')}
        />

        {/* Modal Tarik Saldo jika dibuka dari tab Keuangan */}
        {showWithdraw && (
          <WithdrawModal
            balance={balance}
            bankName={storeSettings.bankName}
            accountNumber={storeSettings.accountNumber}
            onClose={() => setShowWithdraw(false)}
            onSuccess={(wAmount) => {
              setBalance((b) => b - wAmount)
              triggerToast(`Pencairan dana Rp ${wAmount.toLocaleString('id')} sedang diproses ke ${storeSettings.bankName}!`)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* ── 1. HEADER STANDAR (ScreenHeader Gradien Zamrud) ── */}
      <ScreenHeader
        title="Toko Saya"
        onBack={() => navigate('profile')}
        actions={
          <div className="flex items-center gap-1.5">
            {/* Action 1: Chat Pelanggan (membuka halaman chat mandiri) */}
            <button
              type="button"
              onClick={() => setCurrentView('chat')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 text-white/90 hover:text-white relative"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
              title="Chat Pelanggan"
            >
              <MessageCircle size={17} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-red-500 text-white text-[9.5px] font-black rounded-full flex items-center justify-center shadow-xs border border-white/40 animate-pulse">
                  {unreadChatCount > 99 ? '99+' : unreadChatCount}
                </span>
              )}
            </button>

            {/* Action 2: Pengaturan Toko & Saldo */}
            <button
              type="button"
              onClick={() => setCurrentView('settings')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 text-white/90 hover:text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
              title="Pengaturan Toko & Saldo"
            >
              <Settings size={17} />
            </button>
          </div>
        }
      />

      {/* Floating Feedback Toast */}
      {toastMsg && (
        <div className="absolute top-20 left-4 right-4 z-40 bg-gray-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between text-[12px] font-bold animate-fade-in">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-white/60 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* Modal Sheet Detail Pesanan */}
      {selOrderSheet && (
        <SellerOrderSheet
          order={selOrderSheet}
          onClose={() => setSelSheet(null)}
          onUpdateStatus={(id, next) => {
            if (next === 'cancelled' && selOrderSheet?.items) {
              restoreStockSeller(selOrderSheet.items)
            }
            setSelOrders((p) => p.map((o) => (o.id === id ? { ...o, status: next } : o)))
            triggerToast(next === 'cancelled' ? `Pesanan ${id} dibatalkan & stok dikembalikan` : `Status pesanan ${id} berhasil diperbarui`)
          }}
        />
      )}

      {/* Modal Sheet Chat Detail Pelanggan */}
      {selectedChat && (
        <SellerChatSheet
          chat={selectedChat}
          onClose={() => setSelectedChat(null)}
          onSendMessage={handleSendChatMessage}
          relatedOrder={sellerOrders.find((o) => o.id === selectedChat.orderRef)}
          onOpenOrder={(order) => {
            setSelectedChat(null)
            setSelSheet(order)
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
            saveSellerProduct(saved)
            triggerToast(editProd ? `Produk "${saved.name}" berhasil diperbarui` : `Produk baru "${saved.name}" berhasil ditambahkan`)
          }}
        />
      )}

      {/* Modal Tarik Saldo */}
      {showWithdraw && (
        <WithdrawModal
          balance={balance}
          bankName={storeSettings.bankName}
          accountNumber={storeSettings.accountNumber}
          onClose={() => setShowWithdraw(false)}
          onSuccess={(wAmount) => {
            setBalance((b) => b - wAmount)
            triggerToast(`Pencairan dana Rp ${wAmount.toLocaleString('id')} sedang diproses ke ${storeSettings.bankName}!`)
          }}
        />
      )}

      {/* ── UNIFIED OUTER SCROLL CONTAINER ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">

        {/* ── 2. WIDGET CARD TOKO ── */}
        <div className="mx-4 mt-3 mb-2.5 bg-white rounded-3xl p-4 border border-surface-200/80 shadow-xs space-y-3">
          {/* Baris Atas: Nama Toko, Badge Verifikasi, Status Buka/Tutup */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-[16px] font-black text-surface-900 truncate tracking-tight">
                  {storeSettings.name}
                </h2>
                <span className="text-emerald-700 flex-shrink-0" title="Mitra ESTO Terverifikasi">
                  <ShieldCheck size={16} className="fill-emerald-100" />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-surface-500 mt-0.5">
                <span className="font-extrabold text-amber-600 flex items-center gap-0.5">
                  ⭐ 4.9
                </span>
                <span className="text-surface-300">·</span>
                <span className="font-medium text-surface-500">128 ulasan</span>
              </div>
            </div>

            {/* Status Buka/Tutup Pill (Clickable) */}
            <button
              type="button"
              onClick={() => setCurrentView('settings')}
              title="Klik untuk ubah jadwal operasional"
              className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 border transition active:scale-95 flex-shrink-0 ${
                isStoreOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isStoreOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span>{isStoreOpen ? 'Buka' : 'Tutup'}</span>
            </button>
          </div>

          {/* Baris Omzet Hari Ini */}
          <div className="px-3 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-[12px]">
            <span className="text-emerald-900 font-bold flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-700" />
              Omzet Hari Ini
            </span>
            <span className="font-black text-emerald-800 text-[13.5px]">
              Rp 890.000
            </span>
          </div>

          {/* Grid 3 Statistik Kunci: Pesanan Baru, Produk Aktif, Stok Kosong (Label 2 Baris) */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            {/* Stat 1: Pesanan Baru */}
            <div
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-1.5 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between items-center min-h-[76px] ${
                activeTab === 'orders'
                  ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/60 shadow-2xs'
                  : 'bg-surface-50 hover:bg-surface-100 border-surface-200/60'
              }`}
            >
              <p className="text-[10px] font-extrabold text-surface-500 uppercase tracking-wider leading-tight min-h-[26px] flex items-center justify-center">
                Pesanan<br />Baru
              </p>
              <p className="text-[20px] font-black text-amber-600 mt-1 leading-none">
                {newOrdersCount}
              </p>
            </div>

            {/* Stat 2: Produk Aktif */}
            <div
              onClick={() => {
                setActiveTab('products')
                setProdFilter('all')
              }}
              className={`py-3 px-1.5 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between items-center min-h-[76px] ${
                activeTab === 'products' && prodFilter === 'all'
                  ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300/60 shadow-2xs'
                  : 'bg-surface-50 hover:bg-surface-100 border-surface-200/60'
              }`}
            >
              <p className="text-[10px] font-extrabold text-surface-500 uppercase tracking-wider leading-tight min-h-[26px] flex items-center justify-center">
                Produk<br />Aktif
              </p>
              <p className="text-[20px] font-black text-surface-900 mt-1 leading-none">
                {activeProductCount}
              </p>
            </div>

            {/* Stat 3: Stok Kosong (Highlight Merah Mencolok!) */}
            <div
              onClick={() => {
                setActiveTab('products')
                setProdFilter('empty')
              }}
              className={`py-3 px-1.5 rounded-2xl border cursor-pointer transition text-center flex flex-col justify-between items-center min-h-[76px] ${
                emptyStockCount > 0
                  ? activeTab === 'products' && prodFilter === 'empty'
                    ? 'bg-red-100/90 border-red-400 text-red-950 ring-2 ring-red-400/70 shadow-xs'
                    : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-900 ring-1 ring-red-300/60'
                  : 'bg-surface-50 hover:bg-surface-100 border-surface-200/60 text-surface-900'
              }`}
            >
              <p className={`text-[10px] font-extrabold uppercase tracking-wider leading-tight min-h-[26px] flex items-center justify-center ${emptyStockCount > 0 ? 'text-red-700' : 'text-surface-500'}`}>
                Stok<br />Kosong
              </p>
              <p className={`text-[20px] font-black mt-1 leading-none ${emptyStockCount > 0 ? 'text-red-600' : 'text-surface-700'}`}>
                {emptyStockCount}
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. NAV TABS UNDERLINE (STICKY) ── */}
        <div className="sticky top-0 z-20 bg-[#FAFBF9]/95 backdrop-blur-md border-b border-surface-200 shadow-2xs">
          <NavTabs
            variant="underline-light"
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'orders', label: 'Pesanan Masuk', count: newOrdersCount },
              { id: 'products', label: 'Produk & Stok', count: selProdsData.length },
            ]}
          />
        </div>

        {/* ═════════════════════════════════════════════════════════ */}
        {/* ── TAB 1: PESANAN MASUK ──────────────────────────────── */}
        {/* ═════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="flex flex-col pt-3">
            {/* List Order Cards */}
            <div className="px-4 space-y-3 pb-24">
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
          <div className="flex flex-col">
            {/* Header Toolbar: Filter Chips Saja (Semua & Habis) */}
            <div className="flex items-center px-4 pb-2.5 pt-1 gap-1.5 overflow-x-auto no-scrollbar">
              {[
                ['all', `Semua (${selProdsData.length})`],
                ['empty', `Habis (${emptyStockCount})`],
              ].map(([id, lbl]) => (
                <button
                  key={id}
                  onClick={() => setProdFilter(id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
                    prodFilter === id
                      ? 'bg-surface-900 text-white border-surface-900 shadow-2xs'
                      : 'bg-white text-surface-600 border-surface-200 hover:bg-surface-50'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {/* List Produk Cards */}
            <div className="px-4 space-y-3 pb-32">
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

                    {/* Action Button: Edit Produk Saja (Rapi, Simetris, Rata Kanan) */}
                    <div className="flex items-center self-center flex-shrink-0 pl-1">
                      <button
                        type="button"
                        onClick={() => setEditProd(p)}
                        className="w-9 h-9 rounded-2xl bg-surface-50 border border-surface-200/80 text-surface-500 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 flex items-center justify-center transition active:scale-95 shadow-2xs"
                        title="Edit Detail & Stok Produk"
                      >
                        <Pencil size={15} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. FIXED BOTTOM ACTION (TAMBAH PRODUK BARU) ── */}
      {activeTab === 'products' && (
        <div className="flex-shrink-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-surface-200/80 z-20 shadow-lg">
          <button
            type="button"
            onClick={() => setAddProd(true)}
            className="w-full h-12 rounded-2xl text-white font-black text-[13.5px] shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition"
            style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>+ Tambah Produk / Barang</span>
          </button>
        </div>
      )}

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
