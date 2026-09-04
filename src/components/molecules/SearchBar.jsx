import React from 'react'
import { Search, X } from 'lucide-react'

/**
 * SearchBar Molecule
 * Glassmorphic search input with clear button and smooth focus transition.
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  onClick,
  placeholder = 'Cari di G-Village...',
  autoFocus = false,
  readOnly = false,
  variant = 'glass-dark', // 'glass-dark' | 'glass-light' | 'surface'
  className = '',
}) {
  const isDark = variant === 'glass-dark'

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 transition-all duration-200 ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        isDark
          ? 'bg-white/15 border border-white/15 focus-within:bg-white/20 focus-within:border-white/30'
          : 'bg-white/80 backdrop-blur-md border border-surface-200 focus-within:border-brand shadow-brand-xs'
      } ${className}`}
    >
      <Search
        size={16}
        className={`flex-shrink-0 ${isDark ? 'text-white/70' : 'text-surface-400'}`}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className={`flex-1 text-[13px] font-medium outline-none bg-transparent ${
          isDark
            ? 'text-white placeholder-white/50'
            : 'text-surface-900 placeholder-surface-400'
        }`}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClear()
          }}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition active:scale-90 ${
            isDark ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-600'
          }`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
