import React from 'react';
import { Crown, Sparkles, Trophy, Flame, ChevronRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroBannerProps {
  onPlayClick: () => void;
  onResultsClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onPlayClick, onResultsClick }) => {
  return (
    <div className="relative overflow-hidden bg-zinc-950 border-b border-amber-500/20 py-8 sm:py-12 lg:py-16">
      {/* Background Glows & Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Official 30-Min Live Draw Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-zinc-100 leading-[1.15] tracking-tight">
              Where Fortunes <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
                Unfold Every 30 Minutes
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Experience the pinnacle of luxury online lottery. 29 Daily Draw slots from 8:00 AM to 10:00 PM with instant wallet payouts, transparent auto-draws, and maximum jackpot odds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onPlayClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 group"
              >
                <Crown className="h-5 w-5 text-zinc-950 group-hover:rotate-12 transition-transform" />
                Play 30-Min Draw ($50)
                <ChevronRight className="h-5 w-5 text-zinc-950" />
              </button>

              <button
                onClick={onResultsClick}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900 border border-amber-500/30 hover:border-amber-400 hover:bg-zinc-800 text-amber-300 font-bold text-base flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="h-5 w-5 text-amber-400" />
                View 29 Draw Results
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-xl font-bold font-mono text-amber-400">29</p>
                <p className="text-xs text-zinc-400">Daily Draw Slots</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-amber-400">100%</p>
                <p className="text-xs text-zinc-400">Instant Wallet Payout</p>
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-amber-400">$1,000,000</p>
                <p className="text-xs text-zinc-400">Max Jackpot Prize</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Jackpot Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 border border-amber-500/40 shadow-2xl shadow-amber-900/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-widest shadow-md flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 fill-zinc-950" /> Live Mega Jackpot
              </div>

              <div className="text-center pt-2 pb-6 border-b border-zinc-800">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Current Combined Pool</span>
                <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-amber-400 mt-2 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                  $1,000,000
                </div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Growing with every ticket purchased
                </div>
              </div>

              {/* Next Draw Countdown Box */}
              <div className="mt-6 p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 text-center">
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2">Next Draw Status</p>
                <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold text-zinc-100">
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-400">00</span>
                  <span>:</span>
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-400">14</span>
                  <span>:</span>
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-400">32</span>
                </div>
                <p className="text-[11px] text-amber-400/90 mt-2">Slot #18 (04:30 PM Draw) Closing Soon!</p>
              </div>

              {/* Recent Winner Marquee Mini Card */}
              <div className="mt-6 p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="text-xs overflow-hidden">
                  <p className="text-amber-200 font-bold truncate">Rahul S. won $1,000!</p>
                  <p className="text-zinc-400 text-[11px] truncate">Ticket #7482 in 08:30 AM Draw</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
