import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  User,
  WalletTransaction,
  LotteryGame,
  DrawSlot,
  DrawSlotStatus,
  LotteryTicket,
  AppNotification,
  AuditLog,
  SystemSettings,
  AdminStats,
} from './src/types';

dotenv.config();

const app = express();
app.use(express.json());

// In-Memory persistent data engine
const defaultSettings: SystemSettings = {
  autoPublishEnabled: true,
  minDeposit: 100,
  minWithdrawal: 500,
  upiId: 'luxelotto.pay@upi',
  bankDetails: {
    accountName: 'LUXELOTTO GLOBAL LTD',
    accountNumber: '9928371920381',
    ifsc: 'LUXE0009823',
    bankName: 'HDFC Bank - Cyber City Branch',
  },
  qrCodeUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=400&auto=format&fit=crop&q=80',
  siteAnnouncements: '🎉 Welcome to LuxeLotto! Daily 30-Min Jackpot draws are LIVE from 8:00 AM to 10:00 PM!',
  maintenanceMode: false,
};

let settings: SystemSettings = { ...defaultSettings };

let users: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Super Admin',
    email: 'admin@luxelotto.com',
    role: 'super_admin',
    status: 'active',
    phone: '+1 800 589 3568',
    walletBalance: 250000,
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    twoFactorEnabled: true,
    verified18Plus: true,
  },
  {
    id: 'usr-101',
    name: 'Rahul Sharma',
    email: 'user@luxelotto.com',
    role: 'user',
    status: 'active',
    phone: '+91 98765 43210',
    walletBalance: 5400,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    twoFactorEnabled: false,
    verified18Plus: true,
  },
  {
    id: 'usr-102',
    name: 'Sophia Patel',
    email: 'sophia@example.com',
    role: 'user',
    status: 'active',
    phone: '+91 91234 56789',
    walletBalance: 1250,
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    twoFactorEnabled: false,
    verified18Plus: true,
  },
];

let lotteries: LotteryGame[] = [
  {
    id: 'lot-30m',
    title: 'Luxe 30-Min Rapid Jackpot',
    code: 'LUXE-30M',
    description: 'Rapid 4-digit draw every 30 minutes from 8:00 AM to 10:00 PM. High win rate!',
    category: 'Daily 30-Min',
    ticketPrice: 50,
    jackpotAmount: 100000,
    drawScheduleType: '30_MIN',
    status: 'active',
    winningDigitsCount: 4,
    bannerBg: 'from-amber-600 via-amber-800 to-zinc-900',
    totalSold: 1240,
  },
  {
    id: 'lot-weekly-mega',
    title: 'Royal Bumper 1 Million',
    code: 'ROYAL-BUMPER',
    description: 'Weekly mega jackpot draw with huge prizes. Pick 6 lucky digits!',
    category: 'Weekly Mega',
    ticketPrice: 200,
    jackpotAmount: 1000000,
    drawScheduleType: 'CUSTOM',
    status: 'active',
    winningDigitsCount: 6,
    bannerBg: 'from-yellow-500 via-yellow-700 to-amber-950',
    nextDrawTime: '2026-08-09T20:00:00',
    totalSold: 3820,
  },
  {
    id: 'lot-vip-gold',
    title: 'VIP Gold Club Lottery',
    code: 'VIP-GOLD',
    description: 'Exclusive draw for high rollers with 1:5 winning odds and $500,000 jackpot.',
    category: 'Special VIP',
    ticketPrice: 500,
    jackpotAmount: 500000,
    drawScheduleType: 'CUSTOM',
    status: 'active',
    winningDigitsCount: 4,
    bannerBg: 'from-amber-400 via-yellow-600 to-zinc-950',
    nextDrawTime: '2026-08-05T22:00:00',
    totalSold: 410,
  },
];

