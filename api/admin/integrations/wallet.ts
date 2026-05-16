/**
 * Admin API: Wallet Management
 *
 * Endpoints for managing workspace wallets and credits.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, type AdminApiRequest } from '@/middleware/adminAuth';

// Types
interface WorkspaceWallet {
  id: string;
  workspaceId: string;
  workspaceName: string;
  creditBalance: number;
  reservedCredits: number;
  monthlyLimit?: number;
  dailyLimit?: number;
  usedThisMonth: number;
  usedToday: number;
  status: 'active' | 'suspended' | 'exhausted';
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd?: string;
}

interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'credit_add' | 'credit_use' | 'refund' | 'adjustment' | 'reservation' | 'release';
  amount: number;
  balanceAfter: number;
  providerId?: string;
  providerName?: string;
  requestType?: string;
  description?: string;
  performedBy?: string;
  createdAt: string;
}

interface AddCreditsRequest {
  workspaceId: string;
  amount: number;
  note?: string;
}

interface SetLimitsRequest {
  workspaceId: string;
  monthlyLimit?: number;
  dailyLimit?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * GET /api/admin/integrations/wallet
 * List all workspace wallets
 */
async function listWallets(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<WorkspaceWallet[]>>
) {
  try {
    // In production: fetch from database
    // const wallets = await prisma.workspaceWallet.findMany({
    //   include: { workspace: true },
    // });

    // Mock data
    const wallets: WorkspaceWallet[] = [
      {
        id: 'wallet-1',
        workspaceId: 'ws-1',
        workspaceName: 'Workspace Alpha',
        creditBalance: 15000,
        reservedCredits: 200,
        monthlyLimit: 50000,
        dailyLimit: 2000,
        usedThisMonth: 3500,
        usedToday: 450,
        status: 'active',
        billingCycle: 'monthly',
        currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'wallet-2',
        workspaceId: 'ws-2',
        workspaceName: 'Workspace Beta',
        creditBalance: 8500,
        reservedCredits: 0,
        monthlyLimit: 25000,
        dailyLimit: 1000,
        usedThisMonth: 7200,
        usedToday: 320,
        status: 'active',
        billingCycle: 'monthly',
        currentPeriodStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'wallet-3',
        workspaceId: 'ws-3',
        workspaceName: 'Workspace Gamma',
        creditBalance: 150,
        reservedCredits: 0,
        usedThisMonth: 4850,
        usedToday: 0,
        status: 'exhausted',
        billingCycle: 'monthly',
        currentPeriodStart: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return res.status(200).json({
      success: true,
      data: wallets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to list wallets',
    });
  }
}

/**
 * GET /api/admin/integrations/wallet/[workspaceId]
 * Get wallet details for a specific workspace
 */
async function getWallet(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<WorkspaceWallet>>,
  workspaceId: string
) {
  try {
    // Mock response
    const wallet: WorkspaceWallet = {
      id: 'wallet-1',
      workspaceId,
      workspaceName: 'Workspace Alpha',
      creditBalance: 15000,
      reservedCredits: 200,
      monthlyLimit: 50000,
      dailyLimit: 2000,
      usedThisMonth: 3500,
      usedToday: 450,
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to get wallet',
    });
  }
}

/**
 * GET /api/admin/integrations/wallet/[workspaceId]/transactions
 * Get transaction history for a workspace
 */
async function getTransactions(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<WalletTransaction[]>>,
  workspaceId: string
) {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Mock transactions
    const transactions: WalletTransaction[] = [
      {
        id: 'tx-1',
        walletId: 'wallet-1',
        type: 'credit_use',
        amount: -250,
        balanceAfter: 15000,
        providerId: 'apollo',
        providerName: 'Apollo',
        requestType: 'email_enrich',
        description: 'إثراء بريد (250 سجل)',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'tx-2',
        walletId: 'wallet-1',
        type: 'credit_add',
        amount: 5000,
        balanceAfter: 15250,
        description: 'شحن رصيد شهري',
        performedBy: 'admin@manafeth.com',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'tx-3',
        walletId: 'wallet-1',
        type: 'credit_use',
        amount: -180,
        balanceAfter: 10250,
        providerId: 'prospeo',
        providerName: 'Prospeo',
        requestType: 'phone_enrich',
        description: 'إثراء هاتف (120 سجل)',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: 'tx-4',
        walletId: 'wallet-1',
        type: 'refund',
        amount: 50,
        balanceAfter: 10430,
        providerId: 'apollo',
        providerName: 'Apollo',
        description: 'استرداد - فشل API',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ];

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to get transactions',
    });
  }
}

/**
 * POST /api/admin/integrations/wallet/add-credits
 * Add credits to a workspace
 */
async function addCredits(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { workspaceId, amount, note } = req.body as AddCreditsRequest;

    if (!workspaceId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'Valid workspaceId and positive amount required',
      });
    }

    // In production: update database
    // await prisma.$transaction([
    //   prisma.workspaceWallet.update({
    //     where: { workspaceId },
    //     data: { creditBalance: { increment: amount } },
    //   }),
    //   prisma.walletTransaction.create({
    //     data: {
    //       walletId: wallet.id,
    //       type: 'credit_add',
    //       amount,
    //       balanceAfter: wallet.creditBalance + amount,
    //       description: note,
    //       performedBy: req.adminUser.userId,
    //     },
    //   }),
    // ]);

    console.log(`[Admin] Added ${amount} credits to ${workspaceId} by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: `Added ${amount} credits to workspace`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to add credits',
    });
  }
}

/**
 * POST /api/admin/integrations/wallet/set-limits
 * Set usage limits for a workspace
 */
async function setLimits(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { workspaceId, monthlyLimit, dailyLimit } = req.body as SetLimitsRequest;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'workspaceId required',
      });
    }

    // In production: update database
    // await prisma.workspaceWallet.update({
    //   where: { workspaceId },
    //   data: {
    //     ...(monthlyLimit !== undefined && { monthlyLimit }),
    //     ...(dailyLimit !== undefined && { dailyLimit }),
    //   },
    // });

    console.log(`[Admin] Updated limits for ${workspaceId} by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: 'Limits updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to set limits',
    });
  }
}

/**
 * GET /api/admin/integrations/wallet/summary
 * Get overall wallet summary across all workspaces
 */
async function getSummary(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Mock summary
    const summary = {
      totalCredits: 73650,
      totalReserved: 700,
      totalAvailable: 72950,
      totalUsedThisMonth: 15550,
      activeWorkspaces: 3,
      lowBalanceWorkspaces: 1,
      exhaustedWorkspaces: 1,
    };

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to get summary',
    });
  }
}

/**
 * Main handler
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminReq = req as AdminApiRequest;
  const { workspaceId, action } = req.query;
  const url = req.url || '';

  switch (req.method) {
    case 'GET':
      if (url.includes('/summary')) {
        return getSummary(adminReq, res);
      }
      if (url.includes('/transactions') && workspaceId) {
        return getTransactions(adminReq, res, workspaceId as string);
      }
      if (workspaceId && typeof workspaceId === 'string') {
        return getWallet(adminReq, res, workspaceId);
      }
      return listWallets(adminReq, res);

    case 'POST':
      if (url.includes('/add-credits')) {
        return addCredits(adminReq, res);
      }
      if (url.includes('/set-limits')) {
        return setLimits(adminReq, res);
      }
      return res.status(405).json({ success: false, error: 'Method not allowed' });

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

export default requireAdmin(handler);
