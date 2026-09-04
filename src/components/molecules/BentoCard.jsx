import React from 'react'
import GlassCard from '@/components/atoms/GlassCard'

/**
 * BentoCard Molecule
 * Modular bento grid cell with variable aspect ratio, span, and depth.
 */
export default function BentoCard({
  children,
  colSpan = 1, // 1 | 2
  rowSpan = 1,
  variant = 'glass', // 'glass' | 'gradient' | 'white' | 'accent' | 'dark'
  gradient,
  onClick,
  className = '',
  style = {},
  ...rest
}) {
  const colSpanClass = colSpan === 2 ? 'col-span-2' : 'col-span-1'
  const rowSpanClass = rowSpan === 2 ? 'row-span-2' : 'row-span-1'

  // Only apply default p-4 if no custom padding class is provided in className
  const hasCustomPadding = /(?:^|\s)p(?:[xytrbl])?-(?:\[|\d)/.test(className)
  const paddingClass = hasCustomPadding ? '' : 'p-4'

  if (variant === 'gradient' && gradient) {
    const isClickable = typeof onClick === 'function'
    const Component = isClickable ? 'button' : 'div'
    return (
      <Component
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl text-left transition-all duration-200 ${paddingClass} ${colSpanClass} ${rowSpanClass} ${
          isClickable ? 'active:scale-[0.98] cursor-pointer hover:shadow-brand-md' : ''
        } ${className}`}
        style={{
          background: `linear-gradient(145deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
          boxShadow: `0 6px 20px ${gradient[0]}35, inset 0 1px 0 rgba(255,255,255,0.25)`,
          ...style,
        }}
        {...rest}
      >
        {/* Specular Top Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/25 pointer-events-none" />
        {children}
      </Component>
    )
  }

  const glassVariant =
    variant === 'dark'
      ? 'dark'
      : variant === 'white' || variant === 'elevated'
      ? 'elevated'
      : variant === 'subtle'
      ? 'subtle'
      : variant === 'interactive'
      ? 'interactive'
      : 'default'

  return (
    <GlassCard
      variant={glassVariant}
      onClick={onClick}
      className={`relative overflow-hidden ${paddingClass} ${colSpanClass} ${rowSpanClass} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </GlassCard>
  )
}
