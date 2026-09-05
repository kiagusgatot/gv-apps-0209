import React, { useState } from 'react'
import Welcome     from './screens/onboarding/Welcome'
import Register    from './screens/onboarding/Register'
import OTP         from './screens/onboarding/OTP'
import SelectDesa  from './screens/onboarding/SelectDesa'
import Preferensi  from './screens/onboarding/Preferensi'
import Selesai     from './screens/onboarding/Selesai'
import Beranda     from './screens/app/Beranda'
import Siaran      from './screens/app/Siaran'
import Pasar       from './screens/app/Pasar'
import Toko        from './screens/app/Toko'
import Bayar       from './screens/app/Bayar'
import Komunitas   from './screens/app/Komunitas'
import Berita      from './screens/app/Berita'
import Studio      from './screens/app/Studio'
import Profile     from './screens/app/Profile'
import { RotateCcw, Monitor, ChevronRight, Users, Zap } from 'lucide-react'
import { AdsProvider } from './components/ads/AdsContext'

const SCREEN_LABELS = {
  welcome:'Welcome', register:'Daftar', otp:'Verifikasi OTP',
  desa:'Pilih Desa', preferensi:'Preferensi', selesai:'Selesai',
  beranda:'Beranda', siaran:'GV Media', 'siaran-live':'GV Media', 'siaran-kreator':'GV Media', 'siaran-video':'GV Media', 'siaran-podcast':'GV Media', 'siaran-gvplus':'GV Media', pasar:'ESTO', 'pasar-pesanan':'Pesanan Saya', 'pasar-toko':'ESTO', bayar:'Bayar', 'bayar-topup':'Bayar', 'bayar-transfer':'Bayar', 'bayar-qris':'Bayar', 'bayar-riwayat':'Bayar', 'bayar-listrik':'Bayar', 'bayar-pulsa':'Bayar', 'bayar-air':'Bayar', 'bayar-bpjs':'Bayar', 'bayar-tv':'Bayar', 'bayar-internet':'Bayar', 'bayar-gas':'Bayar', 'bayar-pendidikan':'Bayar', komunitas:'Komunitas & Arena', berita:'Berita', studio:'Kreator GV', 'studio-upload':'Kreator GV', 'studio-analitik':'Kreator GV', 'studio-membership':'GV Media', profile:'Profil Saya', 'profile-poin':'Profil Saya', 'profile-pesanan':'Pesanan Saya', 'profile-iklan':'Iklan Baris', 'komunitas-jualbeli':'Komunitas',
}

const NAV_SECTIONS = [
  { label: 'Onboarding', screens: ['welcome','register','otp','desa','preferensi','selesai'] },
  { label: 'Aplikasi', screens: ['beranda','siaran','pasar','bayar','komunitas','studio','profile'] },
]
const NAV_SCREENS = ['welcome','register','otp','desa','preferensi','selesai','beranda','siaran','pasar','toko','bayar','komunitas','studio','profile']

