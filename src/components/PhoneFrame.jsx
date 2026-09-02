import React from 'react'

export default function PhoneFrame({ children, isOnboarding }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Device shell */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 390,
          height: 780,
          borderRadius: 44,
          background: '#fff',
          border: '8px solid #1a1a1a',
          boxShadow: '0 0 0 1px #333, 0 30px 60px rgba(0,0,0,.35), inset 0 0 0 1px #444',
        }}>

        {/* Side buttons (decorative) */}
        <div className="absolute -start-3 top-24 w-1.5 h-8 bg-gray-700 rounded-l-sm" />
        <div className="absolute -start-3 top-36 w-1.5 h-12 bg-gray-700 rounded-l-sm" />
        <div className="absolute -start-3 top-52 w-1.5 h-12 bg-gray-700 rounded-l-sm" />
        <div className="absolute -end-3 top-32 w-1.5 h-16 bg-gray-700 rounded-r-sm" />

        {/* Dynamic island */}
        <div className="absolute top-3 start-1/2 -translate-x-1/2 z-30 w-24 h-6 bg-black rounded-full" />

        {/* Status bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-8 pt-4 pb-1 z-20"
          style={{ background: isOnboarding ? '#1B6B3A' : '#1B6B3A', height: 48 }}>
          <span className="text-xs font-semibold" style={{color:'rgba(255,255,255,.9)'}}>09:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <rect x="0" y="4" width="3" height="8" rx="1" fill="rgba(255,255,255,.5)"/>
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="rgba(255,255,255,.7)"/>
              <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="rgba(255,255,255,.9)"/>
              <rect x="13.5" y="3" width="2" height="6" rx="0.5" stroke="rgba(255,255,255,.5)" strokeWidth=".8" fill="none"/>
              <rect x="14" y="4" width="1" height="4" rx="0.3" fill="rgba(255,255,255,.9)"/>
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="rgba(255,255,255,.9)">
              <path d="M7.5 2.5C5 2.5 2.8 3.5 1.2 5.1L0 3.9C2 1.5 4.6 0 7.5 0s5.5 1.5 7.5 3.9l-1.2 1.2C12.2 3.5 10 2.5 7.5 2.5z"/>
              <path d="M7.5 5.5C5.8 5.5 4.3 6.2 3.2 7.3L2 6.1C3.5 4.7 5.4 3.9 7.5 3.9s4 .8 5.5 2.2L11.8 7.3C10.7 6.2 9.2 5.5 7.5 5.5z"/>
              <circle cx="7.5" cy="10.5" r="1.5"/>
            </svg>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative" style={{background:'#fff'}}>
          {children}
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 h-6 flex items-center justify-center" style={{background:'#fff'}}>
          <div className="w-28 h-1 bg-black/20 rounded-full" />
        </div>
      </div>

      {/* Frame label */}
      <p className="text-xs text-gray-400 font-medium">390 × 780 · G-Village</p>
    </div>
  )
}
