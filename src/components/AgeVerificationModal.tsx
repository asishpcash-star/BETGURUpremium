import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('luxelotto_age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('luxelotto_age_verified', 'true');
    setIsOpen(false);
  };

  const handleReject = () => {
    alert('Notice: You must be 18 years or older to participate in online lottery games according to local regulations.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl shadow-amber-900/30 text-center text-zinc-100">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-400 mb-2">
          Age & Legal Verification
        </h2>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          Online lottery games involve financial risk. You must be at least <strong className="text-amber-400">18 years of age or older</strong> and comply with local gaming laws in your jurisdiction to access LuxeLotto.
        </p>

        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200/90 mb-6 flex items-start gap-2.5 text-left">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Please gamble responsibly. Only play with funds you can afford to lose.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleReject}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
          >
            I am Under 18
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <CheckCircle2 className="h-5 w-5" />
            I am 18+ & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
