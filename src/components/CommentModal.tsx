import React, { useState } from 'react';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { Comment, UserProfile } from '../types';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  userProfile: UserProfile;
  postTitle: string;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  userProfile,
  postTitle,
}) => {
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  // Sync if comments prop changes
  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleToggleLike = (commentId: string) => {
    setLocalComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-lg bg-[#110526] border-t sm:border border-purple-800/60 sm:rounded-2xl max-h-[85vh] h-[550px] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-900/40 bg-[#160633]">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-yellow-400 text-sm sm:text-base">
              Komentar ({localComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video subtitle reference */}
        <div className="px-4 py-1.5 bg-black/40 border-b border-purple-900/20 text-[11px] text-gray-400 truncate">
          Sedang mengomentari: <span className="text-yellow-300 font-medium">{postTitle}</span>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
          {localComments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle className="w-10 h-10 mx-auto text-purple-500/50 mb-2" />
              <p className="text-sm">Belum ada komentar.</p>
              <p className="text-xs text-yellow-400/80">Jadilah yang pertama mengomentari video ini!</p>
            </div>
          ) : (
            localComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover border border-purple-700/50"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-yellow-400">
                      {comment.userName}
                    </span>
                    <span className="text-[10px] text-purple-300/60">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 mt-0.5 leading-relaxed">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-purple-300">
                    <button
                      onClick={() => handleToggleLike(comment.id)}
                      className={`flex items-center gap-1 hover:text-yellow-400 transition-colors ${
                        comment.isLiked ? 'text-pink-500 font-semibold' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="hover:text-yellow-300 text-[10px]">Balas</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#160633] border-t border-purple-900/50 flex items-center gap-2">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-8 h-8 rounded-full border border-yellow-400/50 object-cover"
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tulis komentar kamu di pi Tube..."
            className="flex-1 bg-black/60 border border-purple-700/60 focus:border-yellow-400 rounded-full px-4 py-2 text-xs text-white placeholder-purple-300/40 outline-none transition-all"
            maxLength={250}
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="w-9 h-9 rounded-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:hover:bg-yellow-400 text-black flex items-center justify-center font-bold transition-transform active:scale-95 shrink-0 shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5 text-black" />
          </button>
        </form>
      </div>
    </div>
  );
};
