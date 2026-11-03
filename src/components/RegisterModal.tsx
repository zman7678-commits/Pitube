import React, { useState, useEffect, useRef } from 'react';
import { Phone, ShieldCheck, CheckCircle2, MessageSquare, Sparkles, RefreshCw, X, AlertCircle } from 'lucide-react';
import { PiCoinIcon } from './PiCoinIcon';
import { UserProfile } from '../types';
import { playCoinSound } from '../utils/formatters';
import { fireCoinConfetti } from '../utils/confetti';

interface RegisterModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onRegisterSuccess: (user: UserProfile, isExisting: boolean) => void;
  canDismiss?: boolean;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  canDismiss = false,
}) => {
  const [step, setStep] = useState<'input_phone' | 'verify_otp'>('input_phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [incomingSms, setIncomingSms] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingUser, setExistingUser] = useState<UserProfile | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify_otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const normalizePhone = (num: string) => {
    let clean = num.replace(/[^0-9]/g, '');
    if (clean.startsWith('62')) {
      clean = '0' + clean.slice(2);
    } else if (!clean.startsWith('0') && clean.length > 0) {
      clean = '0' + clean;
    }
    return clean;
  };

  // Generate 6-digit OTP and simulate instant SMS push
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = normalizePhone(phoneNumber);
    if (cleanPhone.length < 10) {
      setErrorMsg('Masukkan nomor HP yang valid (minimal 10 digit).');
      return;
    }

    // Check permanent accounts registry
    const accountsJson = localStorage.getItem('pitube_accounts_permanent');
    let accountsMap: Record<string, UserProfile> = {};
    if (accountsJson) {
      try { accountsMap = JSON.parse(accountsJson); } catch { /* ignore */ }
    }

    const foundAccount = accountsMap[cleanPhone];
    if (foundAccount) {
      // Existing permanent account found
      setExistingUser(foundAccount);
      setFullName(foundAccount.name);
    } else {
      if (!fullName.trim()) {
        setErrorMsg('Masukkan nama lengkap Anda untuk pendaftaran baru.');
        return;
      }
      setExistingUser(null);
    }

    setErrorMsg('');
    setIsSending(true);

    setTimeout(() => {
      // 6-digit random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setStep('verify_otp');
      setCountdown(60);
      setIsSending(false);

      // Trigger realistic SMS notification banner
      setIncomingSms(code);
      playCoinSound();

      // Focus first OTP field
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 700);
  };

  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1).replace(/[^0-9]/g, '');
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);

    // Auto advance to next box
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      const digits = generatedOtp.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode !== generatedOtp) {
      setErrorMsg('Kode OTP salah. Silakan periksa SMS dan coba lagi.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      const cleanPhone = normalizePhone(phoneNumber);
      const accountsJson = localStorage.getItem('pitube_accounts_permanent');
      let accountsMap: Record<string, UserProfile> = {};
      if (accountsJson) {
        try { accountsMap = JSON.parse(accountsJson); } catch { /* ignore */ }
      }

      let targetUser: UserProfile;

      if (existingUser) {
        // Satu no HP satu akun: Load existing permanent account
        targetUser = existingUser;
        onRegisterSuccess(targetUser, true);
      } else {
        // Brand new account: MUST START STRICTLY FROM ZERO
        const randomWalletId = 'GDN' + Math.random().toString(36).substring(2, 9).toUpperCase() + 'PI000ZERO';

        targetUser = {
          id: `user_${Date.now()}`,
          name: fullName.trim(),
          handle: `@${fullName.trim().toLowerCase().replace(/\s+/g, '')}${Math.floor(10 + Math.random() * 90)}`,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          bio: 'Pioneer baru di pi Tube 🚀 Mulai dari 0 Pi, nonton video setiap hari untuk kumpulkan koin Pi!',
          isKycVerified: true,
          // STRICT ZERO BALANCE REQUIREMENT FOR NEW USERS
          piBalance: 0.0000,
          idrBalance: 0,
          totalWatchedCount: 0,
          totalPiEarned: 0.0000,
          watchedVideoIds: [],
          referralCode: `PITUBE-${Math.floor(1000 + Math.random() * 9000)}`,
          piWalletAddress: randomWalletId,
          followersCount: 0,
          followingCount: 0,
          dailyCheckedIn: false,
          phone: cleanPhone,
          isRegistered: true,
        };

        // Permanently record this phone number
        accountsMap[cleanPhone] = targetUser;
        localStorage.setItem('pitube_accounts_permanent', JSON.stringify(accountsMap));

        onRegisterSuccess(targetUser, false);
      }

      playCoinSound();
      fireCoinConfetti();
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Simulated In-App SMS Banner */}
      {incomingSms && (
        <div 
          onClick={handleAutoFillOtp}
          className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 bg-[#1e073c] border-2 border-yellow-400 p-3 rounded-2xl shadow-[0_0_25px_rgba(250,204,21,0.6)] cursor-pointer animate-bounce flex items-center gap-3"
          title="Klik untuk mengisi otomatis kode OTP"
        >
          <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[10px] font-black text-yellow-400 flex items-center gap-1 uppercase tracking-wider">
              <span>SMS Masuk • PI-TUBE VERIFIKASI</span>
            </div>
            <p className="text-xs text-white font-medium truncate mt-0.5">
              Kode OTP Anda adalah <span className="text-yellow-400 font-black text-sm tracking-widest">{incomingSms}</span>
            </p>
            <span className="text-[10px] text-yellow-300 font-semibold underline block mt-0.5">
              Ketuk di sini untuk isi otomatis OTP ⚡
            </span>
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <div 
        className="w-full max-w-md bg-[#110526] border border-purple-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-purple-900/50 bg-[#170733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PiCoinIcon size={30} />
            <div>
              <h3 className="font-black text-yellow-400 text-base leading-tight">
                {step === 'input_phone' 
                  ? 'Pendaftaran & Masuk No HP' 
                  : existingUser 
                  ? 'Verifikasi Akun Terdaftar' 
                  : 'Verifikasi Akun Baru'}
              </h3>
              <p className="text-[11px] text-purple-300">
                1 Nomor HP = 1 Akun Permanen • Pengguna baru mulai 0 Pi
              </p>
            </div>
          </div>
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        {step === 'input_phone' ? (
          <form onSubmit={handleSendOtp} className="p-5 space-y-4">
            {/* Policy notice: 1 nomor HP = 1 Akun permanen */}
            <div className="bg-gradient-to-r from-purple-950 to-[#26084a] border border-yellow-400/40 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-400/20 border border-yellow-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-yellow-300 block">
                  Ketentuan Akun Pioneer
                </span>
                <p className="text-gray-300 text-[11px] mt-0.5">
                  Satu nomor HP berlaku untuk 1 akun permanen. Dompet pengguna baru mulai dari <strong className="text-yellow-400">0.0000 Pi</strong>.
                </p>
              </div>
            </div>

            {/* Nomor Handphone */}
            <div>
              <label className="block text-xs font-bold text-yellow-400 mb-1">
                Nomor Handphone (WhatsApp / SMS) <span className="text-red-400">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-xs text-yellow-400 font-bold border-r border-purple-800 pr-2 pointer-events-none">
                  <span>+62</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="812-3456-7890"
                  className="w-full bg-black/60 border border-purple-700/70 focus:border-yellow-400 rounded-xl pl-16 pr-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 outline-none transition-all"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Jika nomor sudah pernah terdaftar, akun permanen Anda akan dimuat.
              </span>
            </div>

            {/* Nama Lengkap (untuk akun baru) */}
            <div>
              <label className="block text-xs font-bold text-yellow-400 mb-1">
                Nama Lengkap Pioneer (Untuk Akun Baru)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Pratama"
                className="w-full bg-black/60 border border-purple-700/70 focus:border-yellow-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 outline-none transition-all"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-[11px] text-red-400 bg-red-950/40 border border-red-800/60 p-2 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Mengirimkan Kode OTP...
                </span>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  <span>Kirim Kode OTP Verifikasi</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="p-5 space-y-4">
            <div className="text-center space-y-1">
              {existingUser ? (
                <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold mb-2">
                  Nomor sudah terdaftar a.n <strong>{existingUser.name}</strong>. Masukkan OTP untuk masuk.
                </div>
              ) : (
                <span className="text-xs text-gray-300">
                  Masukkan 6-digit kode OTP untuk akun baru:
                </span>
              )}
              <div className="text-sm font-black text-yellow-400">
                {phoneNumber}
              </div>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2 py-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-12 text-center text-lg font-black bg-black/70 border-2 border-purple-700/80 focus:border-yellow-400 rounded-xl text-yellow-300 outline-none transition-all"
                />
              ))}
            </div>

            {/* Quick Fill Button if SMS arrived */}
            {generatedOtp && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="text-[11px] text-yellow-400 bg-purple-950/80 border border-yellow-400/40 px-3 py-1 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Isi Otomatis ({generatedOtp})</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="text-[11px] text-red-400 bg-red-950/40 border border-red-800/60 p-2 rounded-lg text-center">
                {errorMsg}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isVerifying || otpDigits.some(d => !d)}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Memverifikasi Akun...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{existingUser ? 'Verifikasi & Masuk Akun' : 'Verifikasi & Buat Akun (0 Pi)'}</span>
                </>
              )}
            </button>

            {/* Resend & Back controls */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep('input_phone')}
                className="text-purple-300 hover:text-yellow-400 transition-colors"
              >
                Ganti Nomor HP
              </button>

              <button
                type="button"
                disabled={countdown > 0}
                onClick={handleSendOtp}
                className={`font-semibold transition-colors ${
                  countdown > 0 ? 'text-gray-500' : 'text-yellow-400 hover:underline'
                }`}
              >
                {countdown > 0 ? `Kirim ulang (${countdown}s)` : 'Kirim Ulang OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
