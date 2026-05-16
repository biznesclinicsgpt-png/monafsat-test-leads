/**
 * JWT Authentication Service
 *
 * Handles token generation, verification, and refresh for the admin system.
 * In production, this would use a proper JWT library and secure key storage.
 */

// Token configuration
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'admin_access_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER: 'admin_user',
};

// Types
export interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'provider' | 'user';
  workspaceId?: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'provider' | 'user';
  workspaceId?: string;
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

/**
 * Simple base64 encoding/decoding for demo purposes.
 * In production, use proper JWT library (jose, jsonwebtoken).
 */
const base64Encode = (data: object): string => {
  return btoa(JSON.stringify(data));
};

const base64Decode = (token: string): object | null => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

/**
 * Generate an access token
 */
export const generateAccessToken = (user: AuthUser): string => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    workspaceId: user.workspaceId,
    permissions: user.permissions,
    iat: Date.now(),
    exp: Date.now() + ACCESS_TOKEN_EXPIRY,
  };

  // In production: use JWT library with RS256 or similar
  return `at.${base64Encode(payload)}.sig`;
};

/**
 * Generate a refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'refresh',
    iat: Date.now(),
    exp: Date.now() + REFRESH_TOKEN_EXPIRY,
  };

  // In production: store in httpOnly cookie, use secure random token
  return `rt.${base64Encode(payload)}.sig`;
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (user: AuthUser): AuthTokens => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user.id),
    expiresIn: ACCESS_TOKEN_EXPIRY / 1000, // in seconds
  };
};

/**
 * Verify an access token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  if (!token || !token.startsWith('at.')) {
    return null;
  }

  try {
    const [, payloadPart] = token.split('.');
    const payload = base64Decode(payloadPart) as TokenPayload;

    if (!payload || !payload.exp) {
      return null;
    }

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

/**
 * Verify a refresh token
 */
export const verifyRefreshToken = (token: string): { userId: string } | null => {
  if (!token || !token.startsWith('rt.')) {
    return null;
  }

  try {
    const [, payloadPart] = token.split('.');
    const payload = base64Decode(payloadPart) as { userId: string; exp: number };

    if (!payload || !payload.exp || !payload.userId) {
      return null;
    }

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
};

/**
 * Refresh tokens - exchange refresh token for new access token
 */
export const refreshTokens = async (refreshToken: string): Promise<AuthTokens | null> => {
  const verified = verifyRefreshToken(refreshToken);
  if (!verified) {
    return null;
  }

  // In production: fetch user from database
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  if (!storedUser) {
    return null;
  }

  const user = JSON.parse(storedUser) as AuthUser;
  if (user.id !== verified.userId) {
    return null;
  }

  // Generate new tokens (token rotation)
  return generateTokens(user);
};

/**
 * Store tokens in localStorage
 */
export const storeTokens = (tokens: AuthTokens, user: AuthUser): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Get stored access token
 */
export const getStoredAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Get stored refresh token
 */
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Get stored user
 */
export const getStoredUser = (): AuthUser | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Clear all auth data (logout)
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getStoredAccessToken();
  if (!token) return false;

  const payload = verifyAccessToken(token);
  return payload !== null;
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  const user = getStoredUser();
  return user?.role === 'admin';
};

/**
 * Get current user from token
 */
export const getCurrentUser = (): AuthUser | null => {
  const token = getStoredAccessToken();
  if (!token) return null;

  const payload = verifyAccessToken(token);
  if (!payload) return null;

  return getStoredUser();
};

/**
 * Check if token needs refresh (within 5 minutes of expiry)
 */
export const tokenNeedsRefresh = (): boolean => {
  const token = getStoredAccessToken();
  if (!token) return true;

  const payload = verifyAccessToken(token);
  if (!payload) return true;

  // Refresh if less than 5 minutes remaining
  const fiveMinutes = 5 * 60 * 1000;
  return (payload.exp - Date.now()) < fiveMinutes;
};

/**
 * Auto-refresh token if needed
 */
export const autoRefreshToken = async (): Promise<boolean> => {
  if (!tokenNeedsRefresh()) {
    return true;
  }

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return false;
  }

  const newTokens = await refreshTokens(refreshToken);
  if (!newTokens) {
    clearAuthData();
    return false;
  }

  const user = getStoredUser();
  if (user) {
    storeTokens(newTokens, user);
  }

  return true;
};

/**
 * Create authorization header
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getStoredAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

/**
 * Mock login function - In production, this calls the backend API
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock admin users for development
  const mockAdmins: Record<string, { password: string; name: string }> = {
    'admin@manafeth.com': { password: 'admin123', name: 'مدير النظام' },
    'super@manafeth.com': { password: 'super123', name: 'Super Admin' },
  };

  const adminData = mockAdmins[email.toLowerCase()];
  if (!adminData || adminData.password !== password) {
    return null;
  }

  const user: AuthUser = {
    id: `admin-${Date.now()}`,
    email: email.toLowerCase(),
    name: adminData.name,
    role: 'admin',
    permissions: [
      'integrations:read',
      'integrations:write',
      'wallet:read',
      'wallet:write',
      'workspaces:read',
      'workspaces:write',
      'audit:read',
      'policies:read',
      'policies:write',
    ],
  };

  const tokens = generateTokens(user);
  storeTokens(tokens, user);

  return { tokens, user };
};

/**
 * Logout function
 */
export const logout = (): void => {
  clearAuthData();
};

export default {
  login,
  logout,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  refreshTokens,
  isAuthenticated,
  isAdmin,
  getCurrentUser,
  getAuthHeader,
  autoRefreshToken,
};