// Generate 29 slots for today (8:00 AM to 10:00 PM)
const timeSlots29 = [
  { index: 1, label: '08:00 AM', t24: '08:00' },
  { index: 2, label: '08:30 AM', t24: '08:30' },
  { index: 3, label: '09:00 AM', t24: '09:00' },
  { index: 4, label: '09:30 AM', t24: '09:30' },
  { index: 5, label: '10:00 AM', t24: '10:00' },
  { index: 6, label: '10:30 AM', t24: '10:30' },
  { index: 7, label: '11:00 AM', t24: '11:00' },
  { index: 8, label: '11:30 AM', t24: '11:30' },
  { index: 9, label: '12:00 PM', t24: '12:00' },
  { index: 10, label: '12:30 PM', t24: '12:30' },
  { index: 11, label: '01:00 PM', t24: '13:00' },
  { index: 12, label: '01:30 PM', t24: '13:30' },
  { index: 13, label: '02:00 PM', t24: '14:00' },
  { index: 14, label: '02:30 PM', t24: '14:30' },
  { index: 15, label: '03:00 PM', t24: '15:00' },
  { index: 16, label: '03:30 PM', t24: '15:30' },
  { index: 17, label: '04:00 PM', t24: '16:00' },
  { index: 18, label: '04:30 PM', t24: '16:30' },
  { index: 19, label: '05:00 PM', t24: '17:00' },
  { index: 20, label: '05:30 PM', t24: '17:30' },
  { index: 21, label: '06:00 PM', t24: '18:00' },
  { index: 22, label: '06:30 PM', t24: '18:30' },
  { index: 23, label: '07:00 PM', t24: '19:00' },
  { index: 24, label: '07:30 PM', t24: '19:30' },
  { index: 25, label: '08:00 PM', t24: '20:00' },
  { index: 26, label: '08:30 PM', t24: '20:30' },
  { index: 27, label: '09:00 PM', t24: '21:00' },
  { index: 28, label: '09:30 PM', t24: '21:30' },
  { index: 29, label: '10:00 PM', t24: '22:00' },
];

function generateInitialDrawSlots(): DrawSlot[] {
  const dateStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return timeSlots29.map((slot) => {
    const [h, m] = slot.t24.split(':').map(Number);
    const slotMinutes = h * 60 + m;

    let status: DrawSlotStatus = 'Upcoming';
    let winNum: string | null = null;
    let pubAt: string | undefined = undefined;

    if (slotMinutes <= currentMinutes) {
      status = 'Published';
      winNum = Math.floor(1000 + Math.random() * 9000).toString();
      pubAt = new Date(now.getTime() - (currentMinutes - slotMinutes) * 60000).toISOString();
    } else if (slotMinutes - currentMinutes <= 30) {
      status = 'Live';
    }

    return {
      id: `slot-2026-${slot.index}`,
      slotIndex: slot.index,
      timeLabel: slot.label,
      time24: slot.t24,
      lotteryId: 'lot-30m',
      lotteryName: 'Luxe 30-Min Rapid Jackpot',
      winningNumber: winNum,
      status,
      publishType: 'Auto',
      publishedAt: pubAt,
      isLocked: status === 'Published',
      payoutProcessed: status === 'Published',
      totalTicketsSold: Math.floor(25 + Math.random() * 80),
      totalPrizeDistributed: winNum ? 25000 : 0,
      winningTicketCount: winNum ? Math.floor(1 + Math.random() * 3) : 0,
    };
  });
}

let drawSlots: DrawSlot[] = generateInitialDrawSlots();

