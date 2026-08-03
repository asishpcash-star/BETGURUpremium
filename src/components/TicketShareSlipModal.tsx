import React, { useRef, useState } from 'react';
import { LotteryTicket } from '../types';
import {
  Crown,
  X,
  Printer,
  Share2,
  Download,
  QrCode,
  CheckCircle2,
  Sparkles,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';

interface TicketShareSlipModalProps {
  ticket: LotteryTicket;
  onClose: () => void;
}

export const TicketShareSlipModal: React.FC<TicketShareSlipModalProps> = ({
  ticket,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${window.location.origin}?ticket=${ticket.id}`;
  const qrData = `BETGURU_VERIFIED_TICKET_ID:${ticket.id}_NUM:${ticket.ticketNumber}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(
      `🎟️ BETGURU Verified Ticket Slip!\nTicket #${ticket.ticketNumber}\nGame: ${ticket.lotteryName}\nDraw: ${ticket.drawTimeLabel} (${ticket.drawDate})\nCheck Result: ${shareUrl}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(
      `🎟️ *BETGURU Official Voucher Slip*\n\n` +
      `• *Ticket #*: ${ticket.ticketNumber}\n` +
      `• *Game*: ${ticket.lotteryName}\n` +
      `• *Draw Time*: ${ticket.drawTimeLabel}\n` +
      `• *Date*: ${ticket.drawDate}\n` +
      `• *Price*: $${ticket.ticketPrice}\n` +
      `• *Status*: ${ticket.status.toUpperCase()}\n\n` +
      `Verify Ticket: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const handleTelegramShare = () => {
    const msg = encodeURIComponent(
      `🎟️ BETGURU Voucher Slip - Ticket #${ticket.ticketNumber}\nDraw: ${ticket.drawTimeLabel}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl text-zinc-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Printable Ticket Slip Area */}
        <div ref={printRef} className="space-y-6">
          
          {/* Header Voucher Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="rounded-[15px] bg-zinc-950 p-5 text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-zinc-950 font-black">
                  <Crown className="h-5 w-5 fill-zinc-950" />
                </div>
                <span className="text-xl font-serif font-black tracking-widest text-amber-400">
                  BETGURU
                </span>
              </div>
              <p className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">
                OFFICIAL DIGITAL LOTTERY VOUCHER SLIP
              </p>
            </div>
          </div>

          {/* Ticket Numbers Showcase Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900 border border-amber-500/30 text-center space-y-3 relative overflow-hidden">
            {ticket.status === 'won' && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-md">
                🏆 WINNER SLIP
              </div>
            )}

            <p className="text-xs text-zinc-400 uppercase font-mono tracking-wider">
              {ticket.lotteryName}
            </p>

            <div className="inline-block py-3 px-6 rounded-2xl bg-zinc-950 border border-amber-400/60 shadow-inner">
              <span className="text-xs text-amber-400/80 font-mono block mb-1">
                LUCKY DRAW TICKET NUMBER
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-widest drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
                #{ticket.ticketNumber}
              </span>
            </div>

            {ticket.status === 'won' && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                🎉 Prize Amount: ${ticket.prizeWon.toLocaleString()} (Credited)
              </div>
            )}
          </div>

          {/* Ticket Metadata Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-400" /> Draw Time Slot
              </span>
              <p className="font-bold text-zinc-200">{ticket.drawTimeLabel} Draw</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <Calendar className="h-3 w-3 text-amber-400" /> Draw Date
              </span>
              <p className="font-bold text-zinc-200">{ticket.drawDate}</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <User className="h-3 w-3 text-amber-400" /> User Name
              </span>
              <p className="font-bold text-zinc-200 truncate">{ticket.userName}</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Ticket Price
              </span>
              <p className="font-bold text-amber-400">${ticket.ticketPrice}</p>
            </div>
          </div>

          {/* QR Code Verification Section */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Authenticity Verified
              </span>
              <p className="text-[11px] text-zinc-400 font-mono">
                Scan QR or inspect Ticket ID to verify cryptographically on server ledger.
              </p>
              <p className="text-[9px] text-zinc-600 font-mono truncate max-w-[200px]">
                ID: {ticket.id}
              </p>
            </div>

            {/* QR Visual */}
            <div className="h-16 w-16 p-2 rounded-xl bg-zinc-900 border border-amber-500/40 flex items-center justify-center shrink-0">
              <QrCode className="h-12 w-12 text-amber-400" />
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="h-4 w-4 text-amber-400" /> Print / PDF Slip
            </button>

            <button
              onClick={handleCopyShare}
              className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" /> Copied Text!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-amber-400" /> Copy Voucher
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Share2 className="h-4 w-4" /> Share WhatsApp
            </button>

            <button
              onClick={handleTelegramShare}
              className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-zinc-100 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Share2 className="h-4 w-4" /> Share Telegram
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
