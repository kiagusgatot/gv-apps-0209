import React, { useState } from 'react'
import { Search, MapPin, Check, Navigation, X } from 'lucide-react'
import OnboardingLayout from '@/components/templates/OnboardingLayout'
import AppButton from '@/components/atoms/AppButton'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

// ── Semua desa yang berafiliasi dengan GV ─────────────────
const ALL_DESAS = [
  { id: 1,  name: 'Desa Sukamaju',    kec: 'Cibinong',     kab: 'Bogor' },
  { id: 2,  name: 'Desa Cikaret',     kec: 'Cibinong',     kab: 'Bogor' },
  { id: 3,  name: 'Desa Nagrak',      kec: 'Sukaraja',     kab: 'Bogor' },
  { id: 4,  name: 'Desa Pabuaran',    kec: 'Gunung Sindur',kab: 'Bogor' },
  { id: 5,  name: 'Desa Sukaresmi',   kec: 'Tanah Sareal', kab: 'Bogor' },
  { id: 6,  name: 'Desa Karang Asem', kec: 'Citeureup',    kab: 'Bogor' },
  { id: 7,  name: 'Desa Hambalang',   kec: 'Citeureup',    kab: 'Bogor' },
  { id: 8,  name: 'Desa Bojong Gede', kec: 'Bojong Gede',  kab: 'Bogor' },
  { id: 9,  name: 'Desa Parung',      kec: 'Parung',       kab: 'Bogor' },
  { id: 10, name: 'Desa Ciampea',     kec: 'Ciampea',      kab: 'Bogor' },
  { id: 11, name: 'Desa Leuwiliang',  kec: 'Leuwiliang',   kab: 'Bogor' },
  { id: 12, name: 'Desa Dramaga',     kec: 'Dramaga',      kab: 'Bogor' },
  { id: 13, name: 'Desa Gunung Putri',kec: 'Gunung Putri', kab: 'Bogor' },
  { id: 14, name: 'Desa Cileungsi',   kec: 'Cileungsi',    kab: 'Bogor' },
  { id: 15, name: 'Desa Jasinga',     kec: 'Jasinga',      kab: 'Bogor' },
]

// ── Mock: Desa terdekat setelah GPS terdeteksi ─────────────
// Simulasi: user berada di sekitar Kendal, Jawa Tengah
const NEARBY_MOCK = [
  { id: 20, name: 'Desa Kaliwungu', kec: 'Kaliwungu', kab: 'Kendal', dist: 0.8 },
  { id: 21, name: 'Desa Brangsong', kec: 'Brangsong', kab: 'Kendal', dist: 3.2 },
  { id: 22, name: 'Desa Patebon',   kec: 'Patebon',   kab: 'Kendal', dist: 5.1 },
]

const MOCK_LOCATION = 'Kendal, Jawa Tengah'
const DETECT_DELAY_MS = 2000

// ── Warna avatar per ID desa ───────────────────────────────
const AVATAR_COLORS = [
  '#1B6B3A', '#1565C0', '#4A148C', '#BF360C', '#00695C',
  '#E65100', '#37474F', '#1B6B3A', '#880E4F', '#2E7D32', '#0D47A1', '#F57F17'
]