let walletTransactions: WalletTransaction[] = [
  {
    id: 'tx-1001',
    userId: 'usr-101',
    userName: 'Rahul Sharma',
    userEmail: 'user@luxelotto.com',
    type: 'deposit',
    amount: 5000,
    status: 'approved',
    method: 'UPI',
    proofReference: 'UTR9982341209',
    note: 'Welcome bonus deposit approved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tx-1002',
    userId: 'usr-101',
    userName: 'Rahul Sharma',
    userEmail: 'user@luxelotto.com',
    type: 'lottery_winning',
    amount: 1000,
    status: 'completed',
    method: 'Wallet',
    proofReference: 'WIN-SLOT-5',
    note: 'Prize credited for Slot 08:30 AM Draw (Matched 4 digits: 7482)',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'tx-1003',
    userId: 'usr-102',
    userName: 'Sophia Patel',
    userEmail: 'sophia@example.com',
    type: 'deposit',
    amount: 2000,
    status: 'pending',
    method: 'QR Code',
    proofReference: 'UTR8837192837',
    note: 'Awaiting admin verification',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

let tickets: LotteryTicket[] = [
  {
    id: 'tkt-8801',
    ticketNumber: '7482',
    userId: 'usr-101',
    userName: 'Rahul Sharma',
    userEmail: 'user@luxelotto.com',
    lotteryId: 'lot-30m',
    lotteryName: 'Luxe 30-Min Rapid Jackpot',
    drawSlotId: 'slot-2026-2',
    drawTimeLabel: '08:30 AM',
    drawDate: new Date().toISOString().split('T')[0],
    ticketPrice: 50,
    status: 'won',
    prizeWon: 1000,
    purchasedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'tkt-8802',
    ticketNumber: '1920',
    userId: 'usr-101',
    userName: 'Rahul Sharma',
    userEmail: 'user@luxelotto.com',
    lotteryId: 'lot-30m',
    lotteryName: 'Luxe 30-Min Rapid Jackpot',
    drawSlotId: 'slot-2026-10',
    drawTimeLabel: '12:30 PM',
    drawDate: new Date().toISOString().split('T')[0],
    ticketPrice: 50,
    status: 'active',
    prizeWon: 0,
    purchasedAt: new Date().toISOString(),
  },
];

let notifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-101',
    title: '🎉 Congratulations! You Won!',
    message: 'Your ticket #7482 won $1,000 in the 08:30 AM 30-Min Draw. Wallet credited instantly!',
    type: 'winning',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

let auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'usr-admin-1',
    adminName: 'Super Admin',
    action: 'SYSTEM_START',
    details: 'LuxeLotto System initialized with 29 30-minute daily draw schedules.',
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString(),
  },
];

// Helper: Auto-publish checker loop
function checkAndAutoPublishDraws() {
  if (!settings.autoPublishEnabled) return;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  drawSlots.forEach((slot) => {
    const [h, m] = slot.time24.split(':').map(Number);
    const slotMinutes = h * 60 + m;

    if (slotMinutes <= currentMinutes && slot.status !== 'Published') {
      // Publish slot!
      const winDigits = Math.floor(1000 + Math.random() * 9000).toString();
      slot.status = 'Published';
      slot.winningNumber = winDigits;
      slot.publishedAt = new Date().toISOString();
      slot.publishedByAdmin = 'System Auto-Engine';
      slot.isLocked = true;

      processDrawWinners(slot);
    } else if (slot.status === 'Upcoming' && slotMinutes - currentMinutes <= 30 && slotMinutes > currentMinutes) {
      slot.status = 'Live';
    }
  });
}

