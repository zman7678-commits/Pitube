/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Download, Share2, X, Smartphone, Sparkles } from 'lucide-react';
import { isPWAInstalled } from '../utils/pwa';

interface InstallBannerProps {
  onOpenInstall: () => void;
  onOpenShare: () => void;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({
  onOpenInstall,
  onOpenShare,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if not already in standalone PWA mode and not dismissed in this session
    const isDismissed = sessionStorage.getItem('pitube_install_banner_dismissed');
    if (!isPWAInstalled() && !isDismissed) {
      // Show after 1.5 seconds so user has first content view
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pitube_install_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 max-w-md mx-auto pointer-events-none animate-in slide-in-from-bottom-3 duration-300">
      <div className="pointer-events-auto bg-gradient-to-r from-[#210745]/95 via-[#2b0a5a]/95 to-[#1c063b]/95 border border-yellow-400/50 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2.5">
        <div 
          onClick={onOpenInstall}
          className="flex items-center gap-2.5 flex-1 cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center shrink-0 shadow font-black">
            <Smartphone className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-yellow-300 tracking-tight">
                Pasang pi Tube di HP
              </span>
              <span className="text-[9px] bg-yellow-400 text-black font-extrabold px-1.5 py-0.2 rounded-full">
                Gratis
              </span>
            </div>
            <p className="text-[10px] text-purple-200 truncate">
              Klik untuk pasang di HP & bagikan ke teman
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenInstall}
            className="px-2.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs flex items-center gap-1 transition-transform active:scale-95 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang</span>
          </button>
          
          <button
            onClick={onOpenShare}
            className="p-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-yellow-300 border border-purple-700/60 transition-colors"
            title="Sebarkan ke Teman"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 text-purple-400 hover:text-white transition-colors"
            title="Tutup banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
