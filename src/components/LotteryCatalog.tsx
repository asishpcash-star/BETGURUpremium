import React, { useState } from 'react';
import { LotteryGame, LotteryCategory } from '../types';
import { Crown, Sparkles, Trophy, Ticket, Clock, Zap, ShieldCheck, Flame } from 'lucide-react';

interface LotteryCatalogProps {
  lotteries: LotteryGame[];
  onBuyTicket: (lottery: LotteryGame) => void;
}

export const LotteryCatalog: React.FC<LotteryCatalogProps> = ({ lotteries, onBuyTicket }) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Daily 30-Min', 'Weekly Mega', 'Special VIP'];

  const filtered = lotteries.filter(
    (l) => selectedCat === 'All' || l.category === selectedCat
  );

  return (
    <div className="py-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-400" /> Premium Lottery Collection
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-zinc-100">
            Choose Your Fortune
          </h2>
          <p className="text-sm text-zinc-300">
            Select from our daily 30-minute rapid draws, weekly bumper jackpots, or exclusive VIP high-roller games.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((game) => (
            <div
              key={game.id}
              className="relative group rounded-3xl bg-zinc-900 border border-amber-500/30 hover:border-amber-400/80 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Header Gradient */}
              <div className={`p-6 bg-gradient-to-br ${game.bannerBg} border-b border-amber-500/20`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-zinc-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider font-mono">
                    {game.category}
                  </span>
                  <span className="text-xs text-amber-200/90 font-mono font-semibold">#{game.code}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-zinc-100 mt-2">{game.title}</h3>
                <p className="text-xs text-zinc-300/90 mt-1 line-clamp-2">{game.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                {/* Jackpot Prize Big Display */}
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-500/20 text-center">
                  <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">Grand Jackpot</span>
                  <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                    ${game.jackpotAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <Flame className="h-3 w-3 fill-emerald-400" />
                    {game.winningDigitsCount}-Digit Lucky Number Draw
                  </div>
                </div>

                {/* Info list */}
                <div className="space-y-2 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Schedule:</span>
                    <span className="font-semibold text-amber-300">
                      {game.drawScheduleType === '30_MIN' ? 'Every 30 Mins (29 Slots/Day)' : 'Weekly Draw'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Ticket Price:</span>
                    <span className="font-bold text-amber-400 font-mono">${game.ticketPrice} / Ticket</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Tickets Sold:</span>
                    <span className="font-mono text-zinc-300">{(game.totalSold || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => onBuyTicket(game)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Ticket className="h-4 w-4 text-zinc-950" />
                  Buy Ticket (${game.ticketPrice})
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
