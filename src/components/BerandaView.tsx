import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, ChevronUp, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { MediaPost, UserProfile } from '../types';
import { PiCoinIcon } from './PiCoinIcon';
import { formatCompactNumber, playCoinSound } from '../utils/formatters';
import { fireCoinConfetti } from '../utils/confetti';

interface BerandaViewProps {
  posts: MediaPost[];
  userProfile: UserProfile;
  onLikeToggle: (postId: string) => void;
  onOpenComment: (post: MediaPost) => void;
  onOpenShare: (post: MediaPost) => void;
  onEarnPi: (amount: number, reason: string, postId: string) => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  posts,
  userProfile,
  onLikeToggle,
  onOpenComment,
  onOpenShare,
  onEarnPi,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [watchProgress, setWatchProgress] = useState(0); // 0 to 100%
  const [rewardToast, setRewardToast] = useState<{ amount: number; message: string } | null>(null);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentPost = posts[currentIndex] || posts[0];

  // Video yang sudah ditonton tidak akan mendapat reward lagi, hanya video baru/belum ditonton
  const isAlreadyWatched = Boolean(
    currentPost && (userProfile.watchedVideoIds || []).includes(currentPost.id)
  );

  // Watch timer: Calibrated so only unwatched videos yield rewards!
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Do not run reward timer if video is already watched
    if (isPlaying && !isAlreadyWatched && currentPost) {
      interval = setInterval(() => {
        setWatchProgress((prev) => {
          if (prev >= 100) {
            const earnedAmount = currentPost?.rewardPiPerView || 0.0015;
            onEarnPi(earnedAmount, `Nonton "${currentPost?.title?.substring(0, 18)}..."`, currentPost.id);
            playCoinSound();
            fireCoinConfetti();
            
            setRewardToast({
              amount: earnedAmount,
              message: `+${earnedAmount.toFixed(4)} Pi! Video ini selesai diklaim.`
            });

            setTimeout(() => {
              setRewardToast(null);
            }, 3000);

            return 100;
          }
          // 30 seconds per full reward cycle (100 / 30 ≈ 3.34% per second)
          return Math.min(100, +(prev + 3.34).toFixed(2));
        });
      }, 1000);
    } else if (isAlreadyWatched) {
      setWatchProgress(100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isAlreadyWatched, currentPost, onEarnPi]);

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Next video (swipe up: finger moves bottom to top)
  const handleNextPost = useCallback(() => {
    if (currentIndex < posts.length - 1) {
      setSlideDirection('up');
      setCurrentIndex(prev => prev + 1);
      setWatchProgress(0);
      setTimeout(() => setSlideDirection(null), 300);
    }
  }, [currentIndex, posts.length]);

