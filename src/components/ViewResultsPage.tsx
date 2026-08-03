import React, { useState } from 'react';
import { DrawSlot } from '../types';
import {
  Clock,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Hourglass,
  Sparkles,
  Trophy,
  Ticket,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface ViewResultsPageProps {
  draws: DrawSlot[];
  onBuyTicketForSlot: (slot: DrawSlot) => void;
  onRefresh: () => void;
}

export const ViewResultsPage: React.FC<ViewResultsPageProps> = ({
  draws,
  onBuyTicketForSlot,
  onRefresh,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Upcoming' | 'Live'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDraws = draws.filter((slot) => {
    const matchesStatus = statusFilter === 'all' || slot.status === statusFilter;
    const matchesQuery =
      slot.timeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (slot.winningNumber && slot.winningNumber.includes(searchQuery)) ||
      slot.slotIndex.toString().includes(searchQuery);

    return matchesStatus && matchesQuery;
  });

  const totalPublished = draws.filter((s) => s.status === 'Published').length;
  const totalUpcoming = draws.filter((s) => s.status === 'Upcoming' || s.status === 'Live').length;

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-amber-950/30 to-zinc-900 p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-1">
              <Clock className="h-4 w-4" /> 29 Scheduled Daily Draws (08:00 AM - 10:00 PM)
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-zinc-100">
              Live Lottery Results Dashboard
            </h1>
            <p className="text-sm text-zinc-300 mt-1">
              Verified auto-draw results updated every 30 minutes with instant wallet prize settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="p-3 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 hover:bg-zinc-800 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCw className="h-4 w-4 text-amber-400" />
              Sync Live Results
            </button>
          </div>
        </div>

        {/* Stats summary banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-xs text-zinc-400 font-mono uppercase">Total Daily Slots</p>
            <p className="text-2xl font-mono font-bold text-amber-400 mt-1">29 Slots</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-center">
            <p className="text-xs text-zinc-400 font-mono uppercase">Published Draws</p>
            <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{totalPublished} Slots</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/30 text-center">
            <p className="text-xs text-zinc-400 font-mono uppercase">Upcoming / Live</p>
            <p className="text-2xl font-mono font-bold text-amber-300 mt-1">{totalUpcoming} Slots</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-xs text-zinc-400 font-mono uppercase">Frequency</p>
            <p className="text-2xl font-mono font-bold text-zinc-200 mt-1">Every 30 Mins</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search slot time (e.g., 08:30 AM) or winning number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs placeholder:text-zinc-600 outline-none"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {(['all', 'Published', 'Live', 'Upcoming'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-950 text-zinc-400 hover:text-amber-300 border border-zinc-800'
                }`}
              >
                {st === 'all' ? 'All 29 Slots' : st}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-300 shrink-0">
            <Calendar className="h-4 w-4 text-amber-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-amber-300 font-mono outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* 29 Slot Results Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDraws.map((slot) => {
            const isPublished = slot.status === 'Published';
            const isLive = slot.status === 'Live';

            return (
              <div
                key={slot.id}
                className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isPublished
                    ? 'bg-gradient-to-b from-amber-950/20 via-zinc-900 to-zinc-950 border-amber-500/30 hover:border-amber-400/60 shadow-lg'
                    : isLive
                    ? 'bg-zinc-900 border-amber-500 shadow-xl shadow-amber-900/20 animate-pulse'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Slot #{slot.slotIndex}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isLive
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-bounce'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  {/* Draw Time */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <div>
                      <h3 className="text-xl font-mono font-bold text-zinc-100">{slot.timeLabel}</h3>
                      <p className="text-[11px] text-zinc-400">{slot.lotteryName}</p>
                    </div>
                  </div>

                  {/* Winning Number Display */}
                  <div className="py-4 my-2 rounded-xl bg-zinc-950/90 border border-zinc-800/80 text-center">
                    <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mb-2">
                      {isPublished ? 'Official Winning Number' : 'Status'}
                    </p>

                    {isPublished && slot.winningNumber ? (
                      <div className="flex items-center justify-center gap-2">
                        {slot.winningNumber.split('').map((digit, dIdx) => (
                          <span
                            key={dIdx}
                            className="flex h-11 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-zinc-950 font-mono font-black text-xl shadow-md shadow-amber-500/20"
                          >
                            {digit}
                          </span>
                        ))}
                      </div>
                    ) : isLive ? (
                      <div className="text-amber-400 font-mono font-bold text-sm animate-pulse flex items-center justify-center gap-1.5">
                        <Sparkles className="h-4 w-4" /> Draw in Progress...
                      </div>
                    ) : (
                      <div className="text-zinc-500 font-mono text-xs flex items-center justify-center gap-1.5">
                        <Hourglass className="h-4 w-4" /> Upcoming Slot
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Payout Info & Buy CTA */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  {isPublished ? (
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Prize Pool: <strong className="text-amber-300">${slot.totalPrizeDistributed.toLocaleString()}</strong></span>
                      <span className="text-emerald-400 font-semibold">{slot.winningTicketCount || 0} Winner(s)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onBuyTicketForSlot(slot)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="h-4 w-4 text-zinc-950" />
                      Buy Ticket ($50)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredDraws.length === 0 && (
          <div className="text-center py-16 rounded-3xl bg-zinc-900 border border-zinc-800">
            <Clock className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-300">No draw slots found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try clearing your search query or filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};
