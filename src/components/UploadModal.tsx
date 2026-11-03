import React, { useState, useRef } from 'react';
import { X, Upload, Video, Image as ImageIcon, Sparkles, CheckCircle2, Film } from 'lucide-react';
import { MediaPost, UserProfile } from '../types';
import { PiCoinIcon } from './PiCoinIcon';
import { playCoinSound } from '../utils/formatters';
import { fireCoinConfetti } from '../utils/confetti';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: MediaPost) => void;
  userProfile: UserProfile;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  userProfile,
}) => {
  const [mediaType, setMediaType] = useState<'video' | 'photo'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('piNetwork, piTube, crypto');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setMediaUrl(objectUrl);
    }
  };

  const handleSelectSample = (url: string, defaultTitle: string) => {
    setMediaUrl(url);
    if (!title) setTitle(defaultTitle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const finalUrl = mediaUrl || (mediaType === 'video'
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');

      const newPost: MediaPost = {
        id: `post_${Date.now()}`,
        type: mediaType,
        title: title.trim(),
        description: description.trim() || 'Video baru diunggah di pi Tube #piNetwork',
        url: finalUrl,
        thumbnailUrl: mediaType === 'photo' ? finalUrl : undefined,
        creator: {
          name: userProfile.name,
          handle: userProfile.handle,
          avatar: userProfile.avatar,
          isVerified: userProfile.isKycVerified
        },
        likes: 1,
        isLiked: true,
        commentsCount: 0,
        sharesCount: 0,
        comments: [],
        rewardPiPerView: 0.0015,
        tags: tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean),
        createdAt: 'Baru saja',
        isUserUploaded: true
      };

      onAddPost(newPost);
      playCoinSound();
      fireCoinConfetti();
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#110526] border border-purple-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/50 bg-[#170733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center">
              <Upload className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-yellow-400 text-base leading-tight">
                Upload Konten pi Tube
              </h3>
              <p className="text-[11px] text-purple-300">
                Unggah video atau foto & raih bonus Pi coin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 scrollbar-thin">
          {/* Type Toggle: Video vs Foto */}
          <div className="grid grid-cols-2 gap-2 bg-black/50 p-1 rounded-xl border border-purple-900/40">
            <button
              type="button"
              onClick={() => {
                setMediaType('video');
                setMediaUrl('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                mediaType === 'video'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('photo');
                setMediaUrl('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                mediaType === 'photo'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Foto</span>
            </button>
          </div>

          {/* Media File Picker & Preview */}
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={mediaType === 'video' ? 'video/*' : 'image/*'}
              className="hidden"
            />

            {mediaUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-purple-600 bg-black/80 aspect-video max-h-56 flex items-center justify-center group">
                {mediaType === 'video' ? (
                  <video src={mediaUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain" />
                )}
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 bg-black/80 text-yellow-400 p-1.5 rounded-full hover:bg-black border border-yellow-400/50"
                  title="Ganti media"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-700/60 hover:border-yellow-400 rounded-xl p-6 text-center cursor-pointer bg-purple-950/20 hover:bg-purple-950/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-purple-900/50 group-hover:bg-yellow-400/20 mx-auto flex items-center justify-center mb-2 transition-colors">
                  {mediaType === 'video' ? (
                    <Film className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <p className="text-xs font-bold text-yellow-300">
                  Klik untuk pilih file {mediaType === 'video' ? 'Video (MP4, WebM)' : 'Foto (JPG, PNG)'}
                </p>
                <p className="text-[11px] text-purple-300 mt-1">
                  Atau gunakan contoh video/foto di bawah ini
                </p>
              </div>
            )}

            {/* Quick Sample Media Selectors */}
            {!mediaUrl && (
              <div className="pt-1">
                <span className="text-[10px] text-gray-400 block mb-1">
                  Atau pilih contoh konten siap pakai:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                  {mediaType === 'video' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectSample('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 'Pi Coin Bull Run 2026! 🚀')}
                        className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 rounded-lg text-yellow-400 whitespace-nowrap text-[11px]"
                      >
                        🎬 Bull Run Pi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectSample('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'Aktivitas Seru Komunitas Pi Indonesia 🇮🇩')}
                        className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 rounded-lg text-yellow-400 whitespace-nowrap text-[11px]"
                      >
                        🎬 Komunitas Pi
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectSample('https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80', 'Grafik Prediksi Pi Network di Bursa Internasional 📊')}
                        className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 rounded-lg text-yellow-400 whitespace-nowrap text-[11px]"
                      >
                        📷 Grafik Pi Market
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectSample('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'Teknologi Blockchain Pi Web3 Canggih ⚡')}
                        className="px-2.5 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-800 rounded-lg text-yellow-400 whitespace-nowrap text-[11px]"
                      >
                        📷 Node Blockchain
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">
              Judul Konten <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tutorial Menukar Pi Coin ke Rupiah Tercepat 2026"
              className="w-full bg-black/60 border border-purple-700/60 focus:border-yellow-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-purple-300/40 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang video atau foto kamu..."
              className="w-full bg-black/60 border border-purple-700/60 focus:border-yellow-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-purple-300/40 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">
              Tag / Hashtag (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="piNetwork, crypto, viral, tutorial"
              className="w-full bg-black/60 border border-purple-700/60 focus:border-yellow-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-purple-300/40 outline-none"
            />
          </div>

          {/* Reward Info Box */}
          <div className="bg-gradient-to-r from-purple-950 to-[#250947] border border-yellow-400/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiCoinIcon size={26} />
              <div>
                <div className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Hadiah Penonton & Kreator
                </div>
                <div className="text-[11px] text-gray-300">
                  Setiap orang yang menonton akan mendapat <span className="text-yellow-400 font-bold">0.05 Pi</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-2 py-0.5 rounded-full font-semibold">
              Kreator +0.5 Pi / 100 views
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Mengunggah ke pi Tube...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publikasikan Sekarang</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