export default function SelectDesa({ navigate, userData, updateUser }) {
  const [locState, setLocState] = useState('prompt') // 'prompt' | 'loading' | 'found' | 'denied'
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(userData?.desa || null)

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
    updateUser?.({ desa: desa.name })
  }

  const handleContinue = () => {
    if (selected) navigate('preferensi')
  }

  // ── Filter logic ───────────────────────────────────────────
  const q = query.toLowerCase()
  const nearbyFiltered = NEARBY_MOCK.filter(d =>
    d.name.toLowerCase().includes(q) || d.kec.toLowerCase().includes(q)
  )
  const allFiltered = ALL_DESAS.filter(d =>
    d.name.toLowerCase().includes(q) || d.kec.toLowerCase().includes(q)
  )

  const isLoading = locState === 'loading'
  const isFound   = locState === 'found'

  // ── Desa item component ────────────────────────────────────
  const DesaItem = ({ desa, dist, index = 0 }) => {
    const isSelected = selected === desa.name
    const color = AVATAR_COLORS[desa.id % AVATAR_COLORS.length]
    return (
      <button
        type="button"
        onClick={() => handleSelect(desa)}
        className={`w-full flex items-center gap-3 p-3 rounded-2xl mb-2 transition-all text-left active:scale-[0.98] ${
          isSelected
            ? 'border-2 border-brand bg-brand/8 shadow-brand-xs ring-1 ring-brand/20'
            : 'border border-surface-200/80 bg-surface-50/60 hover:bg-white hover:border-surface-300'
        }`}
        style={{
          animationDelay: `${index * 30}ms`,
        }}
      >
        <SkeuoIcon
          icon={MapPin}
          gradient={isSelected ? ['#1B5E20', '#2E7D32'] : [`${color}dd`, color]}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-bold truncate ${isSelected ? 'text-brand' : 'text-surface-900'}`}>
            {desa.name}
          </p>
          <p className="text-[11px] text-surface-500 mt-0.5 truncate">
            Kec. {desa.kec} · {desa.kab}
          </p>
        </div>
        {dist !== undefined && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-lg tabular-nums"
            style={{ background: 'rgba(27,107,58,0.1)', color: '#1B6B3A' }}
          >
            {dist} km
          </span>
        )}
        {isSelected && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 animate-scale-in"
            style={{ background: 'linear-gradient(135deg, #1B6B3A, #22c55e)' }}
          >
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        )}
      </button>
    )
  }

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      title={isFound ? 'Desa di Sekitarmu' : 'Pilih Desamu'}
      subtitle={
        isFound
          ? 'Pilih desa yang paling sesuai dengan tempat tinggalmu'
          : 'Temukan desa tempat kamu tinggal atau berkegiatan'
      }
      onBack={() => navigate('otp')}
      footer={
        <div>
          {isFound && selected && (
            <p className="text-[11px] text-center text-surface-400 mb-2 animate-fade-in font-medium">
              Kamu bisa mengganti desamu kapan saja di menu Profil
            </p>
          )}
          <AppButton
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selected || isLoading}
            onClick={handleContinue}
          >
            {isLoading
              ? 'Mendeteksi lokasi...'
              : selected
              ? `Pilih ${selected} →`
              : 'Pilih Desamu'}
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col flex-1 animate-fade-in">
        {/* ── Location Prompt ── */}
        {locState === 'prompt' && (
          <div className="rounded-2xl p-3.5 bg-brand/5 border border-brand/15 mb-3.5 animate-fade-in flex-shrink-0">
            <div className="flex items-start gap-3 mb-2.5">
              <SkeuoIcon
                icon={Navigation}
                gradient={['#1B5E20', '#2E7D32']}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-surface-900 leading-tight">
                  Temukan desa terdekat otomatis
                </p>
                <p className="text-[11.5px] text-surface-500 leading-relaxed mt-0.5">
                  Gunakan GPS untuk mendeteksi desa GV di sekitarmu secara instan.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <AppButton
                variant="primary"
                size="sm"
                className="flex-1 text-[12px] py-2"
                onClick={requestLocation}
              >
                Izinkan Lokasi
              </AppButton>
              <AppButton
                variant="secondary"
                size="sm"
                className="flex-1 text-[12px] py-2"
                onClick={() => setLocState('denied')}
              >
                Cari Manual
              </AppButton>
            </div>
          </div>
        )}

        {/* ── Detecting / Loading ── */}
        {isLoading && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-brand/5 border border-brand/15 mb-3.5 animate-fade-in flex-shrink-0">
            <div className="w-7 h-7 rounded-full border-2 border-brand/30 border-t-brand flex-shrink-0 animate-spin" />
            <div>
              <p className="text-[13px] font-bold text-surface-900 leading-none">
                Mendeteksi lokasimu...
              </p>
              <p className="text-[11.5px] text-surface-500 mt-1">
                Mencari desa GV terdekat via sinyal GPS
              </p>
            </div>
          </div>
        )}

        {/* ── Location Found Banner ── */}
        {isFound && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-brand/8 border border-brand/20 mb-3.5 animate-fade-in flex-shrink-0">
            <SkeuoIcon
              icon={MapPin}
              gradient={['#1B5E20', '#2E7D32']}
              size="xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-brand leading-none">{MOCK_LOCATION}</p>
              <p className="text-[11px] text-surface-500 mt-1 font-medium">Lokasi terdeteksi otomatis</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLocState('prompt')
                setQuery('')
              }}
              className="text-[11.5px] font-bold text-brand hover:underline px-2 py-1 rounded-lg"
            >
              Ubah
            </button>
          </div>
        )}

        {/* ── Search Bar Input ── */}
        <div className="mb-3 flex-shrink-0">
          <div
            className={`flex items-center gap-2.5 border-2 rounded-2xl px-3.5 py-2.5 transition-all ${
              query
                ? 'border-brand bg-brand/5 shadow-brand-xs'
                : 'border-surface-200 bg-surface-50 focus-within:border-brand focus-within:bg-white'
            }`}
          >
            <Search size={16} className={query ? 'text-brand' : 'text-surface-400'} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari nama desa atau kecamatan..."
              className="flex-1 text-[13px] font-medium text-surface-900 placeholder-surface-400 outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-surface-400 hover:text-surface-700"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* ── Scrollable Village List ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar pe-0.5">
          {/* Nearby Section */}
          {isFound && nearbyFiltered.length > 0 && (
            <div className="mb-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand mb-2 px-1">
                Desa Terdekat ({nearbyFiltered.length} ditemukan)
              </p>
              {nearbyFiltered.map((d, i) => (
                <DesaItem key={d.id} desa={d} dist={d.dist} index={i} />
              ))}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-surface-200" />
                <p className="text-[10.5px] font-bold text-surface-400 uppercase tracking-wider flex-shrink-0">
                  Desa Lain di G-Village
                </p>
                <div className="flex-1 h-px bg-surface-200" />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isFound && allFiltered.length === 0 && (
            <div className="text-center py-12 text-surface-400 text-[13px] animate-fade-in flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 mb-2.5">
                <MapPin size={24} />
              </div>
              <p className="font-bold text-surface-700 mb-0.5">Desa tidak ditemukan</p>
              <p className="text-[11.5px] text-surface-400">
                Coba gunakan kata kunci nama desa atau kecamatan lain
              </p>
            </div>
          )}

          {/* Default List */}
          {!isFound && (
            <div>
              {!query && locState !== 'denied' && (
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-surface-400 mb-2 px-1">
                  Semua Desa G-Village
                </p>
              )}
              {allFiltered.map((d, i) => (
                <DesaItem key={d.id} desa={d} index={i} />
              ))}
            </div>
          )}

          {isFound &&
            allFiltered.map((d, i) => (
              <DesaItem key={d.id} desa={d} index={i + nearbyFiltered.length} />
            ))}
        </div>
      </div>
    </OnboardingLayout>
  )
}