function processDrawWinners(slot: DrawSlot) {
  if (slot.payoutProcessed) return;

  const matchingTickets = tickets.filter(
    (t) => t.drawSlotId === slot.id && t.ticketNumber === slot.winningNumber && t.status === 'active'
  );

  let totalPrize = 0;
  matchingTickets.forEach((t) => {
    const prize = 25000; // Fixed jackpot share for 30-min draw
    t.status = 'won';
    t.prizeWon = prize;
    totalPrize += prize;

    // Credit user wallet
    const user = users.find((u) => u.id === t.userId);
    if (user) {
      user.walletBalance += prize;

      walletTransactions.unshift({
        id: `tx-win-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        type: 'lottery_winning',
        amount: prize,
        status: 'completed',
        method: 'Wallet',
        proofReference: `WIN-${slot.timeLabel}`,
        note: `Jackpot Prize for slot ${slot.timeLabel} (Winning #: ${slot.winningNumber})`,
        createdAt: new Date().toISOString(),
      });

      notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: '🏆 You Won the Jackpot!',
        message: `Ticket #${t.ticketNumber} matched ${slot.timeLabel} draw! $${prize.toLocaleString()} credited to your wallet.`,
        type: 'winning',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Mark lose for non-winning active tickets in this slot
  tickets.forEach((t) => {
    if (t.drawSlotId === slot.id && t.status === 'active' && t.ticketNumber !== slot.winningNumber) {
      t.status = 'lost';
    }
  });

  slot.payoutProcessed = true;
  slot.winningTicketCount = matchingTickets.length;
  slot.totalPrizeDistributed = totalPrize;
}

setInterval(checkAndAutoPublishDraws, 10000); // Check every 10 seconds

// API ROUTES

// Auth API
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Your account has been suspended by Admin.' });
  }

  res.json({ success: true, user });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email is already registered.' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: 'user',
    status: 'active',
    phone: phone || '',
    walletBalance: 100, // $100 Welcome bonus
    createdAt: new Date().toISOString(),
    twoFactorEnabled: false,
    verified18Plus: true,
  };

  users.push(newUser);

  // Add welcome deposit transaction
  walletTransactions.unshift({
    id: `tx-welcome-${Date.now()}`,
    userId: newUser.id,
    userName: newUser.name,
    userEmail: newUser.email,
    type: 'deposit',
    amount: 100,
    status: 'completed',
    method: 'Wallet',
    note: 'Sign-up Welcome Bonus',
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, user: newUser });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

app.put('/api/user/profile', (req: Request, res: Response) => {
  const { userId, name, phone, profilePic, twoFactorEnabled } = req.body;
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profilePic) user.profilePic = profilePic;
  if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;

  res.json({ success: true, user });
});

// Wallet API
app.post('/api/wallet/deposit', (req: Request, res: Response) => {
  const { userId, amount, method, proofReference, note } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (amount < settings.minDeposit) {
    return res.status(400).json({ error: `Minimum deposit amount is $${settings.minDeposit}` });
  }

  const tx: WalletTransaction = {
    id: `tx-dep-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    type: 'deposit',
    amount: Number(amount),
    status: 'pending',
    method,
    proofReference: proofReference || 'REF-PENDING',
    note: note || 'User deposit request submitted',
    createdAt: new Date().toISOString(),
  };

  walletTransactions.unshift(tx);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: user.id,
    title: 'Deposit Requested',
    message: `Your deposit request of $${amount} via ${method} is submitted and awaiting admin approval.`,
    type: 'deposit',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, transaction: tx });
});

app.post('/api/wallet/withdraw', (req: Request, res: Response) => {
  const { userId, amount, method, bankDetails, note } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (amount < settings.minWithdrawal) {
    return res.status(400).json({ error: `Minimum withdrawal amount is $${settings.minWithdrawal}` });
  }

  if (user.walletBalance < amount) {
    return res.status(400).json({ error: 'Insufficient wallet balance' });
  }

  // Deduct balance upfront pending review
  user.walletBalance -= Number(amount);

  const tx: WalletTransaction = {
    id: `tx-wdr-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    type: 'withdrawal',
    amount: Number(amount),
    status: 'pending',
    method,
    proofReference: bankDetails || 'Bank Details Provided',
    note: note || 'Withdrawal request pending',
    createdAt: new Date().toISOString(),
  };

  walletTransactions.unshift(tx);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: user.id,
    title: 'Withdrawal Processing',
    message: `Your withdrawal request of $${amount} is being processed by Admin.`,
    type: 'withdrawal',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, transaction: tx, newBalance: user.walletBalance });
});

app.get('/api/wallet/transactions', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const userTxs = walletTransactions.filter((t) => t.userId === userId);
  res.json({ transactions: userTxs });
});

// Lotteries & Draws API
app.get('/api/lotteries', (req: Request, res: Response) => {
  res.json({ lotteries });
});

app.get('/api/draws/today', (req: Request, res: Response) => {
  checkAndAutoPublishDraws();
  res.json({ draws: drawSlots, settings });
});

