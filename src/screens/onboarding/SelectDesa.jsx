import React, { useState, useEffect } from 'react'
import { ArrowLeft, Search, MapPin, Check, Navigation, X } from 'lucide-react'

// ── Semua desa yang berafiliasi dengan GV ─────────────────
const ALL_DESAS = [
  { id:1,  name:'Desa Sukamaju',    kec:'Cibinong',     kab:'Bogor'    },
  { id:2,  name:'Desa Cikaret',     kec:'Cibinong',     kab:'Bogor'    },
  { id:3,  name:'Desa Nagrak',      kec:'Sukaraja',     kab:'Bogor'    },
  { id:4,  name:'Desa Pabuaran',    kec:'Gunung Sindur',kab:'Bogor'    },
  { id:5,  name:'Desa Sukaresmi',   kec:'Tanah Sareal', kab:'Bogor'    },
  { id:6,  name:'Desa Karang Asem', kec:'Citeureup',    kab:'Bogor'    },
  { id:7,  name:'Desa Hambalang',   kec:'Citeureup',    kab:'Bogor'    },
  { id:8,  name:'Desa Bojong Gede', kec:'Bojong Gede',  kab:'Bogor'    },
  { id:9,  name:'Desa Parung',      kec:'Parung',       kab:'Bogor'    },
  { id:10, name:'Desa Ciampea',     kec:'Ciampea',      kab:'Bogor'    },
  { id:11, name:'Desa Leuwiliang',  kec:'Leuwiliang',   kab:'Bogor'    },
  { id:12, name:'Desa Dramaga',     kec:'Dramaga',      kab:'Bogor'    },
  { id:13, name:'Desa Gunung Putri',kec:'Gunung Putri', kab:'Bogor'    },
  { id:14, name:'Desa Cileungsi',   kec:'Cileungsi',    kab:'Bogor'    },
  { id:15, name:'Desa Jasinga',     kec:'Jasinga',      kab:'Bogor'    },
]

// ── Mock: Desa terdekat setelah GPS terdeteksi ─────────────
// Simulasi: user berada di sekitar Kendal, Jawa Tengah
const NEARBY_MOCK = [
  { id:20, name:'Desa Kaliwungu',  kec:'Kaliwungu',  kab:'Kendal', dist:0.8 },
  { id:21, name:'Desa Brangsong',  kec:'Brangsong',  kab:'Kendal', dist:3.2 },
  { id:22, name:'Desa Patebon',    kec:'Patebon',    kab:'Kendal', dist:5.1 },
]

const MOCK_LOCATION  = 'Kendal, Jawa Tengah'
const DETECT_DELAY_MS = 2200

// ── Warna avatar per ID desa ───────────────────────────────
const AVATAR_COLORS = ['#1B6B3A','#1565C0','#4A148C','#BF360C','#00695C',
  '#E65100','#37474F','#1B6B3A','#880E4F','#2E7D32','#0D47A1','#F57F17']

