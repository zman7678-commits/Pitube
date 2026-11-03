/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  Send, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';
import { PiCoinIcon } from './PiCoinIcon';
import { UserProfile } from '../types';
import { getShareUrl, isPWAInstalled, getPlatformType } from '../utils/pwa';

// Interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  initialTab?: 'install' | 'share';
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstallSuccess?: () => void;
}

export const InstallShareModal: React.FC<InstallShareModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialTab = 'install',
  deferredPrompt,
  onInstallSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'install' | 'share'>(initialTab);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAlreadyInstalled, setIsAlreadyInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');

  useEffect(() => {
    setActiveTab(initialTab);
    setIsAlreadyInstalled(isPWAInstalled());
    setPlatform(getPlatformType());
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const shareUrl = getShareUrl();
  const shareMessage = `🎬 Nonton video & foto di pi Tube bisa dapat Pi Coin gratis! Koin Pi bisa langsung ditukar ke saldo Rupiah di bursa CoinMarketCap.

📲 Download & pasang aplikasinya di smartphone:
${shareUrl}

🎁 Gunakan Kode Undangan saya: ${userProfile.referralCode} untuk dapat bonus tambahan!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userProfile.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'pi Tube - Nonton Video Dapat Coin Pi',
          text: shareMessage,
          url: shareUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleTriggerInstall = async () => {
    if (!deferredPrompt) {
      // If no prompt event captured, show platform guide
      return;
    }
    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsAlreadyInstalled(true);
        if (onInstallSuccess) onInstallSuccess();
      }
    } catch (err) {
      console.error('Install prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=facc15&bgcolor=170630&margin=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#120426] border border-purple-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#200742] via-[#2f0b60] to-[#1a0536] p-4 border-b border-purple-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
              <Smartphone className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-1.5">
                Download & Sebarkan <span className="text-yellow-400">pi Tube</span>
              </h2>
              <p className="text-[11px] text-purple-300">
                Pasang di HP teman & dapatkan koin bersama
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-purple-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-purple-900/50 bg-[#0d021c] p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'install'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Pasang di HP</span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'share'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Sebarkan ke Teman</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-purple-200">
          {activeTab === 'install' ? (
            <div className="space-y-4">
              {/* App Identity Banner */}
              <div className="flex items-center gap-3.5 bg-gradient-to-r from-purple-950/80 to-[#1e073c] p-3.5 rounded-2xl border border-purple-800/60">
                <div className="relative">
                  <PiCoinIcon size={46} />
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white">pi Tube Mobile App</h3>
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/30">
                      V 2.0 WebApp
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-300 mt-0.5">
                    Aplikasi ringan (PWA), tanpa perlu download APK berat di Play Store!
                  </p>
                </div>
              </div>

              {/* Status or 1-Click Install Button */}
              {isAlreadyInstalled ? (
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-300">
                      Aplikasi Telah Terpasang di HP Ini!
                    </p>
                    <p className="text-[10px] text-purple-300">
                      Ikon pi Tube sudah ada di layar utama smartphone Anda. Anda juga bisa membagikannya ke HP teman melalui tab sebelah.
                    </p>
                  </div>
                </div>
              ) : deferredPrompt ? (
                <div className="space-y-2">
                  <button
                    onClick={handleTriggerInstall}
                    disabled={isInstalling}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 hover:brightness-105 active:scale-[0.98] text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>{isInstalling ? 'Memasang Aplikasi...' : '⚡ Pasang Aplikasi Sekarang (1-Klik)'}</span>
                  </button>
                  <p className="text-[10px] text-center text-purple-400">
                    Klik tombol di atas untuk menambahkan ikon pi Tube langsung ke layar depan smartphone.
                  </p>
                </div>
              ) : null}

              {/* Step by step install guide for phones */}
              <div className="bg-[#170630] border border-purple-800/60 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-900/60 pb-2">
                  <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-yellow-400" />
                    Panduan Pasang di Smartphone Teman:
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPlatform('android')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${platform === 'android' ? 'bg-yellow-400 text-black' : 'text-purple-400 bg-purple-950'}`}
                    >
                      Android
                    </button>
                    <button
                      onClick={() => setPlatform('ios')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${platform === 'ios' ? 'bg-yellow-400 text-black' : 'text-purple-400 bg-purple-950'}`}
                    >
                      iPhone / iPad
                    </button>
                  </div>
                </div>

                {platform === 'ios' ? (
                  <div className="space-y-2.5 text-[11px] text-purple-200">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </span>
                      <p>
                        Buka tautan pi Tube di browser <strong className="text-white">Safari</strong> di iPhone teman Anda.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </span>
                      <p>
                        Tekan tombol <strong className="text-yellow-400">Bagikan (Share)</strong> di bilah bawah Safari (ikon kotak dengan tanda panah ke atas <Share2 className="w-3 h-3 inline mx-0.5" />).
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </span>
                      <p>
                        Gulir menu ke bawah lalu pilih <strong className="text-white">"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        4
                      </span>
                      <p>
                        Tekan <strong className="text-yellow-400">"Tambah" (Add)</strong> di sudut kanan atas. Selesai! pi Tube sudah terpasang rapi seperti aplikasi App Store.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-[11px] text-purple-200">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </span>
                      <p>
                        Buka tautan pi Tube di <strong className="text-white">Google Chrome</strong> di HP teman Anda.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </span>
                      <p>
                        Tekan menu <strong className="text-yellow-400">Titik Tiga (⋮)</strong> di sudut kanan atas browser Chrome.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </span>
                      <p>
                        Pilih menu <strong className="text-white">"Pasang Aplikasi"</strong> atau <strong className="text-white">"Tambahkan ke Layar Utama"</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        4
                      </span>
                      <p>
                        Tekan konfirmasi <strong className="text-yellow-400">"Instal"</strong>. Ikon pi Tube akan otomatis muncul di menu aplikasi & layar depan smartphone!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Advantages of PWA */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-[#170630]/60 p-2.5 rounded-xl border border-purple-900/40 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Hemat memori (Hanya ~1 MB, tanpa file APK besar)</span>
                </div>
                <div className="bg-[#170630]/60 p-2.5 rounded-xl border border-purple-900/40 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Aman & Terenkripsi HTTPS</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Code Card for Scanning with Smartphone Camera */}
              <div className="bg-[#170630] border border-purple-800/70 rounded-2xl p-4 flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-yellow-300 mb-2 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4" />
                  Scan QR Code Menggunakan Kamera HP Teman:
                </span>
                
                <div className="bg-[#170630] p-2 rounded-2xl border-2 border-yellow-400/60 shadow-lg">
                  <img
                    src={qrImageUrl}
                    alt="Scan QR pi Tube"
                    className="w-40 h-40 rounded-xl object-contain bg-[#170630]"
                  />
                </div>
                
                <p className="text-[10px] text-purple-300 mt-2.5 max-w-xs">
                  Arahkan kamera smartphone teman ke kode QR di atas untuk langsung membuka dan memasang pi Tube!
                </p>
              </div>

              {/* Direct Link & Copy */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-purple-300 flex items-center justify-between">
                  <span>Tautan Aplikasi pi Tube:</span>
                  <span className="text-[10px] text-yellow-400 font-normal">Link Siap Dibagikan</span>
                </label>
                <div className="flex items-center gap-1.5 bg-[#0a0215] border border-purple-800/80 rounded-xl p-1.5 pl-3">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-[11px] text-white font-mono outline-none truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-yellow-300 font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Referral Code Quick Copy */}
              <div className="bg-gradient-to-r from-purple-950/70 to-[#220745] border border-yellow-400/40 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">
                    Kode Undangan Anda:
                  </div>
                  <div className="text-base font-black text-yellow-400 font-mono tracking-wider">
                    {userProfile.referralCode}
                  </div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs flex items-center gap-1 transition-all active:scale-95"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin' : 'Salin Kode'}</span>
                </button>
              </div>

              {/* Instant Share Buttons */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-purple-300">
                  Kirim Cepat Lewat Sosial Media:
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppShare}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={handleTelegramShare}
                    className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram</span>
                  </button>
                </div>

                {/* Native OS Share */}
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-900/80 hover:bg-purple-800 active:scale-98 text-yellow-300 border border-purple-700/60 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan ke Aplikasi Lain (Instagram, SMS, Line, dll)</span>
                </button>
              </div>

              {/* Referral Bonus Info */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
                <p className="text-[10px] text-yellow-200">
                  <strong className="text-yellow-400 font-bold">Bonus Mengundang:</strong> Setiap teman yang mendownload pi Tube dan mendaftar dengan kode Anda, Anda akan mendapatkan bonus koin tambahan!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0d021c] border-t border-purple-900/60 flex items-center justify-between text-[11px]">
          <span className="text-purple-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
            Tersinkronisasi Pasar CoinMarketCap
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