const DUMMY_USERS = [
  {
    id:'warga_baru', label:'Warga Baru', color:'#607D8B',
    desc:'Hari ke-1 · belum ada transaksi',
    name:'Sari Dewi', desa:'Desa Sukamaju', preferences:['Info Desa','Bayar Tagihan'],
    capabilities:['Member'], balance:0, points:0,
    hasWatchHistory:false, urgentOrders:0, hasActiveOrder:false,
    pendingContent:0, draftsPending:0,
    tokoStats:null, studioStats:null, adminStats:null,
    hasActiveBills:false, hasTransactions:false, hasBrowsedPasar:false,
    hasJoinedCommunity:false,
    followedCreators:[], memberships:[],
  },
  {
    id:'warga_aktif', label:'Warga Aktif', color:'#1565C0',
    desc:'Hari ke-14 · ada pesanan aktif',
    name:'Budi Santoso', desa:'Desa Cikaret', preferences:['Belanja','Bayar Tagihan','Komunitas'],
    capabilities:['Member'], balance:125000, points:450,
    hasWatchHistory:true, urgentOrders:0, hasActiveOrder:true,
    pendingContent:0, draftsPending:0,
    tokoStats:null, studioStats:null, adminStats:null,
    hasActiveBills:true, hasTransactions:true, hasBrowsedPasar:true,
    hasJoinedCommunity:true,
    followedCreators:['k1'], memberships:[],
  },
  {
    id:'penjual', label:'Penjual Aktif', color:'#1B6B3A',
    desc:'Hari ke-30 · 3 pesanan pending',
    name:'Sari Dewi', desa:'Desa Sukamaju', preferences:['Jual Produk','Komunitas'],
    capabilities:['Penjual'], balance:248500, points:1240,
    hasWatchHistory:true, urgentOrders:3, hasActiveOrder:false,
    pendingContent:0, draftsPending:0,
    tokoStats:{ orders:3, revenue:890000, products:12 },
    studioStats:null, adminStats:null,
    hasActiveBills:true, hasTransactions:true, hasBrowsedPasar:true,
    hasJoinedCommunity:true,
    followedCreators:['k2'], memberships:[{id:'k2',name:'UMKM Kreatif Desa',avatar:'🏪',color:'#E65100',price:15000,since:'Juli 2026'}],
  },
  {
    id:'kreator', label:'Kreator Konten', color:'#BF360C',
    desc:'Hari ke-21 · 1 video pending review',
    name:'Rizky Fauzan', desa:'Desa Nagrak', preferences:['Media','Komunitas'],
    capabilities:['Kreator'], balance:180000, points:2100,
    hasWatchHistory:true, urgentOrders:0, hasActiveOrder:false,
    pendingContent:1, draftsPending:0,
    tokoStats:null,
    studioStats:{ views:4200, points:320, content:3, pendingContent:1 },
    adminStats:null,
    hasActiveBills:false, hasTransactions:true, hasBrowsedPasar:false,
    hasJoinedCommunity:true,
    followedCreators:['k1','k3'], memberships:[{id:'k1',name:'Pak Tani Bogor',avatar:'🌾',color:'#2E7D32',price:10000,since:'Juni 2026'}],
  },
  {
    id:'admin_komunitas', label:'Admin Komunitas', color:'#6A1B9A',
    desc:'Mengelola 2 komunitas · 18rb+ anggota',
    name:'Wawan Setiawan', desa:'Desa Sukamakmur', preferences:['Komunitas','Media'],
    capabilities:['Admin Komunitas'], balance:95000, points:3400,
    hasWatchHistory:true, urgentOrders:0, hasActiveOrder:false,
    pendingContent:0, draftsPending:0,
    tokoStats:null, studioStats:null,
    adminStats:{ communities:2, totalMembers:'18.1rb', threads:48, pendingReports:3 },
    hasActiveBills:false, hasTransactions:true, hasBrowsedPasar:false,
    hasJoinedCommunity:true,
    followedCreators:['k1'], memberships:[],
    managedCommunityIds:[1, 3],
  },
  {
    id:'super_admin', label:'Super Admin', color:'#B71C1C',
    desc:'Semua role aktif · Akses penuh',
    name:'Admin GV', desa:'Desa Nagrak', preferences:['Semua'],
    capabilities:['Penjual','Kreator','Admin Komunitas','Super Admin'],
    gvPlusActive:true,
    balance:750000, points:5800,
    hasWatchHistory:true, urgentOrders:5, hasActiveOrder:true,
    pendingContent:2, draftsPending:1,
    tokoStats:   { orders:8, revenue:1250000, products:12 },
    studioStats: { views:12500, points:980, content:7, pendingContent:2 },
    adminStats:  { communities:4, totalMembers:'31.2rb', threads:94, pendingReports:5 },
    hasActiveBills:true, hasTransactions:true, hasBrowsedPasar:true,
    hasJoinedCommunity:true,
    followedCreators:['k1','k2','k3'],
    memberships:[{id:'k1',name:'Pak Tani Bogor',avatar:'🌾',color:'#2E7D32',price:35000,since:'Mar 2026'}],
    managedCommunityIds:[1,2,3,4],
  },
]

