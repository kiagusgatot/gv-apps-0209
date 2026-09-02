import React, { useState } from 'react'
import { ArrowRight, ChevronLeft } from 'lucide-react'

const PRIMARY = '#1B6B3A'
const AMBER   = '#F9A825'

// ── SVG Illustrations ─────────────────────────────────────

// Slide 1 — GV Media
const MediaIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="185" rx="140" ry="22" fill="#A5D6A7" opacity=".5"/>
    <circle cx="255" cy="35" r="22" fill={AMBER}/>
    <line x1="60" y1="150" x2="60" y2="60" stroke="#78909C" strokeWidth="3" strokeLinecap="round"/>
    <line x1="60" y1="90" x2="42" y2="75" stroke="#78909C" strokeWidth="2" strokeLinecap="round"/>
    <line x1="60" y1="90" x2="78" y2="75" stroke="#78909C" strokeWidth="2" strokeLinecap="round"/>
    <line x1="60" y1="110" x2="38" y2="95" stroke="#78909C" strokeWidth="2" strokeLinecap="round"/>
    <line x1="60" y1="110" x2="82" y2="95" stroke="#78909C" strokeWidth="2" strokeLinecap="round"/>
    <path d="M72 68 Q80 55 72 42" fill="none" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
    <path d="M80 73 Q92 55 80 37" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" opacity=".5"/>
    <rect x="110" y="85" width="110" height="72" rx="8" fill="white" stroke={PRIMARY} strokeWidth="2.5"/>
    <rect x="116" y="91" width="98" height="56" rx="4" fill="#E8F5E9"/>
    <circle cx="165" cy="119" r="16" fill={PRIMARY} opacity=".15"/>
    <polygon points="158,112 158,126 174,119" fill={PRIMARY}/>
    <rect x="152" y="157" width="26" height="6" rx="3" fill="#90A4AE"/>
    <rect x="144" y="163" width="42" height="5" rx="2.5" fill="#90A4AE"/>
    <circle cx="88" cy="130" r="12" fill={PRIMARY}/>
    <rect x="78" y="142" width="20" height="14" rx="6" fill={PRIMARY}/>
    <circle cx="115" cy="138" r="9" fill="#F57F17"/>
    <rect x="107" y="147" width="16" height="11" rx="5" fill="#F57F17"/>
    <rect x="25" y="148" width="32" height="22" rx="5" fill="white" stroke="#90A4AE" strokeWidth="1.5"/>
    <circle cx="33" cy="157" r="5" fill="#FFCC02"/>
    <rect x="40" y="154" width="10" height="2" rx="1" fill="#B0BEC5"/>
    <rect x="40" y="158" width="7" height="2" rx="1" fill="#B0BEC5"/>
    <path d="M255 155 Q255 140 270 140 Q285 140 285 155" fill="none" stroke="#6A1B9A" strokeWidth="3" strokeLinecap="round"/>
    <rect x="250" y="153" width="8" height="13" rx="4" fill="#6A1B9A"/>
    <rect x="282" y="153" width="8" height="13" rx="4" fill="#6A1B9A"/>
  </svg>
)

// Slide 2 — Komunitas
const KomunitasIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="185" rx="140" ry="22" fill="#A5D6A7" opacity=".5"/>
    <circle cx="55" cy="38" r="20" fill={AMBER}/>
    <circle cx="150" cy="100" r="18" fill={PRIMARY}/>
    <rect x="132" y="118" width="36" height="28" rx="10" fill={PRIMARY}/>
    <path d="M172 95 Q182 82 172 69" fill="none" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" opacity=".6"/>
    <path d="M180 100 Q194 82 180 64" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" opacity=".4"/>
    <rect x="190" y="68" width="82" height="52" rx="12" fill="white" stroke={PRIMARY} strokeWidth="2"/>
    <polygon points="202,120 190,132 214,120" fill="white" stroke={PRIMARY} strokeWidth="2"/>
    <rect x="200" y="80" width="52" height="6" rx="3" fill="#E8F5E9"/>
    <rect x="200" y="92" width="40" height="6" rx="3" fill="#E8F5E9"/>
    <rect x="200" y="104" width="30" height="4" rx="2" fill={AMBER} opacity=".8"/>
    <circle cx="60" cy="108" r="14" fill="#E65100"/>
    <rect x="46" y="122" width="28" height="22" rx="8" fill="#E65100"/>
    <rect x="22" y="68" width="72" height="44" rx="10" fill="white" stroke="#E65100" strokeWidth="2"/>
    <polygon points="70,112 82,112 74,124" fill="white" stroke="#E65100" strokeWidth="2"/>
    <rect x="32" y="78" width="42" height="5" rx="2.5" fill="#FFCCBC"/>
    <rect x="32" y="89" width="32" height="5" rx="2.5" fill="#FFCCBC"/>
    <circle cx="240" cy="108" r="14" fill="#1565C0"/>
    <rect x="226" y="122" width="28" height="22" rx="8" fill="#1565C0"/>
    <rect x="110" y="155" width="80" height="30" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1.5"/>
    <rect x="116" y="161" width="18" height="18" rx="4" fill="#E8F5E9"/>
    <text x="127" y="173" fontSize="10" textAnchor="middle" fill={PRIMARY}>🌾</text>
    <rect x="140" y="163" width="36" height="4" rx="2" fill="#E0E0E0"/>
    <rect x="140" y="171" width="24" height="4" rx="2" fill={AMBER} opacity=".8"/>
  </svg>
)

