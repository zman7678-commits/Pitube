import React from 'react';
import { X, Sparkles, CheckCircle2, Calendar, Gift } from 'lucide-react';
import { PiCoinIcon } from './PiCoinIcon';
import { UserProfile } from '../types';
import { playCoinSound } from '../utils/formatters';
import { fireCoinConfetti } from '../utils/confetti';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onClaimDaily: (amountPi: number) => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onClaimDaily,
}) => {
  if (!isOpen) return null;

  // Daily check-in: 1x per day, exactly 0.1 Pi per check-in
  const days = [
    { day: 1, pi: 0.1, label: 'Hari 1' },
    { day: 2, pi: 0.1, label: 'Hari 2' },
    { day: 3, pi: 0.1, label: 'Hari 3', isToday: true },
    { day: 4, pi: 0.1, label: 'Hari 4' },
    { day: 5, pi: 0.1, label: 'Hari 5' },
    { day: 6, pi: 0.1, label: 'Hari 6' },
    { day: 7, pi: 0.1, label: 'Hari 7' }
  ];

  const handleClaim = () => {
    if (userProfile.dailyCheckedIn) return;
    onClaimDaily(0.1);
    playCoinSound();
    fireCoinConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#120528] border border-purple-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/50 bg-[#180733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-yellow-400 text-base leading-tight">
                Check-In Harian Pioneer
              </h3>
              <p className="text-[11px] text-purple-300">
                1 hari 1 kali klaim sebesar 0.1 Pi coin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Daily Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-[#26084a] to-purple-950 border border-yellow-400/40 rounded-xl p-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-yellow-400/20 border border-yellow-400 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-yellow-400 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-black text-yellow-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Klaim Harian: 0.1 Pi / Hari
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5">
                Buka aplikasi pi Tube setiap hari untuk mengumpulkan koin Pi secara konsisten.
              </p>
            </div>
          </div>

          {/* 7-Days Calendar Grid */}
          <div className="grid grid-cols-4 gap-2">
            {days.map((item, index) => {
              const isPast = index < 2;
              const isToday = item.isToday;
              const isClaimedToday = isToday && userProfile.dailyCheckedIn;

              return (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center relative transition-all ${
                    isClaimedToday || isPast
                      ? 'bg-purple-950/40 border-purple-800/40 opacity-70'
                      : isToday
                      ? 'bg-purple-900/80 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)] scale-102'
                      : 'bg-black/40 border-purple-900/50'
                  }`}
                >
                  <span className="text-[10px] font-bold text-gray-300 mb-1">
                    {item.label}
                  </span>
                  <PiCoinIcon size={18} />
                  <span className={`text-[11px] font-black mt-1 ${
                    isToday ? 'text-yellow-400' : 'text-gray-200'
                  }`}>
                    +{item.pi} Pi
                  </span>

                  {(isPast || isClaimedToday) && (
                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={handleClaim}
            disabled={userProfile.dailyCheckedIn}
            className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              userProfile.dailyCheckedIn
                ? 'bg-purple-900/40 text-purple-300 border border-purple-800/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)] transform active:scale-95'
            }`}
          >
            {userProfile.dailyCheckedIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sudah Diklaim Hari Ini (0.1 Pi)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Klaim 0.1 Pi Hari Ini</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
