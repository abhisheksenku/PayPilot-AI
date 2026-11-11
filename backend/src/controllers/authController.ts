import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { config } from '../config/env';
import { extractAuthUser } from '../middleware/authMiddleware';

const COOKIE_NAME = 'token';

function setAuthCookie(res: Response, token: string) {
  const isProd = config.env === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearAuthCookie(res: Response) {
  const isProd = config.env === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}

export class AuthController {
  /**
   * User registration (Signup)
   * POST /api/auth/signup
   */
  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          error: { message: 'Name, email, and password are required.', statusCode: 400 },
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: { message: 'Password must be at least 6 characters long.', statusCode: 400 },
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: normalizedEmail } });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: { message: 'An account with this email already exists.', statusCode: 409 },
        });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      });

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      setAuthCookie(res, token);

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      console.error('[Auth] Error during signup:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to create account. Please try again.', statusCode: 500 },
      });
    }
  }

  /**
   * User authentication (Login)
   * POST /api/auth/login
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: { message: 'Email and password are required.', statusCode: 400 },
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Find user
      const user = await User.findOne({ where: { email: normalizedEmail } });
      if (!user) {
        res.status(401).json({
          success: false,
          error: { message: 'Invalid email or password.', statusCode: 401 },
        });
        return;
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          error: { message: 'Invalid email or password.', statusCode: 401 },
        });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as any }
      );

      setAuthCookie(res, token);

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      console.error('[Auth] Error during login:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Login failed. Please try again.', statusCode: 500 },
      });
    }
  }

  /**
   * Clear session cookie (Logout)
   * POST /api/auth/logout
   */
  public async logout(req: Request, res: Response): Promise<void> {
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }

  /**
   * Get current authenticated user session
   * GET /api/auth/me
   */
  public async me(req: Request, res: Response): Promise<void> {
    try {
      const authPayload = extractAuthUser(req);
      if (!authPayload) {
        res.status(200).json({
          success: false,
          user: null,
        });
        return;
      }

      const user = await User.findByPk(authPayload.userId, {
        attributes: ['id', 'name', 'email', 'createdAt'],
      });

      if (!user) {
        clearAuthCookie(res);
        res.status(200).json({
          success: false,
          user: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error('[Auth] Error in me endpoint:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Failed to verify session.', statusCode: 500 },
      });
    }
  }
}

export const authController = new AuthController();