export default function SelectDesa({ navigate, userData, updateUser }) {
  const [locState, setLocState] = useState('prompt') // 'prompt'|'loading'|'found'|'denied'
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState(userData.desa || null)

  // ── Simulasi deteksi GPS ───────────────────────────────────
  const requestLocation = () => {
    setLocState('loading')
    setTimeout(() => {
      setLocState('found')
      // Auto-pilih desa terdekat jika jarak ≤ 1 km
      const closest = NEARBY_MOCK[0]
      if (closest.dist <= 1.0) {
        handleSelect(closest)
      }
    }, DETECT_DELAY_MS)
  }

  const handleSelect = (desa) => {
    setSelected(desa.name)
    updateUser({ desa: desa.name })
  }

  const handleContinue = () => {
    if (selected) navigate('preferensi')
  }

  // ── Filter logic ───────────────────────────────────────────
  const q = query.toLowerCase()
  const nearbyFiltered = NEARBY_MOCK.filter(d =>
    d.name.toLowerCase().includes(q) || d.kec.toLowerCase().includes(q)
  )
  const nearbyIds = new Set(NEARBY_MOCK.map(d => d.id))
  const allFiltered = ALL_DESAS.filter(d =>
    (d.name.toLowerCase().includes(q) || d.kec.toLowerCase().includes(q))
  )

  const isLoading = locState === 'loading'
  const isFound   = locState === 'found'
  const showAll   = locState === 'prompt' || locState === 'denied'

  // ── Desa item component ────────────────────────────────────
  const DesaItem = ({ desa, dist, index = 0 }) => {
    const isSelected = selected === desa.name
    const color = AVATAR_COLORS[desa.id % AVATAR_COLORS.length]
    return (
      <button onClick={() => handleSelect(desa)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1.5 transition-all text-left animate-fade-in spotlight-border ${isSelected ? 'ring-1' : ''}`}
        style={{
          animationDelay: `${index * 40}ms`,
          animationFillMode: 'backwards',
          ...(isSelected
            ? {
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderImage: 'linear-gradient(135deg, #1B6B3A, #4ade80) 1',
                border: '1.5px solid #1B6B3A',
                boxShadow: '0 4px 16px rgba(27,107,58,0.12)',
                ringColor: '#1B6B3A',
              }
            : { border: '1.5px solid transparent' }),
        }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isSelected ? '#1B6B3A' : color + '15' }}>
          <MapPin size={17} style={{ color: isSelected ? '#fff' : color }}/>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold line-clamp-2 ${isSelected ? 'text-brand' : 'text-surface-900'}`}>
            {desa.name}
          </p>
          <p className="text-xs text-surface-400 mt-0.5">Kec. {desa.kec} · {desa.kab}</p>
        </div>
        {dist !== undefined && (
          <span className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-xl tabular-nums"
            style={{ background: 'rgba(27,107,58,0.08)', color: '#1B6B3A' }}>
            {dist} km
          </span>
        )}
        {isSelected && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)',
              marginInlineStart: dist !== undefined ? 4 : 0,
            }}>
            <Check size={13} className="text-white" strokeWidth={3}/>
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-col h-full bg-surface-50">

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #061A0D 0%, #0C3E1E 40%, #1B6B3A 100%)',
        }}>
        {/* Ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(34,197,94,0.15), transparent)',
          }}/>
        <div className="relative px-5 pt-4 pb-3">
          {/* Glassmorphic back button */}
          <button onClick={() => navigate('otp')}
            className="mb-3 w-8 h-8 rounded-xl flex items-center justify-center -ms-1 transition-transform active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
            <ArrowLeft size={18} className="text-white/80"/>
          </button>
          <p className="text-[11px] font-semibold text-white/50 mb-0.5">Langkah 3 dari 4</p>
          <h1 className="text-[22px] font-extrabold text-white leading-tight mb-1 headline-display"
            style={{ fontFeatureSettings: '"ss01"' }}>
            {isFound ? 'Menampilkan desa GV di sekitar lokasimu' : 'Pilih desamu'}
          </h1>
          <p className="text-white/50 text-sm mb-3">
            {isFound ? 'Pilih desa yang paling sesuai' : 'Temukan desa tempat kamu tinggal'}
          </p>
          {/* Gradient progress bars */}
          <div className="flex gap-1">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-1 rounded-full flex-1"
                style={{
                  background: i <= 3
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'rgba(255,255,255,0.15)',
                }}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── Location Prompt ── */}
      {locState === 'prompt' && (
        <div className="flex-shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(27,107,58,0.08)',
            border: '1px solid rgba(27,107,58,0.1)',
          }}>
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)',
                boxShadow: '0 2px 8px rgba(27,107,58,0.25)',
              }}>
              <Navigation size={18} className="text-white"/>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-surface-900 mb-0.5">Temukan desa terdekat otomatis</p>
              <p className="text-xs text-surface-400 leading-relaxed">
                Kami gunakan lokasimu hanya untuk menampilkan desa GV di sekitarmu — tidak disimpan.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 px-4 py-3"
            style={{ borderTop: '1px solid rgba(27,107,58,0.06)' }}>
            <button onClick={requestLocation}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)',
                boxShadow: '0 4px 20px rgba(27,107,58,0.30)',
              }}>
              Izinkan Lokasi
            </button>
            <button onClick={() => setLocState('denied')}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-surface-500 border border-surface-200 bg-surface-50 transition-transform active:scale-[0.97]">
              Cari Manual
            </button>
          </div>
        </div>
      )}

      {/* ── Detecting / Loading ── */}
      {isLoading && (
        <div className="flex-shrink-0 mx-4 mt-4 flex items-center gap-3 px-4 py-3.5 rounded-2xl animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(27,107,58,0.08)',
            border: '1px solid rgba(27,107,58,0.1)',
          }}>
          <div className="w-8 h-8 rounded-full border-2 border-surface-200 border-t-brand flex-shrink-0 animate-spin"/>
          <div>
            <p className="text-sm font-semibold text-surface-900">Mendeteksi lokasimu...</p>
            <p className="text-xs text-surface-400 mt-0.5">Mencari desa GV terdekat</p>
          </div>
        </div>
      )}

      {/* ── Location Found Banner ── */}
      {isFound && (
        <div className="flex-shrink-0 mx-4 mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(27,107,58,0.12)',
            border: '1px solid transparent',
            backgroundClip: 'padding-box',
            position: 'relative',
          }}>
          {/* Gradient border accent */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, #1B6B3A, #4ade80)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              borderRadius: '1rem',
            }}/>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)',
              boxShadow: '0 2px 8px rgba(27,107,58,0.25)',
            }}>
            <MapPin size={15} className="text-white"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-brand line-clamp-2">{MOCK_LOCATION}</p>
            <p className="text-xs mt-0.5 text-surface-500">Lokasi terdeteksi otomatis</p>
          </div>
          <button onClick={() => { setLocState('prompt'); setQuery('') }}
            className="text-xs font-semibold flex-shrink-0 underline text-brand">
            Ubah
          </button>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 bg-surface-50 rounded-2xl px-4 py-3 border border-surface-200 transition-shadow focus-within:shadow-brand-xs"
          style={isLoading ? { opacity: 0.45, pointerEvents: 'none' } : {}}>
          <Search size={15} className="text-surface-400 flex-shrink-0"/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Cari nama desa atau kecamatan..."
            className="flex-1 text-sm text-surface-900 placeholder-surface-400 outline-none bg-transparent"/>
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={14} className="text-surface-400"/>
            </button>
          )}
        </div>
      </div>

      {/* ── Desa List ── */}
      <div className={`flex-1 overflow-y-auto no-scrollbar px-4 pb-2 ${isLoading ? 'opacity-30 pointer-events-none' : ''}`}>

        {/* Nearby section (only when found) */}
        {isFound && nearbyFiltered.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-2 mt-1">
              <p className="text-[11px] font-bold text-surface-400">
                Desa terdekat ({nearbyFiltered.length} ditemukan)
              </p>
            </div>
            {nearbyFiltered.map((d, i) => <DesaItem key={d.id} desa={d} dist={d.dist} index={i}/>)}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-surface-100"/>
              <p className="text-[10px] font-semibold text-surface-300 flex-shrink-0">Desa lain di GV</p>
              <div className="flex-1 h-px bg-surface-100"/>
            </div>
          </>
        )}

        {/* All desas */}
        {!isFound && allFiltered.length === 0 && (
          <div className="text-center py-14 text-surface-400 text-sm animate-fade-in">
            <MapPin size={28} className="mx-auto mb-2 text-surface-300"/>
            Desa tidak ditemukan
          </div>
        )}

        {!isFound && (
          <>
            {!query && locState !== 'denied' && (
              <p className="text-[11px] font-bold text-surface-400 mb-2 mt-1">
                Semua desa GV
              </p>
            )}
            {allFiltered.map((d, i) => <DesaItem key={d.id} desa={d} index={i}/>)}
          </>
        )}

        {isFound && allFiltered.map((d, i) => <DesaItem key={d.id} desa={d} index={i + nearbyFiltered.length}/>)}
      </div>

      {/* ── Footer CTA ── */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-surface-100 bg-surface-50">
        {isFound && selected && (
          <p className="text-xs text-center text-surface-400 mb-2 animate-fade-in">
            Kamu bisa mengganti desamu nanti di Profil
          </p>
        )}
        <button onClick={handleContinue} disabled={!selected || isLoading}
          className="w-full py-4 font-semibold text-white rounded-2xl transition-all active:scale-[0.97]"
          style={{
            background: selected && !isLoading
              ? 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)'
              : undefined,
            backgroundColor: !(selected && !isLoading) ? '#9E9E9E' : undefined,
            boxShadow: selected && !isLoading
              ? '0 4px 20px rgba(27,107,58,0.30)'
              : 'none',
            fontSize: '15px',
            opacity: selected && !isLoading ? 1 : 0.6,
          }}>
          {isLoading
            ? 'Mendeteksi lokasi...'
            : selected
              ? `Pilih ${selected} →`
              : 'Pilih desamu'
          }
        </button>
      </div>

    </div>
  )
}
