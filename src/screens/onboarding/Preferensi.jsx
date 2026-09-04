import React, { useState } from 'react'
import { MessageCircle, Zap, ShoppingBag, Store, Tv2, ArrowRightLeft, Check } from 'lucide-react'
import OnboardingLayout from '@/components/templates/OnboardingLayout'
import AppButton from '@/components/atoms/AppButton'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

const PREFS = [
  { id: 'Komunitas',     Icon: MessageCircle,  desc: 'Forum & diskusi warga',      g: ['#0D47A1', '#1976D2'] },
  { id: 'Bayar Tagihan', Icon: Zap,            desc: 'Listrik, air, pulsa',          g: ['#E65100', '#F57C00'] },
  { id: 'Belanja',      Icon: ShoppingBag,    desc: 'Pasar & UMKM lokal',           g: ['#1B5E20', '#2E7D32'] },
  { id: 'Jual Produk',  Icon: Store,          desc: 'Buka toko di Pasar',           g: ['#6A1B9A', '#8E24AA'] },
  { id: 'Siaran',       Icon: Tv2,            desc: 'GV TV, radio, VOD',            g: ['#C62828', '#E53935'] },
  { id: 'Kirim Uang',   Icon: ArrowRightLeft, desc: 'Transfer ke sesama warga',     g: ['#F57F17', '#FBC02D'] },
]

export default function Preferensi({ navigate, userData, updateUser }) {
  const [selected, setSelected] = useState(new Set(userData.preferences || []))

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleContinue = () => {
    updateUser({ preferences: [...selected] })
    navigate('selesai')
  }

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={4}
      title="Apa Kebutuhanmu?"
      subtitle="Pilih satu atau lebih. Bisa disesuaikan kapan saja di menu profil."
      onBack={() => navigate('desa')}
      footer={
        <AppButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
        >
          {selected.size > 0 ? `Lanjutkan (${selected.size} Dipilih)` : 'Lewati & Mulai'}
        </AppButton>
      }
    >
      <div className="grid grid-cols-2 gap-2.5 animate-fade-in py-1">
        {PREFS.map(({ id, Icon, desc, g }) => {
          const isOn = selected.has(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`relative flex flex-col items-start p-3.5 rounded-2xl transition-all text-left active:scale-[0.96] group ${
                isOn
                  ? 'border-2 border-brand bg-brand/8 shadow-brand-xs ring-1 ring-brand/20'
                  : 'border border-surface-200/80 bg-white hover:border-surface-300 hover:shadow-xs'
              }`}
            >
              {isOn && (
                <div
                  className="absolute top-3 end-3 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                  style={{
                    background: 'linear-gradient(135deg, #1B6B3A, #22c55e)',
                    boxShadow: '0 2px 6px rgba(27, 107, 58, 0.25)',
                  }}
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
              )}
              <SkeuoIcon
                icon={Icon}
                gradient={g}
                size="sm"
                className="mb-2.5 transition-transform group-hover:scale-105"
              />
              <p
                className={`text-[13px] font-bold mb-0.5 leading-snug ${
                  isOn ? 'text-brand font-extrabold' : 'text-surface-900'
                }`}
              >
                {id}
              </p>
              <p className="text-[11px] text-surface-500 leading-snug font-medium">{desc}</p>
            </button>
          )
        })}
      </div>
    </OnboardingLayout>
  )
}
