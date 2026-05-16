/**
 * Wallet Service
 *
 * Handles credit management, reservations, and deductions for enrichment operations.
 * Integrates with the waterfall orchestrator to ensure credits are available before operations.
 */

// Types
export interface WalletBalance {
  workspaceId: string;
  creditBalance: number;
  reservedCredits: number;
  availableCredits: number;
  monthlyLimit: number | null;
  dailyLimit: number | null;
  usedThisMonth: number;
  usedToday: number;
  status: 'active' | 'suspended' | 'exhausted';
}

export interface CreditReservation {
  id: string;
  workspaceId: string;
  amount: number;
  providerId: string;
  requestType: string;
  entityId?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface DeductionResult {
  success: boolean;
  reservationId?: string;
  error?: string;
  errorCode?: 'INSUFFICIENT_BALANCE' | 'LIMIT_EXCEEDED' | 'WALLET_SUSPENDED' | 'PROVIDER_DISABLED';
  availableCredits?: number;
}

export interface CostMatrix {
  [provider: string]: {
    email_enrich: number;
    phone_enrich: number;
    company_enrich: number;
    linkedin_enrich: number;
    verify_email: number;
    verify_phone: number;
  };
}

// Default cost matrix per provider per action
const DEFAULT_COSTS: CostMatrix = {
  apollo: {
    email_enrich: 1,
    phone_enrich: 1,
    company_enrich: 0.5,
    linkedin_enrich: 1,
    verify_email: 0.2,
    verify_phone: 0.3,
  },
  prospeo: {
    email_enrich: 1,
    phone_enrich: 1.5,
    company_enrich: 0,
    linkedin_enrich: 1,
    verify_email: 0.3,
    verify_phone: 0,
  },
  lemlist: {
    email_enrich: 0.8,
    phone_enrich: 1,
    company_enrich: 0,
    linkedin_enrich: 0.8,
    verify_email: 0.2,
    verify_phone: 0,
  },
  hunter: {
    email_enrich: 1,
    phone_enrich: 0,
    company_enrich: 0,
    linkedin_enrich: 0,
    verify_email: 0.5,
    verify_phone: 0,
  },
  clearbit: {
    email_enrich: 5,
    phone_enrich: 0,
    company_enrich: 3,
    linkedin_enrich: 0,
    verify_email: 0,
    verify_phone: 0,
  },
};

// Storage keys for localStorage (development)
const STORAGE_KEYS = {
  WALLETS: 'wallet_balances',
  RESERVATIONS: 'wallet_reservations',
  TRANSACTIONS: 'wallet_transactions',
};

// Reservation expiry time (5 minutes)
const RESERVATION_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Get cost for a specific operation
 */
export const getOperationCost = (
  providerSlug: string,
  requestType: string,
  costOverride?: number
): number => {
  if (costOverride !== undefined) {
    return costOverride;
  }

  const providerCosts = DEFAULT_COSTS[providerSlug];
  if (!providerCosts) {
    return 1; // Default cost
  }

  return providerCosts[requestType as keyof typeof providerCosts] || 1;
};

/**
 * Get wallet balance for a workspace
 */
export const getWalletBalance = (workspaceId: string): WalletBalance | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WALLETS);
    const wallets: Record<string, WalletBalance> = stored ? JSON.parse(stored) : {};
    return wallets[workspaceId] || null;
  } catch {
    return null;
  }
};

/**
 * Initialize wallet for a workspace (if not exists)
 */
export const initializeWallet = (
  workspaceId: string,
  initialCredits: number = 0
): WalletBalance => {
  const existing = getWalletBalance(workspaceId);
  if (existing) {
    return existing;
  }

  const wallet: WalletBalance = {
    workspaceId,
    creditBalance: initialCredits,
    reservedCredits: 0,
    availableCredits: initialCredits,
    monthlyLimit: null,
    dailyLimit: null,
    usedThisMonth: 0,
    usedToday: 0,
    status: 'active',
  };

  saveWalletBalance(wallet);
  return wallet;
};

/**
 * Save wallet balance to storage
 */
const saveWalletBalance = (wallet: WalletBalance): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WALLETS);
    const wallets: Record<string, WalletBalance> = stored ? JSON.parse(stored) : {};
    wallets[wallet.workspaceId] = {
      ...wallet,
      availableCredits: wallet.creditBalance - wallet.reservedCredits,
    };
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  } catch (error) {
    console.error('Failed to save wallet balance:', error);
  }
};

/**
 * Check if workspace has enough credits for an operation
 */
