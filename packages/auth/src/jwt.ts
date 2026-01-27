import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from './types';
import { loadAuthConfig } from './config';

export function generateToken(payload: JWTPayload): string {
  const { jwtSecret, jwtExpiresIn } = loadAuthConfig();
  const options: SignOptions = {
    expiresIn: jwtExpiresIn as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload as object, jwtSecret, options);
}

export function verifyToken(token: string): JWTPayload {
  const { jwtSecret } = loadAuthConfig();
  try {
    return jwt.verify(token, jwtSecret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
