import React, { useState } from 'react'
import { ArrowLeft, Newspaper, Zap, ShoppingBag, Package, Tv2, ArrowRightLeft, Check } from 'lucide-react'

const PREFS = [
  { id:'Komunitas',      Icon:Newspaper,       desc:'Forum & diskusi warga' },
  { id:'Bayar Tagihan', Icon:Zap,             desc:'Listrik, air, pulsa' },
  { id:'Belanja',       Icon:ShoppingBag,     desc:'Pasar & UMKM lokal' },
  { id:'Jual Produk',   Icon:Package,         desc:'Buka toko di Pasar' },
  { id:'Siaran',        Icon:Tv2,             desc:'GV TV, radio, VOD' },
  { id:'Kirim Uang',    Icon:ArrowRightLeft,  desc:'Transfer ke warga' },
]

export default function Preferensi({ navigate, userData, updateUser }) {
  const [selected, setSelected] = useState(new Set(userData.preferences))

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
    <div className="flex flex-col h-full bg-surface-50">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #061A0D 0%, #0C3E1E 40%, #1B6B3A 100%)' }}>
        {/* Ambient glow */}
        <div className="absolute -top-10 -end-10 w-48 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)', opacity: 0.2 }} />

        <button onClick={() => navigate('desa')}
          className="mb-3 w-8 h-8 rounded-xl flex items-center justify-center -ms-1 active:scale-90 transition-transform"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={18} className="text-white/80" />
        </button>

        <p className="text-[11px] font-semibold text-white/50 mb-0.5">Langkah 4 dari 4</p>
        <h1 className="text-[22px] font-extrabold headline-display leading-tight text-white mb-1">Apa yang kamu butuhkan?</h1>
        <p className="text-white/50 text-sm mb-3">Pilih satu atau lebih. Bisa diubah kapan saja.</p>

        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex-1 rounded-full overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full w-full rounded-full" style={{ background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-5 py-5 overflow-y-auto no-scrollbar animate-fade-in">
        <div className="grid grid-cols-2 gap-3 stagger-in">
          {PREFS.map(({ id, Icon, desc }) => {
            const isOn = selected.has(id)
            return (
              <button key={id} onClick={() => toggle(id)}
                className={`spotlight-border relative flex flex-col items-start p-4 rounded-2xl transition-all text-left active:scale-[0.97] ${
                  isOn ? 'border-brand bg-brand/5' : 'border-surface-200 bg-surface-50'
                }`}
                style={{
                  boxShadow: isOn ? '0 4px 16px rgba(27,107,58,0.12)' : 'none',
                }}>
                {isOn && (
                  <div className="absolute top-3 end-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)' }}>
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${!isOn ? 'bg-surface-200' : ''}`}
                  style={isOn ? { background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)' } : undefined}>
                  <Icon size={20} className={isOn ? 'text-white' : 'text-surface-400'} />
                </div>
                <p className={`text-sm font-semibold mb-0.5 ${isOn ? 'text-surface-900' : 'text-surface-700'}`}>{id}</p>
                <p className="text-xs text-surface-400 leading-snug">{desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-surface-200">
        <button onClick={handleContinue}
          className="w-full py-4 font-semibold text-white rounded-2xl active:scale-[0.97] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)',
            boxShadow: '0 4px 20px rgba(27,107,58,0.30), 0 1px 3px rgba(27,107,58,0.15)',
            fontSize: '15px',
          }}>
          {selected.size > 0 ? `Lanjutkan (${selected.size} dipilih)` : 'Lewati'}
        </button>
      </div>
    </div>
  )
}
