import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BetGuruLogo } from './BetGuruLogo';
import {
  Wallet,
  Bell,
  ShieldCheck,
  Sparkles,
  Ticket,
  Clock,
  Home,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isAdmin, setActiveModal, notifications, setUser } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  const handleAdminSwitch = () => {
    if (isAdmin) {
      // Switch to standard user
      setUser({
        id: 'usr-101',
        name: 'Rahul Sharma',
        email: 'user@luxelotto.com',
        role: 'user',
        status: 'active',
        phone: '+91 98765 43210',
        walletBalance: 5400,
        createdAt: new Date().toISOString(),
        twoFactorEnabled: false,
        verified18Plus: true,
      });
      setCurrentTab('home');
    } else {
      // Switch to Super Admin
      setUser({
        id: 'usr-admin-1',
        name: 'Super Admin',
        email: 'admin@luxelotto.com',
        role: 'super_admin',
        status: 'active',
        phone: '+1 800 589 3568',
        walletBalance: 250000,
        createdAt: new Date().toISOString(),
        twoFactorEnabled: true,
        verified18Plus: true,
      });
      setCurrentTab('admin');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-zinc-950/90 backdrop-blur-xl">
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 border-b border-amber-500/10 py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-amber-400">30-MIN JACKPOT:</span>
            <span className="text-zinc-300">Next draw at 29 Daily Slots (08:00 AM - 10:00 PM). Live auto results!</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <span className="text-amber-400 font-bold">💎 Live Jackpot: $1,000,000</span>
            <button
              onClick={handleAdminSwitch}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-zinc-950 font-sans text-[11px] transition-all"
            >
              <ShieldCheck className="h-3 w-3" />
              {isAdmin ? 'Exit Admin Mode' : 'Switch to Super Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div onClick={() => setCurrentTab('home')}>
            <BetGuruLogo size="md" />
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </button>

            <button
              onClick={() => setCurrentTab('results')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'results'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900'
              }`}
            >
              <Clock className="h-4 w-4 text-amber-400 animate-spin-slow" />
              Today's Results (29 Slots)
            </button>

            <button
              onClick={() => setCurrentTab('lotteries')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'lotteries'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Lottery Games
            </button>

            {user && (
              <button
                onClick={() => setCurrentTab('tickets')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'tickets'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900'
                }`}
              >
                <Ticket className="h-4 w-4" />
                My Tickets
              </button>
            )}

            {user && (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-amber-300 hover:bg-zinc-900'
                }`}
              >
                <Wallet className="h-4 w-4" />
                Dashboard
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all shadow-md ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Super Admin Panel
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {user ? (
              <>
                {/* Compact Wallet Balance Pill with Rainbow Circle Animation */}
                <div className="p-[1.5px] rounded-full rainbow-border-pill shadow-[0_0_10px_rgba(234,179,8,0.25)]">
                  <div className="flex items-center rounded-full bg-zinc-950 p-0.5 shadow-inner transition-all group">
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 text-zinc-200 hover:text-amber-300 transition-colors"
                      title="View Wallet & Dashboard"
                    >
                      <Wallet className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="text-xs font-mono font-bold text-amber-300 whitespace-nowrap">
                        ${user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: user.walletBalance % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveModal('deposit')}
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-extrabold hover:from-amber-400 hover:to-amber-300 shadow transition-transform active:scale-95 shrink-0"
                      title="Add Deposit Funds"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notifications Bell Icon with Round Circle Fire Animation */}
                <div className="relative shrink-0">
                  <div className="p-[1.5px] rounded-full fire-circle-bell">
                    <button
                      onClick={() => setShowNotifs(!showNotifs)}
                      className="relative p-1.5 sm:p-2 rounded-full bg-zinc-950/90 text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center"
                      title="Notifications"
                    >
                      <Bell className="h-4 w-4 text-amber-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
                      {unreadNotifs > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse">
                          {unreadNotifs}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Dropdown */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-900 border border-amber-500/30 shadow-2xl p-3 z-50">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-semibold text-amber-400">
                        <span>Notifications</span>
                        <span className="text-zinc-500">{notifications.length} Total</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-4 text-xs text-zinc-500">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300">
                              <p className="font-semibold text-amber-300">{n.title}</p>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModal('login')}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-zinc-900 border border-amber-500/30 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveModal('register')}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all transform active:scale-95"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};
