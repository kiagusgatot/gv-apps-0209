import React from 'react'

/**
 * AppButton Atom
 * Highly polished CTA button with gradient backgrounds,
 * tactile spring active states, and accessibility focus rings.
 */
export default function AppButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...rest
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#1B6B3A',
          border: '1px solid rgba(27, 107, 58, 0.15)',
          boxShadow: '0 2px 8px rgba(27, 107, 58, 0.06)',
        }
      case 'glass':
        return {
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        }
      case 'outline':
        return {
          background: 'transparent',
          color: '#1B6B3A',
          border: '1.5px solid #1B6B3A',
        }
      case 'ghost':
        return {
          background: 'transparent',
          color: '#4A514A',
        }
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
        }
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #0C3E1E 0%, #1B6B3A 50%, #15803d 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(27, 107, 58, 0.28), 0 1px 3px rgba(27, 107, 58, 0.12)',
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3.5 text-[12px] font-semibold rounded-xl gap-1.5'
      case 'lg':
        return 'py-4 px-6 text-[15px] font-bold rounded-2xl gap-2.5'
      case 'md':
      default:
        return 'py-3 px-5 text-[13.5px] font-bold rounded-2xl gap-2'
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 select-none ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'active:scale-[0.97] hover:brightness-[1.04] cursor-pointer'
      } ${fullWidth ? 'w-full' : ''} ${getSizeClasses()} ${className}`}
      style={getVariantStyles()}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 18} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 18} />}
    </button>
  )
}
