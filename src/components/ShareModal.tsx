import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Twitter, Facebook, Sparkles } from 'lucide-react';
import { PiCoinIcon } from './PiCoinIcon';
import { MediaPost } from '../types';
import { getShareUrl } from '../utils/pwa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: MediaPost;
  onShareSuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  post,
  onShareSuccess,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseOrigin = getShareUrl();
  const shareUrl = `${baseOrigin}/#post-${post.id}`;
  const shareText = `Tonton "${post.title}" di pi Tube dan dapatkan Pi Coin gratis yang bisa langsung dicairkan ke Rupiah! 🚀💰`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    onShareSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500',
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        onShareSuccess();
      }
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-400',
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        onShareSuccess();
      }
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-zinc-800 hover:bg-zinc-700',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        onShareSuccess();
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-500',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        onShareSuccess();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-md bg-[#130629] border-t sm:border border-purple-800/70 sm:rounded-2xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-yellow-400 text-base">Bagikan ke Teman</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Reward Incentive Banner */}
        <div className="mt-3 bg-gradient-to-r from-purple-950/80 to-[#220745] border border-yellow-400/40 rounded-xl p-3 flex items-center gap-3">
          <PiCoinIcon size={28} animate />
          <div className="flex-1 text-xs">
            <div className="font-bold text-yellow-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Bonus Bagikan Video
            </div>
            <p className="text-gray-300 text-[11px] mt-0.5">
              Bagikan konten pi Tube untuk mendukung kreator & dapatkan koin tambahan!
            </p>
          </div>
        </div>

        {/* Social App Grid */}
        <div className="grid grid-cols-4 gap-3 my-5">
          {shareOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={opt.action}
              className="flex flex-col items-center gap-2 group transition-transform hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-full ${opt.color} flex items-center justify-center text-white shadow-lg transition-colors`}>
                <opt.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-purple-200 group-hover:text-yellow-400 font-medium">
                {opt.name}
              </span>
            </button>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="bg-black/60 border border-purple-800/60 rounded-xl p-2 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-300 truncate pl-2">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-800" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
