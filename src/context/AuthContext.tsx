import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppNotification, SystemSettings } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  notifications: AppNotification[];
  refreshNotifications: () => Promise<void>;
  activeModal: 'login' | 'register' | 'deposit' | 'withdraw' | 'buy_ticket' | 'none';
  setActiveModal: (modal: 'login' | 'register' | 'deposit' | 'withdraw' | 'buy_ticket' | 'none') => void;
  selectedLotteryForBuy: any;
  setSelectedLotteryForBuy: (lottery: any) => void;
  selectedSlotForBuy: any;
  setSelectedSlotForBuy: (slot: any) => void;
  settings: SystemSettings | null;
  refreshSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxelotto_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeModal, setActiveModal] = useState<'login' | 'register' | 'deposit' | 'withdraw' | 'buy_ticket' | 'none'>('none');
  const [selectedLotteryForBuy, setSelectedLotteryForBuy] = useState<any>(null);
  const [selectedSlotForBuy, setSelectedSlotForBuy] = useState<any>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  const isAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (user) {
      localStorage.setItem('luxelotto_user', JSON.stringify(user));
      refreshNotifications();
    } else {
      localStorage.removeItem('luxelotto_user');
    }
  }, [user]);

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/me?userId=${user.id}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/draws/today');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  useEffect(() => {
    refreshSettings();
    const interval = setInterval(() => {
      if (user) {
        refreshUser();
        refreshNotifications();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setActiveModal('none');
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err: any) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setActiveModal('none');
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxelotto_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        notifications,
        refreshNotifications,
        activeModal,
        setActiveModal,
        selectedLotteryForBuy,
        setSelectedLotteryForBuy,
        selectedSlotForBuy,
        setSelectedSlotForBuy,
        settings,
        refreshSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
