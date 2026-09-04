import React from 'react'

/**
 * GlassCard Atom
 * Modern glassmorphic surface with specular border highlight,
 * balanced shadow depth, and micro-haptic press feedback.
 */
export default function GlassCard({
  children,
  variant = 'default',
  className = '',
  onClick,
  style = {},
  ...rest
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 8px 32px rgba(15, 26, 19, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }
      case 'subtle':
        return {
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 2px 8px rgba(15, 26, 19, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        }
      case 'dark':
        return {
          background: 'rgba(15, 26, 19, 0.78)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }
      case 'interactive':
        return {
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 4px 16px rgba(27, 107, 58, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        }
      case 'default':
      default:
        return {
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 4px 20px rgba(15, 26, 19, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }
    }
  }

  const isClickable = typeof onClick === 'function'

  const Component = isClickable ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 text-left ${
        isClickable
          ? 'active:scale-[0.98] hover:shadow-brand-md cursor-pointer select-none'
          : ''
      } ${className}`}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}
