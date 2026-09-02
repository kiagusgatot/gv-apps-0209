import React, { useEffect, useState } from 'react'
import { MapPin, CheckCircle } from 'lucide-react'

export default function Selesai({ navigate, userData }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #061A0D 0%, #0C3E1E 40%, #1B6B3A 100%)' }}>
      {/* Top decoration */}
      <div className="flex-shrink-0 pt-8 pb-4 px-6 relative overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute -top-16 -end-16 w-56 h-56 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', opacity: 0.15 }} />
        <div className="absolute -top-8 -start-8 w-32 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)', opacity: 0.1 }} />
        <div className="absolute top-20 end-10 w-24 h-24 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', opacity: 0.08 }} />

        <div className="flex flex-col items-center">
          {/* Animated checkmark */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            showContent ? 'animate-scale-in' : 'opacity-0'
          }`} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <CheckCircle size={36} className="text-brand" />
            </div>
          </div>
          <h1 className="text-[22px] font-extrabold headline-display leading-tight text-white text-center mb-2">Selamat datang</h1>
          <p className="text-white/60 text-sm text-center">
            Akunmu berhasil dibuat, {userData.name || 'Pengguna'}
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="flex-1 mx-4 mb-0 rounded-3xl overflow-hidden flex flex-col animate-fade-in"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(27,107,58,0.15), 0 2px 8px rgba(27,107,58,0.08)',
        }}>
        <div className="px-6 pt-6 pb-4 border-b border-surface-200">
          <p className="text-[11px] font-semibold text-surface-400 mb-3">Ringkasan akunmu</p>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand/10">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" className="text-brand" />
                <circle cx="12" cy="7" r="4" className="text-brand" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-surface-400">Nama</p>
              <p className="text-sm font-semibold text-surface-900">{userData.name || '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-brand/10">
              <MapPin size={18} className="text-brand" />
            </div>
            <div>
              <p className="text-xs text-surface-400">Desa</p>
              <p className="text-sm font-semibold text-surface-900">{userData.desa || 'Belum dipilih'}</p>
            </div>
          </div>

          {userData.preferences.length > 0 && (
            <div>
              <p className="text-xs text-surface-400 mb-2">Preferensi</p>
              <div className="flex flex-wrap gap-1.5">
                {userData.preferences.map(p => (
                  <span key={p} className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hint */}
        <div className="px-6 py-4 flex-1">
          <div className="rounded-2xl p-4"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(27,107,58,0.08)',
              boxShadow: '0 2px 8px rgba(27,107,58,0.06)',
            }}>
            <p className="text-xs font-semibold text-brand mb-1">Berandamu sudah siap</p>
            <p className="text-xs text-surface-700 leading-relaxed">
              Konten dari {userData.desa || 'desamu'} dan pintasan sesuai preferensimu sudah disiapkan.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 flex-shrink-0">
          <button onClick={() => navigate('beranda')}
            className="w-full py-4 font-semibold text-white rounded-2xl active:scale-[0.97] transition-transform"
            style={{
              background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)',
              boxShadow: '0 4px 20px rgba(27,107,58,0.30), 0 1px 3px rgba(27,107,58,0.15)',
              fontSize: '15px',
            }}>
            Yuk, Mulai!
          </button>
        </div>
      </div>
    </div>
  )
}