  // Previous video (swipe down: finger moves top to bottom)
  const handlePrevPost = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection('down');
      setCurrentIndex(prev => prev - 1);
      setWatchProgress(0);
      setTimeout(() => setSlideDirection(null), 300);
    }
  }, [currentIndex]);

  // Touch Swipe Handlers for vertical navigation (atas ke bawah / bawah ke atas)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchCurrentY.current === null) return;
    const deltaY = touchStartY.current - touchCurrentY.current;

    // Minimum swipe threshold: 45px
    if (deltaY > 45) {
      // Swiped UP (bawah ke atas) -> Next video
      handleNextPost();
    } else if (deltaY < -45) {
      // Swiped DOWN (atas ke bawah) -> Previous video
      handlePrevPost();
    }

    touchStartY.current = null;
    touchCurrentY.current = null;
  };

  // Mouse wheel scroll for desktop swipe simulation
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return;
    if (Math.abs(e.deltaY) < 30) return;

    if (e.deltaY > 0) {
      handleNextPost();
    } else {
      handlePrevPost();
    }

    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null;
    }, 450);
  };

  // Keyboard navigation (ArrowDown / ArrowUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextPost();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevPost();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPost, handlePrevPost]);

  const handleInstantClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAlreadyWatched) {
      setRewardToast({
        amount: 0,
        message: 'Video ini sudah pernah diklaim! Tonton video baru untuk menghasilkan Pi.'
      });
      setTimeout(() => setRewardToast(null), 2500);
      return;
    }

    const amount = currentPost.rewardPiPerView || 0.0015;
    onEarnPi(amount, 'Klaim koin video', currentPost.id);
    playCoinSound();
    fireCoinConfetti();
    setRewardToast({
      amount,
      message: `+${amount.toFixed(4)} Pi diklaim! Video ini selesai.`
    });
    setWatchProgress(100);
    setTimeout(() => setRewardToast(null), 2500);
  };

  if (!currentPost) {
    return (
      <div className="p-8 text-center text-yellow-400">
        Belum ada video tersedia.
      </div>
    );
  }

  // Circular progress SVG
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (watchProgress / 100) * circumference;

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md mx-auto bg-black flex-1 flex flex-col justify-center overflow-hidden select-none pb-20 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Toast Notification */}
      {rewardToast && (
        <div className="absolute top-3 left-4 right-4 z-50 bg-[#1e073c]/95 border border-yellow-400 p-2.5 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <PiCoinIcon size={22} animate />
            <span className="text-xs font-bold text-yellow-300">
              {rewardToast.message}
            </span>
          </div>
          <span className="text-[11px] font-black bg-yellow-400 text-black px-2 py-0.5 rounded-md">
            +{rewardToast.amount.toFixed(4)} Pi
          </span>
        </div>
      )}

      {/* Media Player Area with swipe transition */}
      <div 
        className={`relative w-full aspect-[9/16] max-h-[79vh] bg-[#0c0419] flex items-center justify-center overflow-hidden cursor-pointer transition-transform duration-250 ease-out ${
          slideDirection === 'up' ? '-translate-y-4 opacity-75' : slideDirection === 'down' ? 'translate-y-4 opacity-75' : 'translate-y-0 opacity-100'
        }`}
        onClick={togglePlay}
      >
        {currentPost.type === 'video' ? (
          <video
            ref={videoRef}
            src={currentPost.url}
            loop
            playsInline
            muted={isMuted}
            autoPlay
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <img
            src={currentPost.url}
            alt={currentPost.title}
            className="w-full h-full object-contain pointer-events-none"
          />
        )}

        {/* Center Pause/Play Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-purple-950/80 border border-yellow-400 flex items-center justify-center text-yellow-400 shadow-xl">
              <Play className="w-7 h-7 ml-1 fill-current" />
            </div>
          </div>
        )}

        {/* Top Controls: Sound Mute (Left) & Micro Watch-to-Earn Ring (Right) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
          {currentPost.type === 'video' ? (
            <button
              onClick={toggleMute}
              className="pointer-events-auto p-2 rounded-full bg-black/60 border border-purple-800 text-yellow-400 hover:text-white transition-all shadow"
              title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          ) : <div />}

          {/* Micro-reward Progress Ring or Already Watched Badge */}
          {isAlreadyWatched ? (
            <button
              onClick={handleInstantClaim}
              className="pointer-events-auto flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-400/70 pl-2 pr-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-transform active:scale-95"
              title="Video ini sudah pernah ditonton dan diklaim"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-emerald-300 leading-none">
                  Sudah Diklaim
                </span>
                <span className="text-[8px] text-gray-300 leading-none mt-0.5">
                  Tonton video baru
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={handleInstantClaim}
              className="pointer-events-auto flex items-center gap-2 bg-[#120426]/90 backdrop-blur-md border border-yellow-400/70 hover:border-yellow-400 pl-1.5 pr-3 py-1 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.3)] transition-transform active:scale-95 group"
              title="Klik untuk klaim progres koin"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r={radius}
                    stroke="#2e1065"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r={radius}
                    stroke="#FACC15"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PiCoinIcon size={16} />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-yellow-400 leading-none">
                  +{currentPost.rewardPiPerView.toFixed(4)} Pi
                </span>
                <span className="text-[9px] text-gray-300 leading-none mt-0.5">
                  {Math.round(watchProgress)}% Klaim
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Right Side Social Actions (Like, Komen, Share) */}
        <div 
          className="absolute right-3 bottom-12 z-30 flex flex-col items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Creator Avatar */}
          <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden shadow">
            <img
              src={currentPost.creator.avatar}
              alt={currentPost.creator.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onLikeToggle(currentPost.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform active:scale-125 ${
                currentPost.isLiked
                  ? 'bg-red-500/30 border-red-500 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'bg-black/60 border-purple-800 text-yellow-400 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentPost.isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[10px] font-bold text-yellow-300 mt-1 drop-shadow">
              {formatCompactNumber(currentPost.likes)}
            </span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onOpenComment(currentPost)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-purple-800 text-yellow-400 hover:text-white flex items-center justify-center transition-transform active:scale-125"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-yellow-300 mt-1 drop-shadow">
              {formatCompactNumber(currentPost.commentsCount || currentPost.comments.length)}
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onOpenShare(currentPost)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-purple-800 text-yellow-400 hover:text-white flex items-center justify-center transition-transform active:scale-125"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-yellow-300 mt-1 drop-shadow">
              {formatCompactNumber(currentPost.sharesCount)}
            </span>
          </div>
        </div>

        {/* Bottom Overlay Info (Title & Creator) */}
        <div 
          className="absolute left-0 right-14 bottom-0 z-20 p-4 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-black text-yellow-400">
              {currentPost.creator.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {currentPost.creator.handle}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
            {currentPost.title}
          </h4>

          {/* Clean minimal tags */}
          <div className="flex flex-wrap gap-1 mt-1">
            {currentPost.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold text-yellow-300 bg-purple-950/80 border border-purple-800 px-1.5 py-0.2 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Floating Swipe Cue Hint */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-[10px] text-purple-300/60 pointer-events-none animate-pulse">
          <ChevronUp className="w-3.5 h-3.5" />
          <span className="text-[8px] font-bold tracking-widest uppercase [writing-mode:vertical-lr]">Geser</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Swipe Navigation Status Indicator Bar */}
      <div className="px-4 py-2 bg-[#0c031c] border-t border-purple-900/50 flex items-center justify-between text-xs">
        <button
          onClick={handlePrevPost}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 text-purple-300 disabled:opacity-20 hover:text-yellow-400 font-bold transition-colors"
          title="Geser ke bawah atau klik"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Atas (Lama)</span>
        </button>

        {/* Swipe instruction pill */}
        <span className="text-[10px] text-gray-400 font-medium bg-black/60 px-2.5 py-1 rounded-full border border-purple-900/60 flex items-center gap-1">
          <span className="text-yellow-400 font-black">{currentIndex + 1}</span> / {posts.length} • Geser ↕️
        </span>

        <button
          onClick={handleNextPost}
          disabled={currentIndex === posts.length - 1}
          className="flex items-center gap-1 text-purple-300 disabled:opacity-20 hover:text-yellow-400 font-bold transition-colors"
          title="Geser ke atas atau klik"
        >
          <span>Bawah (Baru)</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
