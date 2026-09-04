import React, { useEffect, useState } from 'react'
import { MapPin, CheckCircle, User, Sparkles, ArrowRight } from 'lucide-react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import AppButton from '@/components/atoms/AppButton'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

export default function Selesai({ navigate, userData }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <ScreenBackground
      variant="sunrise"
      overlay="subtle"
      className="h-full flex flex-col justify-between"
    >
      {/* Top Celebration Hero */}
      <div className="flex-shrink-0 pt-8 pb-3 px-6 flex flex-col items-center z-20">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-3 transition-all duration-500 ${
            showContent ? 'scale-100 opacity-100 shadow-brand-lg' : 'scale-75 opacity-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.15))',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255,255,255,0.6)',
          }}
        >
          <SkeuoIcon icon={CheckCircle} gradient={['#16a34a', '#15803d']} size="lg" shape="circle" />
        </div>

        <h1 className="text-[24px] font-extrabold text-white text-center tracking-tight leading-tight headline-display drop-shadow-md">
          Selamat Datang!
        </h1>
        <p className="text-white/85 text-[13px] text-center mt-0.5 drop-shadow-sm font-medium">
          Akunmu telah aktif, <span className="font-bold">{userData.name || 'Warga GV'}</span>
        </p>
      </div>

      {/* Main Glass Summary Card */}
      <div
        className="flex-1 mx-4 mb-4 rounded-3xl overflow-hidden flex flex-col justify-between z-20 animate-fade-in"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(15, 26, 19, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        <div className="p-5 flex-1 flex flex-col">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand mb-3">
            Ringkasan Akun Warga
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-50/80 border border-surface-200/60">
              <SkeuoIcon icon={User} gradient={['#0D47A1', '#1976D2']} size="sm" />
              <div className="min-w-0">
                <p className="text-[10.5px] font-semibold text-surface-400 leading-none">Nama Warga</p>
                <p className="text-[13.5px] font-bold text-surface-900 truncate mt-1">
                  {userData.name || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-50/80 border border-surface-200/60">
              <SkeuoIcon icon={MapPin} gradient={['#1B5E20', '#2E7D32']} size="sm" />
              <div className="min-w-0">
                <p className="text-[10.5px] font-semibold text-surface-400 leading-none">Desa Terpilih</p>
                <p className="text-[13.5px] font-bold text-surface-900 truncate mt-1">
                  {userData.desa || 'Desa Sukamaju'}
                </p>
              </div>
            </div>

            {userData.preferences?.length > 0 && (
              <div className="p-3 rounded-2xl bg-surface-50/80 border border-surface-200/60">
                <p className="text-[10.5px] font-semibold text-surface-400 mb-1.5">Preferensi Kebutuhan</p>
                <div className="flex flex-wrap gap-1.5">
                  {userData.preferences.map(p => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-xs"
                      style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hint */}
          <div className="mt-auto pt-3">
            <div className="rounded-2xl p-3.5 bg-brand/5 border border-brand/15">
              <div className="flex items-center gap-2 mb-1 text-brand font-bold text-[12px]">
                <SkeuoIcon icon={Sparkles} gradient={['#1B5E20', '#2E7D32']} size="xs" shape="circle" />
                <span>Berandamu Sudah Siap</span>
              </div>
              <p className="text-[11.5px] text-surface-600 leading-relaxed font-medium">
                Konten desa, live siaran, bursa ESTO, dan dompet GV Pay siap digunakan langsung dari genggamanmu.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 pt-2 border-t border-surface-200/70 bg-white/70">
          <AppButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('beranda')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Buka Beranda Sekarang
          </AppButton>
        </div>
      </div>
    </ScreenBackground>
  )
}