// Buy Tickets
app.post('/api/tickets/buy', (req: Request, res: Response) => {
  const { userId, lotteryId, drawSlotId, ticketNumbers } = req.body; // ticketNumbers = string[] (e.g. ["8492", "1029"])

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const lottery = lotteries.find((l) => l.id === lotteryId);
  if (!lottery) return res.status(404).json({ error: 'Lottery game not found' });

  const slot = drawSlots.find((s) => s.id === drawSlotId);
  if (!slot) return res.status(404).json({ error: 'Draw slot not found' });

  if (slot.status === 'Published') {
    return res.status(400).json({ error: 'This draw slot is already published. Choose an upcoming slot!' });
  }

  const totalCost = lottery.ticketPrice * ticketNumbers.length;
  if (user.walletBalance < totalCost) {
    return res.status(400).json({ error: `Insufficient balance! Total required: $${totalCost}` });
  }

  user.walletBalance -= totalCost;

  const purchased: LotteryTicket[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  ticketNumbers.forEach((num: string) => {
    const ticket: LotteryTicket = {
      id: `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticketNumber: num,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      lotteryId: lottery.id,
      lotteryName: lottery.title,
      drawSlotId: slot.id,
      drawTimeLabel: slot.timeLabel,
      drawDate: todayStr,
      ticketPrice: lottery.ticketPrice,
      status: 'active',
      prizeWon: 0,
      purchasedAt: new Date().toISOString(),
    };

    tickets.unshift(ticket);
    purchased.push(ticket);
  });

  slot.totalTicketsSold += ticketNumbers.length;
  if (lottery.totalSold) lottery.totalSold += ticketNumbers.length;

  // Add transaction
  walletTransactions.unshift({
    id: `tx-tkt-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    type: 'ticket_purchase',
    amount: totalCost,
    status: 'completed',
    method: 'Wallet',
    note: `Purchased ${ticketNumbers.length} ticket(s) for ${slot.timeLabel} Draw`,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, tickets: purchased, newBalance: user.walletBalance });
});

app.get('/api/tickets/my', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const userTickets = tickets.filter((t) => t.userId === userId);
  res.json({ tickets: userTickets });
});

app.get('/api/notifications', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const userNotifs = notifications.filter((n) => n.userId === userId);
  res.json({ notifications: userNotifs });
});

// SUPER ADMIN API ENDPOINTS
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalUsers = users.filter((u) => u.role === 'user').length;
  const totalDeposits = walletTransactions
    .filter((t) => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = walletTransactions
    .filter((t) => t.type === 'withdrawal' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTicketSales = walletTransactions
    .filter((t) => t.type === 'ticket_purchase')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingDepositsCount = walletTransactions.filter((t) => t.type === 'deposit' && t.status === 'pending').length;
  const pendingWithdrawalsCount = walletTransactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending').length;

  const stats: AdminStats = {
    totalUsers,
    totalDeposits,
    totalWithdrawals,
    totalTicketSales,
    totalRevenue: totalTicketSales * 0.3, // Platform margin estimate
    activeLotteriesCount: lotteries.length,
    pendingDepositsCount,
    pendingWithdrawalsCount,
    todayTicketsCount: tickets.length,
    todayRevenue: totalTicketSales,
  };

  res.json({ stats });
});

// Users Admin Management
app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json({ users });
});

app.put('/api/admin/users/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' | 'suspended'
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = status;

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId: 'usr-admin-1',
    adminName: 'Super Admin',
    action: 'USER_STATUS_CHANGE',
    details: `User ${user.email} status changed to ${status}`,
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, user });
});

app.post('/api/admin/users/:id/adjust-wallet', (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, amount, note } = req.body; // type: 'credit' | 'debit'

  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const numAmt = Number(amount);
  if (type === 'credit') {
    user.walletBalance += numAmt;
    walletTransactions.unshift({
      id: `tx-adm-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      type: 'admin_credit',
      amount: numAmt,
      status: 'completed',
      method: 'Admin Manual',
      note: note || 'Manual Admin Wallet Credit',
      createdAt: new Date().toISOString(),
    });
  } else {
    user.walletBalance = Math.max(0, user.walletBalance - numAmt);
    walletTransactions.unshift({
      id: `tx-adm-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      type: 'admin_debit',
      amount: numAmt,
      status: 'completed',
      method: 'Admin Manual',
      note: note || 'Manual Admin Wallet Debit',
      createdAt: new Date().toISOString(),
    });
  }

  res.json({ success: true, newBalance: user.walletBalance });
});

// Admin Deposit Approval
app.get('/api/admin/deposits', (req: Request, res: Response) => {
  const deposits = walletTransactions.filter((t) => t.type === 'deposit');
  res.json({ deposits });
});

