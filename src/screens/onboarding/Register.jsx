import React, { useState } from 'react'
import { ArrowLeft, User, Phone } from 'lucide-react'

export default function Register({ navigate, userData, updateUser }) {
  const [name, setName]   = useState(userData.name)
  const [phone, setPhone] = useState(userData.phone)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim())       e.name  = 'Nama tidak boleh kosong'
    if (phone.length < 10)  e.phone = 'Nomor HP minimal 10 digit'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return
    updateUser({ name: name.trim(), phone })
    navigate('otp')
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
            onClick={() => navigate('welcome')}
            className="mb-3 flex items-center justify-center w-8 h-8 rounded-xl transition-transform active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <ArrowLeft size={18} className="text-white/80" />
          </button>
          <p className="text-[11px] font-semibold text-white/50 mb-0.5">Langkah 1 dari 4</p>
          <h1 className="text-[22px] font-extrabold text-white leading-tight headline-display">
            Buat akun baru
          </h1>
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-1 rounded-full flex-1"
                style={{
                  background: i === 1
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8 pb-6 flex flex-col animate-fade-in">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-surface-700 mb-2">Nama lengkap</label>
          <div
            className={`spotlight-border flex items-center gap-3 border-2 rounded-2xl px-4 py-3.5 transition-all ${
              errors.name
                ? 'border-red-400'
                : name
                  ? 'border-brand'
                  : 'border-surface-200 focus-within:border-brand'
            }`}
            style={name && !errors.name ? { boxShadow: '0 2px 8px rgba(27,107,58,0.08)' } : undefined}
          >
            <User size={18} className={name ? 'text-brand' : 'text-surface-300'} />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="flex-1 text-sm text-surface-900 placeholder-surface-400 outline-none bg-transparent"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 ms-1 animate-slide-up">{errors.name}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-surface-700 mb-2">Nomor HP</label>
          <div
            className={`spotlight-border flex items-center gap-3 border-2 rounded-2xl px-4 py-3.5 transition-all ${
              errors.phone
                ? 'border-red-400'
                : phone
                  ? 'border-brand'
                  : 'border-surface-200 focus-within:border-brand'
            }`}
            style={phone && !errors.phone ? { boxShadow: '0 2px 8px rgba(27,107,58,0.08)' } : undefined}
          >
            <div className="flex items-center gap-2 border-e border-surface-200 pe-3 flex-shrink-0">
              <Phone size={16} className="text-surface-400" />
              <span className="text-sm text-surface-500 font-semibold tabular-nums">+62</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="8xx-xxxx-xxxx"
              maxLength={13}
              className="flex-1 text-sm text-surface-900 placeholder-surface-400 outline-none bg-transparent tabular-nums"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1.5 ms-1 animate-slide-up">{errors.phone}</p>
          )}
          <p className="text-surface-400 text-xs mt-2 ms-1">Kode OTP akan dikirim ke nomor ini</p>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleContinue}
            className="w-full py-4 font-semibold text-white rounded-2xl transition-transform active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)',
              boxShadow: '0 4px 20px rgba(27,107,58,0.30), 0 1px 3px rgba(27,107,58,0.15)',
              fontSize: '15px',
            }}
          >
            Lanjutkan
          </button>
          <p className="text-center text-xs text-surface-400 mt-4 leading-relaxed">
            Dengan mendaftar, kamu menyetujui{' '}
            <span className="text-brand font-medium">Syarat & Ketentuan</span> dan{' '}
            <span className="text-brand font-medium">Kebijakan Privasi</span> G-Village.
          </p>
        </div>
      </div>
    </div>
  )
}