export default function App() {
  const [screen, setScreen]         = useState('welcome')
  const [userData, setUser]         = useState({ name:'', phone:'', desa:'', preferences:[] })
  const [activePersona, setPersona] = useState(null)

  const navigate   = (to) => setScreen(to)
  const updateUser = (d)  => setUser(p => ({ ...p, ...d }))
  const reset      = ()   => { setScreen('welcome'); setUser({ name:'', phone:'', desa:'', preferences:[] }); setPersona(null) }

  const props = { navigate, userData, updateUser, userProfile: activePersona }
  const extraProps =
    screen === 'pasar-pesanan' || screen === 'profile-pesanan' ? { initialScreen: 'pesanan' }
    : screen === 'pasar-toko'    ? { initialTab: 'toko' }
    : screen === 'studio-upload' ? { initialUpload: true }
    : screen === 'studio-analitik' ? { initialTab: 'analitik' }
    : screen === 'studio-membership' ? { initialTab: 'kreator' }
    : screen === 'siaran-live'   ? { initialTab: 'live' }
    : screen === 'siaran-kreator'? { initialTab: 'kreator' }
    : screen === 'siaran-video'  ? { initialTab: 'video' }
    : screen === 'siaran-podcast'? { initialTab: 'podcast' }
    : screen === 'siaran-gvplus' ? { showGVPlus: true }
    : screen === 'bayar-topup'   ? { initialScreen: 'topup' }
    : screen === 'bayar-transfer'? { initialScreen: 'transfer' }
    : screen === 'bayar-qris'    ? { initialScreen: 'qris' }
    : screen === 'bayar-riwayat' ? { initialScreen: 'riwayat' }
    : screen === 'bayar-listrik' ? { initialScreen: 'listrik' }
    : screen === 'bayar-pulsa'   ? { initialScreen: 'pulsa' }
    : screen === 'bayar-air'     ? { initialScreen: 'air' }
    : screen === 'bayar-bpjs'    ? { initialScreen: 'bpjs' }
    : screen === 'bayar-tv'      ? { initialScreen: 'tv' }
    : screen === 'bayar-internet'? { initialScreen: 'internet' }
    : screen === 'bayar-gas'     ? { initialScreen: 'gas' }
    : screen === 'bayar-pendidikan' ? { initialScreen: 'pendidikan' }
    : screen === 'profile-poin'  ? { showPoin: true }
    : screen === 'profile-iklan' ? { initialScreen: 'iklan-baris' }
    : screen === 'komunitas-jualbeli' ? { initialCommunityId: 7 }
    : {}
  const Screen = { welcome:Welcome, register:Register, otp:OTP, desa:SelectDesa,
    preferensi:Preferensi, selesai:Selesai, beranda:Beranda, siaran:Siaran, 'siaran-live':Siaran, 'siaran-kreator':Siaran, 'siaran-video':Siaran, 'siaran-podcast':Siaran, 'siaran-gvplus':Siaran, pasar:Pasar, 'pasar-pesanan':Profile, 'pasar-toko':Pasar, toko:Toko, bayar:Bayar, 'bayar-topup':Bayar, 'bayar-transfer':Bayar, 'bayar-qris':Bayar, 'bayar-riwayat':Bayar, 'bayar-listrik':Bayar, 'bayar-pulsa':Bayar, 'bayar-air':Bayar, 'bayar-bpjs':Bayar, 'bayar-tv':Bayar, 'bayar-internet':Bayar, 'bayar-gas':Bayar, 'bayar-pendidikan':Bayar, komunitas:Komunitas, berita:Berita, studio:Studio, 'studio-upload':Studio, 'studio-analitik':Studio, 'studio-membership':Siaran, profile:Profile, 'profile-poin':Profile, 'profile-pesanan':Profile, 'profile-iklan':Profile, 'komunitas-jualbeli':Komunitas }[screen] || Welcome

  const isOnboarding = ['welcome','register','otp','desa','preferensi','selesai'].includes(screen)

  return (
    <AdsProvider>
      <div className="h-screen flex flex-col overflow-hidden grain-overlay" style={{background:'#F5F6F3'}}>
        {/* ── Header ─────────────────────────────────── */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{
          background:'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 60%, #217A44 100%)',
          boxShadow:'0 4px 24px rgba(12,62,30,0.25)',
        }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)'}}>
            <span className="text-white text-sm font-bold tracking-wide">G</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-tight leading-none">G-Village</span>
            <span className="text-[10px] text-white/50 font-medium leading-none mt-0.5">Prototype v0.3</span>
          </div>
          {activePersona && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white/90 ms-2"
              style={{background: activePersona.color, boxShadow:`0 2px 8px ${activePersona.color}40`}}>
              {activePersona.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{background:'rgba(255,255,255,0.12)'}}>
            <Monitor size={12} className="text-white/60" />
            <span className="text-[11px] font-semibold text-white/80">{SCREEN_LABELS[screen]}</span>
          </div>
          <button onClick={reset}
            className="flex items-center gap-1.5 text-[11px] font-medium text-white/60 hover:text-white px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
            style={{background:'rgba(255,255,255,0.08)'}}>
            <RotateCcw size={11}/> Reset
          </button>
        </div>
      </header>

      {/* ── Main layout ──────────────────────────── */}
      <div className="flex flex-1 overflow-hidden items-stretch justify-center gap-0 max-w-[1280px] mx-auto w-full">

        {/* ── Left nav ─────────────────────────── */}
        <nav className="hidden lg:flex flex-col w-44 flex-shrink-0 py-5 px-3 overflow-y-auto no-scrollbar"
          style={{background:'#ECEEE9'}}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label} className={si > 0 ? 'mt-5' : ''}>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2 px-3">{section.label}</p>
              <div className="flex flex-col gap-0.5">
                {section.screens.map(s => {
                  const isActive = screen === s || (screen.startsWith(s + '-'))
                  return (
                    <button key={s} onClick={() => navigate(s)}
                      className={`text-left px-3 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center justify-between group
                        ${isActive
                          ? 'text-white shadow-brand'
                          : 'text-surface-600 hover:bg-white/60 hover:text-surface-900 active:scale-[0.97]'
                        }`}
                      style={isActive ? {
                        background:'linear-gradient(135deg,#0C3E1E,#1B6B3A)',
                        boxShadow:'0 2px 12px rgba(27,107,58,0.3)',
                      } : {}}>
                      <span>{SCREEN_LABELS[s]}</span>
                      {isActive && <ChevronRight size={14} className="opacity-60" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Phone content area ─────────────── */}
        <div className="flex-shrink-0 w-[390px] flex flex-col overflow-hidden relative"
          style={{
            boxShadow:'-1px 0 0 #D4D8D0, 1px 0 0 #D4D8D0, 0 8px 32px rgba(15,26,19,0.08)',
          }}>
          <div className="flex-1 overflow-hidden flex flex-col relative" style={{background:'#fff'}}>
            {screen.startsWith('pasar')     && <Pasar {...props} {...extraProps}/>}
            {screen.startsWith('toko')      && <Toko {...props} {...extraProps}/>}
            {screen.startsWith('bayar')     && <Bayar {...props} {...extraProps}/>}
            {!screen.startsWith('pasar') && !screen.startsWith('toko') && !screen.startsWith('bayar') && <Screen key={screen} {...props} {...extraProps} />}
          </div>
        </div>

        {/* ── Right panel — Persona switcher ── */}
        <aside className="hidden xl:flex flex-col w-56 flex-shrink-0 py-5 px-4 overflow-y-auto no-scrollbar"
          style={{background:'#ECEEE9'}}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Users size={13} className="text-surface-400" />
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Demo persona</p>
          </div>

          <div className="flex flex-col gap-1.5">
            {DUMMY_USERS.map(u => {
              const isActive = activePersona?.id === u.id
              return (
                <button key={u.id}
                  onClick={() => { setPersona(isActive ? null : u); setScreen('beranda') }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-left transition-all active:scale-[0.97] group
                    ${isActive ? 'shadow-brand-sm' : 'hover:bg-white/60'}`}
                  style={{
                    background: isActive ? '#fff' : 'transparent',
                    border: isActive ? `1.5px solid ${u.color}40` : '1.5px solid transparent',
                  }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold transition-transform group-hover:scale-105"
                    style={{
                      background: isActive ? u.color : `${u.color}CC`,
                      boxShadow: isActive ? `0 3px 10px ${u.color}30` : 'none',
                    }}>
                    {u.label[0]}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold line-clamp-2 ${isActive ? 'text-surface-900' : 'text-surface-600'}`}>{u.label}</p>
                    <p className="text-[10px] text-surface-400 leading-tight mt-0.5 line-clamp-2">{u.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {activePersona && (
            <button onClick={() => setPersona(null)}
              className="text-xs text-surface-400 hover:text-surface-700 py-2 mt-2 rounded-xl hover:bg-white/50 transition-colors text-center">
              ↺ Kembali ke data asli
            </button>
          )}

          {/* Info card */}
          <div className="mt-3 rounded-2xl p-4 space-y-2.5"
            style={{
              background:'rgba(255,255,255,0.8)',
              backdropFilter:'blur(12px)',
              boxShadow:'0 2px 8px rgba(27,107,58,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Zap size={12} className="text-brand" />
              <p className="text-xs font-semibold text-surface-800">
                {activePersona ? activePersona.name : 'User dari onboarding'}
              </p>
            </div>
            {[
              ['Nama', (activePersona||userData).name||'—'],
              ['Desa', (activePersona||userData).desa||'—'],
              ['Role', (activePersona?.capabilities||[]).join(', ')||'Warga'],
              ['Saldo', activePersona ? `Rp ${(activePersona.balance||0).toLocaleString('id')}` : '—'],
            ].map(([k,v]) => (
              <div key={k} className="flex items-baseline justify-between gap-2">
                <p className="text-[11px] text-surface-400 flex-shrink-0">{k}</p>
                <p className="text-[11px] font-medium text-surface-700 line-clamp-2 text-right">{v}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
    </AdsProvider>
  )
}
