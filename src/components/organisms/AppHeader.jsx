import React from 'react'
import { Bell, Bot, Sparkles } from 'lucide-react'

/**
 * AppHeader Organism
 * Sticky top header for the mobile app screens with persona badge,
 * dynamic time greeting, Tanya GV shortcut, and notification bell.
 */
export default function AppHeader({
  userName = 'Warga GV',
  userRole,
  userColor,
  unreadCount = 0,
  onOpenTanyaGV,
  onOpenNotif,
  greeting = 'Selamat datang',
  className = '',
}) {
  return (
    <header
      className={`px-4 pt-3 pb-2.5 flex items-center justify-between relative z-30 transition-all ${className}`}
    >
      {/* Greeting & Persona Info */}
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-semibold text-white/70 tracking-wide flex items-center gap-1">
          <span>{greeting},</span>
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <h1 className="text-[18px] font-extrabold text-white tracking-tight leading-tight truncate drop-shadow-sm">
            {userName}
          </h1>
          {userRole && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white flex-shrink-0 shadow-sm"
              style={{
                background: userColor || 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {userRole}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onOpenTanyaGV && (
          <button
            type="button"
            onClick={onOpenTanyaGV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-[0.95]"
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Bot size={14} className="text-white drop-shadow-sm" />
            <span className="text-white text-[11.5px] font-bold tracking-tight">
              Tanya GV
            </span>
          </button>
        )}

        {onOpenNotif && (
          <button
            type="button"
            onClick={onOpenNotif}
            className="w-9 h-9 rounded-xl flex items-center justify-center relative transition active:scale-[0.95]"
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Bell size={16} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-white text-[9px] font-black">{unreadCount}</span>
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
