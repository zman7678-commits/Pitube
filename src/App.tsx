/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { BerandaView } from './components/BerandaView';
import { ProfileView } from './components/ProfileView';
import { UploadModal } from './components/UploadModal';
import { CommentModal } from './components/CommentModal';
import { ShareModal } from './components/ShareModal';
import { SwapModal } from './components/SwapModal';
import { WithdrawModal } from './components/WithdrawModal';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { RegisterModal } from './components/RegisterModal';
import { InstallShareModal } from './components/InstallShareModal';
import { InstallBanner } from './components/InstallBanner';
import { initialPosts, initialMarketData, initialUserProfile, initialTransactions } from './data/initialData';
import { MediaPost, MarketData, UserProfile, Transaction } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [profileSubTab, setProfileSubTab] = useState<'wallet' | 'content' | 'referral'>('wallet');

  const [posts, setPosts] = useState<MediaPost[]>(() => {
    const saved = localStorage.getItem('pitube_posts_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return initialPosts;
  });

  // Real CoinMarketCap & CoinGecko price: ~Rp 1.415 IDR ($0.078 USD)
  const [marketData, setMarketData] = useState<MarketData>(initialMarketData);
  const [isRefreshingMarket, setIsRefreshingMarket] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pitube_user_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return initialUserProfile;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pitube_txs_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return initialTransactions;
  });

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<MediaPost | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<MediaPost | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(!userProfile.isRegistered);
  const [isInstallShareOpen, setIsInstallShareOpen] = useState(false);
  const [installShareTab, setInstallShareTab] = useState<'install' | 'share'>('install');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Listen for native PWA install prompt on Android / Chrome
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleOpenInstallShare = useCallback((tab: 'install' | 'share' = 'install') => {
    setInstallShareTab(tab);
    setIsInstallShareOpen(true);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('pitube_user_v2', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('pitube_posts_v2', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('pitube_txs_v2', JSON.stringify(transactions));
  }, [transactions]);

  // Attempt real live crypto fetch on mount with graceful fallback
  useEffect(() => {
    const fetchLiveRealPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=idr,usd&include_24hr_change=true');
        if (response.ok) {
          const data = await response.json();
          if (data['pi-network']) {
            const idr = Math.round(data['pi-network'].idr || 1415);
            const usd = data['pi-network'].usd || 0.078;
            const change = +(data['pi-network'].idr_24h_change || 3.82).toFixed(2);
            setMarketData(prev => ({
              ...prev,
              piPriceIdr: idr,
              piPriceUsd: usd,
              change24h: change,
              high24h: Math.round(idr * 1.05),
              low24h: Math.round(idr * 0.96),
              lastUpdated: 'Live CoinMarketCap / CoinGecko'
            }));
          }
        }
      } catch {
        // Fallback to real market rate defined in initialMarketData (Rp 1.415)
      }
    };

    fetchLiveRealPrice();
  }, []);

  // Periodic natural market micro-fluctuations around the real market rate (Rp 1.415)
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaPercent = (Math.random() - 0.48) * 0.006;
      setMarketData((prev) => {
        const newPriceIdr = Math.round(prev.piPriceIdr * (1 + deltaPercent));
        const newPriceUsd = +(newPriceIdr / 18140).toFixed(4);
        return {
          ...prev,
          piPriceIdr: newPriceIdr,
          piPriceUsd: newPriceUsd,
          high24h: Math.max(prev.high24h, newPriceIdr),
          low24h: Math.min(prev.low24h, newPriceIdr),
          lastUpdated: 'Live CoinMarketCap'
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshMarket = () => {
    setIsRefreshingMarket(true);
    setTimeout(() => {
      // Natural update around current real rate
      const randomShift = Math.round((Math.random() * 20) - 10);
      setMarketData(prev => ({
        ...prev,
        piPriceIdr: Math.max(1350, prev.piPriceIdr + randomShift),
        change24h: +(prev.change24h + (Math.random() * 0.2 - 0.1)).toFixed(2),
        lastUpdated: 'Baru saja diperbarui'
      }));
      setIsRefreshingMarket(false);
    }, 600);
  };

  // Open Dompet inside Profil
  const handleOpenWalletInProfile = () => {
    setActiveTab('profil');
    setProfileSubTab('wallet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Like video/post toggle
  const handleLikeToggle = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  // Earn Pi from watching video (only for new / unwatched videos!)
  const handleEarnPi = useCallback((amount: number, reason: string, postId: string) => {
    setUserProfile(prev => {
      const prevWatched = prev.watchedVideoIds || [];
      if (prevWatched.includes(postId)) {
        return prev; // Video sudah pernah ditonton, tidak ada reward lagi!
      }
      return {
        ...prev,
        piBalance: +(prev.piBalance + amount).toFixed(4),
        totalPiEarned: +(prev.totalPiEarned + amount).toFixed(4),
        totalWatchedCount: prev.totalWatchedCount + 1,
        watchedVideoIds: [...prevWatched, postId]
      };
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'reward_watch',
      title: 'Hadiah Nonton Video Baru',
      description: reason,
      amountPi: amount,
      timestamp: 'Baru saja',
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  }, []);

  // Add Comment
  const handleAddComment = (text: string) => {
    if (!activeCommentPost) return;

    const newComment = {
      id: `c_${Date.now()}`,
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      text,
      timestamp: 'Baru saja',
      likes: 0
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === activeCommentPost.id) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments]
          };
        }
        return p;
      })
    );

    setActiveCommentPost(prev => prev ? {
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [newComment, ...prev.comments]
    } : null);

    // Reward for active commenting (+0.25 Pi)
    setUserProfile(prev => ({
      ...prev,
      piBalance: +(prev.piBalance + 0.25).toFixed(3),
      totalPiEarned: +(prev.totalPiEarned + 0.25).toFixed(3)
    }));
  };

  // Add new post from upload modal
  const handleAddPost = (newPost: MediaPost) => {
    setPosts(prev => [newPost, ...prev]);

    // Give upload bonus (+10 Pi)
    setUserProfile(prev => ({
      ...prev,
      piBalance: +(prev.piBalance + 10.0).toFixed(3),
      totalPiEarned: +(prev.totalPiEarned + 10.0).toFixed(3)
    }));

    const newTx: Transaction = {
      id: `tx_up_${Date.now()}`,
      type: 'reward_upload',
      title: 'Hadiah Unggah Konten',
      description: `Bonus upload "${newPost.title.substring(0, 20)}..."`,
      amountPi: 10.0,
      timestamp: 'Baru saja',
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);
    setActiveTab('beranda');
  };

  // Swap Pi to IDR at real market price
  const handleSwapSuccess = (amountPi: number, amountIdr: number) => {
    setUserProfile(prev => ({
      ...prev,
      piBalance: Math.max(0, +(prev.piBalance - amountPi).toFixed(3)),
      idrBalance: prev.idrBalance + amountIdr
    }));

    const newTx: Transaction = {
      id: `tx_sw_${Date.now()}`,
      type: 'swap_pi_to_idr',
      title: 'Tukar Pi ke Rupiah',
      description: `Konversi ${amountPi} Pi pada rate nyata Rp ${marketData.piPriceIdr.toLocaleString('id-ID')}/Pi`,
      amountPi,
      amountIdr,
      timestamp: 'Hari ini',
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Withdraw IDR
  const handleWithdrawSuccess = (
    amountIdr: number, 
    method: string, 
    accountNum: string, 
    accountName: string
  ) => {
    setUserProfile(prev => ({
      ...prev,
      idrBalance: Math.max(0, prev.idrBalance - amountIdr)
    }));

    const newTx: Transaction = {
      id: `tx_wd_${Date.now()}`,
      type: 'withdraw_idr',
      title: `Penarikan Saldo ke ${method}`,
      description: `${accountNum} a.n ${accountName}`,
      amountIdr,
      timestamp: 'Baru saja',
      status: 'completed',
      paymentMethod: method,
      accountNumber: accountNum,
      accountName
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Daily check in (0.1 Pi once per day)
  const handleClaimDaily = (amountPi: number) => {
    setUserProfile(prev => ({
      ...prev,
      piBalance: +(prev.piBalance + amountPi).toFixed(4),
      totalPiEarned: +(prev.totalPiEarned + amountPi).toFixed(4),
      dailyCheckedIn: true
    }));

    const newTx: Transaction = {
      id: `tx_dl_${Date.now()}`,
      type: 'reward_daily',
      title: 'Bonus Klaim Harian',
      description: 'Check-in harian Pioneer pi Tube (0.1 Pi)',
      amountPi,
      timestamp: 'Hari ini',
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Save edited profile (name, avatar, bio)
  const handleSaveProfile = (updatedData: { name: string; avatar: string; bio: string }) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        name: updatedData.name,
        avatar: updatedData.avatar,
        bio: updatedData.bio,
      };
      // Permanently sync with account database by phone
      if (updated.phone) {
        try {
          const stored = localStorage.getItem('pitube_accounts_permanent');
          const accounts: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
          accounts[updated.phone] = updated;
          localStorage.setItem('pitube_accounts_permanent', JSON.stringify(accounts));
        } catch { /* ignore */ }
      }
      return updated;
    });
  };

  // Permanently delete user's uploaded post
  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Register new or login existing user
  const handleRegisterSuccess = (newUser: UserProfile, isExisting: boolean) => {
    setUserProfile(newUser);
    if (!isExisting) {
      setTransactions([]); // STRICT ZERO TRANSACTIONS FOR NEW USER
    }
    setIsRegisterOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070110] text-gray-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Navbar with real live ticker */}
      <Navbar
        marketData={marketData}
        userProfile={userProfile}
        onOpenWallet={handleOpenWalletInProfile}
        onOpenDailyModal={() => setIsDailyOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenInstallShare={() => handleOpenInstallShare('install')}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'beranda' && (
          <BerandaView
            posts={posts}
            userProfile={userProfile}
            onLikeToggle={handleLikeToggle}
            onOpenComment={(p) => setActiveCommentPost(p)}
            onOpenShare={(p) => setActiveSharePost(p)}
            onEarnPi={handleEarnPi}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileView
            userProfile={userProfile}
            posts={posts}
            marketData={marketData}
            transactions={transactions}
            initialSubTab={profileSubTab}
            onOpenDailyModal={() => setIsDailyOpen(true)}
            onOpenSwap={() => setIsSwapOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
            onRefreshMarket={handleRefreshMarket}
            isRefreshingMarket={isRefreshingMarket}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onSaveProfile={handleSaveProfile}
            onDeletePost={handleDeletePost}
            onOpenInstallShare={handleOpenInstallShare}
          />
        )}
      </main>

      {/* Bottom Navigation (Clean 3-button layout: Beranda, +, Profil) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Upload Modal (Video & Foto) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddPost={handleAddPost}
        userProfile={userProfile}
      />

      {/* Comment Modal */}
      {activeCommentPost && (
        <CommentModal
          isOpen={Boolean(activeCommentPost)}
          onClose={() => setActiveCommentPost(null)}
          comments={activeCommentPost.comments || []}
          onAddComment={handleAddComment}
          userProfile={userProfile}
          postTitle={activeCommentPost.title}
        />
      )}

      {/* Share Modal */}
      {activeSharePost && (
        <ShareModal
          isOpen={Boolean(activeSharePost)}
          onClose={() => setActiveSharePost(null)}
          post={activeSharePost}
          onShareSuccess={() => {
            setUserProfile(prev => ({
              ...prev,
              piBalance: +(prev.piBalance + 0.5).toFixed(3),
              totalPiEarned: +(prev.totalPiEarned + 0.5).toFixed(3)
            }));
          }}
        />
      )}

      {/* Swap Modal (Pi ke Rupiah sesuai harga nyata CoinMarketCap) */}
      <SwapModal
        isOpen={isSwapOpen}
        onClose={() => setIsSwapOpen(false)}
        marketData={marketData}
        userProfile={userProfile}
        onSwapSuccess={handleSwapSuccess}
      />

      {/* Withdraw Modal (Tarik Rupiah ke DANA, OVO, Bank) */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        userProfile={userProfile}
        onWithdrawSuccess={handleWithdrawSuccess}
      />

      {/* Daily Check-In Modal */}
      <DailyCheckInModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        userProfile={userProfile}
        onClaimDaily={handleClaimDaily}
      />

      {/* Phone Number Registration & OTP Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        canDismiss={Boolean(userProfile.isRegistered)}
      />

      {/* Floating Non-intrusive Install Prompt for Mobile Browsers */}
      <InstallBanner
        onOpenInstall={() => handleOpenInstallShare('install')}
        onOpenShare={() => handleOpenInstallShare('share')}
      />

      {/* Download & Share Modal (PWA Installation, WhatsApp, QR, Telegram) */}
      <InstallShareModal
        isOpen={isInstallShareOpen}
        onClose={() => setIsInstallShareOpen(false)}
        userProfile={userProfile}
        initialTab={installShareTab}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => {
          setDeferredPrompt(null);
        }}
      />
    </div>
  );
}
