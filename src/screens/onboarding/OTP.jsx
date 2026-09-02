import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Smartphone } from 'lucide-react'

export default function OTP({ navigate, userData }) {
  const [otp, setOtp]         = useState(['','','','','',''])
  const [countdown, setCd]    = useState(60)
  const [verified, setVerified] = useState(false)
  const refs = useRef([])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCd(c => c-1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) refs.current[i+1]?.focus()
    if (next.every(d => d !== '')) {
      setTimeout(() => { setVerified(true); setTimeout(() => navigate('desa'), 700) }, 300)
    }
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i-1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    if (text.length === 6) {
      setOtp(text.split(''))
      refs.current[5]?.focus()
      setTimeout(() => { setVerified(true); setTimeout(() => navigate('desa'), 700) }, 300)
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#FAFBF9' }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #061A0D 0%, #0C3E1E 40%, #1B6B3A 100%)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 70% 60%, #22c55e, transparent 70%)',
            opacity: 0.2,
          }}
        />

        <div className="relative">
          <button
            onClick={() => navigate('register')}
            className="mb-3 flex items-center justify-center w-8 h-8 rounded-xl transition-transform active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <ArrowLeft size={18} className="text-white/80" />
          </button>
          <p className="text-[11px] font-semibold text-white/50 mb-0.5">Langkah 2 dari 4</p>
          <h1 className="text-[22px] font-extrabold text-white leading-tight headline-display">
            Verifikasi OTP
          </h1>
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-1 rounded-full flex-1"
                style={{
                  background: i <= 2
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-10 pb-6 flex flex-col items-center animate-fade-in">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: 'rgba(27,107,58,0.08)',
            boxShadow: '0 2px 8px rgba(27,107,58,0.08)',
          }}
        >
          <Smartphone size={28} className="text-brand" />
        </div>

        <h2
          className="text-lg font-extrabold text-surface-900 mb-2 text-center headline-tight"
        >
          Masukkan kode OTP
        </h2>
        <p className="text-surface-500 text-sm text-center mb-1">Kode dikirim ke nomor</p>
        <p className="font-semibold text-surface-900 text-sm mb-8 tabular-nums">
          +62 {userData.phone || '8xx-xxxx-xxxx'}
        </p>

        {/* OTP inputs */}
        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              type="tel"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              className={`spotlight-border w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all tabular-nums ${
                verified
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : d
                    ? 'border-brand text-surface-900'
                    : 'border-surface-200 text-surface-900 focus:border-brand'
              }`}
              style={
                !verified && (d || undefined)
                  ? { boxShadow: '0 2px 8px rgba(27,107,58,0.08)' }
                  : undefined
              }
            />
          ))}
        </div>

        {verified && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-4 animate-scale-in">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              }}
            >
              <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white">
                <path d="M1 6l3.5 3.5L11 2" />
              </svg>
            </div>
            Terverifikasi! Mengalihkan...
          </div>
        )}

        <p className="text-surface-400 text-sm text-center mb-8">
          {countdown > 0
            ? <>Kirim ulang kode dalam <span className="font-semibold text-surface-700 tabular-nums">{countdown}s</span></>
            : <button onClick={() => setCd(60)} className="font-semibold text-brand">
                Kirim Ulang Kode
              </button>
          }
        </p>

        <div className="mt-auto w-full">
          <p
            className="text-center text-xs text-surface-500 rounded-xl p-3 leading-relaxed"
            style={{
              background: 'rgba(27,107,58,0.06)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            Untuk prototype ini, masukkan 6 digit apapun atau paste "123456" untuk melanjutkan
          </p>
        </div>
      </div>
    </div>
  )
}
