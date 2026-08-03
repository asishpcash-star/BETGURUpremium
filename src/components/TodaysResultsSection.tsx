import React, { useState, useEffect } from 'react';
import { DrawSlot } from '../types';
import { Clock, Trophy, Sparkles, ArrowRight, Zap, CheckCircle, Hourglass } from 'lucide-react';

interface TodaysResultsSectionProps {
  draws: DrawSlot[];
  onViewAllResults: () => void;
  onBuyForSlot: (slot: DrawSlot) => void;
}

export const TodaysResultsSection: React.FC<TodaysResultsSectionProps> = ({
  draws,
  onViewAllResults,
  onBuyForSlot,
}) => {
  const publishedSlots = draws.filter((d) => d.status === 'Published');
  const latestPublished = publishedSlots[publishedSlots.length - 1];
  const nextSlot = draws.find((d) => d.status === 'Upcoming' || d.status === 'Live') || draws[0];

  // Countdown logic for next draw
  const [timeLeft, setTimeLeft] = useState({ min: 14, sec: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
        if (prev.min > 0) return { min: prev.min - 1, sec: 59 };
        return { min: 29, sec: 59 }; // Reset for next 30 min slot
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-zinc-950 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Clock className="h-4 w-4 animate-spin-slow" />
              Real-time 30-Min Schedule (29 Slots)
            </div>
            <h2 className="text-3xl font-serif font-bold text-zinc-100">Today's Draw Results</h2>
          </div>

          <button
            onClick={onViewAllResults}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all"
          >
            <span>View All 29 Draw Slots</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Latest Published Result Card */}
          <div className="relative rounded-2xl bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950 p-6 border border-amber-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Latest Published
              </span>
              <span className="text-xs font-mono text-zinc-400">{latestPublished?.timeLabel || '08:00 AM'}</span>
            </div>

            <p className="text-xs text-zinc-400 uppercase font-mono tracking-wider">Winning Lucky Number</p>

            <div className="my-4 flex items-center justify-center gap-2.5 sm:gap-3">
              {latestPublished?.winningNumber ? (
                latestPublished.winningNumber.split('').map((digit, idx) => (
                  <div
                    key={idx}
                    className="winning-number-ball flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center font-mono text-2xl sm:text-3xl"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    {digit}
                  </div>
                ))
              ) : (
                <div className="text-amber-400 font-mono font-bold text-xl">Awaiting Draw...</div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
              <span>Lottery: <strong className="text-zinc-200">Luxe 30-Min Rapid</strong></span>
              <span className="text-emerald-400 font-semibold">{latestPublished?.winningTicketCount || 1} Winner(s)</span>
            </div>
          </div>

          {/* 2. Next Draw Countdown Timer Card */}
          <div className="relative rounded-2xl bg-zinc-900 p-6 border border-amber-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Hourglass className="h-3.5 w-3.5 animate-pulse" /> Next Upcoming Slot
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">Slot #{nextSlot?.slotIndex}</span>
              </div>

              <h3 className="text-lg font-bold text-zinc-100">{nextSlot?.timeLabel} Draw</h3>
              <p className="text-xs text-zinc-400">Tickets closing in</p>

              {/* Countdown Numbers */}
              <div className="my-3 flex items-center justify-center gap-3 font-mono">
                <div className="text-center">
                  <div className="h-12 w-14 rounded-xl bg-zinc-950 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-inner">
                    00
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase">Hours</span>
                </div>
                <span className="text-2xl text-amber-500 font-bold">:</span>
                <div className="text-center">
                  <div className="h-12 w-14 rounded-xl bg-zinc-950 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-inner">
                    {String(timeLeft.min).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase">Mins</span>
                </div>
                <span className="text-2xl text-amber-500 font-bold">:</span>
                <div className="text-center">
                  <div className="h-12 w-14 rounded-xl bg-zinc-950 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-2xl shadow-inner">
                    {String(timeLeft.sec).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase">Secs</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onBuyForSlot(nextSlot)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              Buy Ticket For {nextSlot?.timeLabel} ($50)
            </button>
          </div>

          {/* 3. 29 Slots Quick Grid Snapshot */}
          <div className="relative rounded-2xl bg-zinc-900/90 p-6 border border-zinc-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                29 Daily Slots Schedule
              </h3>
              <p className="text-xs text-zinc-400 mb-3">Draws start at 08:00 AM and end at 10:00 PM every 30 minutes.</p>

              <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {draws.slice(0, 16).map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-1.5 rounded text-[10px] font-mono font-bold text-center border transition-all ${
                      slot.status === 'Published'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : slot.status === 'Live'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div>{slot.timeLabel}</div>
                    <div className="text-[9px] opacity-80">{slot.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onViewAllResults}
              className="w-full mt-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-semibold border border-zinc-700"
            >
              Full 29 Draw Schedule & Archives
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
