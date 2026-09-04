import React from 'react'
import SkeuoIcon from '@/components/atoms/SkeuoIcon'

/**
 * ShortcutItem Molecule
 * Persona action launcher button with skeuomorphic 3D tactile icon and label.
 */
export default function ShortcutItem({
  label,
  icon: Icon,
  gradient = ['#1B5E20', '#2E7D32'],
  onClick,
  badge,
  textColor = 'dark', // 'dark' | 'light'
  size = 'md',
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-[0.93] group select-none ${className}`}
    >
      <div className="relative">
        <SkeuoIcon
          icon={Icon}
          gradient={gradient}
          size={size}
          strokeWidth={2}
        />
        {badge && (
          <span className="absolute -top-1 -end-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-30">
            {badge}
          </span>
        )}
      </div>
      <span
        className={`text-[11px] font-semibold text-center leading-tight transition-colors ${
          textColor === 'light' ? 'text-white/80 group-hover:text-white' : 'text-surface-700 group-hover:text-surface-900'
        }`}
      >
        {label}
      </span>
    </button>
  )
}
