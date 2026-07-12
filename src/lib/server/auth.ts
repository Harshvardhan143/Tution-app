import { headers } from 'next/headers';
import { verifyAccessToken, isTokenRevoked, TokenPayload } from './jwt';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { Role } from '@/config/constants';

/**
 * Extracts the JWT bearer token from the Request headers.
 */
export async function extractTokenFromHeader(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('Authorization') || (await headers()).get('Authorization');
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
}

/**
 * Extracts and verifies the user payload from the request token.
 * Throws UnauthorizedError if token is invalid or blacklisted.
 */
export async function getCurrentUser(req: Request): Promise<TokenPayload> {
  const token = await extractTokenFromHeader(req);
  if (!token) {
    throw new UnauthorizedError('No authentication token provided');
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }

  // Check if token was blacklisted (logged out)
  const isRevoked = await isTokenRevoked(payload.jti);
  if (isRevoked) {
    throw new UnauthorizedError('Token has been revoked or session has ended');
  }

  return payload;
}

/**
 * Ensures the requesting user possesses one of the authorized roles.
 * Throws ForbiddenError if the role doesn't match, or UnauthorizedError if unauthenticated.
 */
export async function requireRole(req: Request, allowedRoles: Role[]): Promise<TokenPayload> {
  const user = await getCurrentUser(req);
  
  if (!allowedRoles.includes(user.role as Role)) {
    throw new ForbiddenError('You are not authorized to access this resource');
  }

  return user;
}
