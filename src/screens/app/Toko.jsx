import React, { useState } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import { ArrowLeft, Plus, Pencil, Check, Wheat, Leaf, Egg, User, UserCheck, Package } from 'lucide-react'
import TanyaGV from '../../components/TanyaGV'
import BottomNav from '../../components/BottomNav'

const PRIMARY = '#1B6B3A'

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

const SELLER_PRODUCTS_INIT = [
  { id:101, name:'Beras Pandan Wangi Premium 5kg', price:65000, unit:'5 kg',    stock:48, active:true,  Icon:Wheat, g:['#827717','#9E9D24'], cat:'Pangan',   desc:'Beras pandan wangi premium organik' },
  { id:102, name:'Sayur Bayam Organik Segar 250g', price:5000,  unit:'250 gr',  stock:120,active:true,  Icon:Leaf, g:['#2E7D32','#4CAF50'], cat:'Sayur',    desc:'Bayam organik segar tanpa pestisida' },
  { id:103, name:'Telur Ayam Kampung (12 butir)',  price:32000, unit:'12 butir',stock:30, active:true,  Icon:Egg, g:['#F57F17','#FBC02D'], cat:'Pangan',   desc:'Telur ayam kampung asli dari peternakan' },
  { id:104, name:'Pupuk Organik Kompos 25kg',      price:45000, unit:'25 kg',   stock:2,  active:true,  Icon:Leaf, g:['#2E7D32','#4CAF50'], cat:'Lainnya',  desc:'Pupuk organik kompos untuk pertanian' },
  { id:105, name:'Bibit Cabai Rawit Lokal',        price:15000, unit:'50 biji', stock:0,  active:false, Icon:Leaf, g:['#C62828','#EF5350'], cat:'Lainnya',  desc:'Bibit cabai rawit lokal unggul tahan hama' },
]