export const checkBalance = (
  workspaceId: string,
  amount: number,
  providerSlug?: string
): { canProceed: boolean; error?: string; errorCode?: string } => {
  const wallet = getWalletBalance(workspaceId);

  if (!wallet) {
    return {
      canProceed: false,
      error: 'Wallet not found',
      errorCode: 'WALLET_NOT_FOUND',
    };
  }

  if (wallet.status === 'suspended') {
    return {
      canProceed: false,
      error: 'Wallet is suspended',
      errorCode: 'WALLET_SUSPENDED',
    };
  }

  if (wallet.status === 'exhausted') {
    return {
      canProceed: false,
      error: 'Wallet is exhausted',
      errorCode: 'INSUFFICIENT_BALANCE',
    };
  }

  const availableCredits = wallet.creditBalance - wallet.reservedCredits;

  if (availableCredits < amount) {
    return {
      canProceed: false,
      error: `Insufficient credits. Available: ${availableCredits}, Required: ${amount}`,
      errorCode: 'INSUFFICIENT_BALANCE',
    };
  }

  // Check daily limit
  if (wallet.dailyLimit && wallet.usedToday + amount > wallet.dailyLimit) {
    return {
      canProceed: false,
      error: `Daily limit exceeded. Used: ${wallet.usedToday}, Limit: ${wallet.dailyLimit}`,
      errorCode: 'LIMIT_EXCEEDED',
    };
  }

  // Check monthly limit
  if (wallet.monthlyLimit && wallet.usedThisMonth + amount > wallet.monthlyLimit) {
    return {
      canProceed: false,
      error: `Monthly limit exceeded. Used: ${wallet.usedThisMonth}, Limit: ${wallet.monthlyLimit}`,
      errorCode: 'LIMIT_EXCEEDED',
    };
  }

  return { canProceed: true };
};

/**
 * Reserve credits for a pending operation
 */
export const reserveCredits = (
  workspaceId: string,
  amount: number,
  providerId: string,
  requestType: string,
  entityId?: string
): DeductionResult => {
  const check = checkBalance(workspaceId, amount, providerId);

  if (!check.canProceed) {
    return {
      success: false,
      error: check.error,
      errorCode: check.errorCode as DeductionResult['errorCode'],
    };
  }

  const wallet = getWalletBalance(workspaceId)!;

  // Create reservation
  const reservation: CreditReservation = {
    id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workspaceId,
    amount,
    providerId,
    requestType,
    entityId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + RESERVATION_EXPIRY_MS),
  };

  // Save reservation
  saveReservation(reservation);

  // Update wallet reserved credits
  wallet.reservedCredits += amount;
  saveWalletBalance(wallet);

  return {
    success: true,
    reservationId: reservation.id,
    availableCredits: wallet.creditBalance - wallet.reservedCredits,
  };
};

/**
 * Confirm deduction (after successful operation)
 */
export const confirmDeduction = (reservationId: string): boolean => {
  const reservation = getReservation(reservationId);
  if (!reservation) {
    console.warn(`Reservation ${reservationId} not found`);
    return false;
  }

  const wallet = getWalletBalance(reservation.workspaceId);
  if (!wallet) {
    return false;
  }

  // Deduct from balance
  wallet.creditBalance -= reservation.amount;
  wallet.reservedCredits -= reservation.amount;
  wallet.usedToday += reservation.amount;
  wallet.usedThisMonth += reservation.amount;

  // Update status if exhausted
  if (wallet.creditBalance <= 0) {
    wallet.status = 'exhausted';
  }

  saveWalletBalance(wallet);

  // Log transaction
  logTransaction({
    walletId: reservation.workspaceId,
    type: 'credit_use',
    amount: -reservation.amount,
    balanceAfter: wallet.creditBalance,
    providerId: reservation.providerId,
    requestType: reservation.requestType,
    entityId: reservation.entityId,
  });

  // Remove reservation
  removeReservation(reservationId);

  return true;
};

/**
 * Release reservation (operation failed or cancelled)
 */
export const releaseReservation = (reservationId: string): boolean => {
  const reservation = getReservation(reservationId);
  if (!reservation) {
    return false;
  }

  const wallet = getWalletBalance(reservation.workspaceId);
  if (!wallet) {
    return false;
  }

  // Release reserved credits
  wallet.reservedCredits -= reservation.amount;
  saveWalletBalance(wallet);

  // Log release
  logTransaction({
    walletId: reservation.workspaceId,
    type: 'release',
    amount: 0,
    balanceAfter: wallet.creditBalance,
    providerId: reservation.providerId,
    requestType: 'reservation_release',
    description: `Released reservation ${reservationId}`,
  });

  // Remove reservation
  removeReservation(reservationId);

  return true;
};

