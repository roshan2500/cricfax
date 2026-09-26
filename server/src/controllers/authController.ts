import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore } from '../db/store';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { AuthenticatedRequest } from '../middlewares/auth';
import { User } from '../types';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password, full_name, username } = req.body;

    if (!email || !password || !full_name || !username) {
      res.status(400).json({ success: false, error: 'Email, password, full name, and username are required' });
      return;
    }

    const existingUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      res.status(409).json({ success: false, error: 'User with this email or username already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      password_hash,
      full_name,
      username: username.toLowerCase().trim(),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
      bio: '',
      role: 'READER',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.users.push(newUser);

    const tokenPayload = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    memoryStore.refreshTokens.push({
      id: uuidv4(),
      userId: newUser.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      data: {
        user: safeUser,
        accessToken,
      },
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    // Support predefined demo users or bcrypt hash comparison
    let isMatch = false;
    if (user.password_hash) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      // Demo credentials fallback: "password123" or role-based password
      isMatch = password === 'admin123' || password === 'cricket123' || password === 'password123';
    }

    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    memoryStore.refreshTokens.push({
      id: uuidv4(),
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash: _, ...safeUser } = user;
    res.json({
      success: true,
      data: {
        user: safeUser,
        accessToken,
      },
    });
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'Refresh token not found' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      res.status(401).json({ success: false, error: 'Expired or invalid refresh token' });
      return;
    }

    const user = memoryStore.users.find(u => u.id === payload.id);
    if (!user || !user.is_active) {
      res.status(401).json({ success: false, error: 'User no longer active' });
      return;
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  },

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  },

  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthenticated' });
      return;
    }

    const user = memoryStore.users.find(u => u.id === req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const { password_hash: _, ...safeUser } = user;
    res.json({
      success: true,
      data: safeUser,
    });
  },
};
