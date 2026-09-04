import React from 'react'

/**
 * Badge Atom
 * Visual tag indicating status, role, category, or real-time flags.
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  color,
  bgColor,
}) {
  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5 rounded-md'
      : size === 'lg'
      ? 'text-[12px] px-3 py-1 rounded-xl'
      : 'text-[11px] px-2 py-0.5 rounded-lg'

  if (variant === 'live') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-extrabold text-white uppercase tracking-wider ${sizeClasses} ${className}`}
        style={{
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
        LIVE
      </span>
    )
  }

  if (variant === 'gvplus') {
    return (
      <span
        className={`inline-flex items-center gap-0.5 font-black text-white tracking-wide ${sizeClasses} ${className}`}
        style={{
          background: 'linear-gradient(135deg, #F57F17 0%, #F9A825 50%, #FBC02D 100%)',
          boxShadow: '0 2px 8px rgba(249, 168, 37, 0.35)',
        }}
      >
        GV+
      </span>
    )
  }

  if (variant === 'persona') {
    return (
      <span
        className={`inline-flex items-center font-bold text-white shadow-sm ${sizeClasses} ${className}`}
        style={{
          background: color || '#1B6B3A',
          boxShadow: `0 2px 8px ${color || '#1B6B3A'}35`,
        }}
      >
        {children}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center font-semibold ${sizeClasses} ${className}`}
      style={{
        background: bgColor || 'rgba(27, 107, 58, 0.08)',
        color: color || '#1B6B3A',
      }}
    >
      {children}
    </span>
  )
}
