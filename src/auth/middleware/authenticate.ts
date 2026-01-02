import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../jwt.service';
import { JwtPayload, Role } from '../types';
import logger from '../../utils/logger';

export interface AuthenticatedRequest extends Request {
  jwtPayload?: JwtPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  const token = authHeader.substring(7);
  const payload = jwtService.verifyToken(token);

  if (!payload) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return;
  }

  req.jwtPayload = payload;
  next();
}

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.jwtPayload) {
      res.status(401).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    if (!allowedRoles.includes(req.jwtPayload.role)) {
      logger.warn(`Access denied for user ${req.jwtPayload.email} - required roles: ${allowedRoles.join(', ')}`);
      res.status(403).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    next();
  };
}

