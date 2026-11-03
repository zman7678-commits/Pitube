import React from 'react';
import { PiCoinIcon } from './PiCoinIcon';
import { MarketData, UserProfile } from '../types';
import { Sparkles, TrendingUp, Smartphone, Share2 } from 'lucide-react';

interface NavbarProps {
  marketData: MarketData;
  userProfile: UserProfile;
  onOpenWallet: () => void;
  onOpenDailyModal: () => void;
  onOpenRegister?: () => void;
  onOpenInstallShare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  marketData,
  userProfile,
  onOpenWallet,
  onOpenDailyModal,
  onOpenRegister,
  onOpenInstallShare,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0217]/90 backdrop-blur-md border-b border-purple-900/40 px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Simple Clean Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <PiCoinIcon size={30} />
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tracking-tight text-yellow-400">
              pi<span className="text-white">Tube</span>
            </span>
          </div>
        </div>

        {/* Unified Clean Dompet & Kurs Pill */}
        <div className="flex items-center gap-2">
          {/* Quick Daftar button if not registered */}
          {!userProfile.isRegistered && onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-2.5 py-1 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-black shadow transition-transform active:scale-95"
            >
              Daftar
            </button>
          )}

          {/* Daily bonus shortcut - only if not claimed and registered */}
          {!userProfile.dailyCheckedIn && (
            <button
              onClick={onOpenDailyModal}
              className="flex items-center gap-1 bg-purple-900/80 hover:bg-purple-800 text-yellow-300 border border-yellow-400/50 text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse transition-transform active:scale-95"
              title="Klaim bonus harian"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>+0.1 Pi</span>
            </button>
          )}

          {/* Download & Share App Button */}
          {onOpenInstallShare && (
            <button
              onClick={onOpenInstallShare}
              className="flex items-center gap-1 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 px-2 py-1 rounded-full text-xs font-bold transition-transform active:scale-95"
              title="Download & Pasang di HP / Sebarkan ke Teman"
            >
              <Smartphone className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline text-[11px]">Pasang</span>
            </button>
          )}

          {/* Unified Wallet button with live price */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 bg-[#170630] hover:bg-[#230948] border border-purple-700/60 hover:border-yellow-400/80 pl-2.5 pr-3 py-1 rounded-full transition-all group"
            title="Buka Dompet Pi"
          >
            <PiCoinIcon size={18} />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-yellow-300 group-hover:text-yellow-200 leading-tight">
                {userProfile.piBalance.toFixed(4)} Pi
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold leading-tight flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5 inline" />
                Rp {marketData.piPriceIdr.toLocaleString('id-ID')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
