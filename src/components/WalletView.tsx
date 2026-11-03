import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  CreditCard, 
  TrendingUp, 
  RefreshCw, 
  ShieldCheck, 
  History, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Activity
} from 'lucide-react';
import { PiCoinIcon } from './PiCoinIcon';
import { MarketData, Transaction, UserProfile } from '../types';
import { formatIdr, formatPi } from '../utils/formatters';

interface WalletViewProps {
  userProfile: UserProfile;
  marketData: MarketData;
  transactions: Transaction[];
  onOpenSwap: () => void;
  onOpenWithdraw: () => void;
  onRefreshMarket: () => void;
  isRefreshingMarket: boolean;
}

export const WalletView: React.FC<WalletViewProps> = ({
  userProfile,
  marketData,
  transactions,
  onOpenSwap,
  onOpenWithdraw,
  onRefreshMarket,
  isRefreshingMarket,
}) => {
  const [selectedChartRange, setSelectedChartRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [activeTxFilter, setActiveTxFilter] = useState<'all' | 'watch' | 'swap' | 'withdraw'>('all');

  const totalPiValueIdr = Math.floor(userProfile.piBalance * marketData.piPriceIdr);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTxFilter === 'all') return true;
    if (activeTxFilter === 'watch') return tx.type === 'reward_watch' || tx.type === 'reward_daily' || tx.type === 'reward_upload';
    if (activeTxFilter === 'swap') return tx.type === 'swap_pi_to_idr';
    if (activeTxFilter === 'withdraw') return tx.type === 'withdraw_idr';
    return true;
  });

  // Chart data simulation points for SVG
  const chartPoints = selectedChartRange === '24h' 
    ? [690, 710, 705, 730, 725, 745, 745.8]
    : selectedChartRange === '7d'
    ? [620, 645, 630, 680, 715, 730, 745.8]
    : [510, 540, 590, 610, 650, 700, 745.8];

  const minVal = Math.min(...chartPoints);
  const maxVal = Math.max(...chartPoints);
  const range = maxVal - minVal || 1;

  // Convert to SVG points (width 320, height 80)
  const svgPoints = chartPoints
    .map((val, idx) => {
      const x = (idx / (chartPoints.length - 1)) * 320;
      const y = 70 - ((val - minVal) / range) * 55;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 pt-3 space-y-4">
      {/* Live Recent Payouts Ticker */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#1e073c] to-purple-950/70 border border-purple-800/60 rounded-xl p-2 px-3 flex items-center justify-between text-[11px] shadow-sm">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-gray-300 truncate">
            <span className="text-yellow-400 font-bold">@ahmad_pioneer</span> baru mencairkan{' '}
            <span className="text-emerald-400 font-bold">Rp 745.800</span> ke DANA
          </span>
        </div>
        <span className="text-[10px] text-purple-300 shrink-0 font-medium ml-2">1 mnt lalu</span>
      </div>

      {/* Main Wallet Cards */}
      <div className="relative bg-gradient-to-br from-[#1a0736] via-[#120427] to-[#090214] border-2 border-yellow-400/60 rounded-2xl p-5 shadow-[0_0_30px_rgba(250,204,21,0.2)] overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <PiCoinIcon size={30} animate />
            <div>
              <span className="text-[11px] font-bold text-yellow-400/90 tracking-wider uppercase">
                Dompet Pi Tube
              </span>
              <div className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-tight flex items-baseline gap-1.5">
                {userProfile.piBalance.toFixed(3)}
                <span className="text-sm font-bold text-yellow-300">Pi</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-300 block">Estimasi Nilai IDR</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400">
              {formatIdr(totalPiValueIdr)}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-purple-800/60 my-3.5 relative z-10" />

        {/* Rupiah Cash Available to Withdraw */}
        <div className="flex items-center justify-between text-xs relative z-10 mb-4 bg-black/40 rounded-xl p-2.5 border border-purple-900/60">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Saldo Rupiah Siap Ditarik</span>
            <span className="text-base font-black text-white">
              {formatIdr(userProfile.idrBalance)}
            </span>
          </div>
          <button
            onClick={onOpenWithdraw}
            disabled={userProfile.idrBalance <= 0}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-extrabold rounded-lg text-xs flex items-center gap-1 transition-all shadow-md"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Tarik Tunai</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <button
            onClick={onOpenSwap}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(250,204,21,0.35)] transition-all transform active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Tukar Pi ke Rupiah</span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="py-3 px-3 rounded-xl bg-purple-900 hover:bg-purple-800 border border-yellow-400/50 hover:border-yellow-400 text-yellow-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-yellow-400" />
            <span>Penarikan Saldo</span>
          </button>
        </div>
      </div>

      {/* Live CoinMarketCap Bursa Card */}
      <div className="bg-[#110526] border border-purple-800/80 rounded-2xl p-4 shadow-lg space-y-3">
        {/* Header with CMC logo & refresh */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400 flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-yellow-400">
                  Harga Pasar Pi di Bursa
                </h4>
                <span className="text-[9px] bg-blue-900/60 text-blue-300 border border-blue-500/40 px-1 rounded font-bold">
                  CoinMarketCap
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Data live bursa crypto global</p>
            </div>
          </div>

          <button
            onClick={onRefreshMarket}
            disabled={isRefreshingMarket}
            className="p-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 hover:text-yellow-400 transition-colors flex items-center gap-1 text-[11px]"
            title="Perbarui Harga Terkini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMarket ? 'animate-spin text-yellow-400' : ''}`} />
            <span className="hidden xs:inline">Update</span>
          </button>
        </div>

        {/* Current Rate Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-xl sm:text-2xl font-black text-yellow-400">
              {formatIdr(marketData.piPriceIdr)}
            </div>
            <span className="text-[11px] text-gray-300 font-medium">
              ≈ ${marketData.piPriceUsd.toFixed(2)} USD / Pi
            </span>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              +{marketData.change24h}% (24 Jam)
            </span>
            <span className="text-[10px] text-gray-400 block mt-1">Peringkat #{marketData.rank}</span>
          </div>
        </div>

        {/* Interactive Mini Chart */}
        <div className="pt-2">
          {/* Chart range filter buttons */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-400 font-semibold">Tren Harga Pi</span>
            <div className="flex gap-1">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedChartRange(range)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                    selectedChartRange === range
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black/50 text-gray-400 hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="bg-black/60 rounded-xl p-3 border border-purple-900/40 relative overflow-hidden">
            <svg viewBox="0 0 320 80" className="w-full h-20 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Fill area */}
              <polygon
                points={`0,75 ${svgPoints} 320,75`}
                fill="url(#chartGradient)"
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="#FACC15"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgPoints}
              />
            </svg>
            <div className="flex justify-between text-[9px] text-gray-400 mt-1">
              <span>Low: {formatIdr(marketData.low24h)}</span>
              <span className="text-yellow-400 font-bold">Harga Saat Ini: {formatIdr(marketData.piPriceIdr)}</span>
              <span>High: {formatIdr(marketData.high24h)}</span>
            </div>
          </div>
        </div>

        {/* Statistics details */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="bg-black/40 p-2 rounded-xl border border-purple-900/40">
            <span className="text-gray-400 block text-[10px]">Volume Bursa 24J</span>
            <span className="text-white font-bold">{formatIdr(marketData.volume24hIdr)}</span>
          </div>
          <div className="bg-black/40 p-2 rounded-xl border border-purple-900/40">
            <span className="text-gray-400 block text-[10px]">Kapitalisasi Pasar</span>
            <span className="text-white font-bold">{formatIdr(marketData.marketCapIdr)}</span>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi (Transaction History) */}
      <div className="bg-[#110526] border border-purple-800/80 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-yellow-400" />
            <h4 className="text-xs font-black text-yellow-400">
              Riwayat Transaksi & Saldo
            </h4>
          </div>
          <span className="text-[10px] text-purple-300">
            {filteredTransactions.length} aktivitas
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'watch', label: 'Nonton & Hadiah' },
            { id: 'swap', label: 'Tukar Pi' },
            { id: 'withdraw', label: 'Penarikan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTxFilter(tab.id as typeof activeTxFilter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                activeTxFilter === tab.id
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'bg-black/40 text-purple-300 hover:text-white border border-purple-900/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-2 pt-1">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              Belum ada transaksi di kategori ini.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-black/40 border border-purple-900/40 hover:border-purple-700/60 rounded-xl p-3 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'withdraw_idr'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : tx.type === 'swap_pi_to_idr'
                      ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {tx.type === 'withdraw_idr' ? (
                      <CreditCard className="w-4 h-4" />
                    ) : tx.type === 'swap_pi_to_idr' ? (
                      <ArrowRightLeft className="w-4 h-4" />
                    ) : (
                      <PiCoinIcon size={20} />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-tight">
                      {tx.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {tx.description}
                    </p>
                    <span className="text-[9px] text-purple-300">
                      {tx.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {tx.amountPi && (
                    <div className={`text-xs font-extrabold ${
                      tx.type === 'swap_pi_to_idr' ? 'text-gray-300' : 'text-yellow-400'
                    }`}>
                      {tx.type === 'swap_pi_to_idr' ? '-' : '+'}{formatPi(tx.amountPi)}
                    </div>
                  )}
                  {tx.amountIdr && (
                    <div className={`text-xs font-extrabold ${
                      tx.type === 'withdraw_idr' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {tx.type === 'withdraw_idr' ? '-' : '+'}{formatIdr(tx.amountIdr)}
                    </div>
                  )}
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold inline-block mt-0.5">
                    Berhasil
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