// Slide 3 — ESTO & GV Pay
const EkonomiIllustration = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="150" cy="185" rx="140" ry="22" fill="#A5D6A7" opacity=".5"/>
    <circle cx="245" cy="38" r="20" fill={AMBER}/>
    <rect x="30" y="110" width="100" height="60" rx="6" fill="white" stroke="#B0BEC5" strokeWidth="1.5"/>
    <rect x="24" y="95" width="112" height="20" rx="6" fill={PRIMARY}/>
    <rect x="36" y="100" width="22" height="10" rx="3" fill="white" opacity=".3"/>
    <rect x="64" y="100" width="22" height="10" rx="3" fill="white" opacity=".3"/>
    <rect x="92" y="100" width="22" height="10" rx="3" fill="white" opacity=".3"/>
    <circle cx="55" cy="135" r="10" fill="#FFCC02"/>
    <circle cx="80" cy="133" r="8" fill="#E65100"/>
    <circle cx="103" cy="136" r="9" fill="#388E3C"/>
    <rect x="43" y="155" width="74" height="4" rx="2" fill="#E0E0E0"/>
    <rect x="168" y="88" width="110" height="68" rx="12" fill={PRIMARY}/>
    <rect x="178" y="98" width="36" height="24" rx="6" fill="white" opacity=".2"/>
    <rect x="178" y="128" width="70" height="6" rx="3" fill="white" opacity=".3"/>
    <rect x="178" y="138" width="50" height="4" rx="2" fill="white" opacity=".2"/>
    <circle cx="254" cy="110" r="14" fill="white" opacity=".15"/>
    <text x="254" y="115" fontSize="12" textAnchor="middle" fill="white" fontWeight="bold">G</text>
    <circle cx="248" cy="162" r="20" fill={AMBER}/>
    <circle cx="248" cy="162" r="15" fill="#FFD54F"/>
    <text x="248" y="167" fontSize="11" textAnchor="middle" fill="#E65100" fontWeight="bold">★</text>
    <path d="M135 130 Q152 120 163 125" fill="none" stroke="#B0BEC5" strokeWidth="2" strokeDasharray="4 3"/>
    <polygon points="163,121 163,129 170,125" fill="#B0BEC5"/>
    <circle cx="150" cy="155" r="10" fill="#F57F17"/>
    <rect x="140" y="165" width="20" height="16" rx="6" fill="#F57F17"/>
  </svg>
)

// ── Slide Data ─────────────────────────────────────────────
const SLIDES = [
  {
    Illustration: MediaIllustration,
    title: 'Media desa\ndalam genggaman',
    subtitle: 'Tonton GV TV, dengarkan GV Radio, nikmati video & podcast dari kreator lokal — semua dalam satu aplikasi.',
    features: [
      { icon:'📺', label:'GV TV',    color:'#1565C0' },
      { icon:'📻', label:'Radio',    color:'#2E7D32' },
      { icon:'▶️',  label:'Video',   color:'#C62828' },
      { icon:'🎧', label:'Podcast',  color:'#6A1B9A' },
    ],
  },
  {
    Illustration: KomunitasIllustration,
    title: 'Komunitas desa\nyang hidup',
    subtitle: 'Diskusi warga, beli & jual produk lokal, ikuti kreator desa, dan bangun komunitas bersama anggota GV.',
    features: [
      { icon:'💬', label:'Diskusi',       color:'#1565C0' },
      { icon:'🏪', label:'Jual Beli',     color:'#E65100' },
      { icon:'🎬', label:'Kreator Lokal', color:'#2E7D32' },
    ],
  },
  {
    Illustration: EkonomiIllustration,
    title: 'Pasar lokal,\ntransaksi mudah',
    subtitle: 'Belanja produk ESTO dari penjual terverifikasi, bayar dengan GV Pay, dan kumpulkan GV Poin dari setiap transaksi.',
    features: [
      { icon:'🛒', label:'Pasar ESTO', color:'#2E7D32' },
      { icon:'💳', label:'GV Pay',     color:'#1565C0' },
      { icon:'⭐', label:'GV Poin',    color:'#F57F17' },
    ],
    isLast: true,
  },
]

