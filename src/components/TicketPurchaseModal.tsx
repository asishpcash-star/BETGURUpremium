import React, { useState } from 'react';
import { LotteryGame, DrawSlot } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  Ticket,
  Dices,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react';

interface TicketPurchaseModalProps {
  lottery: LotteryGame;
  drawSlots: DrawSlot[];
  onClose: () => void;
  onSuccess: () => void;
}

export const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({
  lottery,
  drawSlots,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUser, setActiveModal } = useAuth();

  // Find upcoming slot default
  const upcomingSlots = drawSlots.filter((s) => s.status === 'Upcoming' || s.status === 'Live');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    upcomingSlots[0]?.id || drawSlots[0]?.id || ''
  );

  const digitCount = lottery.winningDigitsCount || 4;

  const generateRandomDigits = () => {
    let result = '';
    for (let i = 0; i < digitCount; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const [ticketNumbers, setTicketNumbers] = useState<string[]>([generateRandomDigits()]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalCost = lottery.ticketPrice * ticketNumbers.length;
  const userBalance = user?.walletBalance || 0;
  const hasSufficientBalance = userBalance >= totalCost;

  const handleAddTicket = () => {
    if (ticketNumbers.length >= 10) {
      setErrorMsg('Maximum 10 tickets per order');
      return;
    }
    setTicketNumbers([...ticketNumbers, generateRandomDigits()]);
  };

  const handleRemoveTicket = (index: number) => {
    if (ticketNumbers.length === 1) return;
    setTicketNumbers(ticketNumbers.filter((_, i) => i !== index));
  };

  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, digitCount);
    const updated = [...ticketNumbers];
    updated[index] = cleaned;
    setTicketNumbers(updated);
  };

  const handleQuickPickAll = () => {
    setTicketNumbers(ticketNumbers.map(() => generateRandomDigits()));
  };

  const handlePurchase = async () => {
    setErrorMsg('');
    if (!user) {
      setActiveModal('login');
      return;
    }

    if (!hasSufficientBalance) {
      setErrorMsg('Insufficient wallet balance. Please deposit funds.');
      return;
    }

    // Validate all tickets have required digit count
    for (const num of ticketNumbers) {
      if (num.length !== digitCount) {
        setErrorMsg(`Each ticket must have exactly ${digitCount} digits.`);
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/tickets/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          lotteryId: lottery.id,
          drawSlotId: selectedSlotId,
          ticketNumbers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Trigger celebratory confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff'],
        });

        await refreshUser();
        onSuccess();
      } else {
        setErrorMsg(data.error || 'Failed to purchase tickets.');
      }
    } catch (err) {
      setErrorMsg('Network error while purchasing ticket.');
    } finally {
      setLoading(false);
    }
  };

  const selectedSlot = drawSlots.find((s) => s.id === selectedSlotId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 md:p-8 shadow-2xl text-zinc-100 my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-1">
          <Ticket className="h-4 w-4" /> Ticket Selector & Order
        </div>
        <h2 className="text-2xl font-serif font-bold text-zinc-100 mb-2">
          {lottery.title}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Pick your lucky {digitCount}-digit combination or auto-generate numbers.
        </p>

        {/* Slot Selection */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-bold text-zinc-300 uppercase font-mono">
            Target Draw Slot (29 Daily Slots)
          </label>
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold outline-none focus:border-amber-400"
          >
            {upcomingSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.timeLabel} Draw - Slot #{slot.slotIndex} ({slot.status})
              </option>
            ))}
          </select>
        </div>

        {/* Ticket Numbers Picker Section */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase font-mono">
              Selected Lucky Numbers ({ticketNumbers.length})
            </span>
            <button
              onClick={handleQuickPickAll}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold"
            >
              <Dices className="h-3.5 w-3.5" />
              Quick Pick All
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {ticketNumbers.map((num, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800"
              >
                <span className="text-xs font-mono text-zinc-500">#{idx + 1}</span>

                <input
                  type="text"
                  maxLength={digitCount}
                  value={num}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  placeholder="0000"
                  className="flex-1 bg-zinc-900 border border-amber-500/30 rounded-lg px-3 py-1.5 text-center font-mono text-lg font-bold tracking-widest text-amber-400 outline-none focus:border-amber-400"
                />

                <button
                  onClick={() => {
                    const updated = [...ticketNumbers];
                    updated[idx] = generateRandomDigits();
                    setTicketNumbers(updated);
                  }}
                  className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-amber-400 border border-zinc-800"
                  title="Randomize single ticket"
                >
                  <Dices className="h-4 w-4" />
                </button>

                {ticketNumbers.length > 1 && (
                  <button
                    onClick={() => handleRemoveTicket(idx)}
                    className="p-2 rounded-lg bg-zinc-900 text-rose-400 hover:text-rose-300 border border-zinc-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAddTicket}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-zinc-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Another Ticket ($50)
          </button>
        </div>

        {/* Cost & Balance Summary */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs mb-6">
          <div className="flex justify-between text-zinc-400">
            <span>Price per Ticket:</span>
            <span className="font-mono text-zinc-200">${lottery.ticketPrice}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Quantity:</span>
            <span className="font-mono text-zinc-200">{ticketNumbers.length} Ticket(s)</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-amber-400 pt-2 border-t border-zinc-800">
            <span>Total Amount Due:</span>
            <span className="font-mono">${totalCost}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400 pt-1">
            <span>Your Wallet Balance:</span>
            <span className={`font-mono font-bold ${hasSufficientBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${userBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        {!hasSufficientBalance ? (
          <button
            onClick={() => {
              onClose();
              setActiveModal('deposit');
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Wallet className="h-4 w-4" /> Deposit Funds To Purchase
          </button>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-zinc-950" />
            {loading ? 'Processing Order...' : `Confirm & Purchase (${ticketNumbers.length} Tickets)`}
          </button>
        )}

      </div>
    </div>
  );
};
