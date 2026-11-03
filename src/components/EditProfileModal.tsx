import React, { useState, useRef } from 'react';
import { X, Camera, Check, User, Upload } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updatedData: { name: string; avatar: string; bio: string }) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [bio, setBio] = useState(userProfile.bio || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if modal opens
  React.useEffect(() => {
    setName(userProfile.name);
    setAvatar(userProfile.avatar);
    setBio(userProfile.bio || '');
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      name: name.trim(),
      avatar,
      bio: bio.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#120528] border border-purple-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/50 bg-[#180733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center">
              <User className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-yellow-400 text-base leading-tight">
                Edit Profil Pioneer
              </h3>
              <p className="text-[11px] text-purple-300">
                Ubah foto profil & nama pengguna kamu
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Avatar Preview & File Input */}
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400 shadow-xl"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-1 rounded-full shadow">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-[11px] text-yellow-400 font-bold hover:underline flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>Unggah Foto dari HP/Komputer</span>
            </button>

            {/* Avatar Presets */}
            <div className="mt-3 w-full">
              <span className="text-[10px] text-gray-400 block mb-1 text-center">
                Atau pilih avatar siap pakai:
              </span>
              <div className="flex justify-center gap-2 overflow-x-auto py-1">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                      avatar === preset ? 'border-yellow-400 scale-110 shadow-[0_0_8px_#facc15]' : 'border-purple-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nama Pengguna */}
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">
              Nama Pengguna <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap atau panggilan"
              className="w-full bg-black/60 border border-purple-700/70 focus:border-yellow-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">
              Bio / Status Pioneer
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tuliskan tentang diri kamu..."
              className="w-full bg-black/60 border border-purple-700/70 focus:border-yellow-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </form>
      </div>
    </div>
  );
};
