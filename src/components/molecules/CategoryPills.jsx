import React from 'react'

const CAT_ICONS = {
  Semua: '✨',
  Sayur: '🥬',
  Buah: '🍌',
  Pangan: '🌾',
  Camilan: '🍪',
  Minuman: '☕',
  Kerajinan: '🎨',
  Lainnya: '📦',
}

/**
 * CategoryPills Molecule
 * Horizontal scrollable category chip bar for rapid product filtering in ESTO.
 */
export default function CategoryPills({
  categories = [],
  selectedCategory = 'Semua',
  onSelect,
  className = '',
}) {
  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 select-none ${className}`}
    >
      {categories.map((cat) => {
        const isSelected =
          Array.isArray(selectedCategory)
            ? cat === 'Semua'
              ? selectedCategory.length === 0
              : selectedCategory.includes(cat)
            : selectedCategory === cat

        const icon = CAT_ICONS[cat] || '🏷️'

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect?.(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] transition-all duration-150 active:scale-95 ${
              isSelected
                ? 'bg-[#1B6B3A] text-white font-extrabold shadow-xs shadow-emerald-900/20'
                : 'bg-white text-gray-700 border border-gray-200/80 font-bold hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-[12px]">{icon}</span>
            <span>{cat}</span>
          </button>
        )
      })}
    </div>
  )
}