const DUMMY_SELLER_ORDERS = [
  { id:'GV-S001', date:'Hari ini, 11:23', buyer:'Pak Wahyu', buyerAvIcon:User, payment:'GV Pay',
    delivery:'Pengiriman', total:130000, status:'waiting',
    address:'Jl. Mawar No. 12, Desa Bojong',
    items:[{name:'Beras Pandan Wangi Premium 5kg',qty:2,price:65000,Icon:Wheat,g:['#827717','#9E9D24']}]},
  { id:'GV-S002', date:'Hari ini, 09:47', buyer:'Bu Rina',   buyerAvIcon:User, payment:'COD',
    delivery:'Ambil Sendiri', total:50000, status:'confirmed',
    address:'Jl. Anggrek No. 5, Desa Sukamaju',
    items:[{name:'Bayam Organik Segar',qty:4,price:8500,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Telur Ayam Kampung',qty:1,price:32000,Icon:Egg,g:['#F57F17','#FBC02D']}]},
  { id:'GV-S003', date:'Kemarin, 15:10', buyer:'Pak Hendra', buyerAvIcon:User, payment:'QRIS',
    delivery:'Pengiriman', total:65000, status:'done',
    address:'Jl. Melati No. 3, Desa Ciawi',
    items:[{name:'Pupuk Organik Kompos 25kg',qty:1,price:45000,Icon:Leaf,g:['#2E7D32','#4CAF50']},{name:'Bibit Cabai Rawit Lokal',qty:1,price:15000,Icon:Leaf,g:['#C62828','#EF5350']}]},
]

// ── Seller Order Management ────────────────────────────────
function SellerOrderSheet({ order, onClose, onUpdateStatus }) {
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0"
              style={{background:'#E8F5E9'}}>
              {order.buyerAvIcon ? <order.buyerAvIcon size={20} className="text-gray-600"/> : <User size={20} className="text-gray-600"/>}
            </div>
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
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shadow-inner relative flex-shrink-0 overflow-hidden"
                  style={{background:`linear-gradient(135deg,${item.g[0]},${item.g[1]})`}}>
                  <item.Icon size={20} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>
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

export default function Toko({ navigate }) {
  const [sellerOrders, setSelOrders]  = useState(DUMMY_SELLER_ORDERS)
  const [selOrderSheet,setSelSheet]   = useState(null)
  const [selFilter,    setSelFilter]  = useState('orders') // default to orders
  const [selProdsData, setSelProds]   = useState(SELLER_PRODUCTS_INIT)
  const [showAddProd,  setAddProd]    = useState(false)
  const [editProd,     setEditProd]   = useState(null)
  const [tanyaOpen,    setTanyaOpen]  = useState(false)

  const selFiltered = selFilter==='all' ? selProdsData
    : selFilter==='active' ? selProdsData.filter(p=>p.active)
    : selProdsData.filter(p=>p.stock===0)

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      {/* ── HEADER ── */}
      <ScreenHeader
        title="Toko Saya"
        onBack={() => navigate('profile')}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Seller Order Sheet */}
        {selOrderSheet && (
          <SellerOrderSheet
            order={selOrderSheet}
            onClose={()=>setSelSheet(null)}
            onUpdateStatus={(id,next)=>{
              setSelOrders(p=>p.map(o=>o.id===id?{...o,status:next}:o))
              setSelSheet(null)
            }}/>
        )}
        
        {/* Stats */}
        <div className="flex bg-white border-b border-gray-100 flex-shrink-0">
          {[[String(sellerOrders.filter(o=>o.status==='waiting').length),'Pesanan baru'],['Rp 890rb','Omzet hari ini'],[String(selProdsData.length),'Produk aktif']].map(([n,l])=>(
            <div key={l} className="flex-1 text-center py-3 border-e border-gray-100 last:border-e-0">
              <p className="text-base font-bold text-gray-900">{n}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
        
        {/* Sub-tabs */}
        <div className="bg-white border-b border-gray-100 px-2 flex-shrink-0">
          <NavTabs
            variant="underline-light"
            tabs={[
              {
                id: 'orders',
                label: 'Pesanan Masuk',
                count: sellerOrders.filter(o=>o.status==='waiting').length,
              },
              { id: 'all', label: 'Produk Saya' },
            ]}
            activeTab={selFilter}
            onChange={setSelFilter}
          />
        </div>

        {/* Pesanan Masuk */}
        {selFilter==='orders' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
            {sellerOrders.length===0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner mb-3 bg-gray-50">
                  <Package size={32} className="text-gray-400" strokeWidth={1.5}/>
                </div>
                <p className="text-[14px] font-bold text-gray-900">Belum ada pesanan masuk</p>
              </div>
            )}
            {sellerOrders.map(order=>{
              const st = STATUS_CONFIG[order.status]
              const action = SELLER_ACTIONS[order.status]
              return (
                <button key={order.id} onClick={()=>setSelSheet(order)}
                  className="flex flex-col w-full bg-white px-4 py-3.5 border-b border-gray-50 text-left">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400">{order.id} · {order.date}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shadow-inner flex-shrink-0" style={{background:'#E8F5E9'}}>
                          {order.buyerAvIcon ? <order.buyerAvIcon size={10} className="text-gray-600"/> : <User size={10} className="text-gray-600"/>}
                        </div>
                        <p className="text-[13px] font-bold text-gray-900">{order.buyer}</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ms-2"
                      style={{background:st.bg,color:st.color}}>{st.label}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 mb-2 line-clamp-2">
                    {order.items.map(i=>`${i.name} (${i.qty})`).join(', ')}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">{order.delivery} · {order.payment}</p>
                    <p className="text-[14px] font-extrabold" style={{color:PRIMARY}}>Rp {order.total.toLocaleString('id')}</p>
                  </div>
                  {action && (
                    <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-xl"
                        style={{background:`${PRIMARY}15`,color:PRIMARY}}>→ {action.label}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Produk Saya */}
        {selFilter!=='orders' && (
          <>
            <div className="flex gap-2 px-3 py-2 bg-white border-b border-gray-100 flex-shrink-0">
              {[['all',`Semua`],['active','Aktif'],['empty','Habis']].map(([id,lbl])=>(
                <button key={id} onClick={()=>setSelFilter(id)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-[12px] font-semibold border transition"
                  style={selFilter===id?{background:PRIMARY,color:'#fff',borderColor:PRIMARY}:{background:'#fff',color:'#707973',borderColor:'#E5E7EB'}}>
                  {lbl}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
              {selFiltered.map(p=>(
                <div key={p.id} className="flex items-center gap-3 bg-white px-4 py-3.5 border-b border-gray-50">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden relative"
                    style={{background:`linear-gradient(135deg,${p.g[0]},${p.g[1]})`}}>
                    {p.image?<img src={p.image} alt="" className="w-full h-full object-cover relative z-10 border border-black/10"/> : <p.Icon size={24} className="text-white drop-shadow-sm relative z-10" strokeWidth={1.5}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</p>
                    <p className="text-xs font-semibold mt-0.5 tabular-nums" style={{color:PRIMARY}}>Rp {p.price.toLocaleString('id')} · {p.unit}</p>
                    <p className={"text-xs mt-0.5 " + (p.stock===0?'text-red-500 font-medium':p.stock<=2?'text-orange-500 font-medium':'text-gray-400')}>
                      {p.stock===0?'Stok habis':p.stock<=2?`Sisa ${p.stock} — segera isi ulang`:`Stok: ${p.stock} unit`}
                    </p>
                  </div>
                  <button onClick={()=>setEditProd(p)}
                    className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Pencil size={15} className="text-gray-500"/>
                  </button>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 end-4">
              <button onClick={()=>setAddProd(true)}
                className="flex items-center gap-2 rounded-full shadow-lg px-4 py-2.5"
                style={{background:PRIMARY,boxShadow:`0 4px 14px ${PRIMARY}45`}}>
                <Plus size={16} className="text-white"/>
                <span className="text-white font-semibold text-sm">Tambah Produk</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      <TanyaGV currentScreen="toko" navigate={navigate}
        openFromParent={tanyaOpen} onCloseParent={()=>setTanyaOpen(false)}/>
      <BottomNav active="profile" navigate={navigate}/>
    </ScreenBackground>
  )
}
