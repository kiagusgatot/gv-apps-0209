import React from 'react'
import ScreenBackground from '@/components/atoms/ScreenBackground'
import BottomNav from '@/components/BottomNav'

/**
 * AppScreenLayout Template
 * Standard phone shell template combining the background image,
 * optional sticky top header, scrollable body area, and BottomNav.
 */
export default function AppScreenLayout({
  children,
  bgVariant = 'main',
  bgOverlay = 'subtle',
  activeTab,
  navigate,
  showBottomNav = true,
  header,
  className = '',
  contentClassName = '',
}) {
  return (
    <ScreenBackground
      variant={bgVariant}
      overlay={bgOverlay}
      className={`h-full flex flex-col select-none ${className}`}
    >
      {/* Optional Header Component */}
      {header && <div className="flex-shrink-0 z-30">{header}</div>}

      {/* Main Scrollable Viewport */}
      <main className={`flex-1 overflow-y-auto no-scrollbar relative z-10 ${contentClassName}`}>
        {children}
      </main>

      {/* Persistent Floating BottomNav */}
      {showBottomNav && navigate && (
        <BottomNav active={activeTab} navigate={navigate} />
      )}
    </ScreenBackground>
  )
}
