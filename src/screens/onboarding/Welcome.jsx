import React, { useState } from 'react'
import {
  ChevronLeft, ArrowRight, Tv2, Radio, Play, Headphones, MessageCircle,
  Store, Clapperboard, Wheat, ShoppingCart, CreditCard, Star, Zap
} from 'lucide-react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

// ── Slide Data ─────────────────────────────────────────────
const SLIDES = [
  {
    title: 'Media desa\ndalam genggaman',
    subtitle:
      'Tonton GV TV, dengarkan GV Radio, nikmati video & podcast dari kreator lokal — semua dalam satu aplikasi.',
    features: [
      { Icon: Tv2, label: 'GV TV', g: ['#0C3E1E', '#1B6B3A'] },
      { Icon: Radio, label: 'Radio', g: ['#880E4F', '#C2185B'] },
      { Icon: Play, label: 'Video', g: ['#BF360C', '#E53935'] },
      { Icon: Headphones, label: 'Podcast', g: ['#4A148C', '#7B1FA2'] },
    ],
  },
  {
    title: 'Komunitas desa\nyang hidup',
    subtitle:
      'Diskusi warga, beli & jual produk lokal, ikuti kreator desa, dan bangun komunitas bersama anggota GV.',
    features: [
      { Icon: MessageCircle, label: 'Diskusi Warga', g: ['#0D47A1', '#1976D2'] },
      { Icon: Store, label: 'Jual Beli', g: ['#E65100', '#F57C00'] },
      { Icon: Clapperboard, label: 'Kreator Lokal', g: ['#4A148C', '#7B1FA2'] },
      { Icon: Wheat, label: 'Kelompok Tani', g: ['#1B5E20', '#2E7D32'] },
    ],
  },
  {
    title: 'Pasar lokal,\ntransaksi mudah',
    subtitle:
      'Belanja produk ESTO dari penjual terverifikasi, bayar dengan GV Pay, dan kumpulkan GV Poin dari setiap transaksi.',
    features: [
      { Icon: ShoppingCart, label: 'Pasar ESTO', g: ['#E65100', '#F57C00'] },
      { Icon: CreditCard, label: 'GV Pay', g: ['#1B5E20', '#2E7D32'] },
      { Icon: Star, label: 'GV Poin', g: ['#F57F17', '#FBC02D'] },
      { Icon: Zap, label: 'Tagihan Kilat', g: ['#0277BD', '#039BE5'] },
    ],
    isLast: true,
  },
]

export default function Welcome({ navigate }) {
  const [slide, setSlide] = useState(0)
  const current = SLIDES[slide]
  const isFirst = slide === 0
  const isLast  = slide === SLIDES.length - 1

  const next = () => (isLast ? navigate('register') : setSlide(s => s + 1))
  const prev = () => (isFirst ? null : setSlide(s => s - 1))

  return (
    <ScreenBackground
      variant="sunrise"
      overlay="none"
      className="h-full relative overflow-hidden select-none"
      contentClassName="h-full flex flex-col justify-end"
    >
      {/* Dark Scrim Vignette tailored to the reference design (darkening at bottom ~55%) */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(6, 26, 13, 0.0) 0%, rgba(6, 26, 13, 0.05) 30%, rgba(6, 20, 11, 0.55) 50%, rgba(5, 17, 9, 0.90) 75%, #051109 100%)',
        }}
      />

      {/* Top Header / Back Button when on subsequent slides */}
      {!isFirst && (
        <div className="absolute top-4 start-4 z-30">
          <button
            type="button"
            onClick={prev}
            className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90"
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <ChevronLeft size={20} className="text-white drop-shadow-sm" />
          </button>
        </div>
      )}

      {/* Content Area — Firmly anchored to the bottom of the screen */}
      <div className="relative z-20 px-6 pb-7 pt-4 flex flex-col mt-auto animate-fade-in">
        {/* Step Indicator: 1 / 3 */}
        <p className="text-[13px] font-bold text-white/70 tracking-widest mb-2 tabular-nums">
          {slide + 1} / {SLIDES.length}
        </p>

        {/* Headline */}
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-white leading-[1.16] tracking-tight mb-2.5 headline-display">
          {current.title.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-[13.5px] text-white/80 font-normal leading-relaxed mb-5 max-w-[340px]">
          {current.subtitle}
        </p>

        {/* Feature / Category Chips */}
        <div className="flex flex-wrap gap-2.5 mb-7">
          {current.features.map(f => (
            <div
              key={f.label}
              className="inline-flex items-center gap-2 ps-1.5 pe-3.5 py-1 rounded-full backdrop-blur-md transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <SkeuoIcon icon={f.Icon} gradient={f.g} size="xs" shape="circle" />
              <span className="text-[12.5px] font-semibold text-white tracking-wide">
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* Horizontal Progress Bar */}
        <div className="flex gap-2.5 mb-7">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-[3.5px] rounded-full flex-1 overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.22)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i <= slide ? '100%' : '0%',
                  background: 'linear-gradient(90deg, #16a34a, #22c55e)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Actions Row: Horizontal on slides 1-2, Vertical on slide 3 */}
        {isLast ? (
          <div className="flex flex-col gap-2 pt-0.5">
            <button
              type="button"
              onClick={next}
              className="w-full py-3.5 px-6 rounded-full font-bold text-white text-[14.5px] flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                boxShadow: '0 4px 18px rgba(22, 163, 74, 0.40)',
              }}
            >
              <span>Buat Akun Gratis</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={() => navigate('beranda')}
              className="w-full py-2 text-center text-white/80 font-bold text-[13.5px] hover:text-white transition active:scale-95"
            >
              Saya sudah punya akun
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => navigate('beranda')}
              className="text-white font-bold text-[14px] px-1 py-2 hover:text-white/80 transition active:scale-95"
            >
              Lewati
            </button>

            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-white text-[14px] transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                boxShadow: '0 4px 18px rgba(22, 163, 74, 0.40)',
              }}
            >
              <span>Lanjut</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}

      </div>
    </ScreenBackground>
  )
}
