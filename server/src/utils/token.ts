import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthUserPayload } from '../types';

export function generateAccessToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: '7d',
  });
}

export function verifyAccessToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as AuthUserPayload;
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as AuthUserPayload;
  } catch (err) {
    return null;
  }
}
