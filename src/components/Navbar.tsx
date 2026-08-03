import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BetGuruLogo } from './BetGuruLogo';
import {
  Crown,
  Wallet,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Sparkles,
  Ticket,
  Clock,
  Home,
  ChevronDown,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isAdmin, logout, setActiveModal, notifications, setUser } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 border-b border-amber-500/10 py-1.5 px-4 text-xs text-amber-300 flex items-center justify-between">
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
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Wallet Pill */}
                <div
                  onClick={() => setActiveModal('deposit')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-amber-500/30 hover:border-amber-400/60 cursor-pointer transition-all shadow-inner group"
                >
                  <Wallet className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-300">
                    ${user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <PlusCircle className="h-4 w-4 text-amber-400/80 group-hover:text-amber-300" />
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="relative p-2 rounded-full text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifs > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-950">
                        {unreadNotifs}
                      </span>
                    )}
                  </button>

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

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 transition-all"
                  >
                    <div className="h-7 w-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-amber-500/30 shadow-2xl p-2 z-50">
                      <div className="p-2 border-b border-zinc-800">
                        <p className="text-xs font-bold text-zinc-100">{user.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {user.role}
                        </span>
                      </div>

                      <div className="pt-2 space-y-1">
                        <button
                          onClick={() => {
                            setCurrentTab('dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-amber-500/10 hover:text-amber-400 flex items-center gap-2"
                        >
                          <Wallet className="h-3.5 w-3.5" />
                          Wallet & Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setCurrentTab('tickets');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-amber-500/10 hover:text-amber-400 flex items-center gap-2"
                        >
                          <Ticket className="h-3.5 w-3.5" />
                          My Ticket History
                        </button>

                        <button
                          onClick={logout}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModal('login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-zinc-900 border border-amber-500/30 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveModal('register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all transform active:scale-95"
                >
                  Register Free
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-amber-400"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-amber-500/20 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => {
              setCurrentTab('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Home className="h-4 w-4" /> Home
          </button>
          <button
            onClick={() => {
              setCurrentTab('results');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Clock className="h-4 w-4" /> Today's Results (29 Slots)
          </button>
          <button
            onClick={() => {
              setCurrentTab('lotteries');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Lottery Games
          </button>
          {user && (
            <button
              onClick={() => {
                setCurrentTab('tickets');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
            >
              <Ticket className="h-4 w-4" /> My Tickets
            </button>
          )}
          {user && (
            <button
              onClick={() => {
                setCurrentTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-900 flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" /> Wallet & Dashboard
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold bg-amber-500 text-zinc-950 flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" /> Super Admin Panel
            </button>
          )}
          <div className="pt-2">
            <button
              onClick={handleAdminSwitch}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
            >
              {isAdmin ? 'Exit Admin Mode' : 'Switch to Super Admin'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