app.post('/api/admin/deposits/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, note } = req.body; // action = 'approve' | 'reject'

  const tx = walletTransactions.find((t) => t.id === id);
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });

  if (action === 'approve') {
    tx.status = 'approved';
    tx.note = note || 'Approved by Super Admin';

    const user = users.find((u) => u.id === tx.userId);
    if (user) {
      user.walletBalance += tx.amount;

      notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: '✅ Deposit Approved!',
        message: `$${tx.amount.toLocaleString()} has been added to your wallet balance.`,
        type: 'deposit',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  } else {
    tx.status = 'rejected';
    tx.note = note || 'Rejected by Admin';

    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: tx.userId,
      title: '❌ Deposit Rejected',
      message: `Your deposit request of $${tx.amount} was rejected. Note: ${tx.note}`,
      type: 'deposit',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  res.json({ success: true, transaction: tx });
});

// Admin Withdrawal Approval
app.get('/api/admin/withdrawals', (req: Request, res: Response) => {
  const withdrawals = walletTransactions.filter((t) => t.type === 'withdrawal');
  res.json({ withdrawals });
});

app.post('/api/admin/withdrawals/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, note } = req.body; // action = 'approve' | 'reject'

  const tx = walletTransactions.find((t) => t.id === id);
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });

  if (action === 'approve') {
    tx.status = 'approved';
    tx.note = note || 'Approved & Transferred by Admin';

    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: tx.userId,
      title: '✅ Withdrawal Completed',
      message: `Your withdrawal of $${tx.amount.toLocaleString()} has been sent to your bank account.`,
      type: 'withdrawal',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  } else {
    tx.status = 'rejected';
    tx.note = note || 'Rejected by Admin';

    // Refund wallet balance
    const user = users.find((u) => u.id === tx.userId);
    if (user) {
      user.walletBalance += tx.amount;

      notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: 'Refund Issued for Rejected Withdrawal',
        message: `$${tx.amount.toLocaleString()} has been refunded back to your wallet.`,
        type: 'withdrawal',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  res.json({ success: true, transaction: tx });
});

// Admin Manual Result Publishing & Schedule Control
app.post('/api/admin/draws/publish', (req: Request, res: Response) => {
  const { slotId, winningNumber, publishType } = req.body;

  const slot = drawSlots.find((s) => s.id === slotId);
  if (!slot) return res.status(404).json({ error: 'Draw slot not found' });

  slot.status = 'Published';
  slot.winningNumber = winningNumber;
  slot.publishedAt = new Date().toISOString();
  slot.publishedByAdmin = 'Super Admin';
  slot.publishType = publishType || 'Manual';
  slot.isLocked = true;

  processDrawWinners(slot);

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId: 'usr-admin-1',
    adminName: 'Super Admin',
    action: 'PUBLISH_DRAW_RESULT',
    details: `Published Result for ${slot.timeLabel} Draw: Winning # ${winningNumber}`,
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, slot });
});

app.put('/api/admin/draws/toggle-auto', (req: Request, res: Response) => {
  const { enabled } = req.body;
  settings.autoPublishEnabled = enabled;

  auditLogs.unshift({
    id: `log-${Date.now()}`,
    adminId: 'usr-admin-1',
    adminName: 'Super Admin',
    action: 'TOGGLE_AUTO_PUBLISH',
    details: `Auto Publish set to ${enabled}`,
    ipAddress: '127.0.0.1',
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, autoPublishEnabled: settings.autoPublishEnabled });
});

app.post('/api/admin/lotteries', (req: Request, res: Response) => {
  const { title, code, description, category, ticketPrice, jackpotAmount, winningDigitsCount } = req.body;

  const newLottery: LotteryGame = {
    id: `lot-${Date.now()}`,
    title,
    code: code || title.substring(0, 5).toUpperCase(),
    description,
    category,
    ticketPrice: Number(ticketPrice),
    jackpotAmount: Number(jackpotAmount),
    drawScheduleType: category === 'Daily 30-Min' ? '30_MIN' : 'CUSTOM',
    status: 'active',
    winningDigitsCount: Number(winningDigitsCount) || 4,
    bannerBg: 'from-amber-500 via-amber-700 to-zinc-900',
    totalSold: 0,
  };

  lotteries.push(newLottery);
  res.json({ success: true, lottery: newLottery });
});

app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
  res.json({ auditLogs });
});

app.put('/api/admin/settings', (req: Request, res: Response) => {
  settings = { ...settings, ...req.body };
  res.json({ success: true, settings });
});

// Serve Vite in development
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LuxeLotto Server running at http://localhost:${PORT}`);
  });
}

startServer();
