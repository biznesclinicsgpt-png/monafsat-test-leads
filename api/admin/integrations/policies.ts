/**
 * Admin API: Policies Management
 *
 * Endpoints for managing credit policies and compliance rules.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin, type AdminApiRequest } from '@/middleware/adminAuth';

// Types
interface CreditPolicy {
  id: string;
  walletId: string;
  workspaceId: string;
  workspaceName: string;
  providerSlug: string;
  providerName: string;
  enabled: boolean;
  dailyLimit?: number;
  monthlyLimit?: number;
  usedToday: number;
  usedThisMonth: number;
  unitCostOverride?: number;
  allowedFeatures: string[];
  overagePolicy: 'stop' | 'request_approval' | 'auto_topup';
  createdAt: string;
  updatedAt: string;
}

interface CreatePolicyRequest {
  workspaceId: string;
  providerSlug: string;
  enabled?: boolean;
  dailyLimit?: number;
  monthlyLimit?: number;
  allowedFeatures?: string[];
  overagePolicy?: 'stop' | 'request_approval' | 'auto_topup';
}

interface UpdatePolicyRequest {
  enabled?: boolean;
  dailyLimit?: number;
  monthlyLimit?: number;
  unitCostOverride?: number;
  allowedFeatures?: string[];
  overagePolicy?: 'stop' | 'request_approval' | 'auto_topup';
}

interface BlacklistEntry {
  id: string;
  type: 'domain' | 'email';
  value: string;
  reason?: string;
  addedBy: string;
  createdAt: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * GET /api/admin/integrations/policies
 * List all credit policies
 */
async function listPolicies(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<CreditPolicy[]>>
) {
  try {
    const { workspaceId, providerSlug } = req.query;

    // Mock data
    let policies: CreditPolicy[] = [
      {
        id: 'policy-1',
        walletId: 'wallet-1',
        workspaceId: 'ws-1',
        workspaceName: 'Workspace Alpha',
        providerSlug: 'apollo',
        providerName: 'Apollo',
        enabled: true,
        dailyLimit: 500,
        monthlyLimit: 10000,
        usedToday: 150,
        usedThisMonth: 3200,
        allowedFeatures: ['email_find', 'phone_find', 'verify'],
        overagePolicy: 'stop',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'policy-2',
        walletId: 'wallet-1',
        workspaceId: 'ws-1',
        workspaceName: 'Workspace Alpha',
        providerSlug: 'prospeo',
        providerName: 'Prospeo',
        enabled: true,
        dailyLimit: 300,
        monthlyLimit: 5000,
        usedToday: 80,
        usedThisMonth: 1500,
        allowedFeatures: ['email_find', 'linkedin_enrich'],
        overagePolicy: 'request_approval',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'policy-3',
        walletId: 'wallet-2',
        workspaceId: 'ws-2',
        workspaceName: 'Workspace Beta',
        providerSlug: 'apollo',
        providerName: 'Apollo',
        enabled: true,
        dailyLimit: 1000,
        monthlyLimit: 25000,
        usedToday: 450,
        usedThisMonth: 7200,
        allowedFeatures: ['email_find', 'phone_find', 'company_enrich', 'verify'],
        overagePolicy: 'stop',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Filter by workspace
    if (workspaceId) {
      policies = policies.filter((p) => p.workspaceId === workspaceId);
    }

    // Filter by provider
    if (providerSlug) {
      policies = policies.filter((p) => p.providerSlug === providerSlug);
    }

    return res.status(200).json({
      success: true,
      data: policies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to list policies',
    });
  }
}

/**
 * POST /api/admin/integrations/policies
 * Create a new credit policy
 */
async function createPolicy(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<CreditPolicy>>
) {
  try {
    const body = req.body as CreatePolicyRequest;

    if (!body.workspaceId || !body.providerSlug) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'workspaceId and providerSlug are required',
      });
    }

    // In production: create in database
    // const policy = await prisma.creditPolicy.create({
    //   data: {
    //     wallet: { connect: { workspaceId: body.workspaceId } },
    //     providerSlug: body.providerSlug,
    //     enabled: body.enabled ?? true,
    //     dailyLimit: body.dailyLimit,
    //     monthlyLimit: body.monthlyLimit,
    //     allowedFeatures: body.allowedFeatures ?? [],
    //     overagePolicy: body.overagePolicy ?? 'stop',
    //   },
    // });

    const newPolicy: CreditPolicy = {
      id: `policy-${Date.now()}`,
      walletId: 'wallet-x',
      workspaceId: body.workspaceId,
      workspaceName: 'New Workspace',
      providerSlug: body.providerSlug,
      providerName: body.providerSlug.charAt(0).toUpperCase() + body.providerSlug.slice(1),
      enabled: body.enabled ?? true,
      dailyLimit: body.dailyLimit,
      monthlyLimit: body.monthlyLimit,
      usedToday: 0,
      usedThisMonth: 0,
      allowedFeatures: body.allowedFeatures ?? [],
      overagePolicy: body.overagePolicy ?? 'stop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(`[Admin] Policy created by ${req.adminUser?.email}:`, newPolicy);

    return res.status(201).json({
      success: true,
      data: newPolicy,
      message: 'Policy created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to create policy',
    });
  }
}

