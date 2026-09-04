import React from 'react'

/**
 * NavTabs Molecule
 * Unified tab bar component supporting both header underline style and segmented capsule style.
 * 
 * @param {Array} tabs - Array of tab items: [{ id: string, label: string, count?: number, badge?: string }]
 * @param {string} activeTab - ID of the currently selected tab
 * @param {Function} onChange - Callback invoked with selected tab ID
 * @param {'underline-dark' | 'segmented' | 'underline-light'} variant - Tab visual style
 * @param {string} className - Additional CSS class names
 */
export default function NavTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline-dark',
  className = '',
}) {
  if (variant === 'segmented') {
    return (
      <div
        className={`flex rounded-xl p-1 select-none ${className}`}
        style={{
          background: 'rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-[12px] font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                isActive
                  ? 'bg-white text-[#1B6B3A] shadow-sm font-extrabold'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#1B6B3A]/15 text-[#1B6B3A]' : 'bg-white/20 text-white'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'segmented-light') {
    return (
      <div
        className={`flex rounded-xl p-1 select-none bg-surface-100 border border-surface-200/80 ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-[12px] font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                isActive
                  ? 'bg-white text-[#1B6B3A] shadow-xs font-extrabold'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#1B6B3A]/10 text-[#1B6B3A]' : 'bg-surface-200 text-surface-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'underline-light') {
    return (
      <div className={`flex border-b border-surface-200 select-none ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex-1 py-3 text-[13px] font-bold text-center border-b-[2.5px] transition-all duration-150 flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'border-brand text-brand font-extrabold'
                  : 'border-transparent text-surface-400 hover:text-surface-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-brand/10 text-brand' : 'bg-surface-200 text-surface-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Default: 'underline-dark' for green header bars
  const isFullWidth = tabs.length <= 4

  return (
    <div
      className={`flex items-center select-none ${
        isFullWidth ? 'w-full' : 'overflow-x-auto no-scrollbar gap-1'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`${
              isFullWidth ? 'flex-1 min-w-0' : 'flex-shrink-0 px-3.5'
            } py-2 text-[13px] font-bold transition-all duration-150 flex items-center justify-center relative text-center active:scale-[0.98] ${
              isActive ? 'text-white font-extrabold' : 'text-white/55 hover:text-white/85'
            }`}
          >
            <span className="relative inline-flex items-center justify-center gap-1.5 pb-2">
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[9.5px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {/* Active underline pill indicator */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white rounded-full shadow-sm" />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
