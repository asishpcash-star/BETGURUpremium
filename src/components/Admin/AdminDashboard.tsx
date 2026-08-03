import React, { useState, useEffect } from 'react';
import {
  AdminStats,
  User as UserType,
  WalletTransaction,
  DrawSlot,
  LotteryGame,
  AuditLog,
} from '../../types';
import {
  Users,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Lock,
  Unlock,
  AlertCircle,
  TrendingUp,
  BarChart2,
  Sliders,
  DollarSign,
  Send,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [adminTab, setAdminTab] = useState<
    'overview' | 'results' | 'deposits' | 'withdrawals' | 'users' | 'lotteries' | 'logs'
  >('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [deposits, setDeposits] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WalletTransaction[]>([]);
  const [draws, setDraws] = useState<DrawSlot[]>([]);
  const [lotteriesList, setLotteriesList] = useState<LotteryGame[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [autoPublish, setAutoPublish] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState('');

  // Manual Result Modal State
  const [publishingSlot, setPublishingSlot] = useState<DrawSlot | null>(null);
  const [manualWinningNumber, setManualWinningNumber] = useState('7482');

  // Manual Wallet Adjust State
  const [adjustUser, setAdjustUser] = useState<UserType | null>(null);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState('500');
  const [adjustNote, setAdjustNote] = useState('Admin adjustment');

  // Create Lottery Form State
  const [showCreateLotteryModal, setShowCreateLotteryModal] = useState(false);
  const [newLotteryTitle, setNewLotteryTitle] = useState('');
  const [newLotteryCategory, setNewLotteryCategory] = useState<'Daily 30-Min' | 'Weekly Mega' | 'Special VIP'>('Daily 30-Min');
  const [newTicketPrice, setNewTicketPrice] = useState('50');
  const [newJackpot, setNewJackpot] = useState('100000');
  const [newDigitsCount, setNewDigitsCount] = useState('4');

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, depRes, wdrRes, drawsRes, lotRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/deposits'),
        fetch('/api/admin/withdrawals'),
        fetch('/api/draws/today'),
        fetch('/api/lotteries'),
        fetch('/api/admin/audit-logs'),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const depData = await depRes.json();
      const wdrData = await wdrRes.json();
      const drawsData = await drawsRes.json();
      const lotData = await lotRes.json();
      const logsData = await logsRes.json();

      if (statsData.stats) setStats(statsData.stats);
      if (usersData.users) setUsersList(usersData.users);
      if (depData.deposits) setDeposits(depData.deposits);
      if (wdrData.withdrawals) setWithdrawals(wdrData.withdrawals);
      if (drawsData.draws) setDraws(drawsData.draws);
      if (drawsData.settings) setAutoPublish(drawsData.settings.autoPublishEnabled);
      if (lotData.lotteries) setLotteriesList(lotData.lotteries);
      if (logsData.auditLogs) setAuditLogs(logsData.auditLogs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const timer = setInterval(fetchAdminData, 10000);
    return () => clearInterval(timer);
  }, []);

  // Actions
  const handleToggleAutoPublish = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/admin/draws/toggle-auto', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (data.success) {
        setAutoPublish(enabled);
      }
    } catch (err) {
      alert('Failed to toggle auto publish');
    }
  };

  const handlePublishSlotSubmit = async () => {
    if (!publishingSlot) return;
    try {
      const res = await fetch('/api/admin/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: publishingSlot.id,
          winningNumber: manualWinningNumber,
          publishType: 'Manual',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishingSlot(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to publish draw result');
      }
    } catch (err) {
      alert('Network error while publishing');
    }
  };

  const handleDepositAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/deposits/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: `Processed by Super Admin (${action})` }),
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (err) {
      alert('Failed deposit action');
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: `Processed by Super Admin (${action})` }),
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (err) {
      alert('Failed withdrawal action');
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (err) {
      alert('Failed status update');
    }
  };

  const handleWalletAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustUser) return;
    try {
      const res = await fetch(`/api/admin/users/${adjustUser.id}/adjust-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: adjustType,
          amount: Number(adjustAmount),
          note: adjustNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdjustUser(null);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed wallet adjustment');
    }
  };

  const handleCreateLottery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/lotteries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLotteryTitle,
          category: newLotteryCategory,
          ticketPrice: Number(newTicketPrice),
          jackpotAmount: Number(newJackpot),
          winningDigitsCount: Number(newDigitsCount),
          description: `Custom ${newLotteryCategory} lottery game.`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateLotteryModal(false);
        setNewLotteryTitle('');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to create lottery game');
    }
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Category,Value\n' +
      `Total Users,${stats?.totalUsers}\n` +
      `Total Deposits,${stats?.totalDeposits}\n` +
      `Total Withdrawals,${stats?.totalWithdrawals}\n` +
      `Total Ticket Sales,${stats?.totalTicketSales}\n` +
      `Estimated Revenue,${stats?.totalRevenue}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LuxeLotto_Admin_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock revenue chart data
  const revenueChartData = [
    { hour: '08:00', sales: 1200, revenue: 360 },
    { hour: '10:00', sales: 2400, revenue: 720 },
    { hour: '12:00', sales: 4800, revenue: 1440 },
    { hour: '14:00', sales: 3200, revenue: 960 },
    { hour: '16:00', sales: 6100, revenue: 1830 },
    { hour: '18:00', sales: 8500, revenue: 2550 },
    { hour: '20:00', sales: 11200, revenue: 3360 },
  ];

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch)
  );

  return (
    <div className="min-h-screen bg-zinc-950 py-8 sm:py-12 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-900 to-amber-950/60 border border-amber-500/40 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-1">
              <ShieldCheck className="h-4 w-4" /> Super Admin Control Console
            </div>
            <h1 className="text-3xl font-serif font-black text-zinc-100">
              Platform Governance & Live Operations
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage 29 daily 30-min draws, publish results, approve deposits/withdrawals, and govern users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 hover:bg-zinc-800 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              Export CSV Report
            </button>
            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all font-bold text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" /> Sync Data
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
          {[
            { id: 'overview', label: 'Dashboard KPI', icon: TrendingUp },
            { id: 'results', label: '29 Draw Results Control', icon: Clock },
            { id: 'deposits', label: `Deposits (${deposits.filter((d) => d.status === 'pending').length})`, icon: ArrowDownLeft },
            { id: 'withdrawals', label: `Withdrawals (${withdrawals.filter((w) => w.status === 'pending').length})`, icon: ArrowUpRight },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'lotteries', label: 'Lottery Games', icon: Sparkles },
            { id: 'logs', label: 'Audit Logs', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  adminTab === tab.id
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-amber-300 border border-zinc-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW KPI */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30">
                <p className="text-xs text-zinc-400 font-mono uppercase">Total Users</p>
                <p className="text-3xl font-mono font-bold text-amber-400 mt-2">{stats?.totalUsers || 0}</p>
                <span className="text-[10px] text-emerald-400">Verified members</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-emerald-500/30">
                <p className="text-xs text-zinc-400 font-mono uppercase">Total Deposits Approved</p>
                <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">
                  ${(stats?.totalDeposits || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-zinc-500">Inflow funds</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-rose-500/30">
                <p className="text-xs text-zinc-400 font-mono uppercase">Total Withdrawals Approved</p>
                <p className="text-3xl font-mono font-bold text-rose-400 mt-2">
                  ${(stats?.totalWithdrawals || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-zinc-500">Outflow payouts</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30">
                <p className="text-xs text-zinc-400 font-mono uppercase">Total Ticket Sales Volume</p>
                <p className="text-3xl font-mono font-bold text-amber-300 mt-2">
                  ${(stats?.totalTicketSales || 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-emerald-400">Margin Platform Revenue</span>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-zinc-100">Daily Sales & Platform Revenue Analytics</h3>
                  <p className="text-xs text-zinc-400">Real-time revenue monitoring across 29 draw slots</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  Live Sync
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="hour" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#f59e0b', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="sales" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESULT CONTROL CENTER (29 SLOTS) */}
        {adminTab === 'results' && (
          <div className="space-y-6">
            
            {/* Auto Publish Mode Switcher */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-400 flex items-center gap-2">
                  <Sliders className="h-5 w-5" /> Auto vs Manual Result Publish Mode
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  When enabled, the system automatically generates lucky numbers every 30 minutes and settles winner wallets.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-300">
                  {autoPublish ? 'AUTO MODE ACTIVE' : 'MANUAL MODE ACTIVE'}
                </span>
                <button
                  onClick={() => handleToggleAutoPublish(!autoPublish)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-md ${
                    autoPublish
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  {autoPublish ? 'Switch To Manual' : 'Enable Auto-Publish'}
                </button>
              </div>
            </div>

            {/* 29 Draw Slots Admin Table */}
            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  29 Daily Scheduled Draw Slots (08:00 AM - 10:00 PM)
                </span>
                <span className="text-xs text-zinc-500">{draws.filter((s) => s.status === 'Published').length} Published</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-amber-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Slot #</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Winning Number</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Publish Type</th>
                      <th className="p-4">Tickets Sold</th>
                      <th className="p-4">Winners</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {draws.map((slot) => (
                      <tr key={slot.id} className="hover:bg-zinc-800/40">
                        <td className="p-4 font-bold text-amber-400">Slot #{slot.slotIndex}</td>
                        <td className="p-4 font-bold text-zinc-100">{slot.timeLabel}</td>
                        <td className="p-4">
                          {slot.winningNumber ? (
                            <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm tracking-widest">
                              {slot.winningNumber}
                            </span>
                          ) : (
                            <span className="text-zinc-600">Pending Draw</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              slot.status === 'Published'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : slot.status === 'Live'
                                ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {slot.status}
                          </span>
                        </td>
                        <td className="p-4">{slot.publishType}</td>
                        <td className="p-4 text-zinc-200">{slot.totalTicketsSold}</td>
                        <td className="p-4 text-emerald-400">{slot.winningTicketCount || 0}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setPublishingSlot(slot);
                              setManualWinningNumber(slot.winningNumber || Math.floor(1000 + Math.random() * 9000).toString());
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px]"
                          >
                            {slot.status === 'Published' ? 'Edit Number' : 'Publish Result'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manual Publish Modal */}
            {publishingSlot && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 shadow-2xl text-zinc-100 space-y-4">
                  <h3 className="text-xl font-serif font-bold text-amber-400">
                    Publish Result for {publishingSlot.timeLabel} Draw
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Enter the official 4-digit winning lucky number. This will immediately evaluate all purchased tickets and credit winner wallets.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Winning Number (4 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={manualWinningNumber}
                      onChange={(e) => setManualWinningNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-amber-500/40 text-center font-mono text-2xl font-black text-amber-400 tracking-widest outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPublishingSlot(null)}
                      className="w-1/2 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePublishSlotSubmit}
                      className="w-1/2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase"
                    >
                      Confirm & Credit Winners
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DEPOSITS APPROVAL */}
        {adminTab === 'deposits' && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-zinc-100">User Deposit Requests Queue</h3>

            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-amber-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Tx ID</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">UTR / Ref Number</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Approve / Reject</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {deposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-zinc-800/40">
                        <td className="p-4 font-bold text-amber-300">{dep.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-zinc-100">{dep.userName}</p>
                          <p className="text-[10px] text-zinc-500">{dep.userEmail}</p>
                        </td>
                        <td className="p-4 font-bold text-emerald-400 text-sm">${dep.amount.toLocaleString()}</td>
                        <td className="p-4">{dep.method}</td>
                        <td className="p-4 font-bold text-amber-400">{dep.proofReference}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              dep.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : dep.status === 'rejected'
                                ? 'bg-rose-950 text-rose-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {dep.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {dep.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleDepositAction(dep.id, 'approve')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px]"
                              >
                                Approve ($)
                              </button>
                              <button
                                onClick={() => handleDepositAction(dep.id, 'reject')}
                                className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-200 font-bold text-[11px]"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WITHDRAWALS APPROVAL */}
        {adminTab === 'withdrawals' && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-zinc-100">User Withdrawal Payout Requests Queue</h3>

            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-amber-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Tx ID</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Payout Amount</th>
                      <th className="p-4">Bank Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Process Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {withdrawals.map((wdr) => (
                      <tr key={wdr.id} className="hover:bg-zinc-800/40">
                        <td className="p-4 font-bold text-amber-300">{wdr.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-zinc-100">{wdr.userName}</p>
                          <p className="text-[10px] text-zinc-500">{wdr.userEmail}</p>
                        </td>
                        <td className="p-4 font-bold text-rose-400 text-sm">${wdr.amount.toLocaleString()}</td>
                        <td className="p-4 text-zinc-300 text-[11px]">{wdr.proofReference}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              wdr.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : wdr.status === 'rejected'
                                ? 'bg-rose-950 text-rose-400'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {wdr.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {wdr.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleWithdrawalAction(wdr.id, 'approve')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px]"
                              >
                                Mark Paid
                              </button>
                              <button
                                onClick={() => handleWithdrawalAction(wdr.id, 'reject')}
                                className="px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-200 font-bold text-[11px]"
                              >
                                Reject & Refund
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USER MANAGEMENT */}
        {adminTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-zinc-100">Registered Users Management</h3>
              
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-amber-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Wallet Balance</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-800/40">
                        <td className="p-4">
                          <p className="font-bold text-zinc-100">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">{u.email}</p>
                        </td>
                        <td className="p-4 uppercase text-[10px] font-bold text-amber-300">{u.role}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-950 text-rose-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-amber-400">${u.walletBalance.toLocaleString()}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setAdjustUser(u)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-[11px]"
                          >
                            Adjust Wallet
                          </button>
                          {u.role !== 'super_admin' && (
                            <button
                              onClick={() => handleUserStatusToggle(u.id, u.status)}
                              className={`px-2.5 py-1 rounded font-bold text-[11px] ${
                                u.status === 'active'
                                  ? 'bg-rose-950 text-rose-300 hover:bg-rose-900'
                                  : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                              }`}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Wallet Adjust Modal */}
            {adjustUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <form
                  onSubmit={handleWalletAdjustSubmit}
                  className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 shadow-2xl text-zinc-100 space-y-4"
                >
                  <h3 className="text-xl font-serif font-bold text-amber-400">
                    Adjust Wallet Balance: {adjustUser.name}
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Action Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdjustType('credit')}
                        className={`py-2 rounded-xl text-xs font-bold ${
                          adjustType === 'credit' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        Credit (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjustType('debit')}
                        className={`py-2 rounded-xl text-xs font-bold ${
                          adjustType === 'debit' ? 'bg-rose-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        Debit (-)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300 font-mono text-lg font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Reason / Note
                    </label>
                    <input
                      type="text"
                      value={adjustNote}
                      onChange={(e) => setAdjustNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAdjustUser(null)}
                      className="w-1/2 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase"
                    >
                      Save Adjustment
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* TAB 6: LOTTERIES CREATOR */}
        {adminTab === 'lotteries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-zinc-100">Lottery Games Management</h3>
              <button
                onClick={() => setShowCreateLotteryModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Create New Lottery Game
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteriesList.map((g) => (
                <div key={g.id} className="p-5 rounded-3xl bg-zinc-900 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{g.code}</span>
                    <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold">
                      {g.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-serif font-bold text-zinc-100">{g.title}</h4>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                    <p className="text-zinc-400">Jackpot: <strong className="text-amber-400 font-mono">${g.jackpotAmount.toLocaleString()}</strong></p>
                    <p className="text-zinc-400">Ticket Price: <strong className="text-zinc-200 font-mono">${g.ticketPrice}</strong></p>
                    <p className="text-zinc-400">Winning Digits: <strong className="text-zinc-200">{g.winningDigitsCount} Digits</strong></p>
                  </div>
                </div>
              ))}
            </div>

            {showCreateLotteryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <form
                  onSubmit={handleCreateLottery}
                  className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/40 p-6 shadow-2xl text-zinc-100 space-y-4"
                >
                  <h3 className="text-xl font-serif font-bold text-amber-400">Create Custom Lottery</h3>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Lottery Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fortune Gold 500"
                      value={newLotteryTitle}
                      onChange={(e) => setNewLotteryTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                      Category
                    </label>
                    <select
                      value={newLotteryCategory}
                      onChange={(e) => setNewLotteryCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-amber-300 font-mono outline-none"
                    >
                      <option value="Daily 30-Min">Daily 30-Min</option>
                      <option value="Weekly Mega">Weekly Mega</option>
                      <option value="Special VIP">Special VIP</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                        Ticket Price ($)
                      </label>
                      <input
                        type="number"
                        value={newTicketPrice}
                        onChange={(e) => setNewTicketPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase font-mono mb-1">
                        Jackpot ($)
                      </label>
                      <input
                        type="number"
                        value={newJackpot}
                        onChange={(e) => setNewJackpot(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateLotteryModal(false)}
                      className="w-1/2 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase"
                    >
                      Publish Game
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {adminTab === 'logs' && (
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-zinc-100">Security & Administrative Audit Trail</h3>

            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-amber-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-4">Admin</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Details</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/40">
                        <td className="p-4 font-bold text-amber-300">{log.adminName}</td>
                        <td className="p-4 uppercase text-[10px] font-bold text-emerald-400">{log.action}</td>
                        <td className="p-4 text-zinc-300">{log.details}</td>
                        <td className="p-4 text-zinc-500">{log.ipAddress}</td>
                        <td className="p-4 text-zinc-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
