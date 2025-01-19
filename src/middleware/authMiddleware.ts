import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Debug logging
    console.log('Full Authorization Header:', req.headers.authorization);
  
    // Extract token correctly
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No authorization header',
        details: 'Authorization header is missing'
      });
    }
  
    // Ensure Bearer token is handled correctly
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        message: 'Invalid authorization header format',
        details: 'Must be in format: Bearer <token>'
      });
    }
  
    const token = parts[1];
  
    try {
      const decoded = verifyToken(token);
  
      if (!decoded) {
        return res.status(401).json({ 
          message: 'Invalid or expired token',
          details: 'Token verification failed'
        });
      }
  
      // Attach user to request
      req.user = {
        studentId: decoded.studentId,
        role: decoded.role
      };
  
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        message: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};