import React, { useState, useRef, useEffect } from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import { ChevronRight, Award, HelpCircle, LogOut, Shield, Bell,
  Store, Tv2, MapPin, Crown, CheckCircle, X, ChevronDown,
  ChevronUp, Globe, Trash2, Camera, Star, Gift, Zap, Package,
  ToggleLeft, ToggleRight, ArrowLeft, Check, Plus, Edit3,
  Lock, Eye, EyeOff, CreditCard, TrendingUp, TrendingDown, Settings, Copy, Clock, Info, Megaphone,
  Sparkles, Clapperboard } from 'lucide-react'
import ScreenHeader from '@/components/molecules/ScreenHeader'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'
import NavTabs from '@/components/molecules/NavTabs'
import BottomNav from '../../components/BottomNav'
import TanyaGV from '../../components/TanyaGV'
import AdsSubmissionForm from '../../components/ads/AdsSubmissionForm'
import UserAdsDashboard from '../../components/ads/UserAdsDashboard'

const PRIMARY = '#1B6B3A'
const S = { card: '0 2px 8px rgba(27,107,58,0.06), 0 1px 2px rgba(0,0,0,0.04)' }

// ── Sub-screen wrapper ──────────────────────────────────────
function SubScreen({ title, onBack, children, actions, navigate }) {
  return (
    <div className="flex flex-col h-full bg-[#FAFBF9]">
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

// ── Edit Profil ─────────────────────────────────────────────
function EditProfilScreen({ userData, onBack, onSave, navigate }) {
  const fallback = MOCK_USER_DATA
  const [form, setForm] = useState({
    photo: userData?.photo || fallback.photo,
    name: userData?.name || fallback.name,
    nik: userData?.nik || fallback.nik || '',
    gender: userData?.gender || fallback.gender || '',
    prov: userData?.prov || fallback.prov || '',
    kab: userData?.kab || fallback.kab || '',
    kec: userData?.kec || fallback.kec || '',
    desa: userData?.desa || fallback.desa || ''
  })
  const [errors, setErrors] = useState({})

  // Mock database for location dropdowns
  const LOCATIONS = {
    'Jawa Barat': {
      'Kabupaten Bogor': {
        'Dramaga': ['Cikarawang', 'Dramaga', 'Babakan', 'Petir'],
        'Cibinong': ['Cibinong', 'Ciriung', 'Pabuaran']
      },
      'Kota Bogor': {
        'Bogor Tengah': ['Babakan', 'Pabaton', 'Sempur']
      }
    },
    'Jawa Tengah': {
      'Kota Semarang': {
        'Semarang Tengah': ['Bangunharjo', 'Karangkidul', 'Sekayu']
      }
    }
  }

  const provOptions = Object.keys(LOCATIONS)
  const kabOptions = form.prov && LOCATIONS[form.prov] ? Object.keys(LOCATIONS[form.prov]) : []
  const kecOptions = form.prov && form.kab && LOCATIONS[form.prov][form.kab] ? Object.keys(LOCATIONS[form.prov][form.kab]) : []
  const desaOptions = form.prov && form.kab && form.kec && LOCATIONS[form.prov][form.kab][form.kec] ? LOCATIONS[form.prov][form.kab][form.kec] : []

  const fileRef = useRef(null)
  const handlePhoto = e => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => setForm(f=>({...f,photo:ev.target.result})); r.readAsDataURL(f)
  }

  const validateAndSave = () => {
    const err = {}
    if (!form.name) err.name = 'Wajib diisi'
    if (!form.nik || form.nik.length !== 16) err.nik = 'NIK harus 16 digit'
    if (!form.gender) err.gender = 'Wajib dipilih'
    if (!form.prov) err.prov = 'Wajib dipilih'
    if (!form.kab) err.kab = 'Wajib dipilih'
    if (!form.kec) err.kec = 'Wajib dipilih'
    if (!form.desa) err.desa = 'Wajib dipilih'
    
    setErrors(err)
    if (Object.keys(err).length === 0) {
      onSave(form)
      onBack()
    }
  }

  return (
    <SubScreen title="Edit Profil (Data KTP)" onBack={onBack} navigate={navigate}
      actions={
        <button onClick={validateAndSave}
          className="px-4 py-2 rounded-xl text-[12px] font-bold shadow-sm transition active:scale-[0.96]"
          style={{background:'#FFFFFF', color:PRIMARY}}>Simpan</button>
      }>
      <div className="px-4 py-5 flex flex-col">
        {/* Photo */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border-[1.5px] border-gray-200 bg-white">
            {form.photo ? <img src={form.photo} alt="" className="w-full h-full object-cover"/>
              : <span className="text-3xl font-bold" style={{color:PRIMARY}}>{(form.name||'U')[0].toUpperCase()}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={()=>fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white shadow-sm"
              style={{background:PRIMARY}}>
              <Camera size={13}/> {form.photo?'Ganti Foto':'Upload Foto'}
            </button>
            {form.photo && <button onClick={()=>setForm(f=>({...f,photo:null}))} className="text-[11px] text-red-500 font-semibold text-left ml-1 px-2 py-1">Hapus foto</button>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
        </div>

        <p className="text-[13px] font-extrabold text-gray-900 mt-2 mb-3">Informasi Identitas Pribadi</p>
        <FormInput label="Nama Lengkap (Sesuai KTP)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Masukkan nama lengkap" err={errors.name}/>
        <FormInput label="NIK" type="text" inputMode="numeric" maxLength={16} value={form.nik} 
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
            setForm({...form, nik: val})
          }} placeholder="16 digit NIK" err={errors.nik}/>
        <FormSelect label="Jenis Kelamin" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} options={['Laki-laki', 'Perempuan']} err={errors.gender}/>
        
        <div className="h-px bg-gray-100 my-4" />
        <p className="text-[13px] font-extrabold text-gray-900 mt-2 mb-3">Alamat KTP</p>
        
        <FormSelect label="Provinsi" value={form.prov} onChange={e=>{
            setForm({...form, prov:e.target.value, kab:'', kec:'', desa:''})
          }} options={provOptions} err={errors.prov}/>
          
        <FormSelect label="Kabupaten / Kota" value={form.kab} onChange={e=>{
            setForm({...form, kab:e.target.value, kec:'', desa:''})
          }} options={kabOptions} err={errors.kab} disabled={!form.prov}/>
          
        <FormSelect label="Kecamatan" value={form.kec} onChange={e=>{
            setForm({...form, kec:e.target.value, desa:''})
          }} options={kecOptions} err={errors.kec} disabled={!form.kab}/>
          
        <FormSelect label="Desa / Kelurahan" value={form.desa} onChange={e=>{
            setForm({...form, desa:e.target.value})
          }} options={desaOptions} err={errors.desa} disabled={!form.kec}/>

      </div>
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
              
              {/* Mock Map */}
              <div className="w-full h-32 rounded-2xl bg-gray-100 relative overflow-hidden flex items-center justify-center border border-gray-200">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'}}/>
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shadow-md relative z-10"><MapPin size={16} className="text-red-500"/></div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-white rounded-lg shadow-sm text-[10px] font-bold text-gray-600">Ketuk untuk ubah</div>
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
    <SubScreen title="Iklan Baris" onBack={onBack} navigate={navigate}>
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

// ── Main Profile ─────────────────────────────────────────────
export default function Profile({ navigate, userData, updateUser, userProfile, showPoin: initShowPoin, initialScreen }) {
  const [screen, setScreen] = useState(initialScreen || (initShowPoin ? 'poin' : 'main'))
  const [tanyaOpen, setTanyaOpen] = useState(false)
  const [localPhoto, setLocalPhoto] = useState(null)

  const name      = userData?.name   || 'Pengguna'
  const desa      = userData?.desa   || 'Desa tidak dipilih'
  const isSeller  = userProfile?.capabilities?.includes('Penjual')
  const isCreator = userProfile?.capabilities?.includes('Kreator')
  const points    = userProfile?.points || 1240

  const goBack = () => setScreen('main')

  // Sub-screens
  if (screen==='edit-profil')     return <EditProfilScreen userData={{...userData,photo:localPhoto}} onBack={goBack} onSave={d=>{updateUser?.(d);setLocalPhoto(d.photo)}} navigate={navigate}/>
  if (screen==='notifikasi')      return <NotifikasiScreen onBack={goBack} navigate={navigate}/>
  if (screen==='pengaturan')      return <PengaturanScreen onBack={goBack} onLogout={()=>navigate('welcome')} navigate={navigate}/>
  if (screen==='poin')            return <GVPoinScreen points={points} onBack={goBack} navigate={navigate}/>
  if (screen==='bantuan')         return <BantuanScreen onBack={goBack} navigate={navigate}/>
  if (screen==='gvplus')          return <GVPlusScreen onBack={goBack} navigate={navigate}/>
  if (screen==='aktivasi-penjual') return <AktivasiScreen onBack={goBack} onActivate={()=>{}} navigate={navigate}/>
  if (screen==='iklan-baris')     return <IklanBarisScreen onBack={goBack} navigate={navigate} />

  // Determine Kreator GV display based on mock application state
  const appStatus = localStorage.getItem('mockCreatorAppStatus') || 'not_applied'
  let creatorSub = 'Daftar menjadi Kreator'
  let creatorBadge = 'Nonaktif'
  let creatorBadgeColor = '#E65100'
  let creatorBadgeBg = '#FFF3E0'
  
  if (isCreator) {
    creatorSub = 'Kelola konten dan analitik'
    creatorBadge = 'Aktif'
    creatorBadgeColor = PRIMARY
    creatorBadgeBg = '#E8F5E9'
  } else if (appStatus === 'pending') {
    creatorSub = 'Pengajuan sedang ditinjau'
    creatorBadge = 'Ditinjau'
    creatorBadgeColor = '#E65100'
    creatorBadgeBg = '#FFF3E0'
  } else if (appStatus === 'revision') {
    creatorSub = 'Pengajuan perlu diperbaiki'
    creatorBadge = 'Perlu Perbaikan'
    creatorBadgeColor = '#E65100'
    creatorBadgeBg = '#FFF3E0'
  }

  // Determine Toko Saya display based on mock application state
  const sellerAppStatus = localStorage.getItem('mockSellerAppStatus') || 'not_applied'
  let sellerSub = 'Mulai jualan di Pasar ESTO'
  let sellerBadge = 'Nonaktif'
  let sellerBadgeColor = '#E65100'
  let sellerBadgeBg = '#FFF3E0'
  
  if (isSeller) {
    sellerSub = 'Kelola toko dan produk'
    sellerBadge = 'Aktif'
    sellerBadgeColor = PRIMARY
    sellerBadgeBg = '#E8F5E9'
  } else if (sellerAppStatus === 'pending') {
    sellerSub = 'Pengajuan sedang ditinjau'
    sellerBadge = 'Ditinjau'
    sellerBadgeColor = '#E65100'
    sellerBadgeBg = '#FFF3E0'
  } else if (sellerAppStatus === 'revision') {
    sellerSub = 'Pengajuan perlu diperbaiki'
    sellerBadge = 'Perlu Perbaikan'
    sellerBadgeColor = '#E65100'
    sellerBadgeBg = '#FFF3E0'
  }

  // ── Main screen ──
  const MENU_SECTIONS = [
    {
      section: 'Fitur & Bisnis Desa',
      items: [
        { 
          label: 'Toko Saya',  
          sub: sellerSub,
          to: isSeller ? 'toko' : 'aktivasi-penjual',      
          nav: isSeller, 
          badge: sellerBadge,
          badgeColor: sellerBadgeColor,
          badgeBg: sellerBadgeBg,
          Icon: Store,
          g: ['#E65100', '#F57C00'],
        },
        { 
          label: 'Kreator GV',  
          sub: creatorSub,
          to: 'studio',      
          nav: true, 
          badge: creatorBadge,
          badgeColor: creatorBadgeColor,
          badgeBg: creatorBadgeBg,
          Icon: Clapperboard,
          g: ['#4A148C', '#7B1FA2'],
        },
        { 
          label: 'Iklan Baris',      
          sub: 'Pasang iklan produk & jasa warga',           
          to: 'iklan-baris', 
          nav: false,
          Icon: Megaphone,
          g: ['#0D47A1', '#1976D2'],
        },
        { 
          label: 'GV+ Premium',              
          sub: 'Siaran & video eksklusif tanpa iklan',            
          to: 'gvplus',
          badge: 'GV+',
          badgeColor: '#fff',
          badgeBg: 'linear-gradient(90deg, #F57F17, #F9A825)',
          Icon: Crown,
          g: ['#F57F17', '#FBC02D'],
        },
      ]
    },
    {
      section: 'Akun & Preferensi',
      items: [
        { label: 'Edit Profil', sub: 'Ubah foto profil, nama, dan info desa', to: 'edit-profil', Icon: Edit3, g: ['#00695C', '#00897B'] },
        { label: 'Notifikasi', sub: 'Atur jenis notifikasi & pemberitahuan', to: 'notifikasi', Icon: Bell, g: ['#C62828', '#E53935'] },
        { label: 'Pengaturan & Keamanan', sub: 'Bahasa, privasi, PIN GV Pay & keamanan', to: 'pengaturan', Icon: Settings, g: ['#37474F', '#546E7A'] },
      ]
    },
    {
      section: 'Bantuan & Informasi',
      items: [
        { label: 'Tanya GV (AI Desa)', sub: 'Bantuan instan dari asisten cerdas', to: 'tanya-gv', Icon: Sparkles, g: ['#1B5E20', '#2E7D32'] },
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
      <ScreenHeader
        title="Profil Saya"
        actions={
          <>
            <button
              type="button"
              onClick={() => setTanyaOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Sparkles size={13} className="text-amber-300" />
              <span className="text-[11.5px] font-bold text-white">Tanya GV</span>
            </button>

            <button
              type="button"
              onClick={() => setScreen('pengaturan')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Settings size={16} className="text-white/80" />
            </button>
          </>
        }
      >
        {/* User Profile Card inside header */}
        <div className="flex items-center gap-3.5 pt-0.5 pb-1">
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {localPhoto ? (
                <img src={localPhoto} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black text-white">{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setScreen('edit-profil')}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition active:scale-90 shadow-sm"
              style={{
                background: '#16a34a',
                border: '1.5px solid #0C3E1E',
              }}
            >
              <Camera size={10} className="text-white" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[16px] font-extrabold text-white truncate tracking-tight">
                {name}
              </h2>
              <button
                type="button"
                onClick={() => setScreen('edit-profil')}
                className="text-white/60 hover:text-white transition p-0.5"
              >
                <Edit3 size={13} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5 text-emerald-200/80 text-[11px]">
              <MapPin size={11} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate">{desa}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {userProfile?.label || (isSeller ? 'Penjual' : isCreator ? 'Kreator' : 'Warga GV')}
              </span>
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                <CheckCircle size={9.5} /> Terverifikasi
              </span>
            </div>
          </div>
        </div>
      </ScreenHeader>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-3.5">
        {/* ── GV Poin Card (Harmonious with canvas) ── */}
        <div className="px-4 mb-3.5">
          <div
            className="rounded-2xl p-4 bg-white border border-surface-200/80 flex items-center justify-between transition-shadow hover:shadow-brand-sm"
            style={{
              boxShadow: '0 2px 10px rgba(27, 107, 58, 0.05)',
            }}
          >
            <div className="flex items-center gap-3">
              <SkeuoIcon icon={Award} gradient={['#F57F17', '#FBC02D']} size="md" />
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-surface-400">
                  Saldo GV Poin
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <p className="text-[19px] font-extrabold text-surface-900 tabular-nums leading-none">
                    {points.toLocaleString('id')}
                  </p>
                  <span className="text-[11px] font-medium text-surface-500">
                    ≈ Rp {(points * 10).toLocaleString('id')}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScreen('poin')}
              className="px-4 py-2 rounded-xl text-[12px] font-bold text-white transition active:scale-95 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
              }}
            >
              Tukar Poin
            </button>
          </div>
        </div>

        {/* ── Categorized Menu Sections ── */}
        <div className="space-y-4 px-4 pb-24">
          {MENU_SECTIONS.map(({ section, items }) => (
            <div key={section}>
              <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-surface-400 px-1 mb-2">
                {section}
              </p>
              <div
                className="rounded-2xl overflow-hidden bg-white border border-surface-200/80 divide-y divide-surface-100"
                style={{
                  boxShadow: '0 2px 12px rgba(27, 107, 58, 0.04)',
                }}
              >
                {items.map(({ label, sub, to, nav, badge, badgeColor, badgeBg, Icon, g }) => (
                  <button
                    key={label}
                    type="button"
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition duration-150 hover:bg-surface-50 active:scale-[0.99]"
                    onClick={() => {
                      if (to === 'logout') navigate('welcome')
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

          {/* Logout Section */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('welcome')}
              className="w-full py-3.5 rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition active:scale-95"
              style={{
                background: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FEE2E2',
              }}
            >
              <LogOut size={16} />
              <span>Keluar dari Akun</span>
            </button>
          </div>

          <p className="text-center text-[11px] text-surface-400 pt-2 pb-2">
            G-Village v0.1.0 · Ekosistem Desa Digital
          </p>
        </div>
      </div>

      <BottomNav active="profile" navigate={navigate} />
    </ScreenBackground>
  )
}