/**
 * PUT /api/admin/integrations/policies/[id]
 * Update a credit policy
 */
async function updatePolicy(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>,
  policyId: string
) {
  try {
    const body = req.body as UpdatePolicyRequest;

    // In production: update in database
    // await prisma.creditPolicy.update({
    //   where: { id: policyId },
    //   data: {
    //     ...(body.enabled !== undefined && { enabled: body.enabled }),
    //     ...(body.dailyLimit !== undefined && { dailyLimit: body.dailyLimit }),
    //     ...(body.monthlyLimit !== undefined && { monthlyLimit: body.monthlyLimit }),
    //     ...(body.unitCostOverride !== undefined && { unitCostOverride: body.unitCostOverride }),
    //     ...(body.allowedFeatures && { allowedFeatures: body.allowedFeatures }),
    //     ...(body.overagePolicy && { overagePolicy: body.overagePolicy }),
    //   },
    // });

    console.log(`[Admin] Policy ${policyId} updated by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: 'Policy updated successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to update policy',
    });
  }
}

/**
 * DELETE /api/admin/integrations/policies/[id]
 * Delete a credit policy
 */
async function deletePolicy(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>,
  policyId: string
) {
  try {
    // In production: delete from database
    // await prisma.creditPolicy.delete({ where: { id: policyId } });

    console.log(`[Admin] Policy ${policyId} deleted by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: 'Policy deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to delete policy',
    });
  }
}

/**
 * GET /api/admin/integrations/policies/blacklist
 * Get blacklist entries
 */
async function getBlacklist(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse<BlacklistEntry[]>>
) {
  try {
    const { type } = req.query;

    // Mock data
    let blacklist: BlacklistEntry[] = [
      { id: 'bl-1', type: 'domain', value: 'competitor.com', reason: 'Competitor', addedBy: 'admin@manafeth.com', createdAt: new Date().toISOString() },
      { id: 'bl-2', type: 'domain', value: 'blocked.org', reason: 'Policy violation', addedBy: 'admin@manafeth.com', createdAt: new Date().toISOString() },
      { id: 'bl-3', type: 'email', value: 'spam@example.com', reason: 'Spam', addedBy: 'admin@manafeth.com', createdAt: new Date().toISOString() },
    ];

    if (type) {
      blacklist = blacklist.filter((b) => b.type === type);
    }

    return res.status(200).json({
      success: true,
      data: blacklist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to get blacklist',
    });
  }
}

/**
 * POST /api/admin/integrations/policies/blacklist
 * Add to blacklist
 */
async function addToBlacklist(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { type, value, reason } = req.body;

    if (!type || !value || !['domain', 'email'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'Valid type (domain/email) and value required',
      });
    }

    console.log(`[Admin] Added ${type} ${value} to blacklist by ${req.adminUser?.email}`);

    return res.status(201).json({
      success: true,
      message: `${value} added to blacklist`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to add to blacklist',
    });
  }
}

/**
 * DELETE /api/admin/integrations/policies/blacklist/[id]
 * Remove from blacklist
 */
async function removeFromBlacklist(
  req: AdminApiRequest,
  res: NextApiResponse<ApiResponse>,
  entryId: string
) {
  try {
    console.log(`[Admin] Removed ${entryId} from blacklist by ${req.adminUser?.email}`);

    return res.status(200).json({
      success: true,
      message: 'Removed from blacklist',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Failed to remove from blacklist',
    });
  }
}

/**
 * Main handler
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminReq = req as AdminApiRequest;
  const { id } = req.query;
  const url = req.url || '';

  // Blacklist routes
  if (url.includes('/blacklist')) {
    switch (req.method) {
      case 'GET':
        return getBlacklist(adminReq, res);
      case 'POST':
        return addToBlacklist(adminReq, res);
      case 'DELETE':
        if (id) {
          return removeFromBlacklist(adminReq, res, id as string);
        }
        return res.status(400).json({ success: false, error: 'Entry ID required' });
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  }

  // Policy routes
  switch (req.method) {
    case 'GET':
      return listPolicies(adminReq, res);

    case 'POST':
      return createPolicy(adminReq, res);

    case 'PUT':
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Policy ID required' });
      }
      return updatePolicy(adminReq, res, id);

    case 'DELETE':
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Policy ID required' });
      }
      return deletePolicy(adminReq, res, id);

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

export default requireAdmin(handler);
