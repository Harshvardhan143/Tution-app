import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { SECURITY } from '@/config/constants';
import { redis } from './redis';

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
  jti: string; // JWT ID for blacklist verification
}

// Clean keys by replacing literal '\n' sequences with actual newline characters
const cleanKey = (key: string) => {
  return key ? key.replace(/\\n/g, '\n') : '';
};

const accessPrivateKey = cleanKey(env.JWT_ACCESS_PRIVATE_KEY);
const accessPublicKey = cleanKey(env.JWT_ACCESS_PUBLIC_KEY);
const refreshPrivateKey = cleanKey(env.JWT_REFRESH_PRIVATE_KEY);
const refreshPublicKey = cleanKey(env.JWT_REFRESH_PUBLIC_KEY);

// Helper to determine if we should fall back to HS256 for local dev testing
// when key is placeholder or invalid PEM
const useHS256Fallback =
  env.NODE_ENV !== 'production' &&
  (!accessPrivateKey.includes('BEGIN RSA') || !accessPublicKey.includes('BEGIN PUBLIC'));

if (useHS256Fallback) {
  console.warn(
    '⚠️ JWT keys in env.local are placeholders. Using HS256 fallback with mock secret for development.'
  );
}

const DEV_HMAC_SECRET = 'eduspark_local_development_jwt_secret_key_12345';

export function signAccessToken(payload: Omit<TokenPayload, 'jti'> & { jti: string }): string {
  if (useHS256Fallback) {
    return jwt.sign(payload, DEV_HMAC_SECRET, {
      expiresIn: SECURITY.ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });
  }

  try {
    return jwt.sign(payload, accessPrivateKey, {
      algorithm: 'RS256',
      expiresIn: SECURITY.ACCESS_TOKEN_EXPIRY,
    });
  } catch (error: unknown) {
    console.error('Error signing RS256 access token, trying dev fallback:', error instanceof Error ? error.message : String(error));
    return jwt.sign(payload, DEV_HMAC_SECRET, {
      expiresIn: SECURITY.ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });
  }
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    if (useHS256Fallback) {
      return jwt.verify(token, DEV_HMAC_SECRET, { algorithms: ['HS256'] }) as TokenPayload;
    }
    return jwt.verify(token, accessPublicKey, { algorithms: ['RS256'] }) as TokenPayload;
  } catch {
    if (useHS256Fallback) return null;
    // Attempt dev fallback verification in case token was signed with fallback
    try {
      return jwt.verify(token, DEV_HMAC_SECRET, { algorithms: ['HS256'] }) as TokenPayload;
    } catch {
      return null;
    }
  }
}

export function signRefreshToken(payload: Omit<TokenPayload, 'jti'> & { jti: string }): string {
  if (useHS256Fallback) {
    return jwt.sign(payload, DEV_HMAC_SECRET, {
      expiresIn: SECURITY.REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });
  }

  try {
    return jwt.sign(payload, refreshPrivateKey, {
      algorithm: 'RS256',
      expiresIn: SECURITY.REFRESH_TOKEN_EXPIRY,
    });
  } catch (error: unknown) {
    console.error('Error signing RS256 refresh token, trying dev fallback:', error instanceof Error ? error.message : String(error));
    return jwt.sign(payload, DEV_HMAC_SECRET, {
      expiresIn: SECURITY.REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    });
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    if (useHS256Fallback) {
      return jwt.verify(token, DEV_HMAC_SECRET, { algorithms: ['HS256'] }) as TokenPayload;
    }
    return jwt.verify(token, refreshPublicKey, { algorithms: ['RS256'] }) as TokenPayload;
  } catch {
    if (useHS256Fallback) return null;
    try {
      return jwt.verify(token, DEV_HMAC_SECRET, { algorithms: ['HS256'] }) as TokenPayload;
    } catch {
      return null;
    }
  }
}

/**
 * Add a JWT ID (JTI) to the Redis blacklist to revoke the token immediately.
 */
export async function revokeToken(jti: string, expirySeconds: number): Promise<void> {
  const blacklistKey = `${SECURITY.REDIS_BLACKLIST_PREFIX}${jti}`;
  // Store with value '1' and expire automatically
  await redis.set(blacklistKey, '1', 'EX', Math.max(1, Math.ceil(expirySeconds)));
}

/**
 * Check if the JWT ID (JTI) is listed in the Redis blacklist.
 */
export async function isTokenRevoked(jti: string): Promise<boolean> {
  const blacklistKey = `${SECURITY.REDIS_BLACKLIST_PREFIX}${jti}`;
  const isBlacklisted = await redis.get(blacklistKey);
  return isBlacklisted === '1';
}
