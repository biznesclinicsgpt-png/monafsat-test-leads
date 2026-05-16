/**
 * Admin Authentication Middleware
 *
 * Protects admin-only API endpoints and logs admin actions.
 */

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { verifyAccessToken, type TokenPayload } from '../services/auth/jwtService';

// Extend NextApiRequest to include admin user
export interface AdminApiRequest extends NextApiRequest {
  adminUser?: TokenPayload;
}

export interface AdminApiResponse {
  error: string;
  message: string;
  code?: string;
}

/**
 * Middleware to require admin authentication
 */
export function requireAdmin(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required',
        code: 'NO_TOKEN',
      } as AdminApiResponse);
    }

    const token = authHeader.replace('Bearer ', '');

    // 2. Verify token
    const payload = verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      } as AdminApiResponse);
    }

    // 3. Check admin role
    if (payload.role !== 'admin') {
      return res.status(403).json({
        error: 'forbidden',
        message: 'Admin access required',
        code: 'NOT_ADMIN',
      } as AdminApiResponse);
    }

    // 4. Attach user to request
    (req as AdminApiRequest).adminUser = payload;

    // 5. Log admin action for audit
    await logAdminAction({
      userId: payload.userId,
      email: payload.email,
      endpoint: req.url || '',
      method: req.method || '',
      timestamp: new Date(),
      ip: getClientIP(req),
    });

    // 6. Continue to handler
    return handler(req, res);
  };
}

/**
 * Middleware to require authentication (any role)
 */
export function requireAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Authentication required',
        code: 'NO_TOKEN',
      } as AdminApiResponse);
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      } as AdminApiResponse);
    }

    (req as AdminApiRequest).adminUser = payload;
    return handler(req, res);
  };
}

/**
 * Check if user has specific permission
 */
export function requirePermission(permission: string, handler: NextApiHandler) {
  return requireAdmin(async (req: NextApiRequest, res: NextApiResponse) => {
    const adminReq = req as AdminApiRequest;
    const userPermissions = adminReq.adminUser?.permissions || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: 'forbidden',
        message: `Permission '${permission}' required`,
        code: 'INSUFFICIENT_PERMISSIONS',
      } as AdminApiResponse);
    }

    return handler(req, res);
  });
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Log admin action for audit trail
 */
interface AdminActionLog {
  userId: string;
  email: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  ip: string;
}

async function logAdminAction(action: AdminActionLog): Promise<void> {
  // In production, this would write to database (AdminAuditLog model)
  console.log('[Admin Action]', {
    ...action,
    timestamp: action.timestamp.toISOString(),
  });

  // Store in localStorage for demo purposes
  try {
    const logs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    logs.unshift({
      ...action,
      timestamp: action.timestamp.toISOString(),
    });
    // Keep only last 100 logs
    localStorage.setItem('admin_audit_logs', JSON.stringify(logs.slice(0, 100)));
  } catch {
    // Ignore localStorage errors (server-side)
  }
}

/**
 * Rate limiting for sensitive endpoints
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  maxRequests: number,
  windowMs: number
) {
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const ip = getClientIP(req);
      const key = `${ip}:${req.url}`;
      const now = Date.now();

      const limiter = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

      // Reset if window expired
      if (now > limiter.resetTime) {
        limiter.count = 0;
        limiter.resetTime = now + windowMs;
      }

      limiter.count++;
      rateLimitMap.set(key, limiter);

      if (limiter.count > maxRequests) {
        return res.status(429).json({
          error: 'too_many_requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((limiter.resetTime - now) / 1000),
        });
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - limiter.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(limiter.resetTime / 1000));

      return handler(req, res);
    };
  };
}

/**
 * Combine multiple middleware
 */
export function compose(...middlewares: Array<(handler: NextApiHandler) => NextApiHandler>) {
  return (handler: NextApiHandler): NextApiHandler => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

export default {
  requireAdmin,
  requireAuth,
  requirePermission,
  rateLimit,
  compose,
};
