import React, { useState } from 'react'
import {
  Wheat, Zap, Landmark, GraduationCap, Home, Handshake, Check
} from 'lucide-react'
import OnboardingLayout from '@/components/templates/OnboardingLayout'
import AppButton from '@/components/atoms/AppButton'

const KOMUNITAS_OPTIONS = [
  { id: 'sinartani',     label: 'SINARTANI',     desc: 'Pertanian & agribisnis',  color: '#2D7A27', bg: '#E8F5E9', Icon: Wheat },
  { id: 'nexgent',       label: 'NEXGENT',       desc: 'Inovasi & generasi muda', color: '#1A3A8A', bg: '#E8EAF6', Icon: Zap },
  { id: 'hkti',          label: 'HKTI',          desc: 'Kerukunan tani Indonesia', color: '#1F5C1A', bg: '#E8F5E9', Icon: Landmark },
  { id: 'active_campus', label: 'Active Campus', desc: 'Kampus & mahasiswa',       color: '#C0392B', bg: '#FFEBEE', Icon: GraduationCap },
  { id: 'rt_online',     label: 'RT Online',     desc: 'Lingkungan & info desa',   color: '#5D6D7E', bg: '#ECEFF1', Icon: Home },
  { id: 'dekopin',       label: 'Dekopin',       desc: 'Koperasi & UMKM',          color: '#922B21', bg: '#FFEBEE', Icon: Handshake },
]

export default function PilihKomunitas({ navigate, userData, updateUser }) {
  const [selected, setSelected] = useState(userData?.komunitas || '')

  const handleSelect = (id) => {
    setSelected(prev => (prev === id ? '' : id))
  }

  const handleContinue = () => {
    if (selected) {
      updateUser?.({ komunitas: selected })
    }
    navigate('preferensi')
  }

  const handleSkip = () => {
    navigate('preferensi')
  }

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={5}
      title="Komunitas mana yang paling mencerminkan kamu?"
      subtitle="Pilihanmu akan menyesuaikan tampilan dan konten yang kamu terima. Bisa diubah kapan saja."
      onBack={() => navigate('desa')}
      footer={
        selected ? (
          <AppButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
          >
            Lanjut →
          </AppButton>
        ) : (
          <AppButton
            variant="ghost"
            size="lg"
            fullWidth
            onClick={handleSkip}
          >
            Lewati
          </AppButton>
        )
      }
    >
      <div className="grid grid-cols-2 gap-2.5 animate-fade-in py-1">
        {KOMUNITAS_OPTIONS.map((item) => {
          const isSelected = selected === item.id
          const IconComponent = item.Icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`relative flex flex-col items-start p-3.5 rounded-2xl transition-all text-left active:scale-[0.96] group ${
                isSelected
                  ? 'border-2 shadow-sm ring-1 ring-black/5'
                  : 'border border-surface-200/80 hover:border-surface-300 hover:shadow-xs'
              }`}
              style={{
                backgroundColor: item.bg,
                borderColor: isSelected ? item.color : undefined,
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-3 end-3 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                  style={{
                    background: item.color,
                    boxShadow: `0 2px 6px ${item.color}40`,
                  }}
                >
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
              )}

              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 shadow-2xs"
                style={{
                  background: item.color,
                  color: '#ffffff',
                }}
              >
                <IconComponent size={16} strokeWidth={2.2} />
              </div>

              <p
                className="text-[13.5px] font-bold mb-0.5 leading-snug"
                style={{ color: isSelected ? item.color : '#0F1A13' }}
              >
                {item.label}
              </p>
              <p className="text-[11px] text-surface-600 leading-snug font-medium truncate w-full">
                {item.desc}
              </p>
            </button>
          )
        })}
      </div>
    </OnboardingLayout>
  )
}
