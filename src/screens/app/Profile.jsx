import React, { useState, useRef, useEffect } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import GlassCard from '@/components/atoms/GlassCard'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import { ChevronRight, Award, HelpCircle, LogOut, Shield, ShieldCheck, Bell,
  Store, Tv2, MapPin, Crown, CheckCircle, X, ChevronDown,
  ChevronUp, Globe, Trash2, Camera, Star, Gift, Zap, Package,
  ToggleLeft, ToggleRight, ArrowLeft, Check, Plus, Edit3,
  Lock, Eye, EyeOff, CreditCard, TrendingUp, TrendingDown, Settings, Copy, Clock, Info, Megaphone,
  Sparkles, Clapperboard, Truck, ShoppingBag, CheckCircle2, Wallet, Pencil, ImagePlus } from 'lucide-react'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import NavTabs from '@/components/molecules/NavTabs'
import BottomNav from '../../components/BottomNav'
import TanyaGV from '../../components/TanyaGV'
import AdsSubmissionForm from '../../components/ads/AdsSubmissionForm'
import UserAdsDashboard from '../../components/ads/UserAdsDashboard'
import OrderCard from '@/components/molecules/OrderCard'
import { useBuyerOrders } from '@/utils/orderStore'
import { OrderDetailSheet, CancelOrderModal, RatingSheet, OrderTracking, AddressFormModal, AddressMapModal, getSavedAddresses, saveAddressesToStorage } from './Pasar'
import LocationPickerMap from '@/components/maps/LocationPickerMap'
import BuyerSellerChatSheet from '@/components/molecules/BuyerSellerChatSheet'

const PRIMARY = '#1B6B3A'
const S = { card: '0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)' }

const COMMUNITY_THEMES = {
  sinartani:     { label: 'SINARTANI',     color: '#2D7A27', gradient: ['#1B5E20','#2D7A27'] },
  nexgent:       { label: 'NEXGENT',       color: '#1A3A8A', gradient: ['#0D47A1','#1A3A8A'] },
  hkti:          { label: 'HKTI',          color: '#1F5C1A', gradient: ['#145214','#1F5C1A'] },
  active_campus: { label: 'Active Campus', color: '#C0392B', gradient: ['#922B21','#C0392B'] },
  rt_online:     { label: 'RT Online',     color: '#5D6D7E', gradient: ['#455A64','#5D6D7E'] },
  dekopin:       { label: 'Dekopin',       color: '#922B21', gradient: ['#641010','#922B21'] },
}

// ── Sub-screen wrapper ──────────────────────────────────────
function SubScreen({ title, onBack, children, actions, navigate }) {
  return (
    <div className="flex flex-col h-full bg-[#FAFBF9] relative">
      <ScreenHeader title={title} onBack={onBack} actions={actions} />
      <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
      {navigate && <BottomNav active="profile" navigate={navigate}/>}
    </div>
  )
}

function SectionLabel({ label }) {
  return <p className="text-[12px] font-bold text-gray-400 px-4 pt-5 pb-2">{label}</p>
}

function Card({ children, className='' }) {
  return (
    <div className={`bg-white mx-4 rounded-2xl overflow-hidden spotlight-border ${className}`} style={{boxShadow:S.card}}>
      {children}
    </div>
  )
}

function Row({ label, value, onPress, danger=false, last=false, right }) {
  return (
    <button onClick={onPress} className={`flex items-center gap-3 px-4 py-3.5 w-full text-left transition-colors duration-150 hover:bg-gray-50 ${!last?'border-b border-gray-50':''}`}>
      <div className="flex-1">
        <p className={`text-[13px] font-semibold ${danger?'text-red-500':'text-gray-900'}`}>{label}</p>
        {value&&<p className="text-[11px] text-gray-400 mt-0.5">{value}</p>}
      </div>
      {right || <ChevronRight size={15} className="text-gray-300 flex-shrink-0"/>}
    </button>
  )
}