/**
 * Add credits to wallet
 */
export const addCredits = (
  workspaceId: string,
  amount: number,
  note?: string,
  performedBy?: string
): boolean => {
  let wallet = getWalletBalance(workspaceId);

  if (!wallet) {
    wallet = initializeWallet(workspaceId, 0);
  }

  wallet.creditBalance += amount;

  // Reactivate if was exhausted
  if (wallet.status === 'exhausted' && wallet.creditBalance > 0) {
    wallet.status = 'active';
  }

  saveWalletBalance(wallet);

  // Log transaction
  logTransaction({
    walletId: workspaceId,
    type: 'credit_add',
    amount,
    balanceAfter: wallet.creditBalance,
    description: note,
    performedBy,
  });

  return true;
};

/**
 * Issue refund
 */
export const issueRefund = (
  workspaceId: string,
  amount: number,
  providerId: string,
  reason?: string
): boolean => {
  const wallet = getWalletBalance(workspaceId);
  if (!wallet) {
    return false;
  }

  wallet.creditBalance += amount;

  // Adjust usage tracking
  if (wallet.usedToday >= amount) {
    wallet.usedToday -= amount;
  }
  if (wallet.usedThisMonth >= amount) {
    wallet.usedThisMonth -= amount;
  }

  // Reactivate if was exhausted
  if (wallet.status === 'exhausted' && wallet.creditBalance > 0) {
    wallet.status = 'active';
  }

  saveWalletBalance(wallet);

  // Log transaction
  logTransaction({
    walletId: workspaceId,
    type: 'refund',
    amount,
    balanceAfter: wallet.creditBalance,
    providerId,
    description: reason || 'Refund issued',
  });

  return true;
};

// ==========================================
// Helper functions for reservation storage
// ==========================================

const getReservation = (id: string): CreditReservation | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    const reservations: Record<string, CreditReservation> = stored ? JSON.parse(stored) : {};
    return reservations[id] || null;
  } catch {
    return null;
  }
};

const saveReservation = (reservation: CreditReservation): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    const reservations: Record<string, CreditReservation> = stored ? JSON.parse(stored) : {};
    reservations[reservation.id] = reservation;
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  } catch (error) {
    console.error('Failed to save reservation:', error);
  }
};

const removeReservation = (id: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    const reservations: Record<string, CreditReservation> = stored ? JSON.parse(stored) : {};
    delete reservations[id];
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  } catch (error) {
    console.error('Failed to remove reservation:', error);
  }
};

// ==========================================
// Transaction logging
// ==========================================

interface TransactionLog {
  walletId: string;
  type: 'credit_add' | 'credit_use' | 'refund' | 'adjustment' | 'reservation' | 'release';
  amount: number;
  balanceAfter: number;
  providerId?: string;
  requestType?: string;
  entityId?: string;
  description?: string;
  performedBy?: string;
}

const logTransaction = (tx: TransactionLog): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const transactions: Array<TransactionLog & { id: string; createdAt: string }> = stored
      ? JSON.parse(stored)
      : [];

    transactions.unshift({
      ...tx,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });

    // Keep only last 500 transactions
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions.slice(0, 500))
    );
  } catch (error) {
    console.error('Failed to log transaction:', error);
  }
};

/**
 * Get transaction history
 */
export const getTransactionHistory = (
  workspaceId: string,
  limit: number = 50
): Array<TransactionLog & { id: string; createdAt: string }> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const transactions: Array<TransactionLog & { id: string; createdAt: string }> = stored
      ? JSON.parse(stored)
      : [];

    return transactions.filter((tx) => tx.walletId === workspaceId).slice(0, limit);
  } catch {
    return [];
  }
};

/**
 * Clean up expired reservations
 */
export const cleanupExpiredReservations = (): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    const reservations: Record<string, CreditReservation> = stored ? JSON.parse(stored) : {};

    const now = Date.now();
    for (const [id, reservation] of Object.entries(reservations)) {
      if (new Date(reservation.expiresAt).getTime() < now) {
        releaseReservation(id);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup reservations:', error);
  }
};

// Run cleanup on module load
if (typeof window !== 'undefined') {
  cleanupExpiredReservations();
  // Schedule cleanup every minute
  setInterval(cleanupExpiredReservations, 60 * 1000);
}

export default {
  getOperationCost,
  getWalletBalance,
  initializeWallet,
  checkBalance,
  reserveCredits,
  confirmDeduction,
  releaseReservation,
  addCredits,
  issueRefund,
  getTransactionHistory,
  cleanupExpiredReservations,
  DEFAULT_COSTS,
};
