import React from 'react'
import GlassCard from '@/components/atoms/GlassCard'

/**
 * StatWidget Molecule
 * Displays key persona metrics, financial balances, or community counters.
 */
export default function StatWidget({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
  onClick,
  className = '',
}) {
  const isClickable = typeof onClick === 'function'

  if (gradient) {
    const Component = isClickable ? 'button' : 'div'
    return (
      <Component
        onClick={onClick}
        className={`rounded-2xl p-3.5 text-left transition-all duration-200 relative overflow-hidden ${
          isClickable ? 'active:scale-[0.98] cursor-pointer hover:shadow-brand-md' : ''
        } ${className}`}
        style={{
          background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
          boxShadow: `0 4px 16px ${gradient[0]}30, inset 0 1px 0 rgba(255,255,255,0.25)`,
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-white/70 text-[11px] font-semibold">{label}</p>
          {Icon && <Icon size={16} className="text-white/80" />}
        </div>
        <p className="text-white text-[22px] font-extrabold leading-none tabular-nums headline-display mb-1">
          {value}
        </p>
        {sub && <p className="text-white/60 text-[10.5px] font-medium leading-none">{sub}</p>}
      </Component>
    )
  }

  return (
    <GlassCard
      variant="interactive"
      onClick={onClick}
      className={`p-3.5 ${className}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-surface-500 text-[11px] font-semibold">{label}</p>
        {Icon && <Icon size={16} className="text-brand" />}
      </div>
      <p className="text-surface-900 text-[22px] font-extrabold leading-none tabular-nums headline-display mb-1">
        {value}
      </p>
      {sub && <p className="text-surface-400 text-[10.5px] font-medium leading-none">{sub}</p>}
    </GlassCard>
  )
}