// ── Daftar Alamat Pengiriman ────────────────────────────────
function DaftarAlamatScreen({ onBack, navigate }) {
  const [addresses, setAddresses] = useState(() => getSavedAddresses())
  const [selectedId, setSelectedId] = useState(() => getSavedAddresses()[0]?.id || 1)
  const [modalView, setModalView] = useState(null) // 'form', 'map'
  const [draft, setDraft] = useState({})
  const [editingId, setEditingId] = useState(null)

  const handleSelect = (id) => {
    setSelectedId(id)
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }))
    setAddresses(updated)
    saveAddressesToStorage(updated)
  }

  const handleAdd = () => {
    setEditingId(null)
    setDraft({})
    setModalView('form')
  }

  const handleEdit = (addr) => {
    setEditingId(addr.id)
    setDraft({ ...addr })
    setModalView('form')
  }

  const handleDelete = (id) => {
    if (addresses.length <= 1) {
      alert('Minimal harus ada 1 alamat pengiriman tersimpan.')
      return
    }
    if (window.confirm('Hapus alamat ini dari daftar pengiriman?')) {
      const updated = addresses.filter((a) => a.id !== id)
      setAddresses(updated)
      saveAddressesToStorage(updated)
      if (selectedId === id) {
        setSelectedId(updated[0]?.id || 1)
      }
    }
  }

  const handleSaveForm = () => {
    const locStr = typeof draft?.locationLabel === 'string' ? draft.locationLabel : ''
    if (editingId) {
      const updated = addresses.map((a) =>
        a.id === editingId ? { ...draft, locationLabel: locStr, id: editingId } : a
      )
      setAddresses(updated)
      saveAddressesToStorage(updated)
    } else {
      const newAddr = { ...draft, locationLabel: locStr, id: Date.now() }
      const updated = [...addresses, newAddr]
      setAddresses(updated)
      saveAddressesToStorage(updated)
      setSelectedId(newAddr.id)
    }
    setEditingId(null)
    setModalView(null)
  }

  return (
    <SubScreen title="Daftar Alamat" onBack={onBack} navigate={navigate}>
      <div className="p-4 flex flex-col gap-3 pb-24">
        <div className="flex items-center justify-between px-1">
          <p className="text-[11.5px] font-extrabold text-gray-400 uppercase tracking-wider">
            Alamat Pengiriman Tersimpan
          </p>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            {addresses.length} Alamat
          </span>
        </div>

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 opacity-60">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <p className="text-[14px] font-bold text-gray-700">Belum ada alamat</p>
            <p className="text-[12px] text-gray-500 mt-1 max-w-[220px]">
              Tambahkan alamat untuk memudahkan pengiriman belanja di Pasar ESTO.
            </p>
          </div>
        ) : (
          addresses.map((addr) => {
            const isSelected = selectedId === addr.id
            return (
              <div
                key={addr.id}
                onClick={() => handleSelect(addr.id)}
                className="p-4 rounded-2xl bg-white border shadow-xs transition relative cursor-pointer"
                style={{
                  borderColor: isSelected ? '#1B6B3A' : '#F0F0F0',
                  background: isSelected ? '#1B6B3A06' : '#FFFFFF',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: isSelected ? '#1B6B3A' : '#D1D5DB' }}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full" style={{ background: '#1B6B3A' }} />}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-extrabold text-gray-900">{addr.label}</p>
                        {isSelected && (
                          <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/50">
                            UTAMA
                          </span>
                        )}
                      </div>

                      {/* Aksi Edit & Hapus */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleEdit(addr)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 transition"
                          title="Ubah Alamat"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(addr.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition"
                          title="Hapus Alamat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-[13px] font-semibold text-gray-800 mt-1">{addr.name}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{addr.address}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5 font-medium">
                      <Phone size={10} /> {addr.phone}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full mt-2 py-3.5 rounded-2xl text-[13px] font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md"
          style={{
            background: 'linear-gradient(135deg, #1B6B3A, #15803d)',
            boxShadow: '0 4px 16px rgba(27,107,58,0.25)',
          }}
        >
          <Plus size={16} /> Tambah Alamat Baru
        </button>
      </div>

      {modalView === 'form' && (
        <AddressFormModal
          draft={draft}
          setDraft={setDraft}
          isEdit={!!editingId}
          onBack={() => setModalView(null)}
          onOpenMap={() => setModalView('map')}
          onSave={handleSaveForm}
        />
      )}

      {modalView === 'map' && (
        <AddressMapModal
          initialLocation={draft?.locationLabel || draft?.address || ''}
          onBack={() => setModalView('form')}
          onConfirm={(locationLabel) => {
            const label = typeof locationLabel === 'string' && locationLabel.trim()
              ? locationLabel.trim()
              : 'Desa Sukamaju, Kec. Sukamakmur, Bogor'
            setDraft((prev) => ({
              ...prev,
              locationLabel: label,
              address: prev.address ? prev.address : label,
            }))
            setModalView('form')
          }}
        />
      )}
    </SubScreen>
  )
}

// ── Notifikasi ──────────────────────────────────────────────
function NotifikasiScreen({ onBack, navigate }) {
  const [notifs, setNotifs] = useState({
    transaksi:true, komunitas:true, media:false, promo:true, sistem:true, berita:false
  })
  const toggle = k => setNotifs(p=>({...p,[k]:!p[k]}))
  const ITEMS = [
    { key:'transaksi', label:'Transaksi & Pesanan',  sub:'Konfirmasi bayar, status pesanan, tagihan jatuh tempo' },
    { key:'komunitas', label:'Komunitas',             sub:'Reply, mention, thread baru, undangan' },
    { key:'media',     label:'GV Media',              sub:'Konten baru dari kreator yang kamu ikuti' },
    { key:'promo',     label:'Promo & Penawaran',     sub:'Diskon, cashback, event spesial GV' },
    { key:'berita',    label:'Berita Desa',           sub:'Artikel dan informasi terbaru dari desamu' },
    { key:'sistem',    label:'Info Sistem',           sub:'Update aplikasi dan pemeliharaan layanan' },
  ]
  return (
    <SubScreen title="Notifikasi" onBack={onBack} navigate={navigate}>
      <SectionLabel label="Kategori Notifikasi"/>
      <Card>
        {ITEMS.map((item,i)=>(
          <div key={item.key}
            className={`flex items-center gap-3 px-4 py-4 ${i<ITEMS.length-1?'border-b border-gray-50':''}`}>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-gray-900">{item.label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5 leading-snug">{item.sub}</p>
            </div>
            <button onClick={()=>toggle(item.key)} className="flex-shrink-0 transition-transform duration-150 active:scale-[0.96]">
              {notifs[item.key]
                ? <ToggleRight size={28} className="transition-colors duration-200" style={{color:PRIMARY}}/>
                : <ToggleLeft  size={28} className="text-gray-300 transition-colors duration-200"/>}
            </button>
          </div>
        ))}
      </Card>
      <div className="px-4 py-4">
        <p className="text-[12px] text-gray-400 leading-relaxed">
          Notifikasi penting terkait keamanan akun dan transaksi tidak dapat dinonaktifkan.
        </p>
      </div>
    </SubScreen>
  )
}

// ── Pengaturan ──────────────────────────────────────────────
function PengaturanScreen({ onBack, onLogout, navigate }) {
  const [lang,    setLang]    = useState('id')
  const [privacy, setPrivacy] = useState({profil:true, aktivitas:false, online:true})
  const [showDel, setDel]     = useState(false)
  return (
    <SubScreen title="Pengaturan" onBack={onBack} navigate={navigate}>
      <SectionLabel label="Bahasa Aplikasi"/>
      <Card>
        {[{id:'id',lbl:'Bahasa Indonesia'},{id:'en',lbl:'English'}].map((l,i)=>(
          <button key={l.id} onClick={()=>setLang(l.id)}
            className={`flex items-center justify-between px-4 py-3.5 w-full ${i===0?'border-b border-gray-50':''}`}>
            <span className="text-[13px] font-semibold text-gray-900">{l.lbl}</span>
            {lang===l.id && <Check size={16} style={{color:PRIMARY}}/>}
          </button>
        ))}
      </Card>

      <SectionLabel label="Privasi"/>
      <Card>
        {[
          {key:'profil',   label:'Profil Publik',     sub:'Semua orang bisa melihat profilmu'},
          {key:'aktivitas',label:'Sembunyikan Riwayat',sub:'Transaksi & aktivitas tidak terlihat orang lain'},
          {key:'online',   label:'Status Online',      sub:'Tampilkan saat kamu aktif di komunitas'},
        ].map((item,i,arr)=>(
          <div key={item.key}
            className={`flex items-center gap-3 px-4 py-3.5 ${i<arr.length-1?'border-b border-gray-50':''}`}>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-gray-900">{item.label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{item.sub}</p>
            </div>
            <button onClick={()=>setPrivacy(p=>({...p,[item.key]:!p[item.key]}))} className="flex-shrink-0 transition-transform duration-150 active:scale-[0.96]">
              {privacy[item.key]
                ? <ToggleRight size={28} className="transition-colors duration-200" style={{color:PRIMARY}}/>
                : <ToggleLeft  size={28} className="text-gray-300 transition-colors duration-200"/>}
            </button>
          </div>
        ))}
      </Card>

      <SectionLabel label="Keamanan"/>
      <Card>
        {['Ganti Kata Sandi','Ganti PIN GV Pay','Verifikasi 2 Langkah'].map((s,i,arr)=>(
          <button key={s} className={`flex items-center justify-between px-4 py-3.5 w-full ${i<arr.length-1?'border-b border-gray-50':''}`}>
            <span className="text-[13px] font-semibold text-gray-900">{s}</span>
            <ChevronRight size={15} className="text-gray-300"/>
          </button>
        ))}
      </Card>

      <SectionLabel label="Akun"/>
      <Card className="mb-6">
        <button onClick={()=>setDel(!showDel)}
          className="flex items-center gap-3 px-4 py-4 w-full border-b border-gray-50">
          <Trash2 size={16} className="text-red-500 flex-shrink-0"/>
          <div className="flex-1 text-left">
            <p className="text-[13px] font-semibold text-red-500">Hapus Akun</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Tindakan ini permanen dan tidak bisa dibatalkan</p>
          </div>
          {showDel ? <ChevronUp size={15} className="text-gray-300"/> : <ChevronDown size={15} className="text-gray-300"/>}
        </button>
        {showDel && (
          <div className="px-4 py-4" style={{background:'#FFF5F5'}}>
            <p className="text-[12px] text-red-700 font-semibold mb-3">Yakin ingin menghapus akun?</p>
            <p className="text-[11px] text-red-500 mb-4 leading-relaxed">Semua data, riwayat transaksi, konten, dan saldo akan dihapus secara permanen.</p>
            <div className="flex gap-2">
              <button onClick={()=>setDel(false)}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-bold bg-white border border-red-200 text-red-500">Batal</button>
              <button onClick={onLogout}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-bold bg-red-500 text-white">Ya, Hapus</button>
            </div>
          </div>
        )}
      </Card>
    </SubScreen>
  )
}

// ── GV Poin ─────────────────────────────────────────────────
function GVPoinScreen({ points=1240, onBack, navigate }) {
  const [tab, setTab] = useState('tukar')
  const REWARDS = [
    {id:1, name:'Diskon Rp 10.000',      points:500,  icon:'🎫', cat:'Voucher'},
    {id:2, name:'Gratis Ongkir 1x',      points:300,  icon:'🚚', cat:'Pengiriman'},
    {id:3, name:'Cashback 5% ESTO',      points:800,  icon:'💰', cat:'Cashback'},
    {id:4, name:'1 Bulan GV+',           points:2000, icon:'👑', cat:'Premium'},
    {id:5, name:'Top Up GV Pay Rp 5rb',  points:1000, icon:'💳', cat:'Saldo'},
    {id:6, name:'Voucher ESTO Rp 25rb',  points:1200, icon:'🛒', cat:'Belanja'},
  ]
  const HISTORY = [
    {desc:'Transaksi ESTO berhasil',   pts:'+50',  date:'Hari ini',    plus:true},
    {desc:'Penukaran voucher diskon',  pts:'-500', date:'28 Jul 2026', plus:false},
    {desc:'Referral teman bergabung',  pts:'+200', date:'25 Jul 2026', plus:true},
    {desc:'Transaksi GV Pay',          pts:'+30',  date:'20 Jul 2026', plus:true},
    {desc:'Bayar tagihan listrik',     pts:'+15',  date:'18 Jul 2026', plus:true},
  ]
  return (
    <SubScreen title="GV Poin" onBack={onBack} navigate={navigate}>
      {/* Balance */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative rounded-2xl p-4 overflow-hidden"
          style={{background:'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)'}}>
          <div className="absolute pointer-events-none" style={{top:'-20%',right:'-10%',width:'60%',height:'60%',background:'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)'}}/>
          <div className="relative">
            <p className="text-white/60 text-[11px] mb-1">Total Poinmu</p>
            <div className="flex items-end gap-2 mb-2">
              <p className="text-white font-extrabold text-[34px] leading-none headline-display tabular-nums">{points.toLocaleString('id')}</p>
              <p className="text-white/50 text-[13px] mb-1">poin</p>
            </div>
            <p className="text-white/40 text-[12px] tabular-nums">≈ Rp {(points * 10).toLocaleString('id')} nilai tukar</p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="mx-4 mb-4">
        <NavTabs
          variant="segmented-light"
          tabs={[
            { id: 'tukar', label: 'Tukar Poin' },
            { id: 'riwayat', label: 'Riwayat Poin' },
          ]}
          activeTab={tab}
          onChange={setTab}
        />
      </div>
      {tab==='tukar' ? (
        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {REWARDS.map(r=>(
            <div key={r.id} className="bg-white rounded-2xl p-3.5 spotlight-border" style={{boxShadow:S.card}}>
              <span className="text-3xl">{r.icon}</span>
              <p className="text-[12px] text-gray-400 mt-1.5">{r.cat}</p>
              <p className="text-[12px] font-bold text-gray-900 mt-0.5 leading-snug">{r.name}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] font-extrabold tabular-nums" style={{color:PRIMARY}}>{r.points} poin</span>
                <button className="text-[12px] font-bold px-2.5 py-1 rounded-lg text-white transition-transform duration-150 active:scale-[0.99]" style={{background:PRIMARY}}>Tukar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 pb-6">
          <Card>
            {HISTORY.map((h,i)=>(
              <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i<HISTORY.length-1?'border-b border-gray-50':''}`}>
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{background:h.plus?'#E8F5E9':'#FFF3E0'}}>
                  {h.plus ? <TrendingUp size={15} style={{color:PRIMARY}}/> : <TrendingDown size={15} style={{color:'#E65100'}}/>}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-gray-900">{h.desc}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{h.date}</p>
                </div>
                <p className="text-[14px] font-extrabold tabular-nums" style={{color:h.plus?PRIMARY:'#E65100'}}>{h.pts}</p>
              </div>
            ))}
          </Card>
        </div>
      )}
    </SubScreen>
  )
}
// ── Form Components ─────────────────────────────────────────
const FormInput = ({ label, value, onChange, placeholder, type='text', inputMode, maxLength, err, hint }) => (
  <div className="rounded-2xl flex-shrink-0 w-full mb-3">
    <p className="text-[11px] font-bold text-gray-400 mb-1.5 flex justify-between">
      <span>{label}</span>
      {err && <span className="text-red-500 font-bold">{err}</span>}
    </p>
    <input type={type} inputMode={inputMode} maxLength={maxLength} placeholder={placeholder} value={value} onChange={onChange}
      className={`w-full rounded-2xl px-4 py-3 text-[13px] outline-none transition-colors ${err?'border-red-400 bg-red-50/50':'border-gray-200 bg-[#FAFAFA] focus:border-gray-400'}`}
      style={{borderWidth:1.5}}/>
    {hint && !err && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
  </div>
)
const FormTextarea = ({ label, value, onChange, placeholder, err }) => (
  <div className="rounded-2xl flex-shrink-0 w-full mb-3">
    <p className="text-[11px] font-bold text-gray-400 mb-1.5 flex justify-between">
      <span>{label}</span>
      {err && <span className="text-red-500 font-bold">{err}</span>}
    </p>
    <textarea placeholder={placeholder} value={value} onChange={onChange} rows={3}
      className={`w-full rounded-2xl px-4 py-3 text-[13px] outline-none transition-colors ${err?'border-red-400 bg-red-50/50':'border-gray-200 bg-[#FAFAFA] focus:border-gray-400'}`}
      style={{borderWidth:1.5, resize:'none'}}/>
  </div>
)
const FormSelect = ({ label, value, onChange, options, err, disabled }) => (
  <div className={`rounded-2xl flex-shrink-0 w-full mb-3 ${disabled?'opacity-50 pointer-events-none':''}`}>
    <p className="text-[11px] font-bold text-gray-400 mb-1.5 flex justify-between">
      <span>{label}</span>
      {err && <span className="text-red-500 font-bold">{err}</span>}
    </p>
    <div className="relative">
      <select value={value} onChange={onChange} disabled={disabled}
        className={`w-full rounded-2xl px-4 py-3.5 text-[13px] outline-none appearance-none transition-colors font-medium ${err?'border-red-400 bg-red-50/50 text-red-900':'border-gray-200 bg-[#FAFAFA] focus:border-gray-400 text-gray-900'}`}
        style={{borderWidth:1.5}}>
        <option value="" disabled>Pilih {label}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
    </div>
  </div>
)
const FormFileUpload = ({ label }) => (
  <div className="rounded-2xl flex-shrink-0 w-full mb-3">
    <p className="text-[11px] font-bold text-gray-400 mb-1.5">{label}</p>
    <div className="w-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-6 bg-gray-50 active:bg-gray-100 cursor-pointer transition">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2"><Check size={16} className="text-gray-400"/></div>
      <p className="text-[12px] font-semibold text-gray-600">Tap untuk upload foto</p>
    </div>
  </div>
)

const FormTagsInput = ({ label, tags, onAdd, onRemove, placeholder, hint, err }) => {
  const [val, setVal] = useState('')
  return (
    <div className="rounded-2xl flex-shrink-0 w-full mb-3">
      <p className="text-[11px] font-bold text-gray-400 mb-1.5 flex justify-between">
        <span>{label}</span>
        {err && <span className="text-red-500 font-bold">{err}</span>}
      </p>
      <div className={`w-full rounded-2xl p-2 min-h-[50px] flex flex-wrap gap-2 transition-colors ${err?'border-red-400 bg-red-50/50':'border-gray-200 bg-[#FAFAFA] focus-within:border-gray-400'}`} style={{borderWidth:1.5}}>
        {tags.map((t, i) => (
          <div key={i} className="flex items-center gap-1.5 bg-[#E8EAF6] text-[#3949AB] px-2.5 py-1.5 rounded-lg text-[12px] font-semibold shadow-sm">
            {t}
            <div className="bg-white/50 p-0.5 rounded-full cursor-pointer hover:bg-white transition-colors" onClick={() => onRemove(t)}>
              <X size={12} className="text-[#3949AB]" />
            </div>
          </div>
        ))}
        <input type="text" value={val} onChange={e=>setVal(e.target.value)} 
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (val.trim()) {
                onAdd(val.trim());
                setVal('');
              }
            }
          }}
          placeholder={tags.length === 0 ? placeholder : 'Tambah lagi...'}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[13px] px-2 py-1" />
      </div>
      {hint && !err && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// MOCK PREFILL
const MOCK_USER_DATA = {
  name: 'Kiagus Gatot', 
  nik: '3201021234567890',
  gender: 'Laki-laki',
  photo: null,
  prov: 'Jawa Barat',
  kab: 'Kabupaten Bogor',
  kec: 'Dramaga',
  desa: 'Cikarawang',
  phone: '081234567890',
  email: 'kiagus@desa.id',
  address: 'Jl. Merdeka No 1',
  pos: '16680'
}

// ── Bottom Sheet Pilihan Foto ────────────────────────────────
function PhotoSheet({ isOpen, onClose, onRemovePhoto }) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 px-4 pt-4 pb-8 transition-transform translate-y-0"
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 32px rgba(15, 26, 19, 0.12)',
        }}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-surface-200 rounded-full mx-auto mb-4" />

        {/* Judul */}
        <h3 className="text-[14px] font-bold text-surface-900 text-center mb-4">
          Foto Profil
        </h3>

        {/* Tiga tombol opsi */}
        <div className="flex flex-col">
          {/* Opsi 1 — Ambil Foto Baru */}
          <button
            type="button"
            onClick={() => {
              onClose()
              alert('Fitur kamera akan tersedia segera')
            }}
            className="flex items-center gap-3 p-3 rounded-xl active:bg-surface-50 text-left transition w-full"
          >
            <SkeuoIcon icon={Camera} gradient={['#1B5E20', '#2E7D32']} size="sm" />
            <div>
              <p className="font-semibold text-[14px] text-surface-800">Ambil Foto Baru</p>
              <p className="text-[11px] text-surface-400 mt-0.5">Gunakan kamera perangkatmu</p>
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-surface-100 mx-1" />

          {/* Opsi 2 — Pilih dari Galeri */}
          <button
            type="button"
            onClick={() => {
              onClose()
              alert('Fitur galeri akan tersedia segera')
            }}
            className="flex items-center gap-3 p-3 rounded-xl active:bg-surface-50 text-left transition w-full"
          >
            <SkeuoIcon icon={ImagePlus} gradient={['#1565C0', '#1976D2']} size="sm" />
            <div>
              <p className="font-semibold text-[14px] text-surface-800">Pilih dari Galeri</p>
              <p className="text-[11px] text-surface-400 mt-0.5">Pilih foto dari galeri perangkatmu</p>
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-surface-100 mx-1" />

          {/* Opsi 3 — Hapus Foto Profil */}
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onRemovePhoto) onRemovePhoto()
            }}
            className="flex items-center gap-3 p-3 rounded-xl active:bg-surface-50 text-left transition w-full"
          >
            <SkeuoIcon icon={Trash2} gradient={['#C62828', '#E53935']} size="sm" />
            <div>
              <p className="font-semibold text-[14px] text-red-600">Hapus Foto Profil</p>
              <p className="text-[11px] text-red-400 mt-0.5">Kembali ke tampilan inisial nama</p>
            </div>
          </button>
        </div>

        {/* Tombol Batal */}
        <GlassCard
          variant="interactive"
          onClick={onClose}
          className="mt-2 py-3 text-center w-full flex items-center justify-center cursor-pointer"
        >
          <span className="font-semibold text-[14px] text-surface-600">Batal</span>
        </GlassCard>
      </div>
    </>
  )
}

// ── Edit Profil ─────────────────────────────────────────────
function EditProfilScreen({ userData, userProfile, onBack, onSave, navigate }) {
  const fallback = MOCK_USER_DATA
  const [form, setForm] = useState({
    photo: userData?.photo || fallback.photo,
    name: userData?.name || userProfile?.name || fallback.name || '',
    bio: userData?.bio || fallback.bio || '',
  })
  const [errors, setErrors] = useState({})
  const [showPhotoSheet, setShowPhotoSheet] = useState(false)

  const validateAndSave = () => {
    const err = {}
    if (!form.name || !form.name.trim()) err.name = 'Nama tampilan wajib diisi'
    
    setErrors(err)
    if (Object.keys(err).length === 0) {
      onSave(form)
      onBack()
    }
  }

  const rawPhone = userData?.phone || userProfile?.phone || fallback.phone || ''
  const phoneDigits = rawPhone.replace(/\D/g, '')
  const maskedPhone = rawPhone
    ? `+62 8xx-xxxx-xx${phoneDigits ? phoneDigits.slice(-2) : 'xx'}`
    : '+62 8xx-xxxx-xxxx'

  const currentDesa = userData?.desa || userProfile?.desa || fallback.desa || ''

  return (
    <SubScreen title="Edit Data Profil" onBack={onBack} navigate={navigate}>
      <div className="flex flex-col min-h-full">
        <div className="px-4 py-5 flex flex-col gap-4 flex-1">
          {/* Avatar dengan badge kamera pojok kanan bawah */}
          <div className="relative w-20 h-20 mx-auto mt-5">
            {/* Avatar utama */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #1B5E20, #2E7D32)' }}
            >
              {form.photo ? (
                <img src={form.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-extrabold text-white text-[26px]">
                  {(form.name || 'U')[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Badge kamera — pojok kanan bawah */}
            <button
              type="button"
              onClick={() => setShowPhotoSheet(true)}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-2 border-white transition active:scale-95"
              style={{
                background: 'linear-gradient(145deg, #1B5E20, #2E7D32)',
                boxShadow: '0 2px 8px rgba(27,94,32,0.35)',
              }}
              aria-label="Ganti Foto"
            >
              <Camera size={13} strokeWidth={2.5} className="text-white" />
            </button>
          </div>

          {/* Card Status Verifikasi */}
          {userData?.verificationStatus === 'pending' ? (
            <div className="bg-[#E3F2FD] border border-blue-200 rounded-xl p-3 flex items-start gap-2">
              <Clock size={15} className="text-[#1565C0] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[13px] text-blue-800">Verifikasi Sedang Ditinjau</p>
                <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                  Data & wajahmu sedang ditinjau oleh tim GV (estimasi 1–2 hari kerja).
                </p>
              </div>
            </div>
          ) : (userData?.verificationStatus === 'verified' || userProfile?.verified === true || userProfile?.capabilities?.includes('Penjual') || userProfile?.capabilities?.includes('Kreator') || userProfile?.capabilities?.includes('Admin Komunitas') || localStorage.getItem('mockVerificationStatus') === 'verified') ? (
            <div className="bg-[#E8F5E9] border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle size={15} className="text-green-700 flex-shrink-0" />
              <span className="text-[12px] text-green-800 font-medium">Identitas Terverifikasi</span>
            </div>
          ) : (
            <div className="bg-[#FFFDE7] border border-yellow-200 rounded-xl p-3 flex items-center justify-between">
              <span className="text-[12px] text-yellow-800 font-medium">
                Identitas belum diverifikasi
              </span>
              <button
                type="button"
                onClick={() => navigate?.('verifikasi')}
                className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition active:scale-95 flex-shrink-0"
              >
                Verifikasi →
              </button>
            </div>
          )}

          {/* FIELD 1 — Nama Tampilan */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5">
              Nama Tampilan
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama yang terlihat warga lain"
              className={`w-full bg-white border border-surface-200 rounded-2xl px-4 py-3 text-[13px] outline-none transition-all font-medium text-gray-900 focus:ring-1 focus:ring-green-600 focus:border-green-600 ${
                errors.name ? 'border-red-400 bg-red-50/50 text-red-900' : ''
              }`}
            />
            <p className="text-[11px] text-surface-400 mt-1">
              Nama ini yang dilihat warga GV lain. Berbeda dengan nama di KTP.
            </p>
            {errors.name && <p className="text-[11px] text-red-500 mt-0.5 font-medium">{errors.name}</p>}
          </div>

          {/* FIELD 2 — Nomor HP */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5">
              Nomor HP
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                disabled
                value={maskedPhone}
                className="w-full bg-surface-100 border border-surface-200 rounded-2xl pl-4 pr-10 py-3 text-[13px] text-surface-400 cursor-not-allowed font-medium outline-none"
              />
              <Info size={15} color="#9CA3AF" className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-surface-400 mt-1">
              Tidak dapat diubah. Hubungi support jika perlu.
            </p>
          </div>

          {/* FIELD 3 — Desa / Lokasi */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5">
              Desa / Lokasi
            </label>
            <button
              type="button"
              onClick={() => navigate?.('desa-profile')}
              className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer active:bg-surface-100 transition text-left"
            >
              <span className={`text-[13px] ${currentDesa ? 'text-gray-900 font-medium' : 'text-surface-400'}`}>
                {currentDesa || 'Belum dipilih'}
              </span>
              <ChevronRight size={16} className="text-surface-400 flex-shrink-0" />
            </button>
          </div>

        </div>

        {/* Sticky Bottom Save Button */}
        <div className="sticky bottom-0 bg-white border-t border-surface-100 px-4 py-3 z-10">
          <button
            type="button"
            onClick={validateAndSave}
            className="w-full text-white font-bold rounded-xl py-3.5 text-[15px] shadow-sm transition active:scale-[0.98] flex items-center justify-center"
            style={{ background: PRIMARY }}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Bottom Sheet Pilihan Foto */}
      <PhotoSheet
        isOpen={showPhotoSheet}
        onClose={() => setShowPhotoSheet(false)}
        onRemovePhoto={() => setForm((f) => ({ ...f, photo: null }))}
      />
    </SubScreen>
  )
}

// ── Aktivasi ────────────────────────────────────────────────
function AktivasiScreen({ onBack, onActivate, navigate }) {
  const [appStatus, setAppStatus] = useState(() => localStorage.getItem('mockSellerAppStatus') || 'not_applied')
  const [step, setStep] = useState(1)
  const mockUser = MOCK_USER_DATA
  const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  const [estoForm, setEstoForm] = useState({
    storeName: '', storeCategory: 'Sayur & Buah', storeDesc: '',
    address: '', desa: '', kec: '', kab: '', prov: '', pos: '',
    jamOperasional: Object.fromEntries(DAYS.map(d => [d, { buka: '08:00', tutup: '17:00', isTutup: false }])),
    contact: mockUser.phone, deliveryMethods: [],
    bankName: 'BRI', accountName: '', accountNum: '', method: 'Transfer Bank', agreed: false
  })
  const [errors, setErrors] = useState({})
  const [showMapPicker, setShowMapPicker] = useState(false)
  const PRIMARY = '#E65100' // Using orange as the primary color for ESTO/Toko

  useEffect(() => {
    localStorage.setItem('mockSellerAppStatus', appStatus)
  }, [appStatus])

  const validate = () => {
    const err = {}
    if (step === 1) {
      if (!estoForm.storeName) err.storeName = 'Nama toko wajib diisi'
      if (!estoForm.storeDesc) err.storeDesc = 'Deskripsi toko wajib diisi'
      if (!estoForm.address) err.address = 'Alamat toko wajib diisi'
      if (!estoForm.contact) err.contact = 'Nomor kontak wajib diisi'
    } else if (step === 2) {
      if (!estoForm.storeCategory) err.storeCategory = 'Kategori produk wajib diisi'
      if (estoForm.deliveryMethods.length === 0) err.deliveryMethods = 'Pilih minimal satu metode pengiriman'
      let hasOpenDay = false
      Object.entries(estoForm.jamOperasional).forEach(([day, sched]) => {
        if (!sched.isTutup) {
          hasOpenDay = true
          if (!sched.buka || !sched.tutup) err.jam = `Jam ${day} wajib diisi`
          else if (sched.tutup <= sched.buka) err.jam = `Jam tutup ${day} tidak valid`
        }
      })
      if (!hasOpenDay) err.jam = 'Minimal satu hari harus buka'
    } else if (step === 3) {
      if (!estoForm.agreed) err.agreed = 'Anda harus menyetujui syarat & ketentuan'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    if (step < 3) {
      setStep(s => s + 1)
      document.getElementById('aktivasi-scroll')?.scrollTo(0, 0)
    } else { 
      setAppStatus('pending')
    }
  }

  // === RENDERS ===

  if (appStatus === 'not_applied') {
    return (
      <div className="flex flex-col h-full bg-[#FAFBF9]">
        <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #E65100 0%, #F57C00 100%)'}}>
          <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
            <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <ArrowLeft size={16} className="text-white"/>
            </button>
            <p className="font-extrabold text-white text-[20px] tracking-tight leading-tight">Toko Saya</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <Store size={48} className="text-orange-500"/>
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900 mb-3 tracking-tight">Mulai Berjualan di ESTO</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-8">Jual produk dari desa dan jangkau lebih banyak pembeli melalui ESTO.</p>
          <div className="flex flex-col gap-3 w-full text-left mb-8">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[12px] font-bold">1</span><span className="text-[13px] font-bold text-gray-700">Lengkapi profil toko</span></div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[12px] font-bold">2</span><span className="text-[13px] font-bold text-gray-700">Atur informasi produk dan toko</span></div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"><span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[12px] font-bold">3</span><span className="text-[13px] font-bold text-gray-700">Ajukan toko untuk ditinjau tim GV</span></div>
          </div>
          <button onClick={()=>{setAppStatus('draft'); setStep(1)}} className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform" style={{background:PRIMARY}}>
            Mulai Pendaftaran
          </button>
        </div>
      </div>
    )
  }

  if (appStatus === 'pending' || appStatus === 'revision' || appStatus === 'rejected') {
    return (
      <div className="flex flex-col h-full bg-[#FAFBF9]">
        <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #E65100 0%, #F57C00 100%)'}}>
          <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
            <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.1)'}}>
              <ArrowLeft size={16} className="text-white"/>
            </button>
            <p className="font-extrabold text-white text-[20px] tracking-tight leading-tight">Status Aplikasi</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center text-center px-5 pt-12 overflow-y-auto">
          {appStatus === 'pending' && (
            <>
              <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6"><Clock size={32} /></div>
              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Pengajuan Sedang Ditinjau</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-8">Tim GV sedang meninjau profil dan informasi toko Anda. Proses ini memakan waktu maksimal 1x24 jam kerja.</p>
            </>
          )}
          {appStatus === 'revision' && (
            <>
              <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6"><Info size={32} /></div>
              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Pengajuan Perlu Diperbaiki</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">Pengajuan Anda memerlukan beberapa penyesuaian sebelum toko dapat diaktifkan.</p>
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left shadow-sm mb-6">
                <p className="text-[12px] font-bold text-amber-900 mb-1">Catatan dari Tim Kurasi:</p>
                <p className="text-[12px] text-amber-800 leading-relaxed">Mohon perjelas deskripsi toko dan pastikan foto toko terlihat jelas.</p>
              </div>
              <button onClick={()=>{setAppStatus('draft'); setStep(1)}} className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform" style={{background:PRIMARY}}>
                Perbaiki Pengajuan
              </button>
            </>
          )}
          {appStatus === 'rejected' && (
            <>
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6"><Info size={32} /></div>
              <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">Pengajuan Belum Disetujui</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">Mohon maaf, pengajuan toko Anda belum dapat disetujui saat ini.</p>
              <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-left shadow-sm mb-6">
                <p className="text-[12px] font-bold text-red-900 mb-1">Alasan Penolakan:</p>
                <p className="text-[12px] text-red-800 leading-relaxed">Produk yang diajukan tidak sesuai dengan pedoman ESTO.</p>
              </div>
              <button onClick={()=>{setAppStatus('draft'); setStep(1)}} className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform bg-gray-800">
                Ajukan Kembali
              </button>
            </>
          )}

          {/* Dev Tools */}
          <div className="mt-auto mb-6 pt-12 flex flex-col gap-2 opacity-30 hover:opacity-100 transition-opacity w-full">
            <p className="text-[10px] font-bold text-gray-400">DEV TOOLS (MOCK STATUS)</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-[11px] font-bold" onClick={()=>setAppStatus('pending')}>Pending</button>
              <button className="px-3 py-1.5 bg-amber-100 text-amber-600 rounded-lg text-[11px] font-bold" onClick={()=>setAppStatus('revision')}>Revision</button>
              <button className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-[11px] font-bold" onClick={()=>setAppStatus('rejected')}>Rejected</button>
              <button className="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg text-[11px] font-bold" onClick={()=>alert('Untuk menyetujui, login dengan profile yang memiliki capability "Penjual". Di environment test, set ini secara global.')}>Approved (Mock)</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === DRAFT FORM ===
  const STEPS = [
    { label: 'Informasi Toko', sub: 'Nama, deskripsi & lokasi' },
    { label: 'Informasi Penjualan', sub: 'Produk & operasional' },
    { label: 'Pengajuan Toko', sub: 'Ringkasan & syarat' }
  ]

  return (
    <div className="flex flex-col h-full bg-[#FAFBF9]">
      <div className="flex-shrink-0 relative overflow-hidden" style={{background:'linear-gradient(135deg, #E65100 0%, #F57C00 100%)'}}>
        <div className="flex items-center px-4 pt-5 pb-4 relative z-10">
          <button onClick={()=>{
            if (step > 1) setStep(s=>s-1)
            else setAppStatus('not_applied')
          }} className="w-9 h-9 rounded-xl flex items-center justify-center me-3 flex-shrink-0 transition active:scale-[0.96]" style={{background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.1)'}}>
            <ArrowLeft size={16} className="text-white"/>
          </button>
          <p className="font-extrabold text-white text-[16px] tracking-tight leading-tight">Pendaftaran Toko</p>
        </div>
      </div>
      
      <div id="aktivasi-scroll" className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
        {/* Progress Header */}
        <div>
          <div className="flex gap-2 mb-3">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E0E0E0' }}>
                {i < step && <div className="w-full h-full rounded-full transition-all" style={{ background: `linear-gradient(90deg, ${PRIMARY}CC, ${PRIMARY})` }} />}
              </div>
            ))}
          </div>
          <p className="text-[14px] font-extrabold text-gray-900">Langkah {step} dari {STEPS.length}</p>
          <p className="text-[12px] text-gray-500">{STEPS[step-1].label}</p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="bg-[#FFF3E0] rounded-2xl p-4 border border-[#E65100]20">
              <p className="text-[13px] font-bold text-gray-900 mb-1">Informasi Publik Toko</p>
              <p className="text-[12px] text-gray-600 leading-relaxed">Profil toko Anda terpisah dari data identitas KTP. Informasi ini akan tampil secara publik di Pasar ESTO.</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Foto / Logo Toko</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                  <Store size={24} className="text-gray-400"/>
                </div>
                <button className="px-4 py-2 text-[12px] font-bold text-[#E65100] bg-[#E65100]10 rounded-xl">Unggah Foto</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Nama Toko</span>
                {errors.storeName && <span className="text-red-500 font-bold">{errors.storeName}</span>}
              </p>
              <input value={estoForm.storeName} onChange={e=>setEstoForm(f=>({...f,storeName:e.target.value}))} placeholder="cth. Toko Bu Sari" className={`w-full bg-white border ${errors.storeName?'border-red-300':'border-gray-200'} rounded-2xl px-4 py-3.5 text-[13px] outline-none focus:border-[#E65100]`} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Deskripsi Toko</span>
                {errors.storeDesc && <span className="text-red-500 font-bold">{errors.storeDesc}</span>}
              </p>
              <textarea value={estoForm.storeDesc} onChange={e=>setEstoForm(f=>({...f,storeDesc:e.target.value}))} placeholder="Deskripsikan barang yang dijual..." className={`w-full bg-white border ${errors.storeDesc?'border-red-300':'border-gray-200'} rounded-2xl px-4 py-3.5 text-[13px] outline-none min-h-[80px] focus:border-[#E65100]`} />
            </div>
            
            <div className="h-px bg-gray-100 my-2" />

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Alamat Toko</span>
                {errors.address && <span className="text-red-500 font-bold">{errors.address}</span>}
              </p>
              <input value={estoForm.address} onChange={e=>setEstoForm(f=>({...f,address:e.target.value}))} placeholder="Alamat lengkap toko" className={`w-full bg-white border ${errors.address?'border-red-300':'border-gray-200'} rounded-2xl px-4 py-3.5 text-[13px] outline-none mb-3 focus:border-[#E65100]`} />
              
              {/* Interactive Map Picker Trigger */}
              <div
                onClick={() => setShowMapPicker(true)}
                className="w-full rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3.5 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 active:scale-[0.98] transition group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center flex-shrink-0 border border-emerald-100">
                    <MapPin size={20} className="text-emerald-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-extrabold text-emerald-950 truncate">
                      {estoForm.address || 'Pilih Titik Lokasi Toko di Peta'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      {estoForm.address ? 'Titik lokasi terpilih · Ketuk untuk sesuaikan' : 'Buka peta desa interaktif'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-[11px] font-extrabold flex-shrink-0 shadow-xs group-hover:bg-emerald-800 transition">
                  {estoForm.address ? 'Ubah' : 'Buka Peta'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Nomor Kontak Toko</span>
                {errors.contact && <span className="text-red-500 font-bold">{errors.contact}</span>}
              </p>
              <input type="number" value={estoForm.contact} onChange={e=>setEstoForm(f=>({...f,contact:e.target.value}))} placeholder="Nomor HP/WA yang bisa dihubungi" className={`w-full bg-white border ${errors.contact?'border-red-300':'border-gray-200'} rounded-2xl px-4 py-3.5 text-[13px] outline-none focus:border-[#E65100]`} />
            </div>
            
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5 mt-2">
              <Shield size={16} className="text-gray-400 mt-0.5 flex-shrink-0"/>
              <div>
                <p className="text-[11px] font-bold text-gray-700">Identitas Terverifikasi</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Toko terhubung dengan identitas: {mockUser.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between">
                <span>Kategori Produk Utama</span>
                {errors.storeCategory && <span className="text-red-500 font-bold">{errors.storeCategory}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Sayur & Buah', 'Pangan & Sembako', 'Kerajinan', 'Ternak & Ikan', 'Pupuk & Bibit', 'Lainnya'].map(k=>(
                  <button key={k} onClick={()=>setEstoForm(f=>({...f, storeCategory: k}))} 
                    className={`py-2 px-3.5 rounded-xl text-[12px] font-semibold transition ${estoForm.storeCategory===k?'bg-[#E65100] text-white shadow-md border-transparent':'bg-white text-gray-600 border border-gray-200'}`} style={{borderWidth: estoForm.storeCategory===k?0:1}}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between">
                <span>Metode Pengiriman</span>
                {errors.deliveryMethods && <span className="text-red-500 font-bold">{errors.deliveryMethods}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {['Ambil di Toko', 'Kurir Lokal GV', 'Ekspedisi Nasional'].map(t=>(
                  <button key={t} onClick={()=>{
                    setEstoForm(f=>({...f, deliveryMethods: f.deliveryMethods.includes(t) ? f.deliveryMethods.filter(x=>x!==t) : [...f.deliveryMethods, t]}))
                  }} className={`py-2 px-3.5 rounded-xl text-[12px] font-semibold transition ${estoForm.deliveryMethods.includes(t)?'bg-[#E65100] text-white shadow-md border-transparent':'bg-white text-gray-600 border border-gray-200'}`} style={{borderWidth: estoForm.deliveryMethods.includes(t)?0:1}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-gray-100 my-1" />

            <div className="rounded-2xl flex-shrink-0 w-full mb-4 mt-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Hari & Jam Operasional</span>
                {errors.jam && <span className="text-red-500 font-bold">{errors.jam}</span>}
              </p>
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                {DAYS.map(day => {
                  const sched = estoForm.jamOperasional[day]
                  return (
                    <button key={day} 
                      onClick={() => setEstoForm(f => ({...f, jamOperasional: {...f.jamOperasional, [day]: {...sched, isTutup: !sched.isTutup}}}))}
                      className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all ${!sched.isTutup ? 'bg-[#E65100] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                      {day.slice(0,3)}
                    </button>
                  )
                })}
              </div>
              
              {DAYS.some(d => !estoForm.jamOperasional[d].isTutup) && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-[11px] font-bold text-gray-400">Atur Jam Buka-Tutup</span>
                    <button onClick={() => {
                      const firstOpenDay = DAYS.find(d => !estoForm.jamOperasional[d].isTutup);
                      const { buka, tutup } = estoForm.jamOperasional[firstOpenDay];
                      setEstoForm(f => {
                        const newJam = { ...f.jamOperasional };
                        DAYS.forEach(d => { if (!newJam[d].isTutup) newJam[d] = { ...newJam[d], buka, tutup } });
                        return { ...f, jamOperasional: newJam };
                      });
                    }}
                    className="text-[10px] font-bold text-[#E65100] bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-100 flex items-center gap-1 active:scale-95 transition-transform">
                      <Copy size={12}/> Terapkan ke Semua
                    </button>
                  </div>

                  {DAYS.map(day => {
                    const sched = estoForm.jamOperasional[day]
                    if (sched.isTutup) return null;
                    return (
                      <div key={day} className={`flex items-center justify-between p-3 rounded-xl border-[1.5px] bg-white transition-colors ${errors.jam?.includes(day) ? 'border-red-400' : 'border-gray-100'}`}>
                        <span className="text-[13px] font-bold text-gray-900 w-16">{day}</span>
                        <div className="flex-1 flex gap-2 items-center justify-end">
                          <input type="time" value={sched.buka} onChange={e=>setEstoForm(f=>({...f,jamOperasional:{...f.jamOperasional,[day]:{...sched,buka:e.target.value}}}))}
                            className="w-24 px-3 py-2 text-[12px] outline-none border border-gray-200 rounded-lg bg-gray-50 focus:border-[#E65100] focus:bg-white shadow-sm transition-colors font-medium"/>
                          <span className="text-gray-300 font-bold">–</span>
                          <input type="time" value={sched.tutup} onChange={e=>setEstoForm(f=>({...f,jamOperasional:{...f.jamOperasional,[day]:{...sched,tutup:e.target.value}}}))}
                            className="w-24 px-3 py-2 text-[12px] outline-none border border-gray-200 rounded-lg bg-gray-50 focus:border-[#E65100] focus:bg-white shadow-sm transition-colors font-medium"/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            <div className="h-px bg-gray-100 my-1" />
            
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Nomor Rekening Pencairan</span>
              </p>
              <input type="text" inputMode="numeric" maxLength={16} value={estoForm.accountNum} onChange={e=>{const val = e.target.value.replace(/\D/g, '').slice(0, 16); setEstoForm(f=>({...f,accountNum:val}))}} placeholder="Masukkan nomor rekening (opsional)" className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-[13px] outline-none focus:border-[#E65100]" />
              <p className="text-[10px] text-gray-400 mt-2 px-1">Bisa diatur nanti setelah toko disetujui.</p>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ringkasan Toko</p>
                <button onClick={()=>setStep(1)} className="text-[11px] font-bold text-[#E65100]">Ubah</button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] text-gray-500 w-24 flex-shrink-0">Nama Toko</span>
                  <span className="text-[12px] font-semibold text-gray-900 text-right">{estoForm.storeName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[12px] text-gray-500 w-24 flex-shrink-0">Kategori</span>
                  <span className="text-[12px] font-semibold text-gray-900 text-right">{estoForm.storeCategory}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[12px] text-gray-500 w-24 flex-shrink-0">Alamat</span>
                  <span className="text-[12px] font-semibold text-gray-900 text-right line-clamp-2">{estoForm.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF3E0] rounded-2xl p-4 border border-[#E65100]20">
              <p className="text-[13px] font-bold text-[#E65100] mb-3">Persetujuan Penjual ESTO</p>
              <ul className="text-[12px] text-gray-700 leading-relaxed list-disc ms-4 mb-4 flex flex-col gap-2">
                <li>Pengajuan toko akan ditinjau oleh tim GV sebelum toko dapat mulai berjualan.</li>
                <li>Hanya menjual produk yang sesuai dengan kategori dan tidak melanggar hukum.</li>
                <li>Menjamin kualitas dan kesegaran produk terutama untuk kategori pangan/sayur.</li>
              </ul>
              
              <div className="h-px bg-[#E65100]20 my-4"/>
              
              {errors.agreed && <p className="text-[12px] font-bold text-red-500 mb-2">{errors.agreed}</p>}
              <div className="flex items-start gap-3 p-1 cursor-pointer select-none" onClick={()=>setEstoForm(f=>({...f,agreed:!f.agreed}))}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${estoForm.agreed?'bg-[#E65100] border-transparent':'bg-white border-[1.5px] border-gray-300'}`}>
                  {estoForm.agreed && <Check size={14} className="text-white"/>}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-800 leading-relaxed">Saya setuju dengan Ketentuan Penjual ESTO dan memastikan data yang dimasukkan benar.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-6 pt-3 border-t border-gray-100 bg-white">
        <button onClick={handleNext} 
          disabled={step === 3 && !estoForm.agreed}
          className={`w-full h-14 rounded-2xl text-[14px] font-bold text-white transition-transform flex items-center justify-center shadow-md ${step === 3 && !estoForm.agreed ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`} 
          style={{background:PRIMARY}}>
          {step < STEPS.length ? 'Lanjut →' : 'Ajukan untuk Review'}
        </button>
      </div>

      {/* Interactive Location Picker Modal */}
      {showMapPicker && (
        <LocationPickerMap
          initialLocation={estoForm.address || 'Desa Sukamaju, Kec. Sukamakmur, Bogor'}
          onBack={() => setShowMapPicker(false)}
          onConfirm={(result) => {
            const label =
              typeof result === 'object' && result?.locationLabel
                ? result.locationLabel
                : typeof result === 'string'
                ? result
                : 'Desa Sukamaju, Kec. Sukamakmur, Bogor'
            setEstoForm((f) => ({
              ...f,
              address: label,
              lat: result?.lat,
              lng: result?.lng,
            }))
            setShowMapPicker(false)
          }}
        />
      )}
    </div>
  )
}

// ── GV+ ─────────────────────────────────────────────────────
function GVPlusScreen({ onBack, navigate }) {
  const [period, setPeriod] = useState('quarterly')
  const PLANS = {
    monthly:   {label:'Bulanan',  price:'Rp 19.000', orig:'Rp 35.000', badge:null,           saving:null       },
    quarterly: {label:'3 Bulan', price:'Rp 49.000', orig:'Rp 105.000',badge:'Paling Hemat', saving:'Hemat 53%'},
    yearly:    {label:'Tahunan', price:'Rp 179.000',orig:'Rp 420.000',badge:null,           saving:'Hemat 57%'},
  }
  const BENEFITS = ['Akses semua konten GV TV & VOD premium','Nonton & dengarkan tanpa iklan','Download untuk ditonton offline','Podcast eksklusif GV+','Akses awal konten & episode baru','Tersedia di semua perangkat']
  const plan = PLANS[period]
  return (
    <div className="flex flex-col h-full" style={{background:'#0C1E0C'}}>
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b" style={{borderColor:'rgba(255,255,255,0.08)'}}>
        <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'rgba(255,255,255,0.1)'}}>
          <ArrowLeft size={16} className="text-white"/>
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg" style={{background:'linear-gradient(90deg,#F57F17,#F9A825)'}}>
            <span className="text-white font-extrabold text-[14px]">GV+</span>
          </div>
          <span className="text-white/50 text-[12px]">Premium</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
        <p className="text-white font-extrabold text-[20px] mb-1">Nikmati konten tanpa batas</p>
        <p className="text-white/40 text-[12px] mb-5 leading-relaxed">Akses semua konten eksklusif GV Media kapan saja dan di mana saja.</p>
        {BENEFITS.map(b=>(
          <div key={b} className="flex items-center gap-2.5 mb-3">
            <CheckCircle size={14} style={{color:'#69F0AE',flexShrink:0}}/>
            <span className="text-white/80 text-[13px]">{b}</span>
          </div>
        ))}
        <div className="h-px my-5" style={{background:'rgba(255,255,255,0.08)'}}/>
        <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-3">Pilih Paket</p>
        <div className="flex flex-col gap-2.5 mb-5">
          {Object.entries(PLANS).map(([id,p])=>(
            <button key={id} onClick={()=>setPeriod(id)}
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-left w-full transition duration-150"
              style={period===id
                ?{background:'rgba(249,168,37,0.15)',border:'1.5px solid #F9A825',backdropFilter:'blur(12px)'}
                :{background:'rgba(255,255,255,0.05)',border:'1.5px solid rgba(255,255,255,0.1)',backdropFilter:'blur(12px)'}}>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={period===id?{borderColor:'#F9A825'}:{borderColor:'rgba(255,255,255,0.3)'}}>
                  {period===id&&<div className="w-2 h-2 rounded-full" style={{background:'#F9A825'}}/>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-white">{p.label}</span>
                    {p.badge&&<span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full" style={{background:'#F9A825',color:'#000'}}>{p.badge}</span>}
                  </div>
                  {p.saving&&<p className="text-[12px] font-semibold" style={{color:'#69F0AE'}}>{p.saving}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-extrabold text-white">{p.price}</p>
                <p className="text-[11px] text-white/30 line-through">{p.orig}</p>
              </div>
            </button>
          ))}
        </div>
        <button className="w-full py-3.5 rounded-2xl text-[13px] font-extrabold text-white mb-2 transition-transform duration-150 active:scale-[0.99]"
          style={{background:'linear-gradient(90deg,#F57F17,#F9A825)',boxShadow:'0 8px 24px rgba(249,168,37,0.35), 0 2px 6px rgba(0,0,0,0.2)'}}>
          Berlangganan {plan.label} · {plan.price}
        </button>
        <p className="text-center text-[12px] text-white/30">Batalkan kapan saja · Tanpa komitmen jangka panjang</p>
      </div>
    </div>
  )
}

// ── Bantuan & FAQ ────────────────────────────────────────────
function BantuanScreen({ onBack, navigate }) {
  const [open, setOpen] = useState(null)
  const FAQS = [
    {q:'Bagaimana cara top up GV Pay?', a:'Buka menu GV Pay → Top Up → pilih nominal dan metode pembayaran (transfer bank, QRIS, atau kartu kredit). Saldo masuk dalam 1–5 menit.'},
    {q:'Bagaimana cara menjual produk di ESTO?', a:'Aktifkan fitur Penjual di menu Profil → Aktivasi Penjual. Setelah diverifikasi, tambahkan produk melalui Toko Saya di ESTO.'},
    {q:'Apa itu GV Poin dan cara mendapatkannya?', a:'GV Poin adalah reward untuk setiap transaksi di G-Village. Dapatkan dari belanja ESTO, bayar tagihan, ajak teman bergabung, atau transaksi GV Pay.'},
    {q:'Bagaimana cara bergabung dengan komunitas?', a:'Buka Komunitas → Jelajahi → pilih komunitas → tap Gabung. Beberapa komunitas memerlukan persetujuan admin.'},
    {q:'Apakah saldo GV Pay bisa ditarik ke rekening?', a:'Saldo GV Pay saat ini hanya untuk transaksi di dalam aplikasi. Fitur penarikan ke rekening sedang dalam pengembangan.'},
    {q:'Apa yang harus dilakukan jika pesanan tidak tiba?', a:'Hubungi penjual melalui chat di detail pesanan. Jika tidak ada respons dalam 24 jam, ajukan komplain melalui menu Bantuan.'},
  ]
  return (
    <SubScreen title="Bantuan & FAQ" onBack={onBack} navigate={navigate}>
      <div className="px-4 py-4 flex flex-col gap-2.5">
        {FAQS.map((faq,i)=>(
          <div key={i} className="bg-white rounded-2xl overflow-hidden spotlight-border" style={{boxShadow:S.card}}>
            <button onClick={()=>setOpen(open===i?null:i)}
              className="flex items-start justify-between px-4 py-4 w-full text-left gap-3">
              <p className="text-[13px] font-semibold text-gray-900 flex-1 leading-snug">{faq.q}</p>
              {open===i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-0.5"/> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-0.5"/>}
            </button>
            {open===i && (
              <div className="px-4 pb-4 border-t border-gray-50">
                <p className="text-[12px] text-gray-600 leading-relaxed pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <SectionLabel label="Hubungi Kami"/>
      <Card className="mb-6">
        {[
          {ic:'💬', label:'Chat dengan CS', sub:'Respons dalam 5 menit'},
          {ic:'📧', label:'Email Support',  sub:'support@gv.id'},
          {ic:'📞', label:'Telepon',        sub:'0800-1234-5678 (Bebas Pulsa)'},
        ].map((c,i,arr)=>(
          <div key={c.label} className={`flex items-center gap-3 px-4 py-3.5 ${i<arr.length-1?'border-b border-gray-50':''}`}>
            <span className="text-2xl flex-shrink-0">{c.ic}</span>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">{c.label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{c.sub}</p>
            </div>
            <ChevronRight size={15} className="text-gray-300 ms-auto flex-shrink-0"/>
          </div>
        ))}
      </Card>
    </SubScreen>
  )
}

// ── Iklan Baris Screen ───────────────────────────────────────
function IklanBarisScreen({ onBack, navigate }) {
  // Default to Tab 2: Riwayat Iklan
  const [activeTab, setActiveTab] = useState('riwayat');

  return (
    <SubScreen title="Iklan Saya" onBack={onBack} navigate={navigate}>
      <div className="bg-white sticky top-0 z-10 px-2">
        <NavTabs
          variant="underline-light"
          tabs={[
            { id: 'buat', label: 'Buat Iklan' },
            { id: 'riwayat', label: 'Riwayat Iklan' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
      
      <div className="p-4 flex flex-col gap-4 min-h-[500px]">
        {activeTab === 'buat' ? (
          <AdsSubmissionForm onSuccess={() => setActiveTab('riwayat')} />
        ) : (
          <UserAdsDashboard />
        )}
      </div>
    </SubScreen>
  );
}

// ── Pesanan Saya Sub-Screen ────────────────────────────────
function PesananSayaScreen({ onBack, navigate, initialTab = 'all', userProfile }) {
  const { orders, cancelOrder, rateOrder, updateOrder } = useBuyerOrders()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [orderDetailSheet, setOrderDetail] = useState(null)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [orderToRate, setOrderToRate] = useState(null)
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null)
  const [chatOrder, setChatOrder] = useState(null)

  // Quick tab counts
  const countShipped = orders.filter((o) => o.status === 'shipped').length
  const countDone = orders.filter((o) => o.status === 'done').length
  const countCancelled = orders.filter((o) => o.status === 'cancelled').length

  // Filter calculation
  const filteredList = (() => {
    if (activeTab === 'all') return orders
    if (activeTab === 'shipped' || activeTab === 'active') return orders.filter((o) => o.status === 'shipped')
    if (activeTab === 'waiting') return orders.filter((o) => o.status === 'waiting')
    if (activeTab === 'preparing') return orders.filter((o) => ['confirmed', 'preparing'].includes(o.status))
    if (activeTab === 'done') return orders.filter((o) => o.status === 'done')
    if (activeTab === 'review') return orders.filter((o) => o.status === 'done' && !o.rating)
    if (activeTab === 'cancelled') return orders.filter((o) => o.status === 'cancelled')
    return orders
  })()

  // Active shipped order for quick live tracking
  const activeShippedOrder = orders.find((o) => o.status === 'shipped')

  // If tracking subscreen is open
  if (activeTrackingOrder) {
    return (
      <OrderTracking
        order={activeTrackingOrder}
        onBack={() => setActiveTrackingOrder(null)}
        onDone={() => {
          updateOrder(activeTrackingOrder.id, { status: 'done' })
          setActiveTrackingOrder(null)
        }}
      />
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFBF9] relative">
      {/* Modals & Sheets */}
      {orderDetailSheet && (
        <OrderDetailSheet
          order={orderDetailSheet}
          onClose={() => setOrderDetail(null)}
          onChatSeller={(o) => {
            setOrderDetail(null)
            setChatOrder(o)
          }}
          onRate={(o) => {
            setOrderToRate(o)
            setOrderDetail(null)
          }}
          onBuyAgain={() => {
            setOrderDetail(null)
            navigate?.('pasar')
          }}
          onTrack={(o) => {
            setActiveTrackingOrder(o)
            setOrderDetail(null)
          }}
          onCancelPrompt={(o) => {
            setOrderDetail(null)
            setOrderToCancel(o)
          }}
        />
      )}

      {orderToCancel && (
        <CancelOrderModal
          order={orderToCancel}
          onClose={() => setOrderToCancel(null)}
          onConfirm={(orderId, reason) => {
            cancelOrder(orderId, reason)
            setOrderToCancel(null)
            if (orderDetailSheet && orderDetailSheet.id === orderId) {
              setOrderDetail(null)
            }
          }}
        />
      )}

      {orderToRate && (
        <RatingSheet
          order={orderToRate}
          onClose={() => setOrderToRate(null)}
          onSubmit={(orderId, rating, comment) => {
            rateOrder(orderId, rating, comment)
            setOrderToRate(null)
          }}
        />
      )}

      {/* Screen Header */}
      <ScreenHeader
        title="Pesanan Saya"
        onBack={onBack}
        actions={
          <button
            type="button"
            onClick={() => navigate?.('pasar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95 text-white/90 hover:text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <ShoppingBag size={14} />
            <span className="text-[11.5px] font-bold">Belanja</span>
          </button>
        }
      />

      {/* Filter tabs using NavTabs */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0 px-2 shadow-2xs">
        <NavTabs
          variant="underline-light"
          tabs={[
            { id: 'all', label: 'Semua' },
            { id: 'shipped', label: 'Dikirim', count: countShipped },
            { id: 'done', label: 'Selesai', count: countDone },
            { id: 'cancelled', label: 'Dibatalkan', count: countCancelled },
          ]}
          activeTab={
            activeTab === 'review'
              ? 'done'
              : ['waiting', 'preparing'].includes(activeTab)
              ? 'all'
              : activeTab === 'active'
              ? 'shipped'
              : activeTab
          }
          onChange={setActiveTab}
        />
      </div>

      {/* Active shipping pulse banner in PesananSayaScreen */}
      {activeTab === 'all' && countShipped > 0 && activeShippedOrder && (
        <div
          onClick={() => setActiveTrackingOrder(activeShippedOrder)}
          className="mx-3.5 mt-2.5 p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition shadow-2xs active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-[11.5px] font-bold text-emerald-900">
              {countShipped} paket sedang diantar ke rumahmu
            </span>
          </div>
          <span className="text-[11px] font-extrabold text-[#1B6B3A] flex items-center gap-0.5">
            Lacak <ChevronRight size={13} />
          </span>
        </div>
      )}

      {/* Specific filter pill status banner if filtered via quick status buttons */}
      {['waiting', 'preparing', 'review'].includes(activeTab) && (
        <div className="px-4 pt-2.5 pb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
            Filter status:
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10.5px]">
              {activeTab === 'waiting' && 'Menunggu Konfirmasi'}
              {activeTab === 'preparing' && 'Sedang Dikemas'}
              {activeTab === 'review' && 'Belum Diulas'}
            </span>
          </span>
          <button
            onClick={() => setActiveTab('all')}
            className="text-[11px] font-bold text-emerald-700 hover:underline"
          >
            Tampilkan Semua
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-3 flex flex-col gap-3">
        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-2xl mb-3 shadow-xs">
              🛍️
            </div>
            <p className="text-[14.5px] font-extrabold text-gray-900 mb-1">
              {activeTab === 'cancelled'
                ? 'Tidak ada pesanan dibatalkan'
                : activeTab === 'shipped'
                ? 'Tidak ada paket dalam pengiriman'
                : activeTab === 'review'
                ? 'Semua pesanan selesai telah diulas'
                : 'Belum ada pesanan'}
            </p>
            <p className="text-[12px] text-gray-400 max-w-xs leading-relaxed mb-5">
              {activeTab === 'cancelled'
                ? 'Semua transaksi belanja desa Anda berjalan dengan lancar.'
                : activeTab === 'shipped'
                ? 'Belum ada paket yang sedang dalam perjalanan menuju rumahmu.'
                : activeTab === 'review'
                ? 'Terima kasih telah memberikan ulasan berharga bagi para penjual UMKM desa!'
                : 'Yuk mulai belanja aneka produk segar desa berkualitas langsung dari petaninya!'}
            </p>
            <button
              onClick={() => navigate?.('pasar')}
              className="px-5 py-2.5 rounded-xl bg-[#1B6B3A] text-white text-[12px] font-bold shadow-sm active:scale-95 transition flex items-center gap-2"
            >
              <ShoppingBag size={14} />
              <span>Mulai Belanja di ESTO</span>
            </button>
          </div>
        ) : (
          filteredList.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={(o) => setOrderDetail(o)}
              onTrack={(o) => setActiveTrackingOrder(o)}
              onRate={(o) => setOrderToRate(o)}
              onCancelPrompt={(o) => setOrderToCancel(o)}
              onBuyAgain={() => navigate?.('pasar')}
              onChatSeller={(o) => setChatOrder(o)}
            />
          ))
        )}
      </div>

      {/* Customer to Seller Chat Drawer Sheet */}
      <BuyerSellerChatSheet
        isOpen={Boolean(chatOrder)}
        onClose={() => setChatOrder(null)}
        targetSeller={chatOrder?.seller}
        targetOrder={chatOrder}
        userProfile={userProfile}
      />

      <BottomNav active="profile" navigate={navigate} />
    </div>
  )
}

// ── Main Profile ─────────────────────────────────────────────
export default function Profile({ navigate, userData, updateUser, userProfile, showPoin: initShowPoin, initialScreen }) {
  const [screen, setScreen] = useState(initialScreen || (initShowPoin ? 'poin' : 'main'))
  const [pesananTab, setPesananTab] = useState('all')
  const [tanyaOpen, setTanyaOpen] = useState(false)
  const [localPhoto, setLocalPhoto] = useState(null)
  const [showPhotoSheet, setShowPhotoSheet] = useState(false)
  const { orders: buyerOrders } = useBuyerOrders()

  const name      = userData?.name   || 'Pengguna'
  const desa      = userData?.desa   || 'Desa tidak dipilih'
  const isSeller  = userProfile?.capabilities?.includes('Penjual')
  const isCreator = userProfile?.capabilities?.includes('Kreator')
  const points    = userProfile?.points || 1240

  const countWaiting = buyerOrders.filter((o) => o.status === 'waiting').length
  const countPreparing = buyerOrders.filter((o) => ['confirmed', 'preparing'].includes(o.status)).length
  const countShipped = buyerOrders.filter((o) => o.status === 'shipped').length
  const countReview = buyerOrders.filter((o) => o.status === 'done' && !o.rating).length

  const goBack = () => setScreen('main')

  // Sub-screens
  if (screen==='pesanan')         return <PesananSayaScreen onBack={goBack} navigate={navigate} initialTab={pesananTab} userProfile={userProfile} />
  if (screen==='daftar-alamat')   return <DaftarAlamatScreen onBack={goBack} navigate={navigate} />
  if (screen==='edit-profil')     return <EditProfilScreen userData={{...userData,photo:localPhoto}} userProfile={userProfile} onBack={goBack} onSave={d=>{updateUser?.(d);setLocalPhoto(d.photo)}} navigate={navigate}/>
  if (screen==='notifikasi')      return <NotifikasiScreen onBack={goBack} navigate={navigate}/>
  if (screen==='pengaturan')      return <PengaturanScreen onBack={goBack} onLogout={()=>navigate('welcome')} navigate={navigate}/>
  if (screen==='poin')            return <GVPoinScreen points={points} onBack={goBack} navigate={navigate}/>
  if (screen==='bantuan')         return <BantuanScreen onBack={goBack} navigate={navigate}/>
  if (screen==='gvplus')          return <GVPlusScreen onBack={goBack} navigate={navigate}/>
  if (screen==='aktivasi-penjual') return <AktivasiScreen onBack={goBack} onActivate={()=>{}} navigate={navigate}/>
  if (screen==='iklan-baris')     return <IklanBarisScreen onBack={goBack} navigate={navigate} />

  // ── Status Verifikasi & Persona Multi-State ──────────────────────────────
  const isVerified = userData?.verificationStatus === 'verified' ||
    userProfile?.verified === true ||
    userProfile?.verificationStatus === 'verified' ||
    userProfile?.capabilities?.includes('Penjual') ||
    userProfile?.capabilities?.includes('Kreator') ||
    userProfile?.capabilities?.includes('Admin Komunitas') ||
    localStorage.getItem('mockVerificationStatus') === 'verified'

  // ── Penjual ESTO State ──
  const sellerAppStatus = localStorage.getItem('mockSellerAppStatus') || 'not_applied'
  let sellerDraftStep = null
  try {
    const raw = localStorage.getItem('mockSellerDraft')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.step) sellerDraftStep = parsed.step
    }
  } catch (e) {}

  const isSellerActive = isSeller || sellerAppStatus === 'active'

  let sellerSub = 'Mulai jualan di Pasar ESTO'
  let sellerBadge = 'Mulai'
  let sellerBadgeColor = '#059669'
  let sellerBadgeBg = '#ECFDF5'
  let sellerTarget = 'aktivasi-toko'

  if (isSellerActive) {
    sellerSub = 'Kelola toko dan pesanan masuk'
    sellerBadge = 'Aktif'
    sellerBadgeColor = PRIMARY
    sellerBadgeBg = '#E8F5E9'
    sellerTarget = 'toko'
  } else if (sellerAppStatus === 'pending') {
    sellerSub = 'Pengajuan sedang ditinjau tim'
    sellerBadge = 'Ditinjau'
    sellerBadgeColor = '#D97706'
    sellerBadgeBg = '#FEF3C7'
    sellerTarget = 'aktivasi-toko'
  } else if (sellerAppStatus === 'revision') {
    sellerSub = 'Pengajuan perlu diperbaiki'
    sellerBadge = 'Perlu Perbaikan'
    sellerBadgeColor = '#D97706'
    sellerBadgeBg = '#FEF3C7'
    sellerTarget = 'aktivasi-toko'
  } else if (sellerDraftStep) {
    sellerSub = `Lanjutkan setup toko (Tahap ${sellerDraftStep}/4)`
    sellerBadge = `Draft (${sellerDraftStep}/4)`
    sellerBadgeColor = '#2563EB'
    sellerBadgeBg = '#EFF6FF'
    sellerTarget = 'aktivasi-toko'
  } else if (!isVerified) {
    sellerSub = 'Perlu verifikasi data diri e-KTP'
    sellerBadge = 'Verifikasi Dulu'
    sellerBadgeColor = '#D97706'
    sellerBadgeBg = '#FEF3C7'
    sellerTarget = 'aktivasi-toko'
  } else {
    sellerSub = 'Buka toko & mulai jualan di ESTO'
    sellerBadge = 'Mulai'
    sellerBadgeColor = '#059669'
    sellerBadgeBg = '#ECFDF5'
    sellerTarget = 'aktivasi-toko'
  }

  // ── Kreator GV State ──
  const creatorAppStatus = localStorage.getItem('mockCreatorAppStatus') || 'not_applied'
  let creatorDraftStep = null
  try {
    const raw = localStorage.getItem('mockCreatorDraft')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.step) creatorDraftStep = parsed.step
    }
  } catch (e) {}

  const isCreatorActive = isCreator || creatorAppStatus === 'active'

  let creatorSub = 'Daftar menjadi Kreator GV'
  let creatorBadge = 'Mulai'
  let creatorBadgeColor = '#7B1FA2'
  let creatorBadgeBg = '#F3E5F5'
  let creatorTarget = 'aktivasi-kreator'

  if (isCreatorActive) {
    creatorSub = 'Kelola konten, siaran, dan analitik'
    creatorBadge = 'Aktif'
    creatorBadgeColor = PRIMARY
    creatorBadgeBg = '#E8F5E9'
    creatorTarget = 'studio'
  } else if (creatorAppStatus === 'pending') {
    creatorSub = 'Pengajuan sedang ditinjau tim'
    creatorBadge = 'Ditinjau'
    creatorBadgeColor = '#D97706'
    creatorBadgeBg = '#FEF3C7'
    creatorTarget = 'aktivasi-kreator'
  } else if (creatorAppStatus === 'revision') {
    creatorSub = 'Pengajuan perlu diperbaiki'
    creatorBadge = 'Perlu Perbaikan'
    creatorBadgeColor = '#D97706'
    creatorBadgeBg = '#FEF3C7'
    creatorTarget = 'aktivasi-kreator'
  } else if (creatorDraftStep) {
    creatorSub = `Lanjutkan pendaftaran channel (Tahap ${creatorDraftStep}/4)`
    creatorBadge = `Draft (${creatorDraftStep}/4)`
    creatorBadgeColor = '#2563EB'
    creatorBadgeBg = '#EFF6FF'
    creatorTarget = 'aktivasi-kreator'
  } else if (!isVerified) {
    creatorSub = 'Perlu verifikasi data diri e-KTP'
    creatorBadge = 'Verifikasi Dulu'
    creatorBadgeColor = '#D97706'
    creatorBadgeBg = '#FEF3C7'
    creatorTarget = 'aktivasi-kreator'
  } else {
    creatorSub = 'Daftar jadi Kreator & monetisasi'
    creatorBadge = 'Mulai'
    creatorBadgeColor = '#7B1FA2'
    creatorBadgeBg = '#F3E5F5'
    creatorTarget = 'aktivasi-kreator'
  }

  // ── Main screen ──
  const userKomunitas = userData?.komunitas || userProfile?.komunitas || ''
  const komunitasKey = userKomunitas.toLowerCase().replace(/\s+/g, '_')
  const communityTheme = COMMUNITY_THEMES[komunitasKey] || COMMUNITY_THEMES[userKomunitas.toLowerCase()] || null
  const heroGradient = communityTheme?.gradient || ['#1B5E20', '#2E7D32']
  const isGVPlus = userProfile?.isGVPlus || userProfile?.capabilities?.includes('GV+') || localStorage.getItem('isGVPlus') === 'true'

  const MENU_SECTIONS = [
    {
      section: 'BISNIS DESA',
      items: [
        { 
          label: 'Toko Saya',  
          sub: sellerSub,
          to: sellerTarget,      
          nav: true, 
          onClick: () => navigate(sellerTarget),
          badge: sellerBadge,
          badgeColor: sellerBadgeColor,
          badgeBg: sellerBadgeBg,
          Icon: Store,
          g: ['#E65100', '#F57C00'],
        },
        { 
          label: 'Kreator GV',  
          sub: creatorSub,
          to: creatorTarget,      
          nav: true, 
          onClick: () => navigate(creatorTarget),
          badge: creatorBadge,
          badgeColor: creatorBadgeColor,
          badgeBg: creatorBadgeBg,
          Icon: Clapperboard,
          g: ['#4A148C', '#7B1FA2'],
        },
        { 
          label: 'Iklan Saya',      
          sub: 'Pasang iklan produk & jasa warga',           
          to: 'iklan-baris', 
          nav: false,
          Icon: Megaphone,
          g: ['#0D47A1', '#1976D2'],
        },
      ]
    },
    {
      section: 'PENGATURAN',
      items: [
        { label: 'Daftar Alamat', sub: 'Atur alamat pengiriman belanja pasar', to: 'daftar-alamat', Icon: MapPin, g: ['#1B6B3A', '#2E7D32'] },
        { label: 'Edit Profil', sub: 'Ubah foto profil, nama, dan info desa', to: 'edit-profil', Icon: Edit3, g: ['#00695C', '#00897B'] },
        { label: 'Notifikasi', sub: 'Atur jenis notifikasi & pemberitahuan', to: 'notifikasi', Icon: Bell, g: ['#C62828', '#E53935'] },
        { label: 'Pengaturan & Keamanan', sub: 'Bahasa, privasi, PIN GV Pay & keamanan', to: 'pengaturan', Icon: Settings, g: ['#37474F', '#546E7A'] },
      ]
    },
    {
      section: 'BANTUAN',
      items: [
        { label: 'Pusat Bantuan & FAQ', sub: 'Panduan penggunaan & kendala aplikasi', to: 'bantuan', Icon: HelpCircle, g: ['#1565C0', '#1E88E5'] },
      ]
    },
  ]

  return (
    <ScreenBackground variant="clean" className="h-full flex flex-col relative bg-[#FAFBF9]">
      <TanyaGV
        currentScreen="profile"
        navigate={navigate}
        openFromParent={tanyaOpen}
        onCloseParent={() => setTanyaOpen(false)}
      />

      {/* ── Standard Screen Header matching other screens ── */}
      <ScreenHeader title="Profil Saya" />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* ── Profile Card Layout Horizontal ── */}
        <div
          className="mx-4 mt-3 px-4 py-3.5 flex items-center gap-3 relative"
          style={{
            background: 'linear-gradient(145deg, #1B5E20 0%, #2E7D32 100%)',
            boxShadow: '0 6px 20px #1B5E2035, inset 0 1px 0 rgba(255,255,255,0.2)',
            borderRadius: '16px',
          }}
        >
          {/* a) Avatar — kiri, kecil */}
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {localPhoto ? (
                <img src={localPhoto} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-extrabold text-white text-[18px]">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* b) Info user — tengah, flex-1 */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-white text-[14px] truncate">
              {name}
            </h2>

            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-white/60 flex-shrink-0" />
              <span className="text-[11px] text-white/65 truncate">{desa}</span>
            </div>

            <div className="flex items-center flex-wrap gap-1.5 mt-2">
              {/* Badge Role */}
              <span className="bg-white/15 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                {userProfile?.label || (isSeller ? 'Penjual' : isCreator ? 'Kreator' : 'Warga Baru')}
              </span>

              {/* Badge Terverifikasi */}
              <span className="bg-white/15 rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] font-semibold text-white">
                <CheckCircle size={9} className={isVerified ? "text-green-300" : "text-amber-300"} />
                <span>{isVerified ? "Terverifikasi" : "Belum Verifikasi"}</span>
              </span>

              {userKomunitas && (
                <span className="bg-white/15 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white">
                  {communityTheme?.label || userKomunitas}
                </span>
              )}
            </div>
          </div>

          {/* c) Tombol edit — kanan */}
          <button
            type="button"
            onClick={() => setScreen('edit-profil')}
            className="p-1.5 rounded-lg flex-shrink-0 cursor-pointer active:scale-95 transition"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            aria-label="Edit profil"
          >
            <Pencil size={13} className="text-white/75" />
          </button>
        </div>

        {/* ── PERUBAHAN 2: Gabungan GV Pay & GV Poin ── */}
        <GlassCard
          variant="elevated"
          className="mx-4 mt-3 px-0 py-0 overflow-hidden"
        >
          <div className="flex items-stretch">
            {/* Kiri — GV Pay */}
            <button
              type="button"
              onClick={() => (navigate ? navigate('bayar-topup') : null)}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 active:bg-surface-50 transition-colors cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(145deg,#1B5E20,#2E7D32)',
                  boxShadow: '0 2px 8px #1B5E2030',
                }}
              >
                <Wallet size={16} strokeWidth={2.3} className="text-white" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] text-surface-500 font-medium">GV Pay</p>
                <p className="font-extrabold text-surface-900 text-[15px] truncate">
                  Rp {(userProfile?.balance ?? 125000).toLocaleString('id')}
                </p>
              </div>
            </button>

            {/* Divider vertikal */}
            <div className="w-px bg-surface-100 my-3" />

            {/* Kanan — GV Poin */}
            <button
              type="button"
              onClick={() => setScreen('poin')}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 active:bg-surface-50 transition-colors cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(145deg,#E65100,#F57C00)',
                  boxShadow: '0 2px 8px #E6510030',
                }}
              >
                <Star size={16} strokeWidth={2.3} className="text-white" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] text-surface-500 font-medium">GV Poin</p>
                <p className="font-extrabold text-surface-900 text-[15px] truncate">
                  {points.toLocaleString('id')}
                </p>
              </div>
            </button>
          </div>
        </GlassCard>

        {/* ── Card Pesanan Saya ── */}
        <div className="mx-4 mt-3">
          <div
            className="rounded-2xl p-4 bg-white border border-surface-100 shadow-sm transition-shadow hover:shadow-brand-sm"
          >
            {/* Header: Pesanan Saya + Riwayat Pesanan > */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-100">
              <div className="flex items-center gap-2.5">
                <SkeuoIcon icon={Package} gradient={['#1B6B3A', '#2E7D32']} size="sm" />
                <span className="text-[13.5px] font-extrabold text-surface-900 tracking-tight">
                  Pesanan Saya
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPesananTab('all')
                  setScreen('pesanan')
                }}
                className="flex items-center gap-1 text-[11.5px] font-bold text-[#1B6B3A] hover:text-emerald-800 transition active:scale-95"
              >
                <span>Riwayat Pesanan</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* 4 Quick Status Filter Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-3">
              {/* 1. Menunggu */}
              <button
                type="button"
                onClick={() => {
                  setPesananTab('waiting')
                  setScreen('pesanan')
                }}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-surface-50 transition active:scale-95 relative group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100/80 transition-transform group-hover:scale-105 shadow-2xs">
                    <Clock size={19} strokeWidth={2.2} />
                  </div>
                  {countWaiting > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-600 text-white text-[9.5px] font-black flex items-center justify-center shadow-xs border border-white">
                      {countWaiting}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-surface-700 text-center leading-tight">
                  Menunggu
                </span>
              </button>

              {/* 2. Dikemas */}
              <button
                type="button"
                onClick={() => {
                  setPesananTab('preparing')
                  setScreen('pesanan')
                }}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-surface-50 transition active:scale-95 relative group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/80 transition-transform group-hover:scale-105 shadow-2xs">
                    <Package size={19} strokeWidth={2.2} />
                  </div>
                  {countPreparing > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white text-[9.5px] font-black flex items-center justify-center shadow-xs border border-white">
                      {countPreparing}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-surface-700 text-center leading-tight">
                  Dikemas
                </span>
              </button>

              {/* 3. Dikirim */}
              <button
                type="button"
                onClick={() => {
                  setPesananTab('shipped')
                  setScreen('pesanan')
                }}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-surface-50 transition active:scale-95 relative group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80 transition-transform group-hover:scale-105 shadow-2xs">
                    <Truck size={19} strokeWidth={2.2} />
                  </div>
                  {countShipped > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-emerald-600 text-white text-[9.5px] font-black flex items-center justify-center shadow-xs border border-white animate-pulse">
                      {countShipped}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-surface-700 text-center leading-tight">
                  Dikirim
                </span>
              </button>

              {/* 4. Beri Ulasan */}
              <button
                type="button"
                onClick={() => {
                  setPesananTab('review')
                  setScreen('pesanan')
                }}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-surface-50 transition active:scale-95 relative group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100/80 transition-transform group-hover:scale-105 shadow-2xs">
                    <Star size={19} strokeWidth={2.2} />
                  </div>
                  {countReview > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-500 text-white text-[9.5px] font-black flex items-center justify-center shadow-xs border border-white">
                      {countReview}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-surface-700 text-center leading-tight">
                  Beri Ulasan
                </span>
              </button>
            </div>

            {/* Active shipping pulse strip if any order is currently shipped */}
            {countShipped > 0 && (
              <div
                onClick={() => {
                  setPesananTab('shipped')
                  setScreen('pesanan')
                }}
                className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span className="text-[11px] font-bold text-emerald-900">
                    {countShipped} paket sedang diantar ke rumahmu
                  </span>
                </div>
                <span className="text-[11px] font-extrabold text-[#1B6B3A] flex items-center gap-0.5">
                  Lacak <ChevronRight size={13} />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Banner GV+ Premium ── */}
        <div
          onClick={() => setScreen('gvplus')}
          className="mx-4 mt-3 p-4 rounded-2xl cursor-pointer transition active:scale-[0.99] flex items-center gap-3.5 shadow-md relative overflow-hidden border border-emerald-700/40"
          style={{
            background: 'linear-gradient(135deg, #092E16 0%, #0E4822 50%, #1B6B3A 100%)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm shadow-xs"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 127, 23, 0.25), rgba(249, 168, 37, 0.15))',
              border: '1px solid rgba(249, 168, 37, 0.45)',
            }}
          >
            <Crown size={20} className="text-[#F9A825] fill-[#F9A825] drop-shadow-xs" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-white text-[14px] leading-snug">GV+ Premium</p>
            <p className="text-emerald-100/75 text-[11.5px] mt-0.5 truncate">
              {isGVPlus ? 'Aktif hingga 31 Des 2026' : 'Siaran & video eksklusif tanpa iklan'}
            </p>
          </div>
        </div>

        {/* ── PERUBAHAN 5 & 6: Restrukturisasi Section Menu ── */}
        <div className="space-y-4 px-4 mt-4">
          {MENU_SECTIONS.map(({ section, items }) => (
            <div key={section}>
              <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-surface-400 px-1 mb-2">
                {section}
              </p>
              <div
                className="rounded-2xl overflow-hidden bg-white border border-surface-100 shadow-sm divide-y divide-surface-100"
              >
                {items.map(({ label, sub, to, nav, badge, badgeColor, badgeBg, Icon, g, onClick: itemOnClick }) => (
                  <button
                    key={label}
                    type="button"
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition duration-150 hover:bg-surface-50 active:scale-[0.99]"
                    onClick={() => {
                      if (itemOnClick) itemOnClick()
                      else if (to === 'logout') navigate('welcome')
                      else if (to === 'tanya-gv') setTanyaOpen(true)
                      else if (nav) navigate(to)
                      else setScreen(to)
                    }}
                  >
                    {Icon && (
                      <SkeuoIcon icon={Icon} gradient={g || ['#37474F', '#546E7A']} size="sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-surface-900 leading-snug">{label}</p>
                        {badge && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: badgeBg, color: badgeColor }}
                          >
                            {badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-surface-400 mt-0.5 line-clamp-1">{sub}</p>
                    </div>
                    <ChevronRight size={15} className="text-surface-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Tombol Keluar dari Akun */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('welcome')}
              className="w-full py-3 rounded-2xl text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100/70 border border-red-100 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <LogOut size={15} />
              <span>Keluar dari Akun</span>
            </button>
          </div>

          <p className="text-center text-[11px] text-surface-400 pt-2 pb-6">
            G-Village v0.1.0 · Ekosistem Desa Digital
          </p>
        </div>
      </div>

      <BottomNav active="profile" navigate={navigate} />

      {/* Bottom Sheet Pilihan Foto */}
      <PhotoSheet
        isOpen={showPhotoSheet}
        onClose={() => setShowPhotoSheet(false)}
        onRemovePhoto={() => setLocalPhoto(null)}
      />
    </ScreenBackground>
  )
}

