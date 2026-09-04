import React from 'react'
import { Home, Play, ShoppingBag, Users, User } from 'lucide-react'

const TABS = [
  { id: 'beranda', label: 'Beranda', Icon: Home },
  { id: 'siaran', label: 'Media', Icon: Play },
  { id: 'pasar', label: 'ESTO', Icon: ShoppingBag },
  { id: 'komunitas', label: 'Komunitas', Icon: Users },
  { id: 'profile', label: 'Saya', Icon: User },
]

/**
 * BottomNav Organism
 * Floating modern navigation bar with glassmorphism,
 * brand gradient active indicator, and haptic spring feedback.
 */
export default function BottomNav({ active, navigate, className = '' }) {
  return (
    <nav
      className={`flex items-center justify-around px-2 py-1.5 flex-shrink-0 z-30 transition-all ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 -4px 20px rgba(15, 26, 19, 0.06), 0 -1px 2px rgba(27, 107, 58, 0.04)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id || (active && active.startsWith(id + '-'))
        return (
          <button
            key={id}
            type="button"
            onClick={() => navigate(id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 select-none ${
              isActive ? 'active:scale-95' : 'hover:bg-surface-100/50 active:scale-90'
            }`}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-brand/12 scale-105 shadow-sm'
                  : 'bg-transparent scale-100'
              }`}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.4 : 1.7}
                className="transition-colors duration-200"
                style={{ color: isActive ? '#1B6B3A' : '#8A9288' }}
              />
              {isActive && (
                <div
                  className="absolute -bottom-1 w-2 h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #1B6B3A, #4ade80)',
                    boxShadow: '0 1px 4px rgba(27, 107, 58, 0.5)',
                  }}
                />
              )}
            </div>

            <span
              className={`text-[10px] tracking-tight mt-1 transition-all duration-200 ${
                isActive ? 'font-extrabold text-brand scale-105' : 'font-medium text-surface-500'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
