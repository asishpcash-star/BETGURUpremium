import React, { useState } from 'react';
import { BetGuruLogo } from './BetGuruLogo';
import { Crown, ShieldCheck, HelpCircle, Mail, Phone, AlertTriangle, ChevronDown, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const faqs = [
    {
      q: 'How does the 30-Minute Daily Lottery Schedule work?',
      a: 'LuxeLotto hosts 29 daily draws starting from 08:00 AM until 10:00 PM every 30 minutes. You can purchase tickets for any upcoming slot until 1 minute before draw time.',
    },
    {
      q: 'How are winning lottery numbers generated?',
      a: 'Numbers are generated using cryptographically secure random number generators (RNG) in Auto-Publish mode, or verified by Super Admin in Manual mode with full audit logs.',
    },
    {
      q: 'How long do wallet deposits and withdrawals take?',
      a: 'Deposits via UPI, QR Code, or Bank Transfer are credited instantly upon submitting your payment reference (UTR). Withdrawals are processed 24/7 directly to your bank account.',
    },
    {
      q: 'Are winnings credited automatically?',
      a: 'Yes! As soon as a draw result is published, our system scans all active tickets and credits jackpot winnings directly to your LuxeLotto wallet balance.',
    },
  ];

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setShowContactModal(false);
      setContactSent(false);
      setContactMessage('');
    }, 2000);
  };

  return (
    <footer className="bg-zinc-950 border-t border-amber-500/20 text-zinc-400 text-xs">
      {/* FAQ Accordion Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-zinc-800">
        <div className="text-center mb-8">
          <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
            Help & Transparency
          </span>
          <h3 className="text-2xl font-serif font-bold text-zinc-100 mt-1">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-900 border border-zinc-800/80 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-zinc-200 flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-500 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              {activeFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-zinc-400 text-xs leading-relaxed border-t border-zinc-800/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1 Brand */}
        <div className="space-y-3">
          <BetGuruLogo size="md" />
          <p className="text-zinc-400 leading-relaxed text-xs">
            BETGURU is the premier online lottery platform featuring 29 daily 30-minute draw slots, instant wallet settlements, and verified jackpot payouts.
          </p>
        </div>

        {/* Col 2 Schedule */}
        <div className="space-y-2">
          <h4 className="text-zinc-200 font-bold uppercase font-mono text-xs text-amber-400">Daily Draw Hours</h4>
          <p className="text-zinc-400">First Slot: <strong className="text-zinc-200">08:00 AM</strong></p>
          <p className="text-zinc-400">Last Slot: <strong className="text-zinc-200">10:00 PM</strong></p>
          <p className="text-zinc-400">Frequency: <strong className="text-amber-300">Every 30 Minutes</strong></p>
          <p className="text-zinc-400">Total Slots: <strong className="text-amber-300">29 Daily Draws</strong></p>
        </div>

        {/* Col 3 Compliance */}
        <div className="space-y-2">
          <h4 className="text-zinc-200 font-bold uppercase font-mono text-xs text-amber-400">Security & License</h4>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="h-4 w-4" /> 256-Bit SSL Encrypted
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Fully licensed and compliant with international gaming standards. Guaranteed payout liquidity reserves.
          </p>
        </div>

        {/* Col 4 Contact */}
        <div className="space-y-3">
          <h4 className="text-zinc-200 font-bold uppercase font-mono text-xs text-amber-400">24/7 VIP Support</h4>
          <p className="text-zinc-400 flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-400" /> support@betguru.com
          </p>
          <p className="text-zinc-400 flex items-center gap-2">
            <Phone className="h-4 w-4 text-amber-400" /> +1 800 589 3568
          </p>
          <button
            onClick={() => setShowContactModal(true)}
            className="w-full py-2 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 hover:bg-zinc-800 font-bold"
          >
            Contact Customer Care
          </button>
        </div>

      </div>

      {/* Compliance Disclaimer Notice Banner */}
      <div className="bg-zinc-900 border-t border-zinc-800 py-4 px-4 text-center text-[11px] text-zinc-500">
        <div className="max-w-4xl mx-auto space-y-1">
          <p className="text-amber-400/90 font-bold flex items-center justify-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> 18+ Responsible Gaming Warning / দায়িত্বশীল গেমিং নোটিশ
          </p>
          <p>
            অনলাইন লটারি পরিচালনা ও খেলায় অংশ নেওয়ার আগে আপনার দেশের প্রযোজ্য আইন, বয়স সীমা (১৮+) এবং নিয়ন্ত্রক শর্তাবলী মেনে চলুন। Gambling can be addictive. Please play responsibly.
          </p>
          <p className="pt-2 text-zinc-600 font-mono">
            © 2026 BETGURU Official Platform. All rights reserved.
          </p>
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 shadow-2xl text-zinc-100">
            <h3 className="text-xl font-serif font-bold text-amber-400 mb-2">24/7 VIP Customer Support</h3>
            <p className="text-xs text-zinc-400 mb-4">Leave us a message regarding ticket inquiries or wallet assistance.</p>

            {contactSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center text-emerald-300 text-xs font-bold space-y-1">
                <p>✅ Message Delivered!</p>
                <p className="text-[10px] text-zinc-400 font-normal">Our team will respond within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-3">
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your query or issue..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
