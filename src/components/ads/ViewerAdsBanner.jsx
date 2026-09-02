import React, { useState, useEffect } from 'react';
import { useAds } from './AdsContext';
import { Megaphone, ExternalLink, MessageCircle } from 'lucide-react';

export default function ViewerAdsBanner() {
  const { ads } = useAds();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Filter only 'tayang' ads
  const activeAds = ads.filter(ad => ad.status === 'tayang');

  useEffect(() => {
    // Rotation Logic (8s)
    let intervalId;
    if (activeAds.length > 1 && isVisible) {
      intervalId = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
      }, 8000);
    }
    
    // Cleanup
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeAds.length, isVisible]);

  useEffect(() => {
    // Visibility constraint: Render only in portrait
    const mql = window.matchMedia('(orientation: portrait)');
    
    const handleOrientationChange = (e) => {
      setIsVisible(e.matches);
    };

    // Initial check
    setIsVisible(mql.matches);

    // Listen for changes
    if (mql.addEventListener) {
      mql.addEventListener('change', handleOrientationChange);
    } else {
      // Fallback for older browsers
      mql.addListener(handleOrientationChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleOrientationChange);
      } else {
        mql.removeListener(handleOrientationChange);
      }
    };
  }, []);

  if (!isVisible || activeAds.length === 0) return null;

  const currentAd = activeAds[currentAdIndex];

  const handleActionClick = () => {
    // Mock action to contact admin passing ad ID
    console.log(`[AdsBanner] Contacting Admin for Ad ID: ${currentAd.id}`);
    alert(`Membuka WhatsApp untuk Iklan: ${currentAd.materi.substring(0, 20)}...`);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div 
        onClick={handleActionClick}
        className="bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl p-3 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:bg-brand/20 transition-colors">
          <Megaphone size={20} className="text-brand relative z-10 animate-pulse" />
          <div className="absolute inset-0 bg-brand/5 rotate-12 scale-150 transform transition-transform group-hover:rotate-45" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-0.5">
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1">
              {currentAd.tipe === 'jual' ? 'Dijual' : 'Dicari'}
              <span className="w-1 h-1 rounded-full bg-brand inline-block" />
              {currentAd.jangkauan === 'lokal' ? currentAd.lokasi : 'Nasional'}
            </p>
            {currentAd.harga && (
              <span className="text-[11px] font-extrabold text-surface-900">
                Rp{(currentAd.harga / 1000).toLocaleString('id-ID')}k
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-surface-800 line-clamp-1">
            {currentAd.materi}
          </p>
        </div>

        <button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
          <MessageCircle size={14} />
        </button>
      </div>

      {/* Progress Bar for Rotation */}
      {activeAds.length > 1 && (
        <div className="absolute -bottom-1.5 left-6 right-6 h-1 bg-surface-200/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-brand/80 rounded-full" 
            style={{ 
              width: '100%',
              animation: 'progress 8s linear infinite',
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
      `}} />
    </div>
  );
}
