import React from 'react';
import { Home, Plus, User } from 'lucide-react';

export type NavTab = 'beranda' | 'profil';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenUpload: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenUpload,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090214]/95 backdrop-blur-xl border-t border-purple-900/60 pb-safe">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Beranda (Home) */}
        <button
          onClick={() => onTabChange('beranda')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'beranda'
              ? 'text-yellow-400 scale-105'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          <div className="relative">
            <Home className="w-6 h-6" />
            {activeTab === 'beranda' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#facc15]" />
            )}
          </div>
          <span className="text-[11px] font-semibold mt-1">Beranda</span>
        </button>

        {/* Tombol + (Upload Video & Foto) - Elevated Center Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenUpload}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-yellow-400 p-[2px] shadow-[0_0_20px_rgba(234,179,8,0.45)] hover:shadow-[0_0_26px_rgba(234,179,8,0.7)] transition-all transform hover:scale-110 active:scale-95 group"
            title="Upload Video atau Foto Baru"
          >
            <div className="w-full h-full bg-[#120524] rounded-full flex items-center justify-center group-hover:bg-[#1a0833] transition-colors">
              <Plus className="w-8 h-8 text-yellow-400 group-hover:rotate-90 transition-transform duration-300 stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* Profil (Profile - includes Dompet / Walet inside) */}
        <button
          onClick={() => onTabChange('profil')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'profil'
              ? 'text-yellow-400 scale-105'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          <div className="relative">
            <User className="w-6 h-6" />
            {activeTab === 'profil' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#facc15]" />
            )}
          </div>
          <span className="text-[11px] font-semibold mt-1">Profil</span>
        </button>
      </div>
    </nav>
  );
};
