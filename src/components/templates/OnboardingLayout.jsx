import React from 'react'
import { ArrowLeft } from 'lucide-react'
import ScreenBackground from '@/components/atoms/ScreenBackground'

/**
 * OnboardingLayout Template
 * Cinematic onboarding frame built upon background-sunrise-village.png.
 * Features a frosted glass header, progress indicators, and glass content container.
 */
export default function OnboardingLayout({
  children,
  currentStep, // 1 to 4
  totalSteps = 4,
  title,
  subtitle,
  onBack,
  footer,
  className = '',
  contentClassName = '',
}) {
  return (
    <ScreenBackground
      variant="sunrise"
      overlay="subtle"
      className={`h-full flex flex-col justify-between ${className}`}
    >
      {/* Header with Progress & Back button */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 z-20">
        <div className="flex items-center justify-between mb-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-90"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              <ArrowLeft size={18} className="text-white drop-shadow-sm" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          {currentStep && (
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
              style={{
                background: 'rgba(6, 26, 13, 0.35)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Langkah {currentStep} dari {totalSteps}
            </span>
          )}
        </div>

        {/* Step Progress Bar */}
        {currentStep && (
          <div className="flex gap-1.5 my-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full flex-1 overflow-hidden transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: i < currentStep ? '100%' : '0%',
                    background: 'linear-gradient(90deg, #22c55e, #86efac)',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Optional Title and Subtitle */}
        {title && (
          <div className="mt-2 text-white">
            <h1 className="text-[22px] font-extrabold tracking-tight leading-tight drop-shadow-md headline-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[12.5px] text-white/80 font-medium leading-normal mt-0.5 drop-shadow-sm">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Glass Content Card */}
      <div
        className={`flex-1 mx-3 mb-3 rounded-3xl overflow-hidden flex flex-col z-20 transition-all duration-300 ${contentClassName}`}
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(15, 26, 19, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col">
          {children}
        </div>

        {/* Optional Sticky Footer Button Area */}
        {footer && (
          <div className="p-4 pt-3 border-t border-surface-200/70 bg-white/70 backdrop-blur-md">
            {footer}
          </div>
        )}
      </div>
    </ScreenBackground>
  )
}
