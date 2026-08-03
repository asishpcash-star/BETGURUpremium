export type UserRole = 'user' | 'super_admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  walletBalance: number;
  profilePic?: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  verified18Plus: boolean;
}

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'ticket_purchase'
  | 'lottery_winning'
  | 'admin_credit'
  | 'admin_debit';

export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WalletTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  method: string; // 'UPI' | 'Bank Transfer' | 'QR Code' | 'Wallet'
  proofReference?: string; // UTR or Ref number
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export type LotteryCategory = 'Daily 30-Min' | 'Weekly Mega' | 'Special VIP';
export type LotteryStatus = 'active' | 'upcoming' | 'closed';

export interface LotteryGame {
  id: string;
  title: string;
  code: string;
  description: string;
  category: LotteryCategory;
  ticketPrice: number;
  jackpotAmount: number;
  drawScheduleType: '30_MIN' | 'CUSTOM';
  status: LotteryStatus;
  winningDigitsCount: number; // e.g. 4 or 6 digits
  bannerBg: string;
  nextDrawTime?: string;
  totalSold?: number;
}

export type DrawSlotStatus = 'Upcoming' | 'Live' | 'Published';

export interface DrawSlot {
  id: string; // e.g. "slot-1", "slot-2"
  slotIndex: number; // 1 to 29
  timeLabel: string; // "08:00 AM", "08:30 AM", ..., "10:00 PM"
  time24: string; // "08:00", "08:30", ..., "22:00"
  lotteryId: string;
  lotteryName: string;
  winningNumber: string | null; // e.g. "8492" or "910283"
  status: DrawSlotStatus;
  publishType: 'Auto' | 'Manual';
  publishedAt?: string;
  publishedByAdmin?: string;
  isLocked?: boolean;
  payoutProcessed?: boolean;
  totalTicketsSold: number;
  totalPrizeDistributed: number;
  winningTicketCount?: number;
}

export type TicketStatus = 'active' | 'won' | 'lost';

export interface LotteryTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  lotteryId: string;
  lotteryName: string;
  drawSlotId: string;
  drawTimeLabel: string;
  drawDate: string; // YYYY-MM-DD
  ticketPrice: number;
  status: TicketStatus;
  prizeWon: number;
  purchasedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'winning' | 'deposit' | 'withdrawal' | 'security';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface SystemSettings {
  autoPublishEnabled: boolean;
  minDeposit: number;
  minWithdrawal: number;
  upiId: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  qrCodeUrl: string;
  siteAnnouncements: string;
  maintenanceMode: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTicketSales: number;
  totalRevenue: number;
  activeLotteriesCount: number;
  pendingDepositsCount: number;
  pendingWithdrawalsCount: number;
  todayTicketsCount: number;
  todayRevenue: number;
}
