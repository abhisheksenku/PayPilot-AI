import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      cookies?: Record<string, string>;
    }
  }
}

/**
 * Lightweight cookie parsing middleware.
 * Populates req.cookies from the HTTP 'cookie' header.
 */
export function cookieMiddleware(req: Request, res: Response, next: NextFunction): void {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = {};

  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookieStr) => {
      const parts = cookieStr.split('=');
      const name = parts[0]?.trim();
      if (name) {
        const val = parts.slice(1).join('=').trim();
        cookies[name] = decodeURIComponent(val);
      }
    });
  }

  req.cookies = cookies;
  next();
}
