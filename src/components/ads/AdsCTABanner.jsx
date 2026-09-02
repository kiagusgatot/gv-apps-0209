import React from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';

export default function AdsCTABanner({ navigate }) {
  return (
    <div className="bg-brand text-white flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(135deg, #0C3E1E, #1B6B3A)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Megaphone size={18} className="text-white" />
        </div>
        <div>
          <h4 className="text-[13px] font-bold leading-tight">Pasang Iklan Anda Sendiri di GV Media!</h4>
          <p className="text-[10px] text-white/80 mt-0.5">Jangkau ribuan penonton setiap hari. Mulai di Menu Profil &gt; Iklan Baris.</p>
        </div>
      </div>
      <button 
        onClick={() => {
          if (navigate) {
            // Need to trigger a navigation that opens Profile on the Iklan Baris tab
            navigate('profile-iklan');
          }
        }}
        className="flex-shrink-0 bg-white text-brand text-[11px] font-extrabold px-3 py-2 rounded-lg shadow-sm hover:bg-surface-50 transition-colors active:scale-95 flex items-center gap-1"
      >
        Mulai Sekarang <ArrowRight size={12} />
      </button>
    </div>
  );
}
