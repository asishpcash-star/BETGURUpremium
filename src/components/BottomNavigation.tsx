import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Home, Ticket, Clock, History, User } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { user, setActiveModal } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      requiresAuth: false,
    },
    {
      id: 'results',
      label: 'Results',
      icon: Clock,
      requiresAuth: false,
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      requiresAuth: true,
    },
    {
      id: 'dashboard',
      label: 'Transactions',
      icon: History,
      requiresAuth: true,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      requiresAuth: true,
    },
  ];

  const handleTabClick = (item: typeof navItems[0]) => {
    if (item.requiresAuth && !user) {
      setActiveModal('login');
      return;
    }
    if (item.id === 'profile') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab(item.id);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-amber-500/30 py-2 shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (item.id === 'profile' && currentTab === 'dashboard');

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className="relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all"
            >
              {/* Active Tab Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileBottomTabActive"
                  className="absolute inset-0 bg-gradient-to-t from-amber-500/25 via-amber-500/10 to-transparent border-t-2 border-amber-400 rounded-2xl pointer-events-none"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                whileTap={{ scale: 0.85 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`relative z-10 transition-colors ${
                  isActive ? 'text-amber-400' : 'text-zinc-400'
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.div>

              <span
                className={`relative z-10 text-[10px] font-bold uppercase tracking-wider mt-1 transition-colors whitespace-nowrap ${
                  isActive ? 'text-amber-300 font-extrabold' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
