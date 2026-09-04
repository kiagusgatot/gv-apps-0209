import React from 'react'
import { BACKGROUND_IMAGES } from '@/assets/backgrounds'

/**
 * ScreenBackground Atom
 * Handles background image display with responsive scaling,
 * intelligent contrast scrims, and subtle depth effects.
 */
export default function ScreenBackground({
  variant = 'main',
  overlay = 'subtle',
  blur = false,
  className = '',
  children,
  contentClassName = '',
}) {
  // Clean canvas mode with no background image
  if (variant === 'clean' || variant === 'none') {
    return (
      <div className={`relative w-full h-full overflow-hidden flex flex-col bg-[#FAFBF9] ${className}`}>
        <div className={`relative z-10 flex-1 flex flex-col overflow-hidden ${contentClassName}`}>
          {children}
        </div>
      </div>
    )
  }

  const bgSrc = BACKGROUND_IMAGES[variant] || BACKGROUND_IMAGES.main

  // Overlay presets tailored for each background's contrast profile
  const getOverlayStyle = () => {
    switch (overlay) {
      case 'dark-scrim':
      case 'beranda-dark':
        // Welcome-style dark atmospheric scrim without blur, preserving background character
        return 'bg-gradient-to-b from-[#061A0D]/30 via-[#061A0D]/55 to-[#051109]/88'
      case 'light':
        return 'bg-gradient-to-b from-white/70 via-surface-50/85 to-surface-100/95'
      case 'dark':
        return 'bg-gradient-to-b from-[#061A0D]/75 via-[#0C3E1E]/55 to-[#0F1A13]/90'
      case 'glass':
        return 'bg-white/40 backdrop-blur-md'
      case 'none':
        return ''
      case 'subtle':
      default:
        // Context-aware subtle overlay
        if (variant === 'sunrise') {
          return 'bg-gradient-to-b from-[#061A0D]/25 via-[#FAFBF9]/50 to-[#FAFBF9]/92'
        }
        // main (default)
        return 'bg-gradient-to-b from-[#061A0D]/28 via-[#FAFBF9]/55 to-[#FAFBF9]/94'
    }
  }

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col ${className}`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
            blur ? 'blur-[3px] scale-105' : ''
          }`}
        />
        {/* Contrast Scrim Layer */}
        <div className={`absolute inset-0 pointer-events-none ${getOverlayStyle()}`} />
        {/* Subtle Vignette & Specular Highlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className={`relative z-10 flex-1 flex flex-col overflow-hidden ${contentClassName}`}>
        {children}
      </div>
    </div>
  )
}
