import React from 'react'
import { Home, Play, ShoppingBag, Users, User } from 'lucide-react'

const tabs = [
  { id:'beranda',   label:'Beranda', Icon:Home },
  { id:'siaran',    label:'Media',   Icon:Play },
  { id:'pasar',     label:'ESTO',    Icon:ShoppingBag },
  { id:'komunitas', label:'Komunitas',Icon:Users },
  { id:'profile',   label:'Saya',    Icon:User },
]

export default function BottomNav({ active, navigate }) {
  return (
    <nav className="flex items-end bg-white/90 backdrop-blur-xl px-2 pt-1 pb-1.5 flex-shrink-0"
      style={{boxShadow:'0 -1px 0 rgba(27,107,58,0.06), 0 -4px 16px rgba(27,107,58,0.04)'}}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button key={id} onClick={() => navigate(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1 rounded-2xl transition-all active:scale-[0.92]
              ${isActive ? '' : 'hover:bg-surface-50'}`}>
            <div className="relative flex items-center justify-center w-10 h-7 rounded-xl transition-all">
              {isActive && (
                <div className="absolute inset-0 rounded-xl"
                  style={{background:'rgba(27,107,58,0.1)'}} />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6}
                className="relative z-10 transition-colors"
                style={{color: isActive ? '#1B6B3A' : '#9CA39A'}} />
            </div>
            <span className={`text-[10px] leading-none transition-all
              ${isActive ? 'font-bold' : 'font-medium'}`}
              style={{color: isActive ? '#1B6B3A' : '#9CA39A'}}>
              {label}
            </span>
            <div className={`w-5 h-[2.5px] rounded-full mt-0.5 transition-all
              ${isActive ? 'opacity-100' : 'opacity-0'}`}
              style={{background:'linear-gradient(90deg, #1B6B3A, #22c55e)'}} />
          </button>
        )
      })}
    </nav>
  )
}