// ── Main ───────────────────────────────────────────────────
export default function Welcome({ navigate }) {
  const [slide, setSlide] = useState(0)
  const current = SLIDES[slide]
  const isFirst = slide === 0
  const isLast  = slide === SLIDES.length - 1

  const next = () => isLast ? navigate('register') : setSlide(s => s + 1)
  const prev = () => isFirst ? null : setSlide(s => s - 1)

  return (
    <div className="flex flex-col h-full" style={{background:'linear-gradient(180deg, #F0FDF4 0%, #FAFBF9 40%, #FAFBF9 100%)'}}>
      {/* Back button for non-first slides */}
      {!isFirst && (
        <button onClick={prev}
          className="absolute top-4 start-4 z-10 w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{background:'rgba(255,255,255,0.8)', backdropFilter:'blur(8px)',
            boxShadow:'0 2px 8px rgba(15,26,19,0.06)'}}>
          <ChevronLeft size={18} style={{color:'#4A514A'}} />
        </button>
      )}

      {/* Illustration */}
      <div className="flex-shrink-0 px-5 pt-10 pb-3">
        <div className="w-full rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            background:'linear-gradient(145deg, #E8F5E9 0%, #F0FDF4 50%, #FAFBF9 100%)',
            aspectRatio:'4/3', maxHeight:220,
            boxShadow:'0 4px 24px rgba(27,107,58,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
          <div className="w-full h-full px-4 py-3">
            <current.Illustration/>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-2 pt-2">
        {/* Slide counter */}
        <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
          style={{color: PRIMARY, opacity: 0.5}}>
          {slide + 1} / {SLIDES.length}
        </p>

        {/* Title */}
        <h1 className="text-[28px] font-extrabold leading-[1.12] mb-3 headline-display"
          style={{color:'#0F1A13'}}>
          {current.title.split('\n').map((line, i) => (
            <span key={i}>{line}{i < current.title.split('\n').length - 1 && <br/>}</span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-[13.5px] leading-relaxed mb-5 text-balance" style={{color:'#6B7269', maxWidth:'32ch'}}>
          {current.subtitle}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2">
          {current.features.map((f, i) => (
            <div key={f.label}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl spotlight-border"
              style={{
                background:'rgba(255,255,255,0.85)',
                backdropFilter:'blur(8px)',
                border:'1px solid rgba(212,216,208,0.6)',
                boxShadow:'0 1px 3px rgba(27,107,58,0.04)',
                animationDelay: `${i * 60}ms`,
              }}>
              <span className="text-base leading-none">{f.icon}</span>
              <span className="text-[12px] font-semibold" style={{color:'#3A4038'}}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom — dots + buttons */}
      <div className="flex-shrink-0 px-6 pb-8 pt-3">
        {/* Progress bar */}
        <div className="flex items-center gap-1.5 mb-5 px-8">
          {SLIDES.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden"
              style={{background:'#E8EBE5'}}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i <= slide ? '100%' : '0%',
                  background: i <= slide ? 'linear-gradient(90deg, #1B6B3A, #22c55e)' : 'transparent',
                }} />
            </div>
          ))}
        </div>

        {/* CTA */}
        {isLast ? (
          <>
            <button onClick={()=>navigate('register')}
              className="w-full py-4 rounded-2xl font-bold text-white text-[15px] flex items-center justify-center gap-2 mb-3 active:scale-[0.97] transition-transform"
              style={{
                background:`linear-gradient(135deg, #0C3E1E 0%, ${PRIMARY} 50%, #15803d 100%)`,
                boxShadow:'0 4px 20px rgba(27,107,58,0.30), 0 1px 3px rgba(27,107,58,0.15)',
              }}>
              Buat Akun Gratis <ArrowRight size={16}/>
            </button>
            <button onClick={()=>navigate('beranda')}
              className="w-full py-3 text-[14px] font-semibold text-center active:scale-[0.97] transition-transform rounded-xl hover:bg-brand-50"
              style={{color:PRIMARY}}>
              Saya sudah punya akun
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <button onClick={()=>navigate('register')}
              className="text-[13px] font-semibold py-3 px-4 active:scale-[0.97] rounded-xl hover:bg-surface-100 transition-all"
              style={{color:'#9CA39A'}}>
              Lewati
            </button>
            <button onClick={next}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-[14px] active:scale-[0.97] transition-transform"
              style={{
                background:`linear-gradient(135deg, #0C3E1E 0%, ${PRIMARY} 50%, #15803d 100%)`,
                boxShadow:'0 4px 16px rgba(27,107,58,0.25), 0 1px 3px rgba(27,107,58,0.12)',
              }}>
              Lanjut <ArrowRight size={15}/>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
