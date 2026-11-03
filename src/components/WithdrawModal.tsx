import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, ShieldCheck, Sparkles, Building2, Wallet } from 'lucide-react';
import { UserProfile } from '../types';
import { formatIdr } from '../utils/formatters';
import { fireBigWithdrawConfetti } from '../utils/confetti';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onWithdrawSuccess: (amountIdr: number, method: string, accountNum: string, accountName: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'DANA', name: 'DANA', type: 'ewallet', color: 'from-blue-600 to-sky-500' },
  { id: 'GoPay', name: 'GoPay', type: 'ewallet', color: 'from-emerald-600 to-teal-500' },
  { id: 'OVO', name: 'OVO', type: 'ewallet', color: 'from-purple-600 to-indigo-600' },
  { id: 'ShopeePay', name: 'ShopeePay', type: 'ewallet', color: 'from-orange-600 to-amber-500' },
  { id: 'BCA', name: 'Bank BCA', type: 'bank', color: 'from-blue-700 to-blue-900' },
  { id: 'BRI', name: 'Bank BRI', type: 'bank', color: 'from-blue-800 to-sky-700' },
  { id: 'Mandiri', name: 'Bank Mandiri', type: 'bank', color: 'from-amber-600 to-yellow-600' }
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onWithdrawSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState<number>(100000);
  const [accountNumber, setAccountNumber] = useState('081234567890');
  const [accountName, setAccountName] = useState(userProfile.name);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    id: string;
    amount: number;
    method: string;
    accountNumber: string;
    accountName: string;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [50000, 100000, 250000, 500000, userProfile.idrBalance];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > userProfile.idrBalance || !accountNumber || !accountName) {
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      onWithdrawSuccess(amount, selectedMethod.name, accountNumber, accountName);
      fireBigWithdrawConfetti();

      setReceipt({
        id: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
        amount,
        method: selectedMethod.name,
        accountNumber,
        accountName,
        date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      });

      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#120529] border border-purple-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/50 bg-[#170633]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-yellow-400 text-base leading-tight">
                Penarikan Saldo Rupiah
              </h3>
              <p className="text-[11px] text-purple-300">
                Tarik dana hasil tukar koin Pi ke rekening Anda
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

        {receipt ? (
          /* Receipt Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                BERHASIL DICAIRKAN
              </span>
              <h4 className="text-xl font-black text-yellow-400 mt-1">
                {formatIdr(receipt.amount)}
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                Dana penarikan sedang dikirimkan ke akun Anda (1-3 menit).
              </p>
            </div>

            <div className="bg-black/60 border border-purple-800 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">ID Transaksi:</span>
                <span className="text-yellow-400 font-mono font-bold">{receipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Metode Penarikan:</span>
                <span className="text-white font-medium">{receipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nomor Rekening / HP:</span>
                <span className="text-white font-mono">{receipt.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nama Penerima:</span>
                <span className="text-white font-bold">{receipt.accountName}</span>
              </div>
              <div className="flex justify-between border-t border-purple-900/50 pt-2">
                <span className="text-gray-400">Biaya Admin:</span>
                <span className="text-emerald-400 font-bold">Rp 0 (Gratis)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setReceipt(null);
                onClose();
              }}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-xl transition-all shadow-md text-xs sm:text-sm"
            >
              Selesai
            </button>
          </div>
        ) : (
          /* Withdraw Form */
          <form onSubmit={handleWithdraw} className="p-5 overflow-y-auto space-y-4 scrollbar-thin">
            {/* Balance info */}
            <div className="bg-gradient-to-r from-purple-950 to-[#220745] border border-purple-700/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-yellow-400" />
                <span className="text-xs text-gray-300">Saldo Rupiah Tersedia</span>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">
                {formatIdr(userProfile.idrBalance)}
              </span>
            </div>

            {/* Select Destination Method */}
            <div>
              <label className="block text-xs font-bold text-yellow-400 mb-2">
                Pilih Bank / e-Wallet Tujuan
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedMethod.id === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedMethod(pm)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${
                        isSelected
                          ? 'border-yellow-400 bg-purple-900/70 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.3)] scale-102'
                          : 'border-purple-800/60 bg-black/40 text-gray-300 hover:border-purple-600'
                      }`}
                    >
                      {pm.type === 'ewallet' ? (
                        <Wallet className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Building2 className="w-4 h-4 text-sky-400" />
                      )}
                      <span className="text-[11px] font-bold">{pm.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-yellow-400 mb-1">
                  Nomor Rekening / No. HP
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="0812xxxx atau no. rekening"
                  className="w-full bg-black/60 border border-purple-700/70 focus:border-yellow-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-yellow-400 mb-1">
                  Nama Pemilik Akun
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Nama sesuai KTP/e-Wallet"
                  className="w-full bg-black/60 border border-purple-700/70 focus:border-yellow-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-yellow-400">Jumlah Penarikan (IDR)</span>
                <span className="text-gray-400 text-[11px]">Min. Rp 20.000</span>
              </div>
              <div className="relative bg-black/60 border border-purple-700/80 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm font-bold text-yellow-400">Rp</span>
                <input
                  type="number"
                  step="10000"
                  min="20000"
                  max={userProfile.idrBalance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-right bg-transparent text-lg font-black text-white outline-none pl-2"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex gap-1.5 flex-wrap mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      amount === q
                        ? 'bg-yellow-400 text-black border-yellow-300'
                        : 'bg-purple-950/60 text-purple-300 border-purple-800 hover:text-white'
                    }`}
                  >
                    {q === userProfile.idrBalance ? 'Tarik Semua' : formatIdr(q)}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-purple-950/30 border border-purple-900/40 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gratis biaya admin (0%). Penarikan otomatis diproses seketika ke {selectedMethod.name}.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={amount <= 0 || amount > userProfile.idrBalance || isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Mengirimkan Dana...
                </span>
              ) : amount > userProfile.idrBalance ? (
                'Saldo Rupiah Tidak Cukup'
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cairkan Saldo ke {selectedMethod.name}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
