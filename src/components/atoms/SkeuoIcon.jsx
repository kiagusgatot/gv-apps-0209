import React from 'react'

/**
 * SkeuoIcon / TactileIcon Atom (Option A: Modern Tactile Squircle)
 * Inspired by modern macOS/VisionOS/iOS tactile layered iconography.
 * Features a clean satin multi-stop gradient squircle, delicate top rim highlight,
 * soft ambient colored contact shadow, and an elevated floating glyph with subtle depth.
 *
 * @param {React.ComponentType} icon - Lucide icon component
 * @param {Array<string>} [gradient] - 2-stop gradient colors [top, bottom]
 * @param {'xs' | 'sm' | 'md' | 'lg'} [size='md'] - Icon container size
 * @param {'squircle' | 'circle'} [shape='squircle'] - Container curvature
 * @param {string} [glowColor] - Optional ambient color for the drop shadow
 * @param {number} [strokeWidth=2.3] - Icon stroke width
 * @param {string} [className] - Additional class names
 * @param {string} [iconClassName] - Additional class names for the icon glyph
 */
export default function SkeuoIcon({
  icon: Icon,
  gradient = ['#1B5E20', '#2E7D32'],
  size = 'md',
  shape = 'squircle',
  glowColor,
  strokeWidth = 2.3,
  className = '',
  iconClassName = '',
}) {
  const sizeMap = {
    xs: { box: 'w-8 h-8', radius: shape === 'circle' ? 'rounded-full' : 'rounded-[11px]', iconSize: 15 },
    sm: { box: 'w-10 h-10', radius: shape === 'circle' ? 'rounded-full' : 'rounded-[13px]', iconSize: 18 },
    md: { box: 'w-12 h-12', radius: shape === 'circle' ? 'rounded-full' : 'rounded-[16px]', iconSize: 22 },
    lg: { box: 'w-14 h-14', radius: shape === 'circle' ? 'rounded-full' : 'rounded-[19px]', iconSize: 26 },
  }

  const currentSize = sizeMap[size] || sizeMap.md

  // Extract base colors for gradient
  const color1 = gradient[0] || '#1B5E20'
  const color2 = gradient[1] || '#2E7D32'
  const shadowGlow = glowColor || `${color1}40`

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 select-none overflow-hidden transition-all duration-200 group-hover:scale-[1.04] active:scale-[0.93] active:translate-y-[1px] ${currentSize.box} ${currentSize.radius} ${className}`}
      style={{
        background: `linear-gradient(150deg, ${color1} 0%, ${color2} 100%)`,
        border: '1px solid rgba(255, 255, 255, 0.24)',
        boxShadow: `
          inset 0 1px 1px rgba(255, 255, 255, 0.45),
          inset 0 -1px 1.5px rgba(0, 0, 0, 0.15),
          0 5px 14px -2px ${shadowGlow},
          0 2px 5px -1px rgba(0, 0, 0, 0.12)
        `,
      }}
    >
      {/* ── Elevated Floating 3D Glyph with Soft Ambient Depth ── */}
      {Icon && (
        <div
          className="relative z-10 flex items-center justify-center transition-transform"
          style={{
            filter: 'drop-shadow(0 2px 3.5px rgba(0, 0, 0, 0.26)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.14))',
          }}
        >
          <Icon
            size={currentSize.iconSize}
            className={`text-white ${iconClassName}`}
            strokeWidth={strokeWidth}
          />
        </div>
      )}
    </div>
  )
}

// Named alias for clean modern semantics
export { SkeuoIcon as TactileIcon }
