import React from 'react'
import { ArrowLeft } from 'lucide-react'

/**
 * ScreenHeader Molecule
 * Standardized top bar for G-Village application screens.
 * Features consistent emerald-forest gradient, typography, action slots,
 * and support for search bar and navigation tabs.
 * 
 * @param {string | React.ReactNode} title - Screen title
 * @param {string} [subtitle] - Optional subtitle under title
 * @param {React.ReactNode} [actions] - Action buttons aligned to top-right
 * @param {Function} [onBack] - Optional back button handler
 * @param {React.ReactNode} [children] - Content inside header below title row (e.g. SearchBar, NavTabs)
 * @param {string} [className] - Additional class names
 */
export default function ScreenHeader({
  title,
  subtitle,
  actions,
  onBack,
  children,
  className = '',
}) {
  return (
    <header
      className={`flex-shrink-0 relative overflow-hidden select-none z-20 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #061A0D 0%, #0C3E1E 50%, #1B6B3A 100%)',
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-12 -end-12 w-48 h-48 rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)',
        }}
      />

      <div className="relative px-4 pt-4 pb-2 z-10">
        {/* Title Bar Row */}
        <div className="flex items-center justify-between min-h-[40px] mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <ArrowLeft size={17} className="text-white/80" />
              </button>
            )}

            <div className="min-w-0">
              {typeof title === 'string' ? (
                <h1 className="text-[20px] font-extrabold text-white tracking-tight leading-tight truncate drop-shadow-sm">
                  {title}
                </h1>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-[11.5px] font-semibold text-emerald-200/80 mt-0.5 truncate leading-none">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons slot */}
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Children slot (Search, Tabs, Summary widgets) */}
        {children && <div className="space-y-2.5 pb-1">{children}</div>}
      </div>
    </header>
  )
}
