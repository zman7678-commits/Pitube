import React, { useState } from 'react';
import { 
  BadgeCheck, 
  Copy, 
  Check, 
  Share2, 
  Heart, 
  Video, 
  Wallet, 
  HelpCircle, 
  CreditCard,
  ArrowRightLeft,
  TrendingUp,
  History,
  Users,
  PlaySquare,
  Gift,
  RefreshCw,
  Settings,
  Trash2,
  Smartphone,
  Download,
  QrCode
} from 'lucide-react';
import { MediaPost, MarketData, Transaction, UserProfile } from '../types';
import { PiCoinIcon } from './PiCoinIcon';
import { formatCompactNumber, formatIdr, formatPi } from '../utils/formatters';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
  userProfile: UserProfile;
  posts: MediaPost[];
  marketData: MarketData;
  transactions: Transaction[];
  initialSubTab?: 'wallet' | 'content' | 'referral';
  onOpenDailyModal: () => void;
  onOpenSwap: () => void;
  onOpenWithdraw: () => void;
  onRefreshMarket: () => void;
  isRefreshingMarket: boolean;
  onOpenRegister: () => void;
  onSaveProfile: (updatedData: { name: string; avatar: string; bio: string }) => void;
  onDeletePost: (postId: string) => void;
  onOpenInstallShare?: (tab?: 'install' | 'share') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  posts,
  marketData,
  transactions,
  initialSubTab = 'wallet',
  onOpenDailyModal,
  onOpenSwap,
  onOpenWithdraw,
  onRefreshMarket,
  isRefreshingMarket,
  onOpenRegister,
  onSaveProfile,
  onDeletePost,
  onOpenInstallShare,
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'content' | 'referral'>('wallet');
  const [contentSubFilter, setContentSubFilter] = useState<'my' | 'liked'>('my');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Real market value
  const totalPiValueIdr = Math.floor(userProfile.piBalance * marketData.piPriceIdr);

  // Content
  const myPosts = posts.filter(p => p.creator.handle === userProfile.handle);
  const likedPosts = posts.filter(p => p.isLiked);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(userProfile.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(userProfile.piWalletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleShareReferral = () => {
    const text = `Gabung di pi Tube bersama saya! Nonton video dapat Pi Coin yang bisa langsung ditukar ke Rupiah di bursa CoinMarketCap (Rp ${marketData.piPriceIdr.toLocaleString('id-ID')}/Pi). Kode undangan: ${userProfile.referralCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto pb-24 px-4 pt-3 space-y-3.5">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-b from-[#1b0838] to-[#0f0422] border border-purple-800/80 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-13 h-13 rounded-full object-cover border-2 border-yellow-400 shadow"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-1 -right-1 bg-yellow-400 hover:bg-yellow-300 text-black p-1 rounded-full shadow transition-transform active:scale-90"
                title="Edit foto dan nama pengguna"
              >
                <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-yellow-400">
                  {userProfile.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-purple-300 font-medium">
                  {userProfile.handle}
                </span>
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                  <BadgeCheck className="w-3 h-3 inline" />
                  KYC Verified
                </span>
                {userProfile.phone && (
                  <span className="text-[10px] text-yellow-300/80 font-mono">
                    📱 {userProfile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Daily bonus shortcut */}
          <button
            onClick={onOpenDailyModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 border transition-all ${
              userProfile.dailyCheckedIn
                ? 'bg-purple-950 text-purple-300 border-purple-800/60'
                : 'bg-yellow-400 text-black border-yellow-300 shadow-md animate-pulse'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>{userProfile.dailyCheckedIn ? 'Klaim OK' : '+0.1 Pi'}</span>
          </button>
        </div>

        {/* 2 Clean Stats */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-purple-900/50 text-center text-xs">
          <div className="bg-black/30 p-1.5 rounded-xl border border-purple-900/30">
            <span className="font-black text-yellow-400">{userProfile.totalWatchedCount} Video</span>
            <span className="text-[10px] text-gray-400 block">Total Ditonton</span>
          </div>
          <div className="bg-black/30 p-1.5 rounded-xl border border-purple-900/30">
            <span className="font-black text-yellow-400">{formatCompactNumber(userProfile.followersCount)}</span>
            <span className="text-[10px] text-gray-400 block">Pengikut</span>
          </div>
        </div>
      </div>

      {/* Smartphone Download & Share Banner */}
      {onOpenInstallShare && (
        <div className="bg-gradient-to-r from-[#220745] via-[#2f0b60] to-[#1a0536] border border-yellow-400/50 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-2 bg-yellow-400/20 text-yellow-400 rounded-xl shrink-0 border border-yellow-400/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-black text-yellow-300 truncate">
                Download & Sebarkan Aplikasi
              </h4>
              <p className="text-[10px] text-purple-200 truncate">
                Pasang di HP teman (PWA) & bagikan link/QR
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onOpenInstallShare('install')}
              className="px-2.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-black flex items-center gap-1 shadow transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
            <button
              onClick={() => onOpenInstallShare('share')}
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-700/60 text-yellow-300 text-[11px] font-black flex items-center gap-1 transition-transform active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      )}

      {/* 3 Unified Tabs (Simple, Clean, Minimal) */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#120426] p-1.5 rounded-xl border border-purple-900/60 text-xs">
        <button
          onClick={() => setActiveTab('wallet')}
          className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'wallet'
              ? 'bg-yellow-400 text-black shadow-md'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Dompet</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'content'
              ? 'bg-yellow-400 text-black shadow-md'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Konten</span>
        </button>

        <button
          onClick={() => setActiveTab('referral')}
          className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'referral'
              ? 'bg-yellow-400 text-black shadow-md'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Referral</span>
        </button>
      </div>

      {/* 1. DOMPET: Unified Balances, Live Rate & Actions */}
      {activeTab === 'wallet' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* Main Financial Card */}
          <div className="bg-gradient-to-br from-[#1a0736] via-[#120427] to-[#090214] border-2 border-yellow-400/60 rounded-2xl p-4 shadow-lg space-y-3">
            {/* Balances side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pi Balance */}
              <div className="bg-black/40 border border-purple-800/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <PiCoinIcon size={18} />
                  <span className="text-[10px] font-bold text-yellow-400 uppercase">Saldo Pi</span>
                </div>
                <div className="text-xl font-black text-yellow-400">
                  {userProfile.piBalance.toFixed(4)}
                </div>
                <span className="text-[10px] text-gray-300">
                  ≈ {formatIdr(totalPiValueIdr)}
                </span>
              </div>

              {/* Rupiah Cash */}
              <div className="bg-black/40 border border-purple-800/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center justify-center">
                    Rp
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Saldo Rupiah</span>
                </div>
                <div className="text-xl font-black text-white">
                  {formatIdr(userProfile.idrBalance)}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Siap dicairkan
                </span>
              </div>
            </div>

            {/* Live CoinMarketCap Price Strip */}
            <div className="bg-black/50 border border-purple-900/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Harga Nyata Bursa (CMC)</span>
                  <span className="text-xs font-black text-yellow-400">
                    1 Pi = {formatIdr(marketData.piPriceIdr)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  +{marketData.change24h}%
                </span>
                <button
                  onClick={onRefreshMarket}
                  disabled={isRefreshingMarket}
                  className="p-1 rounded-md bg-purple-900/60 text-purple-300 hover:text-yellow-400 transition-colors"
                  title="Perbarui kurs bursa"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMarket ? 'animate-spin text-yellow-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* 2 Clear Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={onOpenSwap}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Tukar ke Rupiah</span>
              </button>

              <button
                onClick={onOpenWithdraw}
                disabled={userProfile.idrBalance <= 0}
                className="py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-800 disabled:opacity-40 border border-yellow-400/60 text-yellow-300 font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                <span>Tarik ke DANA / Bank</span>
              </button>
            </div>
          </div>

          {/* Riwayat Transaksi - Clean List */}
          <div className="bg-[#110526] border border-purple-800/70 rounded-2xl p-4 shadow space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-yellow-400" />
                <h4 className="text-xs font-black text-yellow-400">Riwayat Transaksi</h4>
              </div>
              <span className="text-[10px] text-gray-400">{transactions.length} aktivitas</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin">
              {transactions.slice(0, 8).map((tx) => (
                <div
                  key={tx.id}
                  className="bg-black/40 border border-purple-900/40 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-950 flex items-center justify-center shrink-0 text-yellow-400">
                      {tx.type === 'withdraw_idr' ? (
                        <CreditCard className="w-3.5 h-3.5 text-red-400" />
                      ) : tx.type === 'swap_pi_to_idr' ? (
                        <ArrowRightLeft className="w-3.5 h-3.5 text-yellow-400" />
                      ) : (
                        <PiCoinIcon size={16} />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-[11px] leading-tight">{tx.title}</h5>
                      <span className="text-[9px] text-gray-400">{tx.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {tx.amountPi && (
                      <span className={`text-[11px] font-black block ${
                        tx.type === 'swap_pi_to_idr' ? 'text-gray-300' : 'text-yellow-400'
                      }`}>
                        {tx.type === 'swap_pi_to_idr' ? '-' : '+'}{formatPi(tx.amountPi)}
                      </span>
                    )}
                    {tx.amountIdr && (
                      <span className={`text-[11px] font-black block ${
                        tx.type === 'withdraw_idr' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {tx.type === 'withdraw_idr' ? '-' : '+'}{formatIdr(tx.amountIdr)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. KONTEN: Video Saya & Disukai Digabung Menjadi Satu */}
      {activeTab === 'content' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Sub-toggle: Video Saya vs Disukai */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-purple-900/50 text-xs">
            <button
              onClick={() => setContentSubFilter('my')}
              className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                contentSubFilter === 'my'
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Unggahan Saya ({myPosts.length})</span>
            </button>
            <button
              onClick={() => setContentSubFilter('liked')}
              className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                contentSubFilter === 'liked'
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Disukai ({likedPosts.length})</span>
            </button>
          </div>

          {/* Content List */}
          {contentSubFilter === 'my' ? (
            myPosts.length === 0 ? (
              <div className="bg-[#120526] border border-purple-900/60 rounded-xl p-8 text-center text-gray-400 text-xs">
                <PlaySquare className="w-9 h-9 mx-auto text-purple-600 mb-2" />
                <p>Belum ada video atau foto yang diunggah.</p>
                <p className="text-[11px] text-yellow-400 mt-1">Gunakan tombol + di bawah untuk mulai unggah!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {myPosts.map((post) => (
                  <div key={post.id} className="bg-[#120526] border border-purple-800 rounded-xl overflow-hidden shadow group">
                    <div className="relative aspect-video bg-black flex items-center justify-center">
                      {post.type === 'video' ? (
                        <video src={post.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={post.url} alt={post.title} className="w-full h-full object-cover" />
                      )}
                      <span className="absolute top-1 left-1 bg-black/70 text-yellow-400 text-[8px] px-1 py-0.2 rounded font-bold uppercase">
                        {post.type}
                      </span>
                      {/* Delete button for user's permanent uploads */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Hapus "${post.title}" secara permanen dari pi Tube?`)) {
                            onDeletePost(post.id);
                          }
                        }}
                        className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 p-1 rounded text-red-400 hover:text-white transition-colors"
                        title="Hapus konten ini secara permanen"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-2">
                      <h5 className="text-[11px] font-bold text-white truncate">{post.title}</h5>
                      <div className="flex items-center justify-between mt-0.5 text-[10px]">
                        <span className="text-yellow-400">❤️ {post.likes} suka</span>
                        <span className="text-[9px] text-gray-400">Permanen</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            likedPosts.length === 0 ? (
              <div className="bg-[#120526] border border-purple-900/60 rounded-xl p-8 text-center text-gray-400 text-xs">
                <Heart className="w-9 h-9 mx-auto text-purple-600 mb-2" />
                <p>Belum ada video yang disukai.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {likedPosts.map((post) => (
                  <div key={post.id} className="bg-[#120526] border border-purple-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-10 h-10 rounded-lg bg-black shrink-0 overflow-hidden border border-purple-700">
                        {post.type === 'video' ? (
                          <video src={post.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={post.url} alt={post.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="truncate">
                        <h5 className="font-bold text-yellow-300 truncate text-[11px]">{post.title}</h5>
                        <span className="text-[10px] text-gray-400">{post.creator.name}</span>
                      </div>
                    </div>
                    <span className="text-pink-500 font-bold shrink-0 flex items-center gap-1 text-[11px]">
                      <Heart className="w-3 h-3 fill-current" />
                      {formatCompactNumber(post.likes)}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* 3. REFERRAL & PANDUAN: Digabung Menjadi Satu */}
      {activeTab === 'referral' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* Referral Card */}
          <div className="bg-gradient-to-r from-purple-950 via-[#26074b] to-purple-950 border border-yellow-400/50 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <PiCoinIcon size={24} />
              <div>
                <h4 className="text-xs font-black text-yellow-400">Undang Teman Pioneer</h4>
                <p className="text-[10px] text-gray-300">Dapatkan bonus +10 Pi tiap teman yang bergabung!</p>
              </div>
            </div>

            <div className="bg-black/60 border border-yellow-400/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="font-mono font-black text-yellow-300 tracking-wider">
                {userProfile.referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-black text-[11px] font-black rounded-lg flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleShareReferral}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {onOpenInstallShare && (
                <button
                  onClick={() => onOpenInstallShare('share')}
                  className="py-2 px-3 bg-purple-900 hover:bg-purple-800 text-yellow-300 border border-yellow-400/40 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
                >
                  <QrCode className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Kode QR</span>
                </button>
              )}
            </div>

            {onOpenInstallShare && (
              <button
                onClick={() => onOpenInstallShare('install')}
                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-400 hover:brightness-105 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <Smartphone className="w-4 h-4" />
                <span>Panduan Pasang di HP Teman (Android & iPhone)</span>
              </button>
            )}
          </div>

          {/* Simple FAQ Accordion */}
          <div className="bg-[#120526] border border-purple-800 rounded-xl p-3.5 space-y-2 text-xs">
            <h5 className="font-bold text-yellow-400 text-xs flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Panduan Cepat pi Tube
            </h5>
            <div className="space-y-1.5 text-[11px] text-gray-300 leading-relaxed">
              <p>
                • <strong>Nonton Video:</strong> Cukup putar video di Beranda. Indikator koin mengisi otomatis tiap 10 detik.
              </p>
              <p>
                • <strong>Harga Pasar Nyata:</strong> Nilai 1 Pi diperbarui langsung sesuai harga CoinMarketCap (Rp {marketData.piPriceIdr.toLocaleString('id-ID')}).
              </p>
              <p>
                • <strong>Tarik ke Rupiah:</strong> Klik menu Dompet &gt; Tukar ke Rupiah &gt; Tarik ke DANA atau transfer bank.
              </p>
            </div>
          </div>

          {/* New User Registration Button */}
          <button
            onClick={onOpenRegister}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 border border-yellow-400/60 text-yellow-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
          >
            <span>📱 Daftar Pengguna Baru (No HP & OTP)</span>
          </button>
        </div>
      )}

      {/* Edit Profile Modal (Gigi Roda) */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={onSaveProfile}
      />
    </div>
  );
};
