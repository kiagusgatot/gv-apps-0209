import React from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * SectionHeader Molecule
 * Section title row with optional subtitle, icon, badge, and navigation CTA.
 */
export default function SectionHeader({
  title,
  subtitle,
  actionLabel = 'Lihat Semua',
  actionIcon: ActionIcon = ChevronRight,
  actionVariant = 'link',
  actionClassName = '',
  onAction,
  to,
  navigate,
  icon: Icon,
  badge,
  className = '',
}) {
  const handleClick = () => {
    if (onAction) onAction()
    else if (to && navigate) navigate(to)
  }

  const hasAction = Boolean(onAction || (to && navigate))

  const actionStyle =
    actionVariant === 'chip'
      ? `flex items-center gap-1 text-[11.5px] font-bold text-gray-700 bg-white border border-gray-200/90 shadow-2xs hover:bg-gray-50 px-2.5 py-1 rounded-xl transition active:scale-95 flex-shrink-0 ${actionClassName}`
      : `flex items-center gap-0.5 text-[11.5px] font-bold text-brand hover:text-brand-700 transition active:scale-95 flex-shrink-0 py-0.5 ${actionClassName}`

  return (
    <div className={`flex items-end justify-between gap-2 mb-2.5 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 text-brand">
            <Icon size={14} />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-extrabold text-surface-900 tracking-tight leading-tight">
              {title}
            </h2>
            {badge && <span className="flex-shrink-0">{badge}</span>}
          </div>
          {subtitle && (
            <p className="text-[11.5px] text-surface-500 font-medium leading-none mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {hasAction && (
        <button type="button" onClick={handleClick} className={actionStyle}>
          <span>{actionLabel}</span>
          {ActionIcon && <ActionIcon size={12} className="opacity-80 flex-shrink-0" />}
        </button>
      )}
    </div>
  )
}
