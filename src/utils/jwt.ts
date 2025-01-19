import * as jwt from 'jsonwebtoken';
import { environment } from '../config/environment';

export interface JwtPayload {
  studentId: number;
  role: 'student' | 'admin';
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, environment.JWT_SECRET, {
    expiresIn: environment.JWT_EXPIRATION
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    // Detailed logging
    console.log('Verifying token:', token);
    console.log('Secret:', environment.JWT_SECRET);

    const decoded = jwt.verify(token, environment.JWT_SECRET) as JwtPayload;
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (error) {
    // Log specific verification errors
    console.error('Token verification failed:', error);
    return null;
  }
};