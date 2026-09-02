import React, { useState, useEffect } from 'react';
import { useAds } from './AdsContext';
import { Megaphone, ExternalLink } from 'lucide-react';

export default function PlayerAdsBanner({ navigate }) {
  const { ads } = useAds();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Filter only 'tayang' ads and inject the static PROMO GV ad
  const activeAds = ads.filter(ad => ad.status === 'tayang');
  const promoAd = {
    id: 'promo-gv-1',
    tipe: 'PROMO GV',
    materi: 'Ingin produk Anda tampil di sini? Jangkau ribuan warga desa sekarang!',
    harga: null
  };
  const allAds = [promoAd, ...activeAds];

  useEffect(() => {
    // Rotation Logic (8s)
    let intervalId;
    if (allAds.length > 1) {
      intervalId = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % allAds.length);
      }, 8000);
    }
    
    // Cleanup
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [allAds.length]);

  if (allAds.length === 0) return null;

  const currentAd = allAds[currentAdIndex];

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (currentAd.id === 'promo-gv-1') {
      if (navigate) navigate('profile-iklan');
    } else {
      console.log(`[PlayerAdsBanner] Contacting Admin for Ad ID: ${currentAd.id}`);
      alert(`Membuka WhatsApp untuk Iklan: ${currentAd.materi.substring(0, 20)}...`);
    }
  };

  return (
    <div className="w-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex items-center gap-3">
        {/* Left UI (Badge) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold text-white tracking-widest px-1.5 py-0.5 rounded-sm ${currentAd.id === 'promo-gv-1' ? 'bg-orange-500' : 'bg-brand uppercase'}`}>
            {currentAd.id === 'promo-gv-1' ? currentAd.tipe : (currentAd.tipe === 'jual' ? 'Jual' : 'Cari')}
          </span>
        </div>
        
        {/* Center UI (Marquee Viewport) */}
        <div className="flex-1 min-w-0 overflow-hidden relative flex items-center h-5 marquee-container cursor-default">
          {/* Key reset ensures animation restarts on every ad change */}
          <p 
            key={currentAdIndex}
            className="text-[11px] font-medium text-white/90 whitespace-nowrap inline-block marquee-text w-max"
          >
            {currentAd.materi}
          </p>
        </div>

        {/* Right UI (Price & Action) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {currentAd.harga && (
            <span className="text-[11px] font-extrabold text-white">
              Rp{(currentAd.harga / 1000).toLocaleString('id-ID')}k
            </span>
          )}
          <button 
            onClick={handleActionClick}
            className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
          >
            {currentAd.id === 'promo-gv-1' ? 'Pasang Iklan' : 'Hubungi GV'} <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {/* Progress Bar for Rotation */}
      {allAds.length > 1 && (
        <div className="h-[2px] bg-white/10 w-full relative">
          {/* Key reset ensures animation perfectly restarts from 0% every ad change */}
          <div 
            key={currentAdIndex}
            className="h-full bg-brand" 
            style={{ 
              width: '100%',
              animation: 'progress 8s linear forwards',
              transformOrigin: 'left'
            }}
          />
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes marquee-run {
          0%, 15% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% + 150px)); }
        }
        .marquee-text {
          animation: marquee-run 8s linear forwards;
        }
        .marquee-container:hover .marquee-text {
          animation-play-state: paused !important;
        }
      `}} />
    </div>
  );
}
