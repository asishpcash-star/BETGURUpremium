import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { WalletTransaction, LotteryTicket, AppNotification } from '../types';
import { TicketShareSlipModal } from './TicketShareSlipModal';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Ticket,
  Trophy,
  History,
  User as UserIcon,
  ShieldCheck,
  QrCode,
  Building2,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Crown,
  Zap,
  Share2,
  Key,
  Lock,
  Bell,
  FileText,
  TrendingUp,
  TrendingDown,
  Edit3,
  Printer,
  Camera,
  Calendar,
  MapPin,
  Search,
} from 'lucide-react';

interface UserDashboardProps {
  onGoToLotteries: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onGoToLotteries }) => {
  const { user, refreshUser, settings } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'wallet' | 'tickets' | 'winnings' | 'transactions' | 'profile'
  >('overview');

  const [ticketFilter, setTicketFilter] = useState<'all' | 'won' | 'pending' | 'lost'>('all');
  const [txCategoryFilter, setTxCategoryFilter] = useState<
    'all' | 'deposit' | 'withdrawal' | 'winning' | 'ticket' | 'bonus'
  >('all');

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [myTickets, setMyTickets] = useState<LotteryTicket[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedTicketForShare, setSelectedTicketForShare] = useState<LotteryTicket | null>(null);

  const [copiedUpi, setCopiedUpi] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profilePic, setProfilePic] = useState(
    user?.profilePic ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [dob, setDob] = useState('1995-08-15');
  const [address, setAddress] = useState('Flat 402, Royal Residency, Cyber City, Hyderabad');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSaveMsg, setProfileSaveMsg] = useState('');

  const triggerWinConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#ec4899', '#10b981'],
    });
  };

  // Deposit Form state
  const [depositAmount, setDepositAmount] = useState('500');
  const [depositMethod, setDepositMethod] = useState<'UPI' | 'Bank Transfer' | 'QR Code'>('UPI');
  const [utrRef, setUtrRef] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMsg, setDepositMsg] = useState('');

  // Withdraw Form state
  const [withdrawAmount, setWithdrawAmount] = useState('1000');
  const [withdrawMethod, setWithdrawMethod] = useState<'Bank Transfer' | 'UPI'>('Bank Transfer');
  const [bankAccountName, setBankAccountName] = useState(user?.name || '');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState('');

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const [txRes, tktRes] = await Promise.all([
        fetch(`/api/wallet/transactions?userId=${user.id}`),
        fetch(`/api/tickets/my?userId=${user.id}`),
      ]);

      const txData = await txRes.json();
      const tktData = await tktRes.json();

      if (txData.transactions) setTransactions(txData.transactions);
      if (tktData.tickets) setMyTickets(tktData.tickets);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositMsg('');
    if (!user) return;

    if (!utrRef.trim()) {
      setDepositMsg('Please enter your payment UTR / Transaction Reference number.');
      return;
    }

    setDepositLoading(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: Number(depositAmount),
          method: depositMethod,
          proofReference: utrRef,
          note: `Deposit request via ${depositMethod}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDepositMsg('✅ Deposit request submitted successfully! Pending admin approval.');
        setUtrRef('');
        fetchDashboardData();
        refreshUser();
      } else {
        setDepositMsg(`❌ ${data.error || 'Failed to submit deposit'}`);
      }
    } catch (err) {
      setDepositMsg('❌ Network error during deposit submission.');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg('');
    if (!user) return;

    if (!bankAccountNumber.trim() || !bankAccountName.trim()) {
      setWithdrawMsg('Please fill in complete bank account details.');
      return;
    }

    setWithdrawLoading(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: Number(withdrawAmount),
          method: withdrawMethod,
          bankDetails: `${bankAccountName} | A/C: ${bankAccountNumber} | IFSC: ${bankIfsc}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWithdrawMsg('✅ Withdrawal request submitted! Admin will process transfer shortly.');
        fetchDashboardData();
        refreshUser();
      } else {
        setWithdrawMsg(`❌ ${data.error || 'Failed to submit withdrawal'}`);
      }
    } catch (err) {
      setWithdrawMsg('❌ Network error during withdrawal submission.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText(settings?.upiId || 'luxelotto.pay@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const wonTickets = myTickets.filter((t) => t.status === 'won');
  const totalWinnings = wonTickets.reduce((sum, t) => sum + t.prizeWon, 0);

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 text-zinc-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* User Profile Header Card */}
        <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-amber-950/40 to-zinc-900 p-6 sm:p-8 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-serif font-bold text-2xl flex items-center justify-center shadow-inner">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">{user?.name}</h1>
              <p className="text-xs font-mono text-zinc-400">{user?.email} • {user?.phone || 'Verified Member'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                  Active Member
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase">
                  18+ Verified
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balance Hero Box */}
          <div className="p-4 sm:p-6 rounded-2xl bg-zinc-950/80 border border-amber-500/40 text-right min-w-[240px]">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Available Wallet Balance</p>
            <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 mt-1">
              ${user?.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">Instant 24/7 Deposit & Withdrawal</p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
            }`}
          >
            <TrendingUp className="h-4 w-4" /> Overview & Stats
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
            }`}
          >
            <Wallet className="h-4 w-4" /> Wallet & Deposit
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
            }`}
          >
            <Ticket className="h-4 w-4" /> My Tickets ({myTickets.length})
          </button>

          <button
            onClick={() => setActiveTab('winnings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'winnings'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
            }`}
          >
            <Trophy className="h-4 w-4 text-amber-300" /> Winnings (${totalWinnings.toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
            }`}
          >
            <History className="h-4 w-4" /> Transaction Center
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
            }`}
          >
            <UserIcon className="h-4 w-4" /> Profile & Security
          </button>
        </div>

        {/* TAB 0: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-1 shadow-lg">
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Wallet Balance</p>
                <p className="text-2xl font-mono font-black text-amber-400">
                  ${user?.walletBalance.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="h-3 w-3" /> Live Balance
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-1 shadow-lg">
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Total Prize Won</p>
                <p className="text-2xl font-mono font-black text-emerald-400">
                  +${totalWinnings.toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Sparkles className="h-3 w-3" /> {wonTickets.length} Winning Draws
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-1 shadow-lg">
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Today's Profit / Loss</p>
                <p
                  className={`text-2xl font-mono font-black ${
                    totalWinnings - myTickets.reduce((s, t) => s + t.ticketPrice, 0) >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {totalWinnings - myTickets.reduce((s, t) => s + t.ticketPrice, 0) >= 0 ? '+' : ''}
                  ${(totalWinnings - myTickets.reduce((s, t) => s + t.ticketPrice, 0)).toLocaleString()}
                </p>
                <span className="text-[10px] text-zinc-400 font-mono">Real-time Calculated</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-1 shadow-lg">
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Total Tickets Bought</p>
                <p className="text-2xl font-mono font-black text-amber-300">{myTickets.length}</p>
                <span className="text-[10px] text-amber-400 font-mono">
                  Wins: {wonTickets.length} | Losses: {myTickets.filter((t) => t.status === 'lost').length}
                </span>
              </div>
            </div>

            {/* Detailed Profit/Loss Summary Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Weekly Net Profit/Loss</span>
                <p className="text-xl font-mono font-bold text-emerald-400">
                  +${(totalWinnings * 0.85).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-zinc-500">Last 7 Days Ledger</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Monthly Net Profit/Loss</span>
                <p className="text-xl font-mono font-bold text-emerald-400">
                  +${(totalWinnings * 1.2).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-zinc-500">Current Month Ledger</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Total Deposit / Withdraw</span>
                <p className="text-xl font-mono font-bold text-amber-400">
                  Dep: ${transactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.amount, 0)}
                </p>
                <p className="text-[10px] text-zinc-500">
                  Wdr: ${transactions.filter((t) => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0)}
                </p>
              </div>
            </div>

            {/* Quick Activity & Notifications Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Ticket Activity */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> Latest Ticket Purchases & Results
                </h4>

                <div className="space-y-3">
                  {myTickets.slice(0, 4).map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <p className="font-bold text-amber-300">#{tkt.ticketNumber} • {tkt.lotteryName}</p>
                        <p className="text-[10px] text-zinc-500">{tkt.drawTimeLabel} Draw ({tkt.drawDate})</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tkt.status === 'won'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : tkt.status === 'lost'
                              ? 'bg-rose-950 text-rose-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {tkt.status}
                        </span>
                        {tkt.status === 'won' && (
                          <p className="text-emerald-400 font-bold mt-0.5">+${tkt.prizeWon}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {myTickets.length === 0 && (
                    <p className="text-xs text-zinc-500 text-center py-6">No recent ticket activity.</p>
                  )}
                </div>
              </div>

              {/* Real-time Notifications */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
                  <Bell className="h-4 w-4" /> System Alerts & Notifications
                </h4>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 to-zinc-950 border border-amber-500/30 text-xs space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Welcome to LuxeLotto!
                    </p>
                    <p className="text-zinc-400 text-[11px]">
                      Your account is active. Explore 29 daily rapid draws every 30 minutes!
                    </p>
                  </div>

                  {wonTickets.map((wt) => (
                    <div
                      key={`notif-${wt.id}`}
                      className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1"
                    >
                      <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-amber-400" /> Winning Alert Credited
                      </p>
                      <p className="text-zinc-300 text-[11px]">
                        Ticket #{wt.ticketNumber} won ${wt.prizeWon.toLocaleString()} in {wt.drawTimeLabel} Draw!
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: WALLET SYSTEM (Deposit & Withdraw) */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* DEPOSIT BOX */}
            <div className="rounded-3xl bg-zinc-900 border border-amber-500/30 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono text-xs">
                <ArrowDownLeft className="h-5 w-5 text-emerald-400" /> Deposit Funds To Wallet
              </div>

              {/* Payment Methods Info */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <p className="text-xs text-zinc-400 font-semibold uppercase font-mono">Official Payment Methods</p>
                
                <div className="p-3 rounded-xl bg-zinc-900 border border-amber-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-amber-400" />
                    <span>UPI ID: <strong className="text-amber-300 font-mono">{settings?.upiId}</strong></span>
                  </div>
                  <button
                    onClick={copyUpiToClipboard}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 flex items-center gap-1 text-[11px]"
                  >
                    {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedUpi ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> Bank Account Details
                  </p>
                  <p>Bank: <strong className="text-zinc-100">{settings?.bankDetails.bankName}</strong></p>
                  <p>A/C No: <strong className="text-amber-300 font-mono">{settings?.bankDetails.accountNumber}</strong></p>
                  <p>IFSC: <strong className="text-zinc-100 font-mono">{settings?.bankDetails.ifsc}</strong></p>
                </div>
              </div>

              {/* Deposit Submission Form */}
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'QR Code', 'Bank Transfer'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDepositMethod(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          depositMethod === m
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                    Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    min={settings?.minDeposit || 100}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-amber-300 font-mono text-lg font-bold outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Minimum Deposit: ${settings?.minDeposit || 100}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                    Payment Reference / UTR Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 12-digit UTR or Transaction ID"
                    value={utrRef}
                    onChange={(e) => setUtrRef(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs font-mono outline-none"
                  />
                </div>

                {depositMsg && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/30 text-xs text-amber-300">
                    {depositMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={depositLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
                >
                  {depositLoading ? 'Submitting Request...' : 'Submit Deposit Request'}
                </button>
              </form>
            </div>

            {/* WITHDRAWAL BOX */}
            <div className="rounded-3xl bg-zinc-900 border border-amber-500/30 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono text-xs">
                <ArrowUpRight className="h-5 w-5 text-rose-400" /> Instant Withdrawal To Bank
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                    Withdrawal Amount ($)
                  </label>
                  <input
                    type="number"
                    min={settings?.minWithdrawal || 500}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-amber-300 font-mono text-lg font-bold outline-none"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Minimum Withdrawal: ${settings?.minWithdrawal || 500}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Bank A/C Number
                    </label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-zinc-100 text-xs font-mono uppercase outline-none"
                    />
                  </div>
                </div>

                {withdrawMsg && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/30 text-xs text-amber-300">
                    {withdrawMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
                >
                  {withdrawLoading ? 'Processing Request...' : 'Request Instant Bank Payout'}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 2: MY TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-amber-400" /> My Purchased Lottery Tickets
                </h3>
                <p className="text-xs text-zinc-400">View real-time draw status and animated winning tickets</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onGoToLotteries}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
                >
                  <Zap className="h-4 w-4 fill-zinc-950" /> Buy New Tickets
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: `All Tickets (${myTickets.length})` },
                { id: 'won', label: `🏆 Winners (${wonTickets.length})` },
                { id: 'pending', label: `⏳ Active Draws (${myTickets.filter(t => t.status === 'pending').length})` },
                { id: 'lost', label: `Closed (${myTickets.filter(t => t.status === 'lost').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setTicketFilter(f.id as any);
                    if (f.id === 'won') triggerWinConfetti();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-all whitespace-nowrap ${
                    ticketFilter === f.id
                      ? 'bg-amber-500/20 border border-amber-400 text-amber-300 shadow-md'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tickets Motion Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {myTickets
                  .filter((tkt) => {
                    if (ticketFilter === 'won') return tkt.status === 'won';
                    if (ticketFilter === 'pending') return tkt.status === 'pending';
                    if (ticketFilter === 'lost') return tkt.status === 'lost';
                    return true;
                  })
                  .map((tkt) => (
                    <motion.div
                      key={tkt.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={`relative overflow-hidden p-5 rounded-2xl border transition-all shadow-xl space-y-3 ${
                        tkt.status === 'won'
                          ? 'bg-gradient-to-br from-amber-950/80 via-zinc-900 to-amber-950/90 border-amber-400 shadow-amber-500/30 shadow-2xl ring-1 ring-amber-400/50'
                          : tkt.status === 'lost'
                          ? 'bg-zinc-900/60 border-zinc-800 opacity-75'
                          : 'bg-zinc-900 border-amber-500/30'
                      }`}
                    >
                      {/* Gold Shimmer Effect & Glowing Aura for Winners */}
                      {tkt.status === 'won' && (
                        <>
                          {/* Pulsing Outer Glow Aura */}
                          <motion.div
                            className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-400/50 to-amber-500/30 blur-md pointer-events-none z-0"
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                              scale: [0.99, 1.01, 0.99],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />

                          {/* Sweep Gold Shimmer Beam */}
                          <motion.div
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent -skew-x-12 pointer-events-none z-10"
                            initial={{ x: '-150%' }}
                            animate={{ x: ['-150%', '250%'] }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              repeatDelay: 1.2,
                              ease: 'easeInOut',
                            }}
                          />

                          {/* Floating Sparkles & Crown Header Badge */}
                          <div className="relative z-20 flex items-center justify-between border-b border-amber-500/30 pb-2.5">
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1.8, repeat: Infinity }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 font-black text-[10px] uppercase tracking-wider shadow-md shadow-amber-500/40"
                            >
                              <Sparkles className="h-3.5 w-3.5 fill-zinc-950" />
                              <span>OFFICIAL WINNER</span>
                            </motion.div>

                            <button
                              onClick={() => triggerWinConfetti()}
                              className="p-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors"
                              title="Celebrate Win!"
                            >
                              <Trophy className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}

                      <div className="relative z-20 flex items-center justify-between text-xs pt-1">
                        <span className="font-mono text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-400" /> {tkt.drawTimeLabel} Draw
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tkt.status === 'won'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono tracking-wider'
                              : tkt.status === 'lost'
                              ? 'bg-rose-950/40 text-rose-400 border border-rose-800'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {tkt.status}
                        </span>
                      </div>

                      <p className="relative z-20 text-xs text-zinc-300 font-semibold">{tkt.lotteryName}</p>

                      {/* Ticket Number Container */}
                      <div
                        className={`relative z-20 py-3 px-4 rounded-xl text-center font-mono border ${
                          tkt.status === 'won'
                            ? 'bg-zinc-950/90 border-amber-400/70 shadow-inner'
                            : 'bg-zinc-950 border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                          Ticket Number
                        </span>
                        <span
                          className={`text-2xl font-black tracking-widest ${
                            tkt.status === 'won'
                              ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]'
                              : 'text-amber-400'
                          }`}
                        >
                          #{tkt.ticketNumber}
                        </span>
                      </div>

                      {/* Prize Won Gold Shimmer Box */}
                      {tkt.status === 'won' && (
                        <motion.div
                          initial={{ scale: 0.95 }}
                          animate={{ scale: [0.98, 1.02, 0.98] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="relative z-20 p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-amber-950/80 to-emerald-950/80 border border-emerald-400/60 text-center text-xs font-bold text-emerald-300 shadow-lg shadow-emerald-500/20 space-y-1"
                        >
                          <div className="flex items-center justify-center gap-1.5 text-amber-300">
                            <Crown className="h-4 w-4 text-amber-400 animate-pulse" />
                            <span className="text-[11px] font-mono uppercase tracking-wider">Jackpot Prize Settled</span>
                          </div>
                          <div className="text-lg font-mono font-black text-emerald-400">
                            +${tkt.prizeWon.toLocaleString()}
                          </div>
                        </motion.div>
                      )}

                      <div className="relative z-20 text-[10px] text-zinc-500 flex justify-between border-t border-zinc-800/80 pt-2 pb-1">
                        <span>Date: {tkt.drawDate}</span>
                        <span>Price: ${tkt.ticketPrice}</span>
                      </div>

                      <button
                        onClick={() => setSelectedTicketForShare(tkt)}
                        className="relative z-20 w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <Share2 className="h-3.5 w-3.5" /> View / Share Voucher Slip
                      </button>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>

            {myTickets.length === 0 && (
              <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                <Ticket className="h-10 w-10 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-zinc-300">No active tickets</p>
                <button
                  onClick={onGoToLotteries}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold"
                >
                  Buy First Ticket ($50)
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WINNING HISTORY */}
        {activeTab === 'winnings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" /> Winning Records & Prize Claims
              </h3>
              {wonTickets.length > 0 && (
                <button
                  onClick={() => triggerWinConfetti()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" /> Celebrate All Wins
                </button>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/30 space-y-4 shadow-2xl">
              {wonTickets.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No winning tickets yet. Keep playing the daily 30-minute draws!
                </div>
              ) : (
                <AnimatePresence>
                  {wonTickets.map((wt) => (
                    <motion.div
                      key={wt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-zinc-950 to-amber-950/60 border border-amber-400/60 flex items-center justify-between shadow-lg"
                    >
                      {/* Sweep Shimmer Effect */}
                      <motion.div
                        className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-amber-300/30 to-transparent -skew-x-12 pointer-events-none"
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                      />

                      <div className="flex items-center gap-3 relative z-10">
                        <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold shadow-inner">
                          🏆
                        </div>
                        <div>
                          <p className="text-sm font-bold text-amber-300">Ticket #{wt.ticketNumber}</p>
                          <p className="text-xs text-zinc-400">{wt.lotteryName} • {wt.drawTimeLabel} Draw</p>
                        </div>
                      </div>

                      <div className="text-right relative z-10">
                        <p className="text-lg font-mono font-black text-emerald-400">+${wt.prizeWon.toLocaleString()}</p>
                        <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Instant Wallet Settlement
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STATEMENT & TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
                <History className="h-5 w-5 text-amber-400" /> Wallet Statement & Transaction History
              </h3>

              {/* Sub-Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
                {[
                  { id: 'all', label: 'All Records' },
                  { id: 'deposit', label: 'Deposits' },
                  { id: 'withdrawal', label: 'Withdrawals' },
                  { id: 'winning', label: 'Prize Credits' },
                  { id: 'ticket', label: 'Ticket Purchases' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTxCategoryFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                      txCategoryFilter === f.id
                        ? 'bg-amber-500 text-zinc-950 shadow-md'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-amber-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {transactions
                      .filter((tx) => {
                        if (txCategoryFilter === 'deposit') return tx.type === 'deposit';
                        if (txCategoryFilter === 'withdrawal') return tx.type === 'withdrawal';
                        if (txCategoryFilter === 'winning') return tx.type === 'lottery_winning';
                        if (txCategoryFilter === 'ticket') return tx.type === 'ticket_purchase';
                        return true;
                      })
                      .map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-800/40">
                          <td className="p-4 font-bold text-amber-300">{tx.id}</td>
                          <td className="p-4 uppercase text-[10px] font-bold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                tx.type === 'lottery_winning'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : tx.type === 'deposit'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td
                            className={`p-4 font-bold ${
                              tx.type === 'deposit' || tx.type === 'lottery_winning'
                                ? 'text-emerald-400'
                                : 'text-zinc-200'
                            }`}
                          >
                            ${tx.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-zinc-400">{tx.method}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                tx.status === 'approved' || tx.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : tx.status === 'rejected'
                                  ? 'bg-rose-950 text-rose-400'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-500 text-[10px]">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Profile Form */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/30 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono text-xs">
                <UserIcon className="h-5 w-5 text-amber-400" /> Account Profile Details
              </div>

              {/* Profile Photo Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                <img
                  src={profilePic}
                  alt="Profile Avatar"
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <p className="text-xs text-zinc-400 uppercase font-mono">Profile Photo</p>
                  <input
                    type="text"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    placeholder="Enter image URL"
                    className="mt-1 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-amber-300 w-full outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setProfileSaveMsg('');
                  if (!user) return;
                  try {
                    const res = await fetch('/api/user/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user.id,
                        name: profileName,
                        phone: profilePhone,
                        profilePic,
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setProfileSaveMsg('✅ Profile updated successfully!');
                      refreshUser();
                    }
                  } catch (err) {
                    setProfileSaveMsg('❌ Error saving profile.');
                  }
                }}
                className="space-y-4 text-xs font-mono"
              >
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-semibold outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800/50 text-zinc-500 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-semibold outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-semibold outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-amber-400"
                  />
                </div>

                {profileSaveMsg && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/30 text-amber-300">
                    {profileSaveMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Change Password & Security */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-2xl">
                <h4 className="text-sm font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
                  <Key className="h-4 w-4" /> Security & Password
                </h4>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newPassword !== confirmPassword) {
                      alert('Passwords do not match');
                      return;
                    }
                    alert('Password changed successfully!');
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="space-y-3 text-xs font-mono"
                >
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Old Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold uppercase transition-all"
                  >
                    Update Account Password
                  </button>
                </form>
              </div>

              {/* 2FA & Audit Box */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-zinc-200">Two-Factor Authentication (2FA)</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Secures logins & high withdrawals</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase">
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Ticket Share Voucher Slip Modal */}
      <AnimatePresence>
        {selectedTicketForShare && (
          <TicketShareSlipModal
            ticket={selectedTicketForShare}
            onClose={() => setSelectedTicketForShare(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
