import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthUserPayload {
  userId: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

/**
 * Extracts and verifies JWT from cookie or Bearer header.
 */
export function extractAuthUser(req: Request): AuthUserPayload | null {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthUserPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Strict authentication middleware: rejects unauthenticated requests.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = extractAuthUser(req);
  if (!user) {
    res.status(401).json({
      success: false,
      error: { message: 'Authentication required. Please log in.', statusCode: 401 },
    });
    return;
  }
  req.user = user;
  next();
}

/**
 * Optional authentication middleware: attaches user if present, otherwise continues as guest.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const user = extractAuthUser(req);
  if (user) {
    req.user = user;
  }
  next();
}
