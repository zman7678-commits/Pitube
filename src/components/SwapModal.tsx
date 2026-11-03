import React, { useState } from 'react';
import { X, ArrowRightLeft, Sparkles, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';
import { PiCoinIcon } from './PiCoinIcon';
import { MarketData, UserProfile } from '../types';
import { formatIdr, formatPi, playCoinSound } from '../utils/formatters';
import { fireCoinConfetti } from '../utils/confetti';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketData: MarketData;
  userProfile: UserProfile;
  onSwapSuccess: (amountPi: number, amountIdr: number) => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  marketData,
  userProfile,
  onSwapSuccess,
}) => {
  const [piAmount, setPiAmount] = useState<string>('50');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    pi: number;
    idr: number;
    rate: number;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  const numericPi = parseFloat(piAmount) || 0;
  const estimatedIdr = Math.floor(numericPi * marketData.piPriceIdr);
  const isInvalid = numericPi <= 0 || numericPi > userProfile.piBalance;

  const handleSwap = () => {
    if (isInvalid) return;

    setIsProcessing(true);

    setTimeout(() => {
      onSwapSuccess(numericPi, estimatedIdr);
      playCoinSound();
      fireCoinConfetti();

      setSuccessReceipt({
        pi: numericPi,
        idr: estimatedIdr,
        rate: marketData.piPriceIdr,
        date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      });

      setIsProcessing(false);
    }, 900);
  };

  const handleMax = () => {
    setPiAmount(userProfile.piBalance.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#110526] border border-purple-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/50 bg-[#170633]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-yellow-400 text-base leading-tight">
                Tukar Koin Pi ke Rupiah
              </h3>
              <p className="text-[11px] text-purple-300">
                Sesuai harga bursa CoinMarketCap terkini
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

        {successReceipt ? (
          /* Receipt Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-yellow-400">
                Konversi Berhasil!
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                Koin Pi kamu telah berhasil ditukarkan ke saldo Rupiah siap tarik.
              </p>
            </div>

            <div className="bg-black/50 border border-purple-800 rounded-xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Pi Ditukar:</span>
                <span className="text-yellow-400 font-bold">{formatPi(successReceipt.pi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rate CoinMarketCap:</span>
                <span className="text-white font-medium">{formatIdr(successReceipt.rate)} / Pi</span>
              </div>
              <div className="flex justify-between border-t border-purple-900/50 pt-2 text-sm font-extrabold">
                <span className="text-yellow-400">Saldo Rupiah Diterima:</span>
                <span className="text-emerald-400">{formatIdr(successReceipt.idr)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-purple-300 pt-1">
                <span>Waktu Transaksi:</span>
                <span>{successReceipt.date}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessReceipt(null);
                onClose();
              }}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-xl transition-all shadow-md text-xs sm:text-sm"
            >
              Kembali ke Walet
            </button>
          </div>
        ) : (
          /* Swap Form */
          <div className="p-5 space-y-4">
            {/* Live Exchange Rate Card */}
            <div className="bg-gradient-to-r from-purple-950 via-[#27094d] to-purple-900 border border-yellow-400/40 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-purple-300 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  HARGA PASAR COINMARKETCAP
                </div>
                <div className="text-base font-extrabold text-yellow-400 mt-0.5">
                  1 Pi = {formatIdr(marketData.piPriceIdr)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  +{marketData.change24h}% (24j)
                </span>
                <span className="text-[10px] text-gray-300 block mt-1">Bursa Resmi</span>
              </div>
            </div>

            {/* From: Pi Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-yellow-400">Jumlah Pi yang Ditukar</span>
                <span className="text-gray-300 text-[11px]">
                  Saldo: <span className="text-yellow-300 font-bold">{userProfile.piBalance.toFixed(3)} Pi</span>
                </span>
              </div>

              <div className="relative bg-black/60 border border-purple-700/80 rounded-xl p-3 flex items-center justify-between focus-within:border-yellow-400 transition-colors">
                <div className="flex items-center gap-2">
                  <PiCoinIcon size={28} />
                  <span className="font-bold text-yellow-400 text-sm">Pi Coin</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={userProfile.piBalance}
                    value={piAmount}
                    onChange={(e) => setPiAmount(e.target.value)}
                    className="w-28 text-right bg-transparent text-lg font-black text-white outline-none"
                    placeholder="0.00"
                  />
                  <button
                    type="button"
                    onClick={handleMax}
                    className="text-[10px] font-extrabold bg-purple-900 text-yellow-400 hover:bg-yellow-400 hover:text-black border border-yellow-400/50 px-2 py-1 rounded-md transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {/* Swap Divider Icon */}
            <div className="flex justify-center -my-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center shadow-lg">
                <ArrowRightLeft className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* To: IDR Output */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-yellow-400">Estimasi Rupiah Diterima</span>
                <span className="text-emerald-400 font-bold text-[11px]">Biaya Gas: Rp 0 (Gratis)</span>
              </div>

              <div className="bg-black/60 border border-purple-700/80 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center font-black text-emerald-400 text-xs">
                    Rp
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">IDR (Rupiah)</span>
                </div>
                <span className="text-lg font-black text-emerald-400">
                  {formatIdr(estimatedIdr)}
                </span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-purple-300 bg-purple-950/40 p-2.5 rounded-lg border border-purple-900/40">
              <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Konversi instan tanpa potongan. Saldo Rupiah dapat langsung ditarik ke rekening atau e-Wallet.</span>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleSwap}
              disabled={isInvalid || isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Memproses Penukaran...
                </span>
              ) : numericPi > userProfile.piBalance ? (
                'Saldo Pi Tidak Cukup'
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Konfirmasi Tukar ke Rupiah</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
